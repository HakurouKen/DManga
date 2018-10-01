import cheerio from 'cheerio';
import BaseManga from '../../base/manga';
import { getChapterInfoFromAnchor } from '../../utils/misc';

export default class MangaCcdm1 extends BaseManga {
  static identifier = /^https?:\/\/www\.ccdm1\.com\/manhua\/\d+\/?$/i;

  async getInfo() {
    const $ = await this.$();
    const $details = $('.detail-list li').children();

    return {
      name: $('.book-title h1').text(),
      url: this.url,
      authors: $details
        .eq(3)
        .find('a')
        .toArray()
        .map(el => cheerio(el).text()),
      end: !!$('.book-cover .finish').length,
      description: $('#intro-all')
        .text()
        .trim(),
      chapters: $('.chapter-list li a')
        .toArray()
        .map(el => getChapterInfoFromAnchor(el, 'http://www.ccdm1.com/')),
      otherVersions: [],
    };
  }
}
