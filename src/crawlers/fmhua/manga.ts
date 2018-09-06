import BaseManga from '../../base/manga';
import { getChapterInfoFromAnchor } from '../../utils/misc';

export default class FmhuaManga extends BaseManga {
  async getInfo() {
    const $ = await this.$();
    // Some More Codes...
    return {
      name: $('#intro_l .title h1').text(),
      url: this.url,
      cover: `http://mh.fumanhua.net${$('.info_cover img').attr('src')}`,
      authors: [$('.info p')[1].lastChild.nodeValue],
      end: false,
      detail: $('#intro1')
        .text()
        .trim()
        .replace(/收起$/, ''),
      chapters: $('#play_0 li a')
        .toArray()
        .map(el => getChapterInfoFromAnchor(el, 'http://mh.fumanhua.net/')),
      otherVersions: [],
    };
  }
}
