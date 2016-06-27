var gulp        = require('gulp'),
    argv        = require('yargs').argv,
    config      = require('../../../../gulp-config.js'),
    runSequence = require('run-sequence');


gulp.task('watch', function() {
    var build = argv.build || 'site';

    // Watch .scss files
    gulp.watch([
        config.builds[build].styles.raw + '**/*.scss'],
        function(cb) {
            runSequence('compile-sass-into-styles-file');
        });

    // Watch .js files
    gulp.watch([config.builds[build].scripts.raw + '**'], function(cb)
    {
        runSequence('compile-js-with-browserify');
    });
});
