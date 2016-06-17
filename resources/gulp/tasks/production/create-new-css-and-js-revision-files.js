var gulp = require('gulp'),argv = require('yargs').argv,
    runSequence = require('run-sequence');

gulp.task('create-new-css-and-js-revision-files',
    ['remove-existing-css-and-js-revision-files',
     'generate-new-css-and-js-revision-files'], function(cb) {});

