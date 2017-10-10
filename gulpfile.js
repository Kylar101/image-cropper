var gulp = require('gulp');
// var electron = require('electron-connect').server.create();

const webpack = require('webpack');
const webpackStream = require('webpack-stream');
 
// gulp.task('serve', ['build'], function () {
 
//   // Start browser process 
//   electron.start();
 
//   // Restart browser process 
//   gulp.watch('index.js', electron.restart);
 
//   // Reload renderer process 
//   gulp.watch(['./src/app.js', './src/js/*.js'], ['pack', electron.reload])
//   gulp.watch(['./src/index.html'],['copy-html', electron.reload])
//   gulp.watch(['./src/json/*.json'],['copy-json',electron.reload])
//   gulp.watch(['./src/css/*.css', './src/css/*.scss'],['pack', electron.reload])
// });

gulp.task('pack', function() {
	  return gulp.src('./src/app.js')
	    .pipe(webpackStream(require('./webpack.config.js'), webpack))
	    .pipe(gulp.dest('./app/'));
	});

gulp.task('copy-html', ()=> {
  return gulp.src(['./src/*.html'])
	    .pipe(gulp.dest('./app'));
})

gulp.task('copy-images', ()=> {
  return gulp.src('./src/img/**/*.{jpg,png,gif,jpeg}')
	    .pipe(gulp.dest('./app/img'))
})

gulp.task('copy-json', ()=> {
  return gulp.src('./src/json/*.json')
      .pipe(gulp.dest('./app/json'))
})

gulp.task('watch', ['build'], () => {
  gulp.watch(['./src/app.js', './src/js/*.js'], ['pack'])
  gulp.watch(['./src/index.html'],['copy-html'])
  gulp.watch(['./src/json/*.json'],['copy-json'])
  gulp.watch(['./src/css/*.css', './src/css/*.scss'],['pack'])
})

gulp.task('build', ['pack', 'copy-html','copy-json','copy-images'])