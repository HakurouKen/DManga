import Manga from 'crawlers/taduo/manga';
import { buildMangaGetInfoTestCases } from '../test-case-helpers';

describe('Taduo', () => {
  buildMangaGetInfoTestCases({
    Ctor: Manga,
    testUrl: 'http://www.taduo.net/manhua/672/',
    tester: {
      name: '甘城光辉游乐园',
      cover: /\.(jpe?g|png|gif)$/,
      authors: ['贺东招二?图：中岛有华 文：贺东招二'],
      end: false,
      chaptersShouldMoreThan: 1,
    },
  });
});
