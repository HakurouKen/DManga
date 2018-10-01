import Manga from '../crawlers/manga';
import Chapter from '../crawlers/chapter';
import { t } from '../locales';

export default function (
  url: string,
  options: { dest?: string; quiet?: boolean; version?: number | string } = {},
): void {
  const { dest = './', quiet = false, version } = options;
  if (Chapter.match(url)) {
    const chapter = new Chapter(url);
    chapter.download(dest || './', { withProgress: !quiet });
  } else if (Manga.match(url)) {
    const manga = new Manga(url);
    manga.download(dest || './', { version, withProgress: !quiet });
  } else {
    console.error(t('errors.invalidURL', { url }));
  }
}
