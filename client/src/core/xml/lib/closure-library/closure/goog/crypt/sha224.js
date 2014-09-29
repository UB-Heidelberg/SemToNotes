// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview SHA-224 cryptographic hash.
***REMOVED***
***REMOVED*** Usage:
***REMOVED***   var sha224 = new goog.crypt.Sha224();
***REMOVED***   sha224.update(bytes);
***REMOVED***   var hash = sha224.digest();
***REMOVED***
***REMOVED***

goog.provide('goog.crypt.Sha224');

goog.require('goog.crypt.Sha2');



***REMOVED***
***REMOVED*** SHA-224 cryptographic hash constructor.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.crypt.Sha2}
***REMOVED***
goog.crypt.Sha224 = function() {
  goog.base(this);
***REMOVED***
goog.inherits(goog.crypt.Sha224, goog.crypt.Sha2);


***REMOVED*** @override***REMOVED***
goog.crypt.Sha224.prototype.reset = function() {
  this.chunk = [];
  this.inChunk = 0;
  this.total = 0;

  this.hash = [
      0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
      0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4];
  this.numHashBlocks = 7;
***REMOVED***
