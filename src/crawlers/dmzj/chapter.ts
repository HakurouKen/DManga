import cheerio from 'cheerio';
import { fetchDocument, batchDownload } from '../../utils/request';
import { exec } from '../../utils/misc';

export default class DmzjChapter {
  url: string;

  private $doc: Promise<CheerioStatic> | undefined;

  constructor(url: string) {
    this.url = url;
  }

  private $() {
    if (!this.$doc) {
      this.$doc = fetchDocument(this.url);
    }
    return this.$doc;
  }

  async getUrls(): Promise<string[]> {
    const $ = await this.$();
    const scripts = $('head script')
      .not('[src]')
      .toArray();

    let encryptedSourceCode = '';
    for (let i = 0; i < scripts.length; i++) {
      const source = cheerio(scripts[i]).html() || '';
      if (source.indexOf('eval') >= 0) {
        encryptedSourceCode = source;
        break;
      }
    }

    try {
      const sourceCode = exec(`var pages;${encryptedSourceCode};return pages;`);
      return JSON.parse(sourceCode).map((url: string) => `https://images.dmzj.com/${url}`);
    } catch (e) {
      // do nothing
      return [];
    }
  }

  async download(dest: string): Promise<{}> {
    const urls = await this.getUrls();
    return batchDownload(urls, dest, {
      headers: {
        referer: this.url,
      },
    });
  }
}
