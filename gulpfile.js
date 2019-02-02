var gulp          = require('gulp'),
    babel         = require('gulp-babel'),
    plumber       = require('gulp-plumber'),
    rename        = require('gulp-rename'),
    uglify        = require('gulp-uglify');

function javascript() {
  return gulp.src(['src/js/**/*.js', '!src/js/**/*.min.js'])
      .pipe(plumber())
      .pipe(babel({ presets: ['@babel/preset-env'] }))
      .pipe(uglify())
      .pipe(rename({ suffix: '.min' }))
      .pipe(plumber.stop())
      .pipe(gulp.dest('src/js'));
}

function watch() {
  javascript();

  gulp.watch('src/js/**/*.js', javascript);
}

exports.watch = watch;
exports.javascript = javascript;