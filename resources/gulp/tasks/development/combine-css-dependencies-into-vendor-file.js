var gulp       = require('gulp'),argv = require('yargs').argv,
    config     = require('../../../../gulp-config.js'),
    concat     = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps');


gulp.task('combine-css-dependencies-into-vendor-file', function(cb)
{
    var build = argv.build || 'site';

    return gulp.src(config.vendor[build].styles)
               .pipe(sourcemaps.init())
               .pipe(concat('vendor.css'))
               .pipe(sourcemaps.write('.'))
               .pipe(gulp.dest(config.builds[build].styles.src));
});

