// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Concrete implementation of the goog.fs.FileSystem interface
***REMOVED***     using an HTML FileSystem object.
***REMOVED***
goog.provide('goog.fs.FileSystemImpl');

goog.require('goog.fs.DirectoryEntryImpl');
goog.require('goog.fs.FileSystem');



***REMOVED***
***REMOVED*** A local filesystem.
***REMOVED***
***REMOVED*** This shouldn't be instantiated directly. Instead, it should be accessed via
***REMOVED*** {@link goog.fs.getTemporary} or {@link goog.fs.getPersistent}.
***REMOVED***
***REMOVED*** @param {!FileSystem} fs The underlying FileSystem object.
***REMOVED***
***REMOVED*** @implements {goog.fs.FileSystem}
***REMOVED*** @final
***REMOVED***
goog.fs.FileSystemImpl = function(fs) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The underlying FileSystem object.
  ***REMOVED***
  ***REMOVED*** @type {!FileSystem}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.fs_ = fs;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fs.FileSystemImpl.prototype.getName = function() {
  return this.fs_.name;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fs.FileSystemImpl.prototype.getRoot = function() {
  return new goog.fs.DirectoryEntryImpl(this, this.fs_.root);
***REMOVED***


***REMOVED***
***REMOVED*** @return {!FileSystem} The underlying FileSystem object.
***REMOVED***
goog.fs.FileSystemImpl.prototype.getBrowserFileSystem = function() {
  return this.fs_;
***REMOVED***
