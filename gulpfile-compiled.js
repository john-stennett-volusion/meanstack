'use strict';

let gulp = require('gulp');
let mocha = require('gulp-mocha');

gulp.task('test', () => {
	gulp.src('./tests/test.js').pipe(mocha()).on('error', err => {
		// this.emit('end');
	});
});

gulp.task('watch', () => {
	gulp.watch(['./*.js', './**/*.js'], ['test']);
});

//# sourceMappingURL=gulpfile-compiled.js.map