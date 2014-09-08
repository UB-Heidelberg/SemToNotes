// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utility to attempt native JSON processing, falling back to
***REMOVED***     goog.json if not available.
***REMOVED***
***REMOVED***     This is intended as a drop-in for current users of goog.json who want
***REMOVED***     to take advantage of native JSON if present.
***REMOVED***
***REMOVED*** @author nnaze@google.com (Nathan Naze)
***REMOVED***

goog.provide('goog.json.hybrid');

goog.require('goog.asserts');
goog.require('goog.json');


***REMOVED***
***REMOVED*** Attempts to serialize the JSON string natively, falling back to
***REMOVED*** {@code goog.json.serialize} if unsuccessful.
***REMOVED*** @param {!Object} obj JavaScript object to serialize to JSON.
***REMOVED*** @return {string} Resulting JSON string.
***REMOVED***
goog.json.hybrid.stringify = goog.json.USE_NATIVE_JSON ?
    goog.global['JSON']['stringify'] :
    function(obj) {
      if (goog.global.JSON) {
        try {
          return goog.global.JSON.stringify(obj);
        } catch (e) {
          // Native serialization failed.  Fall through to retry with
          // goog.json.serialize.
        }
      }

      return goog.json.serialize(obj);
   ***REMOVED*****REMOVED***


***REMOVED***
***REMOVED*** Attempts to parse the JSON string natively, falling back to
***REMOVED*** the supplied {@code fallbackParser} if unsuccessful.
***REMOVED*** @param {string} jsonString JSON string to parse.
***REMOVED*** @param {function(string):Object} fallbackParser Fallback JSON parser used
***REMOVED***     if native
***REMOVED*** @return {!Object} Resulting JSON object.
***REMOVED*** @private
***REMOVED***
goog.json.hybrid.parse_ = function(jsonString, fallbackParser) {
  if (goog.global.JSON) {
    try {
      var obj = goog.global.JSON.parse(jsonString);
      goog.asserts.assertObject(obj);
      return obj;
    } catch (e) {
      // Native parse failed.  Fall through to retry with goog.json.unsafeParse.
    }
  }

  var obj = fallbackParser(jsonString);
  goog.asserts.assert(obj);
  return obj;
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to parse the JSON string natively, falling back to
***REMOVED*** {@code goog.json.parse} if unsuccessful.
***REMOVED*** @param {string} jsonString JSON string to parse.
***REMOVED*** @return {!Object} Resulting JSON object.
***REMOVED***
goog.json.hybrid.parse = goog.json.USE_NATIVE_JSON ?
    goog.global['JSON']['parse'] :
    function(jsonString) {
      return goog.json.hybrid.parse_(jsonString, goog.json.parse);
   ***REMOVED*****REMOVED***


***REMOVED***
***REMOVED*** Attempts to parse the JSON string natively, falling back to
***REMOVED*** {@code goog.json.unsafeParse} if unsuccessful.
***REMOVED*** @param {string} jsonString JSON string to parse.
***REMOVED*** @return {!Object} Resulting JSON object.
***REMOVED***
goog.json.hybrid.unsafeParse = goog.json.USE_NATIVE_JSON ?
    goog.global['JSON']['parse'] :
    function(jsonString) {
      return goog.json.hybrid.parse_(jsonString, goog.json.unsafeParse);
   ***REMOVED*****REMOVED***
