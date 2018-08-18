import { fetchDom } from '../../utils/request';

export default class DmzjManga {
  url: string;
  private _$: Promise<Cheerio> | undefined;

  constructor(url: string) {
    this.url = url;
  }

  private get $() {
    if (!this._$) {
      this._$ = fetchDom(this.url);
    }
    return this._$;
  }

  async getInfo(): Promise<{}> {
    const $ = await this.$;
    return {
      name: $.find('.anim_title_text').text().trim()
    }
  }
}
