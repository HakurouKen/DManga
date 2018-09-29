import cheerio from 'cheerio';
import { URLEncode, fetchDocument } from '../../utils/request';
import { MangaSearchInfo } from '../../base/search';

export default async function searchFmhua(keyword: string): Promise<MangaSearchInfo[]> {
  const $ = await fetchDocument(
    `http://mh.fumanhua.net/search.asp?key=${URLEncode(keyword, 'gb2312')}`,
  );

  const $items = $('.dmList li');
  return $items.toArray().map((el) => {
    const $el = cheerio(el);
    const $anchor = $el.find('dt a');
    const $infos = $el.find('dd p');

    return {
      name: $anchor.text(),
      url: `http://mh.fumanhua.net${$anchor.attr('href')}`,
      end: /完/.test($infos.eq(1).text()),
      description: $el
        .find('.intro')
        .text()
        // eslint-disable-next-line no-irregular-whitespace
        .replace(/^简　介：/, ''),
    };
  });
}
