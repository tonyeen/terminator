var gulp = require('gulp');
var childProcess = require('child_process');
var electron = require('electron-prebuilt');
var jetpack = require('fs-jetpack');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');


var projectDir = jetpack;
var srcDir     = projectDir.cwd('./app');
var destDir    = projectDir.cwd('./dist');


gulp.task('styles', function(){

});

gulp.task('scripts', function(){

});

gulp.task('html', function(){

});

gulp.task('images', function(){

});

gulp.task('fonts', function(){

});

gulp.task('wiredep', function(){

});

gulp.task('clean', function (callback) {
    return destDir.dirAsync('.', { empty: true });
});

gulp.task('run', function () {
    childProcess.spawn(electron, ['./app/main/main.js'], {stdio: 'inherit'});

    //gulp.watch();
});

gulp.task('build', function(){

});

gulp.task('default', function(){

});
