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
goog.require('goog.events.EventTarget');
goog.require('goog.fs');
goog.require('goog.log');



***REMOVED***
***REMOVED*** Construct the hash computer.
***REMOVED***
***REMOVED*** @param {!goog.crypt.Hash} hashFn The hash function to use.
***REMOVED*** @param {number=} opt_blockSize Processing block size.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED*** @final
***REMOVED***
goog.crypt.BlobHasher = function(hashFn, opt_blockSize) {
  goog.crypt.BlobHasher.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The actual hash function.
  ***REMOVED*** @type {!goog.crypt.Hash}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.hashFn_ = hashFn;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The blob being processed or null if no blob is being processed.
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
  ***REMOVED*** The number of bytes to hash or Infinity for no limit.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.hashingLimit_ = Infinity;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Processing block size.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.blockSize_ = opt_blockSize || 5000000;

 ***REMOVED*****REMOVED***
  ***REMOVED*** File reader object. Will be null if no chunk is currently being read.
  ***REMOVED*** @type {FileReader}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.fileReader_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The logger used by this object.
  ***REMOVED*** @type {goog.log.Logger}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.logger_ = goog.log.getLogger('goog.crypt.BlobHasher');
***REMOVED***
goog.inherits(goog.crypt.BlobHasher, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Event names for hash computation events
***REMOVED*** @enum {string}
***REMOVED***
goog.crypt.BlobHasher.EventType = {
  STARTED: 'started',
  PROGRESS: 'progress',
  THROTTLED: 'throttled',
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
***REMOVED*** Sets the maximum number of bytes to hash or Infinity for no limit. Can be
***REMOVED*** called before hash() to throttle the hash computation. The hash computation
***REMOVED*** can then be continued by repeatedly calling setHashingLimit() with greater
***REMOVED*** byte offsets. This is useful if you don't need the hash until some time in
***REMOVED*** the future, for example when uploading a file and you don't need the hash
***REMOVED*** until the transfer is complete.
***REMOVED*** @param {number} byteOffset The byte offset to compute the hash up to.
***REMOVED***     Should be a non-negative integer or Infinity for no limit. Negative
***REMOVED***     values are not allowed.
***REMOVED***
goog.crypt.BlobHasher.prototype.setHashingLimit = function(byteOffset) {
  goog.asserts.assert(byteOffset >= 0, 'Hashing limit must be non-negative.');
  this.hashingLimit_ = byteOffset;

  // Resume processing if a blob is currently being hashed, but no block read
  // is currently in progress.
  if (this.blob_ && !this.fileReader_) {
    this.processNextBlock_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Abort hash computation.
***REMOVED***
goog.crypt.BlobHasher.prototype.abort = function() {
  if (this.fileReader_) {
    this.fileReader_.abort();
    this.fileReader_ = null;
  }

  if (this.blob_) {
    this.blob_ = null;
    this.dispatchEvent(goog.crypt.BlobHasher.EventType.ABORT);
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
  goog.asserts.assert(this.blob_, 'A hash computation must be in progress.');

  if (this.bytesProcessed_ < this.blob_.size) {

    if (this.hashingLimit_ <= this.bytesProcessed_) {
      // Throttle limit reached. Wait until we are allowed to hash more bytes.
      this.dispatchEvent(goog.crypt.BlobHasher.EventType.THROTTLED);
      return;
    }

    // We have to reset the FileReader every time, otherwise it fails on
    // Chrome, including the latest Chrome 12 beta.
    // http://code.google.com/p/chromium/issues/detail?id=82346
    this.fileReader_ = new FileReader();
    this.fileReader_.onload = goog.bind(this.onLoad_, this);
    this.fileReader_.onerror = goog.bind(this.onError_, this);

    var endOffset = Math.min(this.hashingLimit_, this.blob_.size);
    var size = Math.min(endOffset - this.bytesProcessed_, this.blockSize_);
    var chunk = goog.fs.sliceBlob(this.blob_, this.bytesProcessed_,
                                  this.bytesProcessed_ + size);
    if (!chunk || chunk.size != size) {
      goog.log.error(this.logger_, 'Failed slicing the blob');
      this.onError_();
      return;
    }

    if (this.fileReader_.readAsArrayBuffer) {
      this.fileReader_.readAsArrayBuffer(chunk);
    } else if (this.fileReader_.readAsBinaryString) {
      this.fileReader_.readAsBinaryString(chunk);
    } else {
      goog.log.error(this.logger_, 'Failed calling the chunk reader');
      this.onError_();
    }
  } else {
    this.hashVal_ = this.hashFn_.digest();
    this.blob_ = null;
    this.dispatchEvent(goog.crypt.BlobHasher.EventType.COMPLETE);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handle processing block loaded.
***REMOVED*** @private
***REMOVED***
goog.crypt.BlobHasher.prototype.onLoad_ = function() {
  goog.log.info(this.logger_, 'Successfully loaded a chunk');

  var array = null;
  if (this.fileReader_.result instanceof Array ||
      goog.isString(this.fileReader_.result)) {
    array = this.fileReader_.result;
  } else if (goog.global['ArrayBuffer'] && goog.global['Uint8Array'] &&
             this.fileReader_.result instanceof ArrayBuffer) {
    array = new Uint8Array(this.fileReader_.result);
  }
  if (!array) {
    goog.log.error(this.logger_, 'Failed reading the chunk');
    this.onError_();
    return;
  }

  this.hashFn_.update(array);
  this.bytesProcessed_ += array.length;
  this.fileReader_ = null;
  this.dispatchEvent(goog.crypt.BlobHasher.EventType.PROGRESS);

  this.processNextBlock_();
***REMOVED***


***REMOVED***
***REMOVED*** Handles error.
***REMOVED*** @private
***REMOVED***
goog.crypt.BlobHasher.prototype.onError_ = function() {
  this.fileReader_ = null;
  this.blob_ = null;
  this.dispatchEvent(goog.crypt.BlobHasher.EventType.ERROR);
***REMOVED***
