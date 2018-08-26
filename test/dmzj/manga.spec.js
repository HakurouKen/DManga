import Manga from '../../lib/crawlers/dmzj/manga';

describe('Dmzj', () => {
  describe('Manga#getInfo', () => {
    let info;
    beforeEach(async () => {
      const manga = new Manga('https://manhua.dmzj.com/yiquanchaoren');
      info = await manga.getInfo();
    });

    it('contains manga\'s info', () => {
      // full name
      info.name.should.equal('一拳超人');
      // url
      info.url.should.equal('https://manhua.dmzj.com/yiquanchaoren');
      // cover image url
      info.cover.should.match(/\.(jpe?g|png|gif)$/);
      // authors, needs to be an array
      info.authors.should.deep.equal(['村田雄介', 'ONE']);
      // whether manga is ended
      info.end.should.be.false();
      // descriptions
      info.detail.should.not.empty();
      // chapters
      info.chapters.length.should.gt(100);
      // other versions of manga
      info.otherVersions.length.should.gt(0);
      const anotherVersion = info.otherVersions[0];
      anotherVersion.name.should.not.empty();
      anotherVersion.chapters.length.should.gt(0);
    });
  });
});
