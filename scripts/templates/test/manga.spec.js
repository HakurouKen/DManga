import Manga from 'crawlers/<%= name.capitalized %>/manga';
import { buildMangaGetInfoTestCases } from '../test-case-helpers';

describe('<%= name.capitalized %>', () => {
  buildMangaGetInfoTestCases({
    Ctor: Manga,
    testUrl: 'TEST_URL',
    tester: {
      name: 'MANGA_NAME',
      authors: [],
      end: false,
    },
  });
});
