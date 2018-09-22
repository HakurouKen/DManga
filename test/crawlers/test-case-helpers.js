import path from 'path';
import isUrl from 'is-url';
import rimraf from 'rimraf';
import { isImage, isExist } from '../utils';

function shouldBeImage(filePath) {
  isImage(filePath).should.be.true();
}

function shouldNotExist(filePath) {
  isExist(filePath).should.be.false();
}

function assertStringPartialMatched(source, tester) {
  if (typeof tester === 'string') {
    source.should.include(tester);
  } else if (tester instanceof RegExp) {
    source.should.match(tester);
  } else if (typeof tester === 'number') {
    source.length.should.gt(tester);
  } else {
    source.should.not.be.empty();
  }
}

function buildIdentifierTestcase(Ctor, testUrl) {
  const { identifier } = Ctor;
  if (typeof identifier === 'function') {
    identifier(testUrl).should.be.true();
  } else if (identifier instanceof RegExp) {
    testUrl.should.match(identifier);
  } else if (typeof identifier === 'string') {
    testUrl.should.have.string(identifier);
  } else {
    throw new Error('Identifier is invalid');
  }
}

export function buildMangaGetInfoTestCases({
  Ctor, testUrl = '', only = false, tester = {},
}) {
  describe('Manga.identifier', () => {
    (only ? it.only : it)('should match the given URL', () => {
      buildIdentifierTestcase(Ctor, testUrl);
    });
  });

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

/**
 * generate test file names
 * @param {number} total
 * @param {string} suffix
 */
function generateFileNames(total, suffix = '.jpg') {
  const digits = Math.max(total.toFixed(0).length, 2);
  // params `total` will never be over 10000.
  const pad = '0000';
  return Array.from({ length: total }).map((_, index) => (pad + (index + 1)).slice(-digits) + suffix);
}

/**
 *
 * @param {Object} params
 * @param {constructor} params.Ctor Manga constructor
 * @param {string} params.testUrl URL of manga webpage
 * @param {string} params.dir download directory
 * @param {string} params.forceSuffix Force set the image download suffix. Use the suffix of picture url as default.
 * @param {Object} params.tester Test settings
 * @param {string} params.tester.suffix Downloaded suffix
 * @param {number} params.tester.total total count of chapter images
 */
export function buildChapterDownloadTestCases({
  Ctor,
  testUrl = '',
  dir = null,
  only = false,
  forceSuffix = null,
  tester = {},
}) {
  if (dir == null) {
    throw new Error('Param folder is undefined.');
  }
  describe('Chapter.identifier', () => {
    (only ? it.only : it)('should match the given URL', () => {
      buildIdentifierTestcase(Ctor, testUrl);
    });
  });

  describe('Chapter#download', function () {
    before((done) => {
      rimraf(dir, () => {
        done();
      });
    });

    this.timeout(120 * 1e3);

    (only ? it.only : it)('should download the manga chapter', async () => {
      const chapter = new Ctor(testUrl);
      await chapter.download(path.join(dir, `{autoIndex}${forceSuffix || '{suffix}'}`));
      const { suffix = '.jpg', total } = tester;
      const all = generateFileNames(total + 1, suffix).map(filename => path.join(dir, filename));
      all.slice(0, -1).forEach((filepath) => {
        shouldBeImage(filepath);
      });
      shouldNotExist(all[all.length - 1]);
    });
  });
}
