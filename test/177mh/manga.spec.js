import Manga from '../../lib/crawlers/177mh/manga';

describe('177mh', () => {
  describe('Manga#getInfo', () => {
    let info;
    beforeEach(async () => {
      const manga = new Manga('https://www.177mh.net/colist_232941.html');
      info = await manga.getInfo();
    });

    it("contains manga's info", () => {
      info.name.should.equal('-舰colle- 官方四格');
      info.url.should.equal(info.url);
      info.cover.should.not.be.empty();
      info.authors.should.deep.equal(['桃井凉太']);
      info.end.should.equal(false);
      info.description.should.not.empty();
      info.chapters.length.should.gt(100);
    });
  });
});
