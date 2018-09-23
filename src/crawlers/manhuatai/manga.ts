import cheerio from 'cheerio';
import BaseManga from '../../base/manga';
import { getChapterInfoFromAnchor } from '../../utils/misc';
import { ChapterInfo } from '../../utils/types';

const DOMAIN = 'http://www.manhuatai.com';

function getChapters(el: Cheerio | CheerioElement): ChapterInfo[] {
  return cheerio(el)
    .find('li a')
    .toArray()
    .map(anchor => getChapterInfoFromAnchor(anchor, DOMAIN));
}

export default class MangaManhuatai extends BaseManga {
  static identifier = /^http:\/\/www\.manhuatai\.com\/[\w]+\/$/;

  async getInfo() {
    const $ = await this.$();
    const $infos = $('.jshtml ul>li');
    const $description = $('.wz');
    $description.find('a').remove();

    const $tabNavs = $('.bookClass [name="topicTab"]');
    return {
      name:
        $infos
          .eq(0)
          .text()
          .split('：')[1] || '',
      url: this.url,
      authors: $infos
        .eq(2)
        .text()
        .trim()
        .split('：')
        .slice(1),
      end:
        $infos
          .eq(1)
          .text()
          .trim() === '状态：已完结',
      description: $description.text().trim(),
      chapters: getChapters($('#topic1')),
      otherVersions: $('.mhlistbody [name="topiccount"]')
        .slice(1)
        .toArray()
        .map((container, index) => ({
          name: $tabNavs
            .eq(index + 1)
            .text()
            .trim(),
          chapters: getChapters(container),
        })),
    };
  }
}
