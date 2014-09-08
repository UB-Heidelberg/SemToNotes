// Copyright 2013 The Closure Library Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

***REMOVED***
***REMOVED*** @fileoverview A nodejs script for dynamically requiring Closure within
***REMOVED*** nodejs.
***REMOVED***
***REMOVED*** Example of usage:
***REMOVED*** <code>
***REMOVED*** require('./bootstrap/nodejs')
***REMOVED*** goog.require('goog.ui.Component')
***REMOVED*** </code>
***REMOVED***
***REMOVED*** This loads goog.ui.Component in the global scope.
***REMOVED***
***REMOVED*** If you want to load custom libraries, you can require the custom deps file
***REMOVED*** directly. If your custom libraries introduce new globals, you may
***REMOVED*** need to run goog.nodeGlobalRequire to get them to load correctly.
***REMOVED***
***REMOVED*** <code>
***REMOVED*** require('./path/to/my/deps.js')
***REMOVED*** goog.bootstrap.nodeJs.nodeGlobalRequire('./path/to/my/base.js')
***REMOVED*** goog.require('my.Class')
***REMOVED*** </code>
***REMOVED***
***REMOVED*** @author nick@medium.com (Nick Santos)
***REMOVED***
***REMOVED*** @nocompile
***REMOVED***


var fs = require('fs');
var path = require('path');


***REMOVED***
***REMOVED*** The goog namespace in the global scope.
***REMOVED***
global.goog = {***REMOVED***


***REMOVED***
***REMOVED*** Imports a script using Node's require() API.
***REMOVED***
***REMOVED*** @param {string} src The script source.
***REMOVED*** @return {boolean} True if the script was imported, false otherwise.
***REMOVED***
global.CLOSURE_IMPORT_SCRIPT = function(src) {
  // Sources are always expressed relative to closure's base.js, but
  // require() is always relative to the current source.
  require('./../' + src);
  return true;
***REMOVED***


// Declared here so it can be used to require base.js
function nodeGlobalRequire(file) {
  process.binding('evals').NodeScript.runInThisContext.call(
      global, fs.readFileSync(file), file);
}


// Load Closure's base.js into memory.  It is assumed base.js is in the
// directory above this directory given this script's location in
// bootstrap/nodejs.js.
nodeGlobalRequire(path.resolve(__dirname, '..', 'base.js'));


***REMOVED***
***REMOVED*** Bootstraps a file into the global scope.
***REMOVED***
***REMOVED*** This is strictly for cases where normal require() won't work,
***REMOVED*** because the file declares global symbols with 'var' that need to
***REMOVED*** be added to the global scope.
***REMOVED*** @suppress {missingProvide}
***REMOVED***
***REMOVED*** @param {string} file The path to the file.
***REMOVED***
goog.nodeGlobalRequire = nodeGlobalRequire;

