module.exports = {
  "parser": "@babel/eslint-parser",
  "settings": {
      "react": {
          "version": "detect"
      }
  },
  "env": {
      "browser": true,
      "es2021": true
  },
  "extends": [
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:testing-library/react"
  ],
  "parserOptions": {
      "sourceType": "module"
  },
  "rules": {
    "no-console": 0,
    "no-debugger": 0
  }
};