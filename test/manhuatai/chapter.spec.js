import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

import Chapter from '../../lib/crawlers/manhuatai/chapter';

describe('Manhuatai', () => {
  describe('Chapter#download', function () {
    const TEST_DIR = 'manga/爆笑校园/第1期';
    beforeEach((done) => {
      rimraf(TEST_DIR, () => {
        done();
      });
    });

    this.timeout(120 * 1e3);

    it('should download the manga chapter', async function () {
      const chapter = new Chapter('http://www.manhuatai.com/baoxiaoxiaoyuan/01.html');
      await chapter.download(path.join(TEST_DIR, '{autoIndex}.jpg'));
      // check the first image
      fs.existsSync(path.join(TEST_DIR, '01.jpg')).should.be.true();
      // check the last image
      fs.existsSync(path.join(TEST_DIR, '08.jpg')).should.be.true();
      // should not contain file that not belongs to this chapter
      fs.existsSync(path.join(TEST_DIR, '09.jpg')).should.be.false();
    });
  });
});
