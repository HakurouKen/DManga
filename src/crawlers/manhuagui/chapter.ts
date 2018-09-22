import { decompressFromBase64 } from 'lz-string';
import Chapter from '../../base/chapter';
import { fetchDocument } from '../../utils/request';
import { findScript, exec } from '../../utils/misc';

export default class ChapterManhuagui extends Chapter {
  static identifier = /^https?:\/\/www\.manhuagui\.com\/comic\/\d+\/\d+.html/;

  private static hosts = ['i', 'us', 'eu'];

  private $doc: Promise<CheerioStatic> | undefined;

  private $() {
    if (!this.$doc) {
      this.$doc = fetchDocument(this.url);
    }
    return this.$doc;
  }

  async getUrls(): Promise<string[]> {
    const $ = await this.$();
    const script = findScript($, /function\(p,a,c,k,e,d\)/);
    const info = exec(
      `
String.prototype.splic = function (splitter) {
  return decompressFromBase64(this).split(splitter);
};
var window = { eval };
var SMH = {
  imgData: function(data) {
    return {
      preInit: function() {
        return data;
      }
    };
  }
};
${script};
`,
      {
        decompressFromBase64,
      },
    );
    try {
      const host = `https://${ChapterManhuagui.hosts[0]}.hamreus.com`;
      const pathname = encodeURI(info.path);
      const files = info.files.map(
        (file: string) => `${host}${pathname}${file}?cid=${info.cid}&md5=${info.sl.md5}`,
      );
      return files;
    } catch (e) {
      return [];
    }
  }
}
