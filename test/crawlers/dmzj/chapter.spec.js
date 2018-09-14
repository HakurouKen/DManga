import Chapter from 'crawlers/dmzj/chapter';
import { buildChapterDownloadTestCases } from '../test-case-helpers';

describe('Dmzj', () => {
  buildChapterDownloadTestCases({
    Ctor: Chapter,
    testUrl: 'https://manhua.dmzj.com/lanqiufeiren/43293.shtml',
    dir: 'manga/篮球飞人/全彩版十日谈',
    tester: {
      total: 32,
    },
  });
});
