import cheerio from 'cheerio';
import { MangaSearchInfo } from '../../base/search';
import { fetchDocument } from '../../utils/request';

export default async function searchVeryDm(keyword: string): Promise<MangaSearchInfo[]> {
  const $ = await fetchDocument(
    `http://www.verydm.com/index.php?r=comic%2Fsearch&keyword=${encodeURIComponent(keyword)}`,
  );

  const $items = $('ul.grid-row li');
  return $items.toArray().map((el) => {
    const $el = cheerio(el);
    const $anchor = $el.find('p a');

    return {
      name: $anchor.text(),
      url: $anchor.attr('href'),
    };
  });
}
