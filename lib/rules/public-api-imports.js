/**
 * @fileoverview The rule prohibits making imports from FSD modules directly
 * @author Vadim Eryshev
 */
"use strict";


const {isRelative} = require("../helpers");
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
        },
      },
    ],

    messages: {
      notFromPublicApi: 'Absolute import is allowed only from public API'
    }
  },

  create(context) {
    const alias = context.options.length > 0 ? context.options[0].alias : '';

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

        // [entities, Comment, model, types]
        const segments = importTo.split('/');
        const isImportNotFromPublicApi = segments.length > 2;

        const layer = segments[0];

        if (!allowedLayers[layer]) {
          return;
        }

        if (isImportNotFromPublicApi) {
          context.report({node: node, messageId: `notFromPublicApi`});
        }
      }
    };
  },
};
