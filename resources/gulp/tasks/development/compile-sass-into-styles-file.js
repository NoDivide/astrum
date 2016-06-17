var gulp = require('gulp'),argv = require('yargs').argv,
    config = require('../../../../gulp-config.js'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer');
    
gulp.task('compile-sass-into-styles-file', function(cb)
{
    var build = argv.build || 'site';

    return sass(config.builds[build].styles.raw, {
            sourcemap: true,
            style: 'expanded'
        })
        .pipe(autoprefixer('last 3 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.builds[build].styles.src));
});