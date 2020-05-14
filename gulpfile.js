const gulp = require('gulp')
const sass = require('gulp-dart-sass')
// const cleanCSS = require('gulp-clean-css')

const autoprefixer = require('gulp-autoprefixer')
// const changed = require('gulp-changed')
// const del = require('del')
const asciidoc = require('@asciidoctor/gulp-asciidoctor')
const log = require('fancy-log')

const SCSSFILES = 'src/scss/**/*.scss'
const THEME = 'src/scss/asciidoctor.scss'
const DEST = 'dest'

/*
function scss () {
  return gulp.src('scss/app.scss')
    .pipe(sass({
      includePaths: sassPaths
      // outputStyle: 'compressed' if css compressed **file size**
    }).on('error', sass.logError))
    //    .pipe($.postcss([
    //      autoprefixer({ browsers: ['last 2 versions', 'ie >= 9'] })
    //    ]))
    .pipe(gulp.dest('css'))
};
*/

function scssTask (cb) {
  gulp.src(THEME)
    .pipe(sass()
      .on('error', sass.logError))
    // .pipe(cleanCSS())
    .pipe(autoprefixer())
    .pipe(gulp.dest(DEST))
  cb()
}

function scssResourcesTask (cb) {
  gulp.src('src/scss/images/**/*.*')
    .pipe(gulp.dest(DEST))
  cb()
}

function docTask (cb) {
  gulp.src(['doc/**/*.adoc', '!doc/**/_*.adoc'])
    .pipe(asciidoc({
      attributes: {
        linkcss: '',
        stylesheet: 'asciidoctor.css',
        stylesdir: './'
      }
    }).on('error', log.error))
    .pipe(gulp.dest(DEST))
  cb()
}
function docResourcesTask (cb) {
  gulp.src('doc/resources/**/*.*')
    .pipe(gulp.dest(DEST))
  cb()
}

const createStylesheets = gulp.parallel(scssTask, scssResourcesTask)
const createDocu = gulp.parallel(docTask, docResourcesTask)

function watchTask () {
  gulp.watch(SCSSFILES, scssTask)
  gulp.watch('doc/**/*.*', docTask)
}

exports.build = gulp.series(createStylesheets, createDocu)
exports.develop = gulp.series(exports.build, watchTask)
