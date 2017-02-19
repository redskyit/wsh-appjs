//////////////////////////////////////////////////////////////////////////////////
//
//	file-lib.js
//
//	Common routines.  Defines LIB object which contains the API, as well as
//	a global DBG function.
//
/////////////////////////////////////////////////////////////////////////////////

var LIB = require('lib/std.js');

/////////////////////////////////////////////////////////////////////////////////
// Private APIs / Utility functions
/////////////////////////////////////////////////////////////////////////////////

var interface = { global: global, require: global.require };
interface.VERSIONINFO = "File Lib (file-libs.js) version 0.1";

/////////////////////////////////////////////////////////////////////////////////
// interface.fileExists
/////////////////////////////////////////////////////////////////////////////////

interface.fileExists = function(FN) {
	var FSO = interface.CreateObject("Scripting.FileSystemObject");
	var exists = FSO.FileExists(FN);
	FSO = null;
	return exists;
};

/////////////////////////////////////////////////////////////////////////////////
// interface.folderExists
/////////////////////////////////////////////////////////////////////////////////

interface.folderExists = function(FN) {
	var FSO = interface.CreateObject("Scripting.FileSystemObject");
	var exists = FSO.FolderExists(FN);
	FSO = null;
	return exists;
};

/////////////////////////////////////////////////////////////////////////////////
// interface.fileGet
/////////////////////////////////////////////////////////////////////////////////

interface.fileGet = function(FN) {
	var FSO = interface.CreateObject("Scripting.FileSystemObject");
	var file = FSO.GetFile(FN);
	FSO = null;
	return file;
};

/////////////////////////////////////////////////////////////////////////////////
// interface.readFile
//	Read the conents of the pass filename and return as a string
/////////////////////////////////////////////////////////////////////////////////

interface.readFile = function(FN) {
	var FSO = interface.CreateObject("Scripting.FileSystemObject");
	var T = null;
	try {
		var TS = FSO.OpenTextFile(FN,1);
		if (TS.AtEndOfStream) return "";
		T = TS.ReadAll();
		TS.Close();
		TS = null;
	} catch(e) {
		DBG("ERROR! " + e.number + ", " + e.description + ", FN=" + FN);
	}
	FSO = null;
	return T;
};

/////////////////////////////////////////////////////////////////////////////////
// interface.writeFile
//	Write the passed content to named disk file
/////////////////////////////////////////////////////////////////////////////////

interface.writeFile = function(FN, content, charset) {
	var ok;
	if (charset) {
		DBG("WRITE TO DISK USING ADODB.Stream CHARSET " + charset);
		try {
			var fsT = interface.CreateObject("ADODB.Stream");
			fsT.Type = 2; 						// save as text/string data.
			fsT.Charset = charset;				// Specify charset For the source text data.
			fsT.Open();
			fsT.WriteText(content);
			fsT.SaveToFile(FN, 2);				// save as binary to disk
			ok = true;
		} catch(e) {
			DBG("ADODB.Stream: ERROR! " + e.number + ", " + e.description + ", FN=" + FN);
		}
	} else {
		DBG("WRITE TO DISK USING OpenTextFile CHARSET ascii");
		var FSO = interface.CreateObject("Scripting.FileSystemObject");
		try {
			var TS = FSO.OpenTextFile(FN,2,true,0);					// ascii
			TS.Write(content);
			TS.Close();
			TS = null;
			ok = true;
		} catch(e) {
			DBG("OpenTextFile: ERROR! " + e.number + ", " + e.description + ", FN=" + FN);
		}
		FSO = null;
	}
	return ok;
};

/////////////////////////////////////////////////////////////////////////////////
// interface.moveFile
/////////////////////////////////////////////////////////////////////////////////

interface.moveFile = function(FROM, TO) {
	var FSO = interface.CreateObject("Scripting.FileSystemObject");
	var res = FSO.MoveFile(FROM, TO);
	FSO = null;
	return res;
};

/////////////////////////////////////////////////////////////////////////////////
// interface.createFolder
/////////////////////////////////////////////////////////////////////////////////

interface.createFolder = function(FN) {
	var FSO = interface.CreateObject("Scripting.FileSystemObject");
	var res = FSO.CreateFolder(FN);
	FSO = null;
	return res;
};

/////////////////////////////////////////////////////////////////////////////////

return interface;
