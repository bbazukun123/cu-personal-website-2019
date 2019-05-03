const gulp = require("gulp");
const {parallel} = require("gulp");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin")

//Just to copy/update HTML view components from src to dist
function syncViews(){

    return gulp.src("src/views/*.html")
        .pipe(gulp.dest("dist/views"));

}

//Copy & minify HTML view components from src to dist
function buildViews(){

    return gulp.src("src/views/*.html")
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("dist/views"));

}

//Optimise & copy image resources to dist
function syncImages(){

    return gulp.src("src/images/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/images"));

}

function watchHTML(){
    return gulp.watch("src/views/*.html", syncViews);
}

function watchImages(){
    return gulp.watch("src/images/*", syncImages);
}

exports.syncViews = syncViews;
exports.syncImages = syncImages;
exports.buildViews = buildViews;
exports.default = parallel(watchHTML,watchImages);