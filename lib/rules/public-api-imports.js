/**
 * @fileoverview The rule prohibits making imports from FSD modules directly
 * @author Vadim Eryshev
 */
"use strict";


const {isRelative} = require("../helpers");
const {isMatch} = require("micromatch");
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: "The rule prohibits making imports from FSD modules directly",
      recommended: false,
      url: null,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
          },
          testFilesPatterns: {
            type: 'array',
          },
        },
      },
    ],

    messages: {
      notFromPublicApi: 'Absolute import is allowed only from public API',
      testsNotFromPublicApi: 'Import from testing is allowed only from public API',
    }
  },

  create(context) {
    const { alias = '', testFilesPatterns = [] } = context.options[0] ?? {};

    const allowedLayers = {
      'pages': 'pages',
      'widgets': 'widgets',
      'features': 'features',
      'entities': 'entities',
    }

    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        if (isRelative(importTo)) {
          return;
        }

        // [entities, user, model, types]
        const segments = importTo.split('/');
        const layer = segments[0];

        if (!allowedLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;
        // [entities, user, testing]
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4;

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({node: node, messageId: `notFromPublicApi`});
        }

        if (isTestingPublicApi) {
          const currentFilePath = context.getFilename();

          const isCurrentFileTesting = testFilesPatterns.find(pattern => isMatch(currentFilePath, pattern));

          if (!isCurrentFileTesting) {
            context.report({node: node, messageId: `testsNotFromPublicApi`});
          }
        }
      }
    };
  },
};
