import Manga from '../crawlers/manga';

export default async function getInfo(url: string) {
  if (!Manga.match(url)) {
    console.error(`${url} is not a valid URL.`);
  }
  const manga = new Manga(url);
  const info = await manga.getInfo();
  console.log(info);
}
