module.exports = {
  "env": {
    "mocha": true
  },
  "extends": "../.eslintrc.js",
  "rules": {
    "prefer-arrow-callback": "off",
    "promise/always-return": "off",
    "promise/no-callback-in-promise": "off"
  },
  "settings": {
    "import/resolver": {
      "babel-module": {
        "root": ["./lib"]
      }
    }
  }
}
