import Manga from 'crawlers/manhuagui/manga';
import search from 'crawlers/manhuagui/search';
import { buildMangaSearcherTestCases } from '../test-case-helpers';

describe('hhimm', () => {
  buildMangaSearcherTestCases({
    search,
    keyword: '龙珠',
    tester: {
      url: Manga.identifier,
      authors: true,
      description: true,
    },
  });
});
