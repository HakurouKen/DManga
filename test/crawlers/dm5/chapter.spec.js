import Chapter from 'crawlers/dm5/chapter';
import { buildChapterDownloadTestCases } from '../test-case-helpers';

describe('Dm5', () => {
  buildChapterDownloadTestCases({
    Ctor: Chapter,
    testUrl: 'http://www.dm5.com/m503087/',
    dir: 'manga/擅长捉弄人的(原)高木同学/第1话/',
    tester: {
      total: 9,
    },
  });
});
