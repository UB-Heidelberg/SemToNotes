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
// All other code copyright its respective owners(s).

***REMOVED***
***REMOVED*** @fileoverview Generated Protocol Buffer code for file
***REMOVED*** closure/goog/proto2/test.proto.
***REMOVED***

goog.provide('proto2.TestAllTypes');
goog.provide('proto2.TestAllTypes.NestedMessage');
goog.provide('proto2.TestAllTypes.OptionalGroup');
goog.provide('proto2.TestAllTypes.RepeatedGroup');
goog.provide('proto2.TestAllTypes.NestedEnum');

goog.require('goog.proto2.Message');



***REMOVED***
***REMOVED*** Message TestAllTypes.
***REMOVED***
***REMOVED*** @extends {goog.proto2.Message}
***REMOVED***
proto2.TestAllTypes = function() {
  goog.proto2.Message.apply(this);
***REMOVED***
goog.inherits(proto2.TestAllTypes, goog.proto2.Message);


***REMOVED***
***REMOVED*** Overrides {@link goog.proto2.Message#clone} to specify its exact return type.
***REMOVED*** @return {!proto2.TestAllTypes} The cloned message.
***REMOVED*** @override
***REMOVED***
proto2.TestAllTypes.prototype.clone;


***REMOVED***
***REMOVED*** Gets the value of the optional_int32 field.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalInt32 = function() {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(1));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_int32 field or the default value if not set.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalInt32OrDefault = function() {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(1));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_int32 field.
***REMOVED*** @param {number} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalInt32 = function(value) {
  this.set$Value(1, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_int32 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalInt32 = function() {
  return this.has$Value(1);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_int32 field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalInt32Count = function() {
  return this.count$Values(1);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_int32 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalInt32 = function() {
  this.clear$Field(1);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_int64 field.
***REMOVED*** @return {?string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalInt64 = function() {
  return***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.get$Value(2));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_int64 field or the default value if not set.
***REMOVED*** @return {string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalInt64OrDefault = function() {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.get$ValueOrDefault(2));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_int64 field.
***REMOVED*** @param {string} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalInt64 = function(value) {
  this.set$Value(2, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_int64 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalInt64 = function() {
  return this.has$Value(2);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_int64 field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalInt64Count = function() {
  return this.count$Values(2);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_int64 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalInt64 = function() {
  this.clear$Field(2);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_uint32 field.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalUint32 = function() {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(3));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_uint32 field or the default value if not set.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalUint32OrDefault = function() {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(3));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_uint32 field.
***REMOVED*** @param {number} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalUint32 = function(value) {
  this.set$Value(3, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_uint32 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalUint32 = function() {
  return this.has$Value(3);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_uint32 field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalUint32Count = function() {
  return this.count$Values(3);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_uint32 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalUint32 = function() {
  this.clear$Field(3);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_uint64 field.
***REMOVED*** @return {?string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalUint64 = function() {
  return***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.get$Value(4));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_uint64 field or the default value if not set.
***REMOVED*** @return {string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalUint64OrDefault = function() {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.get$ValueOrDefault(4));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_uint64 field.
***REMOVED*** @param {string} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalUint64 = function(value) {
  this.set$Value(4, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_uint64 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalUint64 = function() {
  return this.has$Value(4);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_uint64 field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalUint64Count = function() {
  return this.count$Values(4);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_uint64 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalUint64 = function() {
  this.clear$Field(4);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_sint32 field.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalSint32 = function() {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(5));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_sint32 field or the default value if not set.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalSint32OrDefault = function() {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(5));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_sint32 field.
***REMOVED*** @param {number} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalSint32 = function(value) {
  this.set$Value(5, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_sint32 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalSint32 = function() {
  return this.has$Value(5);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_sint32 field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalSint32Count = function() {
  return this.count$Values(5);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_sint32 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalSint32 = function() {
  this.clear$Field(5);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_sint64 field.
***REMOVED*** @return {?string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalSint64 = function() {
  return***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.get$Value(6));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_sint64 field or the default value if not set.
***REMOVED*** @return {string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalSint64OrDefault = function() {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.get$ValueOrDefault(6));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_sint64 field.
***REMOVED*** @param {string} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalSint64 = function(value) {
  this.set$Value(6, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_sint64 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalSint64 = function() {
  return this.has$Value(6);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_sint64 field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalSint64Count = function() {
  return this.count$Values(6);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_sint64 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalSint64 = function() {
  this.clear$Field(6);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_fixed32 field.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalFixed32 = function() {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(7));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_fixed32 field or the default value if not set.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalFixed32OrDefault = function() {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(7));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_fixed32 field.
***REMOVED*** @param {number} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalFixed32 = function(value) {
  this.set$Value(7, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_fixed32 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalFixed32 = function() {
  return this.has$Value(7);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_fixed32 field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalFixed32Count = function() {
  return this.count$Values(7);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_fixed32 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalFixed32 = function() {
  this.clear$Field(7);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_fixed64 field.
***REMOVED*** @return {?string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalFixed64 = function() {
  return***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.get$Value(8));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_fixed64 field or the default value if not set.
***REMOVED*** @return {string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalFixed64OrDefault = function() {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.get$ValueOrDefault(8));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_fixed64 field.
***REMOVED*** @param {string} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalFixed64 = function(value) {
  this.set$Value(8, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_fixed64 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalFixed64 = function() {
  return this.has$Value(8);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_fixed64 field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalFixed64Count = function() {
  return this.count$Values(8);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_fixed64 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalFixed64 = function() {
  this.clear$Field(8);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_sfixed32 field.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalSfixed32 = function() {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(9));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_sfixed32 field or the default value if not set.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalSfixed32OrDefault = function() {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(9));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_sfixed32 field.
***REMOVED*** @param {number} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalSfixed32 = function(value) {
  this.set$Value(9, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_sfixed32 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalSfixed32 = function() {
  return this.has$Value(9);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_sfixed32 field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalSfixed32Count = function() {
  return this.count$Values(9);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_sfixed32 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalSfixed32 = function() {
  this.clear$Field(9);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_sfixed64 field.
***REMOVED*** @return {?string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalSfixed64 = function() {
  return***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.get$Value(10));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_sfixed64 field or the default value if not set.
***REMOVED*** @return {string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalSfixed64OrDefault = function() {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.get$ValueOrDefault(10));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_sfixed64 field.
***REMOVED*** @param {string} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalSfixed64 = function(value) {
  this.set$Value(10, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_sfixed64 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalSfixed64 = function() {
  return this.has$Value(10);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_sfixed64 field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalSfixed64Count = function() {
  return this.count$Values(10);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_sfixed64 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalSfixed64 = function() {
  this.clear$Field(10);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_float field.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalFloat = function() {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(11));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_float field or the default value if not set.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalFloatOrDefault = function() {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(11));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_float field.
***REMOVED*** @param {number} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalFloat = function(value) {
  this.set$Value(11, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_float field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalFloat = function() {
  return this.has$Value(11);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_float field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalFloatCount = function() {
  return this.count$Values(11);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_float field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalFloat = function() {
  this.clear$Field(11);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_double field.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalDouble = function() {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(12));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_double field or the default value if not set.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalDoubleOrDefault = function() {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(12));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_double field.
***REMOVED*** @param {number} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalDouble = function(value) {
  this.set$Value(12, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_double field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalDouble = function() {
  return this.has$Value(12);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_double field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalDoubleCount = function() {
  return this.count$Values(12);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_double field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalDouble = function() {
  this.clear$Field(12);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_bool field.
***REMOVED*** @return {?boolean} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalBool = function() {
  return***REMOVED*****REMOVED*** @type {?boolean}***REMOVED*** (this.get$Value(13));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_bool field or the default value if not set.
***REMOVED*** @return {boolean} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalBoolOrDefault = function() {
  return***REMOVED*****REMOVED*** @type {boolean}***REMOVED*** (this.get$ValueOrDefault(13));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_bool field.
***REMOVED*** @param {boolean} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalBool = function(value) {
  this.set$Value(13, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_bool field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalBool = function() {
  return this.has$Value(13);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_bool field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalBoolCount = function() {
  return this.count$Values(13);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_bool field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalBool = function() {
  this.clear$Field(13);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_string field.
***REMOVED*** @return {?string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalString = function() {
  return***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.get$Value(14));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_string field or the default value if not set.
***REMOVED*** @return {string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalStringOrDefault = function() {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.get$ValueOrDefault(14));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_string field.
***REMOVED*** @param {string} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalString = function(value) {
  this.set$Value(14, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_string field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalString = function() {
  return this.has$Value(14);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_string field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalStringCount = function() {
  return this.count$Values(14);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_string field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalString = function() {
  this.clear$Field(14);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_bytes field.
***REMOVED*** @return {?string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalBytes = function() {
  return***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.get$Value(15));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_bytes field or the default value if not set.
***REMOVED*** @return {string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalBytesOrDefault = function() {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.get$ValueOrDefault(15));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_bytes field.
***REMOVED*** @param {string} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalBytes = function(value) {
  this.set$Value(15, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_bytes field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalBytes = function() {
  return this.has$Value(15);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_bytes field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalBytesCount = function() {
  return this.count$Values(15);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_bytes field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalBytes = function() {
  this.clear$Field(15);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optionalgroup field.
***REMOVED*** @return {proto2.TestAllTypes.OptionalGroup} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalgroup = function() {
  return***REMOVED*****REMOVED*** @type {proto2.TestAllTypes.OptionalGroup}***REMOVED*** (this.get$Value(16));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optionalgroup field or the default value if not set.
***REMOVED*** @return {!proto2.TestAllTypes.OptionalGroup} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalgroupOrDefault = function() {
  return***REMOVED*****REMOVED*** @type {!proto2.TestAllTypes.OptionalGroup}***REMOVED*** (this.get$ValueOrDefault(16));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optionalgroup field.
***REMOVED*** @param {!proto2.TestAllTypes.OptionalGroup} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalgroup = function(value) {
  this.set$Value(16, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optionalgroup field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalgroup = function() {
  return this.has$Value(16);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optionalgroup field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalgroupCount = function() {
  return this.count$Values(16);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optionalgroup field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalgroup = function() {
  this.clear$Field(16);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_nested_message field.
***REMOVED*** @return {proto2.TestAllTypes.NestedMessage} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalNestedMessage = function() {
  return***REMOVED*****REMOVED*** @type {proto2.TestAllTypes.NestedMessage}***REMOVED*** (this.get$Value(18));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_nested_message field or the default value if not set.
***REMOVED*** @return {!proto2.TestAllTypes.NestedMessage} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalNestedMessageOrDefault = function() {
  return***REMOVED*****REMOVED*** @type {!proto2.TestAllTypes.NestedMessage}***REMOVED*** (this.get$ValueOrDefault(18));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_nested_message field.
***REMOVED*** @param {!proto2.TestAllTypes.NestedMessage} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalNestedMessage = function(value) {
  this.set$Value(18, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_nested_message field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalNestedMessage = function() {
  return this.has$Value(18);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_nested_message field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalNestedMessageCount = function() {
  return this.count$Values(18);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_nested_message field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalNestedMessage = function() {
  this.clear$Field(18);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_nested_enum field.
***REMOVED*** @return {?proto2.TestAllTypes.NestedEnum} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalNestedEnum = function() {
  return***REMOVED*****REMOVED*** @type {?proto2.TestAllTypes.NestedEnum}***REMOVED*** (this.get$Value(21));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_nested_enum field or the default value if not set.
***REMOVED*** @return {proto2.TestAllTypes.NestedEnum} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalNestedEnumOrDefault = function() {
  return***REMOVED*****REMOVED*** @type {proto2.TestAllTypes.NestedEnum}***REMOVED*** (this.get$ValueOrDefault(21));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_nested_enum field.
***REMOVED*** @param {proto2.TestAllTypes.NestedEnum} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalNestedEnum = function(value) {
  this.set$Value(21, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_nested_enum field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalNestedEnum = function() {
  return this.has$Value(21);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_nested_enum field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalNestedEnumCount = function() {
  return this.count$Values(21);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_nested_enum field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalNestedEnum = function() {
  this.clear$Field(21);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_int64_number field.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalInt64Number = function() {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(50));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_int64_number field or the default value if not set.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalInt64NumberOrDefault = function() {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(50));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_int64_number field.
***REMOVED*** @param {number} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalInt64Number = function(value) {
  this.set$Value(50, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_int64_number field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalInt64Number = function() {
  return this.has$Value(50);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_int64_number field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalInt64NumberCount = function() {
  return this.count$Values(50);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_int64_number field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalInt64Number = function() {
  this.clear$Field(50);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_int64_string field.
***REMOVED*** @return {?string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalInt64String = function() {
  return***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.get$Value(51));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_int64_string field or the default value if not set.
***REMOVED*** @return {string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getOptionalInt64StringOrDefault = function() {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.get$ValueOrDefault(51));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_int64_string field.
***REMOVED*** @param {string} value The value.
***REMOVED***
proto2.TestAllTypes.prototype.setOptionalInt64String = function(value) {
  this.set$Value(51, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_int64_string field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasOptionalInt64String = function() {
  return this.has$Value(51);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_int64_string field.
***REMOVED***
proto2.TestAllTypes.prototype.optionalInt64StringCount = function() {
  return this.count$Values(51);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_int64_string field.
***REMOVED***
proto2.TestAllTypes.prototype.clearOptionalInt64String = function() {
  this.clear$Field(51);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_int32 field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedInt32 = function(index) {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(31, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_int32 field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedInt32OrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(31, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_int32 field.
***REMOVED*** @param {number} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedInt32 = function(value) {
  this.add$Value(31, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_int32 field.
***REMOVED*** @return {!Array.<number>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedInt32Array = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<number>}***REMOVED*** (this.array$Values(31));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_int32 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedInt32 = function() {
  return this.has$Value(31);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_int32 field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedInt32Count = function() {
  return this.count$Values(31);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_int32 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedInt32 = function() {
  this.clear$Field(31);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_int64 field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedInt64 = function(index) {
  return***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.get$Value(32, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_int64 field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedInt64OrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.get$ValueOrDefault(32, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_int64 field.
***REMOVED*** @param {string} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedInt64 = function(value) {
  this.add$Value(32, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_int64 field.
***REMOVED*** @return {!Array.<string>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedInt64Array = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<string>}***REMOVED*** (this.array$Values(32));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_int64 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedInt64 = function() {
  return this.has$Value(32);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_int64 field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedInt64Count = function() {
  return this.count$Values(32);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_int64 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedInt64 = function() {
  this.clear$Field(32);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_uint32 field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedUint32 = function(index) {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(33, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_uint32 field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedUint32OrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(33, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_uint32 field.
***REMOVED*** @param {number} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedUint32 = function(value) {
  this.add$Value(33, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_uint32 field.
***REMOVED*** @return {!Array.<number>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedUint32Array = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<number>}***REMOVED*** (this.array$Values(33));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_uint32 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedUint32 = function() {
  return this.has$Value(33);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_uint32 field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedUint32Count = function() {
  return this.count$Values(33);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_uint32 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedUint32 = function() {
  this.clear$Field(33);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_uint64 field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedUint64 = function(index) {
  return***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.get$Value(34, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_uint64 field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedUint64OrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.get$ValueOrDefault(34, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_uint64 field.
***REMOVED*** @param {string} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedUint64 = function(value) {
  this.add$Value(34, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_uint64 field.
***REMOVED*** @return {!Array.<string>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedUint64Array = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<string>}***REMOVED*** (this.array$Values(34));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_uint64 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedUint64 = function() {
  return this.has$Value(34);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_uint64 field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedUint64Count = function() {
  return this.count$Values(34);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_uint64 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedUint64 = function() {
  this.clear$Field(34);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_sint32 field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedSint32 = function(index) {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(35, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_sint32 field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedSint32OrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(35, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_sint32 field.
***REMOVED*** @param {number} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedSint32 = function(value) {
  this.add$Value(35, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_sint32 field.
***REMOVED*** @return {!Array.<number>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedSint32Array = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<number>}***REMOVED*** (this.array$Values(35));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_sint32 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedSint32 = function() {
  return this.has$Value(35);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_sint32 field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedSint32Count = function() {
  return this.count$Values(35);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_sint32 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedSint32 = function() {
  this.clear$Field(35);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_sint64 field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedSint64 = function(index) {
  return***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.get$Value(36, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_sint64 field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedSint64OrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.get$ValueOrDefault(36, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_sint64 field.
***REMOVED*** @param {string} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedSint64 = function(value) {
  this.add$Value(36, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_sint64 field.
***REMOVED*** @return {!Array.<string>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedSint64Array = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<string>}***REMOVED*** (this.array$Values(36));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_sint64 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedSint64 = function() {
  return this.has$Value(36);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_sint64 field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedSint64Count = function() {
  return this.count$Values(36);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_sint64 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedSint64 = function() {
  this.clear$Field(36);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_fixed32 field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedFixed32 = function(index) {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(37, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_fixed32 field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedFixed32OrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(37, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_fixed32 field.
***REMOVED*** @param {number} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedFixed32 = function(value) {
  this.add$Value(37, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_fixed32 field.
***REMOVED*** @return {!Array.<number>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedFixed32Array = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<number>}***REMOVED*** (this.array$Values(37));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_fixed32 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedFixed32 = function() {
  return this.has$Value(37);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_fixed32 field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedFixed32Count = function() {
  return this.count$Values(37);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_fixed32 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedFixed32 = function() {
  this.clear$Field(37);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_fixed64 field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedFixed64 = function(index) {
  return***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.get$Value(38, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_fixed64 field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedFixed64OrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.get$ValueOrDefault(38, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_fixed64 field.
***REMOVED*** @param {string} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedFixed64 = function(value) {
  this.add$Value(38, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_fixed64 field.
***REMOVED*** @return {!Array.<string>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedFixed64Array = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<string>}***REMOVED*** (this.array$Values(38));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_fixed64 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedFixed64 = function() {
  return this.has$Value(38);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_fixed64 field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedFixed64Count = function() {
  return this.count$Values(38);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_fixed64 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedFixed64 = function() {
  this.clear$Field(38);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_sfixed32 field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedSfixed32 = function(index) {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(39, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_sfixed32 field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedSfixed32OrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(39, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_sfixed32 field.
***REMOVED*** @param {number} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedSfixed32 = function(value) {
  this.add$Value(39, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_sfixed32 field.
***REMOVED*** @return {!Array.<number>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedSfixed32Array = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<number>}***REMOVED*** (this.array$Values(39));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_sfixed32 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedSfixed32 = function() {
  return this.has$Value(39);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_sfixed32 field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedSfixed32Count = function() {
  return this.count$Values(39);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_sfixed32 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedSfixed32 = function() {
  this.clear$Field(39);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_sfixed64 field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedSfixed64 = function(index) {
  return***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.get$Value(40, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_sfixed64 field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedSfixed64OrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.get$ValueOrDefault(40, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_sfixed64 field.
***REMOVED*** @param {string} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedSfixed64 = function(value) {
  this.add$Value(40, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_sfixed64 field.
***REMOVED*** @return {!Array.<string>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedSfixed64Array = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<string>}***REMOVED*** (this.array$Values(40));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_sfixed64 field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedSfixed64 = function() {
  return this.has$Value(40);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_sfixed64 field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedSfixed64Count = function() {
  return this.count$Values(40);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_sfixed64 field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedSfixed64 = function() {
  this.clear$Field(40);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_float field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedFloat = function(index) {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(41, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_float field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedFloatOrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(41, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_float field.
***REMOVED*** @param {number} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedFloat = function(value) {
  this.add$Value(41, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_float field.
***REMOVED*** @return {!Array.<number>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedFloatArray = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<number>}***REMOVED*** (this.array$Values(41));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_float field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedFloat = function() {
  return this.has$Value(41);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_float field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedFloatCount = function() {
  return this.count$Values(41);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_float field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedFloat = function() {
  this.clear$Field(41);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_double field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedDouble = function(index) {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(42, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_double field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedDoubleOrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(42, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_double field.
***REMOVED*** @param {number} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedDouble = function(value) {
  this.add$Value(42, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_double field.
***REMOVED*** @return {!Array.<number>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedDoubleArray = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<number>}***REMOVED*** (this.array$Values(42));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_double field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedDouble = function() {
  return this.has$Value(42);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_double field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedDoubleCount = function() {
  return this.count$Values(42);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_double field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedDouble = function() {
  this.clear$Field(42);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_bool field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?boolean} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedBool = function(index) {
  return***REMOVED*****REMOVED*** @type {?boolean}***REMOVED*** (this.get$Value(43, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_bool field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {boolean} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedBoolOrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {boolean}***REMOVED*** (this.get$ValueOrDefault(43, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_bool field.
***REMOVED*** @param {boolean} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedBool = function(value) {
  this.add$Value(43, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_bool field.
***REMOVED*** @return {!Array.<boolean>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedBoolArray = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<boolean>}***REMOVED*** (this.array$Values(43));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_bool field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedBool = function() {
  return this.has$Value(43);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_bool field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedBoolCount = function() {
  return this.count$Values(43);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_bool field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedBool = function() {
  this.clear$Field(43);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_string field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedString = function(index) {
  return***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.get$Value(44, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_string field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedStringOrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.get$ValueOrDefault(44, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_string field.
***REMOVED*** @param {string} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedString = function(value) {
  this.add$Value(44, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_string field.
***REMOVED*** @return {!Array.<string>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedStringArray = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<string>}***REMOVED*** (this.array$Values(44));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_string field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedString = function() {
  return this.has$Value(44);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_string field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedStringCount = function() {
  return this.count$Values(44);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_string field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedString = function() {
  this.clear$Field(44);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_bytes field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedBytes = function(index) {
  return***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.get$Value(45, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_bytes field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedBytesOrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.get$ValueOrDefault(45, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_bytes field.
***REMOVED*** @param {string} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedBytes = function(value) {
  this.add$Value(45, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_bytes field.
***REMOVED*** @return {!Array.<string>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedBytesArray = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<string>}***REMOVED*** (this.array$Values(45));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_bytes field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedBytes = function() {
  return this.has$Value(45);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_bytes field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedBytesCount = function() {
  return this.count$Values(45);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_bytes field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedBytes = function() {
  this.clear$Field(45);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeatedgroup field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {proto2.TestAllTypes.RepeatedGroup} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedgroup = function(index) {
  return***REMOVED*****REMOVED*** @type {proto2.TestAllTypes.RepeatedGroup}***REMOVED*** (this.get$Value(46, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeatedgroup field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {!proto2.TestAllTypes.RepeatedGroup} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedgroupOrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {!proto2.TestAllTypes.RepeatedGroup}***REMOVED*** (this.get$ValueOrDefault(46, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeatedgroup field.
***REMOVED*** @param {!proto2.TestAllTypes.RepeatedGroup} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedgroup = function(value) {
  this.add$Value(46, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeatedgroup field.
***REMOVED*** @return {!Array.<!proto2.TestAllTypes.RepeatedGroup>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedgroupArray = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<!proto2.TestAllTypes.RepeatedGroup>}***REMOVED*** (this.array$Values(46));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeatedgroup field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedgroup = function() {
  return this.has$Value(46);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeatedgroup field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedgroupCount = function() {
  return this.count$Values(46);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeatedgroup field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedgroup = function() {
  this.clear$Field(46);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_nested_message field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {proto2.TestAllTypes.NestedMessage} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedNestedMessage = function(index) {
  return***REMOVED*****REMOVED*** @type {proto2.TestAllTypes.NestedMessage}***REMOVED*** (this.get$Value(48, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_nested_message field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {!proto2.TestAllTypes.NestedMessage} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedNestedMessageOrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {!proto2.TestAllTypes.NestedMessage}***REMOVED*** (this.get$ValueOrDefault(48, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_nested_message field.
***REMOVED*** @param {!proto2.TestAllTypes.NestedMessage} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedNestedMessage = function(value) {
  this.add$Value(48, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_nested_message field.
***REMOVED*** @return {!Array.<!proto2.TestAllTypes.NestedMessage>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedNestedMessageArray = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<!proto2.TestAllTypes.NestedMessage>}***REMOVED*** (this.array$Values(48));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_nested_message field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedNestedMessage = function() {
  return this.has$Value(48);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_nested_message field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedNestedMessageCount = function() {
  return this.count$Values(48);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_nested_message field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedNestedMessage = function() {
  this.clear$Field(48);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_nested_enum field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?proto2.TestAllTypes.NestedEnum} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedNestedEnum = function(index) {
  return***REMOVED*****REMOVED*** @type {?proto2.TestAllTypes.NestedEnum}***REMOVED*** (this.get$Value(49, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_nested_enum field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {proto2.TestAllTypes.NestedEnum} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedNestedEnumOrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {proto2.TestAllTypes.NestedEnum}***REMOVED*** (this.get$ValueOrDefault(49, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_nested_enum field.
***REMOVED*** @param {proto2.TestAllTypes.NestedEnum} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedNestedEnum = function(value) {
  this.add$Value(49, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_nested_enum field.
***REMOVED*** @return {!Array.<proto2.TestAllTypes.NestedEnum>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedNestedEnumArray = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<proto2.TestAllTypes.NestedEnum>}***REMOVED*** (this.array$Values(49));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_nested_enum field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedNestedEnum = function() {
  return this.has$Value(49);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_nested_enum field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedNestedEnumCount = function() {
  return this.count$Values(49);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_nested_enum field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedNestedEnum = function() {
  this.clear$Field(49);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_int64_number field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedInt64Number = function(index) {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(52, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_int64_number field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedInt64NumberOrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(52, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_int64_number field.
***REMOVED*** @param {number} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedInt64Number = function(value) {
  this.add$Value(52, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_int64_number field.
***REMOVED*** @return {!Array.<number>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedInt64NumberArray = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<number>}***REMOVED*** (this.array$Values(52));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_int64_number field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedInt64Number = function() {
  return this.has$Value(52);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_int64_number field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedInt64NumberCount = function() {
  return this.count$Values(52);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_int64_number field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedInt64Number = function() {
  this.clear$Field(52);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_int64_string field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedInt64String = function(index) {
  return***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.get$Value(53, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the repeated_int64_string field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {string} The value.
***REMOVED***
proto2.TestAllTypes.prototype.getRepeatedInt64StringOrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.get$ValueOrDefault(53, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the repeated_int64_string field.
***REMOVED*** @param {string} value The value to add.
***REMOVED***
proto2.TestAllTypes.prototype.addRepeatedInt64String = function(value) {
  this.add$Value(53, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the repeated_int64_string field.
***REMOVED*** @return {!Array.<string>} The values in the field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedInt64StringArray = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<string>}***REMOVED*** (this.array$Values(53));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the repeated_int64_string field has a value.
***REMOVED***
proto2.TestAllTypes.prototype.hasRepeatedInt64String = function() {
  return this.has$Value(53);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the repeated_int64_string field.
***REMOVED***
proto2.TestAllTypes.prototype.repeatedInt64StringCount = function() {
  return this.count$Values(53);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the repeated_int64_string field.
***REMOVED***
proto2.TestAllTypes.prototype.clearRepeatedInt64String = function() {
  this.clear$Field(53);
***REMOVED***


***REMOVED***
***REMOVED*** Enumeration NestedEnum.
***REMOVED*** @enum {number}
***REMOVED***
proto2.TestAllTypes.NestedEnum = {
  FOO: 0,
  BAR: 2,
  BAZ: 3
***REMOVED***



***REMOVED***
***REMOVED*** Message NestedMessage.
***REMOVED***
***REMOVED*** @extends {goog.proto2.Message}
***REMOVED***
proto2.TestAllTypes.NestedMessage = function() {
  goog.proto2.Message.apply(this);
***REMOVED***
goog.inherits(proto2.TestAllTypes.NestedMessage, goog.proto2.Message);


***REMOVED***
***REMOVED*** Overrides {@link goog.proto2.Message#clone} to specify its exact return type.
***REMOVED*** @return {!proto2.TestAllTypes.NestedMessage} The cloned message.
***REMOVED*** @override
***REMOVED***
proto2.TestAllTypes.NestedMessage.prototype.clone;


***REMOVED***
***REMOVED*** Gets the value of the b field.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.NestedMessage.prototype.getB = function() {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(1));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the b field or the default value if not set.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.NestedMessage.prototype.getBOrDefault = function() {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(1));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the b field.
***REMOVED*** @param {number} value The value.
***REMOVED***
proto2.TestAllTypes.NestedMessage.prototype.setB = function(value) {
  this.set$Value(1, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the b field has a value.
***REMOVED***
proto2.TestAllTypes.NestedMessage.prototype.hasB = function() {
  return this.has$Value(1);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the b field.
***REMOVED***
proto2.TestAllTypes.NestedMessage.prototype.bCount = function() {
  return this.count$Values(1);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the b field.
***REMOVED***
proto2.TestAllTypes.NestedMessage.prototype.clearB = function() {
  this.clear$Field(1);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the c field.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.NestedMessage.prototype.getC = function() {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(2));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the c field or the default value if not set.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.NestedMessage.prototype.getCOrDefault = function() {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(2));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the c field.
***REMOVED*** @param {number} value The value.
***REMOVED***
proto2.TestAllTypes.NestedMessage.prototype.setC = function(value) {
  this.set$Value(2, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the c field has a value.
***REMOVED***
proto2.TestAllTypes.NestedMessage.prototype.hasC = function() {
  return this.has$Value(2);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the c field.
***REMOVED***
proto2.TestAllTypes.NestedMessage.prototype.cCount = function() {
  return this.count$Values(2);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the c field.
***REMOVED***
proto2.TestAllTypes.NestedMessage.prototype.clearC = function() {
  this.clear$Field(2);
***REMOVED***



***REMOVED***
***REMOVED*** Message OptionalGroup.
***REMOVED***
***REMOVED*** @extends {goog.proto2.Message}
***REMOVED***
proto2.TestAllTypes.OptionalGroup = function() {
  goog.proto2.Message.apply(this);
***REMOVED***
goog.inherits(proto2.TestAllTypes.OptionalGroup, goog.proto2.Message);


***REMOVED***
***REMOVED*** Overrides {@link goog.proto2.Message#clone} to specify its exact return type.
***REMOVED*** @return {!proto2.TestAllTypes.OptionalGroup} The cloned message.
***REMOVED*** @override
***REMOVED***
proto2.TestAllTypes.OptionalGroup.prototype.clone;


***REMOVED***
***REMOVED*** Gets the value of the a field.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.OptionalGroup.prototype.getA = function() {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(17));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the a field or the default value if not set.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.OptionalGroup.prototype.getAOrDefault = function() {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(17));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the a field.
***REMOVED*** @param {number} value The value.
***REMOVED***
proto2.TestAllTypes.OptionalGroup.prototype.setA = function(value) {
  this.set$Value(17, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the a field has a value.
***REMOVED***
proto2.TestAllTypes.OptionalGroup.prototype.hasA = function() {
  return this.has$Value(17);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the a field.
***REMOVED***
proto2.TestAllTypes.OptionalGroup.prototype.aCount = function() {
  return this.count$Values(17);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the a field.
***REMOVED***
proto2.TestAllTypes.OptionalGroup.prototype.clearA = function() {
  this.clear$Field(17);
***REMOVED***



***REMOVED***
***REMOVED*** Message RepeatedGroup.
***REMOVED***
***REMOVED*** @extends {goog.proto2.Message}
***REMOVED***
proto2.TestAllTypes.RepeatedGroup = function() {
  goog.proto2.Message.apply(this);
***REMOVED***
goog.inherits(proto2.TestAllTypes.RepeatedGroup, goog.proto2.Message);


***REMOVED***
***REMOVED*** Overrides {@link goog.proto2.Message#clone} to specify its exact return type.
***REMOVED*** @return {!proto2.TestAllTypes.RepeatedGroup} The cloned message.
***REMOVED*** @override
***REMOVED***
proto2.TestAllTypes.RepeatedGroup.prototype.clone;


***REMOVED***
***REMOVED*** Gets the value of the a field at the index given.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {?number} The value.
***REMOVED***
proto2.TestAllTypes.RepeatedGroup.prototype.getA = function(index) {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(47, index));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the a field at the index given or the default value if not set.
***REMOVED*** @param {number} index The index to lookup.
***REMOVED*** @return {number} The value.
***REMOVED***
proto2.TestAllTypes.RepeatedGroup.prototype.getAOrDefault = function(index) {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(47, index));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a value to the a field.
***REMOVED*** @param {number} value The value to add.
***REMOVED***
proto2.TestAllTypes.RepeatedGroup.prototype.addA = function(value) {
  this.add$Value(47, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the array of values in the a field.
***REMOVED*** @return {!Array.<number>} The values in the field.
***REMOVED***
proto2.TestAllTypes.RepeatedGroup.prototype.aArray = function() {
  return***REMOVED*****REMOVED*** @type {!Array.<number>}***REMOVED*** (this.array$Values(47));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the a field has a value.
***REMOVED***
proto2.TestAllTypes.RepeatedGroup.prototype.hasA = function() {
  return this.has$Value(47);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the a field.
***REMOVED***
proto2.TestAllTypes.RepeatedGroup.prototype.aCount = function() {
  return this.count$Values(47);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the a field.
***REMOVED***
proto2.TestAllTypes.RepeatedGroup.prototype.clearA = function() {
  this.clear$Field(47);
***REMOVED***


goog.proto2.Message.set$Metadata(proto2.TestAllTypes, {
  0: {
    name: 'TestAllTypes',
    fullName: 'TestAllTypes'
  },
  1: {
    name: 'optional_int32',
    fieldType: goog.proto2.Message.FieldType.INT32,
    type: Number
  },
  2: {
    name: 'optional_int64',
    fieldType: goog.proto2.Message.FieldType.INT64,
    defaultValue: '1',
    type: String
  },
  3: {
    name: 'optional_uint32',
    fieldType: goog.proto2.Message.FieldType.UINT32,
    type: Number
  },
  4: {
    name: 'optional_uint64',
    fieldType: goog.proto2.Message.FieldType.UINT64,
    type: String
  },
  5: {
    name: 'optional_sint32',
    fieldType: goog.proto2.Message.FieldType.SINT32,
    type: Number
  },
  6: {
    name: 'optional_sint64',
    fieldType: goog.proto2.Message.FieldType.SINT64,
    type: String
  },
  7: {
    name: 'optional_fixed32',
    fieldType: goog.proto2.Message.FieldType.FIXED32,
    type: Number
  },
  8: {
    name: 'optional_fixed64',
    fieldType: goog.proto2.Message.FieldType.FIXED64,
    type: String
  },
  9: {
    name: 'optional_sfixed32',
    fieldType: goog.proto2.Message.FieldType.SFIXED32,
    type: Number
  },
  10: {
    name: 'optional_sfixed64',
    fieldType: goog.proto2.Message.FieldType.SFIXED64,
    type: String
  },
  11: {
    name: 'optional_float',
    fieldType: goog.proto2.Message.FieldType.FLOAT,
    defaultValue: 1.5,
    type: Number
  },
  12: {
    name: 'optional_double',
    fieldType: goog.proto2.Message.FieldType.DOUBLE,
    type: Number
  },
  13: {
    name: 'optional_bool',
    fieldType: goog.proto2.Message.FieldType.BOOL,
    type: Boolean
  },
  14: {
    name: 'optional_string',
    fieldType: goog.proto2.Message.FieldType.STRING,
    type: String
  },
  15: {
    name: 'optional_bytes',
    fieldType: goog.proto2.Message.FieldType.BYTES,
    defaultValue: 'moo',
    type: String
  },
  16: {
    name: 'optionalgroup',
    fieldType: goog.proto2.Message.FieldType.GROUP,
    type: proto2.TestAllTypes.OptionalGroup
  },
  18: {
    name: 'optional_nested_message',
    fieldType: goog.proto2.Message.FieldType.MESSAGE,
    type: proto2.TestAllTypes.NestedMessage
  },
  21: {
    name: 'optional_nested_enum',
    fieldType: goog.proto2.Message.FieldType.ENUM,
    defaultValue: proto2.TestAllTypes.NestedEnum.FOO,
    type: proto2.TestAllTypes.NestedEnum
  },
  50: {
    name: 'optional_int64_number',
    fieldType: goog.proto2.Message.FieldType.INT64,
    defaultValue: 1000000000000000001,
    type: Number
  },
  51: {
    name: 'optional_int64_string',
    fieldType: goog.proto2.Message.FieldType.INT64,
    defaultValue: '1000000000000000001',
    type: String
  },
  31: {
    name: 'repeated_int32',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.INT32,
    type: Number
  },
  32: {
    name: 'repeated_int64',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.INT64,
    type: String
  },
  33: {
    name: 'repeated_uint32',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.UINT32,
    type: Number
  },
  34: {
    name: 'repeated_uint64',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.UINT64,
    type: String
  },
  35: {
    name: 'repeated_sint32',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.SINT32,
    type: Number
  },
  36: {
    name: 'repeated_sint64',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.SINT64,
    type: String
  },
  37: {
    name: 'repeated_fixed32',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.FIXED32,
    type: Number
  },
  38: {
    name: 'repeated_fixed64',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.FIXED64,
    type: String
  },
  39: {
    name: 'repeated_sfixed32',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.SFIXED32,
    type: Number
  },
  40: {
    name: 'repeated_sfixed64',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.SFIXED64,
    type: String
  },
  41: {
    name: 'repeated_float',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.FLOAT,
    type: Number
  },
  42: {
    name: 'repeated_double',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.DOUBLE,
    type: Number
  },
  43: {
    name: 'repeated_bool',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.BOOL,
    type: Boolean
  },
  44: {
    name: 'repeated_string',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.STRING,
    type: String
  },
  45: {
    name: 'repeated_bytes',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.BYTES,
    type: String
  },
  46: {
    name: 'repeatedgroup',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.GROUP,
    type: proto2.TestAllTypes.RepeatedGroup
  },
  48: {
    name: 'repeated_nested_message',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.MESSAGE,
    type: proto2.TestAllTypes.NestedMessage
  },
  49: {
    name: 'repeated_nested_enum',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.ENUM,
    defaultValue: proto2.TestAllTypes.NestedEnum.FOO,
    type: proto2.TestAllTypes.NestedEnum
  },
  52: {
    name: 'repeated_int64_number',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.INT64,
    type: Number
  },
  53: {
    name: 'repeated_int64_string',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.INT64,
    type: String
  }
});


goog.proto2.Message.set$Metadata(proto2.TestAllTypes.NestedMessage, {
  0: {
    name: 'NestedMessage',
    containingType: proto2.TestAllTypes,
    fullName: 'TestAllTypes.NestedMessage'
  },
  1: {
    name: 'b',
    fieldType: goog.proto2.Message.FieldType.INT32,
    type: Number
  },
  2: {
    name: 'c',
    fieldType: goog.proto2.Message.FieldType.INT32,
    type: Number
  }
});


goog.proto2.Message.set$Metadata(proto2.TestAllTypes.OptionalGroup, {
  0: {
    name: 'OptionalGroup',
    containingType: proto2.TestAllTypes,
    fullName: 'TestAllTypes.OptionalGroup'
  },
  17: {
    name: 'a',
    fieldType: goog.proto2.Message.FieldType.INT32,
    type: Number
  }
});


goog.proto2.Message.set$Metadata(proto2.TestAllTypes.RepeatedGroup, {
  0: {
    name: 'RepeatedGroup',
    containingType: proto2.TestAllTypes,
    fullName: 'TestAllTypes.RepeatedGroup'
  },
  47: {
    name: 'a',
    repeated: true,
    fieldType: goog.proto2.Message.FieldType.INT32,
    type: Number
  }
});
