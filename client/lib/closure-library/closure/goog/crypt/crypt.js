// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Namespace with crypto related helper functions.
***REMOVED***

goog.provide('goog.crypt');

goog.require('goog.array');
goog.require('goog.asserts');


***REMOVED***
***REMOVED*** Turns a string into an array of bytes; a "byte" being a JS number in the
***REMOVED*** range 0-255.
***REMOVED*** @param {string} str String value to arrify.
***REMOVED*** @return {!Array.<number>} Array of numbers corresponding to the
***REMOVED***     UCS character codes of each character in str.
***REMOVED***
goog.crypt.stringToByteArray = function(str) {
  var output = [], p = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    while (c > 0xff) {
      output[p++] = c & 0xff;
      c >>= 8;
    }
    output[p++] = c;
  }
  return output;
***REMOVED***


***REMOVED***
***REMOVED*** Turns an array of numbers into the string given by the concatenation of the
***REMOVED*** characters to which the numbers correspond.
***REMOVED*** @param {Array} bytes Array of numbers representing characters.
***REMOVED*** @return {string} Stringification of the array.
***REMOVED***
goog.crypt.byteArrayToString = function(bytes) {
  var CHUNK_SIZE = 8192;

  // Special-case the simple case for speed's sake.
  if (bytes.length < CHUNK_SIZE) {
    return String.fromCharCode.apply(null, bytes);
  }

  // The remaining logic splits conversion by chunks since
  // Function#apply() has a maximum parameter count.
  // See discussion: http://goo.gl/LrWmZ9

  var str = '';
  for (var i = 0; i < bytes.length; i += CHUNK_SIZE) {
    var chunk = goog.array.slice(bytes, i, i + CHUNK_SIZE);
    str += String.fromCharCode.apply(null, chunk);
  }
  return str;
***REMOVED***


***REMOVED***
***REMOVED*** Turns an array of numbers into the hex string given by the concatenation of
***REMOVED*** the hex values to which the numbers correspond.
***REMOVED*** @param {Uint8Array|Int8Array|Array.<number>} array Array of numbers
***REMOVED***     representing characters.
***REMOVED*** @return {string} Hex string.
***REMOVED***
goog.crypt.byteArrayToHex = function(array) {
  return goog.array.map(array, function(numByte) {
    var hexByte = numByte.toString(16);
    return hexByte.length > 1 ? hexByte : '0' + hexByte;
  }).join('');
***REMOVED***


***REMOVED***
***REMOVED*** Converts a hex string into an integer array.
***REMOVED*** @param {string} hexString Hex string of 16-bit integers (two characters
***REMOVED***     per integer).
***REMOVED*** @return {!Array.<number>} Array of {0,255} integers for the given string.
***REMOVED***
goog.crypt.hexToByteArray = function(hexString) {
  goog.asserts.assert(hexString.length % 2 == 0,
                      'Key string length must be multiple of 2');
  var arr = [];
  for (var i = 0; i < hexString.length; i += 2) {
    arr.push(parseInt(hexString.substring(i, i + 2), 16));
  }
  return arr;
***REMOVED***


***REMOVED***
***REMOVED*** Converts a JS string to a UTF-8 "byte" array.
***REMOVED*** @param {string} str 16-bit unicode string.
***REMOVED*** @return {!Array.<number>} UTF-8 byte array.
***REMOVED***
goog.crypt.stringToUtf8ByteArray = function(str) {
  // TODO(user): Use native implementations if/when available
  str = str.replace(/\r\n/g, '\n');
  var out = [], p = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = (c >> 6) | 192;
      out[p++] = (c & 63) | 128;
    } else {
      out[p++] = (c >> 12) | 224;
      out[p++] = ((c >> 6) & 63) | 128;
      out[p++] = (c & 63) | 128;
    }
  }
  return out;
***REMOVED***


***REMOVED***
***REMOVED*** Converts a UTF-8 byte array to JavaScript's 16-bit Unicode.
***REMOVED*** @param {Uint8Array|Int8Array|Array.<number>} bytes UTF-8 byte array.
***REMOVED*** @return {string} 16-bit Unicode string.
***REMOVED***
goog.crypt.utf8ByteArrayToString = function(bytes) {
  // TODO(user): Use native implementations if/when available
  var out = [], pos = 0, c = 0;
  while (pos < bytes.length) {
    var c1 = bytes[pos++];
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1);
    } else if (c1 > 191 && c1 < 224) {
      var c2 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
    } else {
      var c2 = bytes[pos++];
      var c3 = bytes[pos++];
      out[c++] = String.fromCharCode(
          (c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
    }
  }
  return out.join('');
***REMOVED***


***REMOVED***
***REMOVED*** XOR two byte arrays.
***REMOVED*** @param {!ArrayBufferView|!Array.<number>} bytes1 Byte array 1.
***REMOVED*** @param {!ArrayBufferView|!Array.<number>} bytes2 Byte array 2.
***REMOVED*** @return {!Array.<number>} Resulting XOR of the two byte arrays.
***REMOVED***
goog.crypt.xorByteArray = function(bytes1, bytes2) {
  goog.asserts.assert(
      bytes1.length == bytes2.length,
      'XOR array lengths must match');

  var result = [];
  for (var i = 0; i < bytes1.length; i++) {
    result.push(bytes1[i] ^ bytes2[i]);
  }
  return result;
***REMOVED***
