import path from 'path';
import glob from 'glob';
import MangaBase from '../base/manga';
import { identifierMatch } from '../utils/misc';
import Chapter from './chapter';

type MangaBaseType = typeof MangaBase;
interface MangaConstructor extends MangaBaseType {}

/* eslint-disable global-require,import/no-dynamic-require */
const Mangas: MangaConstructor[] = glob
  .sync(path.join(__dirname, '*/manga.js'))
  .map(file => require(file).default);
/* eslint-enable global-require,import/no-dynamic-require */

export default class Manga {
  private pageUrl: string;

  private instance: MangaBase;

  constructor(pageUrl: string) {
    this.pageUrl = pageUrl;
    const Ctor = Mangas.find(({ identifier }) => identifierMatch(pageUrl, identifier));
    if (!Ctor) {
      throw new Error('Not Matched');
    }
    this.instance = new Ctor(pageUrl);
  }

  getInfo() {
    return this.instance.getInfo();
  }

  private async getChapters(version?: string | number) {
    const info = await this.getInfo();
    if (!version) {
      return info.chapters;
    }
    const versions = info.otherVersions;
    let chapterListInfo;
    if (typeof version === 'string') {
      chapterListInfo = versions.find(v => v.name === version);
    } else {
      chapterListInfo = versions[version];
    }

    return chapterListInfo ? chapterListInfo.chapters : [];
  }

  async download(folder = './') {
    const chapters = await this.getChapters();
    for (const info of chapters) {
      const chapter = new Chapter(info.url);
      await chapter.download(path.join(folder, info.name));
    }
    return chapters;
  }
}
