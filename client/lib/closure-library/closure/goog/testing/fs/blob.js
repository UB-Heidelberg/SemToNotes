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
***REMOVED*** @fileoverview Mock blob object.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.fs.Blob');

goog.require('goog.crypt.base64');



***REMOVED***
***REMOVED*** A mock Blob object. The data is stored as a string.
***REMOVED***
***REMOVED*** @param {string=} opt_data The string data encapsulated by the blob.
***REMOVED*** @param {string=} opt_type The mime type of the blob.
***REMOVED***
***REMOVED***
goog.testing.fs.Blob = function(opt_data, opt_type) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @see http://www.w3.org/TR/FileAPI/#dfn-type
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.type = opt_type || '';

  this.setDataInternal(opt_data || '');
***REMOVED***


***REMOVED***
***REMOVED*** The string data encapsulated by the blob.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.fs.Blob.prototype.data_;


***REMOVED***
***REMOVED*** @see http://www.w3.org/TR/FileAPI/#dfn-size
***REMOVED*** @type {number}
***REMOVED***
goog.testing.fs.Blob.prototype.size;


***REMOVED***
***REMOVED*** Creates a blob with bytes of a blob ranging from the optional start
***REMOVED*** parameter up to but not including the optional end parameter, and with a type
***REMOVED*** attribute that is the value of the optional contentType parameter.
***REMOVED*** @see http://www.w3.org/TR/FileAPI/#dfn-slice
***REMOVED*** @param {number=} opt_start The start byte offset.
***REMOVED*** @param {number=} opt_end The end point of a slice.
***REMOVED*** @param {string=} opt_contentType The type of the resulting Blob.
***REMOVED*** @return {!goog.testing.fs.Blob} The result blob of the slice operation.
***REMOVED***
goog.testing.fs.Blob.prototype.slice = function(
    opt_start, opt_end, opt_contentType) {
  var relativeStart;
  if (goog.isNumber(opt_start)) {
    relativeStart = (opt_start < 0) ?
        Math.max(this.data_.length + opt_start, 0) :
        Math.min(opt_start, this.data_.length);
  } else {
    relativeStart = 0;
  }
  var relativeEnd;
  if (goog.isNumber(opt_end)) {
    relativeEnd = (opt_end < 0) ?
        Math.max(this.data_.length + opt_end, 0) :
        Math.min(opt_end, this.data_.length);
  } else {
    relativeEnd = this.data_.length;
  }
  var span = Math.max(relativeEnd - relativeStart, 0);
  return new goog.testing.fs.Blob(
      this.data_.substr(relativeStart, span),
      opt_contentType);
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The string data encapsulated by the blob.
***REMOVED*** @override
***REMOVED***
goog.testing.fs.Blob.prototype.toString = function() {
  return this.data_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!ArrayBuffer} The string data encapsulated by the blob as an
***REMOVED***     ArrayBuffer.
***REMOVED***
goog.testing.fs.Blob.prototype.toArrayBuffer = function() {
  var buf = new ArrayBuffer(this.data_.length***REMOVED*** 2);
  var arr = new Uint16Array(buf);
  for (var i = 0; i < this.data_.length; i++) {
    arr[i] = this.data_.charCodeAt(i);
  }
  return buf;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The string data encapsulated by the blob as a data: URI.
***REMOVED***
goog.testing.fs.Blob.prototype.toDataUrl = function() {
  return 'data:' + this.type + ';base64,' +
      goog.crypt.base64.encodeString(this.data_);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the internal contents of the blob. This should only be called by other
***REMOVED*** functions inside the {@code goog.testing.fs} namespace.
***REMOVED***
***REMOVED*** @param {string} data The data for this Blob.
***REMOVED***
goog.testing.fs.Blob.prototype.setDataInternal = function(data) {
  this.data_ = data;
  this.size = data.length;
***REMOVED***
