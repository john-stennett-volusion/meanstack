'use strict';

let mongoose = require('mongoose');
let _        = require('underscore');

module.exports = (wagner) => {
	if (mongoose.connection.readyState == 0) {
		mongoose.connect('mongodb://localhost:27017/test');
	}

	let Category;
	let Product;

	if (mongoose.models.Category) {
		Category = mongoose.model('Category');
	} else {
		Category = mongoose.model('Category', require('./categories'), 'categories');
	}

	if (mongoose.models.Product) {
		Product = mongoose.model('Product');
	} else {
		Product = mongoose.model('Product', require('./products'), 'products');
	}

	let models = {
		Category: Category,
		Product: Product
	};

	// To ensure DRY-ness, register factories in a loop
	_.each(models, (value, key) => {
		wagner.factory(key, () => {
			return value;
		});
	});

	return models;
};