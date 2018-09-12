import Manga from 'crawlers/verydm/manga';
import { buildMangaGetInfoTestCases } from '../test-case-helpers';

describe('Verydm', () => {
  buildMangaGetInfoTestCases({
    Ctor: Manga,
    testUrl: 'http://www.verydm.com/manhua/langyuxxl',
    tester: {
      name: '狼与香辛料',
      cover: /\.jpg$/,
      authors: ['小梅系斗'],
      end: true,
    },
  });
});
