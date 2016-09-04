import { i18n } from 'lib/i18n';

const MESSAGE = i18n.MESSAGE;

export class IndexError extends Error {
    constructor(id,fileName,lineNumber){
        let message = typeof id === 'undefined' ? MESSAGE.INDEX_ERROR : MESSAGE.INDEX_ERROR_WITH_ID.format(id);
        super(message,fileName,lineNumber);
    }
};
export class ChapterError extends Error {
    constructor(id,fileName,lineNumber){
        let message = typeof id === 'undefined' ? MESSAGE.CHAPTER_ERROR : MESSAGE.CHAPTER_ERROR_WITH_ID.format(id);
        super(message,fileName,lineNumber);
    }
};
