***REMOVED***
    @overview
    @author Michael Mathews <micmath@gmail.com>
    @license Apache License 2.0 - See file 'LICENSE.md' in this project.
***REMOVED***
'use strict';

***REMOVED***
    @module jsdoc/package
    @see http://wiki.commonjs.org/wiki/Packages/1.0
***REMOVED***

***REMOVED***
    @class
    @classdesc Represents a JavaScript package.
    @param {string} json - The contents of package.json.
***REMOVED***
exports.Package = function(json) {
    json = json || '{}';

   ***REMOVED*****REMOVED*** The source files associated with this package.
        @type {Array<String>}
   ***REMOVED*****REMOVED***
    this.files = [];

   ***REMOVED*****REMOVED*** The kind of this package.
        @readonly
        @default
        @type {string}
  ***REMOVED*****REMOVED***
    this.kind = 'package';

    json = JSON.parse(json);

   ***REMOVED*****REMOVED*** The name of this package.
        This value is found in the package.json file passed in as a command line option.
        @type {string}
  ***REMOVED*****REMOVED***
    this.name = json.name;

   ***REMOVED*****REMOVED*** The longname of this package.
        @type {string}
  ***REMOVED*****REMOVED***
    this.longname = this.kind + ':' + this.name;

   ***REMOVED*****REMOVED*** The description of this package.
        @type {string}
  ***REMOVED*****REMOVED***
    this.description = json.description;

   ***REMOVED*****REMOVED***
        The hash summary of the source file.
        @type {string}
        @since 3.2.0
  ***REMOVED*****REMOVED***
    this.version = json.version;

   ***REMOVED*****REMOVED***
    ***REMOVED*** The licenses of this package.
    ***REMOVED*** @type {Array<Object>}
    ***REMOVED*** @example
    ***REMOVED*** "licenses": [
    ***REMOVED***     {
    ***REMOVED***        "type": "GPLv2",
    ***REMOVED***        "url": "http://www.example.com/licenses/gpl.html"
    ***REMOVED***     }
    ***REMOVED*** ]
   ***REMOVED*****REMOVED***
    this.licenses = json.licenses;
***REMOVED***
