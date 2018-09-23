import cheerio from 'cheerio';
import BaseManga from '../../base/manga';
import { ChapterInfo } from '../../utils/types';

const DOMAIN = 'http://www.dm5.com';

function getChapters($container: Cheerio): ChapterInfo[] {
  const $els = $container.find('li a');
  if ($els.eq(0).find('.info .title').length) {
    return $els.toArray().map((el) => {
      const $el = cheerio(el);
      return {
        name: $el
          .find('.title')
          .first()
          .text()
          .trim(),
        url: `${DOMAIN}${$el.attr('href')}`,
      };
    });
  }

  return $els
    .toArray()
    .map((el) => {
      const $el = cheerio(el);
      return {
        name: $el
          .contents()
          .first()
          .text()
          .trim(),
        url: `${DOMAIN}${$el.attr('href')}`,
      };
    })
    .reverse();
}

export default class MangaDm5 extends BaseManga {
  static identifier = /^https?:\/\/www\.dm5\.com\/manhua-/;

  async getInfo() {
    const $ = await this.$();
    const $container = $('.banner_detail');
    const $info = $container.find('.info');
    const $name = $info
      .find('.title')
      .contents()
      .first();
    const status = (
      $info
        .find('.tip .block')
        .eq(0)
        .text()
        .split('：')[1] || ''
    ).trim();
    const $description = $container.find('.content');
    $description.find('a').replaceWith('');

    const $titles = $('.detail-list-title a.block');
    const $panes = $('.detail-list-select');

    return {
      url: this.url,
      name: $name.text().trim(),
      end: status === '已完结',
      authors: $info
        .find('.subtitle a')
        .toArray()
        .map(elem => cheerio(elem)
          .text()
          .trim()),
      description: $description.text().trim(),
      chapters: getChapters($panes.eq(0)),
      otherVersions: $panes
        .slice(1)
        .toArray()
        .map((pane, index) => {
          const $versionName = $titles
            .eq(index + 1)
            .contents()
            .first();

          return {
            name: $versionName.text().trim(),
            chapters: getChapters(cheerio(pane)),
          };
        }),
    };
  }
}
