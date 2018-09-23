import program from 'commander';
import packageJson from 'pjson';

/* eslint-disable global-require */
program.version(packageJson.version, '-v --version');

program
  .command('download <url>')
  .option('-d, --dest <dest>', 'download manga from url')
  .action((url, cmd) => {
    require('./download').default(url, cmd.dest);
  });

program.parse(process.argv);
