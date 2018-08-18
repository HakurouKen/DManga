
import DmzjManga from './crawlers/manga/dmzj';

const manga = new DmzjManga('https://manhua.dmzj.com/yiquanchaoren');

manga.getInfo().then(console.log)
