import cheerio from 'cheerio';
import { searchFuncGenerator } from 'lib/crawler/search-util';

const URL = 'http://www.dm5.com/search?title={{keyword}}&language=1'
const ID_MATCHER = /manhua-(.*?)\//;

const search = searchFuncGenerator(URL,function(body){
    let $ = cheerio.load(body);
    let $items = $('.midBar .item');
    return $items.map((i,item) => {
        let $item = $(item);
        let $title = $item.find('.title');
        let $values = $item.find('.value');
        return {
            id: (($title.attr('href') || '').match(ID_MATCHER) || [])[1],
            name: $title.text().trim(),
            end: $item.find('.date span').text().indexOf('完结') >= 0,
            description: $values.last().text(),
            author: $values.eq(0).text().trim(),
            cover: $item.find('dl img').attr('src') || ''
        };
    }).get();
});

export { search };
