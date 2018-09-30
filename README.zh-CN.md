# DManga

[WIP]

搜索/下载漫画。

## 支持网站

- [新新漫画 www.177mh.net](http://www.177mh.net)
- [CC 漫画网 www.ccdm1.com](http://www.ccdm1.com)
- [漫画人 www.dm5.com](http://www.dm5.com)
- [动漫之家 manhua.dmzj.com](https://manhua.dmzj.com)
- [腐漫画 www.fmhua.com](http://www.fmhua.com)
- [汗汗酷漫 www.hhimm.com](http://www.hhimm.com)
- [漫画柜 www.manhuagui.com](https://www.manhuagui.com)
- [ 漫画台 www.manhuatai.com](http://www.manhuatai.com)
- [塔多漫画 taduo.net](http://www.taduo.net)
- [VERYDM verydm.com](http://www.verydm.com)

## 安装

```bash
npm install dmanga
```

## 使用

### 下载漫画

命令：

`download <url>`

参数：

- `-d, --dest <url>`: 下载目录
- `-q, --quiet`: 静默下载（不输出进度）

示例：

```bash
# 下载单个章节
dmanga download https://manhua.dmzj.com/xuejiezhanxian/37157.shtml -d 血界战线-第0话

# 下载整个漫画
dmanga download https://manhua.dmzj.com/xiawayuxiawa -d 夏娃与夏娃
```

### 输出信息

命令：

`info <url>`

示例：
```bash
dmanga info http://www.dm5.com/manhua-shanchangzhuolongrende-yuan-gaomutongxue/
```

### 搜索

命令：

`search <keyword>`

参数：

- `-s, --sites <sites>`: 需要搜索的站点（用逗号隔开）

示例：

```bash
# 在所有支持的站点中搜索
dmanga search 一拳超人
# 在指定网站搜索
dmanga search 灌篮高手 --sites 177mh,dmzj
```

## TODOS

- [] 完善不同版本的下载
- [] 格式化输出
