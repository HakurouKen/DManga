module.exports = {
  "parser": "typescript-eslint-parser",
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "modules": true
    },
  },
  "env": {
    "node": true,
    "es6": true
  },
  "extends": [
    "airbnb-base",
    "plugin:promise/recommended"
  ],
  "plugins": [
    "promise",
    "typescript"
  ],
  "rules": {
    "no-undef": ["off"],
    "no-console": ["off"]
  }
};
