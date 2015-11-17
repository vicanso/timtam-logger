const gulp = require('gulp');
const jshint = require('gulp-jshint');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');


gulp.task('jshint', function() {
	return gulp.src(['./lib/*.js', './transports/*.js'])
		.pipe(jshint({
			predef: ['require', 'module'],
			node: true,
			esnext: true
		}))
		.pipe(jshint.reporter('default'));
});



gulp.task('default', ['jshint']);