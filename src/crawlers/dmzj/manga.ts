import cheerio from 'cheerio';
import BaseManga from '../../base/manga';
import { getChapterInfoFromAnchor } from '../../utils/misc';

const DOMAIN = 'https://manhua.dmzj.com';

export default class MangaDmzj extends BaseManga {
  static identifier = /^https?:\/\/manhua\.dmzj\.com\/[\w-]+\/?$/;

  async getInfo() {
    const $ = await this.$();
    const name = $('.anim_title_text')
      .text()
      .trim();
    const $infos = $('.anim-main_list table td');
    const $versionContents = $('.photo_part+.cartoon_online_border_other');
    const $versionTitles = $versionContents.prev();

    return {
      url: this.url,
      name,
      authors: $infos
        .eq(2)
        .find('a')
        .map((_, elem) => {
          const $elem = cheerio(elem);
          return $elem.text().trim();
        })
        .get(),
      end:
        $infos
          .eq(4)
          .text()
          .trim() === '已完结',
      description: $('.line_height_content')
        .text()
        // remove ads.
        .replace(/欢迎在动漫之家漫画网观看([\s\S]+)$/, '')
        .trim(),
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
