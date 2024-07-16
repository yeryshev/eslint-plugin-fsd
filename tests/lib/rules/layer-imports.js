/**
 * @fileoverview FSD slice imports checker
 * @author Vadim Eryshev
 */
"use strict";

const rule = require('../../../lib/rules/layer-imports'),
RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

const aliasOptions = [
  {
    alias: '@',
  },
];

const errorMessage = [
  {
    messageId: 'notFromUnderlying',
  },
];

ruleTester.run('layer-imports', rule, {
  valid: [
    {
      filename: '/project/src/features/Article',
      code: "import { Button } from '@/shared/ui'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: '/project/src/features/Article',
      code: "import { addCommentFormActions } from '@/entities/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: '/project/src/app/providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: '/project/src/widgets/pages',
      code: "import { useLocation } from 'react-router-dom'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: '/project/src/app/providers',
      code: "import { addCommentFormActions } from 'redux'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: '/project/src/index.tsx',
      code: "import { StoreProvider } from '@/app/providers/StoreProvider';",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: '/project/src/entities/Article.tsx',
      code: "import { StateSchema } from '@/app/providers/StoreProvider'",
      errors: [],
      options: [
        {
          alias: '@',
          ignoreImportPatterns: ['**/StoreProvider'],
        },
      ],
    },
  ],

  invalid: [
    {
      filename: '/project/src/entities/providers',
      code: "import { addCommentFormActions } from '@/features/Article'",
      errors: errorMessage,
      options: aliasOptions,
    },
    {
      filename: '/project/src/features/providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Article'",
      errors: errorMessage,
      options: aliasOptions,
    },
    {
      filename: '/project/src/entities/providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Article'",
      errors: errorMessage,
      options: aliasOptions,
    },
  ],
});
