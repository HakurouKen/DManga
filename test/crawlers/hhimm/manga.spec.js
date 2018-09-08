import Manga from '../../../lib/crawlers/hhimm/manga';

describe('Hhimm', () => {
  describe('Manga#getInfo', () => {
    let info;
    beforeEach(async () => {
      const manga = new Manga('http://www.hhimm.com/manhua/28308.html');
      info = await manga.getInfo();
    });

    it("contains manga's info", () => {
      info.name.should.equal('姐妹家的种种事');
      info.url.should.equal('http://www.hhimm.com/manhua/28308.html');
      info.cover.should.equal('http://img.94201314.net/comicui/28308.JPG');
      info.authors.should.deep.equal(['高野うい']);
      info.end.should.be.true();
      info.description.should.not.be.empty();
      info.chapters.length.should.equal(1);
      info.otherVersions.length.should.equal(1);
      const otherVersion = info.otherVersions[0];
      otherVersion.name.should.not.be.empty();
      otherVersion.chapters.length.should.gte(1);
    });
  });
});
