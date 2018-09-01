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
    "func-names": "off",
    "import/prefer-default-export": "off",
    "no-await-in-loop": "off",
    "no-console": "off",
    "no-plusplus": "off",
    "no-underscore-dangle": ["error", { "allowAfterThis": true, "allowAfterSuper": true }],
  },
  "overrides": [{
    "files": ["**/*.ts"],
    "parser": "typescript-eslint-parser",
    "rules": {
      "import/no-unresolved": "off",
      "no-undef": "off",
      "typescript/no-unused-vars": ["error"]
    }
  }, {
    "files": ["scripts/**/*"],
    "rules": {
      "import/no-extraneous-dependencies": "off"
    }
  }]
};
