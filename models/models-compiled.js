'use strict';

let mongoose = require('mongoose');
let _ = require('underscore');

module.exports = wagner => {
	if (mongoose.connection.readyState == 0) {
		mongoose.connect('mongodb://localhost:27017/test');
	}

	let Category;
	let Product;
	let User;

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

	if (mongoose.models.User) {
		User = mongoose.model('User');
	} else {
		User = mongoose.model('User', require('./users'), 'users');
	}

	let models = {
		Category: Category,
		Product: Product,
		User: User
	};

	// To ensure DRY-ness, register factories in a loop
	_.each(models, (value, key) => {
		return wagner.factory(key, stuff => {
			return stuff;
		});
	});

	return models;
};

//# sourceMappingURL=models-compiled.js.map