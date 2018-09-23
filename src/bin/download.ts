import Manga from '../crawlers/manga';
import Chapter from '../crawlers/chapter';

export default function (url: string, options: { dest?: string; quiet?: boolean } = {}): void {
  const { dest = './', quiet = false } = options;
  if (!url) {
    console.error('URL required.');
    return;
  }
  if (Chapter.match(url)) {
    const chapter = new Chapter(url);
    chapter.download(dest || './', { withProgress: !quiet });
  } else if (Manga.match(url)) {
    const manga = new Manga(url);
    manga.download(dest || './', { withProgress: !quiet });
  } else {
    console.error(`${url} is not a valid URL.`);
  }
}
