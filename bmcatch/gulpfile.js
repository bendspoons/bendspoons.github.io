var gulp 			= require('gulp'),
	sass 				= require('gulp-sass')(require('sass')),
	uglify 			= require('gulp-uglify'),
	//uglify 			= require('gulp-uglify-es'),
	minify			= require('gulp-minify')
	rename 			= require('gulp-rename'),
	concat 			= require('gulp-concat'),
	cleanCSS 	  = require('gulp-clean-css'),
	ngAnnotate  = require('gulp-ng-annotate'),
	watch 			= require('gulp-watch'),
	stripDebug  = require('gulp-strip-debug'),
	htmlmin 		= require('gulp-htmlmin'),
	cssmin 			= require('gulp-cssmin'),
	gulpUtil = require('gulp-util');

	// npm install gulp@3.8.1 gulp-sass gulp-uglify gulp-minify gulp-rename gulp-concat gulp-clean-css gulp-ng-annotate gulp-watch gulp-htmlmin gulp-strip-debug gulp-cssmin

gulp.task('jsInternal', function() {
	gulp.src([
		"./lib/js2.js",
	])
	.pipe(concat('app.js'))
	.pipe(ngAnnotate())
	.pipe(rename({suffix: '.min'}))
	/*.pipe(uglify())*/
	.pipe(gulp.dest('./'));

});

gulp.task('cssInternal', function() {
  gulp.src('./css/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
		.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./'));
});

gulp.task('watcher', function() {
		gulp.watch('./css/**/*.scss', ['cssInternal']);
		gulp.watch('./lib/**/*.js', ['jsInternal']);
});


gulp.task('default', ['cssInternal', 'jsInternal', 'watcher']);
