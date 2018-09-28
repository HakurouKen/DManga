import cheerio from 'cheerio';
import { MangaSearchInfo } from '../../base/search';
import { fetchDocument } from '../../utils/request';

export default async function searchHhimm(keyword: string): Promise<MangaSearchInfo[]> {
  const $ = await fetchDocument(`https://www.manhuagui.com/s/${encodeURIComponent(keyword)}.html`);

  const $items = $('.book-result li');
  return $items.toArray().map((el) => {
    const $el = cheerio(el);
    const $anchor = $el.find('.book-detail dt a');
    const $tags = $el.find('.tags');
    const status = $tags
      .eq(0)
      .text()
      .split('。')[0];
    return {
      name: $anchor.text(),
      url: `http://www.manhuagui.com${$anchor.attr('href')}`,
      end: /完/.test(status),
      authors: $tags
        .eq(2)
        .find('a')
        .toArray()
        .map(author => cheerio(author).text()),
      description: $el
        .find('.intro')
        .text()
        .replace(/^简介：\s+|\[详情\]$/, ''),
    };
  });
}
