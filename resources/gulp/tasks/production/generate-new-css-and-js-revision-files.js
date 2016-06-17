var gulp = require('gulp'),argv = require('yargs').argv,
    config = require('../../../../gulp-config.js'),
    rev = require('gulp-rev');

gulp.task('generate-new-css-and-js-revision-files', function(cb) {
    return gulp.src([
            config.paths.assets_dest + '/css/dist/*/*.css',
            '!' + config.paths.assets_dest + '/css/dist/*/*-*.css',
            config.paths.assets_dest + '/js/dist/*/*.js',
            '!' + config.paths.assets_dest + '/js/dist/*/*-*.js'
        ], { base: config.paths.assets_dest })
        .pipe(gulp.dest(config.paths.assets_dest))
        .pipe(rev())
        .pipe(gulp.dest(config.paths.assets_dest))
        .pipe(rev.manifest())
        .pipe(gulp.dest(config.paths.assets_dest));
});

