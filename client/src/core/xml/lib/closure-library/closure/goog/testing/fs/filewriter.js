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
***REMOVED*** @fileoverview Mock FileWriter object.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.fs.FileWriter');

goog.require('goog.Timer');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.fs.Error');
goog.require('goog.fs.FileSaver.EventType');
goog.require('goog.fs.FileSaver.ReadyState');
goog.require('goog.string');
goog.require('goog.testing.fs.File');
goog.require('goog.testing.fs.ProgressEvent');



***REMOVED***
***REMOVED*** A mock FileWriter object. This emits the same events as
***REMOVED*** {@link goog.fs.FileSaver} and {@link goog.fs.FileWriter}.
***REMOVED***
***REMOVED*** @param {!goog.testing.fs.FileEntry} fileEntry The file entry to write to.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.testing.fs.FileWriter = function(fileEntry) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The file entry to which to write.
  ***REMOVED*** @type {!goog.testing.fs.FileEntry}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.fileEntry_ = fileEntry;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The file blob to write to.
  ***REMOVED*** @type {!goog.testing.fs.File}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.file_ = fileEntry.fileSync();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current state of the writer.
  ***REMOVED*** @type {goog.fs.FileSaver.ReadyState}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.readyState_ = goog.fs.FileSaver.ReadyState.INIT;
***REMOVED***
goog.inherits(goog.testing.fs.FileWriter, goog.events.EventTarget);


***REMOVED***
***REMOVED*** The most recent error experienced by this writer.
***REMOVED*** @type {goog.fs.Error}
***REMOVED*** @private
***REMOVED***
goog.testing.fs.FileWriter.prototype.error_;


***REMOVED***
***REMOVED*** Whether the current operation has been aborted.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.fs.FileWriter.prototype.aborted_ = false;


***REMOVED***
***REMOVED*** The current position in the file.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.fs.FileWriter.prototype.position_ = 0;


