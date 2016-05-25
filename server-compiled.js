'use strict';

let express = require('express');

module.exports = () => {
	let app = express();

	app.get('/', (req, res) => {
		res.send('Hello, World!');
	});

	app.get('/user/:user', (req, res) => {
		res.send(`Page for user ${ req.params.user } with option ${ req.query.option }.`);
	});

	return app;
};

//# sourceMappingURL=server-compiled.js.map