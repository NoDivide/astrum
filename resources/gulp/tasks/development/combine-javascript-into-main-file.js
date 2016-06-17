var gulp       = require('gulp'),argv = require('yargs').argv,
    config     = require('../../../../gulp-config.js'),
    concat     = require('gulp-concat'),
    jshint     = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps');


gulp.task('combine-javascript-into-main-file', function(cb) {
    var build = argv.build || 'site';

    return gulp.src([
        config.builds[build].scripts.raw + '*/*.js',
        config.builds[build].scripts.raw + '*/*/*.js',
        config.builds[build].scripts.raw + '*.js',
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.builds[build].scripts.src))
});

