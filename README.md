# @eryshev/eslint-plugin-fsd

ESLint rules for Feature-Sliced Design.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `@eryshev/eslint-plugin-fsd`:

```sh
npm install @eryshev/eslint-plugin-fsd --save-dev
```

## Usage

Add `@eryshev/eslint-plugin-fsd` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": ["@eryshev/fsd"]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
      "@eryshev/fsd/path-checker": "error"
    }
}
```

Use alias paths.

```json
{
  "rules": {
    "@eryshev/fsd/path-checker": ["error", { "alias": "@" }],
  }
}
```