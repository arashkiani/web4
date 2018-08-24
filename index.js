//var web37 = require('./src/web37');
import web37 from './src/web37'
// dont override global variable
if (typeof window !== 'undefined' && typeof window.web37 === 'undefined') {
    window.web37 = web37;
}

module.exports = web37;
