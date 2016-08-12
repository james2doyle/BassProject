const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('gulp-browserify');
const buble = require('gulp-buble');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const livereload = require('gulp-livereload');
const autoprefixer = require('gulp-autoprefixer');
const header = require('gulp-header');
const pkg = require('./package.json');

const now = new Date();
// Create an array with the current month, day and time
const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

const banner = `/*!
 * <%= pkg.title || pkg.name %> - <%= pkg.description %>
 * @version v<%= pkg.version %>
 * @link <%= pkg.homepage %>
 * @license <%= pkg.license.type %> (<%= pkg.license.url %>)
 * @copyright (c) <%= date %> <%= pkg.author.name %> (<%= pkg.author.url %>)
 */`;

gulp.task('js', function() {
  gulp.src('src/scripts/index.js')
  .pipe(sourcemaps.init())
  .pipe(browserify({
    insertGlobals : true
  }))
  .pipe(buble({
    transforms: {
      arrow: true,
      modules: true,
      classes: true,
      letConst: true,
      templateString: true,
      dangerousForOf: true
    }
  }))
  .pipe(concat('script.js'))
  .pipe(sourcemaps.write())
  .pipe(header(banner, { pkg : pkg, date: date } ))
  .pipe(gulp.dest('js/'));
});

gulp.task('cssmin', function () {
  gulp.src('css/style.css')
  .pipe(cssmin())
  .pipe(concat('style.min.css'))
  .pipe(gulp.dest('css/'));
});

gulp.task('sass', function () {
  gulp.src('src/styles/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(concat('style.css'))
  .pipe(header(banner, { pkg : pkg, date: date } ))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('css/'));
});

gulp.task('autoprefixer', function () {
  gulp.src('css/style.css')
  .pipe(autoprefixer({
    browsers: ['last 4 versions', 'ie 8', 'ie 9'],
    cascade: false,
    remove: false // keep unneeded prefixes
  }))
  .pipe(concat('style.css'))
  .pipe(gulp.dest('css/'));
});

gulp.task('uglify', function() {
  gulp.src('js/script.js')
  .pipe(uglify())
  .pipe(concat('script.min.js'))
  .pipe(header(banner, { pkg : pkg, date: date } ))
  .pipe(gulp.dest('js/'));
});

gulp.task('watch', function() {
  gulp.watch('src/styles/*.scss', ['sass']);
  gulp.watch('src/styles/imports/*.scss', ['sass']);
  gulp.watch('src/scripts/**/*.js', ['js']);
});

gulp.task('default', ['sass', 'js'], function() {
  // fired before 'finished' event
});

gulp.task('build', ['sass', 'autoprefixer', 'cssmin', 'js', 'uglify'], function() {
  // fired before 'finished' event
});