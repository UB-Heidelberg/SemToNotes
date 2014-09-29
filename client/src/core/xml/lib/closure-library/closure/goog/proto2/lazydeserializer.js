// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Base class for all PB2 lazy deserializer. A lazy deserializer
***REMOVED***   is a serializer whose deserialization occurs on the fly as data is
***REMOVED***   requested. In order to use a lazy deserializer, the serialized form
***REMOVED***   of the data must be an object or array that can be indexed by the tag
***REMOVED***   number.
***REMOVED***
***REMOVED***

goog.provide('goog.proto2.LazyDeserializer');

goog.require('goog.proto2.Serializer');
goog.require('goog.proto2.Util');



***REMOVED***
***REMOVED*** Base class for all lazy deserializers.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.proto2.Serializer}
***REMOVED***
goog.proto2.LazyDeserializer = function() {***REMOVED***
goog.inherits(goog.proto2.LazyDeserializer, goog.proto2.Serializer);


***REMOVED*** @override***REMOVED***
goog.proto2.LazyDeserializer.prototype.deserialize =
  function(descriptor, data) {
  var message = descriptor.createMessageInstance();
  message.initializeForLazyDeserializer(this, data);
  goog.proto2.Util.assert(message instanceof goog.proto2.Message);
  return message;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.proto2.LazyDeserializer.prototype.deserializeTo = function(message, data) {
  throw new Error('Unimplemented');
***REMOVED***


***REMOVED***
***REMOVED*** Deserializes a message field from the expected format and places the
***REMOVED*** data in the given message
***REMOVED***
***REMOVED*** @param {goog.proto2.Message} message The message in which to
***REMOVED***     place the information.
***REMOVED*** @param {goog.proto2.FieldDescriptor} field The field for which to set the
***REMOVED***     message value.
***REMOVED*** @param {*} data The serialized data for the field.
***REMOVED***
***REMOVED*** @return {*} The deserialized data or null for no value found.
***REMOVED***
goog.proto2.LazyDeserializer.prototype.deserializeField = goog.abstractMethod;
