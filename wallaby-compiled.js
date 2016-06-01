var babel = require('babel-core');

module.exports = function (wallaby) {
	return {
		files: ['*.js'],
		tests: ['tests/api-tests.js'],
		env: {
			type: 'node',
			runner: 'node'
		},
		testFramework: 'mocha'
	};
};

//# sourceMappingURL=wallaby-compiled.js.map