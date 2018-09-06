import Manga from '../../lib/crawlers/fmhua/manga';

describe('Fmhua', () => {
  describe('Manga#getInfo', () => {
    let info;
    beforeEach(async () => {
      const manga = new Manga('http://mh.fumanhua.net/manhua/10562/');
      info = await manga.getInfo();
    });

    it("contains manga's info", () => {
      info.name.should.equal('我叫坂本我最屌');
      info.url.should.equal('http://mh.fumanhua.net/manhua/10562/');
      info.cover.should.equal('http://mh.fumanhua.net/upload/2013-03-04/201334144029534.jpg');
      info.authors.should.deep.equal(['佐野菜见']);
      info.description.should.match(/屌/);
      info.chapters.length.should.gt(20);
    });
  });
});
