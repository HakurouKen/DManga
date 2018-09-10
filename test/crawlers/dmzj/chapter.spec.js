import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

import Chapter from 'crawlers/dmzj/chapter';

describe('Dmzj', () => {
  describe('Chapter#download', function () {
    const TEST_DIR = 'manga/篮球飞人/全彩版十日谈';
    beforeEach((done) => {
      rimraf(TEST_DIR, () => {
        done();
      });
    });

    this.timeout(120 * 1e3);

    it('should download the manga chapter', async function () {
      const chapter = new Chapter('https://manhua.dmzj.com/lanqiufeiren/43293.shtml');
      await chapter.download(path.join(TEST_DIR, '{autoIndex}{suffix}'));
      // check the first image
      fs.existsSync(path.join(TEST_DIR, '01.jpg')).should.be.true();
      // check the last image
      fs.existsSync(path.join(TEST_DIR, '31.jpg')).should.be.true();
      // should not contain file that not belongs to this chapter
      fs.existsSync(path.join(TEST_DIR, '32.jpg')).should.be.false();
    });
  });
});
