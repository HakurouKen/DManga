import Chapter from 'crawlers/ccdm1/chapter';
import { buildChapterDownloadTestCases } from '../test-case-helpers';

describe('Ccdm1', () => {
  buildChapterDownloadTestCases({
    Ctor: Chapter,
    testUrl: 'http://www.ccdm1.com/manhua/12796/99673.html',
    dir: 'manga/命运石之门：比翼恋理的爱人',
    tester: {
      total: 27,
    },
  });
});
