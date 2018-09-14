import Chapter from 'crawlers/177mh/chapter';
import { buildChapterDownloadTestCases } from '../test-case-helpers';

describe('177mh', () => {
  buildChapterDownloadTestCases({
    Ctor: Chapter,
    testUrl: 'https://www.177mh.net/201312/265423.html',
    dir: 'manga/-舰colle- 官方四格/第1话',
    tester: {
      total: 9,
    },
  });
});
