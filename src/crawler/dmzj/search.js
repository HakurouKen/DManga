import * as _request from 'request';
import Promise from 'Bluebird';

const request = Promise.promisifyAll(_request);

let CACHE = new Map();

const URL = 'http://s.acg.178.com/comicsum/search.php?s={{keyword}}';

function search(keyword=''){
    let url = URL.replace('{{keyword}}',encodeURIComponent(keyword));
    return CACHE.has(keyword) ? Promise.resolve(CACHE.get(keyword)) :
        request.getAsync(url).then(resp =>{
            if (resp.statusCode !== 200) {
                return Promise.reject(resp);
            }
            return (new Function(resp.body + ' ;return g_search_data;'))();
        }).then(infos => {
            return infos.map(info=>{
                return {
                    id: info.comic_py,
                    name: info.name,
                    end: !!info.status,
                    description: info.description.replace('\n',''),
                    author: info.authors,
                    cover: info.cover
                };
            });
        });
}

export default search;
