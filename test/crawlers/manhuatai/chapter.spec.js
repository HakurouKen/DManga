import Chapter from 'crawlers/manhuatai/chapter';
import { buildChapterDownloadTestCases } from '../test-case-helpers';

describe('Manhuatai', () => {
  buildChapterDownloadTestCases({
    Ctor: Chapter,
    testUrl: 'http://www.manhuatai.com/baoxiaoxiaoyuan/01.html',
    dir: 'manga/爆笑校园/第1期',
    forceSuffix: '.jpg',
    tester: {
      total: 8,
    },
  });
});
