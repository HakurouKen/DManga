// Due to the bug of typescript-eslint-parser, the key `name` must be wrapped by quotes
// See more at https://github.com/eslint/typescript-eslint-parser/issues/414

export interface ChapterInfo {
  'name': string,
  url: string
}

export interface MangaInfo {
  url: string,
  'name': string,
  authors: string[],
  end: boolean,
  description: string,
  chapters: ChapterInfo[],
  otherVersions: { 'name': string, chapters: ChapterInfo[] }[]
}
