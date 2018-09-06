import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

import Chapter from '../../lib/crawlers/fmhua/chapter';

describe('Fmhua', () => {
  describe('Chapter#download', function () {
    const TEST_DIR = 'manga/龙珠超/第1话';
    beforeEach((done) => {
      rimraf(TEST_DIR, () => {
        done();
      });
    });

    this.timeout(120 * 1e3);

    it.only('should download the manga chapter', async () => {
      const chapter = new Chapter('http://mh.fumanhua.net/manhua/12198/290094.html');
      await chapter.download(path.join(TEST_DIR, '{autoIndex}{suffix}'));
      // check the first image
      fs.existsSync(path.join(TEST_DIR, '01.jpg')).should.be.true();
      // check the last image
      fs.existsSync(path.join(TEST_DIR, '16.jpg')).should.be.true();
      // should not contain file that not belongs to this chapter
      fs.existsSync(path.join(TEST_DIR, '17jpg')).should.be.false();
    });
  });
});
