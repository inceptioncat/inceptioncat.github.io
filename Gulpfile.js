var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch');

gulp.task('default', function() {
  gulp.src(['./css/**','./*.html'])
    .pipe(watch())
    .pipe(livereload());
});
