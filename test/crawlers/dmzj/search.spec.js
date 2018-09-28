import Manga from 'crawlers/dmzj/manga';
import search from 'crawlers/dmzj/search';
import { buildMangaSearcherTestCases } from '../test-case-helpers';

describe('dmzj', () => {
  buildMangaSearcherTestCases({
    search,
    keyword: '星期一',
    tester: {
      url: Manga.identifier,
      authors: true,
      description: true,
    },
  });
});
