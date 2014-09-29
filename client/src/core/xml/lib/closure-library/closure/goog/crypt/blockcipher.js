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
***REMOVED*** @fileoverview Interface definition of a block cipher. A block cipher is a
***REMOVED*** pair of algorithms that implement encryption and decryption of input bytes.
***REMOVED***
***REMOVED*** @see http://en.wikipedia.org/wiki/Block_cipher
***REMOVED***
***REMOVED*** @author nnaze@google.com (Nathan Naze)
***REMOVED***

goog.provide('goog.crypt.BlockCipher');



***REMOVED***
***REMOVED*** Interface definition for a block cipher.
***REMOVED*** @interface
***REMOVED***
goog.crypt.BlockCipher = function() {***REMOVED***


***REMOVED***
***REMOVED*** Encrypt a plaintext block.  The implementation may expect (and assert)
***REMOVED*** a particular block length.
***REMOVED*** @param {!Array.<number>} input Plaintext array of input bytes.
***REMOVED*** @return {!Array.<number>} Encrypted ciphertext array of bytes.  Should be the
***REMOVED***     same length as input.
***REMOVED***
goog.crypt.BlockCipher.prototype.encrypt;


***REMOVED***
***REMOVED*** Decrypt a plaintext block.  The implementation may expect (and assert)
***REMOVED*** a particular block length.
***REMOVED*** @param {!Array.<number>} input Ciphertext. Array of input bytes.
***REMOVED*** @return {!Array.<number>} Decrypted plaintext array of bytes.  Should be the
***REMOVED***     same length as input.
***REMOVED***
goog.crypt.BlockCipher.prototype.decrypt;
