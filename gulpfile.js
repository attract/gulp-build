let gulp = require('gulp'),
    cssmin = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    copy = require('gulp-contrib-copy'),
    autoprefixer = require('gulp-autoprefixer'),
    helpers = require('./gulp.helpers'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    // livereload = require('gulp-livereload'),
    htmlmin = require('gulp-htmlmin'),
    merge = require('merge-stream'),
    clean = require('gulp-clean'),
    runSequence = require('run-sequence'),
    webserver = require('gulp-webserver'),

    /* New hash */
    hash = require('gulp-hash'),
    replaceAssets = require('gulp-replace-assets');
require('any-promise/register')('bluebird');

// livereload({start : true});

let origSrc = gulp.src,
    PUBLIC_DIR = './public',
    path = {
        scripts: ['js/**/*.js'],
        less: ['styles/root/**/*.less'],
        fonts: ['fonts/**/*.*'],
        vendors: ['vendors/**/*.*'],
        img: ['img/**/*.*'],
        html: './html/**/*.html',
        manifest: '/manifest/manifest.json',
    };

let hashOptions = {
    append: true,
    sourceDir: PUBLIC_DIR
};

gulp.src = function () {
    return helpers.fixPipe(origSrc.apply(this, arguments));
};

gulp.task('webserver', function () {
    gulp.src('')
        .pipe(webserver({
            host: '0.0.0.0',
            // livereload: true,
            directoryListing: false,
            open: true,
            fallback: 'index.html'
        }));
});

gulp.task('fonts', function () {
    return gulp.src(path.fonts)
        .pipe(copy())
        .pipe(gulp.dest(PUBLIC_DIR + '/fonts'));
});

gulp.task('vendors', function () {
    return gulp.src(path.vendors)
        .pipe(copy())
        .pipe(gulp.dest(PUBLIC_DIR + '/vendors'));
});

gulp.task('img', function () {
    return gulp.src(path.img)
        .pipe(imagemin())
        .pipe(gulp.dest(PUBLIC_DIR + '/img'));
});

gulp.task('script', function () {
    /* Files to compile */
    let files = [
        './js/root/index.js',
        './js/root/profile.js'
    ];

    let tasks = files.map(function (entry) {
        return helpers.es6toes5(entry);
    });
    // create a merged stream
    return merge(tasks);
});

gulp.task('clean-js', function () {
    return gulp.src(PUBLIC_DIR + '/js/*.js', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('clean-css', function () {
    return gulp.src(PUBLIC_DIR + '/css/*.css', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('script-min', ['clean-js', 'script'], function () {
    hashOptions.sourceDir = PUBLIC_DIR + '/js';

    return gulp.src(PUBLIC_DIR + '/js/**/*.js')
        .pipe(uglify())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(rename({
            dirname: '/'
        }))
        .pipe(hash())
        .pipe(gulp.dest(PUBLIC_DIR + '/js'))
        .pipe(hash.manifest('./..' + path.manifest, hashOptions))
        .pipe(gulp.dest(PUBLIC_DIR + '/js'));
});

gulp.task('less', ['clean-css'], () => {
    hashOptions.sourceDir = PUBLIC_DIR + '/css';
    return gulp.src(path.less)
        .pipe(less())
        .pipe(autoprefixer([
            'Firefox > 20',
            'Safari > 8',
            'iOS > 7',
            'ie > 10'
        ]))
        .pipe(cssmin())
        // .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(PUBLIC_DIR + '/css'))
        .pipe(hash())
        .pipe(gulp.dest(PUBLIC_DIR + '/css'))
        .pipe(hash.manifest(PUBLIC_DIR + path.manifest, hashOptions))
        .pipe(gulp.dest('.'));
});

/* Only for landings */
gulp.task('hash', function () {
    let manifest = require(PUBLIC_DIR + path.manifest);

    if (envProd) {
        return gulp.src([path.html])
            .pipe(replaceAssets(manifest))
            .pipe(htmlmin({
                collapseWhitespace: true,
                removeComments: true
            }))
            .pipe(gulp.dest('./'))
    } else {
        return gulp.src([path.html])
            .pipe(gulp.dest('./'))
        // .pipe(livereload());
    }
});

gulp.task('watch', function () {
    gulp.watch('js/**/*.js', ['script']);
    gulp.watch('styles/**/*.less', ['less']);
    gulp.watch(path.html, ['hash']);
    // livereload.listen();
});

/* envProd - production environment flag */
let envProd = false;

/* Compile tasks */
gulp.task('default', function (callback) {
    runSequence('script', 'less', 'fonts', 'vendors', 'img', 'watch', 'hash', 'webserver', callback);
});

gulp.task('loc', function (callback) {
    runSequence('script', 'less', 'fonts', 'vendors', 'img', 'watch', 'hash', callback);
});

gulp.task('prod', function (callback) {
    envProd = true;
    runSequence('script-min', 'less', 'fonts', 'vendors', 'img', 'hash', callback);
});
/* Compile tasks */

