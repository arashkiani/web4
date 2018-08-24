const path = require('path');

module.exports = {
  entry: './lib/web37.js',
  output: {
    filename: 'web37.min.js',
    path: path.resolve(__dirname, 'dist')
  }
};