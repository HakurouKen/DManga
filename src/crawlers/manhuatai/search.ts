import { MangaSearchInfo } from '../../base/search';
import { fetchJson } from '../../utils/request';
import { exec } from '../../utils/misc';

export default async function searchManhuatai(keyword: string): Promise<MangaSearchInfo[]> {
  const response = await fetchJson(
    // encode twice
    `http://www.manhuatai.com/getjson.shtml?d=${Date.now()}&q=${encodeURIComponent(
      encodeURIComponent(keyword),
    )}`,
    {
      Host: 'www.manhuatai.com',
    },
  );
  console.log(response);
  return response.map((result: any) => ({
    name: result.cartoon_name,
    url: `http://www.manhuatai.com/${result.cartoon_id}`,
    end: result.cartoon_status_id.indexOf('完') >= 0,
  }));
}
