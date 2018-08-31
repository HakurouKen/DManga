import cheerio from 'cheerio';
import Chapter from '../../base/chapter';
import { fetchDocument } from '../../utils/request';
import { exec } from '../../utils/misc';

export default class DmzjChapter extends Chapter {
  private $doc: Promise<CheerioStatic> | undefined;

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
      const sourceCode = exec(`${encryptedSourceCode};arr_pages;`);
      return sourceCode.map((imageUrl: string) => `https://images.dmzj.com/${imageUrl}`);
    } catch (e) {
      // do nothing
      console.error(e);
      return [];
    }
  }
}
