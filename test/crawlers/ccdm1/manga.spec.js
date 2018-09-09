import Manga from '../../../lib/crawlers/ccdm1/manga';

describe('Ccdm1', () => {
  describe('Manga#getInfo', () => {
    let info;
    beforeEach(async () => {
      const manga = new Manga('http://www.ccdm1.com/manhua/7437/');
      info = await manga.getInfo();
    });

    it("contains manga's info", () => {
      // Basic test case here.
      info.name.should.equal('死亡笔记');
      info.url.should.equal('http://www.ccdm1.com/manhua/7437/');
      info.authors.should.deep.equal(['小畑健']);
      info.end.should.be.false();
      info.description.should.not.empty();
      info.chapters.length.should.gt(100);
      const chapter = info.chapters[0];
      chapter.name.should.equal('番外');
    });
  });
});
