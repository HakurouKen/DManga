import cheerio from 'cheerio';
import { URLEncode, request } from '../../utils/request';
import { MangaSearchInfo } from '../../base/search';

export default async function searchTaduo(keyword: string): Promise<MangaSearchInfo[]> {
  const response = await request('http://www.taduo.net/e/search/index.php', 'POST')
    .send(
      `orderby=1&myorder=1&tbname=mh&tempid=3&show=title%2Cplayer%2Cplayadmin%2Cbieming%2Cpinyin&keyboard=${URLEncode(
        keyword,
        'gb2312',
      )}&Submit=%CB%D1%CB%F7%C2%FE%BB%AD`,
    )
    .charset();

  const $ = cheerio.load(response.text);
  const $items = $('#dmList li');

  return $items.toArray().map((el) => {
    const $el = cheerio(el);
    const $anchor = $el.find('dt a');
    return {
      name: $anchor.text(),
      url: `http://www.taduo.net${$anchor.attr('href')}`,
      description: $el
        .find('.intro')
        .text()
        // eslint-disable-next-line no-irregular-whitespace
        .replace(/^简　介：/, ''),
    };
  });
}
