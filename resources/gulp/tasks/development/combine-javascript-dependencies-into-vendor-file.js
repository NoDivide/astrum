var gulp       = require('gulp'),argv = require('yargs').argv,
    config     = require('../../../../gulp-config.js'),
    concat     = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps');
    
gulp.task('combine-javascript-dependencies-into-vendor-file', function(cb)
{
    var build = argv.build || 'site';

    if(config.vendor[build].scripts.foot)
    {
        return gulp.src(config.vendor[build].scripts.foot)
                   .pipe(sourcemaps.init())
                   .pipe(concat('vendor.js'))
                   .pipe(sourcemaps.write('.'))
                   .pipe(gulp.dest(config.builds[build].scripts.src))
    }
});

