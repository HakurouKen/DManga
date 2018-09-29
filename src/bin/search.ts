import search from '../crawlers/search';

export default async function (keyword: string, sites: string[] = []) {
  const results = await search(keyword, sites);
  console.log(results);
}
