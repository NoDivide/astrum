var gulp = require('gulp'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    stringify = require('stringify'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglifyes'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    cleanCSS = require('gulp-clean-css'),
    runSequence = require('run-sequence');


gulp.task('compile-js', function()
{
    return browserify({
        entries: '_template/app/js/main.js',
        transform: [babelify],
        debug: !(process.env.NODE_ENV === 'production')
    })
        .transform(stringify)
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('_template/app/js/'));
});

gulp.task('compile-css', function()
{
    return gulp.src('_template/app/css/styles.css')
        .pipe(cleanCSS())
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('_template/app/css/'));

});

gulp.task('watch', function(cb)
{
    // Watch .scss files
    gulp.watch('_template/app/css/styles.css',
        function(cb) {
            runSequence('compile-css');
        });

    // Watch .js files
    gulp.watch('_template/app/js/main.js', function(cb)
    {
        runSequence('compile-js');
    });
});

gulp.task('run', function(cb)
{
    runSequence(
        ['compile-css', 'compile-js'], cb);
});

gulp.task('default', function(cb)
{
    runSequence([
        'run',
        'watch'
    ], cb);
});
