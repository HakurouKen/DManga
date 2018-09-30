import url from 'url';
import cheerio from 'cheerio';
import Chapter from '../../base/chapter';
import { fetchText, fetchDocument } from '../../utils/request';
import { exec } from '../../utils/misc';

interface metaData {
  cid: string;
  key: string;
  language: 1;
  gtk: 6;
  _cid: string;
  _mid: number;
  _dt: string;
  _sign: string;
}

interface pageMetaData extends metaData {
  total: number;
}

function getMeta(source: string, key: string): any {
  const partsRegex = new RegExp(`${key}\\s*=\\s*(.*?);`);
  const matched = source.match(partsRegex);
  if (!matched) {
    return null;
  }
  const variable = matched[1].trim();
  // string-liked
  if (variable[0] === variable[variable.length - 1] && ["'", '"'].indexOf(variable[0]) >= 0) {
    return variable.slice(1, -1);
  }
  // number-liked
  if (/^[0-9]+$/.test(variable)) {
    return parseInt(variable, 10);
  }
  // do not support other situations
  return null;
}

export default class ChapterDm5 extends Chapter {
  static identifier = /^https?:\/\/www\.dm5\.com\/m\d+/;

  private $doc: Promise<CheerioStatic> | undefined;

  private $() {
    if (!this.$doc) {
      this.$doc = fetchDocument(this.url);
    }
    return this.$doc;
  }

  async getMetaData(): Promise<pageMetaData> {
    const $ = await this.$();
    const scripts = $('head script')
      .not('[src]')
      .toArray();

    let metaDataSource = '';
    for (let i = 0; i < scripts.length; i++) {
      const source = cheerio(scripts[i]).html() || '';
      if (source.indexOf('DM5_VIEWSIGN') >= 0) {
        metaDataSource = source;
        break;
      }
    }

    const cid = getMeta(metaDataSource, 'DM5_CID');
    return {
      cid,
      key: '',
      language: 1,
      gtk: 6,
      _cid: cid,
      _mid: getMeta(metaDataSource, 'DM5_MID'),
      _dt: getMeta(metaDataSource, 'DM5_VIEWSIGN_DT'),
      _sign: getMeta(metaDataSource, 'DM5_VIEWSIGN'),
      total: getMeta(metaDataSource, 'DM5_IMAGE_COUNT'),
    };
  }

  async getUrls() {
    const { total, ...requestMeta } = await this.getMetaData();
    const baseUrl = url.resolve(this.url, 'chapterfun.ashx');
    let urls: string[] = [];
    while (urls.length < total) {
      const search = new url.URLSearchParams(
        Object.assign(requestMeta, { page: (urls.length + 1).toString() }),
      );
      const responseText = await fetchText(`${baseUrl}?${search.toString()}`, {
        referer: this.url,
      });
      try {
        const nextUrls = exec(`${responseText};d;`);
        if (!nextUrls.length) {
          throw new Error();
        }
        urls = urls.concat(nextUrls);
      } catch (e) {
        return urls;
      }
    }
    return urls;
  }
}
