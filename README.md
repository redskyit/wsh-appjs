# wsh-appjs
require-js and app framework for Windows Scripting Host JavaScript

# Introduction

`wsh-appjs` provides a small application framework for working with JavaScript and Windows Scripting Host.
If, like me, you like writing JavaScript and don't want to learn PowerShell or install Python, then JavaScript
is a very capable command prompt scripting language.

However, WSH lacks support for writing modular JavaScript, which is where `wsh-appjs` comes in.  `wsh-appjs` is
a very small framework that provides a `require()` function that allows the loading of JavaScript modules by other
JavaScript modules.

Using `wsh-appjs` means that code can now be shared and reused. See the lib subfolder for some examples.

# Getting Started

```
git clone https://github.com/redskyit/wsh-appjs
```

## Create a Basic Application (myapp.js)

An app is just another `wsh-appjs` module that also exports a `main()` method.  Once loaded the `main()` method is called.

```
var LIB = require('lib/std');
return {
  main: function(argv) {
    // your app goes here
    DBG("Hello World");
    return 0;
  }
}
```

## Run It

```
cscript app.js ./myapp
```

# The Module Pattern

All `wsh-appjs` modules follow the same pattern, are run in their own scope and may or may not return an
object, function or other non-zero, null, undefined value.  A common module pattern is:

```
// my module
var LIB = require('lib/std');

var interface = { global: global, VERSIONINFO: "mymodule v1" };

// define rest of interface here

return interface;
```

But that pattern isn't a the only pattern, a module can return a function (constructor) for instance or even
some static data.

# Libraries

## lib/std

This library provides some standard methods and also some global convenience methods.

```
var LIB = require('lib/std');
```

### `DBG(string)`

`DBG` is a global function that will output the passed string to standard output.  It is a convenient shortcut to `WScript.echo()`.

### `array.indexOf(value)`

Adds an `indexOf` method to array objects.

### `LIB.CreateObject(name)`

Works like Server.CreateObject, it is really just an alias for `new ActiveXObject(name)`.

## lib/sendmail

This library provides a sendmail function that uses wither CDO (the default) or `Persists.MailSender` to send an email.
```
var MAIL = require('lib/sendmail');
```

### `MAIL.sendmail(mailmsg)`

Sends a mail based on the supplied `mailmsg` object.  The `mailmsg` object can have the following properties.

| Prop     | Description                                |
|--------- |--------------------------------------------|
| To       | The to email address                       |
| From     | The from email address                     |
| Cc       | The CC list                                |
| ReplyTo  | A reply-to address                         |
| Subject  | The email Subject                          |
| Body     | The email body                             |
| isHTML   | true if the body is an html email message. |
| id       | A message ID                               |
| MAILHOST | The mail server to send the message to     |
| MAILPORT | The port number to use (CDO only)          |

## lib/file

This library contains a bunch of convenience wrappers for `Scripting.FileSystemObject`

### `fileExists(fn)`
### `folderExists(fn)`
### `fileGet(fn)`
### `readFile(fn)`
### `writeFile(fn, content, charset)`
### `moveFile(from, to)`
### `createFolder(fn)`

#### See also

[Scripting.FileSystemObject](https://msdn.microsoft.com/en-us/library/hww8txat(v=vs.84).aspx),
[FileExists](https://msdn.microsoft.com/en-us/library/x23stk5t(v=vs.84).aspx),
[FolderExists](https://msdn.microsoft.com/en-us/library/5xc78d8d(v=vs.84).aspx),
[GetFile](https://msdn.microsoft.com/en-us/library/sheydkke(v=vs.84).aspx),
[ReadAll](https://msdn.microsoft.com/en-us/library/t58aa4dd(v=vs.84).aspx),
[OpenTextFile](https://msdn.microsoft.com/en-us/library/314cz14s(v=vs.84).aspx),
[Write](https://msdn.microsoft.com/en-us/library/6ee7s9w2(v=vs.84).aspx),
[ADODB.Stream](https://docs.microsoft.com/en-us/sql/ado/reference/ado-api/stream-object-ado),
[WriteText](https://docs.microsoft.com/en-us/sql/ado/reference/ado-api/writetext-method),
[MoveFile](https://msdn.microsoft.com/en-us/library/2wcf3ba6(v=vs.84).aspx),
[CreateFolder](https://msdn.microsoft.com/en-us/library/7kby5ae3(v=vs.84).aspx)

## lib/db

This library contains a simple SQL interface based on `ADODB.Connection` and `ADODB.Recordset`.

### `open(connectionString)`

This returns a database object to the opened database.  The object provides the following methods:

| method | Description |
|--------|-------------|
| `query(sql)` | Run the SQL query and return an `ADODB.Recordset` instance with the results. |
| `exec(sql)` | Run the SQL statement and return an `ADODB.Recordset` object if successful. |
| `insert(table, cols)` | Use a recordset `addNew()` to insert a record.  `cols` should be a { name: value, ... } hash map. |
| `close()` | Close the datebase connection |
| `reopen()` | Reopen the datebase connection |

### `quoteString(str)`

Quotes a string for inclusion in a SQL string.

### `blob2Text(blobField, charset)`

Converts a database BLOB to text based on charset.

### `saveBlob(filename, blobField)`

Writes a database BLOB field to the named file using `ADODB.Stream`.

#### See also

[ADODB.Connection](https://docs.microsoft.com/en-us/sql/ado/reference/ado-api/connection-object-ado),
[ADODB.Recordset](https://docs.microsoft.com/en-us/sql/ado/reference/ado-api/recordset-object-ado),
[Open](https://docs.microsoft.com/en-us/sql/ado/reference/ado-api/open-method-ado-recordset),
[Execute](https://docs.microsoft.com/en-us/sql/ado/reference/ado-api/execute-method-ado-connection),
[AddNew](https://docs.microsoft.com/en-us/sql/ado/reference/ado-api/addnew-method-ado)

# Limitations

1. At the moment, a `require()` will only find modules relative to the folder that `app.js` is located in.
See Issue #1.  Ideally modules should be loaded relative to the requiring module.