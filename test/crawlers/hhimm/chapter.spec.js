import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

import Chapter from '../../../lib/crawlers/hhimm/chapter';

describe('Hhimm', () => {
  describe('Chapter#download', function () {
    const TEST_DIR = 'manga/姐妹家的种种事';
    beforeEach((done) => {
      rimraf(TEST_DIR, () => {
        done();
      });
    });

    this.timeout(120 * 1e3);

    it('should download the manga chapter', async () => {
      const chapter = new Chapter('http://www.hhimm.com/cool211984/1.html?s=2');
      await chapter.download(path.join(TEST_DIR, '{autoIndex}{suffix}'));
      // check the first image
      fs.existsSync(path.join(TEST_DIR, '01.JPG')).should.be.true();
      // check the last image
      fs.existsSync(path.join(TEST_DIR, '18.JPG')).should.be.true();
      // should not contain file that not belongs to this chapter
      fs.existsSync(path.join(TEST_DIR, '19.JPG')).should.be.false();
    });
  });
});
