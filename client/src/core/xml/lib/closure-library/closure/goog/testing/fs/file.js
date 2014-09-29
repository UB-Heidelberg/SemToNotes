// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Mock file object.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.fs.File');

goog.require('goog.testing.fs.Blob');



***REMOVED***
***REMOVED*** A mock file object.
***REMOVED***
***REMOVED*** @param {string} name The name of the file.
***REMOVED*** @param {Date=} opt_lastModified The last modified date for this file. May be
***REMOVED***     null if file modification dates are not supported.
***REMOVED*** @param {string=} opt_data The string data encapsulated by the blob.
***REMOVED*** @param {string=} opt_type The mime type of the blob.
***REMOVED***
***REMOVED*** @extends {goog.testing.fs.Blob}
***REMOVED***
goog.testing.fs.File = function(name, opt_lastModified, opt_data, opt_type) {
  goog.base(this, opt_data, opt_type);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @see http://www.w3.org/TR/FileAPI/#dfn-name
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.name = name;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @see http://www.w3.org/TR/FileAPI/#dfn-lastModifiedDate
  ***REMOVED*** @type {Date}
 ***REMOVED*****REMOVED***
  this.lastModifiedDate = opt_lastModified || null;
***REMOVED***
goog.inherits(goog.testing.fs.File, goog.testing.fs.Blob);
