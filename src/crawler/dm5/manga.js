import * as path from 'path';
import Promise from 'Bluebird';

import Manga from 'lib/crawler/manga';
import Chapter from './chapter';

class Dm5Manga extends Manga {
    constructor(id,dest) {
        super(`${Dm5Manga.DOMAIN}/manhua-${id}/`,dest);
        this.id = id;
    }

    static get Chapter(){
        return Chapter;
    }

    name() {
        return this._cache.name = this._cache.name ||
            this.$().then($ => {
                return $('#mhinfo .new_h2').text().trim();
            });
    }

    info() {
        return this._cache.info = this._cache.info ||
            Promise.all([this.$(),this.name()]).spread(($,name) => {
                let $container = $('#mhinfo');
                let $infos = $container.find('.red_lj').eq(0).find('span');
                let status = $infos.eq(6).text().split('：')[1] || '';
                let $detail = $container.find('.red_lj').eq(1).find('p');
                $detail.find('a').replaceWith('');
                return {
                    name: name,
                    cover: $container.find('img').attr('src'),
                    status: status,
                    end: status === '已完结',
                    author: $infos.eq(2).find('a').map((i,elem)=>{
                        return $(elem).text().trim();
                    }).get(),
                    area: $infos.eq(1).find('a').text().trim(),
                    category: $infos.eq(4).find('a').text().trim(),
                    detail: $detail.text().trim()
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
            let $container = $('[id^=cbc_]').find('li a');
            return $container.map(this._getLinkInfoFn($)).get().reverse();
        });
    }

    indexes() {
        return this._cache.indexes = this._cache.indexes ||
            Promise.all([this.index(),this.name()]).spread((index,name) => {
                return [{
                    title: name,
                    content: index
                }];
            });
    }
}

Dm5Manga.DOMAIN = 'http://www.dm5.com';

export default Dm5Manga;
