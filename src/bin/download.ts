import Manga from '../crawlers/manga';
import Chapter from '../crawlers/chapter';

export default function (url: string, dest = './'): void {
  if (!url) {
    console.error('URL required.');
    return;
  }

  if (Chapter.match(url)) {
    const chapter = new Chapter(url);
    chapter.download(dest || './');
  } else if (Manga.match(url)) {
    const manga = new Manga(url);
    manga.download(dest || './');
  } else {
    console.error(`${url} is not a valid URL.`);
  }
}
