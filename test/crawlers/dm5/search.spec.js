import Manga from 'crawlers/dm5/manga';
import search from 'crawlers/dm5/search';
import { buildMangaSearcherTestCases } from '../test-case-helpers';

describe('dm5', () => {
  buildMangaSearcherTestCases({
    search,
    keyword: '史莱姆',
    tester: {
      url: Manga.identifier,
      authors: true,
      description: true,
    },
  });
});
