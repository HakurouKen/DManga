#!/usr/bin/env node

import program from 'commander';
import packageJson from 'pjson';
import { getConfig } from '../utils/cli';
import { use, t } from '../locales';

const lang = getConfig('lang');
use(lang);

/* eslint-disable global-require, import/no-dynamic-require */
function interopRequire(id: string) {
  const pkg = require(id);
  // eslint-disable-next-line no-underscore-dangle
  return pkg && pkg.__esModule ? pkg.default : pkg;
}
/* eslint-enable global-require, import/no-dynamic-require */
program.version(packageJson.version, '-v --version');

program
  .command('download <url>')
  .description(t('cli.download.description'))
  .option('-d, --dest <dest>', t('cli.download.dest'))
  .option('-q, --quiet', t('cli.download.quiet'))
  .option('-t --other-version <name>', t('cli.download.otherVerison'))
  .action((url, cmd) => {
    const version = /^\d+$/.test(cmd.otherVersion || '')
      ? parseInt(cmd.otherVersion, 10)
      : cmd.otherVersion;
    interopRequire('./download')(url, { dest: cmd.dest, quiet: cmd.quiet, version });
  });

program
  .command('info <url>')
  .description(t('cli.info.description'))
  .action((url) => {
    interopRequire('./info')(url);
  });

program
  .command('search <keyword>')
  .description(t('cli.search.description'))
  .option('-s, --sites <sites>', t('cli.search.sites'))
  .action((keyword, cmd) => {
    const sites = cmd.sites ? cmd.sites.split(',') : [];
    interopRequire('./search')(keyword, sites);
  });

program
  .command('config [value]')
  .description(t('cli.config.description'))
  .option('-s, --set <path> <value>')
  .option('-g, --get <path>')
  .action((value, cmd) => {
    interopRequire('./config')(value, { set: cmd.set, get: cmd.get });
  });

program.parse(process.argv);
