import Promise from 'Bluebird';

import Manga from 'lib/crawler/manga';
import Chapter from './chapter';

class IkanmanManga extends Manga {
  constructor(id, dest) {
    super(`${IkanmanManga.DOMAIN}/comic/${id}/`, dest);
    this.id = id;
  }

  static get Chapter() {
    return Chapter;
  }

  name() {
    return this._cache.name = this._cache.name ||
      this.$().then($ => {
        return $('.book-title h1').text().trim();
      });
  }

  info() {
    return this._cache.info = this._cache.info ||
      Promise.all([this.$(), this.name()]).spread(($, name) => {
        let $detail = $('.book-detail');
        let $infos = $detail.find('li span');
        let status = $detail.find('.status span').eq(1).text().trim();
        return {
          name: name,
          cover: $('.book-cover .hcover img').attr('src'),
          alias: $infos.eq(5).find('a').map((i, elem) => {
            return $(elem).text().trim();
          }).get(),
          author: $infos.eq(4).find('a').map((i, elem) => {
            return $(elem).text().trim();
          }).get(),
          area: $infos.eq(1).find('a').text(),
          status: status,
          end: status === '已完结',
          category: $infos.eq(3).find('a').map((i, elem) => {
            return $(elem).text().trim();
          }).get(),
          detail: $('#intro-cut').text().trim()
        };
      });
  }

  // generate a callback to get chapter info from a single <a> tag
  _getLinkInfoFn($) {
    const DOMAIN = this.constructor.DOMAIN;
    return function fn(el) {
      let $el = $(el);
      return {
        name: $el.attr('title').trim(),
        href: DOMAIN + $el.attr('href')
      };
    }
  }

  _getIndex($chapterList) {
    return this.$().then($ => {
      let $container = $chapterList.find('ul');
      return $container.toArray().reduce((anchors, list) => {
        return anchors.concat(
          $(list).find('li a').toArray().reverse()
        );
      }, []).map(this._getLinkInfoFn($));
    });
  }

  index() {
    return this._cache.index = this._cache.index ||
      this.$().then($ => {
        return this._getIndex($('.chapter-list').eq(0))
      });
  }

  indexes() {
    let _getIndex = this._getIndex.bind(this);
    return this._cache.indexes = this._cache.indexes ||
      Promise.all([this.$(), this.index(), this.name()]).spread(($, index, name) => {
        let ret = [{
          name: name,
          content: index
        }];
        let restPromises = $('.chapter-list').toArray().slice(1).map((chapterList) => {
          return _getIndex($(chapterList));
        });

        let $titles = $('.chapter h4');
        return Promise.all(restPromises).then(rests => {
          return ret.concat(rests.map((chapter, i) => {
            let chapterName = $titles.eq(i + 1).text().trim();
            return {
              name: name + (chapterName ? (' - ' + chapterName) : ''),
              content: chapter
            };
          }));
        })
      });
  }
}

IkanmanManga.DOMAIN = 'http://www.ikanman.com';

export default IkanmanManga;
