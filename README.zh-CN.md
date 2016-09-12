# Manga Downloader

从指定网站下载漫画。支持 [极速漫画](http://www.1kkk.com/), [动漫屋](http:www.dm5.com/), [动漫之家](http://manhua.dmzj.com/), [爱看漫](http://www.ikanman.com/)

## 安装
```bash
# 克隆项目
git clone https://github.com/HakurouKen/manga-downloader.git

# 切换到项目路径, 安装依赖
cd manga-downloader && npm install

# 采用短命令执行
npm link
```

## 使用方法

### 搜索
```bash
## manga search <keyword>
manga search 海贼王
```

### 下载
```bash
## manga download <网站/id> [--dist <下载路径>] [--chapter <指定章节>] [--index <目录>]

## 下载漫画(默认到当前路径下的 manga/ 文件夹)
manga download ikanman/1014

## 下载指定目录的指定章节
manga download ikanman/1014 --chapter 0 --index 1

## 下载到指定文件夹
manga download ikanman/1014 --dist /Users/username/manga/
```

### 查看漫画信息
```bash
## manga info <网站/id>
manga info ikanman/1014
```

### 查看目录
```bash
## manga list <网站/id>
manga list ikanman/1014
```
