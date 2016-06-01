'use strict';

let mongoose = require('mongoose');
let _ = require('underscore');

module.exports = wagner => {
	mongoose.connect('mongodb://localhost:27017/test');

	let Category = mongoose.model('Category', require('./categories'), 'categories');
	let Product = mongoose.model('Product', require('./products'), 'products');

	let models = {
		Category: Category,
		Product: Product
	};

	// wagner.factory('Category', () => {
	// 	return Category;
	// });
	//
	// wagner.factory('Product', () => {
	// 	return Product;
	// });

	// To ensure DRY-ness, register factories in a loop
	_.each(models, (value, key) => {
		wagner.factory(key, () => {
			return value;
		});
	});

	return models;
};

//# sourceMappingURL=models-compiled.js.map