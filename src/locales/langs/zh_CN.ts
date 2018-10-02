export default {
  errors: {
    invalidURL: '{url} 不是一个合法的 URL.',
  },
  info: {
    name: '名称',
    url: 'URL',
    author: '作者',
    status: '状态',
    statusOngoing: '连载中',
    statusCompleted: '已完结',
    statusUnknown: '未知',
    description: '简介',
    totalChapters: '章节总数',
    otherVersions: '其他版本',
    latestChapter: '最新章节',
    none: '-',
  },
  config: {
    valueIsUndefined: '{key} 没有对应的值定义',
  },
  cli: {
    download: {
      description: '从指定 URL 下载漫画',
      dest: '下载到指定目录',
      quiet: '不显示下载进度',
      otherVersion: '版本的名称/序号，仅在下载整部漫画时有用',
    },
    info: {
      description: '显示漫画信息',
    },
    search: {
      description: '搜索漫画',
      sites: '从指定站点搜索',
    },
    config: {
      description: '读/写配置',
    },
  },
  downloadProgressBar: '正在下载{name}[:bar] :percent',
};
