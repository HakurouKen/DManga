import { fetchDocument } from '../utils/request';
import { MangaInfo } from '../utils/types';

export default abstract class DM5 {
  url: string;

  private $doc: Promise<CheerioStatic> | undefined;

  constructor(url: string) {
    this.url = url;
  }

  protected $() {
    if (!this.$doc) {
      this.$doc = fetchDocument(this.url);
    }
    return this.$doc;
  }

  abstract async getInfo(): Promise<MangaInfo>;
}
