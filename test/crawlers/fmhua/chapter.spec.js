import Chapter from 'crawlers/fmhua/chapter';
import { buildChapterDownloadTestCases } from '../test-case-helpers';

describe('Fmhua', () => {
  buildChapterDownloadTestCases({
    Ctor: Chapter,
    testUrl: 'http://mh.fumanhua.net/manhua/12198/290094.html',
    dir: 'manga/龙珠超/第1话',
    tester: {
      total: 16,
    },
  });
});
