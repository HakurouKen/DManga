import Manga from 'crawlers/ccdm1/manga';
import { buildMangaGetInfoTestCases } from '../test-case-helpers';

describe('Ccdm1', () => {
  buildMangaGetInfoTestCases({
    Ctor: Manga,
    testUrl: 'http://www.ccdm1.com/manhua/7437/',
    tester: {
      name: '死亡笔记',
      authors: ['小畑健'],
      end: false,
      chaptersShouldMoreThan: 100,
      custom(info) {
        const chapter = info.chapters[0];
        chapter.name.should.equal('番外');
      },
    },
  });
});
