require('shelljs/global')

var path = require('path')
var config = require('../config')
var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)

rm('-rf', assetsPath + '/complete')
