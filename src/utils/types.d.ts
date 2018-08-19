export interface ChapterInfo {
  'name': string,
  url: string
}

export interface MangaInfo {
  url: string,
  'name': string,
  cover: string,
  authors: string[],
  end: boolean,
  detail: string,
  chapters: ChapterInfo[],
  otherVersions: { 'name': string, chapters: ChapterInfo[] }[]
}
