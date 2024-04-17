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
        const { value } = node.source;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;
        const fileName = context.getFilename();

        if (shouldBeRelative(fileName, importTo)) {
          context.report(node, `${importTo} should be relative to ${fileName}`);
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
  const toArray = to.split('/')
  const toLayer = toArray[0];
  const toSlice = toArray[1];

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const normalizedFrom = path.toNamespacedPath(from);
  const projectFrom = normalizedFrom.split('src')[1];

  const fromArray = projectFrom.split('\\');

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return toLayer === fromLayer && toSlice === fromSlice;
}