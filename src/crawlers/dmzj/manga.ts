import cheerio from 'cheerio';
import BaseManga from '../../base/manga';
import { getChapterInfoFromAnchor } from '../../utils/misc';
import { MangaInfo } from '../../utils/types';

const DOMAIN = 'https://manhua.dmzj.com';

export default class DmzjManga extends BaseManga {
  async getInfo(): Promise<MangaInfo> {
    const $ = await this.$();
    const name = $('.anim_title_text')
      .text()
      .trim();
    const $infos = $('.anim-main_list table td');
    const $versionContents = $('.photo_part+.cartoon_online_border_other');
    const $versionTitles = $versionContents.next();

    return {
      url: this.url,
      name,
      cover: $('#cover_pic').attr('src'),
      authors: $infos
        .eq(2)
        .find('a')
        .map((i, elem) => {
          const $elem = cheerio(elem);
          return $elem.text().trim();
        })
        .get(),
      end:
        $infos
          .eq(4)
          .text()
          .trim() === '已完结',
      // remove last line ad.
      detail: $('.line_height_content')
        .text()
        .trim()
        .replace(/\n(.*)?$/, ''),
      chapters: $('.cartoon_online_border li a')
        .toArray()
        .map(el => getChapterInfoFromAnchor(el, DOMAIN)),
      otherVersions: $versionTitles.toArray().map((title, i) => {
        const subtitle = cheerio(title)
          .text()
          .trim()
          .split('：')[1] || i + 2;
        return {
          name: `${name} ${subtitle}`,
          chapters: $versionContents
            .eq(i)
            .find('li a')
            .toArray()
            .map(el => getChapterInfoFromAnchor(el, DOMAIN)),
        };
      }),
    };
  }
}
