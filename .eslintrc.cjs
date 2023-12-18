/* eslint-disable sort-keys */
module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    jasmine: true,
  },

  ignorePatterns: [
    "package-lock.json",
    "yarn.lock",
    "**/LICENSE",
    "**/Dockerfile",
    "**/*.Dockerfile",
    "**/*.{d.ts,d.mts,log,txt,webp,jpg,jpeg,png,gif,mp3,mp4,ico,webmanifest}",
    "**/*.d.ts",
    "**/*.d.mts",
    "**/*.txt",
    "**/*.jpg",
    "**/*.png",
    "**/*.webp",
    "**/*.ico",
    "**/*.webmanifest",
    "**/*.css",
    "**/*.scss",
    "**/webpack.config.ts",
    "**/*.html",
    "**/templates/*",
  ],

  plugins: [
    "@typescript-eslint/eslint-plugin",
    "import",
    "@angular-eslint/eslint-plugin",
    // linting Angular templates
    "@angular-eslint/eslint-plugin-template",
    // prefer arrow function
    "prefer-arrow",
    // best practices for regexp rules and avoid wrong regexp definitions
    "regexp",
    // removes the unused imports
    "unused-imports",
    "unicorn",
    // supports require(), import and webpack aliases
    "require-path-exists",
    "json",
    // linting package.json
    "json-files",
    // linting rules fore nodejs, forked from  eslint-plugin-node
    "n",
    // finds common security issues
    "@microsoft/eslint-plugin-sdl",
    // use 'const' only at the top-level of a module's scope, and 'let' anywhere else
    // set the rule `prefer-const: off`
    "prefer-let",
    // searches for secrets
    "no-secrets",
    "security-node",
    "yaml",
    "anti-trojan-source",
    // sort export statements
    "sort-export-all",
    // identify patterns that will interfere with the tree-shaking algorithm of their module bundler (i.e. rollup or webpack)
    "tree-shaking",
    // Detects when a module has been imported and not listed as a dependency in package.json.
    "implicit-dependencies",
    "@html-eslint",
    "prettier",
    "css",
    // todo: css vs css-modules
    "css-modules",
    "markdown",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:unicorn/recommended",
    "plugin:require-path-exists/recommended",
    "plugin:json/recommended",
    "plugin:n/recommended",
    "plugin:@microsoft/sdl/common",
    "plugin:@microsoft/sdl/node",
    "plugin:security-node/recommended",
    "plugin:yaml/recommended",
    "plugin:anti-trojan-source/recommended",
    "plugin:sort-export-all/recommended",
    "plugin:prettier/recommended",
    "plugin:css/recommended",
    "plugin:css-modules/recommended",
    "plugin:markdown/recommended",
  ],
  rules: {
    // sort object keys alphabetically
    "sort-keys": ["warn", "asc", { minKeys: 5 }],
    "prefer-let/prefer-let": 2,
    "prefer-const": "off",
    "no-secrets/no-secrets": [
      "warn",
      {
        ignoreContent: ["https?://"],
      },
    ],
    "sort-imports": [
      "warn",
      {
        memberSyntaxSortOrder: ["none", "single", "all", "multiple"],
        allowSeparatedGroups: true,
        ignoreDeclarationSort: true,
      },
    ],
    "json-files/sort-package-json": "warn",
    "json-files/ensure-repository-directory": "warn",
    "json-files/require-engines": "warn",
    // prevent duplicate packages in dependencies and devDependencies
    "json-files/require-unique-dependency-names": "error",
    "tree-shaking/no-side-effects-in-initialization": "off",
    "implicit-dependencies/no-implicit": [
      "off",
      { dev: true, peer: true, optional: true },
    ],
    "n/no-unpublished-import": "warn",
    "n/no-missing-import": "off",
    "n/no-missing-require": "off",
    "require-path-exists/exists": [
      "off",
      {
        webpackConfigPath: "webpack.config.ts",
        extensions: ["", ".js", ".ts", ".json", ".node"],
      },
    ],

    "n/no-extraneous-import": [
      "warn",
      {
        allowModules: [
          "@jest/globals",
          "@engineers/cache",
          "@engineers/databases",
          "@engineers/dom",
          "@engineers/express",
          "@engineers/firebase-admin",
          "@engineers/gcloud-storage",
          "@engineers/graphics",
          "@engineers/hookable",
          "@engineers/javascript",
          "@engineers/lazy-load",
          "@engineers/mongoose",
          "@engineers/ngx-content-core",
          "@engineers/ngx-content-view-mat",
          "@engineers/ngx-universal-express",
          "@engineers/ngx-utils",
          "@engineers/nodejs",
          "@engineers/rxjs",
          "@engineers/updater",
          "@engineers/webpack",
          // allow packages that are included in the root workspace by default
          "webpack",
          "webpack-merge",
        ],
      },
    ],
    "n/no-extraneous-require": [
      "warn",
      {
        allowModules: [
          "@jest/globals",
          "@engineers/cache",
          "@engineers/databases",
          "@engineers/dom",
          "@engineers/express",
          "@engineers/firebase-admin",
          "@engineers/gcloud-storage",
          "@engineers/graphics",
          "@engineers/hookable",
          "@engineers/javascript",
          "@engineers/lazy-load",
          "@engineers/mongoose",
          "@engineers/ngx-content-core",
          "@engineers/ngx-content-view-mat",
          "@engineers/ngx-universal-express",
          "@engineers/ngx-utils",
          "@engineers/nodejs",
          "@engineers/rxjs",
          "@engineers/updater",
          "@engineers/webpack",
          "webpack",
          "webpack-merge",
        ],
      },
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    // allow @ts-ignore
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-var-requires": "warn",
    "@typescript-eslint/no-non-null-assertion": "off",
    // unsupported es features are supported by typescript
    "n/no-unsupported-features/es-syntax": "off",
    "n/no-unsupported-features/es-builtins": "warn",
    // todo: set engines.node in package.json then switch to "error"
    "n/no-unsupported-features/node-builtins": "warn",
    // todo: enable this rule after migrating into esm
    "unicorn/prefer-module": "off",
    "unicorn/no-array-for-each": "off",
    "unicorn/no-empty-file": "warn",
    // prevents `array.map(function)` because function signature may be different
    "unicorn/no-array-callback-reference": "off",
    // this rule is diabled because it modify the pattern automatically
    "unicorn/better-regex": "off",
    // "jsdoc/require-param-type": "off",
    "unicorn/consistent-function-scoping": "warn",
    "unicorn/prevent-abbreviations": [
      "off",
      {
        replacements: {
          pkg: false,
          opts: false,
          obj: false,
          ref: false,
          args: false,
          config: false,
          params: false,
          dist: false,
          temp: false,
        },
      },
    ],
    "unicorn/prefer-spread": "warn",
    "unicorn/import-style": "warn",
    "unicorn/prefer-switch": "off",
    "unicorn/no-array-reduce": "warn",
    "unicorn/filename-case": "warn",
    "unicorn/prefer-top-level-await": "warn",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
      { usePrettierrc: true },
    ],
    "no-prototype-builtins": "warn",
    "@html-eslint/indent": "warn",
    "@html-eslint/element-newline": "warn",
    "security-node/non-literal-reg-expr": "warn",
    "unicorn/no-null": "warn",
    "unicorn/consistent-destructuring": "warn",
    // issue: https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1840
    "unicorn/explicit-length-check": "off",
    "no-useless-escape": "warn",
    "no-empty": "warn",
    "import/no-unresolved": "off",
    "prefer-rest-params": "warn",
    "unicorn/prefer-ternary": "warn",
  },

  overrides: [
    {
      files: ["*.{m,}{ts,js,tsx,jsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["tsconfig.all.json"],
        sourceType: "module",
      },
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:@microsoft/sdl/typescript",
      ],
      rules: {
        // todo: move to top-level rules
        // to override "plugin:@typescript-eslint/recommended-requiring-type-checking"
        "prefer-const": "off",
        "@typescript-eslint/no-unsafe-member-access": "warn",
        "@typescript-eslint/no-unsafe-argument": "warn",
        "@typescript-eslint/no-unsafe-return": "warn",
        "@typescript-eslint/no-unsafe-assignment": "warn",
        "@typescript-eslint/no-unsafe-call": "warn",
        "@typescript-eslint/restrict-template-expressions": "warn",
        "@typescript-eslint/restrict-plus-operands": "warn",
        "@typescript-eslint/no-misused-promises": "warn",
        // handle promises correctly with `await` or `.then()` and `.catch()`
        // todo: error: Definition for rule '@typescript-eslint/no-floating-promise' was not found
        // https://github.com/typescript-eslint/typescript-eslint/issues/5139
        // https://github.com/typescript-eslint/typescript-eslint/issues/5141
        "@typescript-eslint/no-floating-promises": "warn",
      },
    },
    {
      // linting angular test files to follow best practices for testing
      // todo: extend *.ts rules
      files: [
        "**/__tests__/**/*.{ts,js,tsx,jsx}",
        "**/*.{spec,test}.{ts,js,tsx,jsx}",
      ],
      parserOptions: {
        project: ["tsconfig.spec.json"],
      },
      plugins: ["jest", "testing-library"],
      extends: [
        "plugin:jest/recommended",
        // todo: enable only for angular apps and packages (starts with ngx-*)
        "plugin:testing-library/angular",
      ],
      rules: {
        "prefer-const": "off",
        "jest/no-conditional-expect": "warn",
        "jest/valid-title": "warn",
        "jest/no-done-callback": "warn",
        // todo: allow for expect().resolves
        // https://github.com/jest-community/eslint-plugin-jest/issues/1144
        "jest/valid-expect": "warn",
        "@typescript-eslint/no-floating-promises": "warn",
      },
    },
    {
      files: ["**/*.graphql"],
      parser: "@graphql-eslint/eslint-plugin",
      plugins: ["@graphql-eslint"],
      rules: {
        "@graphql-eslint/known-type-names": "error",
      },
    },
    {
      files: ["*.{json,json5,jsonc}"],
      parser: "jsonc-eslint-parser",
    },
    {
      files: ["*.ejs.*"],
      // parse files as ejs code instead of normal js
      // ejs files contains invalid js tokens
      // example: `class <%= className %>{}`
      plugins: ["ejs"],
    },
    {
      files: ["*.{htm,html}"],
      parser: "@html-eslint/parser",
      extends: ["plugin:@html-eslint/recommended"],
      rules: {
        "@html-eslint/indent": "off",
        // the element may be inside if-else blocks
        // todo: use files:["*.component.html"] to lint angular templates
        "@html-eslint/no-duplicate-id": "warn",
        "@html-eslint/require-closing-tags": "warn",
      },
    },
    /* {
      // lint angular templates
      // todo: error: node.body is not iterable
      files: ["*.component.html"],
      parser: "@angular-eslint/template-parser",
      extends: [
        // "plugin:@html-eslint/recommended",
        "plugin:@angular-eslint/template/recommended",
      ],
    },*/
  ],
};
