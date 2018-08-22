import cheerio from 'cheerio';
import { ChapterInfo } from './types';

/**
 * Extract chapter info from `<a href="CHAPTER_URL">CHAPTER_NAME</a>`
 * @param el DOM element
 * @param domain current domain
 * @returns chapter info
 */
export function getChapterInfoFromAnchor(
  el: Cheerio | CheerioElement,
  domain: string = '',
): ChapterInfo {
  const $el = cheerio(el);
  return {
    name: $el.text().trim(),
    url: `${domain}${$el.attr('href')}`,
  };
}

/**
 * Eval
 * @param func stringified function
 */
export function exec(func: string): any {
  try {
    // eslint-disable-next-line no-new-func
    return new Function(func)();
  } catch (e) {
    return null;
  }
}
