import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

import Chapter from '../../lib/crawlers/<%= name.normal %>/chapter';

describe('<%= name.capitalized %>', () => {
  describe('Chapter#download', function () {
    const TEST_DIR = 'manga/TEST_DIR';
    beforeEach((done) => {
      rimraf(TEST_DIR, () => {
        done();
      });
    });

    this.timeout(120 * 1e3);

    it('should download the manga chapter', async () => {
      const chapter = new Chapter('TEST_CHAPTER_URL');
      await chapter.download(path.join(TEST_DIR, '{autoIndex}{suffix}'));
      // check the first image
      fs.existsSync(path.join(TEST_DIR, '01.jpg')).should.be.true();
      // check the last image
      fs.existsSync(path.join(TEST_DIR, '{LAST_INDEX}.jpg')).should.be.true();
      // should not contain file that not belongs to this chapter
      fs.existsSync(path.join(TEST_DIR, '{LAST_INDEX + 1}.jpg')).should.be.false();
    });
  });
});
