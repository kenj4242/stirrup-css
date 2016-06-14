const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const runSequence = require('run-sequence');
const rename = require('gulp-rename');
const header = require('gulp-header');
const pkgconf = require('./package.json');

const paths = {
	src: './src/',
	dist: './dist/'
};

const cssbanner = ['/*!',
  ' * <%= pkgconf.name %> v<%= pkgconf.version %> (<%= pkgconf.homepage %>)',
	' * Copyright 2016 <%= pkgconf.author.name %> <<%= pkgconf.author.email %>> (<%= pkgconf.author.url %>)',
	' * Licensed under <%= pkgconf.license %> (<%= pkgconf.licenseDistUrl %>)',
  ' */', ''].join('\n');

const distname = pkgconf.name.replace(/-css$/, '');


function buildCSS(srcFile, basename) {
	return gulp.src(paths.src+srcFile)
	.pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
	.pipe(postcss([
		autoprefixer({
			browsers: ['last 3 versions']
		})
	]))
	.pipe(rename({ 'basename': basename }))
	.pipe(gulp.dest(paths.dist));
}

gulp.task("build-default", () => {
	return buildCSS('main-default.scss', distname);
})

gulp.task("build-bootstrap", () => {
	return buildCSS('main-bootstrap.scss', distname+'-bootstrap');
})

gulp.task("compress-built", () => {
	return gulp.src(['!'+paths.dist+'*.min.css', paths.dist+'*.css'])
	.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
	.pipe(rename({ extname: '.min.css' }))
	.pipe(gulp.dest(paths.dist));
})

gulp.task("banner", () => {
	return gulp.src(paths.dist+'*.css')
	.pipe(header(cssbanner, { pkgconf : pkgconf } ))
  .pipe(gulp.dest(paths.dist));
});


gulp.task("dist", () => {
	return runSequence(
		['build-default', 'build-bootstrap'],
		'compress-built',
		'banner'
	);
});

gulp.task('default', ['dist']);

