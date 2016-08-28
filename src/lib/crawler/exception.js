
export class IndexError extends Error {
    constructor(id,fileName,lineNumber){
        let message = typeof id === 'undefined' ? 'Index not found.' : `Index ${id} not found.`;
        super(message,fileName,lineNumber);
    }
};
export class ChapterError extends Error {
    constructor(id,fileName,lineNumber){
        let message = typeof id === 'undefined' ? 'Chapter not found.' : `Chapter ${id} not found.`;
        super(message,fileName,lineNumber);
    }
};