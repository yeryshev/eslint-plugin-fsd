const path = require('path');
const { isPathRelative } = require('../helpers');
const micromatch = require('micromatch');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'The rule prohibits imports from higher-level layers',
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
          ignoreImportPatterns: {
            type: 'array',
          },
        },
      },
    ],
    messages: {
      notFromUnderlying: 'The layer can only import underlying layers into itself.',
    },
  },

  create(context) {
    const layers = {
      app: ['pages', 'widgets', 'features', 'shared', 'entities'],
      pages: ['widgets', 'features', 'shared', 'entities'],
      widgets: ['features', 'shared', 'entities'],
      features: ['shared', 'entities'],
      entities: ['shared', 'entities'],
      shared: ['shared'],
    };

    const availableLayers = {
      app: 'app',
      entities: 'entities',
      features: 'features',
      shared: 'shared',
      pages: 'pages',
      widgets: 'widgets',
    };

    const { alias = '', ignoreImportPatterns = [] } = context.options[0] ?? {};

    const getCurrentFileLayer = () => {
      const currentFilePath = context.getFilename();

      const normalizedPath = path.toNamespacedPath(currentFilePath);
      const projectPath = normalizedPath?.split('src')[1];
      const segments = projectPath?.split('\\');

      return segments?.[1];
    };

    const getImportLayer = (value) => {
      const importPath = alias ? value.replace(`${alias}/`, '') : value;
      const segments = importPath?.split('/');

      return segments?.[0];
    };

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFileLayer = getCurrentFileLayer();
        const importLayer = getImportLayer(importPath);

        if (isPathRelative(importPath)) {
          return;
        }

        if (!availableLayers[importLayer] || !availableLayers[currentFileLayer]) {
          return;
        }

        const isIgnored = ignoreImportPatterns.some((pattern) => {
          return micromatch.isMatch(importPath, pattern);
        });

        if (isIgnored) {
          return;
        }

        if (!layers[currentFileLayer]?.includes(importLayer)) {
          context.report({
            node: node,
            messageId: 'notFromUnderlying',
          });
        }
      },
    };
  },
};
