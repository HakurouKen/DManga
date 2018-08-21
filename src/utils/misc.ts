import cheerio from 'cheerio';
import { ChapterInfo } from './types';

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
