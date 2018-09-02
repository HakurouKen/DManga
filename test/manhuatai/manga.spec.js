import Manga from '../../lib/crawlers/manhuatai/manga';

describe('Manhuatai', () => {
  describe('Manga#getInfo', () => {
    let info;
    beforeEach(async () => {
      const manga = new Manga('http://www.manhuatai.com/baoxiaoxiaoyuan/');
      info = await manga.getInfo();
    });

    it("contains manga's info", () => {
      // full name
      info.name.should.equal('爆笑校园');
      // url
      info.url.should.equal('http://www.manhuatai.com/baoxiaoxiaoyuan/');
      // cover image url
      info.cover.should.match(/\.(jpe?g|png|gif)$/);
      // authors, needs to be an array
      info.authors.should.deep.equal(['漫画世界 朱斌']);
      // whether manga is ended
      info.end.should.be.false();
      // descriptions
      info.detail.should.not.empty();
      // chapters
      info.chapters.length.should.gt(5);
      // other versions of manga
      info.otherVersions.length.should.gt(0);
      const anotherVersion = info.otherVersions[0];
      anotherVersion.name.should.not.empty();
      anotherVersion.chapters.length.should.gt(0);
    });
  });
});
