import Manga from 'crawlers/manhuatai/manga';
import { buildMangaGetInfoTestCases } from '../test-case-helpers';

describe('Manhuatai', () => {
  buildMangaGetInfoTestCases({
    Ctor: Manga,
    testUrl: 'http://www.manhuatai.com/baoxiaoxiaoyuan/',
    tester: {
      name: '爆笑校园',
      authors: ['漫画世界 朱斌'],
      end: false,
      chaptersShouldMoreThan: 5,
      custom(info) {
        // other versions of manga
        info.otherVersions.length.should.gt(0);
        const anotherVersion = info.otherVersions[0];
        anotherVersion.name.should.not.empty();
        anotherVersion.chapters.length.should.gt(0);
      },
    },
  });
});
