import program from 'commander';
import packageJson from 'pjson';
import { getConfig } from '../utils/cli';
import { use } from '../locales';

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
  .option('-d, --dest <dest>', 'download manga from url')
  .option('-q, --quiet', 'do not show download progress')
  .option(
    '-t --other-version <name>',
    'name or index of the version, only useful when downloading manga',
  )
  .action((url, cmd) => {
    const version = /^\d+$/.test(cmd.otherVersion || '')
      ? parseInt(cmd.otherVersion, 10)
      : cmd.otherVersion;
    interopRequire('./download')(url, { dest: cmd.dest, quiet: cmd.quiet, version });
  });

program.command('info <url>').action((url) => {
  interopRequire('./info')(url);
});

program
  .command('search <keyword>')
  .option('-s, --sites <sites>', 'sites')
  .action((keyword, cmd) => {
    const sites = cmd.sites ? cmd.sites.split(',') : [];
    interopRequire('./search')(keyword, sites);
  });

program
  .command('config [value]')
  .option('-s --set <path> <value>')
  .option('-g --get <path>')
  .action((value, cmd) => {
    interopRequire('./config')(value, { set: cmd.set, get: cmd.get });
  });

program.parse(process.argv);
