/**
 * @fileoverview Validate parameters alignment in JSDoc.
 * @author Automattic
 */
"use strict";

const { set } = require("lodash");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "layout",
        docs: {
            description: "Validate alignment in JSDoc blocks.",
            category: "JSDoc alignment",
            recommended: true,
        },
        fixable: "whitespace",
        schema: [],
    },

    create: function (context) {
        // variables should be defined here

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // console.log(context.getSourceCode());
        // console.log(context.getSourceCode().lines);
        // console.log(context.settings);
        // console.log(context.getAllComments());

        /**
         * Aux method until we consider the dev envs support `String.prototype.matchAll` (Node 12+).
         *
         * @param {string}   string   String that will be checked.
         * @param {RegExp}   regexp   Regular expression to run.
         * @param {Function} callback Function to be called each iteration.
         * @param {int}      limit    Limit of matches that we want to exec.
         */
        const matchAll = (string, regexp, callback, limit = Infinity) => {
            let result;
            let index = 0;

            while ((result = regexp.exec(string)) && index <= limit - 1) {
                callback(result, index++);
            }
        };

        /**
         * Get the expected positions for each part.
         *
         * @param {array[]} positionsMatrix Positions matrix.
         * @param {int[]}   partsMaxLength  Max length of each part.
         *
         * @return {int[]} Expected position for each part.
         */
        const getExpectedPositions = (positionsMatrix, partsMaxLength) =>
            partsMaxLength.slice(1).reduce(
                (acc, length, index) => [
                    ...acc,
                    acc[index] + partsMaxLength[index] + 1,
                ],
                [positionsMatrix[0][0]] // Start position based on the first line.
            );

        /**
         * Check is not aligned.
         *
         * @param {int[]}   expectedPositions Expected position for each part.
         * @param {array[]} positionsMatrix   Positions matrix.
         *
         * @return {boolean}
         */
        const isNotAligned = (expectedPositions, positionsMatrix) =>
            positionsMatrix.some((line) =>
                line.some(
                    (partPosition, partIndex) =>
                        partPosition !== expectedPositions[partIndex]
                )
            );

        /**
         * Check comment to see if it is aligned.
         *
         * @param {object} node    Current node object.
         * @param {object} context Current context.
         */
        const checkComment = (node, context) => {
            const comment = context.getJSDocComment(node);

            if (!comment) {
                return;
            }

            const paramLines = comment.value.match(/.*@param.*/gm);

            if (!paramLines) {
                return;
            }

            /**
             * A matrix containing the current position of each part for each line.
             * 0 - Asterisk.
             * 1 - Param tag.
             * 2 - Type.
             * 3 - Variable name.
             * 4 - Description (Optional).
             */
            const positionsMatrix = [];

            /**
             * The max length of each part, comparing all the lines.
             */
            const partsMaxLength = [];

            // Loop (lines x parts) to populate positionsMatrix and partsMaxLength.
            paramLines.forEach((lineString, lineIndex) => {
                // Loop through all parts until the first word of the description (if description exists).
                matchAll(
                    lineString,
                    /[\S]+/g,
                    ({ 0: { length }, index: position }, partIndex) => {
                        set(positionsMatrix, [lineIndex, partIndex], position);

                        const partLength = length;
                        const maxLength = partsMaxLength[partIndex];

                        partsMaxLength[partIndex] =
                            maxLength > partLength ? maxLength : partLength;
                    },
                    5
                );
            });

            const expectedPositions = getExpectedPositions(
                positionsMatrix,
                partsMaxLength
            );

            if (isNotAligned(expectedPositions, positionsMatrix)) {
                context.report(comment, "JSDoc params should be aligned");
            }
        };

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            //   "*:not(Program)"(node) {
            //     context.report(node, "JSDoc params should be aligned");
            //   },
            //   "Program:exit"(node) {
            //     // console.log(node);
            //     context.report(node, "JSDoc params should be aligned");
            //   },
            FunctionDeclaration(node) {
                checkComment(node, context);
            },
            ArrowFunctionExpression(node) {
                checkComment(node, context);
            },
            FunctionExpression(node) {
                checkComment(node, context);
            },
        };
    },
};
