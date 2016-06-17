var gulp        = require('gulp'),
    argv        = require('yargs').argv,
    runSequence = require('run-sequence');

gulp.task('run', function(cb)
{
    runSequence(
        ['combine-css-dependencies-into-vendor-file',
         'compile-sass-into-styles-file'],
        ['combine-head-specific-javascript-into-head-file',
         'compile-js-with-browserify'], cb);
});
