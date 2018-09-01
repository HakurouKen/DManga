const path = require('path');
const klawSync = require('klaw-sync');
const fsExtra = require('fs-extra');
const ejs = require('ejs');

function generate(src, dest, data = {}) {
  const files = klawSync(src, { nodir: true });
  files.forEach((file) => {
    const content = fsExtra.readFileSync(file.path, { encoding: 'utf8' });
    const relativePath = path.relative(src, file.path);
    const result = ejs.render(content, data);
    const destFile = path.join(dest, relativePath);
    fsExtra.ensureDirSync(path.dirname(destFile));
    fsExtra.writeFileSync(destFile, result);
  });
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function main() {
  const name = process.argv[2];
  if (!name) {
    console.log('Name Required');
    process.exit(1);
  }
  generate(path.join(__dirname, 'templates'), path.join(__dirname, '..', `src/crawlers/${name}`), {
    name: {
      capitalized: capitalize(name),
      normal: name,
    },
  });
}

main();
