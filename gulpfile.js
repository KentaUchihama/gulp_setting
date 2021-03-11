const { src, dest, watch, series, parallel } = require('gulp');

// Loading plugins
const rename = require('gulp-rename')
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const autoprefixer = require('autoprefixer')
const cssnext = require('postcss-cssnext')
const ejs = require('gulp-ejs')
const fs = require( 'fs' );
const replace = require('gulp-replace')


// Browser settings
const browsers = [
    'last 2 versions',
    '> 5%',
    'ie = 11',
    'not ie <= 10',
    'ios>= 8',
    'and_chr >= 5',
    'Android >= 5',
]

// Path settings
const pathOrigin = {
    src: './src',
    dest: './dest',
}

const path = {
    styles: {
        src: pathOrigin.src + '/sass/**/*.sass',
        dest: pathOrigin.dest + '/css/',
    },
    html: {
        src: [pathOrigin.src + '/views/**/*.ejs', '!' + pathOrigin.src + '/views/**/_*.ejs'],
        dest: pathOrigin.dest,
    }
}

// Compire sass
const compireSass = () => {
    return src(path.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(postcss([autoprefixer({
            gri: 'autoplace',
        })]))
        .pipe(postcss([cssnext(browsers)]))
        .pipe(dest(path.styles.dest))
}


// Compire ejs
const compireEjs = () => {
    var json = JSON.parse(fs.readFileSync("src/meta.json","utf-8"));
    return src(path.html.src)
        .pipe(
            plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
        )
        .pipe(ejs({json:json}))
        .pipe(rename({ extname: '.html' }))
        .pipe(replace(/[\s\S]*?(<!DOCTYPE)/, "$1"))
        .pipe(dest(path.html.dest))
}


// watching files
const watchFiles = () => {
    watch(path.styles.src, compireSass)
    watch(path.html.src, compireEjs)
}

// Defaule output
exports.default = series(compireEjs, compireSass, watchFiles);
# gulp_setting
