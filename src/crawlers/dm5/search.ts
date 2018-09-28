import cheerio from 'cheerio';
import { MangaSearchInfo } from '../../base/search';
import { fetchDocument } from '../../utils/request';

export default async function searchDm5(keyword: string): Promise<MangaSearchInfo[]> {
  const $ = await fetchDocument(
    `http://www.dm5.com/search?title=${encodeURIComponent(keyword)}&language=1`,
  );
  const $first = $('.banner_detail_form .info');
  const $firstAnchor = $first.find('.title a');
  const first = {
    name: $firstAnchor.text(),
    url: `http://www.dm5.com${$firstAnchor.attr('href')}`,
    end: /完/.test(
      $first
        .find('.tip .block')
        .eq(0)
        .text(),
    ),
    authors: $first
      .find('.subtitle a')
      .text()
      .trim()
      .split(/\s+/),
    description: $first
      .find('.content')
      .text()
      .trim(),
  };

  const items = $('.mh-list .mh-item .mh-item-tip').toArray();
  const infos = items.map((el) => {
    const $el = cheerio(el);
    const $title = $el.find('.title a');
    return {
      name: $title.text(),
      url: `http://www.dm5.com${$title.attr('href')}`,
      end: /完/.test(
        $el
          .find('.chapter>span')
          .eq(0)
          .text(),
      ),
      authors: $el
        .find('.author a')
        .toArray()
        .map(author => cheerio(author).text()),
      description: $el
        .find('.desc')
        .text()
        .trim(),
    };
  });

  return [first].concat(infos);
}
