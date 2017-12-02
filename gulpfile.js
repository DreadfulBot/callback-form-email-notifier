"use strict";

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    uglifycss = require('gulp-uglifycss'),
    gutil = require('gulp-util'),
    ftp = require('vinyl-ftp'),
    debug = require('gulp-debug');


var uglify = require('gulp-uglify'),
    sftp = require('gulp-sftp'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    inject = require('gulp-inject'),
    rigger = require('gulp-rigger'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    sourcemaps = require('gulp-sourcemaps'),
    scss = require('gulp-scss'),
    cssmin = require('gulp-minify-css'),
    prefixer = require('gulp-autoprefixer'),
    replace = require('gulp-replace');


/* ============================
    VARIABLES
 ============================ */

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

var project = "saturn";

var path = {
    src: {
        html: 'app/*.html',
        fonts: 'app/assets/fonts/**/*',
        img: 'app/assets/img/**/*',
        js: 'app/assets/js/main_' + project + '.js',
        style: 'app/assets/css/main_' + project + '.scss',
        core: 'app/core.php',
        secret: 'app/email/'+ project + '/**/*',
        vendor: 'vendor/**/*'
    },
    build: {
        html: 'build/',
        fonts: 'build/assets/fonts/',
        img: 'build/assets/img/',
        js: 'build/assets/js/',
        style: 'build/assets/css/',
        core: 'build/',
        secret: 'build/email/',
        vendor: 'build/vendor/'
    },
    watch: {
        html: 'app/**/*.html',
        js: 'app/**/*.js',
        style: 'app/**/*.scss',
        core: 'app/core.php'
    },
    clean: './build'
};

var server = {
    host: '192.168.124.5',
    user: 'root',
    pass: 'root',
    remotePath: '/var/www/php.email-notifier'
};


/* ============================
 DEVELOPER TASKS
 ============================ */
gulp.task('html:build', function () {
    return gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    return gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(rename('tc-email-notifier.js'))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('js:buildprod', function () {
    return gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(uglify())
        .pipe(rename('tc-email-notifier.js'))
        .pipe(gulp.dest(path.build.js));
});

gulp.task('style:buildprod', function () {
    return gulp.src(path.src.style)
        .pipe(scss())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(replace('../../../bower_components/bootstrap/dist', '..'))
        .pipe(rename('tc-email-notifier.css'))
        .pipe(gulp.dest(path.build.style));
});

gulp.task('style:build', function () {
    return gulp.src(path.src.style)
        .pipe(scss())
        .pipe(prefixer())
        .pipe(sourcemaps.init())
        .pipe(cssmin())
        .pipe(replace('../../../bower_components/bootstrap/dist', '..'))
        .pipe(sourcemaps.write())
        .pipe(rename('tc-email-notifier.css'))
        .pipe(gulp.dest(path.build.style));
});

gulp.task('fonts:copy', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('core:copy', function () {
    return gulp.src(path.src.core)
        .pipe(rename('tc-email-notifier.php'))
        .pipe(gulp.dest(path.build.core))
});

gulp.task('vendor:copy', function () {
    return gulp.src(path.src.vendor)
        .pipe(gulp.dest(path.build.vendor))
});

gulp.task('secret:copy', function () {
    return gulp.src(path.src.secret)
        .pipe(gulp.dest(path.build.secret))
});

gulp.task('build', ['html:build', 'js:build', 'style:build']);
gulp.task('buildprod', ['html:build', 'js:buildprod', 'style:buildprod']);
gulp.task('copy', ['fonts:copy', 'core:copy', 'vendor:copy', 'secret:copy']);

/* ============================
 PRODUCTION TASKS
 ============================ */

gulp.task('webserver', function () {
    browserSync(config);
});

//clean
gulp.task('clean', function() {
    return gulp.src(path.clean, {read: false})
        .pipe(clean());
});

//watch
gulp.task('watch', function() {
    gulp.watch([path.watch.html], function (event, cb) {
        gulp.start(['html:build']);
    });

    gulp.watch([path.watch.js], function (event, cb) {
       gulp.start(['js:build']);
    });

    gulp.watch([path.watch.style], function (event, cb) {
       gulp.start(['style:build']);
    });

    gulp.watch([path.watch.core], function (event, cb) {
        gulp.start(['core:copy']);
    })
});

//watch
gulp.task('watch-deploy', function() {
    gulp.watch([path.watch.html], function (event, cb) {
        gulp.start(['html:build']);
        gulp.start(['deploy']);
    });

    gulp.watch([path.watch.js], function (event, cb) {
        gulp.start(['js:build']);
        gulp.start(['deploy']);
    });

    gulp.watch([path.watch.style], function (event, cb) {
        gulp.start(['style:build']);
        gulp.start(['deploy']);
    });
});

/*** some ftp stuff ***/
var ftp_data = {
    from : [ "./build/*/**", "./build/**" ],
    to : "/httpdocs"
};

function getConn() {
    gutil.log("Ftp host - " + process.env.ftp_host);
    gutil.log("Ftp user - " + process.env.ftp_user);
    gutil.log("Ftp password - " + process.env.ftp_password);

    return ftp.create({
        host: process.env.ftp_host,
        user: process.env.ftp_user,
        pass: process.env.ftp_password,
        parallel: 10,
        log: gutil.log
    });
}

gulp.task('deploy', function () {
    var conn = getConn();
    return gulp.src(
        ftp_data.from, {buffer: false})
        .pipe(conn.newer('./build'))
        .pipe(debug())
        .pipe(conn.dest(ftp_data.to))
        .pipe(gutil.noop());
});

//default
gulp.task('default', function (done) {
    runSequence('clean', 'copy', 'build', function () {
        done();
    });
});

//default
gulp.task('prod', function (done) {
    runSequence('clean', 'copy', 'buildprod', function () {
        done();
    });
});

//default
gulp.task('remote', function (done) {
    runSequence('clean', 'copy', 'build', 'watch', function () {
        done();
    });
});