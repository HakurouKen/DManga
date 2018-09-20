import Chapter from '../../base/chapter';
import { fetchDocument, fetchText } from '../../utils/request';
import { exec, findScript } from '../../utils/misc';

export default class Chapter177mh extends Chapter {
  static identifer = /https?:\/\/www\.177mh\.net\/\d+\/\d+\.html/;

  private $doc: Promise<CheerioStatic> | undefined;

  private static server = [
    'https://cssh.zgxhxxmh.com/img_v1/cn_svr.aspx',
    'https://cssh.zgxhxxmh.com/img_v1/hw2_svr.aspx',
    'https://cssh.zgxhxxmh.com/img_v1/fdc_svr.aspx',
  ];

  private $() {
    if (!this.$doc) {
      this.$doc = fetchDocument(this.url);
    }
    return this.$doc;
  }

  async getUrls(): Promise<string[]> {
    const $ = await this.$();
    const encrypted = findScript($, /eval\(.*\)/);
    const infos: { raw: string; prefix: string; source: string } = exec(
      `${encrypted};var result = {raw: msg, prefix: img_s, source: link_z};result;`,
    );
    const coidMatched = this.url.match(/\/(\d+)\/(\d+)\.html/) || [];
    const cidMatched = /\/colist_(\d+)\.html/.exec(infos.source) || [];
    const prefixScripts = await fetchText(
      `${Chapter177mh.server}?s=${infos.prefix}&cid=${cidMatched[1] || ''}&coid=${coidMatched[2]
        || ''}`,
    );
    const prefix = exec(`${prefixScripts};img_qianzso[${infos.prefix}]`);
    return infos.raw.split('|').map(u => prefix + u);
  }
}
