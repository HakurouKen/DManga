import { VM } from 'vm2';
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
  const vm = new VM({
    sandbox: {},
  });
  return vm.run(func);
}

/**
 * String Left-Pad.
 * https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
 *
 * @param s source string
 * @param l target length
 * @param ch padding string
 */
export function leftPad(s: string, l: number, ch: string = ' '): string {
  const padLength = l - s.length;
  if (padLength <= 0) {
    return s;
  }
  let pad = ch;
  if (padLength > ch.length) {
    pad += ch.repeat(padLength / ch.length);
  }
  return pad.slice(0, padLength) + s;
}

/**
 * Left-Pad for number. Useful for generate series filename.
 * @param n number
 * @param max Max
 */
export function numLeftPad(n: number | string, max: number): string {
  return leftPad(String(n), max.toFixed(0).length, '0');
}

export function noop() {}
