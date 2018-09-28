import Manga from 'crawlers/ccdm1/manga';
import search from 'crawlers/ccdm1/search';
import { buildMangaSearcherTestCases } from '../test-case-helpers';

describe('ccdm1', () => {
  buildMangaSearcherTestCases({
    search,
    keyword: '我叫坂本',
    only: true,
    tester: {
      url: Manga.identifier,
    },
  });
});
