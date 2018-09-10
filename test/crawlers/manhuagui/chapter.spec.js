import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

import Chapter from 'crawlers/manhuagui/chapter';

describe('Manhuagui', () => {
  describe('Chapter#download', function () {
    const TEST_DIR = 'manga/夏娃与夏娃/';
    beforeEach((done) => {
      rimraf(TEST_DIR, () => {
        done();
      });
    });

    this.timeout(120 * 1e3);

    it('should download the manga chapter', async () => {
      const chapter = new Chapter('https://www.manhuagui.com/comic/28966/383759.html');
      await chapter.download(path.join(TEST_DIR, '{autoIndex}.jpg'));
      // check the first image
      fs.existsSync(path.join(TEST_DIR, '01.jpg')).should.be.true();
      // check the last image
      fs.existsSync(path.join(TEST_DIR, '33.jpg')).should.be.true();
      // should not contain file that not belongs to this chapter
      fs.existsSync(path.join(TEST_DIR, '34.jpg')).should.be.false();
    });
  });
});
