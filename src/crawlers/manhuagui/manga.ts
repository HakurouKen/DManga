import cheerio from 'cheerio';
import BaseManga from '../../base/manga';
import { ChapterInfo } from '../../utils/types';
import { getChapterInfoFromAnchor } from '../../utils/misc';

function getChapters(el: CheerioStatic | CheerioElement): ChapterInfo[] {
  return cheerio(el)
    .find('ul')
    .toArray()
    .reverse()
    .reduce((chapters: ChapterInfo[], ul) => {
      const $chapters = cheerio(ul).find('li a');
      return chapters.concat(
        $chapters
          .toArray()
          .map($chapter => getChapterInfoFromAnchor($chapter, 'https://www.manhuagui.com/')),
      );
    }, []);
}

export default class MangaManhuagui extends BaseManga {
  static identifier = /^https?:\/\/www\.manhuagui\.com\/comic\/\d+\/$/;

  async getInfo() {
    const $ = await this.$();
    const $details = $('.detail-list li').children();
    const $chapterList = $('.chapter-list');

    return {
      name: $('.book-title h1').text(),
      url: this.url,
      authors: $details
        .eq(4)
        .find('a')
        .toArray()
        .map(el => cheerio(el).text()),
      end: !!$('.book-cover .finish').length,
      description: $('#intro-all')
        .text()
        .trim(),
      chapters: getChapters($chapterList.get(0)),
      otherVersions: $chapterList
        .slice(1)
        .toArray()
        .map(chapters => ({
          name: cheerio(chapters)
            .prev('h4')
            .text(),
          chapters: getChapters(chapters),
        })),
    };
  }
}
