module.exports = {globals
	'env': {
		'browser': true,
		'commonjs': true,
		'es2021': true,
		'jest': true,
		'node': true
	},
	'extends': [
		'eslint:recommended', 
		'plugin:react/recommended'
	],
	'globals': {
		'cy': true
	},
	'overrides': [
	],
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},  
	'plugins': [
		'react'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'react/prop-types': 0
	},
	'settings': {
		'react': {
			'version': 'detect'
		}
	}
}
