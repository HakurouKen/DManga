import Manga from 'crawlers/verydm/manga';
import search from 'crawlers/verydm/search';
import { buildMangaSearcherTestCases } from '../test-case-helpers';

describe('hhimm', () => {
  buildMangaSearcherTestCases({
    search,
    keyword: '灌篮高手',
    tester: {
      url: Manga.identifier,
    },
  });
});
