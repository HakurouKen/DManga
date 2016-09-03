import { searchFuncGenerator } from 'lib/crawler/search-util';
import cheerio from 'cheerio';

const URL = 'http://www.1kkk.com/search?title={{keyword}}';
const ID_MATCHER = /manhua(\d+)\//;

const search = searchFuncGenerator(URL,function(body){
    let $ = cheerio.load(body);
    let DESC_START = /^简介：/;
    return $('.main .kk2 ul').toArray().slice(1).map(elem => {
        let $elem = $(elem);
        let $cell = $elem.find('li');
        let $link = $elem.find('a.a_comicname');
        let id = ($link.attr('href').match(ID_MATCHER) || [])[1];
        id = +id || null;
        let $tk = $('#tk_'+id);

        return {
            id: id,
            name: $link.text().trim(),
            description: $tk.find('.tk_04').text().trim().replace(DESC_START,'').replace('\s+',' '),
            author: $cell.eq(1).text().trim().replace(/\s+/,' '),
            cover: $elem.find('img.a_comicname').attr('src')
        }
    });
});

export { search };
