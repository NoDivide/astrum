var gulp        = require('gulp'),
    argv        = require('yargs').argv,
    config      = require('../../../../gulp-config.js'),
    browserSync = require('browser-sync').create();


gulp.task('watch-with-browser-sync', ['watch'], function() {
    var build = argv.build || 'site';

    browserSync.init({
        proxy: config.url,
        open: false
    });

    // Watch any files in root, reload on change
    gulp.watch([config.paths.root + '/**/*.{php,css,html,js}']).on('change', browserSync.reload);
});
