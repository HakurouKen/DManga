import BaseManga from '../../base/manga';
import { getChapterInfoFromAnchor } from '../../utils/misc';
import { ChapterInfo } from '../../utils/types';

function getChapters(
  $chapters: Cheerio,
  $titles: Cheerio,
  index: number = 0,
): { name: string; chapters: ChapterInfo[] } {
  return {
    name: $titles
      .eq(index)
      .text()
      .trim(),
    chapters: $chapters
      .eq(index)
      .find('li a')
      .toArray()
      .map(el => getChapterInfoFromAnchor(el, 'http://www.hhimm.com/')),
  };
}

export default class MangaHhimm extends BaseManga {
  async getInfo() {
    const $ = await this.$();
    const $infos = $('#about_kit li');
    const $titles = $('.cVolTag');
    const $chapters = $('.cVolUl');

    return {
      name: $infos
        .eq(0)
        .find('h1')
        .text()
        .trim(),
      url: this.url,
      cover: $('#about_style img').attr('src'),
      authors: [
        $infos
          .eq(1)
          .text()
          .replace(/^\s*作者:\s*|\s+$/g, ''),
      ],
      end: /完/.test($infos.eq(2).text()),
      description: $infos
        .last()
        .text()
        .replace(/简介\s+:/, ''),
      chapters: getChapters($chapters, $titles, 0).chapters,
      otherVersions: Array.from({ length: $titles.length - 1 })
        .map((_, index) => getChapters($chapters, $titles, index + 1)),
    };
  }
}
