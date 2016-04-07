var gulp        = require('gulp'),
    clean       = require('gulp-clean'),
    useref      = require('gulp-useref'),
    gulpif      = require('gulp-if'),
    uglify      = require('gulp-uglify'),
    concatCss   = require('gulp-concat-css'),
    minifyCss   = require('gulp-clean-css'),
    imagemin    = require('gulp-imagemin'),
    size        = require('gulp-size'),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload;


// Default task
gulp.task('default', ['server', 'watch']);

// Run server
gulp.task('server', function() {
    browserSync.init({
    	notify: false,
        server: {
            baseDir: 'app'
        }
    });
});

// Watch
gulp.task('watch', function () {
    gulp.watch([
        './app/*.html',
        './app/css/*.css',
        './app/js/*.js'
    ], reload);
});


/************СБОРКА****************/

// Очистка папки DIST
gulp.task('clean', function () {
    return gulp.src('dist')
        .pipe(clean({force: true}));
});

// Переносим HTML, CSS, JS в папку DIST
gulp.task('useref', function () {
    var assets = useref.assets();
    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss({compatibility: 'ie8'})))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

// Перенос шрифтов в папку DIST
gulp.task('fonts', function() {
    gulp.src('app/fonts/*')
        .pipe(gulp.dest('dist/fonts/'));
});

// Перенос картинок в папку DIST
gulp.task('images', function () {
    return gulp.src('app/img/**/*')
    .pipe(imagemin({
        progressive: true,
        interlaced: true
    }))
    .pipe(gulp.dest('dist/img'));
});

// Остальные файлы, такие как favicon.ico и пр.
gulp.task('extras', function () {
    return gulp.src([
        'app/*.*',
        '!app/*.html'
    ]).pipe(gulp.dest('dist'));
});

// Сборка и вывод размера содержимого папки DIST
gulp.task('dist', ['useref', 'images', 'fonts', 'extras'], function () {
    return gulp.src('dist/**/*')
        .pipe(size({title: 'dist'}));
});

// Очистка папки
gulp.task('build', ['clean'], function () {
    gulp.start('dist');
});

// Запуск сервера
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: './app'
        }
    });
});

// Запуск сервера с проверкой папки DIST
gulp.task('server-dist', function () {  
    browserSync.init({
        notify: false,
        port: 9000,
        server: {
          baseDir: './dist'
        }
    });
});
