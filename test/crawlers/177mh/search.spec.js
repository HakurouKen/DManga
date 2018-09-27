import search from 'crawlers/177mh/search';
import { buildMangaSearcherTestCases } from '../test-case-helpers';

describe('177mh', () => {
  buildMangaSearcherTestCases({
    search,
    keyword: '我叫坂本',
  });
});
