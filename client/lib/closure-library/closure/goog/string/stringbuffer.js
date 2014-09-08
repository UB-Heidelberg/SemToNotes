// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utility for fast string concatenation.
***REMOVED***

goog.provide('goog.string.StringBuffer');



***REMOVED***
***REMOVED*** Utility class to facilitate string concatenation.
***REMOVED***
***REMOVED*** @param {*=} opt_a1 Optional first initial item to append.
***REMOVED*** @param {...*} var_args Other initial items to
***REMOVED***     append, e.g., new goog.string.StringBuffer('foo', 'bar').
***REMOVED***
***REMOVED***
goog.string.StringBuffer = function(opt_a1, var_args) {
  if (opt_a1 != null) {
    this.append.apply(this, arguments);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Internal buffer for the string to be concatenated.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.string.StringBuffer.prototype.buffer_ = '';


***REMOVED***
***REMOVED*** Sets the contents of the string buffer object, replacing what's currently
***REMOVED*** there.
***REMOVED***
***REMOVED*** @param {*} s String to set.
***REMOVED***
goog.string.StringBuffer.prototype.set = function(s) {
  this.buffer_ = '' + s;
***REMOVED***


***REMOVED***
***REMOVED*** Appends one or more items to the buffer.
***REMOVED***
***REMOVED*** Calling this with null, undefined, or empty arguments is an error.
***REMOVED***
***REMOVED*** @param {*} a1 Required first string.
***REMOVED*** @param {*=} opt_a2 Optional second string.
***REMOVED*** @param {...*} var_args Other items to append,
***REMOVED***     e.g., sb.append('foo', 'bar', 'baz').
***REMOVED*** @return {!goog.string.StringBuffer} This same StringBuffer object.
***REMOVED*** @suppress {duplicate}
***REMOVED***
goog.string.StringBuffer.prototype.append = function(a1, opt_a2, var_args) {
  // Use a1 directly to avoid arguments instantiation for single-arg case.
  this.buffer_ += a1;
  if (opt_a2 != null) { // second argument is undefined (null == undefined)
    for (var i = 1; i < arguments.length; i++) {
      this.buffer_ += arguments[i];
    }
  }
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Clears the internal buffer.
***REMOVED***
goog.string.StringBuffer.prototype.clear = function() {
  this.buffer_ = '';
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} the length of the current contents of the buffer.
***REMOVED***
goog.string.StringBuffer.prototype.getLength = function() {
  return this.buffer_.length;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The concatenated string.
***REMOVED*** @override
***REMOVED***
goog.string.StringBuffer.prototype.toString = function() {
  return this.buffer_;
***REMOVED***
