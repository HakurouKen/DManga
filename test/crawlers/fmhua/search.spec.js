import Manga from 'crawlers/fmhua/manga';
import search from 'crawlers/fmhua/search';
import { buildMangaSearcherTestCases } from '../test-case-helpers';

describe('hhimm', () => {
  buildMangaSearcherTestCases({
    search,
    keyword: '阿修罗',
    tester: {
      url: Manga.identifier,
      description: true,
    },
  });
});
