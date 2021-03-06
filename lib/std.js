//////////////////////////////////////////////////////////////////////////////////
//
//	std.js
//
//	Common routines.  Defines LIB object which contains the API, as well as
//	a global DBG function.
//
/////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
// Global APIs
/////////////////////////////////////////////////////////////////////////////////

global.DBG = function(s) {
  WScript.echo(s);
};

Array.prototype.indexOf = function(s) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === s) return i;
  }
  return -1;
}

/////////////////////////////////////////////////////////////////////////////////
// Private APIs / Utility functions
/////////////////////////////////////////////////////////////////////////////////

var interface = { global: global, require: global.require };
interface.VERSIONINFO = "Standard Lib (std.js) version 0.1";

/////////////////////////////////////////////////////////////////////////////////
// Emulate Server.CreateObject
/////////////////////////////////////////////////////////////////////////////////

interface.CreateObject = function(n) { return new ActiveXObject(n); };

/////////////////////////////////////////////////////////////////////////////////

return interface;
