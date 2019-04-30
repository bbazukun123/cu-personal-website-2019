const gulp = require("gulp");
const {parallel} = require("gulp");
var htmlmin = require('gulp-htmlmin');

//Just to copy/update HTML view components from src to dist
function syncViews(){

    return gulp.src("./src/views/*.html")
        .pipe(gulp.dest("./dist/views"));

}

//Copy & minify HTML view components from src to dist
function buildViews(){

    return gulp.src("./src/views/*.html")
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("./dist/views"));

}

//Copy/update scss files from Bootstrap in node modules to src 
function syncBs(){

    return gulp.src("node_modules/bootstrap/scss/**/*.scss")
        .pipe(gulp.dest("src/scss/bootstrap"));
}

//Copy/update js files in from Bootstrap & JQuery in node modules to src 
function syncJs(){

    return gulp.src(["node_modules/bootstrap/dist/js/bootstrap.bundle.min.js","node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map","node_modules/jquery/dist/jquery.slim.min.js"])
        .pipe(gulp.dest("src/js/ext_modules"));
}

function watch(){
    return gulp.watch("./src/views/*.html", syncViews);
}

exports.syncViews = syncViews;
exports.buildViews = buildViews;
exports.syncBsJq = parallel(syncBs,syncJs);
exports.default = watch;