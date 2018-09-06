import Chapter from '../../base/chapter';
import { fetchDocument } from '../../utils/request';
import { findScript, exec } from '../../utils/misc';

export default class FmhuaChapter extends Chapter {
  private $doc: Promise<CheerioStatic> | undefined;

  private $() {
    if (!this.$doc) {
      this.$doc = fetchDocument(this.url);
    }
    return this.$doc;
  }

  async getUrls(): Promise<string[]> {
    const $ = await this.$();
    const script = findScript($, /var\s+qTcms_S_m_murl_e\s?=/);
    const encrypted: string = exec(`${script};qTcms_S_m_murl_e;`);
    const raw = Buffer.from(encrypted, 'base64').toString('ascii');
    return raw.split('$qingtiandy$');
  }
}
