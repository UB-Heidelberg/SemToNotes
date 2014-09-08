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
***REMOVED*** @fileoverview Protocol buffer serializer.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED***


// TODO(arv): Serialize booleans as 0 and 1


goog.provide('goog.proto.Serializer');


goog.require('goog.json.Serializer');
goog.require('goog.string');



***REMOVED***
***REMOVED*** Object that can serialize objects or values to a protocol buffer string.
***REMOVED***
***REMOVED*** @extends {goog.json.Serializer}
***REMOVED*** @final
***REMOVED***
goog.proto.Serializer = function() {
  goog.json.Serializer.call(this);
***REMOVED***
goog.inherits(goog.proto.Serializer, goog.json.Serializer);


***REMOVED***
***REMOVED*** Serializes an array to a protocol buffer string. This overrides the JSON
***REMOVED*** method to output empty slots when the value is null or undefined.
***REMOVED*** @param {Array} arr The array to serialize.
***REMOVED*** @param {Array} sb Array used as a string builder.
***REMOVED*** @override
***REMOVED***
goog.proto.Serializer.prototype.serializeArray = function(arr, sb) {
  var l = arr.length;
  sb.push('[');
  var emptySlots = 0;
  var sep = '';
  for (var i = 0; i < l; i++) {
    if (arr[i] == null) { // catches undefined as well
      emptySlots++;
    } else {
      if (emptySlots > 0) {
        sb.push(goog.string.repeat(',', emptySlots));
        emptySlots = 0;
      }
      sb.push(sep);
      this.serializeInternal(arr[i], sb);
      sep = ',';
    }
  }
  sb.push(']');
***REMOVED***
