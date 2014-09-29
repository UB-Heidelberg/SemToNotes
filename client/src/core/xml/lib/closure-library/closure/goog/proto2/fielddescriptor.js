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
***REMOVED*** @fileoverview Protocol Buffer Field Descriptor class.
***REMOVED***

goog.provide('goog.proto2.FieldDescriptor');

goog.require('goog.proto2.Util');
goog.require('goog.string');



***REMOVED***
***REMOVED*** A class which describes a field in a Protocol Buffer 2 Message.
***REMOVED***
***REMOVED*** @param {Function} messageType Constructor for the message
***REMOVED***     class to which the field described by this class belongs.
***REMOVED*** @param {number|string} tag The field's tag index.
***REMOVED*** @param {Object} metadata The metadata about this field that will be used
***REMOVED***     to construct this descriptor.
***REMOVED***
***REMOVED***
***REMOVED***
goog.proto2.FieldDescriptor = function(messageType, tag, metadata) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The message type that contains the field that this
  ***REMOVED*** descriptor describes.
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.parent_ = messageType;

  // Ensure that the tag is numeric.
  goog.proto2.Util.assert(goog.string.isNumeric(tag));

 ***REMOVED*****REMOVED***
  ***REMOVED*** The field's tag number.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tag_ =***REMOVED*****REMOVED*** @type {number}***REMOVED*** (tag);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The field's name.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.name_ = metadata.name;

 ***REMOVED*****REMOVED*** @type {goog.proto2.FieldDescriptor.FieldType}***REMOVED***
  metadata.fieldType;

 ***REMOVED*****REMOVED*** @type {*}***REMOVED***
  metadata.repeated;

 ***REMOVED*****REMOVED*** @type {*}***REMOVED***
  metadata.required;

 ***REMOVED*****REMOVED***
  ***REMOVED*** If true, this field is a repeating field.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.isRepeated_ = !!metadata.repeated;

 ***REMOVED*****REMOVED***
  ***REMOVED*** If true, this field is required.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.isRequired_ = !!metadata.required;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The field type of this field.
  ***REMOVED*** @type {goog.proto2.FieldDescriptor.FieldType}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.fieldType_ = metadata.fieldType;

 ***REMOVED*****REMOVED***
  ***REMOVED*** If this field is a primitive: The native (ECMAScript) type of this field.
  ***REMOVED*** If an enumeration: The enumeration object.
  ***REMOVED*** If a message or group field: The Message function.
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.nativeType_ = metadata.type;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Is it permissible on deserialization to convert between numbers and
  ***REMOVED*** well-formed strings?  Is true for 64-bit integral field types, false for
  ***REMOVED*** all other field types.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.deserializationConversionPermitted_ = false;

  switch (this.fieldType_) {
    case goog.proto2.FieldDescriptor.FieldType.INT64:
    case goog.proto2.FieldDescriptor.FieldType.UINT64:
    case goog.proto2.FieldDescriptor.FieldType.FIXED64:
    case goog.proto2.FieldDescriptor.FieldType.SFIXED64:
    case goog.proto2.FieldDescriptor.FieldType.SINT64:
      this.deserializationConversionPermitted_ = true;
      break;
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** The default value of this field, if different from the default, default
  ***REMOVED*** value.
  ***REMOVED*** @type {*}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.defaultValue_ = metadata.defaultValue;
***REMOVED***


***REMOVED***
***REMOVED*** An enumeration defining the possible field types.
***REMOVED*** Should be a mirror of that defined in descriptor.h.
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
goog.proto2.FieldDescriptor.FieldType = {
  DOUBLE: 1,
  FLOAT: 2,
  INT64: 3,
  UINT64: 4,
  INT32: 5,
  FIXED64: 6,
  FIXED32: 7,
  BOOL: 8,
  STRING: 9,
  GROUP: 10,
  MESSAGE: 11,
  BYTES: 12,
  UINT32: 13,
  ENUM: 14,
  SFIXED32: 15,
  SFIXED64: 16,
  SINT32: 17,
  SINT64: 18
***REMOVED***


***REMOVED***
***REMOVED*** Returns the tag of the field that this descriptor represents.
***REMOVED***
***REMOVED*** @return {number} The tag number.
***REMOVED***
goog.proto2.FieldDescriptor.prototype.getTag = function() {
  return this.tag_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the descriptor describing the message that defined this field.
***REMOVED*** @return {goog.proto2.Descriptor} The descriptor.
***REMOVED***
goog.proto2.FieldDescriptor.prototype.getContainingType = function() {
  return this.parent_.getDescriptor();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the name of the field that this descriptor represents.
***REMOVED*** @return {string} The name.
***REMOVED***
goog.proto2.FieldDescriptor.prototype.getName = function() {
  return this.name_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the default value of this field.
***REMOVED*** @return {*} The default value.
***REMOVED***
goog.proto2.FieldDescriptor.prototype.getDefaultValue = function() {
  if (this.defaultValue_ === undefined) {
    // Set the default value based on a new instance of the native type.
    // This will be (0, false, "") for (number, boolean, string) and will
    // be a new instance of a group/message if the field is a message type.
    var nativeType = this.nativeType_;
    if (nativeType === Boolean) {
      this.defaultValue_ = false;
    } else if (nativeType === Number) {
      this.defaultValue_ = 0;
    } else if (nativeType === String) {
      this.defaultValue_ = '';
    } else {
      this.defaultValue_ = new nativeType;
    }
  }

  return this.defaultValue_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the field type of the field described by this descriptor.
***REMOVED*** @return {goog.proto2.FieldDescriptor.FieldType} The field type.
***REMOVED***
goog.proto2.FieldDescriptor.prototype.getFieldType = function() {
  return this.fieldType_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the native (i.e. ECMAScript) type of the field described by this
***REMOVED*** descriptor.
***REMOVED***
***REMOVED*** @return {Object} The native type.
***REMOVED***
goog.proto2.FieldDescriptor.prototype.getNativeType = function() {
  return this.nativeType_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if simple conversions between numbers and strings are permitted
***REMOVED*** during deserialization for this field.
***REMOVED***
***REMOVED*** @return {boolean} Whether conversion is permitted.
***REMOVED***
goog.proto2.FieldDescriptor.prototype.deserializationConversionPermitted =
    function() {
  return this.deserializationConversionPermitted_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the descriptor of the message type of this field. Only valid
***REMOVED*** for fields of type GROUP and MESSAGE.
***REMOVED***
***REMOVED*** @return {goog.proto2.Descriptor} The message descriptor.
***REMOVED***
goog.proto2.FieldDescriptor.prototype.getFieldMessageType = function() {
  goog.proto2.Util.assert(this.isCompositeType(), 'Expected message or group');

  return this.nativeType_.getDescriptor();
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if the field stores composite data or repeated
***REMOVED***     composite data (message or group).
***REMOVED***
goog.proto2.FieldDescriptor.prototype.isCompositeType = function() {
  return this.fieldType_ == goog.proto2.FieldDescriptor.FieldType.MESSAGE ||
      this.fieldType_ == goog.proto2.FieldDescriptor.FieldType.GROUP;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the field described by this descriptor is repeating.
***REMOVED*** @return {boolean} Whether the field is repeated.
***REMOVED***
goog.proto2.FieldDescriptor.prototype.isRepeated = function() {
  return this.isRepeated_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the field described by this descriptor is required.
***REMOVED*** @return {boolean} Whether the field is required.
***REMOVED***
goog.proto2.FieldDescriptor.prototype.isRequired = function() {
  return this.isRequired_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the field described by this descriptor is optional.
***REMOVED*** @return {boolean} Whether the field is optional.
***REMOVED***
goog.proto2.FieldDescriptor.prototype.isOptional = function() {
  return !this.isRepeated_ && !this.isRequired_;
***REMOVED***
