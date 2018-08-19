module.exports = {
  "parser": "typescript-eslint-parser",
  "parserOptions": {
    "ecmaVersion": 2018,
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
    "import/no-unresolved": "off",
    "no-console": "off",
    "no-undef": "off",
    "no-underscore-dangle": ["error", { "allowAfterThis": true, "allowAfterSuper": true }]
  }
};
