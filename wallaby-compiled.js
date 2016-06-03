var babel = require('babel-core');

module.exports = function () {
	return {
		files: ['*.js', 'models/*.js'],
		tests: ['tests/*.js'],
		env: {
			type: 'node',
			runner: 'node'
		},
		testFramework: 'mocha'
	};
};

//# sourceMappingURL=wallaby-compiled.js.map