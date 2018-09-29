import Manga from 'crawlers/taduo/manga';
import search from 'crawlers/taduo/search';
import { buildMangaSearcherTestCases } from '../test-case-helpers';

describe('hhimm', () => {
  buildMangaSearcherTestCases({
    search,
    keyword: '时空',
    tester: {
      url: Manga.identifier,
      description: true,
    },
  });
});
