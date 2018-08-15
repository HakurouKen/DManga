import * as path from 'path';
import Promise from 'Bluebird';

import Manga from 'lib/crawler/manga';
import Chapter from './chapter';

class OnekkkManga extends Manga {
  constructor(id, dest) {
    super(`${OnekkkManga.DOMAIN}/manhua${id}/`, dest);
    this.id = id;
  }

  static get Chapter() {
    return Chapter;
  }

  name() {
    return this._cache.name = this._cache.name ||
      this.$().then($ => {
        return $('.main .sy_k21 h1').text().trim();
      });
  }

  info() {
    return this._cache.info = this._cache.info ||
      Promise.all([this.$(), this.name()]).spread(($, name) => {
        let $infos = $('.main ul.sy_k22 li');
        let status = $infos.eq(1).children().text().trim();
        return {
          name: name,
          cover: $('.sy_k1 img').attr('src'),
          status: status,
          end: status === '已完结',
          author: $infos.eq(2).find('a').text().trim(),
          area: $infos.eq(3).find('a').text().trim(),
          category: $infos.eq(4).find('a').text().trim(),
          detail: $infos.last().contents().eq(1).text().trim()
        };
      });
  }

  // generate a callback to get chapter info from a single <a> tag
  _getLinkInfoFn($) {
    const DOMAIN = this.constructor.DOMAIN;
    return function fn(_, el) {
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
        let $container = $('ul.cplist_ullg').last().find('li a');
        return $container.map(this._getLinkInfoFn($)).get();
      });
  }

  indexes() {
    return this._cache.indexes = this._cache.indexes ||
      Promise.all([this.index(), this.name()]).spread((index, name) => {
        return [{
          title: name,
          content: index
        }];
      });
  }
}

OnekkkManga.DOMAIN = 'http://www.1kkk.com';

export default OnekkkManga;
