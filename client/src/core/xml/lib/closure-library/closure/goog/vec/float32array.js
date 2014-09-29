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
***REMOVED*** @fileoverview Supplies a Float32Array implementation that implements
***REMOVED***     most of the Float32Array spec and that can be used when a built-in
***REMOVED***     implementation is not available.
***REMOVED***
***REMOVED***     Note that if no existing Float32Array implementation is found then
***REMOVED***     this class and all its public properties are exported as Float32Array.
***REMOVED***
***REMOVED***     Adding support for the other TypedArray classes here does not make sense
***REMOVED***     since this vector math library only needs Float32Array.
***REMOVED***
***REMOVED***
goog.provide('goog.vec.Float32Array');



***REMOVED***
***REMOVED*** Constructs a new Float32Array. The new array is initialized to all zeros.
***REMOVED***
***REMOVED*** @param {goog.vec.Float32Array|Array|ArrayBuffer|number} p0
***REMOVED***     The length of the array, or an array to initialize the contents of the
***REMOVED***     new Float32Array.
***REMOVED***
***REMOVED***
goog.vec.Float32Array = function(p0) {
  this.length = p0.length || p0;
  for (var i = 0; i < this.length; i++) {
    this[i] = p0[i] || 0;
  }
***REMOVED***


***REMOVED***
***REMOVED*** The number of bytes in an element (as defined by the Typed Array
***REMOVED*** specification).
***REMOVED***
***REMOVED*** @type {number}
***REMOVED***
goog.vec.Float32Array.BYTES_PER_ELEMENT = 4;


***REMOVED***
***REMOVED*** The number of bytes in an element (as defined by the Typed Array
***REMOVED*** specification).
***REMOVED***
***REMOVED*** @type {number}
***REMOVED***
goog.vec.Float32Array.prototype.BYTES_PER_ELEMENT = 4;


***REMOVED***
***REMOVED*** Sets elements of the array.
***REMOVED*** @param {Array.<number>|Float32Array} values The array of values.
***REMOVED*** @param {number=} opt_offset The offset in this array to start.
***REMOVED***
goog.vec.Float32Array.prototype.set = function(values, opt_offset) {
  opt_offset = opt_offset || 0;
  for (var i = 0; i < values.length && opt_offset + i < this.length; i++) {
    this[opt_offset + i] = values[i];
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a string representation of this array.
***REMOVED*** @return {string} The string version of this array.
***REMOVED*** @override
***REMOVED***
goog.vec.Float32Array.prototype.toString = Array.prototype.join;


***REMOVED***
***REMOVED*** Note that we cannot implement the subarray() or (deprecated) slice()
***REMOVED*** methods properly since doing so would require being able to overload
***REMOVED*** the [] operator which is not possible in javascript.  So we leave
***REMOVED*** them unimplemented.  Any attempt to call these methods will just result
***REMOVED*** in a javascript error since we leave them undefined.
***REMOVED***


***REMOVED***
***REMOVED*** If no existing Float32Array implementation is found then we export
***REMOVED*** goog.vec.Float32Array as Float32Array.
***REMOVED***
if (typeof Float32Array == 'undefined') {
  goog.exportProperty(goog.vec.Float32Array, 'BYTES_PER_ELEMENT',
                      goog.vec.Float32Array.BYTES_PER_ELEMENT);
  goog.exportProperty(goog.vec.Float32Array.prototype, 'BYTES_PER_ELEMENT',
                      goog.vec.Float32Array.prototype.BYTES_PER_ELEMENT);
  goog.exportProperty(goog.vec.Float32Array.prototype, 'set',
                      goog.vec.Float32Array.prototype.set);
  goog.exportProperty(goog.vec.Float32Array.prototype, 'toString',
                      goog.vec.Float32Array.prototype.toString);
  goog.exportSymbol('Float32Array', goog.vec.Float32Array);
}
