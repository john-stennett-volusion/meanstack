'use strict';

let assert = require('assert');
let express = require('express');
let superagent = require('superagent');
let wagner = require('wagner-core');

const URL_ROOT = 'http://localhost:3000';

describe('Category API', () => {
	let server;
	let Category;
	let Product;
	let models;

	before(() => {
		let app = express();

		// Bootstrap the Server
		models = require('../models')(wagner);
		app.use(require('../api')(wagner));

		server = app.listen(3000);

		// Make Category model available in tests.
		Category = models.Category;
		Product = models.Product;
	});

	after(() => {
		// Shut the server down when we're done.
		server.close();
	});

	beforeEach(done => {
		// Make sure Categories are empty before each test.
		Category.remove({}, err => {
			assert.ifError(err);
			Product.remove({}, err => {
				assert.ifError(err);
			});
			done();
		});
	});

	it('can load a category by id', done => {
		// Create a single category.
		Category.create({ _id: 'Electronics' }, (err, doc) => {
			assert.ifError(err);

			let url = `${ URL_ROOT }/category/id/Electronics`;

			// Make an HTTP request to localhost:3000/category/id/Electronics.
			superagent.get(url, (err, res) => {
				assert.ifError(err);
				let result;

				// And make sure we got { _id: 'Electronics' } back.
				assert.doesNotThrow(() => {
					result = JSON.parse(res.text);
				});
				assert.ok(result.category);
				assert.equal(result.category._id, 'Electronics');
				done();
			});
		});
	});

	it('can load all categories that have a certain parent', done => {
		let categories = [{ _id: 'Electronics' }, { _id: 'Phones', parent: 'Electronics' }, { _id: 'Laptops', parent: 'Electronics' }, { _id: 'Bacon' }];

		// Create 4 Categories
		Category.create(categories, (err, categories) => {
			assert.ifError(err);
			let url = `${ URL_ROOT }/category/parent/Electronics`;

			// Make an HTTP request to localhost:3000/category/parent/Electronics.
			superagent.get(url, (err, res) => {
				assert.ifError(err);

				let result;
				assert.doesNotThrow(() => {
					result = JSON.parse(res.text);
				});
				assert.equal(result.categories.length, 2);

				// Should be in ascending order by _id.
				assert.equal(result.categories[0]._id, 'Laptops');
				assert.equal(result.categories[1]._id, 'Phones');
				done();
			});
		});
	});

	it.only('can load a product by id', done => {
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

			let url = `${ URL_ROOT }/product/id/${ PRODUCT_ID }`;

			superagent.get(url, (error, res) => {
				assert.ifError(error);

				let result;
				assert.doesNotThrow(() => {
					result = JSON.parse(res.text);
				});

				assert.ok(result.product);
				assert.equal(result.product._id, PRODUCT_ID);
				assert.equal(result.product.name, 'LG G4');
				done();
			});
		});
	});

	it('can load all products in a category with sub-categories', done => {
		let categories = [{ _id: 'Electronics' }, { _id: 'Phones', parent: 'Electronics' }, { _id: 'Laptops', parent: 'Electronics' }, { _id: 'Bacon' }];

		let products = [{
			name: 'LG G$',
			category: {
				_id: 'Phones',
				ancestors: ['Electronics', 'Phones']
			},
			price: {
				amount: 300,
				currency: 'USD'
			}
		}, {
			name: 'Asus Zenbook Prime',
			category: {
				_id: 'Laptop',
				ancestors: ['Electronics', 'Laptops']
			},
			price: {
				amount: 2000,
				currency: 'USD'
			}
		}, {
			name: 'Flying Pigs Farm Pasture Raised Pork Bacon',
			category: {
				_id: 'Bacon',
				ancestors: ['Bacon']
			},
			price: {
				amount: 20,
				currency: 'USD'
			}
		}];

		// Create 4 categories
		Category.create(categories, (error, categories) => {
			assert.ifError(error);

			// And 3 products
			Product.create(products, (error, products) => {
				assert.ifError(error);

				let url = `${ URL_ROOT }/product/category/Electronics`;

				superagent.get(url, (error, res) => {
					assert.ifError(error);

					let result;
					assert.doesNotThrow(() => {
						result = JSON.parse(res.text);
					});
					assert.equal(result.products.length, 2);

					// Should be in ascending order by name
					assert.equal(result.products[0].name, 'ASUS Zenbook Prime');
					assert.equal(result.products[1].name, 'LG G4');

					// Sort by price, ascending
					let url = `${ URL_ROOT }/Product/category/Electronics?price=1`;
					superagent.get(url, (error, res) => {
						assert.ifError(error);

						let result;
						assert.doesNotThrow(() => {
							result = JSON.parse(res.text);
						});

						assert.equal(result.products.length, 2);
						assert.equal(result.products[0].name, 'LG G4');
						assert.equal(result.products[1].name, 'ASUS Zenbook Prime');
						done();
					});
				});
			});
		});
	});
});

//# sourceMappingURL=api-tests-compiled.js.map