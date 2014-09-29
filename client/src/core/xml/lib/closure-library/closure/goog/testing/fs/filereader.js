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
***REMOVED*** @fileoverview Mock FileReader object.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.fs.FileReader');

goog.require('goog.Timer');
goog.require('goog.events.EventTarget');
goog.require('goog.fs.Error');
goog.require('goog.fs.FileReader.EventType');
goog.require('goog.fs.FileReader.ReadyState');
goog.require('goog.testing.fs.File');
goog.require('goog.testing.fs.ProgressEvent');



***REMOVED***
***REMOVED*** A mock FileReader object. This emits the same events as
***REMOVED*** {@link goog.fs.FileReader}.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.testing.fs.FileReader = function() {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current state of the reader.
  ***REMOVED*** @type {goog.fs.FileReader.ReadyState}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.readyState_ = goog.fs.FileReader.ReadyState.INIT;
***REMOVED***
goog.inherits(goog.testing.fs.FileReader, goog.events.EventTarget);


***REMOVED***
***REMOVED*** The most recent error experienced by this reader.
***REMOVED*** @type {goog.fs.Error}
***REMOVED*** @private
***REMOVED***
goog.testing.fs.FileReader.prototype.error_;


***REMOVED***
***REMOVED*** Whether the current operation has been aborted.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.fs.FileReader.prototype.aborted_ = false;


***REMOVED***
***REMOVED*** The blob this reader is reading from.
***REMOVED*** @type {goog.testing.fs.Blob}
***REMOVED*** @private
***REMOVED***
goog.testing.fs.FileReader.prototype.blob_;


***REMOVED***
***REMOVED*** The possible return types.
***REMOVED*** @enum {number}
***REMOVED***
goog.testing.fs.FileReader.ReturnType = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Used when reading as text.
 ***REMOVED*****REMOVED***
  TEXT: 1,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Used when reading as binary string.
 ***REMOVED*****REMOVED***
  BINARY_STRING: 2,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Used when reading as array buffer.
 ***REMOVED*****REMOVED***
  ARRAY_BUFFER: 3,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Used when reading as data URL.
 ***REMOVED*****REMOVED***
  DATA_URL: 4
***REMOVED***


***REMOVED***
***REMOVED*** The return type we're reading.
***REMOVED*** @type {goog.testing.fs.FileReader.ReturnType}
***REMOVED*** @private
***REMOVED***
goog.testing.fs.FileReader.returnType_;


***REMOVED***
***REMOVED*** @see {goog.fs.FileReader#getReadyState}
***REMOVED*** @return {goog.fs.FileReader.ReadyState} The current ready state.
***REMOVED***
goog.testing.fs.FileReader.prototype.getReadyState = function() {
  return this.readyState_;
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.FileReader#getError}
***REMOVED*** @return {goog.fs.Error} The current error.
***REMOVED***
goog.testing.fs.FileReader.prototype.getError = function() {
  return this.error_;
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.FileReader#abort}
***REMOVED***
goog.testing.fs.FileReader.prototype.abort = function() {
  if (this.readyState_ != goog.fs.FileReader.ReadyState.LOADING) {
    var msg = 'aborting read';
    throw new goog.fs.Error(goog.fs.Error.ErrorCode.INVALID_STATE, msg);
  }

  this.aborted_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.FileReader#getResult}
***REMOVED*** @return {*} The result of the file read.
***REMOVED***
goog.testing.fs.FileReader.prototype.getResult = function() {
  if (this.readyState_ != goog.fs.FileReader.ReadyState.DONE) {
    return undefined;
  }
  if (this.error_) {
    return undefined;
  }
  if (this.returnType_ == goog.testing.fs.FileReader.ReturnType.TEXT) {
    return this.blob_.toString();
  } else if (this.returnType_ ==
      goog.testing.fs.FileReader.ReturnType.ARRAY_BUFFER) {
    return this.blob_.toArrayBuffer();
  } else if (this.returnType_ ==
      goog.testing.fs.FileReader.ReturnType.BINARY_STRING) {
    return this.blob_.toString();
  } else if (this.returnType_ ==
      goog.testing.fs.FileReader.ReturnType.DATA_URL) {
    return this.blob_.toDataUrl();
  } else {
    return undefined;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Fires the read events.
***REMOVED*** @param {!goog.testing.fs.Blob} blob The blob to read from.
***REMOVED*** @private
***REMOVED***
goog.testing.fs.FileReader.prototype.read_ = function(blob) {
  this.blob_ = blob;
  if (this.readyState_ == goog.fs.FileReader.ReadyState.LOADING) {
    var msg = 'reading file';
    throw new goog.fs.Error(goog.fs.Error.ErrorCode.INVALID_STATE, msg);
  }

  this.readyState_ = goog.fs.FileReader.ReadyState.LOADING;
  goog.Timer.callOnce(function() {
    if (this.aborted_) {
      this.abort_(blob.size);
      return;
    }

    this.progressEvent_(goog.fs.FileReader.EventType.LOAD_START, 0, blob.size);
    this.progressEvent_(goog.fs.FileReader.EventType.LOAD, blob.size / 2,
        blob.size);
    this.progressEvent_(goog.fs.FileReader.EventType.LOAD, blob.size,
        blob.size);
    this.readyState_ = goog.fs.FileReader.ReadyState.DONE;
    this.progressEvent_(goog.fs.FileReader.EventType.LOAD, blob.size,
        blob.size);
    this.progressEvent_(goog.fs.FileReader.EventType.LOAD_END, blob.size,
        blob.size);
  }, 0, this);
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.FileReader#readAsBinaryString}
***REMOVED*** @param {!goog.testing.fs.Blob} blob The blob to read.
***REMOVED***
goog.testing.fs.FileReader.prototype.readAsBinaryString = function(blob) {
  this.returnType_ = goog.testing.fs.FileReader.ReturnType.BINARY_STRING;
  this.read_(blob);
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.FileReader#readAsArrayBuffer}
***REMOVED*** @param {!goog.testing.fs.Blob} blob The blob to read.
***REMOVED***
goog.testing.fs.FileReader.prototype.readAsArrayBuffer = function(blob) {
  this.returnType_ = goog.testing.fs.FileReader.ReturnType.ARRAY_BUFFER;
  this.read_(blob);
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.FileReader#readAsText}
***REMOVED*** @param {!goog.testing.fs.Blob} blob The blob to read.
***REMOVED*** @param {string=} opt_encoding The name of the encoding to use.
***REMOVED***
goog.testing.fs.FileReader.prototype.readAsText = function(blob, opt_encoding) {
  this.returnType_ = goog.testing.fs.FileReader.ReturnType.TEXT;
  this.read_(blob);
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.FileReader#readAsDataUrl}
***REMOVED*** @param {!goog.testing.fs.Blob} blob The blob to read.
***REMOVED***
goog.testing.fs.FileReader.prototype.readAsDataUrl = function(blob) {
  this.returnType_ = goog.testing.fs.FileReader.ReturnType.DATA_URL;
  this.read_(blob);
***REMOVED***


***REMOVED***
***REMOVED*** Abort the current action and emit appropriate events.
***REMOVED***
***REMOVED*** @param {number} total The total data that was to be processed, in bytes.
***REMOVED*** @private
***REMOVED***
goog.testing.fs.FileReader.prototype.abort_ = function(total) {
  this.error_ = new goog.fs.Error(
      goog.fs.Error.ErrorCode.ABORT, 'reading file');
  this.progressEvent_(goog.fs.FileReader.EventType.ERROR, 0, total);
  this.progressEvent_(goog.fs.FileReader.EventType.ABORT, 0, total);
  this.readyState_ = goog.fs.FileReader.ReadyState.DONE;
  this.progressEvent_(goog.fs.FileReader.EventType.LOAD_END, 0, total);
  this.aborted_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Dispatch a progress event.
***REMOVED***
***REMOVED*** @param {goog.fs.FileReader.EventType} type The event type.
***REMOVED*** @param {number} loaded The number of bytes processed.
***REMOVED*** @param {number} total The total data that was to be processed, in bytes.
***REMOVED*** @private
***REMOVED***
goog.testing.fs.FileReader.prototype.progressEvent_ = function(type, loaded,
    total) {
  this.dispatchEvent(new goog.testing.fs.ProgressEvent(type, loaded, total));
***REMOVED***
