import BaseManga from '../../base/manga';

export default class Manga<%= name.capitalized %> extends BaseManga {
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
