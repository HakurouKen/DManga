import Manga from '../crawlers/manga';
import Chapter from '../crawlers/chapter';
import { t } from '../locales';

export default function (url: string, options: { dest?: string; quiet?: boolean } = {}): void {
  const { dest = './', quiet = false } = options;
  if (Chapter.match(url)) {
    const chapter = new Chapter(url);
    chapter.download(dest || './', { withProgress: !quiet });
  } else if (Manga.match(url)) {
    const manga = new Manga(url);
    manga.download(dest || './', { withProgress: !quiet });
  } else {
    console.error(t('errors.URL_is_invalid', { url }));
  }
}
