'use strict';

let express = require('express');
let wagner = require('wagner-core');

require('./models/models')(wagner);

let app = express();

app.use('/api/v1', require('./api')(wagner));

app.listen(3000);
console.log('Listening on port 3000!');

//# sourceMappingURL=index-compiled.js.map