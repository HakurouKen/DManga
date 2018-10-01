import BaseManga from '../../base/manga';
import { getChapterInfoFromAnchor } from '../../utils/misc';

export default class MangaFmhua extends BaseManga {
  static identifier = /^http:\/\/mh\.fumanhua\.net\/manhua\/\d+\/$/;

  async getInfo() {
    const $ = await this.$();

    return {
      name: $('#intro_l .title h1').text(),
      url: this.url,
      authors: [$('.info p')[1].lastChild.nodeValue],
      end: false,
      description: $('#intro1')
        .text()
        .trim()
        .replace(/收起$/, ''),
      chapters: $('#play_0 li a')
        .toArray()
        .map(el => getChapterInfoFromAnchor(el, 'http://mh.fumanhua.net/'))
        .reverse(),
      otherVersions: [],
    };
  }
}
