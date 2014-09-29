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
***REMOVED*** @fileoverview Mock filesystem object.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.fs.FileSystem');

goog.require('goog.testing.fs.DirectoryEntry');



***REMOVED***
***REMOVED*** A mock filesystem object.
***REMOVED***
***REMOVED*** @param {string=} opt_name The name of the filesystem.
***REMOVED***
***REMOVED***
goog.testing.fs.FileSystem = function(opt_name) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of the filesystem.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.name_ = opt_name || 'goog.testing.fs.FileSystem';

 ***REMOVED*****REMOVED***
  ***REMOVED*** The root entry of the filesystem.
  ***REMOVED*** @type {!goog.testing.fs.DirectoryEntry}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.root_ = new goog.testing.fs.DirectoryEntry(this, null, '', {});
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.FileSystem#getName}
***REMOVED*** @return {string}
***REMOVED***
goog.testing.fs.FileSystem.prototype.getName = function() {
  return this.name_;
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.FileSystem#getRoot}
***REMOVED*** @return {!goog.testing.fs.DirectoryEntry}
***REMOVED***
goog.testing.fs.FileSystem.prototype.getRoot = function() {
  return this.root_;
***REMOVED***
