import crypto from 'crypto-js';

import Chapter from 'lib/crawler/chapter';

class ImanhuaChapter extends Chapter {

    static decryptDES(encrypted) {
        let decrypted = crypto.DES.decrypt({
            ciphertext: crypto.enc.Base64.parse(encrypted.substring(8))
        }, crypto.enc.Utf8.parse(encrypted.substring(0, 8)), {
            mode: crypto.mode.ECB,
            padding: crypto.pad.Pkcs7
        });
        return decrypted.toString(crypto.enc.Utf8);
    }

    static encodeCNURI(url){
        const CN_EXP = /[\u4e00-\u9fa5]/;
        return CN_EXP.test(url) ? encodeURIComponent(url) : url;
    }

    list(){
        const ENCRYPTED = /eval\(decryptDES\('(.*)'\)\)/;
        const self = this.constructor;
        return this._cached_list = this._cached_list || this.$().then($ => {
            let $scripts = $('script').not('[src]');
            let key = null;
            for (let i = 0; i < $scripts.length; i++) {
                let script = $scripts[i].children[0].data;
                key = (script.match(ENCRYPTED) || [])[1];
                if (key) break;
            }
            let code = self.decryptDES(key);
            let info = (new Function(code + ' ;return cInfo;'))();
            return info.files.map((file) => {
                let route = info.path.split('/').map(self.encodeCNURI).join('/');
                return self.IMAGE_DOMAIN + route + self.encodeCNURI(file);
            });
        });
    }
}

ImanhuaChapter.IMAGE_DOMAIN = 'http://p.3qfm.com';

export default ImanhuaChapter;
