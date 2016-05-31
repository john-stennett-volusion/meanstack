'use strict';

let gulp = require('gulp');
let gulpExit = require('gulp-exit');
let mocha = require('gulp-mocha');

gulp.task('test', () => {
	gulp.src('./tests/*.js').pipe(mocha()).on('error', err => {
		gulpExit();
	});
});

gulp.task('watch', () => {
	gulp.watch(['./*.js'], ['test']);
});

//# sourceMappingURL=gulpfile-compiled.js.map