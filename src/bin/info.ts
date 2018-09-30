import Manga from '../crawlers/manga';
import { t } from '../locales';

export default async function getInfo(url: string) {
  if (!Manga.match(url)) {
    console.error(t('errors.URL_is_invalid', { url }));
  }
  const manga = new Manga(url);
  const info = await manga.getInfo();
  console.log(info);
}
