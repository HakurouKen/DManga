import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

import Chapter from '../../../lib/crawlers/ccdm1/chapter';

describe('Ccdm1', () => {
  describe('Chapter#download', function () {
    const TEST_DIR = 'manga/命运石之门：比翼恋理的爱人';
    beforeEach((done) => {
      rimraf(TEST_DIR, () => {
        done();
      });
    });

    this.timeout(120 * 1e3);

    it.only('should download the manga chapter', async () => {
      const chapter = new Chapter('http://www.ccdm1.com/manhua/12796/99673.html');
      await chapter.download(path.join(TEST_DIR, '{autoIndex}{suffix}'));
      // check the first image
      fs.existsSync(path.join(TEST_DIR, '01.jpg')).should.be.true();
      // check the last image
      fs.existsSync(path.join(TEST_DIR, '27.jpg')).should.be.true();
      // should not contain file that not belongs to this chapter
      fs.existsSync(path.join(TEST_DIR, '28.jpg')).should.be.false();
    });
  });
});
