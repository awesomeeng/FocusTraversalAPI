"use strict";

module.exports = {
	"extends": "eslint:recommended",
	parserOptions: {
		ecmaVersion: 6
	},
    env: {
        es6: true,
		browser: true
    },
    rules: {
		"no-self-assign": [
			"off"
		],
        indent: [
            "error",
            "tab",
			{ "SwitchCase": 1 }
        ],
        semi: [
            "error",
            "always"
        ],
		"require-await": [
			"error"
		],
		"no-constant-condition": [
			"off"
		]
    }
};
