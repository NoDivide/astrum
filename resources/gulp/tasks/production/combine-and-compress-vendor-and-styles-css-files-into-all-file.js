var gulp = require('gulp'),argv = require('yargs').argv,
    config = require('../../../../gulp-config.js'),
    concat = require('gulp-concat'),
    minifycss = require('gulp-minify-css');
    
gulp.task('combine-and-compress-vendor-and-styles-css-files-into-all-file', function(build, cb) {
    var build = argv.build || 'site';

    return gulp.src([
        config.builds[build].styles.src + 'vendor.css',
        config.builds[build].styles.src + 'styles.css'
    ])
        .pipe(concat('all.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(config.builds[build].styles.dist));

    cb(err);
});
