import Manga from '../../lib/crawlers/taduo/manga';

describe('Taduo', () => {
  describe('Manga#getInfo', () => {
    let info;
    beforeEach(async () => {
      const manga = new Manga('http://www.taduo.net/manhua/672/');
      info = await manga.getInfo();
    });

    it.only('contains manga\'s info', () => {
      // full name
      info.name.should.equal('甘城光辉游乐园');
      // url
      info.url.should.equal('http://www.taduo.net/manhua/672/');
      // cover image url
      info.cover.should.match(/\.(jpe?g|png|gif)$/);
      // authors, needs to be an array
      info.authors.should.deep.equal(['贺东招二?图：中岛有华 文：贺东招二']);
      // whether manga is ended
      info.end.should.be.false();
      // descriptions
      info.detail.should.not.empty();
      // chapters
      info.chapters.length.should.gt(1);
    });
  });
});
