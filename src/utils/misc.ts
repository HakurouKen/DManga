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
  const name = $el.attr('title') || $el.text();
  return {
    name: name.trim(),
    url: `${domain}${$el.attr('href')}`,
  };
}

export function findScript($: CheerioStatic, feature: string | RegExp): string {
  const scripts = $('script')
    .not('[src]')
    .toArray();

  let isMatch: (s: string) => boolean;
  if (typeof feature === 'string') {
    isMatch = s => s.indexOf(feature) >= 0;
  } else {
    isMatch = s => feature.test(s);
  }

  for (let i = 0; i < scripts.length; i++) {
    const source = cheerio(scripts[i]).html() || '';
    if (isMatch(source)) {
      return source;
    }
  }

  return '';
}

/**
 * Eval
 * @param exp stringified expression
 */
export function exec(exp: string, sandbox: any = {}): any {
  const vm = new VM({
    sandbox,
  });
  try {
    return vm.run(exp);
  } catch (e) {
    return null;
  }
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
 * @param digits max digits.
 */
export function numLeftPad(n: number | string, digits: number = 2): string {
  return leftPad(String(n), digits, '0');
}

/**
 * Get a random item from an array.
 * @param arr T[]
 * @returns T A member of arr
 */
export function choice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function noop() {}

/**
 * Check whether the string given is matched the identifier
 * @param identifier identifer
 * @param s string to be matched
 * @returns isMatched
 */
export function identifierMatch(
  s: string,
  identifier: string | RegExp | ((ss: string) => boolean),
): boolean {
  if (typeof identifier === 'string') {
    return s.indexOf(identifier) >= 0;
  }
  if (identifier instanceof RegExp) {
    return identifier.test(s);
  }
  if (typeof identifier === 'function') {
    return identifier(s);
  }
  return false;
}
