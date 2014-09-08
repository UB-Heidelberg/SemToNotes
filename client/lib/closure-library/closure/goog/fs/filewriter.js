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
***REMOVED*** @fileoverview A wrapper for the HTML5 FileWriter object.
***REMOVED***
***REMOVED*** When adding or modifying functionality in this namespace, be sure to update
***REMOVED*** the mock counterparts in goog.testing.fs.
***REMOVED***
***REMOVED***

goog.provide('goog.fs.FileWriter');

goog.require('goog.fs.Error');
goog.require('goog.fs.FileSaver');



***REMOVED***
***REMOVED*** An object for monitoring the saving of files, as well as other fine-grained
***REMOVED*** writing operations.
***REMOVED***
***REMOVED*** This should not be instantiated directly. Instead, it should be accessed via
***REMOVED*** {@link goog.fs.FileEntry#createWriter}.
***REMOVED***
***REMOVED*** @param {!FileWriter} writer The underlying FileWriter object.
***REMOVED***
***REMOVED*** @extends {goog.fs.FileSaver}
***REMOVED*** @final
***REMOVED***
goog.fs.FileWriter = function(writer) {
  goog.fs.FileWriter.base(this, 'constructor', writer);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The underlying FileWriter object.
  ***REMOVED***
  ***REMOVED*** @type {!FileWriter}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.writer_ = writer;
***REMOVED***
goog.inherits(goog.fs.FileWriter, goog.fs.FileSaver);


***REMOVED***
***REMOVED*** @return {number} The byte offset at which the next write will occur.
***REMOVED***
goog.fs.FileWriter.prototype.getPosition = function() {
  return this.writer_.position;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The length of the file.
***REMOVED***
goog.fs.FileWriter.prototype.getLength = function() {
  return this.writer_.length;
***REMOVED***


***REMOVED***
***REMOVED*** Write data to the file.
***REMOVED***
***REMOVED*** @param {!Blob} blob The data to write.
***REMOVED***
goog.fs.FileWriter.prototype.write = function(blob) {
  try {
    this.writer_.write(blob);
  } catch (e) {
    throw new goog.fs.Error(e, 'writing file');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Set the file position at which the next write will occur.
***REMOVED***
***REMOVED*** @param {number} offset An absolute byte offset into the file.
***REMOVED***
goog.fs.FileWriter.prototype.seek = function(offset) {
  try {
    this.writer_.seek(offset);
  } catch (e) {
    throw new goog.fs.Error(e, 'seeking in file');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Changes the length of the file to that specified.
***REMOVED***
***REMOVED*** @param {number} size The new size of the file, in bytes.
***REMOVED***
goog.fs.FileWriter.prototype.truncate = function(size) {
  try {
    this.writer_.truncate(size);
  } catch (e) {
    throw new goog.fs.Error(e, 'truncating file');
  }
***REMOVED***
