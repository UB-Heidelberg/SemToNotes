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
***REMOVED*** @fileoverview A wrapper for the HTML5 FileReader object.
***REMOVED***
***REMOVED***

goog.provide('goog.fs.FileReader');
goog.provide('goog.fs.FileReader.EventType');
goog.provide('goog.fs.FileReader.ReadyState');

goog.require('goog.async.Deferred');
goog.require('goog.events.EventTarget');
goog.require('goog.fs.Error');
goog.require('goog.fs.ProgressEvent');



***REMOVED***
***REMOVED*** An object for monitoring the reading of files. This emits ProgressEvents of
***REMOVED*** the types listed in {@link goog.fs.FileReader.EventType}.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED*** @final
***REMOVED***
goog.fs.FileReader = function() {
  goog.fs.FileReader.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The underlying FileReader object.
  ***REMOVED***
  ***REMOVED*** @type {!FileReader}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.reader_ = new FileReader();

  this.reader_.onloadstart = goog.bind(this.dispatchProgressEvent_, this);
  this.reader_.onprogress = goog.bind(this.dispatchProgressEvent_, this);
  this.reader_.onload = goog.bind(this.dispatchProgressEvent_, this);
  this.reader_.onabort = goog.bind(this.dispatchProgressEvent_, this);
  this.reader_.onerror = goog.bind(this.dispatchProgressEvent_, this);
  this.reader_.onloadend = goog.bind(this.dispatchProgressEvent_, this);
***REMOVED***
goog.inherits(goog.fs.FileReader, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Possible states for a FileReader.
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
goog.fs.FileReader.ReadyState = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The object has been constructed, but there is no pending read.
 ***REMOVED*****REMOVED***
  INIT: 0,
 ***REMOVED*****REMOVED***
  ***REMOVED*** Data is being read.
 ***REMOVED*****REMOVED***
  LOADING: 1,
 ***REMOVED*****REMOVED***
  ***REMOVED*** The data has been read from the file, the read was aborted, or an error
  ***REMOVED*** occurred.
 ***REMOVED*****REMOVED***
  DONE: 2
***REMOVED***


***REMOVED***
***REMOVED*** Events emitted by a FileReader.
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.fs.FileReader.EventType = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Emitted when the reading begins. readyState will be LOADING.
 ***REMOVED*****REMOVED***
  LOAD_START: 'loadstart',
 ***REMOVED*****REMOVED***
  ***REMOVED*** Emitted when progress has been made in reading the file. readyState will be
  ***REMOVED*** LOADING.
 ***REMOVED*****REMOVED***
  PROGRESS: 'progress',
 ***REMOVED*****REMOVED***
  ***REMOVED*** Emitted when the data has been successfully read. readyState will be
  ***REMOVED*** LOADING.
 ***REMOVED*****REMOVED***
  LOAD: 'load',
 ***REMOVED*****REMOVED***
  ***REMOVED*** Emitted when the reading has been aborted. readyState will be LOADING.
 ***REMOVED*****REMOVED***
  ABORT: 'abort',
 ***REMOVED*****REMOVED***
  ***REMOVED*** Emitted when an error is encountered or the reading has been aborted.
  ***REMOVED*** readyState will be LOADING.
 ***REMOVED*****REMOVED***
  ERROR: 'error',
 ***REMOVED*****REMOVED***
  ***REMOVED*** Emitted when the reading is finished, whether successfully or not.
  ***REMOVED*** readyState will be DONE.
 ***REMOVED*****REMOVED***
  LOAD_END: 'loadend'
***REMOVED***


***REMOVED***
***REMOVED*** Abort the reading of the file.
***REMOVED***
goog.fs.FileReader.prototype.abort = function() {
  try {
    this.reader_.abort();
  } catch (e) {
    throw new goog.fs.Error(e, 'aborting read');
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.fs.FileReader.ReadyState} The current state of the FileReader.
***REMOVED***
goog.fs.FileReader.prototype.getReadyState = function() {
  return***REMOVED*****REMOVED*** @type {goog.fs.FileReader.ReadyState}***REMOVED*** (this.reader_.readyState);
***REMOVED***


***REMOVED***
***REMOVED*** @return {*} The result of the file read.
***REMOVED***
goog.fs.FileReader.prototype.getResult = function() {
  return this.reader_.result;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.fs.Error} The error encountered while reading, if any.
***REMOVED***
goog.fs.FileReader.prototype.getError = function() {
  return this.reader_.error &&
      new goog.fs.Error(this.reader_.error, 'reading file');
***REMOVED***


***REMOVED***
***REMOVED*** Wrap a progress event emitted by the underlying file reader and re-emit it.
***REMOVED***
***REMOVED*** @param {!ProgressEvent} event The underlying event.
***REMOVED*** @private
***REMOVED***
goog.fs.FileReader.prototype.dispatchProgressEvent_ = function(event) {
  this.dispatchEvent(new goog.fs.ProgressEvent(event, this));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fs.FileReader.prototype.disposeInternal = function() {
  goog.fs.FileReader.base(this, 'disposeInternal');
  delete this.reader_;
***REMOVED***


***REMOVED***
***REMOVED*** Starts reading a blob as a binary string.
***REMOVED*** @param {!Blob} blob The blob to read.
***REMOVED***
goog.fs.FileReader.prototype.readAsBinaryString = function(blob) {
  this.reader_.readAsBinaryString(blob);
***REMOVED***


***REMOVED***
***REMOVED*** Reads a blob as a binary string.
***REMOVED*** @param {!Blob} blob The blob to read.
***REMOVED*** @return {!goog.async.Deferred} The deferred Blob contents as a binary string.
***REMOVED***     If an error occurs, the errback is called with a {@link goog.fs.Error}.
***REMOVED***
goog.fs.FileReader.readAsBinaryString = function(blob) {
  var reader = new goog.fs.FileReader();
  var d = goog.fs.FileReader.createDeferred_(reader);
  reader.readAsBinaryString(blob);
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Starts reading a blob as an array buffer.
***REMOVED*** @param {!Blob} blob The blob to read.
***REMOVED***
goog.fs.FileReader.prototype.readAsArrayBuffer = function(blob) {
  this.reader_.readAsArrayBuffer(blob);
***REMOVED***


***REMOVED***
***REMOVED*** Reads a blob as an array buffer.
***REMOVED*** @param {!Blob} blob The blob to read.
***REMOVED*** @return {!goog.async.Deferred} The deferred Blob contents as an array buffer.
***REMOVED***     If an error occurs, the errback is called with a {@link goog.fs.Error}.
***REMOVED***
goog.fs.FileReader.readAsArrayBuffer = function(blob) {
  var reader = new goog.fs.FileReader();
  var d = goog.fs.FileReader.createDeferred_(reader);
  reader.readAsArrayBuffer(blob);
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Starts reading a blob as text.
***REMOVED*** @param {!Blob} blob The blob to read.
***REMOVED*** @param {string=} opt_encoding The name of the encoding to use.
***REMOVED***
goog.fs.FileReader.prototype.readAsText = function(blob, opt_encoding) {
  this.reader_.readAsText(blob, opt_encoding);
***REMOVED***


***REMOVED***
***REMOVED*** Reads a blob as text.
***REMOVED*** @param {!Blob} blob The blob to read.
***REMOVED*** @param {string=} opt_encoding The name of the encoding to use.
***REMOVED*** @return {!goog.async.Deferred} The deferred Blob contents as text.
***REMOVED***     If an error occurs, the errback is called with a {@link goog.fs.Error}.
***REMOVED***
goog.fs.FileReader.readAsText = function(blob, opt_encoding) {
  var reader = new goog.fs.FileReader();
  var d = goog.fs.FileReader.createDeferred_(reader);
  reader.readAsText(blob, opt_encoding);
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Starts reading a blob as a data URL.
***REMOVED*** @param {!Blob} blob The blob to read.
***REMOVED***
goog.fs.FileReader.prototype.readAsDataUrl = function(blob) {
  this.reader_.readAsDataURL(blob);
***REMOVED***


***REMOVED***
***REMOVED*** Reads a blob as a data URL.
***REMOVED*** @param {!Blob} blob The blob to read.
***REMOVED*** @return {!goog.async.Deferred} The deferred Blob contents as a data URL.
***REMOVED***     If an error occurs, the errback is called with a {@link goog.fs.Error}.
***REMOVED***
goog.fs.FileReader.readAsDataUrl = function(blob) {
  var reader = new goog.fs.FileReader();
  var d = goog.fs.FileReader.createDeferred_(reader);
  reader.readAsDataUrl(blob);
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new deferred object for the results of a read method.
***REMOVED*** @param {goog.fs.FileReader} reader The reader to create a deferred for.
***REMOVED*** @return {!goog.async.Deferred} The deferred results.
***REMOVED*** @private
***REMOVED***
goog.fs.FileReader.createDeferred_ = function(reader) {
  var deferred = new goog.async.Deferred();
  reader.listen(goog.fs.FileReader.EventType.LOAD_END,
      goog.partial(function(d, r, e) {
        var result = r.getResult();
        var error = r.getError();
        if (result != null && !error) {
          d.callback(result);
        } else {
          d.errback(error);
        }
        r.dispose();
      }, deferred, reader));
  return deferred;
***REMOVED***
