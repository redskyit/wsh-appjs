// very basic hello world example.  The absolute minimum code required to run an app.
var LIB = require('lib/std.js');

// basic app pattern, must return an object with a main() method
return { 
	main: function() {
		DBG("Hello World");
		return 0;
	}
}
