var gulp = require('gulp'),argv = require('yargs').argv,
    config = require('../../../../gulp-config.js'),
    del = require('del');


gulp.task('remove-development-files', function(cb) {
    var build = argv.build || 'site';

    del([config.paths.css_dest + '/src',
         config.paths.scripts_dest + '/src'], cb);
});

