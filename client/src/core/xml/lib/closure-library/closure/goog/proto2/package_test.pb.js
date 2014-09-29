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
***REMOVED*** closure/goog/proto2/package_test.proto.
***REMOVED***

goog.provide('someprotopackage.TestPackageTypes');

goog.require('goog.proto2.Message');
goog.require('proto2.TestAllTypes');

goog.setTestOnly('package_test.pb');


***REMOVED***
***REMOVED*** Message TestPackageTypes.
***REMOVED***
***REMOVED*** @extends {goog.proto2.Message}
***REMOVED***
someprotopackage.TestPackageTypes = function() {
  goog.proto2.Message.apply(this);
***REMOVED***
goog.inherits(someprotopackage.TestPackageTypes, goog.proto2.Message);


***REMOVED***
***REMOVED*** Overrides {@link goog.proto2.Message#clone} to specify its exact return type.
***REMOVED*** @return {!someprotopackage.TestPackageTypes} The cloned message.
***REMOVED*** @override
***REMOVED***
someprotopackage.TestPackageTypes.prototype.clone;


***REMOVED***
***REMOVED*** Gets the value of the optional_int32 field.
***REMOVED*** @return {?number} The value.
***REMOVED***
someprotopackage.TestPackageTypes.prototype.getOptionalInt32 = function() {
  return***REMOVED*****REMOVED*** @type {?number}***REMOVED*** (this.get$Value(1));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the optional_int32 field or the default value if not set.
***REMOVED*** @return {number} The value.
***REMOVED***
someprotopackage.TestPackageTypes.prototype.getOptionalInt32OrDefault = function() {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.get$ValueOrDefault(1));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the optional_int32 field.
***REMOVED*** @param {number} value The value.
***REMOVED***
someprotopackage.TestPackageTypes.prototype.setOptionalInt32 = function(value) {
  this.set$Value(1, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the optional_int32 field has a value.
***REMOVED***
someprotopackage.TestPackageTypes.prototype.hasOptionalInt32 = function() {
  return this.has$Value(1);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the optional_int32 field.
***REMOVED***
someprotopackage.TestPackageTypes.prototype.optionalInt32Count = function() {
  return this.count$Values(1);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the optional_int32 field.
***REMOVED***
someprotopackage.TestPackageTypes.prototype.clearOptionalInt32 = function() {
  this.clear$Field(1);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the other_all field.
***REMOVED*** @return {proto2.TestAllTypes} The value.
***REMOVED***
someprotopackage.TestPackageTypes.prototype.getOtherAll = function() {
  return***REMOVED*****REMOVED*** @type {proto2.TestAllTypes}***REMOVED*** (this.get$Value(2));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of the other_all field or the default value if not set.
***REMOVED*** @return {!proto2.TestAllTypes} The value.
***REMOVED***
someprotopackage.TestPackageTypes.prototype.getOtherAllOrDefault = function() {
  return***REMOVED*****REMOVED*** @type {!proto2.TestAllTypes}***REMOVED*** (this.get$ValueOrDefault(2));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the other_all field.
***REMOVED*** @param {!proto2.TestAllTypes} value The value.
***REMOVED***
someprotopackage.TestPackageTypes.prototype.setOtherAll = function(value) {
  this.set$Value(2, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the other_all field has a value.
***REMOVED***
someprotopackage.TestPackageTypes.prototype.hasOtherAll = function() {
  return this.has$Value(2);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of values in the other_all field.
***REMOVED***
someprotopackage.TestPackageTypes.prototype.otherAllCount = function() {
  return this.count$Values(2);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the values in the other_all field.
***REMOVED***
someprotopackage.TestPackageTypes.prototype.clearOtherAll = function() {
  this.clear$Field(2);
***REMOVED***


goog.proto2.Message.set$Metadata(someprotopackage.TestPackageTypes, {
  0: {
    name: 'TestPackageTypes',
    fullName: 'someprotopackage.TestPackageTypes'
  },
  1: {
    name: 'optional_int32',
    fieldType: goog.proto2.Message.FieldType.INT32,
    type: Number
  },
  2: {
    name: 'other_all',
    fieldType: goog.proto2.Message.FieldType.MESSAGE,
    type: proto2.TestAllTypes
  }
});
