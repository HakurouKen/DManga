module.exports = {
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
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
    "no-console": "off",
    "no-underscore-dangle": ["error", { "allowAfterThis": true, "allowAfterSuper": true }],
  },
  "overrides": {
    "files": ["**/*.ts"],
    "parser": "typescript-eslint-parser",
    "rules": {
      "import/no-unresolved": "off",
      "no-undef": "off",
      "typescript/no-unused-vars": ["error"]
    }
  }
};
