'use strict';

let express = require('express');
let status  = require('http-status');

module.exports = (wagner) => {
	let api = express.Router();

	api.get('/category/id/:id', wagner.invoke((Category) => {
		return (req, res) => {
			Category.findOne({_id: req.params.id}, (error, category) => {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
				}
				if (!category) {
					return res.status(status.NOT_FOUND).json({error: 'Not found'});
				}
				res.json({category: category});
			});
		};
	}));

	api.get('/category/parent/:id', wagner.invoke((Category) => {
		return (req, res) => {
			Category.find({parent: req.params.id}).sort({_id: 1}).exec((error, categories) => {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
				}
				res.json({categories: categories});
			});
		};
	}));

	api.get('/product/id/:id', wagner.invoke((Product) => {
		return (req, res) => {
			Product.findOne({_id: req.params.id},
				handleOne.bind(null, 'product', res));
		};
	}));

	api.get('/product/category/:id', wagner.invoke((Product) => {
		return (req, res) => {
			let sort = {name: 1};

			if (req.query.price === '1') {
				sort = {'internal.approximatePriceUSD': 1};
			} else if (req.query.price === '-1') {
				sort = {'internal.approximatePriceUSD': -1};
			}

			Product.find({'category.ancestors': req.params.id}).sort(sort).exec(handleMany.bind(null, 'products', res));
		};
	}));

	return api;
};

function handleOne(property, res, error, result) {
	if (error) {
		return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
	}
	if (!result) {
		return res.status(status.NOT_FOUND).json({error: 'Not found'});
	}

	var json = {};
	json[property] = result;
	res.json(json);
}

function handleMany(property, res, error, result) {
	if (error) {
		return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
	}

	var json = {};
	json[property] = result;
	res.json(json);
}