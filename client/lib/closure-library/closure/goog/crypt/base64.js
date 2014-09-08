// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Base64 en/decoding. Not much to say here except that we
***REMOVED*** work with decoded values in arrays of bytes. By "byte" I mean a number
***REMOVED*** in [0, 255].
***REMOVED***
***REMOVED*** @author doughtie@google.com (Gavin Doughtie)
***REMOVED*** @author fschneider@google.com (Fritz Schneider)
***REMOVED***

goog.provide('goog.crypt.base64');
goog.require('goog.crypt');
goog.require('goog.userAgent');

// Static lookup maps, lazily populated by init_()


***REMOVED***
***REMOVED*** Maps bytes to characters.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.crypt.base64.byteToCharMap_ = null;


***REMOVED***
***REMOVED*** Maps characters to bytes.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.crypt.base64.charToByteMap_ = null;


***REMOVED***
***REMOVED*** Maps bytes to websafe characters.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.crypt.base64.byteToCharMapWebSafe_ = null;


***REMOVED***
***REMOVED*** Maps websafe characters to bytes.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.crypt.base64.charToByteMapWebSafe_ = null;


***REMOVED***
***REMOVED*** Our default alphabet, shared between
***REMOVED*** ENCODED_VALS and ENCODED_VALS_WEBSAFE
***REMOVED*** @type {string}
***REMOVED***
goog.crypt.base64.ENCODED_VALS_BASE =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz' +
    '0123456789';


***REMOVED***
***REMOVED*** Our default alphabet. Value 64 (=) is special; it means "nothing."
***REMOVED*** @type {string}
***REMOVED***
goog.crypt.base64.ENCODED_VALS =
    goog.crypt.base64.ENCODED_VALS_BASE + '+/=';


***REMOVED***
***REMOVED*** Our websafe alphabet.
***REMOVED*** @type {string}
***REMOVED***
goog.crypt.base64.ENCODED_VALS_WEBSAFE =
    goog.crypt.base64.ENCODED_VALS_BASE + '-_.';


***REMOVED***
***REMOVED*** Whether this browser supports the atob and btoa functions. This extension
***REMOVED*** started at Mozilla but is now implemented by many browsers. We use the
***REMOVED*** ASSUME_* variables to avoid pulling in the full useragent detection library
***REMOVED*** but still allowing the standard per-browser compilations.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED***
goog.crypt.base64.HAS_NATIVE_SUPPORT = goog.userAgent.GECKO ||
                                       goog.userAgent.WEBKIT ||
                                       goog.userAgent.OPERA ||
                                       typeof(goog.global.atob) == 'function';


