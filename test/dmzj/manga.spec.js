import DmzjManga from '../../lib/crawlers/manga/dmzj';

describe('Dmzj#Manga', () => {
  let info;
  before(async () => {
    const manga = new DmzjManga('https://manhua.dmzj.com/yiquanchaoren');
    info = await manga.getInfo();
    return info;
  });

  it('should get basic info correctly.', () => {
    info.name.should.equal('一拳超人');
    info.url.should.equal('https://manhua.dmzj.com/yiquanchaoren');
    info.cover.should.equal('https://images.dmzj.com/webpic/1/onepunchmanfengmianl.jpg');
    info.authors.should.deep.equal(['村田雄介', 'ONE']);
  });
});
