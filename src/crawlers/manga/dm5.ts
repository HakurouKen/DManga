import cheerio from 'cheerio';
import { fetchDom } from '../../utils/request';
import { MangaInfo, ChapterInfo } from '../../utils/types';

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

export default class DM5 {
  url: string;

  private $dom: Promise<Cheerio> | undefined;

  constructor(url: string) {
    this.url = url;
  }

  private $() {
    if (!this.$dom) {
      this.$dom = fetchDom(this.url);
    }
    return this.$dom;
  }

  async getInfo(): Promise<MangaInfo> {
    const $ = await this.$();
    const $container = $.find('.banner_detail');
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
    const $detail = $container.find('.content');
    $detail.find('a').replaceWith('');

    const $titles = $.find('.detail-list-title a.block');
    const $panes = $.find('.detail-list-select');

    return {
      url: this.url,
      name: $name.text().trim(),
      cover: $container.find('.cover img').attr('src'),
      end: status === '已完结',
      authors: $info
        .find('.subtitle a')
        .toArray()
        .map(elem => cheerio(elem)
          .text()
          .trim()),
      detail: $detail.text().trim(),
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
