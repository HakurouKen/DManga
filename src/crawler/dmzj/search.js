import { searchFuncGenerator } from 'lib/crawler/search-util';

const URL = 'http://s.acg.178.com/comicsum/search.php?s={{keyword}}';

const search = searchFuncGenerator(URL, function (body) {
  let infos = (new Function(body + ' ;return g_search_data;'))();
  return infos.map(info => {
    return {
      id: info.comic_py,
      name: info.name,
      end: !!info.status,
      description: info.description.replace('\s+', ' '),
      author: info.authors,
      cover: info.cover
    };
  });
});

export { search };
