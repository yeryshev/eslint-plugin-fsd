/**
 * @fileoverview feature sliced design relative path checker
 * @author Vadim Eryshev
 */
"use strict";

const path = require("path");

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: "Feature sliced design relative path checker",
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
    ]
  },

  create(context) {
    const alias = context.options.length > 0 ? context.options[0].alias : '';

    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;
        const fileName = context.getFilename();

        if (shouldBeRelative(fileName, importTo)) {
          context.report(node, `Import should be relative`);
        }
      }
    };
  },
};

function isRelative(path) {
  return path.startsWith('.') || path.startsWith('./') || path.startsWith('../');
}

const layers = {
  'pages': 'pages',
  'widgets': 'widgets',
  'features': 'features',
  'entities': 'entities',
  'shared': 'shared',
}

function shouldBeRelative(from, to) {
  if (isRelative(to)) {
    return false;
  }

  // example entities/Comment
  const toArray = to.split(path.sep);
  const toLayer = toArray[0]; // entities
  const toSlice = toArray[1]; // Comment

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const fromArray = from.split(path.sep);
  const srcPosition = fromArray.lastIndexOf('src');
  const projectFrom = fromArray.slice(srcPosition + 1);

  const fromLayer = projectFrom[0];
  const fromSlice = projectFrom[1];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  if (toLayer === 'shared' && fromLayer === 'shared') {
    return false;
  }

  return fromSlice === toSlice && fromLayer === toLayer;
}