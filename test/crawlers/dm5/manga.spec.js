import Manga from 'crawlers/dm5/manga';

describe('Dm5', () => {
  describe('Manga#getInfo', () => {
    let info;
    beforeEach(async () => {
      const manga = new Manga(
        'http://www.dm5.com/manhua-shanchangzhuolongrende-yuan-gaomutongxue/',
      );
      info = await manga.getInfo();
    });

    it("contains manga's info", () => {
      // full name
      info.name.should.equal('擅长捉弄人的(原)高木同学');
      // url
      info.url.should.equal('http://www.dm5.com/manhua-shanchangzhuolongrende-yuan-gaomutongxue/');
      // cover image url
      info.cover.should.match(/\.(jpe?g|png|gif)$/);
      // authors, needs to be an array
      info.authors.should.deep.equal(['稻叶光史']);
      // whether manga is ended
      info.end.should.be.false();
      // descriptions
      info.description.should.not.empty();
      // chapters
      info.chapters.length.should.gt(40);
      // other versions of manga
      info.otherVersions.length.should.gt(0);
      const anotherVersion = info.otherVersions[0];
      anotherVersion.name.should.equal('番外');
      anotherVersion.chapters.length.should.gt(0);
    });
  });
});
