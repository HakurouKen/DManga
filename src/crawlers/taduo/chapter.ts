import Chapter from '../../base/chapter';
import { fetchDocument } from '../../utils/request';
import { findScript, exec } from '../../utils/misc';

export default class ChapterTaduo extends Chapter {
  static identifier = /^http:\/\/www\.taduo\.net\/manhua\/\d+\/\d+\.html/;

  private $doc: Promise<CheerioStatic> | undefined;

  private $() {
    if (!this.$doc) {
      this.$doc = fetchDocument(this.url);
    }
    return this.$doc;
  }

  async getUrls(): Promise<string[]> {
    const $ = await this.$();
    const script = findScript($, /var\s+photosr\s*=/);
    const rawResults: string[] = exec(`${script};photosr`);
    if (!rawResults) {
      return [];
    }
    return rawResults.slice(1).map(p => `http://f.taduo.net/${p}`);
  }
}
