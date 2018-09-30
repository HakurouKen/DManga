import { get, template } from 'lodash';
import langs from './langs';

const DEFAULT_LANG = 'zh_CN';
let currentLang = DEFAULT_LANG;
let currentMessages = (langs as any)[currentLang];

export function use(lang: string): void {
  const messages = (langs as any)[lang];
  currentLang = messages ? lang : DEFAULT_LANG;
  currentMessages = messages || langs[DEFAULT_LANG];
}

export function t(expression: string, args: any = {}): string {
  return template(get(currentMessages, expression, ''), {
    interpolate: /{([\s\S]+?)}/g,
  })(args);
}

export function getCurrentLang() {
  return currentLang;
}
