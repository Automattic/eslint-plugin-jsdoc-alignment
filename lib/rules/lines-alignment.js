/**
 * @fileoverview Validate lines alignment in JSDoc.
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
            description: "Check lines alignment in JSDoc blocks.",
            category: "JSDoc alignment",
            recommended: true,
        },
        fixable: "whitespace",
        schema: [],
    },

    create: function (context) {
        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Create a sequence of chars with a specific size.
         *
         * @param {string} char   The char.
         * @param {int}    length The length.
         */
        const createSequence = (char, length) =>
            new Array(length + 1).join(char);

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
         * Get the full description from a line.
         *
         * @param {string} lineString The line string.
         *
         * @return {string} The full description.
         */
        const getFullDescription = (lineString) =>
            /[\S]+[\s]+[\S]+[\s]+[\S]+[\s]+[\S]+[\s]+(.*)/.exec(lineString)[1];

        /**
         * Get the expected positions for each part.
         *
         * @param {array[]} partsMatrix    Parts matrix.
         * @param {int[]}   partsMaxLength Max length of each part.
         *
         * @return {int[]} Expected position for each part.
         */
        const getExpectedPositions = (partsMatrix, partsMaxLength) =>
            partsMaxLength.reduce(
                (acc, cur, index) => [...acc, cur + acc[index] + 1],
                [partsMatrix[0][0].position]
            );

        /**
         * Check is not aligned.
         *
         * @param {int[]}   expectedPositions Expected position for each part.
         * @param {array[]} partsMatrix       Parts matrix.
         *
         * @return {boolean}
         */
        const isNotAligned = (expectedPositions, partsMatrix) =>
            partsMatrix.some((line) =>
                line.some(
                    ({ position }, partIndex) =>
                        position !== expectedPositions[partIndex]
                )
            );

        /**
         * Check comment per tag.
         *
         * @param {Object} comment Comment node.
         * @param {string} tag     Tag string.
         */
        const checkCommentPerTag = (comment, tag) => {
            const lineRegExp = new RegExp(`.*@${tag}[\\s].*`, "gm");
            const lines = comment.value.match(lineRegExp);

            if (!lines) {
                return;
            }

            /**
             * A matrix containing the current position and the string of each part for each line.
             * 0 - Asterisk.
             * 1 - Tag.
             * 2 - Type.
             * 3 - Variable name.
             * 4 - Description (Optional).
             */
            const partsMatrix = [];

            /**
             * The max length of each part, comparing all the lines.
             */
            const partsMaxLength = [];

            // Loop (lines x parts) to populate partsMatrix and partsMaxLength.
            lines.forEach((lineString, lineIndex) => {
                matchAll(
                    lineString,
                    /[\S]+/g, // All line parts until the first word of the description (if description exists).
                    ({ 0: match, index: position }, partIndex) => {
                        set(partsMatrix, [lineIndex, partIndex], {
                            position,
                            string:
                                partIndex !== 4
                                    ? match
                                    : getFullDescription(lineString),
                        });

                        const partLength = match.length;
                        const maxLength = partsMaxLength[partIndex];

                        partsMaxLength[partIndex] =
                            maxLength > partLength ? maxLength : partLength;
                    },
                    5
                );
            });

            const expectedPositions = getExpectedPositions(
                partsMatrix,
                partsMaxLength
            );

            const originalIndentation = /[\s]+/.exec(lines[0]);

            if (isNotAligned(expectedPositions, partsMatrix)) {
                context.report({
                    message: "JSDoc lines should be aligned",
                    node: comment,
                    fix: createFixer(
                        comment,
                        expectedPositions,
                        partsMatrix,
                        lineRegExp,
                        originalIndentation
                    ),
                });
            }
        };

        /**
         * Check comment to see if it is aligned.
         *
         * @param {object} comment Comment node object.
         */
        const checkComment = (comment) => {
            if (!comment) {
                return;
            }

            ["param", "arg", "argument", "property", "prop"].forEach((tag) => {
                checkCommentPerTag(comment, tag);
            });
        };

        /**
         * Fix function creator for the report. It creates a function which fix
         * the JSDoc with the correct alignment.
         *
         * @param {Object}  comment             Comment node.
         * @param {int[]}   expectedPositions   Array with the expected positions.
         * @param {array[]} partsMatrix         Parts matrix.
         * @param {RegExp}  lineRegExp          Line regular expression.
         * @param {string}  originalIndentation Original indentation.
         *
         * @return {Function} Function which fixes the JSDoc alignment.
         */
        const createFixer = (
            comment,
            expectedPositions,
            partsMatrix,
            lineRegExp,
            originalIndentation
        ) => (fixer) => {
            let lineIndex = 0;

            // Replace every line with the correct spacings.
            const fixed = comment.value.replace(lineRegExp, (match) =>
                partsMatrix[lineIndex++].reduce(
                    (acc, { string }, index) =>
                        acc +
                        (index === 0
                            ? originalIndentation // Start with the original indentation if it's the first part.
                            : createSequence(
                                  " ",
                                  expectedPositions[index] - acc.length
                              )) +
                        string,
                    ""
                )
            );

            return fixer.replaceText(comment, "/*" + fixed + "*/");
        };

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            "Program:exit"() {
                context.getAllComments().map(checkComment);
            },
        };
    },
};
