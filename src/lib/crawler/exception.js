import { i18n } from 'lib/i18n';

const MESSAGE = i18n.MESSAGE;

export class IndexError extends Error {
    constructor(id,fileName,lineNumber){
        let message = typeof id === 'undefined' ? MESSAGE.ERRORS.INDEX_ERROR : MESSAGE.ERRORS.INDEX_ERROR_WITH_ID.format(id);
        super(message,fileName,lineNumber);
    }
};
export class ChapterError extends Error {
    constructor(id,fileName,lineNumber){
        let message = typeof id === 'undefined' ? MESSAGE.ERRORS.CHAPTER_ERROR : MESSAGE.ERRORS.CHAPTER_ERROR_WITH_ID.format(id);
        super(message,fileName,lineNumber);
    }
};
