var gulp = require('gulp'),
	prefixer = require('gulp-autoprefixer'),
	browserify = require('gulp-browserify'),
	source = require('vinyl-source-stream'),
	brfs = require('brfs'),
	fs = require('fs'),
	marked = require('marked'),
	htmlToJson = require('./html-to-json.js'),
	sass = require('gulp-sass'),
	webserver = require('gulp-webserver');

var path = require('path');

gulp.task('sass', function () {
	gulp
		.src('scss/rosetta-stone.scss')
		.pipe(sass({
			paths: ['scss']
		}))
		.pipe(prefixer('last 2 versions', 'ie 9'))
		.pipe(gulp.dest('./css'));
});

gulp.task('markdown-to-json', function (cb) {
	var source = fs.readFileSync('rosetta-stone.md', 'utf8')
	var originalHTML = marked(source)
	htmlToJson(originalHTML, function(data){
		fs.writeFileSync('json/rosetta-stone.json', JSON.stringify({sections: data}, null, 2));
		cb()
	})
});

// Browserify our code
// Since we the JSON is incorporated into our browserify bundle we depend on it.
gulp.task('js', ['markdown-to-json'], function() {
	// Browserify/bundle the JS.
	gulp.src('./js/src/index.js')
		.pipe(browserify({
			insertGlobals : true,
			fullPaths: true, // For discify
			debug : ! gulp.env.production
		}))
		.pipe(gulp.dest('./js/dist'))

});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      port: 7777,
      fallback: 'html/index.html',
      open: true
    }));
});

// The default task (called when you run `gulp`)
gulp.task('default', ['markdown-to-json', 'js', 'sass', 'webserver'], function() {

});

