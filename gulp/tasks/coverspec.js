var gulp = require('gulp')
  , config = require('../config')
  , bundle = require('../bundle');

gulp.task(
  'coverspec', bundle.bind(null, config.cover.main, config.cover.options));
