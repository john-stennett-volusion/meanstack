'use strict';

let mongoose = require('mongoose');
let Categories = require('./categories');

let productSchema = {
	name: {
		type: String,
		required: true
	},
	pictures: [{
		// Pictures need to start with "http://"
		type: String,
		match: /^http:\/\//i
	}],
	price: {
		amount: {
			type: Number,
			required: true
		},
		currency: {
			// Only 3 supported currencies at the moment
			type: String,
			enum: ['USD', 'EUR', 'GBP'],
			required: true
		}
	},
	category: Categories.categorySchema
};

let schema = new mongoose.Schema(productSchema);
let currencySymbols = {
	'USD': '$',
	'EUR': '€',
	'GBP': '£'
};

schema.virtual('displayName').get(() => {
	if (this.price !== undefined) {
		return `${currencySymbols[this.price.currency]}${this.price.amount}`;
	} else {
		return '';
	}
});

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

module.exports = schema;
module.exports.productSchema = productSchema;