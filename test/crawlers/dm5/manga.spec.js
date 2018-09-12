import Manga from 'crawlers/dm5/manga';
import { buildMangaGetInfoTestCases } from '../test-case-helpers';

describe('Dm5', () => {
  buildMangaGetInfoTestCases({
    Ctor: Manga,
    testUrl: 'http://www.dm5.com/manhua-shanchangzhuolongrende-yuan-gaomutongxue/',
    tester: {
      name: '擅长捉弄人的(原)高木同学',
      authors: ['稻叶光史'],
      end: false,
      chaptersShouldMoreThan: 40,
      custom(info) {
        info.otherVersions.length.should.gt(0);
        const anotherVersion = info.otherVersions[0];
        anotherVersion.name.should.equal('番外');
        anotherVersion.chapters.length.should.gt(0);
      },
    },
  });
});
