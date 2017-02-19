//////////////////////////////////////////////////////////////////////////////////
//
//	app.js
//
//	Bootstrap code for running a javascript app in windows.  Run as:
//
//	cscript.js app.js <appname> <app arguments> ...
//
/////////////////////////////////////////////////////////////////////////////////

"use strict";

/////////////////////////////////////////////////////////////////////////////////
// Bootstrap code, basic module loading functionality
/////////////////////////////////////////////////////////////////////////////////

//
//	The module loaded is run inside a function, with one argument, global which
//	points to the global context.  So global.FN is the same as FN (as long as a
//	version of FN does not exist in local scope).
//
//	The module should return its interface at the end of the script.  The basic
//	pattern for a module is:-
//
//	var interface = { ... };
//	return interface;
//
//	Or:-
//
//	return function() {
//	}
//
//	The appname argument causes <appname>.js to be loaded. The interface returned
//	must define main = function(args) {}, which is called once the module is
//	loaded.


function require(FN) {
	var cache = require.__cache = require.__cache || {};
  if (FN.substr(FN.length-3) !== '.js') FN += ".js";
	if (cache[FN]) return cache[FN];
	var FSO = WScript.CreateObject("Scripting.FileSystemObject");
	var T = null;
	try {
		var TS = FSO.OpenTextFile(FN,1);
		if (TS.AtEndOfStream) return "";
		T = TS.ReadAll();
		TS.Close();
		TS = null;
	} catch(e) {
		WScript.echo("LOAD ERROR! " + e.number + ", " + e.description + ", FN=" + FN);
		WScript.quit();
		return;
	}
	FSO = null;
	T = "(function(global){\n" + '"use strict";' + "\n" + T + "})(this);\n\n////@ sourceURL=" + FN;
	try {
		cache[FN] = eval(T);
	} catch(e) {
		WScript.echo("PARSE ERROR! " + e.number + ", " + e.description + ", FN=" + FN);
		WScript.quit();
	}
	if ("VERSIONINFO" in cache[FN]) WScript.echo(cache[FN].VERSIONINFO);
	return cache[FN];
}

/////////////////////////////////////////////////////////////////////////////////
// Load script, and call app.main()
/////////////////////////////////////////////////////////////////////////////////

var arguments = WScript.arguments;
if (arguments.length > 0) {
	var args = [];
	for (var i = 0; i < arguments.length; i++) {
		args.push(WScript.arguments(i));
	}
	var name = args.shift();
	var app = require(name+".js");
	if (app) {
		if (app.main) {
			var exitstatus = app.main.call(app, args);
			if (typeof exitstatus != undefined) {
				WScript.quit(exitstatus);
			}
		} else {
			WScript.echo("Error, missing main entry point in " + name + ".js");
			WScript.quit(1);
		}
	} else {
		WScript.echo("Error, cannot find " + name + ".js");
		WScript.quit(1);
	}
}
