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

const options = [
  {
    alias: '@',
  },
]

ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      code: "import { User } from '@/entities/User';",
      errors: [],
    }
  ],

  invalid: [
    {
      code: "import { getUserData, getUserId } from '@/entities/User/model/selectors/userSelectors';",
      errors: [{messageId: 'notFromPublicApi'}],
      options,
    },
  ],
});
