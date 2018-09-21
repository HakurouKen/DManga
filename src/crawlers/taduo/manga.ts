import BaseManga from '../../base/manga';
import { getChapterInfoFromAnchor } from '../../utils/misc';

const DOMAIN = 'http://www.taduo.net/';

export default class MangaTaduo extends BaseManga {
  static identifer = /^http:\/\/www\.taduo\.net\/manhua\/\d+\/$/;

  async getInfo() {
    const $ = await this.$();
    const $infos = $('.detailInfo ul li');

    return {
      name: $('.titleInfo h1').text(),
      url: this.url,
      cover: $('.info_cover img').attr('src'),
      authors: [
        $infos
          .eq(1)
          .text()
          .replace(/^作者：\s*/, ''),
      ],
      end: $('.titleInfo span').text() !== '连载',
      description: $('#intro1')
        .text()
        .trim(),
      chapters: $('#play_0 li a')
        .toArray()
        .map(el => getChapterInfoFromAnchor(el, DOMAIN)),
      otherVersions: [],
    };
  }
}
