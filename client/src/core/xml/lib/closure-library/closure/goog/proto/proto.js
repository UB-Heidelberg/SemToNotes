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

goog.provide('goog.proto');


goog.require('goog.proto.Serializer');


***REMOVED***
***REMOVED*** Instance of the serializer object.
***REMOVED*** @type {goog.proto.Serializer}
***REMOVED*** @private
***REMOVED***
goog.proto.serializer_ = null;


***REMOVED***
***REMOVED*** Serializes an object or a value to a protocol buffer string.
***REMOVED*** @param {Object} object The object to serialize.
***REMOVED*** @return {string} The serialized protocol buffer string.
***REMOVED***
goog.proto.serialize = function(object) {
  if (!goog.proto.serializer_) {
    goog.proto.serializer_ = new goog.proto.Serializer;
  }
  return goog.proto.serializer_.serialize(object);
***REMOVED***
