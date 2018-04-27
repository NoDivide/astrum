// Imports
var babelify = require('babelify'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    cleanCSS = require('gulp-clean-css')
    getEnvValue = require('./utils/get-env-value'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    source = require('vinyl-source-stream'),
    stringify = require('stringify'),
    uglify = require('gulp-uglifyes');

// Configs 
var config = {
    css: {
        inputPath: getEnvValue('CSS_INPUT_PATH', '_template/app/css/styles.css'),
        outputPath: getEnvValue('CSS_OUTPUT_PATH', '_template/app/css/'),
        inputFileName: getEnvValue('CSS_INPUT_FILENAME', 'style.css'),
        outputFileName: getEnvValue('CSS_OUTPUT_FILENAME', 'styles.min.css')
    },
    js: {
        inputPath: getEnvValue('JS_INPUT_PATH', '_template/app/js/main.js'),
        outputPath: getEnvValue('JS_OUTPUT_PATH', '_template/app/js/'),
        inputFileName: getEnvValue('JS_INPUT_FILENAME', 'main.js'),
        outputFileName: getEnvValue('JS_OUTPUT_FILENAME', 'main.min.js')
    }
};

// Tasks
gulp.task('compile-js', function() {
    return browserify({
            entries: config.js.inputPath,
            transform: [babelify],
            debug: !(process.env.NODE_ENV === 'production')
        })
        .transform(stringify)
        .bundle()
        .pipe(source(config.js.inputFileName))
        .pipe(buffer())
        .pipe(rename(config.js.outputFileName))
        .pipe(uglify())
        .pipe(gulp.dest(config.js.outputPath));
});

gulp.task('compile-css', function() {
    return gulp.src(config.css.inputPath)
        .pipe(cleanCSS())
        .pipe(rename(config.css.outputFileName))
        .pipe(gulp.dest(config.css.outputPath));
});

gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch(config.css.inputPath, function() {
        runSequence('compile-css');
    });

    // Watch .js files
    gulp.watch(config.js.inputPath, function() {
        runSequence('compile-js');
    });
});

gulp.task('run', function() {
    return runSequence(['compile-css', 'compile-js']);
});

gulp.task('default', function() {
    runSequence(['run', 'watch']);
});