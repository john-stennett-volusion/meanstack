'use strict';

let assert     = require('assert');
let express    = require('express');
let superagent = require('superagent');
let wagner     = require('wagner-core');

const URL_ROOT = 'http://localhost:3000';

describe('Product API', () => {
	let server;
	let Product;

	before(() => {
		let app = express();

		// Bootstrap the Server
		let models = require('../models/models')(wagner);
		app.use(require('../api')(wagner));
		server = app.listen(3000);

		// Make Category model available in tests.
		Product  = models.Product;
	});

	after(() => {
		// Shut the server down when we're done.
		server.close();
	});

	beforeEach((done) => {
		// Make sure Categories are empty before each test.
		Product.remove({}, (err) => {
			assert.ifError(err);
			done();
		});
	});

	it('can load a product by id', (done) => {
		// Create a single Product
		const PRODUCT_ID = '000000000000000000000001';
		let product = {
			name: 'LG G4',
			_id: PRODUCT_ID,
			price: {
				amount: 300,
				currency: 'USD'
			}
		};

		Product.create(product, (error, doc) => {
			assert.ifError(error);

			let url = `${URL_ROOT}/product/id/${PRODUCT_ID}`;

			superagent.get(url, (error, res) => {
				assert.ifError(error);

				let result;
				assert.doesNotThrow(() => {
					result = JSON.parse(res.text);
				});

				assert.ok(result.product);
				assert.equal(result.product._id, PRODUCT_ID);
				assert.equal(result.product.name, 'LG G4');
			}).end(() => {
				done();
			});
		});
	});

});