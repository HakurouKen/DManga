import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

import Chapter from '../../lib/crawlers/dm5/chapter';

describe('DM5', () => {
  describe('Chapter#download', function () {
    const TEST_DIR = 'manga/擅长捉弄人的(原)高木同学/第1话/';
    beforeEach((done) => {
      rimraf(TEST_DIR, () => {
        done();
      });
    });

    this.timeout(120 * 1e3);

    it.only('should download the manga chapter', async function () {
      const chapter = new Chapter('http://www.dm5.com/m503087/');
      await chapter.download(path.join(TEST_DIR, '{name}'));
      fs.existsSync(path.join(TEST_DIR, '9_3128.jpg')).should.be.true();
    });
  });
});
