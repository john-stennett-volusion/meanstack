var babel = require('babel-core');

module.exports = function(){
	return {
		files: ['*.js'],
		tests: ['tests/*.js'],
		env: {
			type: 'node',
			runner: 'node'
		},
		testFramework: 'mocha'
	};
};