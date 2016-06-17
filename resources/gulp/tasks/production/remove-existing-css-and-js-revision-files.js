var gulp = require('gulp'),argv = require('yargs').argv,
    config = require('../../../../gulp-config.js'),
    del = require('del');

gulp.task('remove-existing-css-and-js-revision-files', function(cb) {
    var build = argv.build || 'site';

    del([
        config.builds[build].styles.dist + '*-*.css',
        config.builds[build].scripts.dist + '*-*.js'
    ]);
});

