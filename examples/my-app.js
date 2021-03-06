// example of a slightly expanded app pattern where a -conf.js file defines the
// initial app object and the app code extends and returns it.

var LIB = require('lib/std');
var APP = require('examples/my-app-conf');			// my app config (optional)

APP.main = function() {
	DBG(APP.GREETING);
	return 0;
}

return APP;