***REMOVED***
***REMOVED*** @see {goog.fs.FileSaver#getReadyState}
***REMOVED*** @return {goog.fs.FileSaver.ReadyState} The ready state.
***REMOVED***
goog.testing.fs.FileWriter.prototype.getReadyState = function() {
  return this.readyState_;
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.FileSaver#getError}
***REMOVED*** @return {goog.fs.Error} The error.
***REMOVED***
goog.testing.fs.FileWriter.prototype.getError = function() {
  return this.error_;
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.FileWriter#getPosition}
***REMOVED*** @return {number} The position.
***REMOVED***
goog.testing.fs.FileWriter.prototype.getPosition = function() {
  return this.position_;
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.FileWriter#getLength}
***REMOVED*** @return {number} The length.
***REMOVED***
goog.testing.fs.FileWriter.prototype.getLength = function() {
  return this.file_.size;
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.FileSaver#abort}
***REMOVED***
goog.testing.fs.FileWriter.prototype.abort = function() {
  if (this.readyState_ != goog.fs.FileSaver.ReadyState.WRITING) {
    var msg = 'aborting save of ' + this.fileEntry_.getFullPath();
    throw new goog.fs.Error(goog.fs.Error.ErrorCode.INVALID_STATE, msg);
  }

  this.aborted_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.FileWriter#write}
***REMOVED*** @param {!goog.testing.fs.Blob} blob The blob to write.
***REMOVED***
goog.testing.fs.FileWriter.prototype.write = function(blob) {
  if (this.readyState_ == goog.fs.FileSaver.ReadyState.WRITING) {
    var msg = 'writing to ' + this.fileEntry_.getFullPath();
    throw new goog.fs.Error(goog.fs.Error.ErrorCode.INVALID_STATE, msg);
  }

  this.readyState_ = goog.fs.FileSaver.ReadyState.WRITING;
  goog.Timer.callOnce(function() {
    if (this.aborted_) {
      this.abort_(blob.size);
      return;
    }

    this.progressEvent_(goog.fs.FileSaver.EventType.WRITE_START, 0, blob.size);
    var fileString = this.file_.toString();
    this.file_.setDataInternal(
        fileString.substring(0, this.position_) + blob.toString() +
        fileString.substring(this.position_ + blob.size, fileString.length));
    this.position_ += blob.size;

    this.progressEvent_(
        goog.fs.FileSaver.EventType.WRITE, blob.size, blob.size);
    this.readyState_ = goog.fs.FileSaver.ReadyState.DONE;
    this.progressEvent_(
        goog.fs.FileSaver.EventType.WRITE_END, blob.size, blob.size);
  }, 0, this);
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.FileWriter#truncate}
***REMOVED*** @param {number} size The size to truncate to.
***REMOVED***
goog.testing.fs.FileWriter.prototype.truncate = function(size) {
  if (this.readyState_ == goog.fs.FileSaver.ReadyState.WRITING) {
    var msg = 'truncating ' + this.fileEntry_.getFullPath();
    throw new goog.fs.Error(goog.fs.Error.ErrorCode.INVALID_STATE, msg);
  }

  this.readyState_ = goog.fs.FileSaver.ReadyState.WRITING;
  goog.Timer.callOnce(function() {
    if (this.aborted_) {
      this.abort_(size);
      return;
    }

    this.progressEvent_(goog.fs.FileSaver.EventType.WRITE_START, 0, size);

    var fileString = this.file_.toString();
    if (size > fileString.length) {
      this.file_.setDataInternal(
          fileString + goog.string.repeat('\0', size - fileString.length));
    } else {
      this.file_.setDataInternal(fileString.substring(0, size));
    }
    this.position_ = Math.min(this.position_, size);

    this.progressEvent_(goog.fs.FileSaver.EventType.WRITE, size, size);
    this.readyState_ = goog.fs.FileSaver.ReadyState.DONE;
    this.progressEvent_(goog.fs.FileSaver.EventType.WRITE_END, size, size);
  }, 0, this);
***REMOVED***


***REMOVED***
***REMOVED*** @see {goog.fs.FileWriter#seek}
***REMOVED*** @param {number} offset The offset to seek to.
***REMOVED***
goog.testing.fs.FileWriter.prototype.seek = function(offset) {
  if (this.readyState_ == goog.fs.FileSaver.ReadyState.WRITING) {
    var msg = 'truncating ' + this.fileEntry_.getFullPath();
    throw new goog.fs.Error(goog.fs.Error.ErrorCode.INVALID_STATE, msg);
  }

  if (offset < 0) {
    this.position_ = Math.max(0, this.file_.size + offset);
  } else {
    this.position_ = Math.min(offset, this.file_.size);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Abort the current action and emit appropriate events.
***REMOVED***
***REMOVED*** @param {number} total The total data that was to be processed, in bytes.
***REMOVED*** @private
***REMOVED***
goog.testing.fs.FileWriter.prototype.abort_ = function(total) {
  this.error_ = new goog.fs.Error(
      goog.fs.Error.ErrorCode.ABORT, 'saving ' + this.fileEntry_.getFullPath());
  this.progressEvent_(goog.fs.FileSaver.EventType.ERROR, 0, total);
  this.progressEvent_(goog.fs.FileSaver.EventType.ABORT, 0, total);
  this.readyState_ = goog.fs.FileSaver.ReadyState.DONE;
  this.progressEvent_(goog.fs.FileSaver.EventType.WRITE_END, 0, total);
  this.aborted_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Dispatch a progress event.
***REMOVED***
***REMOVED*** @param {goog.fs.FileSaver.EventType} type The type of the event.
***REMOVED*** @param {number} loaded The number of bytes processed.
***REMOVED*** @param {number} total The total data that was to be processed, in bytes.
***REMOVED*** @private
***REMOVED***
goog.testing.fs.FileWriter.prototype.progressEvent_ = function(
    type, loaded, total) {
  // On write, update the last modified date to the current (real or mock) time.
  if (type == goog.fs.FileSaver.EventType.WRITE) {
    this.file_.lastModifiedDate = new Date(goog.now());
  }

  this.dispatchEvent(new goog.testing.fs.ProgressEvent(type, loaded, total));
***REMOVED***
