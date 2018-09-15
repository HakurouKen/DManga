import { fetchDocument } from '../utils/request';
import { MangaInfo } from '../utils/types';

export default abstract class Manga {
  static identifer: string | RegExp | ((s: string) => boolean);

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
