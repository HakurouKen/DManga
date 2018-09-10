import Manga from 'crawlers/verydm/manga';

describe('Verydm', () => {
  describe('Manga#getInfo', () => {
    let info;
    beforeEach(async () => {
      const manga = new Manga('http://www.verydm.com/manhua/langyuxxl');
      info = await manga.getInfo();
    });

    it.only("contains manga's info", () => {
      info.name.should.equal('狼与香辛料');
      info.url.should.equal('http://www.verydm.com/manhua/langyuxxl');
      info.cover.should.match(/\.jpg$/);
      info.authors.should.deep.equal(['小梅系斗']);
      info.end.should.be.true();
      info.description.should.not.be.empty();
      info.chapters.length.should.not.equal(0);
      info.otherVersions.length.should.not.equal(0);
      info.otherVersions.forEach((version) => {
        version.name.should.not.be.empty();
        version.chapters.should.not.be.empty();
      });
    });
  });
});
