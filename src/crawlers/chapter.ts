import path from 'path';
import glob from 'glob';
import ChapterBase from '../base/chapter';
import { identifierMatch } from '../utils/misc';

type ChapterBaseType = typeof ChapterBase;
interface ChapterConstructor extends ChapterBaseType {}

/* eslint-disable global-require,import/no-dynamic-require */
const Chapters: ChapterConstructor[] = glob
  .sync(path.join(__dirname, '*/chapter.js'))
  .map(file => require(file).default);
/* eslint-enable global-require,import/no-dynamic-require */

const FALLBACK_SUFFIX = '.jpg';
const ALLOW_SUFFIXES = ['.jpg', '.jpeg', '.gif', '.png'];

export default class Chapter {
  private pageUrl: string;

  private instance: ChapterBase;

  constructor(pageUrl: string) {
    this.pageUrl = pageUrl;
    const Ctor = Chapters.find(({ identifier }) => identifierMatch(pageUrl, identifier));
    if (!Ctor) {
      throw new Error('Not Matched');
    }
    this.instance = new Ctor(pageUrl);
  }

  download(dest = './') {
    return this.instance.download((data) => {
      const { suffix, autoIndex } = data;
      const supportSuffix = ALLOW_SUFFIXES.indexOf(suffix) >= 0;
      return path.join(dest, `${autoIndex}${supportSuffix ? suffix : FALLBACK_SUFFIX}`);
    });
  }
}
