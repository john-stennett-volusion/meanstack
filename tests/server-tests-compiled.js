'use strict';

let app    = require('../server');
let assert = require('assert');
let superagent = require('superagent');

describe('server tests', () => {
	let server;

	beforeEach(() => {
		server = app().listen(3000);
	});

	afterEach(() => {
		server.close();
	});

	it('print out "Hello World!" when user goes to "/"', done => {
		superagent.get('http://localhost:3000/', (err, res) => {
			assert.ifError(err);
			assert.equal(res.status, 200);
			assert.equal(res.text, "Hello, World!");
		});
		done();
	});

	it('print out the user name in the string and undefined for the option', done => {
		superagent.get('http://localhost:3000/users/mongoose', (err, res) => {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert.equal(res.text, "Page for user mongoose with option undefined.");
		});
		done();
	});

	it('print out the user name and option in the string', done => {
		superagent.get('http://localhost:3000/users/mongoose?option=banana', (err, res) => {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);
			assert.equal(res.text, "Page for user mongoose with option banana.");
		});
		done();
	});
});

//# sourceMappingURL=server-tests-compiled.js.map