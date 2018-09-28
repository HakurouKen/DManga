import cheerio from 'cheerio';
import { MangaSearchInfo } from '../../base/search';
import { fetchDocument } from '../../utils/request';

export default async function searchCcdm1(keyword: string): Promise<MangaSearchInfo[]> {
  const $ = await fetchDocument(`http://www.ccdm1.com/Search/Keyword/${encodeURIComponent(keyword)}`);
  const $items = $('#contList li');
  return $items.toArray().map((el) => {
    const $el = cheerio(el);
    const $anchor = $el.find('.ell a');
    return {
      name: $anchor.text(),
      url: `http://www.ccdm1.com${$anchor.attr('href')}`,
      end: !!$el.find('.fd').length,
    };
  });
}
