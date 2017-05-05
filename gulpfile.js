const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('gulp-browserify');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const header = require('gulp-header');
const pkg = require('./package.json');

// Create an array with the current month, day and time
const now = new Date();
const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

const banner = `/*!
 * <%= pkg.title || pkg.name %> - <%= pkg.description %>
 * @version v<%= pkg.version %>
 * @link <%= pkg.homepage %>
 * @license <%= pkg.license.type %> (<%= pkg.license.url %>)
 * @copyright (c) <%= date %> <%= pkg.author.name %> (<%= pkg.author.url %>)
 */`;

gulp.task('js', () => {
  gulp.src('src/scripts/index.js')
    .pipe(sourcemaps.init())
    .pipe(browserify({
      insertGlobals: true,
      transform: ['rollupify', 'bubleify']
    }))
    .pipe(concat('script.js'))
    .pipe(sourcemaps.write())
    .pipe(header(banner, {
      pkg,
      date
    }))
    .pipe(gulp.dest('js/'));
});

gulp.task('cssmin', () => {
  gulp.src('css/style.css')
    .pipe(cssmin())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('css/'));
});

gulp.task('sass', () => {
  gulp.src('src/styles/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 4 versions', 'ie 8', 'ie 9'],
      cascade: false,
      remove: false // keep unneeded prefixes
    }))
    .pipe(concat('style.css'))
    .pipe(header(banner, {
      pkg,
      date
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css/'));
});

gulp.task('uglify', () => {
  gulp.src('js/script.js')
    .pipe(uglify())
    .pipe(concat('script.min.js'))
    .pipe(header(banner, {
      pkg,
      date
    }))
    .pipe(gulp.dest('js/'));
});

gulp.task('generate-service-worker', ['build'], (callback) => {
  // this new script needs to be registered in a special way
  // https://github.com/GoogleChrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
  const swPrecache = require('sw-precache');

  swPrecache.write('service-worker.js', {
    staticFileGlobs: [
      'js/modernizr.custom.js',
      'js/script.min.js',
      'css/style.min.css'
    ]
  }, callback);
});

gulp.task('watch', () => {
  gulp.watch('src/styles/*.scss', ['sass']);
  gulp.watch('src/styles/imports/*.scss', ['sass']);
  gulp.watch('src/scripts/**/*.js', ['js']);
});

gulp.task('default', ['sass', 'js'], () => {
  // fired before 'finished' event
});

gulp.task('build', ['sass', 'cssmin', 'js', 'uglify'], () => {
  // fired before 'finished' event
});