'use strict';

const fs = require('fs')

import plugins       from 'gulp-load-plugins';
//import gutil         from 'gulp-util';
import yargs         from 'yargs';
import browser       from 'browser-sync';
import gulp          from 'gulp';
import rimraf        from 'rimraf';
import yaml          from 'js-yaml';
//import fs            from 'fs';
//import dateFormat    from 'dateformat';
import webpackStream from 'webpack-stream';
import webpack2      from 'webpack';
import named         from 'vinyl-named';

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Check for --development flag unminified with sourcemaps
const DEV = !!(yargs.argv.dev);

// Load settings from settings.yml
const { BROWSERSYNC, COMPATIBILITY, REVISIONING, PATHS } = loadConfig();

// Check if file exists synchronously
function checkFileExists(filepath) {
  let flag = true;
  try {
    fs.accessSync(filepath, fs.F_OK);
  } catch(e) {
    flag = false;
  }
  return flag;
}

// Load default or custom YML config file
function loadConfig() {
  console.log('Loading config file...');

  if (checkFileExists('config.yml')) {
    // config.yml exists, load it
    console.log('config.yml exists, loading config.yml');
    let ymlFile = fs.readFileSync('config.yml', 'utf8');
    return yaml.load(ymlFile);

  } else if(checkFileExists('config-default.yml')) {
    // config-default.yml exists, load it
    console.log('config.yml does not exist, loading config-default.yml');
    let ymlFile = fs.readFileSync('config-default.yml', 'utf8');
    return yaml.load(ymlFile);

  } else {
    // Exit if config.yml & config-default.yml do not exist
    console.log('Exiting process, no config file exists.');
    console.log('Error Code:', err.code);
    process.exit(1);
  }
}



// Build the "dist" folder by running all of the below tasks
gulp.task('build',
 gulp.series(clean, sass, javascript, images));

// Build the site, run the server, and watch for file changes
gulp.task('default',
  gulp.series('build', server, watch));

  // Start and watch
gulp.task('start', gulp.series('build', server, watch));

// Package task
gulp.task('package',
  gulp.series('build', archive));


// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  rimraf(PATHS.dist, done);
}


// Copy files out of the assets folder
// This task skips over the "images", "js", and "scss" folders, which are parsed separately
function copy() {
  return;
  /*
  return gulp.src('images/*')
    .pipe(gulp.dest());
  */
}

// Compile Sass into CSS
// In production, the CSS is compressed
function sass() {
  return gulp.src('src/scss/app.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: PATHS.sass
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: COMPATIBILITY
    }))

    .pipe($.if(PRODUCTION, $.cleanCss({ compatibility: 'ie9' })))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe($.if(REVISIONING && PRODUCTION || REVISIONING && DEV, $.rev()))
    .pipe(gulp.dest(PATHS.dist + '/css'))
    .pipe($.if(REVISIONING && PRODUCTION || REVISIONING && DEV, $.rev.manifest()))
    .pipe(gulp.dest(PATHS.dist + '/css'))
    .pipe(browser.reload({ stream: true }));
}

let webpackConfig = {
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  externals: {
    jquery: 'jQuery'
  }
}
// Combine JavaScript into one file
// In production, the file is minified
function javascript() {
  return gulp.src(PATHS.entries)
    .pipe(named())
    .pipe($.sourcemaps.init())
    .pipe(webpackStream(webpackConfig, webpack2))
    .pipe($.if(PRODUCTION, $.uglify()
      .on('error', e => { console.log(e); })
    ))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe($.if(REVISIONING && PRODUCTION || REVISIONING && DEV, $.rev()))
    .pipe(gulp.dest(PATHS.dist + '/js'))
    .pipe($.if(REVISIONING && PRODUCTION || REVISIONING && DEV, $.rev.manifest()))
    .pipe(gulp.dest(PATHS.dist + '/js'));
}

// Copy images to the "dist" folder
// In production, the images are compressed
function images() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest(PATHS.dist + '/images'));
    /*.pipe($.if(PRODUCTION, $.imagemin({
      progressive: true
    })))
    .pipe(gulp.dest(PATHS.dist + '/images')); */
}

// Create a .zip archive of the theme
function archive() {
  var time = dateFormat(new Date(), "yyyy-mm-dd_HH-MM");
  var pkg = JSON.parse(fs.readFileSync('./package.json'));
  var title = pkg.name + '_' + time + '.zip';

  return gulp.src(PATHS.package)
    .pipe($.zip(title))
    .pipe(gulp.dest('packaged'));
}

// PHP Code Sniffer task
gulp.task('phpcs', function() {
  return gulp.src(PATHS.phpcs)
    .pipe($.phpcs({
      bin: 'wpcs/vendor/bin/phpcs',
      standard: './codesniffer.ruleset.xml',
      showSniffCode: true,
    }))
    .pipe($.phpcs.reporter('log'));
});

// PHP Code Beautifier task
gulp.task('phpcbf', function () {
  return gulp.src(PATHS.phpcs)
  .pipe($.phpcbf({
    bin: 'wpcs/vendor/bin/phpcbf',
    standard: './codesniffer.ruleset.xml',
    warningSeverity: 0
  }))
  .on('error', $.util.log)
  .pipe(gulp.dest('.'));
});

// Start BrowserSync to preview the site in
function server(done) {
  browser.init({
    proxy: BROWSERSYNC.url,

    ui: {
      port: 8080
    },

  });
  done();
}

// Reload the browser with BrowserSync
function reload(done) {
  browser.reload();
  done();
}

// Watch for changes to static assets, pages, Sass, and JavaScript
function watch() {
  //gulp.watch(gulp.src(), copy);
  gulp.watch('src/scss/**/*.scss').on('all', sass);
  gulp.watch('**/*.php').on('all', browser.reload);
  gulp.watch('src/js/**/*.js').on('all', gulp.series(javascript, browser.reload));
  gulp.watch('src/img/**/*').on('all', gulp.series(images, browser.reload));
}
