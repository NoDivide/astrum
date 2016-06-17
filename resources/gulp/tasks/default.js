var gulp = require('gulp'),argv = require('yargs').argv,
    runSequence = require('run-sequence');

gulp.task('default', function(cb) {
    runSequence(
        'run',
        'watch-with-browser-sync'
    );
});

