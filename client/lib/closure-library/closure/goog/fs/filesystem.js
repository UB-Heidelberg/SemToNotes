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
***REMOVED*** @fileoverview A wrapper for the HTML5 FileSystem object.
***REMOVED***
***REMOVED***

goog.provide('goog.fs.FileSystem');



***REMOVED***
***REMOVED*** A local filesystem.
***REMOVED***
***REMOVED*** @interface
***REMOVED***
goog.fs.FileSystem = function() {***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The name of the filesystem.
***REMOVED***
goog.fs.FileSystem.prototype.getName = function() {***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.fs.DirectoryEntry} The root directory of the filesystem.
***REMOVED***
goog.fs.FileSystem.prototype.getRoot = function() {***REMOVED***
