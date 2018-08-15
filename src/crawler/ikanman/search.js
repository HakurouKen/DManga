import { searchFuncGenerator } from 'lib/crawler/search-util';
import cheerio from 'cheerio';

const URL = 'http://www.ikanman.com/s/{{keyword}}.html';

const search = searchFuncGenerator(URL, function (body) {
  let $ = cheerio.load(body);
  let $books = $('.book-result .cf');
  return $books.map((i, elem) => {
    let $elem = $(elem),
      $cover = $elem.find('.bcover'),
      $detail = $elem.find('.book-detail'),
      $desc = $detail.find('.intro span'),
      $tags = $detail.find('.tags');
    return {
      id: +($cover.attr('href').match(/\/(\d+)\//) || [])[1] || null,
      name: $detail.find('dt a').text().trim(),
      description: ($desc.contents().eq(1).text() || '').replace(/\[$/, '').replace('\s+', ' '),
      end: ($tags.filter('.status').find('span').eq(1).text() || '').indexOf('完结') >= 0,
      author: $tags.eq(2).find('a').text(),
      cover: $cover.find('img').attr('src')
    }
  }).get();
});

export { search };
