var gulp = require('gulp');
var browserSync = require('browser-sync').create();

const webpack = require('webpack');
const webpackStream = require('webpack-stream');

gulp.task('pack', function () {
    return gulp.src('./src/app.js')
        .pipe(webpackStream(require('./webpack.config.js'), webpack))
        .pipe(gulp.dest('./app/'))
        .pipe(browserSync.stream());
});

gulp.task('copy-html', () => {
    return gulp.src(['./src/*.html'])
        .pipe(gulp.dest('./app'));
})

gulp.task('copy-images', () => {
    return gulp.src('./src/img/**/*.{jpg,png,gif,jpeg}')
        .pipe(gulp.dest('./app/img'))
})

gulp.task('copy-json', () => {
    return gulp.src('./src/json/*.json')
        .pipe(gulp.dest('./app/json'))
})

gulp.task('watch', ['build'], () => {
    gulp.watch(['./src/app.js', './src/js/*.js'], ['pack'])
    gulp.watch(['./src/index.html'], ['copy-html'])
    gulp.watch(['./src/json/*.json'], ['copy-json'])
    gulp.watch(['./src/css/*.css', './src/css/*.scss'], ['pack'])
})

gulp.task('serve', ['pack'], function() {
    
    browserSync.init({
        server: "./app"
    });

    gulp.watch(['./src/app.js', './src/js/*.js'], ['pack', browserSync.reload])
    gulp.watch(['./src/index.html'], ['copy-html', browserSync.reload])
    gulp.watch(['./src/json/*.json'], ['copy-json', browserSync.reload])
    gulp.watch(['./src/css/*.css', './src/css/*.scss'], ['pack', browserSync.reload])
    // gulp.watch("app/*.html").on('change', browserSync.reload);
});

gulp.task('build', ['pack', 'copy-html', 'copy-json', 'copy-images'])

gulp.task('default', ['watch'])