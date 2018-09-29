import path from 'path';
import glob from 'glob';
import PQueue from 'p-queue';
import { MangaSearchInfo } from '../base/search';

/* eslint-disable global-require,import/no-dynamic-require */
const searchers: { (keyword: string): Promise<MangaSearchInfo[]> }[] = glob
  .sync(path.join(__dirname, '*/search.js'))
  .map(file => require(file).default);
/* eslint-enable global-require,import/no-dynamic-require */

function normalizeSearchName(s: string) {
  return s.replace(/^search(\w)/, (_, $1) => $1.toLowerCase());
}

const supports = searchers.map(searcher => normalizeSearchName(searcher.name));

export default async function search(keyword: string, sites: string[] = supports) {
  const siteMap = (sites.length ? sites : supports).reduce(
    (acc: any, site) => ({ ...acc, [site]: true }),
    {},
  );
  const sources = searchers.filter(searcher => siteMap[normalizeSearchName(searcher.name)]);
  const queue = new PQueue({ concurrency: 5 });
  const results: MangaSearchInfo[][] = await queue.addAll(
    sources.map(searcher => () => searcher(keyword).catch(() => [])),
  );
  return results.reduce((all, result) => all.concat(result), []);
}
