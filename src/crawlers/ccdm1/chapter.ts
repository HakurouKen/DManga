import Chapter from '../../base/chapter';
import { fetchDocument } from '../../utils/request';
import { findScript, exec } from '../../utils/misc';

export default class ChapterCcdm1 extends Chapter {
  private $doc: Promise<CheerioStatic> | undefined;

  private $() {
    if (!this.$doc) {
      this.$doc = fetchDocument(this.url);
    }
    return this.$doc;
  }

  async getUrls(): Promise<string[]> {
    const $ = await this.$();
    const script = findScript($, /var\s+cInfo\s*=/);
    const matched = script.match(/var\s+cInfo\s*=\s*(\{[\s\S]*?\})\s*;/) || [];
    const info = exec(`var info = ${matched[1] || ''};info;`);
    try {
      return info.fs.map((pathname: string) => `http://ccimg1.61mh.com${pathname}`);
    } catch (e) {
      return [];
    }
  }
}
