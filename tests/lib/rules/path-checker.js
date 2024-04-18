/**
 * @fileoverview feature sliced design relative path checker
 * @author Vadim Eryshev
 */
"use strict";

const rule = require("../../../lib/rules/path-checker"),
    RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

ruleTester.run("path-checker", rule, {
  valid: [
    {
      filename: `project/src/entities/Comment/model/services/deleteComment/deleteComment.ts`,
      code: `import { Comment } from '../../types/Comment';`,
      errors: [],
    },
  ],

  invalid: [
    {
      filename: `project/src/entities/Comment/model/services/deleteComment/deleteComment.ts`,
      code: `import { Comment } from '@/entities/Comment';`,
      errors: [{ message: `Import should be relative`}],
      options: [
        {
          alias: '@',
        },
      ],
    },
  ],
});
