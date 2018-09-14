import Chapter from 'crawlers/manhuagui/chapter';
import { buildChapterDownloadTestCases } from '../test-case-helpers';

describe('Manhuagui', () => {
  buildChapterDownloadTestCases({
    Ctor: Chapter,
    testUrl: 'https://www.manhuagui.com/comic/28966/383759.html',
    dir: 'manga/夏娃与夏娃/',
    forceSuffix: '.jpg',
    tester: {
      total: 33,
    },
  });
});
