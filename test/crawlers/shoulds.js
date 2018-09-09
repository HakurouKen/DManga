import { isImage, isExist } from '../utils';

export function shouldBeImage(filePath) {
  isImage(filePath).should.be.true();
}

export function shouldNotExist(filePath) {
  isExist(filePath).should.be.false();
}
