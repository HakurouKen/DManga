# Manga Downloader

Download manga from specific websites. Support [1kkk](http://www.1kkk.com/), [dm5](http://www.dm5.com/), [dmzj](http://manhua.dmzj.com/), [ikanman](http://www.ikanman.com/)


## Installation
```bash
# clone the project
git clone https://github.com/HakurouKen/manga-downloader.git

# change directory to the project and install dependenies
cd manga-downloader && npm install

# global link
npm link
```

## Usage

### Search
```bash
## manga search <keyword>
manga search 海贼王
```

### Download
```bash
## manga download <website/id> [--dist <download path>] [--chapter <chapter index>] [--index <table of contents index>]

## Download manga(to manga/ folder as default)
manga download ikanman/1014

## Download specific chapter
manga download ikanman/1014 --chapter 0 --index 1

## Download to specific folder
manga download ikanman/1014 --dist /Users/username/manga/
```

### Show details of manga
```bash
## manga info <website/id>
manga info ikanman/1014
```

### List the indexes
```bash
## manga list <website/id>
manga list ikanman/1014
```

## Config
Change global config at file `bin/manga.config.js`. Only support `language`，chosen from `zh-CN`(as default) and `en-US` at present.
