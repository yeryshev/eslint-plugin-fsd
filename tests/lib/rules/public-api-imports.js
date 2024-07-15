/**
 * @fileoverview The rule prohibits making imports from FSD modules directly
 * @author Vadim
 */
"use strict";

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;


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
const optionsTestFiles = [
  {
    alias: '@',
    testFilesPatterns: ['**/*.test.*', '**/*.stories.*', '**/StoreDecorator.tsx', '**/*.testing.ts'],
  },
];

ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      code: "import { User } from '@/entities/User';",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: '/project/src/entities/file.test.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: optionsTestFiles,
    },
  ],

  invalid: [
    {
      filename: '/project/src/entities/forbidden.ts',
      code: "import { getUserData, getUserId } from '@/entities/User/model/selectors/userSelectors';",
      errors: [{messageId: 'notFromPublicApi'}],
      options: aliasOptions,
    },
    {
      filename: '/project/src/entities/StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/Article.tsx';",
      errors: [{messageId: 'notFromPublicApi'}],
      options: optionsTestFiles,
    },
    {
      filename: '/project/src/entities/forbidden.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing';",
      errors: [{messageId: 'testsNotFromPublicApi'}],
      options: optionsTestFiles,
    },
    {
      filename: '/project/src/entities/forbidden.ts',
      code: "import { addCommentFormActions } from '@/entities/Article/testing'",
      errors: [{messageId: 'testsNotFromPublicApi'}],
      options: optionsTestFiles,
    },
  ],
});
