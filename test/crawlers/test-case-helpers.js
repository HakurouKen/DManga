import path from 'path';
import isUrl from 'is-url';
import { isImage, isExist } from '../utils';
import { numLeftPad } from '../../lib/utils/misc';

export function shouldBeImage(filePath) {
  isImage(filePath).should.be.true();
}

export function shouldAllBeImage(filePaths = []) {
  filePaths.forEach(filePath => shouldBeImage(filePath));
}

export function shouldNotExist(filePath) {
  isExist(filePath).should.be.false();
}

export function assertStringPartialMatched(source, tester) {
  if (typeof tester === 'string') {
    source.should.include(tester);
  } else if (tester instanceof RegExp) {
    source.should.match(tester);
  } else {
    source.should.not.be.empty();
  }
}

export function buildMangaGetInfoTestCases({
  Ctor, testUrl = '', only = false, tester = {},
}) {
  describe('Manga#getInfo', () => {
    let info;
    before(async () => {
      const manga = new Ctor(testUrl);
      info = await manga.getInfo();
    });

    (only ? it.only : it)('contains basic infos of manga', () => {
      // full name of manga
      info.name.should.equal(tester.name);
      // page url
      info.url.should.equal(testUrl);
      // manga cover image url
      isUrl(info.cover).should.be.true();
      assertStringPartialMatched(info.cover, tester.cover);
      // authors list, needs to be an array
      info.authors.should.deep.equal(tester.authors);
      // whether manga is ended
      info.end.should.be[tester.end ? 'true' : 'false']();
      // descriptions
      assertStringPartialMatched(info.description, tester.description);
      // chapters
      info.chapters.length.should.not.equal(tester.chaptersShouldMoreThan || 0);
      // other versions of chapters
      info.otherVersions.forEach((version) => {
        version.name.should.not.be.empty();
        version.chapters.should.not.be.empty();
      });
      // other custom validators
      if (typeof tester.custom === 'function') {
        tester.custom(info);
      }
    });
  });
}

export function shouldBeChapterAt({ folder = 'manga/', count = 0, suffix = '.jpg' }) {
  const digits = Math.min(count.toFixed(0).length, 2);
  const getFilePath = index => path.join(folder, numLeftPad(index + 1, digits) + suffix);
  const files = Array.from(new Array(count), (val, index) => getFilePath(index));
  files.forEach((file) => {
    shouldBeImage(file);
  });
  shouldNotExist(getFilePath(count + 1));
}
