import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

import Chapter from 'crawlers/177mh/chapter';

describe('177mh', () => {
  describe('Chapter#download', function () {
    const TEST_DIR = 'manga/-舰colle- 官方四格/第1话';
    beforeEach((done) => {
      rimraf(TEST_DIR, () => {
        done();
      });
    });

    this.timeout(120 * 1e3);

    it('should download the manga chapter', async () => {
      const chapter = new Chapter('https://www.177mh.net/201312/265423.html');
      await chapter.download(path.join(TEST_DIR, '{autoIndex}{suffix}'));
      // check the first image
      fs.existsSync(path.join(TEST_DIR, '01.jpg')).should.be.true();
      // check the last image
      fs.existsSync(path.join(TEST_DIR, '08.jpg')).should.be.true();
      // should not contain file that not belongs to this chapter
      fs.existsSync(path.join(TEST_DIR, '09.jpg')).should.be.false();
    });
  });
});
