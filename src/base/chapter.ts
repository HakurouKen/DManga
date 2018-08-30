import { batchDownload } from '../utils/request';

export default abstract class Chapter {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  abstract async getUrls(): Promise<string[]>;

  async download(dest: string): Promise<{}> {
    const urls = await this.getUrls();
    return batchDownload(urls, dest, {
      headers: {
        referer: this.url,
      },
    });
  }
}
