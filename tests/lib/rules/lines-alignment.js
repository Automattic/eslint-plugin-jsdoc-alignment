/**
 * @fileoverview Validate parameters alignment in JSDoc.
 * @author Automattic
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/lines-alignment"),
    RuleTester = require("eslint").RuleTester;

RuleTester.setDefaultConfig({
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
    },
});

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("lines-alignment", rule, {
    valid: [
        `
        /**
         * Function description.
         *
         * @param {string} lorem Description.
         * @param {int}    sit   Description multi words.
         */
        const fn = ( lorem, sit ) => {}
        `,
        `
        /**
         * @param {string} lorem Description.
         * @param {int}    sit
         */
        const fn = ( lorem, sit ) => {}
        `,
        `
        /**
         * @param {int}    sit
         * @param {string} lorem Description.
         */
        const fn = ( lorem, sit ) => {}
        `,
        `
        /**
         * No params.
         */
        const fn = ( lorem, sit ) => {}
        `,
        `
        const fn = ( lorem, sit ) => {}
        `,
        `
        /**
         * Function description.
         *
         * @param {string} lorem Description.
         * @param {int}    sit   Description multi words.
         */
        function fn( lorem, sit ) {}
        `,
        `
        const object = {
            /**
             * Function description.
             *
             * @param {string} lorem Description.
             * @param {int}    sit   Description multi words.
             */
            fn( lorem, sit ) {},
        }
        `,
        `
        class ClassName {
            /**
             * Function description.
             *
             * @param {string} lorem Description.
             * @param {int}    sit   Description multi words.
             */
            fn( lorem, sit ) {}
        }
        `,
        `
        /**
         * Function description.
         *
         * @arg {string} lorem Description.
         * @arg {int}    sit   Description multi words.
         */
        const fn = ( lorem, sit ) => {}
        `,
    ],

    invalid: [
        {
            code: `
            /**
             * Function description.
             *
             * @param {string} lorem Description.
             * @param {int} sit Description multi words.
             */
            const fn = ( lorem, sit ) => {}
            `,
            output: `
            /**
             * Function description.
             *
             * @param {string} lorem Description.
             * @param {int}    sit   Description multi words.
             */
            const fn = ( lorem, sit ) => {}
            `,
            errors: [
                {
                    message: "JSDoc lines should be aligned",
                    type: "Block",
                },
            ],
        },
        {
            code: `
            /**
             * Function description.
             *
             * @param {string} lorem Description.
             * @param {int} sit Description multi words.
             */
            const fn = ( lorem, sit ) => {}
            `,
            output: `
            /**
             * Function description.
             *
             * @param {string} lorem Description.
             * @param {int}    sit   Description multi words.
             */
            const fn = ( lorem, sit ) => {}
            `,
            errors: [
                {
                    message: "JSDoc lines should be aligned",
                    type: "Block",
                },
            ],
        },
        {
            code: `
            /**
             * Function description.
             *
             * @param  {string} lorem Description.
             *  @param {int}    sit   Description multi words.
             */
            const fn = ( lorem, sit ) => {}
            `,
            output: `
            /**
             * Function description.
             *
             * @param {string} lorem Description.
             * @param {int}    sit   Description multi words.
             */
            const fn = ( lorem, sit ) => {}
            `,
            errors: [
                {
                    message: "JSDoc lines should be aligned",
                    type: "Block",
                },
            ],
        },
        {
            code: `
            /**
             * Function description.
             *
             * @param  {string} lorem Description.
              * @param {int}    sit   Description multi words.
             */
            const fn = ( lorem, sit ) => {}
            `,
            output: `
            /**
             * Function description.
             *
             * @param {string} lorem Description.
             * @param {int}    sit   Description multi words.
             */
            const fn = ( lorem, sit ) => {}
            `,
            errors: [
                {
                    message: "JSDoc lines should be aligned",
                    type: "Block",
                },
            ],
        },
        {
            code: `
            /**
             * Function description.
             *
             * @param  {string} lorem Description.
             * @param  {int}    sit   Description multi words.
             */
            const fn = ( lorem, sit ) => {}
            `,
            output: `
            /**
             * Function description.
             *
             * @param {string} lorem Description.
             * @param {int}    sit   Description multi words.
             */
            const fn = ( lorem, sit ) => {}
            `,
            errors: [
                {
                    message: "JSDoc lines should be aligned",
                    type: "Block",
                },
            ],
        },
        {
            code: `
            /**
             * Function description.
             *
             * @param {string} lorem Description.
             * @param {int} sit Description multi words.
             */
            function fn( lorem, sit ) {}
            `,
            output: `
            /**
             * Function description.
             *
             * @param {string} lorem Description.
             * @param {int}    sit   Description multi words.
             */
            function fn( lorem, sit ) {}
            `,
            errors: [
                {
                    message: "JSDoc lines should be aligned",
                    type: "Block",
                },
            ],
        },
        {
            code: `
            const object = {
                /**
                 * Function description.
                 *
                 * @param {string} lorem Description.
                 * @param {int} sit Description multi words.
                 */
                fn( lorem, sit ) {}
            }
            `,
            output: `
            const object = {
                /**
                 * Function description.
                 *
                 * @param {string} lorem Description.
                 * @param {int}    sit   Description multi words.
                 */
                fn( lorem, sit ) {}
            }
            `,
            errors: [
                {
                    message: "JSDoc lines should be aligned",
                    type: "Block",
                },
            ],
        },
        {
            code: `
            class ClassName {
                /**
                 * Function description.
                 *
                 * @param {string} lorem Description.
                 * @param {int} sit Description multi words.
                 */
                fn( lorem, sit ) {}
            }
            `,
            output: `
            class ClassName {
                /**
                 * Function description.
                 *
                 * @param {string} lorem Description.
                 * @param {int}    sit   Description multi words.
                 */
                fn( lorem, sit ) {}
            }
            `,
            errors: [
                {
                    message: "JSDoc lines should be aligned",
                    type: "Block",
                },
            ],
        },
        {
            code: `
            /**
             * Function description.
             *
             * @arg {string} lorem Description.
             * @arg {int} sit Description multi words.
             */
            const fn = ( lorem, sit ) => {}
            `,
            output: `
            /**
             * Function description.
             *
             * @arg {string} lorem Description.
             * @arg {int}    sit   Description multi words.
             */
            const fn = ( lorem, sit ) => {}
            `,
            errors: [
                {
                    message: "JSDoc lines should be aligned",
                    type: "Block",
                },
            ],
        },
    ],
});
