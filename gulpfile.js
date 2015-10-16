'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var karma = require('karma');
var stripCode = require('gulp-strip-code');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var reactify = require('reactify');
var derequire = require('gulp-derequire');

function r() {
    return browserify({
        entries: ['./js/main.js'],
        debug: true,
        // defining transforms here will avoid crashing your stream
        transform: [reactify],
        standalone: 'main'
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(derequire())
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
}

gulp.task('default', ['build-dev']);

gulp.task('compress', function() {
    r()
        .pipe(stripCode({}))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('jshint', function() {
    return gulp.src(['./js/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
        //.pipe(jshint.reporter('fail'));
});

gulp.task('build-dev', ['jshint'], function() {
    r();
});

gulp.task('watch',function() {
    gulp.watch([ './css/**', './js/**', './index.html'], ['build-dev']);
});

gulp.task('test-watch', function() {
    return karma.server.start({
        configFile: __dirname + '/karma.conf.js'
    });
});

gulp.task('test',  function(done){
    karma.server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});
