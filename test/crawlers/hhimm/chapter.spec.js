import Chapter from 'crawlers/hhimm/chapter';
import { buildChapterDownloadTestCases } from '../test-case-helpers';

describe('Hhimm', () => {
  buildChapterDownloadTestCases({
    Ctor: Chapter,
    testUrl: 'http://www.hhimm.com/cool211984/1.html?s=2',
    dir: 'manga/姐妹家的种种事',
    tester: {
      total: 18,
    },
  });
});
