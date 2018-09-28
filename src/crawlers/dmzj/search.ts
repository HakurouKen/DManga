import { MangaSearchInfo } from '../../base/search';
import { fetchText } from '../../utils/request';
import { exec } from '../../utils/misc';

export default async function searchDmzj(keyword: string): Promise<MangaSearchInfo[]> {
  const text = await fetchText(
    `https://sacg.dmzj.com/comicsum/search.php?s=${encodeURIComponent(keyword)}`,
  );
  const results = exec(`${text};g_search_data;`);
  // Objects returned by `vm2` are not injected by global methods (eg: `should` method of chai)
  // Force convert to internal Array.
  return Array.prototype.slice.call(results, 0).map((result: any) => ({
    name: result.comic_name,
    url: `https:${result.comic_url_raw}`,
    end: /完/.test(result.status),
    authors: result.comic_author.split('/'),
    description: result.description,
  }));
}
