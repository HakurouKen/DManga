import Manga from 'crawlers/hhimm/manga';
import { buildMangaGetInfoTestCases } from '../test-case-helpers';

describe('Hhimm', () => {
  buildMangaGetInfoTestCases({
    Ctor: Manga,
    testUrl: 'http://www.hhimm.com/manhua/28308.html',
    tester: {
      name: '姐妹家的种种事',
      cover: 'http://img.94201314.net/comicui/28308.JPG',
      end: true,
      authors: ['高野うい'],
      custom(info) {
        info.otherVersions.length.should.equal(1);
        const otherVersion = info.otherVersions[0];
        otherVersion.name.should.not.be.empty();
        otherVersion.chapters.length.should.gte(1);
      },
    },
  });
});
