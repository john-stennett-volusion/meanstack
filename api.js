'use strict';

let express = require('express');
let status  = require('http-status');

module.exports = (wagner) => {
	let api = express.Router();

	api.get('/category/id/:id', wagner.invoke((Category) => {
		return (req, res) => {
			Category.findOne({ _id: req.params.id }, (error, category) => {
				if (error) {
					return res.
						status(status.INTERNAL_SERVER_ERROR).
						json({ error: error.toString() });
				}
				if (!category) {
					return res.
						status(status.NOT_FOUND).
						json({ error: 'Not found' });
				}
				res.json({ category: category });
			});
		};
	}));
};