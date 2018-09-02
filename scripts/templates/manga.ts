import BaseManga from '../../base/manga';
import { ChapterInfo } from '../../utils/types';

export default class <%= name.capitalized %>Manga extends BaseManga {
  async getInfo() {
    const $ = await this.$();
    // Some More Codes...
    return {
      name: 'THE_NAME_OF_MANGA',
      url: this.url,
      cover: 'THE_COVER_URL',
      authors: ['AUTHOR'],
      end: false,
      detail: 'SOME_DESCRIPTION',
      chapters: [],
      otherVersions: [],
    };
  }
}