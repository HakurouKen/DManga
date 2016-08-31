import Promise from 'Bluebird';
import * as _request from 'request';

const request = Promise.promisifyAll(_request);

function isPromise(o){
    return o instanceof Promise;
}

// cache the search result, return a Promise object.
// Treat the first argument of function as the cache index.
export function cacheWrapper(func,context = this){
    let CACHE = new Map();
    return function(){
        let args = arguments;
        let keyword = arguments[0];
        if (CACHE.has(keyword)) {
            let cache = CACHE.get(keyword);
            if (!isPromise(cache)) {
                return Promise.resolve(cache);
            }

            // retry when the data in cache is rejected.
             let resolved = false;
             return cache.then(ret=>{
                 resolved = true;
                 return ret;
             }).finally(ret => {
                 if (resolved) return ret;
                 let result = func.apply(context,arguments);
                 CACHE.set(keyword,result);
                 return Promise.resolve(result);
             });

        } else {
            let result = func.apply(context,arguments);
            CACHE.set(keyword,result);
            return result;
        }
    }
}

export function searchFuncGenerator(url_format,resolver){
    if (typeof url_format !== 'string') {
        throw Error('Param url_format must be a string.');
    } else if (url_format.indexOf('{{keyword}}') < 0) {
        throw Error('Param url_format must have a {{keyword}} placeholder.');
    }
    let func = function(keyword=''){
        let url = url_format.replace('{{keyword}}',encodeURIComponent(keyword));
        return request.getAsync(url).then(resp => {
            if (resp.statusCode !== 200) {
                return Promise.reject(resp);
            }
            return resp.body;
        }).then(resolver);
    };
    return cacheWrapper(func);
}
