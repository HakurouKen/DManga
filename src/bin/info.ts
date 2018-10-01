import { table } from 'table';
import Manga from '../crawlers/manga';
import { t } from '../locales';

export default async function getInfo(url: string) {
  if (!Manga.match(url)) {
    console.error(t('errors.invalidURL', { url }));
  }
  const manga = new Manga(url);
  const info = await manga.getInfo();
  const latestChapter = info.chapters[info.chapters.length - 1];
  console.log(
    table(
      [
        [t('info.name'), info.name],
        [t('info.url'), info.url],
        [t('info.author'), info.authors.join(', ')],
        [t('info.status'), info.end ? t('info.statusCompleted') : t('info.statusCompleted')],
        [t('info.description'), info.description.replace(/\s+/, ' ')] || t('info.none'),
        [t('info.totalChapters'), info.chapters.length],
        [
          t('info.latestChapter'),
          latestChapter ? `(${latestChapter.name}) ${latestChapter.url}` : t('info.none'),
        ],
        [
          t('info.otherVersions'),
          info.otherVersions.map(version => version.name).join(' / ') || t('info.none'),
        ],
      ],
      {
        columns: {
          1: { width: 80 },
        },
      },
    ),
  );
}
