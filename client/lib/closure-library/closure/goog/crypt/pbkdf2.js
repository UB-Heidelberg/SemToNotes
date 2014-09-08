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
***REMOVED*** @fileoverview Implementation of PBKDF2 in JavaScript.
***REMOVED*** @see http://en.wikipedia.org/wiki/PBKDF2
***REMOVED***
***REMOVED*** Currently we only support HMAC-SHA1 as the underlying hash function. To add a
***REMOVED*** new hash function, add a static method similar to deriveKeyFromPasswordSha1()
***REMOVED*** and implement the specific computeBlockCallback() using the hash function.
***REMOVED***
***REMOVED*** Usage:
***REMOVED***   var key = pbkdf2.deriveKeySha1(
***REMOVED***       stringToByteArray('password'), stringToByteArray('salt'), 1000, 128);
***REMOVED***
***REMOVED***

goog.provide('goog.crypt.pbkdf2');

goog.require('goog.asserts');
goog.require('goog.crypt');
goog.require('goog.crypt.Hmac');
goog.require('goog.crypt.Sha1');


***REMOVED***
***REMOVED*** Derives key from password using PBKDF2-SHA1
***REMOVED*** @param {!Array.<number>} password Byte array representation of the password
***REMOVED***     from which the key is derived.
***REMOVED*** @param {!Array.<number>} initialSalt Byte array representation of the salt.
***REMOVED*** @param {number} iterations Number of interations when computing the key.
***REMOVED*** @param {number} keyLength Length of the output key in bits.
***REMOVED***     Must be multiple of 8.
***REMOVED*** @return {!Array.<number>} Byte array representation of the output key.
***REMOVED***
goog.crypt.pbkdf2.deriveKeySha1 = function(
    password, initialSalt, iterations, keyLength) {
  // Length of the HMAC-SHA1 output in bits.
  var HASH_LENGTH = 160;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Compute each block of the key using HMAC-SHA1.
  ***REMOVED*** @param {!Array.<number>} index Byte array representation of the index of
  ***REMOVED***     the block to be computed.
  ***REMOVED*** @return {!Array.<number>} Byte array representation of the output block.
 ***REMOVED*****REMOVED***
  var computeBlock = function(index) {
    // Initialize the result to be array of 0 such that its xor with the first
    // block would be the first block.
    var result = goog.array.repeat(0, HASH_LENGTH / 8);
    // Initialize the salt of the first iteration to initialSalt || i.
    var salt = initialSalt.concat(index);
    var hmac = new goog.crypt.Hmac(new goog.crypt.Sha1(), password, 64);
    // Compute and XOR each iteration.
    for (var i = 0; i < iterations; i++) {
      // The salt of the next iteration is the result of the current iteration.
      salt = hmac.getHmac(salt);
      result = goog.crypt.xorByteArray(result, salt);
    }
    return result;
 ***REMOVED*****REMOVED***

  return goog.crypt.pbkdf2.deriveKeyFromPassword_(
      computeBlock, HASH_LENGTH, keyLength);
***REMOVED***


***REMOVED***
***REMOVED*** Compute each block of the key using PBKDF2.
***REMOVED*** @param {Function} computeBlock Function to compute each block of the output
***REMOVED***     key.
***REMOVED*** @param {number} hashLength Length of each block in bits. This is determined
***REMOVED***     by the specific hash function used. Must be multiple of 8.
***REMOVED*** @param {number} keyLength Length of the output key in bits.
***REMOVED***     Must be multiple of 8.
***REMOVED*** @return {!Array.<number>} Byte array representation of the output key.
***REMOVED*** @private
***REMOVED***
goog.crypt.pbkdf2.deriveKeyFromPassword_ =
    function(computeBlock, hashLength, keyLength) {
  goog.asserts.assert(keyLength % 8 == 0, 'invalid output key length');

  // Compute and concactate each block of the output key.
  var numBlocks = Math.ceil(keyLength / hashLength);
  goog.asserts.assert(numBlocks >= 1, 'invalid number of blocks');
  var result = [];
  for (var i = 1; i <= numBlocks; i++) {
    var indexBytes = goog.crypt.pbkdf2.integerToByteArray_(i);
    result = result.concat(computeBlock(indexBytes));
  }

  // Trim the last block if needed.
  var lastBlockSize = keyLength % hashLength;
  if (lastBlockSize != 0) {
    var desiredBytes = ((numBlocks - 1)***REMOVED*** hashLength + lastBlockSize) / 8;
    result.splice(desiredBytes, (hashLength - lastBlockSize) / 8);
  }
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Converts an integer number to a 32-bit big endian byte array.
***REMOVED*** @param {number} n Integer number to be converted.
***REMOVED*** @return {!Array.<number>} Byte Array representation of the 32-bit big endian
***REMOVED***     encoding of n.
***REMOVED*** @private
***REMOVED***
goog.crypt.pbkdf2.integerToByteArray_ = function(n) {
  var result = new Array(4);
  result[0] = n >> 24 & 0xFF;
  result[1] = n >> 16 & 0xFF;
  result[2] = n >> 8 & 0xFF;
  result[3] = n & 0xFF;
  return result;
***REMOVED***
