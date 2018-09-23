import Progress from 'progress';
import { destData, batchDownload } from '../utils/request';

export interface chapterDownloadOptions {
  withProgress?: boolean;
  chapterName?: string;
}

export default abstract class Chapter {
  static identifier: string | RegExp | ((s: string) => boolean);

  url: string;

  constructor(url: string) {
    this.url = url;
  }

  abstract async getUrls(): Promise<string[]>;

  async download(
    dest: string | ((data: destData) => string),
    options: chapterDownloadOptions = {},
  ): Promise<{}> {
    const urls = await this.getUrls();
    const total = urls.length;
    let bar: Progress;
    if (options.withProgress) {
      bar = new Progress(
        `Downloading ${options.chapterName ? `${options.chapterName}` : ''}[:bar] :percent`,
        {
          width: 30,
          total,
        },
      );
    }
    return batchDownload(urls, dest, {
      headers: {
        referer: this.url,
      },
      onTaskFinished() {
        if (bar) {
          bar.tick();
        }
      },
    });
  }
}
