import * as path from 'path';
import * as _request from 'request';
import Promise from 'Bluebird';

const request = Promise.promisifyAll(_request);

import Manga from 'lib/crawler/manga';
import Chapter from './chapter';
import PromiseQueue from 'lib/promise-queue';
import { indexPad } from 'lib/utils';
import { IndexError,ChapterError } from 'lib/crawler/exception';

class DmzjManga extends Manga {
    constructor(id,dest) {
        super(`${DmzjManga.DOMAIN}/${id}/`);
        this.id = id;
    }

    static get Chapter(){
        return Chapter;
    }

    name() {
        return this._cache.name = this._cache.name ||
            this.$().then($ => {
                return $('.anim_title_text').text().trim();
            });
    }

    info() {
        return this._cache.info = this._cache.info ||
            Promise.all([this.$(),this.name()]).spread(($,name) => {
                let $td = $('.anim-main_list table td');
                let whitespacePattern = /\s+/;
                let aliasRawText = $td.eq(0).text().trim();
                let status = $td.eq(4).text().trim();
                return {
                    name: name,
                    cover: $('#cover_pic').attr('src'),
                    alias: aliasRawText ? aliasRawText.split(',') : [],
                    originalName: $td.eq(1).text(),
                    author: $td.eq(2).find('a').map((i,elem)=>{
                        return $(elem).text().trim();
                    }).get(),
                    area: $td.eq(3).text(),
                    status: status,
                    end: status === '已完结',
                    theme: $td.eq(6).text().trim().split(whitespacePattern),
                    category: $td.eq(7).text(),
                    // replace the ad in last line.
                    detail: $('.line_height_content').text().trim().replace(/\n(.*)?$/,'')
                };
            });
    }

    // generate a callback to get chapter info from a single <a> tag
    _getLinkInfoFn($) {
        const DOMAIN = this.constructor.DOMAIN;
        return function fn(_,el){
            let $el = $(el);
            return {
                name: $el.text().trim(),
                href: DOMAIN + $el.attr('href')
            };
        }
    }

    index() {
        return this._cache.index = this._cache.index ||
        this.$().then($ => {
            let $container = $('.cartoon_online_border li a');
            return $container.map(this._getLinkInfoFn($)).get();
        });
    }

    indexes() {
        return this._cache.indexes = this._cache.indexes ||
            Promise.all([this.$(),this.index(),this.name()]).spread(($,index,name) => {
                let $contents = $('.photo_part+.cartoon_online_border_other');
                let $titles = $contents.prev();
                let ret = [{
                    title: name,
                    content: index
                }];
                $titles.each((i,el)=>{
                    let subtitle = $(el).text().trim().split('：')[1] || (i+2);
                    ret.push({
                        title: name + ' ' + subtitle,
                        content: $contents.eq(i).find('li a')
                                    .map(this._getLinkInfoFn($)).get()
                    });
                });
                return ret;
            });
    }
}

DmzjManga.DOMAIN = 'http://manhua.dmzj.com';

export default DmzjManga;
