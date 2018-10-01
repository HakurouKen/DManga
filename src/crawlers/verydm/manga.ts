import cheerio from 'cheerio';
import BaseManga from '../../base/manga';
import { getChapterInfoFromAnchor } from '../../utils/misc';
import { ChapterInfo } from '../../utils/types';

function getChapters(el: Cheerio | CheerioElement): ChapterInfo[] {
  return cheerio(el)
    .find('li a')
    .toArray()
    .map(anchor => getChapterInfoFromAnchor(anchor, 'http://www.verydm.com'))
    .reverse();
}

export default class MangaVerydm extends BaseManga {
  static identifier = /^http:\/\/www\.verydm\.com\/manhua\/\w+\/?$/;

  async getInfo() {
    const $ = await this.$();
    const $infos = $('.detail li');
    const $chapterLists = $('.chapters ul');

    return {
      name: $('.comic-name h1')
        .text()
        .trim(),
      url: this.url,
      authors: $infos
        .eq(0)
        .find('a')
        .toArray()
        .map(el => cheerio(el).text()),
      end: /完/.test($infos.eq(2).text()),
      description: $('#content_wrapper')
        .text()
        .trim(),
      chapters: getChapters($chapterLists.eq(0)),
      otherVersions: $chapterLists
        .slice(1)
        .toArray()
        .map((ul) => {
          const $ul = cheerio(ul);
          return {
            name: $ul.prev().text(),
            chapters: getChapters($ul),
          };
        }),
    };
  }
}
