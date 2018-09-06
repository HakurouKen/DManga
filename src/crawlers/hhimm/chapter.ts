import PQueue from 'p-queue';
import Chapter from '../../base/chapter';
import { fetchDocument } from '../../utils/request';
import { choice } from '../../utils/misc';

function decode(s: string): string {
  const lastChar = s.charAt(s.length - 1);
  const truncate = lastChar.charCodeAt(0) - 96;
  const keys = s.substring(s.length - truncate - 12, s.length - truncate - 1);
  let encrypted = s.substring(0, s.length - truncate - 12);
  const k = keys.substring(0, keys.length - 1);
  const f = keys.substring(keys.length - 1);
  for (let i = 0; i < k.length; i++) {
    encrypted = encrypted.replace(new RegExp(k.charAt(i), 'g'), i.toString());
  }
  return encrypted
    .split(f)
    .reduce((result, c) => result + String.fromCharCode(parseInt(c, 10)), '');
}

export default class ChapterHhimm extends Chapter {
  private static sites = ['http://165.94201314.net/dm02/', 'http://124.94201314.net/dm02/'];

  private site: string;

  private queue: PQueue;

  constructor(url: string) {
    super(url);
    this.site = choice(ChapterHhimm.sites);
    this.queue = new PQueue({ concurrency: 5 });
  }

  private buildUrl(index: number): string {
    return this.url.replace(/\d+\.html/, `${index + 1}.html`);
  }

  private async fetchUrls(
    index: number | CheerioStatic,
    isSingle: boolean = false,
  ): Promise<string[]> {
    const $ = await (typeof index === 'number' ? fetchDocument(this.buildUrl(index)) : index);
    const name = $('#img1021,#img2391,#img7652,#imgCurr').attr('name');
    const nextName = $('#hdNextImg').val();
    return [decode(name)].concat(isSingle ? [] : [decode(nextName)]).map(s => `${this.site}${s}`);
  }

  async getUrls(): Promise<string[]> {
    const $ = await fetchDocument(this.url);
    const total = $('#iPageHtm a').length;
    const urlPairs = await this.queue.addAll(
      Array.from({ length: Math.floor(total / 2) }, (_, k) => k * 2).map(index => () => {
        if (index === 0) {
          return this.fetchUrls($);
        }
        return this.fetchUrls(index, index === total - 1);
      }),
    );
    return urlPairs.reduce((urls, pair) => urls.concat(pair), []);
  }
}
