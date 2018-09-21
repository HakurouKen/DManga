import { URL } from 'url';
import Chapter from '../../base/chapter';
import { fetchDocument } from '../../utils/request';
import { findScript, exec } from '../../utils/misc';

export default class ChapterVerydm extends Chapter {
  static identifer(pageUrl: string) {
    const parsed = new URL(pageUrl);
    return (
      parsed.hostname === 'www.verydm.com'
      && parsed.pathname === 'chapter.php'
      && /\d+/.test(parsed.searchParams.get('id') || '')
    );
  }

  private $doc: Promise<CheerioStatic> | undefined;

  private $() {
    if (!this.$doc) {
      this.$doc = fetchDocument(this.url);
    }
    return this.$doc;
  }

  async getUrls(): Promise<string[]> {
    const $ = await this.$();
    const script = findScript($, 'eval');
    const raw = exec(`${script.trim()};imageData;`);
    try {
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }
}
