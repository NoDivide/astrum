var gulp   = require('gulp'),argv = require('yargs').argv,
    config = require('../../../../gulp-config.js'),
    concat = require('gulp-concat');
    
gulp.task('combine-head-specific-javascript-into-head-file', function(cb)
{
    var build = argv.build || 'site';

    if(config.vendor[build].scripts.head)
    {
        return gulp.src(config.vendor[build].scripts.head)
                   .pipe(concat('head.js'))
                   .pipe(gulp.dest(config.builds[build].scripts.src))
    }
});

