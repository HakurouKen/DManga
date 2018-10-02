export default {
  errors: {
    invalidURL: '{url} is not a valid URL.',
  },
  info: {
    name: 'Name',
    url: 'URL',
    author: 'Author',
    status: 'Status',
    statusOngoing: 'Ongoing',
    statusCompleted: 'Completed',
    statusUnknown: 'Unknown',
    description: 'Description',
    totalChapters: 'Total Chapters',
    otherVersions: 'Other Versions',
    latestChapter: 'Latest Chapter',
    none: '-',
  },
  config: {
    valueIsUndefined: 'Value for {key} is undefined.',
  },
  cli: {
    download: {
      description: 'download manga from url',
      dest: 'download to specific folder',
      quiet: 'do not show download progress',
      otherVersion: 'name or index of the version, only useful when downloading whole manga.',
    },
    info: {
      description: 'show manga info',
    },
    search: {
      description: 'search manga',
      sites: 'sites',
    },
    config: {
      description: 'get/set config',
    },
  },
  downloadProgressBar: 'Downloading {name}[:bar] :percent',
};
