import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

import Chapter from '../../lib/crawlers/taduo/chapter';

describe('Taduo', () => {
  describe('Chapter#download', function () {
    const TEST_DIR = 'manga/甘城光辉游乐园/1-1';
    beforeEach((done) => {
      rimraf(TEST_DIR, () => {
        done();
      });
    });

    this.timeout(120 * 1e3);

    it('should download the manga chapter', async function () {
      const chapter = new Chapter('http://www.taduo.net/manhua/672/47024.html');
      await chapter.download(path.join(TEST_DIR, '{autoIndex}{suffix}'));
      // check the first image
      fs.existsSync(path.join(TEST_DIR, '01.jpg')).should.be.true();
      // check the last image
      fs.existsSync(path.join(TEST_DIR, '24.jpg')).should.be.true();
      // should not contain file that not belongs to this chapter
      fs.existsSync(path.join(TEST_DIR, '25.jpg')).should.be.false();
    });
  });
});
