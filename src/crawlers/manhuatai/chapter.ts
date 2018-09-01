import cheerio from 'cheerio';
import Chapter from '../../base/chapter';
import { fetchDocument } from '../../utils/request';
import { exec } from '../../utils/misc';

export default class ManhuataiChapter extends Chapter {
  private $doc: Promise<CheerioStatic> | undefined;

  private domains: string[];

  constructor(url: string) {
    super(url);
    // Do not get them by request `http://server.samanlehua.com/mhpic.asp`
    // just cache all the results instead.
    this.domains = ['mhpic.xiaoshuomanhua.com', 'mhpic.samanlehua.com', 'mhpic.jjmh.com'];
  }

  private $() {
    if (!this.$doc) {
      this.$doc = fetchDocument(this.url);
    }
    return this.$doc;
  }

  async getUrls(): Promise<string[]> {
    const $ = await this.$();
    const scripts = $('script')
      .not('[src]')
      .toArray();

    let sourceCode = '';
    for (let i = 0; i < scripts.length; i++) {
      const source = cheerio(scripts[i]).html() || '';
      if (source.indexOf('var mh_info=') >= 0) {
        const matched = source.match(/var\s+mh_info\s*=\s*\{(.+?)\}\s*;/) || [];
        sourceCode = matched[0] || '';
        break;
      }
    }

    try {
      const info = exec(`${sourceCode};mh_info;`);
      // Encrypted code: `window.prompt(__cr.decode)`
      const imgPath = info.imgpath.replace(/./g, (a: string) => String.fromCharCode(a.charCodeAt(0) - (info.pageid % 10)));
      // Randomly choose one domain.
      const domain = this.domains[Math.floor(Math.random() * this.domains.length)];
      const start: number = info.startimg;
      const end: number = info.totalimg;
      return Array.from(
        { length: end - start + 1 },
        (v, i) => `https://${domain}/comic/${imgPath}${i + start}.jpg-noresize`,
      );
    } catch (e) {
      // do nothing
      return [];
    }
  }
}

new ManhuataiChapter('http://www.manhuatai.com/baoshizhiguo/01.html').getUrls().then(console.log);
