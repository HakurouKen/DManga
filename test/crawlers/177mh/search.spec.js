import Manga from 'crawlers/177mh/manga';
import search from 'crawlers/177mh/search';
import { buildMangaSearcherTestCases } from '../test-case-helpers';

describe('177mh', () => {
  buildMangaSearcherTestCases({
    search,
    keyword: '我叫坂本',
    tester: {
      url: Manga.identifier,
      authors: true,
      description: true,
    },
  });
});
