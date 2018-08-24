var Web37 = require('./src/web37');
// dont override global variable
if (typeof window !== 'undefined' && typeof window.Web37 === 'undefined') {
    window.Web37 = Web37;
}

module.exports = Web37;
