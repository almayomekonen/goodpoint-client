module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",

    },
    "plugins": [
        "@typescript-eslint",
        "react",
        "check-file"
    ],
    "rules": {
        "react/react-in-jsx-scope": "off",
        // allow jsx syntax in js files (for next.js project)
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".ts", ".tsx"] }], //should add ".ts" if typescript project,
        '@typescript-eslint/no-explicit-any': 'off',
        'no-prototype-builtins': 'off',
        'no-extra-boolean-cast': 'off',
        "check-file/filename-naming-convention": [
            "error",
            {
                "**/!(main).{jsx,tsx}": "PASCAL_CASE",
            }
        ],
        "check-file/folder-naming-convention": [
            "error",
            {
                "src/**/": "KEBAB_CASE"
            }
        ]
    }
}
