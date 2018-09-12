import Manga from 'crawlers/dmzj/manga';
import { buildMangaGetInfoTestCases } from '../test-case-helpers';

describe('Dmzj', () => {
  buildMangaGetInfoTestCases({
    Ctor: Manga,
    testUrl: 'https://manhua.dmzj.com/yiquanchaoren',
    tester: {
      name: '一拳超人',
      authors: ['村田雄介', 'ONE'],
      chaptersShouldMoreThan: 40,
      custom(info) {
        const anotherVersion = info.otherVersions[0];
        anotherVersion.name.should.not.empty();
        anotherVersion.chapters.length.should.gt(0);
      },
    },
  });
});
