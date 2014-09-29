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
***REMOVED*** @fileoverview Protocol Buffer (Message) Descriptor class.
***REMOVED***

goog.provide('goog.proto2.Descriptor');
goog.provide('goog.proto2.Metadata');

goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.proto2.Util');


***REMOVED***
***REMOVED*** @typedef {{name: (string|undefined),
***REMOVED***            fullName: (string|undefined),
***REMOVED***            containingType: (goog.proto2.Message|undefined)}}
***REMOVED***
goog.proto2.Metadata;



***REMOVED***
***REMOVED*** A class which describes a Protocol Buffer 2 Message.
***REMOVED***
***REMOVED*** @param {function(new:goog.proto2.Message)} messageType Constructor for
***REMOVED***      the message class that this descriptor describes.
***REMOVED*** @param {!goog.proto2.Metadata} metadata The metadata about the message that
***REMOVED***      will be used to construct this descriptor.
***REMOVED*** @param {Array.<!goog.proto2.FieldDescriptor>} fields The fields of the
***REMOVED***      message described by this descriptor.
***REMOVED***
***REMOVED***
***REMOVED***
goog.proto2.Descriptor = function(messageType, metadata, fields) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {function(new:goog.proto2.Message)}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.messageType_ = messageType;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.name_ = metadata.name || null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.fullName_ = metadata.fullName || null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {goog.proto2.Message|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.containingType_ = metadata.containingType;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The fields of the message described by this descriptor.
  ***REMOVED*** @type {!Object.<number, !goog.proto2.FieldDescriptor>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.fields_ = {***REMOVED***

  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    this.fields_[field.getTag()] = field;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the name of the message, if any.
***REMOVED***
***REMOVED*** @return {?string} The name.
***REMOVED***
goog.proto2.Descriptor.prototype.getName = function() {
  return this.name_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the full name of the message, if any.
***REMOVED***
***REMOVED*** @return {?string} The name.
***REMOVED***
goog.proto2.Descriptor.prototype.getFullName = function() {
  return this.fullName_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the descriptor of the containing message type or null if none.
***REMOVED***
***REMOVED*** @return {goog.proto2.Descriptor} The descriptor.
***REMOVED***
goog.proto2.Descriptor.prototype.getContainingType = function() {
  if (!this.containingType_) {
    return null;
  }

  return this.containingType_.getDescriptor();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the fields in the message described by this descriptor ordered by
***REMOVED*** tag.
***REMOVED***
***REMOVED*** @return {!Array.<!goog.proto2.FieldDescriptor>} The array of field
***REMOVED***     descriptors.
***REMOVED***
goog.proto2.Descriptor.prototype.getFields = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @param {!goog.proto2.FieldDescriptor} fieldA First field.
  ***REMOVED*** @param {!goog.proto2.FieldDescriptor} fieldB Second field.
  ***REMOVED*** @return {number} Negative if fieldA's tag number is smaller, positive
  ***REMOVED***     if greater, zero if the same.
 ***REMOVED*****REMOVED***
  function tagComparator(fieldA, fieldB) {
    return fieldA.getTag() - fieldB.getTag();
 ***REMOVED*****REMOVED***

  var fields = goog.object.getValues(this.fields_);
  goog.array.sort(fields, tagComparator);

  return fields;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the fields in the message as a key/value map, where the key is
***REMOVED*** the tag number of the field. DO NOT MODIFY THE RETURNED OBJECT. We return
***REMOVED*** the actual, internal, fields map for performance reasons, and changing the
***REMOVED*** map can result in undefined behavior of this library.
***REMOVED***
***REMOVED*** @return {!Object.<number, !goog.proto2.FieldDescriptor>} The field map.
***REMOVED***
goog.proto2.Descriptor.prototype.getFieldsMap = function() {
  return this.fields_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the field matching the given name, if any. Note that
***REMOVED*** this method searches over the***REMOVED***original* name of the field,
***REMOVED*** not the camelCase version.
***REMOVED***
***REMOVED*** @param {string} name The field name for which to search.
***REMOVED***
***REMOVED*** @return {goog.proto2.FieldDescriptor} The field found, if any.
***REMOVED***
goog.proto2.Descriptor.prototype.findFieldByName = function(name) {
  var valueFound = goog.object.findValue(this.fields_,
      function(field, key, obj) {
        return field.getName() == name;
      });

  return***REMOVED*****REMOVED*** @type {goog.proto2.FieldDescriptor}***REMOVED*** (valueFound) || null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the field matching the given tag number, if any.
***REMOVED***
***REMOVED*** @param {number|string} tag The field tag number for which to search.
***REMOVED***
***REMOVED*** @return {goog.proto2.FieldDescriptor} The field found, if any.
***REMOVED***
goog.proto2.Descriptor.prototype.findFieldByTag = function(tag) {
  goog.proto2.Util.assert(goog.string.isNumeric(tag));
  return this.fields_[parseInt(tag, 10)] || null;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an instance of the message type that this descriptor
***REMOVED*** describes.
***REMOVED***
***REMOVED*** @return {!goog.proto2.Message} The instance of the message.
***REMOVED***
goog.proto2.Descriptor.prototype.createMessageInstance = function() {
  return new this.messageType_;
***REMOVED***
