import Manga from '../../lib/crawlers/<%= name.normal %>/manga';

describe('<%= name.capitalized %>', () => {
  describe('Manga#getInfo', () => {
    let info;
    beforeEach(async () => {
      const manga = new Manga('SOME_URL');
      info = await manga.getInfo();
    });

    it('contains manga\'s info', () => {
      // Basic test case here.
    });
  });
});
