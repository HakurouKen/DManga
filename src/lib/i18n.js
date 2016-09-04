
class Message {
    constructor(message=''){
        this.message = message;
    }

    toString(){
        return this.message;
    }

    format(...values){
        return this.message.replace(
            Message.PLACEHOLDER,
            (_,index) => values[Number(index)]
        );
    }
}

Message.PLACEHOLDER = /\{(\d+)\}/g;

function type(o){
    return Object.prototype.toString.call(o).slice(8,-1).toLowerCase();
}

class I18n {
    constructor(locale='zh-CN'){
        this.locale = locale;
        this._CACHE = {};
        this._build_messages();
    }

    static _build_message(o){
        if (type(o) === 'object') {
            return Object.keys(o).reduce((ret,key) => {
                ret[key] = I18n._build_message(o[key]);
                return ret;
            },{});
        } else if (type(o) === 'array') {
            return o.map(obj => {
                return I18n._build_message(obj);
            });
        } else {
            return new Message((o || '').toString());
        }
    }

    _build_messages(){
        try {
            if (!this._CACHE[this.locale]) {
                let message = require(`./locale/${this.locale}.json`);
                return this.MESSAGE = this._CACHE[this.locale] = I18n._build_message(message);
            } else {
                return this._CACHE[this.locale];
            }
        } catch(e) {
            if (e.code === 'MODULE_NOT_FOUND') {
                if (this.locale !== 'zh-CN') {
                    console.warn(`Locale not support, fallback to default 'zh-CN'`);
                    return this.use('zh-CN');
                } else {
                    throw new Error('Locale not found.');
                }
            } else {
                throw e;
            }
        }
    }

    use(locale){
        this.locale = locale;
        this._build_messages();
    }
}

export const i18n = new I18n();
