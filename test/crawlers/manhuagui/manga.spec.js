import Manga from 'crawlers/manhuagui/manga';
import { buildMangaGetInfoTestCases } from '../test-case-helpers';

describe('Manhuagui', () => {
  buildMangaGetInfoTestCases({
    Ctor: Manga,
    testUrl: 'https://www.manhuagui.com/comic/2807/',
    tester: {
      name: '史上最强弟子兼一',
      cover: /\.jpe?g$/,
      authors: ['松江名俊'],
      end: true,
      description: 100,
      chaptersShouldMoreThan: 100,
      custom(info) {
        info.chapters[0].name.should.equal('第583回');
        const otherVersion = info.otherVersions[0];
        otherVersion.name.should.equal('单行本');
        otherVersion.chapters.length.should.gte(1);
      },
    },
  });
});
