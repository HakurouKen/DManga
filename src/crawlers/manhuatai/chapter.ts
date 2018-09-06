import Chapter from '../../base/chapter';
import { fetchDocument } from '../../utils/request';
import { exec, findScript } from '../../utils/misc';

export default class ChapterManhuatai extends Chapter {
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

    const INFO_MATCH_REGEXP = /var\s+mh_info\s*=\s*\{(.+?)\}\s*;/;
    const sourceCode = findScript($, INFO_MATCH_REGEXP);

    const info = exec(`${sourceCode.match(INFO_MATCH_REGEXP)![0]};mh_info;`);
    if (!info) {
      return [];
    }

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
  }
}
