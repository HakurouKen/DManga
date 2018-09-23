import program from 'commander';
import packageJson from 'pjson';

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
  .action((url, cmd) => {
    interopRequire('./download')(url, cmd.dest);
  });

program.command('info <url>').action((url) => {
  interopRequire('./info')(url);
});

program.parse(process.argv);
