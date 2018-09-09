import fs from 'fs';
import isImage from 'is-image';

export { isImage };

export function isExist(filePath) {
  return fs.existsSync(filePath);
}
