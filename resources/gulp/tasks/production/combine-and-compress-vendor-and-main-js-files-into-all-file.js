var gulp   = require('gulp'),argv = require('yargs').argv,
    config = require('../../../../gulp-config.js'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

gulp.task('combine-and-compress-vendor-and-main-js-files-into-all-file', function(build, cb) {
    var build = argv.build || 'site';

    gulp.src([config.builds[build].scripts.src + 'vendor.js', config.builds[build].scripts.src + 'main.js'])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.builds[build].scripts.dist));

    return gulp.src([config.builds[build].scripts.src + '*.js',
        '!' + config.builds[build].scripts.src + 'vendor.js',
        '!' + config.builds[build].scripts.src + 'main.js',
        '!' + config.builds[build].scripts.src + '*.map'])
        .pipe(uglify())
        .pipe(gulp.dest(config.builds[build].scripts.dist));

    cb(err);
});

