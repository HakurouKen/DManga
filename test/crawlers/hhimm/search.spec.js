import Manga from 'crawlers/hhimm/manga';
import search from 'crawlers/hhimm/search';
import { buildMangaSearcherTestCases } from '../test-case-helpers';

describe('hhimm', () => {
  buildMangaSearcherTestCases({
    search,
    keyword: '命运石之门',
    tester: {
      url: Manga.identifier,
    },
  });
});
