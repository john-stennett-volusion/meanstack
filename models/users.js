'use strict';

let mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	profile: {
		username: {
			type: String,
			require: true,
			lowercase: true
		},
		picture: {
			type: String,
			require: true,
			match: /^http:\/\//i
		}
	},
	data: {
		oauth: {
			type: String,
			required: true
		},
		cart: [{
			product: {
				type: mongoose.Schema.Types.ObjectId
			},
			quantity: {
				type: String,
				default: 1,
				min: 1
			}
		}]
	}
});

module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });