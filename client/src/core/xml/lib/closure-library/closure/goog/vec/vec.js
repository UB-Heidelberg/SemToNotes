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
***REMOVED*** @fileoverview Supplies global data types and constants for the vector math
***REMOVED***     library.
***REMOVED***
goog.provide('goog.vec');

***REMOVED***
***REMOVED*** On platforms that don't have native Float32Array or Float64Array support we
***REMOVED*** use a javascript implementation so that this math library can be used on all
***REMOVED*** platforms.
***REMOVED***
goog.require('goog.vec.Float32Array');
goog.require('goog.vec.Float64Array');

// All vector and matrix operations are based upon arrays of numbers using
// either Float32Array, Float64Array, or a standard Javascript Array of
// Numbers.


***REMOVED*** @typedef {Float32Array}***REMOVED***
goog.vec.Float32;


***REMOVED*** @typedef {Float64Array}***REMOVED***
goog.vec.Float64;


***REMOVED*** @typedef {Array.<number>}***REMOVED***
goog.vec.Number;


***REMOVED*** @typedef {goog.vec.Float32|goog.vec.Float64|goog.vec.Number}***REMOVED***
goog.vec.AnyType;


***REMOVED***
***REMOVED*** @deprecated Use AnyType.
***REMOVED*** @typedef {Float32Array|Array.<number>}
***REMOVED***
goog.vec.ArrayType;


***REMOVED***
***REMOVED*** For graphics work, 6 decimal places of accuracy are typically all that is
***REMOVED*** required.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @const
***REMOVED***
goog.vec.EPSILON = 1e-6;
