module.exports = {
  "parser": "babel-eslint",
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
    "import",
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
    "no-restricted-syntax": [
      "error",
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      }
    ]
  },
  "overrides": [{
    "files": ["**/*.ts"],
    "parser": "typescript-eslint-parser",
    "rules": {
      "import/no-unresolved": "off",
      "no-undef": "off",
      "typescript/no-array-constructor": ["error"],
      "typescript/no-triple-slash-reference": ["error"],
      "typescript/no-unused-vars": ["error"]
    }
  }, {
    "files": ["scripts/**/*"],
    "rules": {
      "import/no-extraneous-dependencies": "off"
    }
  }]
};
