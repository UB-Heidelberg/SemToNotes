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
***REMOVED*** @fileoverview Asynchronous hash computer for the Blob interface.
***REMOVED***
***REMOVED*** The Blob interface, part of the HTML5 File API, is supported on Chrome 7+,
***REMOVED*** Firefox 4.0 and Opera 11. No Blob interface implementation is expected on
***REMOVED*** Internet Explorer 10. Chrome 11, Firefox 5.0 and the subsequent release of
***REMOVED*** Opera are supposed to use vendor prefixes due to evolving API, see
***REMOVED*** http://dev.w3.org/2006/webapi/FileAPI/ for details.
***REMOVED***
***REMOVED*** This implementation currently uses upcoming Chrome and Firefox prefixes,
***REMOVED*** plus the original Blob.slice specification, as implemented on Chrome 10
***REMOVED*** and Firefox 4.0.
***REMOVED***
***REMOVED***

goog.provide('goog.crypt.BlobHasher');
goog.provide('goog.crypt.BlobHasher.EventType');

goog.require('goog.asserts');
goog.require('goog.crypt');
goog.require('goog.crypt.Hash');
goog.require('goog.debug.Logger');
goog.require('goog.events.EventTarget');
goog.require('goog.fs');



***REMOVED***
***REMOVED*** Construct the hash computer.
***REMOVED***
***REMOVED*** @param {!goog.crypt.Hash} hashFn The hash function to use.
***REMOVED*** @param {number=} opt_blockSize Processing block size.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.crypt.BlobHasher = function(hashFn, opt_blockSize) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The actual hash function.
  ***REMOVED*** @type {!goog.crypt.Hash}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.hashFn_ = hashFn;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The blob being processed.
  ***REMOVED*** @type {Blob}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.blob_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Computed hash value.
  ***REMOVED*** @type {Array.<number>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.hashVal_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of bytes already processed.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.bytesProcessed_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Processing block size.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.blockSize_ = opt_blockSize || 5000000;

 ***REMOVED*****REMOVED***
  ***REMOVED*** File reader object.
  ***REMOVED*** @type {FileReader}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.fileReader_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The logger used by this object.
  ***REMOVED*** @type {!goog.debug.Logger}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.logger_ = goog.debug.Logger.getLogger('goog.crypt.BlobHasher');
***REMOVED***
goog.inherits(goog.crypt.BlobHasher, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Event names for hash computation events
***REMOVED*** @enum {string}
***REMOVED***
goog.crypt.BlobHasher.EventType = {
  STARTED: 'started',
  PROGRESS: 'progress',
  COMPLETE: 'complete',
  ABORT: 'abort',
  ERROR: 'error'
***REMOVED***


***REMOVED***
***REMOVED*** Start the hash computation.
***REMOVED*** @param {!Blob} blob The blob of data to compute the hash for.
***REMOVED***
goog.crypt.BlobHasher.prototype.hash = function(blob) {
  this.abort();
  this.hashFn_.reset();
  this.blob_ = blob;
  this.hashVal_ = null;
  this.bytesProcessed_ = 0;
  this.dispatchEvent(goog.crypt.BlobHasher.EventType.STARTED);

  this.processNextBlock_();
***REMOVED***


***REMOVED***
***REMOVED*** Abort hash computation.
***REMOVED***
goog.crypt.BlobHasher.prototype.abort = function() {
  if (this.fileReader_ &&
      this.fileReader_.readyState != this.fileReader_.DONE) {
    this.fileReader_.abort();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} Number of bytes processed so far.
***REMOVED***
goog.crypt.BlobHasher.prototype.getBytesProcessed = function() {
  return this.bytesProcessed_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Array.<number>} The computed hash value or null if not ready.
***REMOVED***
goog.crypt.BlobHasher.prototype.getHash = function() {
  return this.hashVal_;
***REMOVED***


***REMOVED***
***REMOVED*** Helper function setting up the processing for the next block, or finalizing
***REMOVED*** the computation if all blocks were processed.
***REMOVED*** @private
***REMOVED***
goog.crypt.BlobHasher.prototype.processNextBlock_ = function() {
  goog.asserts.assert(this.blob_, 'The blob has disappeared during processing');
  if (this.bytesProcessed_ < this.blob_.size) {
    // We have to reset the FileReader every time, otherwise it fails on
    // Chrome, including the latest Chrome 12 beta.
    // http://code.google.com/p/chromium/issues/detail?id=82346
    this.fileReader_ = new FileReader();
    this.fileReader_.onload = goog.bind(this.onLoad_, this);
    this.fileReader_.onabort = goog.bind(this.dispatchEvent, this,
                                         goog.crypt.BlobHasher.EventType.ABORT);
    this.fileReader_.onerror = goog.bind(this.dispatchEvent, this,
                                         goog.crypt.BlobHasher.EventType.ERROR);

    var size = Math.min(this.blob_.size - this.bytesProcessed_,
                        this.blockSize_);
    var chunk = goog.fs.sliceBlob(this.blob_, this.bytesProcessed_,
                                  this.bytesProcessed_ + size);
    if (!chunk || chunk.size != size) {
      this.logger_.severe('Failed slicing the blob');
      this.dispatchEvent(goog.crypt.BlobHasher.EventType.ERROR);
      return;
    }

    if (this.fileReader_.readAsArrayBuffer) {
      this.fileReader_.readAsArrayBuffer(chunk);
    } else if (this.fileReader_.readAsBinaryString) {
      this.fileReader_.readAsBinaryString(chunk);
    } else {
      this.logger_.severe('Failed calling the chunk reader');
      this.dispatchEvent(goog.crypt.BlobHasher.EventType.ERROR);
    }
  } else {
    this.hashVal_ = this.hashFn_.digest();
    this.dispatchEvent(goog.crypt.BlobHasher.EventType.COMPLETE);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handle processing block loaded.
***REMOVED*** @private
***REMOVED***
goog.crypt.BlobHasher.prototype.onLoad_ = function() {
  this.logger_.info('Successfully loaded a chunk');

  var array = null;
  if (this.fileReader_.result instanceof Array ||
      goog.isString(this.fileReader_.result)) {
    array = this.fileReader_.result;
  } else if (goog.global['ArrayBuffer'] && goog.global['Uint8Array'] &&
             this.fileReader_.result instanceof ArrayBuffer) {
    array = new Uint8Array(this.fileReader_.result);
  }
  if (!array) {
    this.logger_.severe('Failed reading the chunk');
    this.dispatchEvent(goog.crypt.BlobHasher.EventType.ERROR);
    return;
  }
  this.hashFn_.update(array);
  this.bytesProcessed_ += array.length;
  this.dispatchEvent(goog.crypt.BlobHasher.EventType.PROGRESS);

  this.processNextBlock_();
***REMOVED***
