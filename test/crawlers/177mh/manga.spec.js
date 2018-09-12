import Manga from 'crawlers/177mh/manga';
import { buildMangaGetInfoTestCases } from '../test-case-helpers';

describe('177mh', () => {
  buildMangaGetInfoTestCases({
    Ctor: Manga,
    testUrl: 'https://www.177mh.net/colist_232941.html',
    tester: {
      name: '-舰colle- 官方四格',
      authors: ['桃井凉太'],
      end: false,
      chaptersShouldMoreThan: 100,
    },
  });
});
