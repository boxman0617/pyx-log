module.exports = {
    "env": {
        "es6": true,
        "node": true,
		"mocha": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
		"prefer-template": [
			"error"
		],
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single",
			{
				"allowTemplateLiterals": true
			}
        ],
        "semi": [
            "error",
            "always"
        ],
		"prefer-arrow-callback": [
			"error"
		],
		"no-console": "off"
    }
};
