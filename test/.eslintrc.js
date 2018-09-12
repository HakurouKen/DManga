module.exports = {
  "env": {
    "mocha": true
  },
  "extends": "../.eslintrc.js",
  "rules": {
    "max-len": [ "error", 120 ],
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
