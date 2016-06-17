var gulp = require('gulp'),argv = require('yargs').argv,
    argv = require('yargs').argv,
    runSequence = require('run-sequence');

gulp.task('build', function(cb) {
    runSequence('run',
        ['combine-and-compress-vendor-and-styles-css-files-into-all-file',
         'combine-and-compress-vendor-and-main-js-files-into-all-file'],
         'remove-development-files',
         'create-new-css-and-js-revision-files', cb);
});