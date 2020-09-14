# [DEPRECATED] eslint-plugin-jsdoc-alignment

JSDoc alignment rule for ESLint.

**[2020-09-14] This package was deprecated in favor of [this rule](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-line-alignment), introduced in `eslint-plugin-jsdoc` through [this PR](https://github.com/gajus/eslint-plugin-jsdoc/pull/636).**

This plugin was designed just to check the alignments for the tags `param`, `arg`, `argument`, `property`, and `prop`. It can be used along [eslint-plugin-jsdoc](https://www.npmjs.com/package/eslint-plugin-jsdoc).

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-jsdoc-alignment`:

```
$ npm install eslint-plugin-jsdoc-alignment --save-dev
```


## Usage

Add `jsdoc-alignment` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "jsdoc-alignment"
    ]
}
```


Then configure the rule to use under the rules section.

```json
{
    "rules": {
        "jsdoc-alignment/lines-alignment": 2
    }
}
```

## Supported Rules

* The only rule in this plugin is the `lines-alignment`. Check examples in the [`lines-alignment` rule documentation](https://github.com/Automattic/eslint-plugin-jsdoc-alignment/blob/master/docs/rules/lines-alignment.md).
