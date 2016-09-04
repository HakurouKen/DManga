import * as path from 'path';
import * as _request from 'request';
import Promise from 'Bluebird';
import cheerio from 'cheerio';

const request = Promise.promisifyAll(_request);

import { indexPad, NotImplementedErro } from 'lib/utils';
import PromiseQueue from 'lib/promise-queue';
import { IndexError,ChapterError } from './exception';

class Manga {
    constructor(url,dest = Manga.ROOT) {
        this.url = url;
        this._cache = {};
        this.dest = dest;
    }

    // must return a Chapter constructor
    static get Chapter(){
        throw new NotImplementedError('Chapter');
    }

    $(){
        return this._cache.$ = this._cache.$ ||
            request.getAsync(this.url).then(resp => {
                if (resp.statusCode !== 200) {
                    return Promise.reject(resp);
                }
                return cheerio.load(resp.body);
            });
    }

    // get the basic info of manga.
    info(){
        throw new NotImplementedError('info');
    }

    // get the main index of manga
    index(){
        throw new NotImplementedError('index');
    }

    // get the list of index of manga
    indexes(){
        throw new NotImplementedError('indexes');
    }

    // download a single chapter by chapterIndex and listIndex
    _downloadChapter(chapter,index=0) {
        const Chapter = this.constructor.Chapter;
        return Promise.all([
            this.indexes(), this.name()
        ]).spread((indexes,name) => {
            let listInfo = indexes[index];
            if (!listInfo) return Promise.reject(new IndexError());
            let info = listInfo.content[chapter];
            if (!info) return Promise.reject(new ChapterError());

            let downloader = new Chapter(info.href);

            return downloader.download(
                path.join(this.dest,name,indexPad(chapter+1) + ' - ' + info.name)
            );
        });
    }

    download(chapter=null,index=0) {
        let self = this;
        return this.indexes().then((indexes) => {
            if (chapter != null) {
                return this._downloadChapter(+chapter,index);
            } else {
                return new Promise((resolve,reject) => {
                    if (index >= indexes.length) {
                        reject(new IndexError());
                        return;
                    }
                    let queue = new PromiseQueue(1);
                    let list = indexes[index].content;
                    for (let i = 0; i < list.length; i++) {
                        queue.push(((i) => {
                            return function(){
                                return self._downloadChapter(i,index);
                            };
                        })(i));
                    }
                    queue.onClear(resolve);
                });
            }
        }).catch(err => {
            if (err instanceof IndexError || err instanceof ChapterError) {
                console.error(err.message);
            } else {
                console.error(err);
            }
        });
    }
}

Manga.ROOT = 'manga';

export default Manga;
