import path from 'path';
import glob from 'glob';
import MangaBase from '../base/manga';
import { MangaInfo } from '../utils/types';
import { identifierMatch } from '../utils/misc';
import Chapter from './chapter';

type MangaBaseType = typeof MangaBase;
interface MangaConstructor extends MangaBaseType {}

/* eslint-disable global-require,import/no-dynamic-require */
const Mangas: MangaConstructor[] = glob
  .sync(path.join(__dirname, '*/manga.js'))
  .map(file => require(file).default);
/* eslint-enable global-require,import/no-dynamic-require */

function shortenChapterName(chapterName: string, mangaName: string) {
  return chapterName
    .replace(new RegExp(`(^${mangaName}\\s?[-_])|([-_]\\s?${mangaName}$)`), '')
    .trim();
}

export default class Manga {
  private pageUrl: string;

  private instance: MangaBase;

  private info: Promise<MangaInfo> | undefined;

  static match(pageUrl: string) {
    return Mangas.find(({ identifier }) => identifierMatch(pageUrl, identifier)) || null;
  }

  constructor(pageUrl: string) {
    this.pageUrl = pageUrl;
    const Ctor = Manga.match(pageUrl);
    if (!Ctor) {
      throw new Error(`URL INVALID: ${pageUrl} is not a valid manga URL.`);
    }
    this.instance = new Ctor(this.pageUrl);
  }

  getInfo() {
    this.info = this.info || this.instance.getInfo();
    return this.info;
  }

  private async getChapters(version: string | number | null = null) {
    const info = await this.getInfo();
    if (version == null) {
      return {
        name: info.name,
        chapters: info.chapters,
      };
    }
    const versions = info.otherVersions;
    let chapterListInfo;
    if (typeof version === 'string') {
      chapterListInfo = versions.find(v => v.name === version);
    } else {
      chapterListInfo = versions[version];
    }
    return chapterListInfo || { name: info.name, chapters: [] };
  }

  async download(
    folder = './',
    options: { version?: number | string; withProgress?: boolean } = {},
  ) {
    const info = await this.getInfo();
    const versionInfo = await this.getChapters(options.version);
    const { chapters } = versionInfo;
    for (const chapterInfo of chapters) {
      const chapter = new Chapter(chapterInfo.url);
      const chapterName = shortenChapterName(chapterInfo.name, info.name);
      await chapter.download(path.join(folder, versionInfo.name || info.name, chapterName), {
        withProgress: options.withProgress,
        chapterName,
      });
    }
    return chapters;
  }
}
