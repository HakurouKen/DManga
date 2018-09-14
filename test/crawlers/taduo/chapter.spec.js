import Chapter from 'crawlers/taduo/chapter';
import { buildChapterDownloadTestCases } from '../test-case-helpers';

describe('Taduo', () => {
  buildChapterDownloadTestCases({
    Ctor: Chapter,
    testUrl: 'http://www.taduo.net/manhua/672/47024.html',
    dir: 'manga/甘城光辉游乐园/1-1',
    tester: {
      suffix: '.jpg',
      total: 24,
    },
  });
});
