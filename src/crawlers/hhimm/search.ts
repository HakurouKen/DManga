import cheerio from 'cheerio';
import { MangaSearchInfo } from '../../base/search';
import { fetchDocument } from '../../utils/request';

export default async function searchHhimm(keyword: string): Promise<MangaSearchInfo[]> {
  const $ = await fetchDocument(
    `http://www.hhimm.com/comic/?act=search&st=${encodeURIComponent(keyword)}`,
  );

  const $items = $('.cComicList li a');
  return $items.toArray().map((el) => {
    const $el = cheerio(el);

    return {
      name: $el.text().trim(),
      url: `http://www.hhimm.com${$el.attr('href')}`,
    };
  });
}
