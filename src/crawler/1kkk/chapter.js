import * as path from 'path';
import * as _request from 'request';
import Promise from 'Bluebird';
import cheerio from 'cheerio';
import * as _mkdirp from 'mkdirp';
import {parse as urlparse} from 'url';

const request = Promise.promisifyAll(_request);
const mkdirp = Promise.promisify(_mkdirp.mkdirp);

import Picture from 'lib/crawler/picture';
import Chapter from 'lib/crawler/chapter';
import { indexPad } from 'lib/utils';
import PromiseQueue from 'lib/promise-queue';

PromiseQueue.setup(Promise);

const CID_REGEXP = /(\d+)\/?$/;

class OnekkkChapter extends Chapter {
    constructor(url,name) {
        url = url.endsWith('/') ? url : (url + '/');
        super(url,name);
        let cid = (url.match(CID_REGEXP) || [])[1];
        if (!cid) {
            throw new Error('Url invalid.');
        }
        this.cid = cid;
    }

    total() {
        const COUNT_REGEXP = /DM5_IMAGE_COUNT/;
        return this._total = this._total || this.$().then($ => {
            let scripts = $('script').toArray();
            for (let script of scripts) {
                let $el = $(script);
                if (!$el.attr('src')) {
                    let html = $el.html();
                    if (COUNT_REGEXP.test(html)) {
                        let count = +(html.match(/imagecount\s?=\s?(\d+)/) || [])[1];
                        return count || 0;
                    }
                }
            }
            return 0;
        });
    }

    _getImages(curPage=1) {
        let maxcount = this.constructor.IMAGE_REQUEST_SLICE;
        let pageUrl = this.url;
        let baseUrl = `${pageUrl}${this.constructor.IMAGE_REQUEST_URL}?maxcount=${maxcount}&key=&cid=${this.cid}`;

        return request.getAsync(baseUrl + '&page=' + curPage,{
            headers: {
                'Referer': pageUrl
            }
        }).then(resp => {
            if (resp.statusCode !== 200) {
                return Promise.reject(resp);
            }
            return resp.body;
        }).then(code => {
            let imgs = (new Function(code + 'return d;'))();
            return imgs;
        });
    }

    list() {
        let _getImages = this._getImages.bind(this);

        return this._list = this._list || this.total().then(total => {
            let curPage = 1;
            let ret = [];
            function getImages(){
                return _getImages(curPage).then(imgs => {
                    curPage += imgs.length;
                    ret = ret.concat(imgs);
                    if (curPage <= total) {
                        return getImages();
                    } else {
                        return Promise.resolve(ret);
                    }
                })
            }

            return getImages(curPage);
        });
    }

    download(folder, thread = 5) {
        let _getImages = this._getImages.bind(this);
        let referer = this.url;

        return Promise.all([
            this.total(),
            mkdirp(folder)
        ]).spread((total,_) => {
            let curPage = 1;
            let ret = [];
            let queue = new PromiseQueue(thread);

            function getImages(){
                return _getImages(curPage).then(imgs => {
                    ret = ret.concat(imgs);
                    if (curPage <= total) {
                        for (let img of imgs) {
                            let picture = new Picture(img,referer);
                            queue.push(((curPage) => {
                                return function () {
                                    return picture.download(
                                        path.join(
                                            folder,
                                            indexPad(curPage) + path.extname(urlparse(img).pathname)
                                        )
                                    );
                                };
                            })(curPage));
                            curPage++;
                        }
                        return getImages();
                    } else {
                        return Promise.resolve(ret);
                    }
                })
            }

            getImages(curPage);
            return new Promise((resolve,reject) => {
                queue.onClear(() => {
                    if (curPage >= total) {
                        resolve(ret);
                    }
                });
            });
        });
    }
}

OnekkkChapter.IMAGE_REQUEST_SLICE = 20;
OnekkkChapter.IMAGE_REQUEST_URL = 'imagefun.ashx';

export default OnekkkChapter;
