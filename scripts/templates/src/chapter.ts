import Chapter from '../../base/chapter';
import { fetchDocument } from '../../utils/request';

export default class Chapter<%= name.capitalized %> extends Chapter {
  private $doc: Promise<CheerioStatic> | undefined;

  private $() {
    if (!this.$doc) {
      this.$doc = fetchDocument(this.url);
    }
    return this.$doc;
  }

  async getUrls(): Promise<string[]> {
    const $ = await this.$();
    // Some More Codes...
    return [];
  }
}
