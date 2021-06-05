const { src, dest, parallel, watch, series } = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const del = require('del');

const FilesPath = {
  pug: {
    src: './src/resources/views/pages/*.pug',
    dest: './public',
    watch: './src/resources/views/**/*.pug',
  },
  scripts: {
    src: './src/resources/js/*.js',
    dest: './public/js',
  },
  styles: {
    src: './src/resources/scss/**/*.scss',
    dest: './public/assets/css',
  },
  assets: {
    src: './src/assets/**/*',
    dest: './public/assets',
  },
  browserSync: {
    baseDir: './public',
  },
  output: './public',
};

function views() {
  return src(FilesPath.pug.src)
    .pipe(pug({ pretty: true }))
    .pipe(dest(FilesPath.pug.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return src(FilesPath.scripts.src)
    .pipe(concat('all.js'))
    .pipe(dest(FilesPath.scripts.dest));
}

function styles() {
  return src(FilesPath.styles.src)
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(dest(FilesPath.styles.dest))
    .pipe(browserSync.stream());
}

// Clean Up

async function clean() {
  return Promise.resolve(del.sync(FilesPath.output));
}

function assets() {
  return src(FilesPath.assets.src).pipe(dest(FilesPath.assets.dest));
}

function watchFiles() {
  browserSync.init({ server: { baseDir: FilesPath.browserSync.baseDir } });
  watch(FilesPath.pug.watch, views);
  watch(FilesPath.scripts.src, scripts);
  watch(FilesPath.styles.src, styles);
}

const build = series(parallel(views, styles, scripts, assets));

exports.scripts = scripts;
exports.styles = styles;
exports.views = views;
exports.assets = assets;

exports.clean = clean;

exports.build = build;
exports.watch = series(watchFiles, build);

exports.default = build;
