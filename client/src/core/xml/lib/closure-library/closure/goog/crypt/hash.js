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
***REMOVED*** @fileoverview Abstract cryptographic hash interface.
***REMOVED***
***REMOVED*** See goog.crypt.Sha1 and goog.crypt.Md5 for sample implementations.
***REMOVED***
***REMOVED***

goog.provide('goog.crypt.Hash');



***REMOVED***
***REMOVED*** Create a cryptographic hash instance.
***REMOVED***
***REMOVED***
***REMOVED***
goog.crypt.Hash = function() {***REMOVED***


***REMOVED***
***REMOVED*** Resets the internal accumulator.
***REMOVED***
goog.crypt.Hash.prototype.reset = goog.abstractMethod;


***REMOVED***
***REMOVED*** Adds a byte array (array with values in [0-255] range) or a string (might
***REMOVED*** only contain 8-bit, i.e., Latin1 characters) to the internal accumulator.
***REMOVED***
***REMOVED*** Many hash functions operate on blocks of data and implement optimizations
***REMOVED*** when a full chunk of data is readily available. Hence it is often preferable
***REMOVED*** to provide large chunks of data (a kilobyte or more) than to repeatedly
***REMOVED*** call the update method with few tens of bytes. If this is not possible, or
***REMOVED*** not feasible, it might be good to provide data in multiplies of hash block
***REMOVED*** size (often 64 bytes). Please see the implementation and performance tests
***REMOVED*** of your favourite hash.
***REMOVED***
***REMOVED*** @param {Array.<number>|Uint8Array|string} bytes Data used for the update.
***REMOVED*** @param {number=} opt_length Number of bytes to use.
***REMOVED***
goog.crypt.Hash.prototype.update = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {!Array.<number>} The finalized hash computed
***REMOVED***     from the internal accumulator.
***REMOVED***
goog.crypt.Hash.prototype.digest = goog.abstractMethod;
