import Manga from 'crawlers/manhuatai/manga';
import search from 'crawlers/manhuatai/search';
import { buildMangaSearcherTestCases } from '../test-case-helpers';

describe('hhimm', () => {
  buildMangaSearcherTestCases({
    search,
    keyword: '宝石',
    tester: {
      url: Manga.identifier,
    },
  });
});
