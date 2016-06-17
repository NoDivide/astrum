var gulp = require('gulp'),argv = require('yargs').argv,
    config = require('../../../../gulp-config.js'),
    notify = require('gulp-notify'),
    source = require('vinyl-source-stream'),
    partialify = require('partialify'),
    browserify = require('browserify');
   
    
gulp.task('compile-js-with-browserify', function(cb)
{
    var build = argv.build || 'site';

    return browserify({
            entries: config.builds[build].scripts.raw + 'main.js',
            transform: [partialify]
        }).bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest(config.builds[build].scripts.src));
});

