import cheerio from 'cheerio';
import { MangaSearchInfo } from '../../base/search';
import { fetchDocument } from '../../utils/request';

export default async function search177mh(keyword: string): Promise<MangaSearchInfo[]> {
  const $ = await fetchDocument(`https://so.177mh.net/k.php?k=${encodeURIComponent(keyword)}`);
  const $items = $('.ar_list_co ul dl');
  return $items.toArray().map((el) => {
    const $el = cheerio(el);
    const $infos = $el.find('.author a');
    return {
      name: $el.find('h1').text(),
      url: $el.find('h1 a').attr('href'),
      end: /完/.test($infos.eq(0).text()),
      authors: $infos
        .eq(1)
        .text()
        .split(/\s+/),
      description: $el.find('.info').text(),
    };
  });
}
