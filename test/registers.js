require('babel-core/register');
const chai = require('chai');
chai.use(require('dirty-chai'));

global.should = chai.should();
