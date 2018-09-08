import Manga from '../../../lib/crawlers/manhuagui/manga';

describe('Manhuagui', () => {
  describe('Manga#getInfo', () => {
    let info;
    beforeEach(async () => {
      const manga = new Manga('https://www.manhuagui.com/comic/2807/');
      info = await manga.getInfo();
    });

    it("contains manga's info", () => {
      // Basic test case here.
      info.name.should.equal('史上最强弟子兼一');
      info.url.should.equal('https://www.manhuagui.com/comic/2807/');
      info.cover.should.match(/\.jpe?g$/);
      info.authors.should.deep.equal(['松江名俊']);
      info.end.should.be.true();
      info.description.length.should.gt(100);
      info.chapters.length.should.gt(100);
      info.chapters[0].name.should.equal('第583回');
      const otherVersion = info.otherVersions[1];
      otherVersion.name.should.equal('单行本');
      otherVersion.chapters.length.should.gte(1);
    });
  });
});
