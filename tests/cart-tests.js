'use strict';

let assert     = require('assert');
let express    = require('express');
let status     = require('http-status');
let superagent = require('superagent');
let wagner     = require('wagner-core');

const URL_ROOT = 'http://localhost:3000';
let PRODUCT_ID = '000000000000000000000001';

describe('Cart API', () => {
	let server;
	let Category;
	let Product;
	let User;

	before(() => {
		let app = express();

		// Bootstrap server
		let models = require('../models/models')(wagner);

		// Make Category model available in tests.
		Category = models.Category;
		Product  = models.Product;
		User     = models.User;

		app.use((req, res, next) => {
			User.findOne({}, (error, user) => {
				assert.ifError(error);
				req.user = user;
				next();
			});
		});

		app.use(require('../api')(wagner));

		server = app.listen(3000);
	});

	after(() => {
		server.close();
	});

	beforeEach((done) => {
		// Make sure Categories are empty before each test.
		Category.remove({}, (error) => {
			assert.ifError(error);
			Product.remove({}, (error) => {
				assert.isError(error);
				User.remove({}, (error) => {
					assert.ifError(error);
					done();
				});
			});
		});
	});

	beforeEach((done) => {
		let categories = [
			{ _id: 'Electronics' },
			{ _id: 'Phones', parent: 'Electronics' },
			{ _id: 'Laptops', parent: 'Electronics' },
			{ _id: 'Bacon' }
		];

		let products = [
			{
				name: 'LG G4',
				category: { _id: 'Phones', ancestors: ['Electronics', 'Phones'] },
				price: {
					amount: 300,
					currency: 'USD'
				}
			},
			{
				_id: PRODUCT_ID,
				name: 'Asus Zenbook Prime',
				category: { _id: 'Laptops', ancestors: ['Electronics', 'Laptops'] },
				price: {
					amount: 2000,
					currency: 'USD'
				}
			},
			{
				name: 'Flying Pigs Farm Pasture Raised Pork Bacon',
				category: { _id: 'Bacon', ancestors: ['Bacon'] },
				price: {
					amount: 20,
					currency: 'USD'
				}
			}
		];

		let users = [{
			profile: {
				username: 'vkarpov15',
				picture: 'http://pbs.twimg.com/profile_images/550304223036854272/Wwmwuh2t.png'
			},
			data: {
				oauth: 'invalid',
				cart: []
			}
		}];

		Category.create(categories, (error) => {
			assert.ifError(error);
			Product.create(products, (error) => {
				assert.ifError(error);
				User.create(users, (error) => {
					assert.ifError(error);
					done();
				});
			});
		});
	});

	afterEach(() => {
		// Shut the server down when we're done.
		server.close();
	});

	it('can save users cart', (done) => {
		let url = `${URL_ROOT}/me/cart`;

		superagent.put(url).send({
			data: {
				cart: [{ product: PRODUCT_ID, quantity: 1 }]
			}
		}).end((error, res) => {
			assert.ifError(error);
			assert.equal(res.status, status.OK);

			User.findOne({}, (error, user) => {
				assert.ifError(error);
				assert.equal(user.data.cart.length, 1);
				assert.equal(user.data.cart[0].product, PRODUCT_ID);
				assert.equal(user.data.cart[0].quantity, 1);
				done();
			});
		});
	});

	it('can load users cart', (done) => {
		let url = `${URL_ROOT}/me`;

		User.findOne({}, (error, user) => {
			assert.ifError(error);
			user.data.cart = [{ product: PRODUCT_ID, quantity: 1 }];
			user.save((error) => {
				assert.ifError(error);

				superagent.get(url, (error, res) => {
					assert.ifError(error);
					assert.equal(res.status, status.OK);

					let result;
					assert.doesNotThrow(() => {
						result = JSON.parse(res.text).user;
					});

					assert.equal(result.data.cart.length, 1);
					assert.equal(result.data.cart[0].product.name, 'Asus Zenbook Prime');
					assert.equal(result.data.cart[0].quantity, 1);
					done();
				});
			});
		});
	});
});