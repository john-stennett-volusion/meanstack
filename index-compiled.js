'use strict';

let mongoose = require('mongoose');
let productScheme = require('./schemas/products');

let Product = mongoose.model('Product', productScheme);
let p = new Product({
	name: 'test',
	price: {
		amount: 5,
		currency: 'USD'
	},
	category: {
		name: 'test'
	}
});

console.log(p);

//# sourceMappingURL=index-compiled.js.map