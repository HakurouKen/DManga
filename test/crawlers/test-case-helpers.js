import path from 'path';
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

function buildIdentifierTestcase(identifier, testUrl) {
  if (typeof identifier === 'function') {
    identifier(testUrl).should.be.true();
  } else if (identifier instanceof RegExp) {
    testUrl.should.match(identifier);
  } else if (typeof identifier === 'string') {
    testUrl.should.have.string(identifier);
  } else if (identifier === true) {
    testUrl.should.not.empty();
  } else {
    throw new Error('Identifier is invalid');
  }
}

/**
 * Build Manga.identifier & Manga#getInfo test-cases.
 * @param {Object} options
 * @param {constructor} options.Ctor Manga Constructor
 * @param {string} options.testUrl URL of manga webpage
 * @param {boolean} params.only Use describe.only(). Just use for dev.
 * @param {Object} options.tester Test settings
 * @param {string} options.tester.name
 * @param {string[]} options.tester.authors
 * @param {RegExp|string|number} options.tester.description
 * @param {number} options.tester.chapterShouldMoreThan
 * @param {function} options.tester.custom
 */
export function buildMangaGetInfoTestCases({
  Ctor, testUrl = '', only = false, tester = {},
}) {
  describe('Manga.identifier', () => {
    (only ? it.only : it)('should match the given URL', () => {
      buildIdentifierTestcase(Ctor.identifier, testUrl);
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
 * Build Chapter.identifier & Chapter#download test-cases.
 * @param {Object} params
 * @param {constructor} params.Ctor Chapter constructor
 * @param {string} params.testUrl URL of manga chapter webpage
 * @param {string} params.dir download directory
 * @param {boolean} params.only Use describe.only(). Just use for dev.
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
      buildIdentifierTestcase(Ctor.identifier, testUrl);
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

/**
 * Build search test-cases.
 * @param {object} options options
 * @param {function} options.search search function
 * @param {string} options.keyword search keyword for test
 * @param {boolean} params.only Use describe.only(). Just use for dev.
 * @param {boolean} params.tester Test options.
 * @param {boolean} params.tester.authors Whether check `authors` or not.
 * @param {boolean} params.tester.description Whether check `description` or not.
 */
export function buildMangaSearcherTestCases({
  search, keyword = '', only = false, tester = {},
}) {
  describe('search(keyword)', () => {
    (only ? it.only : it)('should return the search result', async () => {
      const results = await search(keyword);
      results.should.not.empty();
      results.forEach((result) => {
        result.name.should.not.empty();
        buildIdentifierTestcase(tester.url, result.url);
        if (result.authors) {
          result.authors.length.should.gt(0);
          result.authors.forEach(author => author.should.not.empty());
        }
        if (tester.description) {
          buildIdentifierTestcase(tester.description, result.description);
        }
      });
    });
  });
}
