# DManga

Search And download mangas.

## Supports

- [www.177mh.net](http://www.177mh.net)
- [www.ccdm1.com](http://www.ccdm1.com)
- [www.dm5.com](http://www.dm5.com)
- [manhua.dmzj.com](https://manhua.dmzj.com)
- [www.fmhua.com](http://www.fmhua.com)
- [www.hhimm.com](http://www.hhimm.com)
- [www.manhuagui.com](https://www.manhuagui.com)
- [www.manhuatai.com](http://www.manhuatai.com)
- [taduo.net](http://www.taduo.net)
- [verydm.com](http://www.verydm.com)

## Install

```bash
npm install dmanga
```

## Usage

### Download

Command:

`download <url>`

Params：

- `-d, --dest <url>`: Download directory
- `-q, --quiet`: Download quietly(without progress).

Example:

```bash
# Download a single chapter.
dmanga download https://manhua.dmzj.com/xuejiezhanxian/37157.shtml -d 血界战线-第0话

# Download all
dmanga download https://manhua.dmzj.com/xiawayuxiawa -d 夏娃与夏娃
```

### Get Info

Command:

`info <url>`

Example:

```bash
dmanga info http://www.dm5.com/manhua-shanchangzhuolongrende-yuan-gaomutongxue/
```

### Search

Command:

`search <keyword>`

Params:

- `-s, --sites <sites>`: seperated by `,`.

Example:

```bash
# Search from all support sites.
dmanga search 一拳超人
# Search from specific sites.
dmanga search 灌篮高手 --sites 177mh,dmzj
```

### Config

`config`

Params:

- `-s, --set <key> <value>`: set config
- `-g, --get <key>`: get config

Example:

```bash
# show all configs
dmanga config
# set language
dmanga config -s lang en_US
# get language
dmanga config -g lang
```