***REMOVED***
***REMOVED*** Base64-encode an array of bytes.
***REMOVED***
***REMOVED*** @param {Array.<number>|Uint8Array} input An array of bytes (numbers with
***REMOVED***     value in [0, 255]) to encode.
***REMOVED*** @param {boolean=} opt_webSafe Boolean indicating we should use the
***REMOVED***     alternative alphabet.
***REMOVED*** @return {string} The base64 encoded string.
***REMOVED***
goog.crypt.base64.encodeByteArray = function(input, opt_webSafe) {
  if (!goog.isArrayLike(input)) {
    throw Error('encodeByteArray takes an array as a parameter');
  }

  goog.crypt.base64.init_();

  var byteToCharMap = opt_webSafe ?
                      goog.crypt.base64.byteToCharMapWebSafe_ :
                      goog.crypt.base64.byteToCharMap_;

  var output = [];

  for (var i = 0; i < input.length; i += 3) {
    var byte1 = input[i];
    var haveByte2 = i + 1 < input.length;
    var byte2 = haveByte2 ? input[i + 1] : 0;
    var haveByte3 = i + 2 < input.length;
    var byte3 = haveByte3 ? input[i + 2] : 0;

    var outByte1 = byte1 >> 2;
    var outByte2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
    var outByte3 = ((byte2 & 0x0F) << 2) | (byte3 >> 6);
    var outByte4 = byte3 & 0x3F;

    if (!haveByte3) {
      outByte4 = 64;

      if (!haveByte2) {
        outByte3 = 64;
      }
    }

    output.push(byteToCharMap[outByte1],
                byteToCharMap[outByte2],
                byteToCharMap[outByte3],
                byteToCharMap[outByte4]);
  }

  return output.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Base64-encode a string.
***REMOVED***
***REMOVED*** @param {string} input A string to encode.
***REMOVED*** @param {boolean=} opt_webSafe If true, we should use the
***REMOVED***     alternative alphabet.
***REMOVED*** @return {string} The base64 encoded string.
***REMOVED***
goog.crypt.base64.encodeString = function(input, opt_webSafe) {
  // Shortcut for Mozilla browsers that implement
  // a native base64 encoder in the form of "btoa/atob"
  if (goog.crypt.base64.HAS_NATIVE_SUPPORT && !opt_webSafe) {
    return goog.global.btoa(input);
  }
  return goog.crypt.base64.encodeByteArray(
      goog.crypt.stringToByteArray(input), opt_webSafe);
***REMOVED***


***REMOVED***
***REMOVED*** Base64-decode a string.
***REMOVED***
***REMOVED*** @param {string} input to decode.
***REMOVED*** @param {boolean=} opt_webSafe True if we should use the
***REMOVED***     alternative alphabet.
***REMOVED*** @return {string} string representing the decoded value.
***REMOVED***
goog.crypt.base64.decodeString = function(input, opt_webSafe) {
  // Shortcut for Mozilla browsers that implement
  // a native base64 encoder in the form of "btoa/atob"
  if (goog.crypt.base64.HAS_NATIVE_SUPPORT && !opt_webSafe) {
    return goog.global.atob(input);
  }
  return goog.crypt.byteArrayToString(
      goog.crypt.base64.decodeStringToByteArray(input, opt_webSafe));
***REMOVED***


***REMOVED***
***REMOVED*** Base64-decode a string.
***REMOVED***
***REMOVED*** In base-64 decoding, groups of four characters are converted into three
***REMOVED*** bytes.  If the encoder did not apply padding, the input length may not
***REMOVED*** be a multiple of 4.
***REMOVED***
***REMOVED*** In this case, the last group will have fewer than 4 characters, and
***REMOVED*** padding will be inferred.  If the group has one or two characters, it decodes
***REMOVED*** to one byte.  If the group has three characters, it decodes to two bytes.
***REMOVED***
***REMOVED*** @param {string} input Input to decode.
***REMOVED*** @param {boolean=} opt_webSafe True if we should use the web-safe alphabet.
***REMOVED*** @return {!Array} bytes representing the decoded value.
***REMOVED***
goog.crypt.base64.decodeStringToByteArray = function(input, opt_webSafe) {
  goog.crypt.base64.init_();

  var charToByteMap = opt_webSafe ?
                      goog.crypt.base64.charToByteMapWebSafe_ :
                      goog.crypt.base64.charToByteMap_;

  var output = [];

  for (var i = 0; i < input.length; ) {
    var byte1 = charToByteMap[input.charAt(i++)];

    var haveByte2 = i < input.length;
    var byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
    ++i;

    var haveByte3 = i < input.length;
    var byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
    ++i;

    var haveByte4 = i < input.length;
    var byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
    ++i;

    if (byte1 == null || byte2 == null ||
        byte3 == null || byte4 == null) {
      throw Error();
    }

    var outByte1 = (byte1 << 2) | (byte2 >> 4);
    output.push(outByte1);

    if (byte3 != 64) {
      var outByte2 = ((byte2 << 4) & 0xF0) | (byte3 >> 2);
      output.push(outByte2);

      if (byte4 != 64) {
        var outByte3 = ((byte3 << 6) & 0xC0) | byte4;
        output.push(outByte3);
      }
    }
  }

  return output;
***REMOVED***


***REMOVED***
***REMOVED*** Lazy static initialization function. Called before
***REMOVED*** accessing any of the static map variables.
***REMOVED*** @private
***REMOVED***
goog.crypt.base64.init_ = function() {
  if (!goog.crypt.base64.byteToCharMap_) {
    goog.crypt.base64.byteToCharMap_ = {***REMOVED***
    goog.crypt.base64.charToByteMap_ = {***REMOVED***
    goog.crypt.base64.byteToCharMapWebSafe_ = {***REMOVED***
    goog.crypt.base64.charToByteMapWebSafe_ = {***REMOVED***

    // We want quick mappings back and forth, so we precompute two maps.
    for (var i = 0; i < goog.crypt.base64.ENCODED_VALS.length; i++) {
      goog.crypt.base64.byteToCharMap_[i] =
          goog.crypt.base64.ENCODED_VALS.charAt(i);
      goog.crypt.base64.charToByteMap_[goog.crypt.base64.byteToCharMap_[i]] = i;
      goog.crypt.base64.byteToCharMapWebSafe_[i] =
          goog.crypt.base64.ENCODED_VALS_WEBSAFE.charAt(i);
      goog.crypt.base64.charToByteMapWebSafe_[
          goog.crypt.base64.byteToCharMapWebSafe_[i]] = i;
    }
  }
***REMOVED***
