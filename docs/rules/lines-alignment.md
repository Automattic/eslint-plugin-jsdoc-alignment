# Validate lines alignment in JSDoc. (lines-alignment)

This rule checks the alignment of the JSDoc lines, to follow [standards such as WordPress](https://make.wordpress.org/core/handbook/best-practices/inline-documentation-standards/javascript/#aligning-comments).

## Rule Details

Examples of **incorrect** code for this rule:

```js
/**
 * Function description.
 *
 * @param {string} lorem Description.
 * @param {int} sit Description multi words.
 */
const fn = ( lorem, sit ) => {}
```

```js
/**
 * My object.
 *
 * @typedef {Object} MyObject
 *
 * @property {string} lorem Description.
 * @property {int} sit Description multi words.
 */
```

Examples of **correct** code for this rule:

```js
/**
 * Function description.
 *
 * @param {string} lorem Description.
 * @param {int}    sit   Description multi words.
 */
const fn = ( lorem, sit ) => {}
```

```js
/**
 * My object.
 *
 * @typedef {Object} MyObject
 *
 * @property {string} lorem Description.
 * @property {int}    sit   Description multi words.
 */
```

## Further Reading

For other JSDoc rules, you can install [eslint-plugin-jsdoc](https://www.npmjs.com/package/eslint-plugin-jsdoc).
