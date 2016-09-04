import * as path from 'path';
import * as _request from 'request';
import Promise from 'Bluebird';
import cheerio from 'cheerio';
import * as _mkdirp from 'mkdirp';

const request = Promise.promisifyAll(_request);
const mkdirp = Promise.promisify(_mkdirp.mkdirp);

import { i18n } from 'lib/i18n';
import Picture from './picture';
import { indexPad,NotImplementedError } from 'lib/utils';
import PromiseQueue from 'lib/promise-queue';

PromiseQueue.setup(Promise);

class Chapter {
    constructor(url){
        this.url = url;
    }

    $() {
        return this._$ = this._$ || request.getAsync(this.url).then(resp => {
            if (resp.statusCode !== 200) {
                reject(resp);
                return;
            }
            return cheerio.load(resp.body);
        });
    }

    list(){
        throw new NotImplementedError('list');
    }

    download(folder, thread = 5) {
        let queue = new PromiseQueue(thread);
        let queued = 0;
        let chapterUrl = this.url;
        return Promise.all([
            this.list(),
            mkdirp(folder)
        ]).spread(urls => {
            for ( let url of urls ){
                let extname = path.extname(url);
                let filepath = path.join(folder,indexPad(++queued) + extname);
                let picture = new Picture(url,chapterUrl);
                queue.push(()=>{
                    return picture.download(filepath).catch(e => {
                        console.error(i18n.MESSAGE.ERRORS.DOWNLOAD_FAIL.format(filepath));
                    });
                });
            }
            return new Promise((resolve,reject)=>{
                queue.onClear(()=>{
                    resolve(urls);
                });
            });
        });
    }

    downloadIkanman(folder, thread = 5) {
        let queue = new PromiseQueue(thread);
        let queued = 0;
        let chapterUrl = this.url;
        return Promise.all([
            this.list(),
            mkdirp(folder)
        ]).spread(urls => {
            for ( let url of urls ){
                let extname = path.extname(url);
                let filepath = path.join(folder,indexPad(++queued) + extname);
                let picture = new Picture(url,chapterUrl);
                queue.push(()=>{
                    return picture.download(filepath).catch(e => {
                        console.error(i18n.MESSAGE.ERRORS.DOWNLOAD_FAIL.format(filepath));
                    });
                });
            }
            return new Promise((resolve,reject)=>{
                queue.onClear(()=>{
                    resolve(urls);
                });
            });
        });
    }

}

export default Chapter;
