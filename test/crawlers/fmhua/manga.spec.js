import Manga from 'crawlers/fmhua/manga';
import { buildMangaGetInfoTestCases } from '../test-case-helpers';

describe('Fmhua', () => {
  buildMangaGetInfoTestCases({
    Ctor: Manga,
    testUrl: 'http://mh.fumanhua.net/manhua/10562/',
    tester: {
      name: '我叫坂本我最屌',
      authors: ['佐野菜见'],
      description: /屌/,
      chaptersShouldMoreThan: 20,
    },
  });
});
