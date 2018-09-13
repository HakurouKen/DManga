import Chapter from 'crawlers/verydm/chapter';
import { buildChapterDownloadTestCases } from '../test-case-helpers';

describe('Verydm', () => {
  buildChapterDownloadTestCases({
    Ctor: Chapter,
    testUrl: 'http://www.verydm.com/chapter.php?id=15677',
    dir: 'manga/狼与香辛料/番外篇',
    tester: {
      total: 4,
      suffix: '.jpg',
    },
  });
});
