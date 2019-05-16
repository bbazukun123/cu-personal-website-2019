const gulp = require("gulp");
const {parallel} = require("gulp");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const jsonminify = require('gulp-jsonminify');
const del = require('del');

//Just to copy/update HTML view components from src to dist
function syncViews(){

    return gulp.src("src/views/*.html")
        .pipe(gulp.dest("dist/views"));

}

function syncContent(){

    return gulp.src("src/content/*.json")
        .pipe(gulp.dest("dist/content"));

}

//Copy & minify HTML view components from src to dist
function buildViews(){

    return gulp.src("src/views/*.html")
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("dist/views"));

}

function buildContent(){

    return gulp.src("src/content/*.json")
        .pipe(jsonminify())
        .pipe(gulp.dest("dist/content"));

}

//Optimise & copy image resources to dist
function syncImages(){

    return gulp.src("src/images/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/images"));

}

//Clean Folders
function cleanViews(){
    return del(["dist/views/"]);
}

function cleanImages(){
    return del(["dist/images/"]);
}

function cleanContent(){
    return del(["dist/content/"]);
}

function cleanAll(){
    return del(["dist/"]);
}

//Watch Folders
function watchHTML(){
    return gulp.watch("src/views/*.html", syncViews);
}

function watchContent(){
    return gulp.watch("src/content/*.json", syncContent);
}

function watchImages(){
    return gulp.watch("src/images/**/*", syncImages);
}

exports.syncViews = syncViews;
exports.syncContent = syncContent;
exports.syncImages = syncImages;
exports.cleanViews = cleanViews;
exports.cleanContent = cleanContent;
exports.cleanImages = cleanImages;
exports.cleanAll = cleanAll;
exports.buildViews = buildViews;
exports.buildContent = buildContent;
exports.default = parallel(watchHTML,watchImages,watchContent);