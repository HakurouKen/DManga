import { table } from 'table';
import search from '../crawlers/search';
import { stripControlCharacters } from '../utils/misc';
import { t } from '../locales';

export default async function (keyword: string, sites: string[] = []) {
  const results = await search(keyword, sites);
  const tableData = results.reduce((data: string[][], result) => {
    let status;
    if (typeof result.end === 'undefined') {
      status = t('info.statusUnknown');
    } else {
      status = result.end ? t('info.statusCompleted') : t('info.statusOngoing');
    }
    return data.concat([
      [t('info.name'), result.name],
      [t('info.url'), result.url],
      [t('info.status'), status],
      [t('info.description'), stripControlCharacters(result.description || '') || t('info.none')],
    ]);
  }, []);
  console.log(
    table(tableData, {
      columns: {
        0: { width: 10 },
        // Magic Number `17`:
        //  - first column width(10)
        //  - outer border(1 * 2) + padding(1 * 2)
        //  - inner border(1) + padding(left 1, right 1)
        1: { width: (process.stdout.columns || 80) - 17 },
      },
      drawHorizontalLine(index) {
        return index % 4 === 0;
      },
    }),
  );
}
