
export function capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// use to add left padding on index, to make sure the directionary always in current order.
export function indexPad(str){
    str = str + '';
    let pad = "0000"
    return pad.substring(0, pad.length - str.length) + str
}

export class NotImplementedError extends Error {
    constructor(name,fileName,lineNumber){
        let message = name ? `${name} is not implemented.` : '';
        super(message,fileName,lineNumber);
    }
}
