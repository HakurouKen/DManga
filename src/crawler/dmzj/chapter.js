import Chapter from 'lib/crawler/chapter';

class DmzjChapter extends Chapter {

    list(){
        const DOMAIN = this.constructor.IMAGE_DOMAIN;
        return this._cached_list = this._cached_list || this.$().then($ => {
            let script = $('script').eq(0).html();
            let chapter = (new Function(script + ' ;return arr_pages;'))();
            return chapter.map((img)=>{
                return DOMAIN + '/' + img;
            });
        });
    }
}

DmzjChapter.IMAGE_HOST = 'images.dmzj.com';
DmzjChapter.IMAGE_DOMAIN = 'http://' + DmzjChapter.IMAGE_HOST;

export default DmzjChapter;
