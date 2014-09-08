// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Provides a convenient API for data with attached metadata
***REMOVED*** persistence. You probably don't want to use this class directly as it
***REMOVED*** does not save any metadata by itself. It only provides the necessary
***REMOVED*** infrastructure for subclasses that need to save metadata along with
***REMOVED*** values stored.
***REMOVED***
***REMOVED***

goog.provide('goog.storage.RichStorage');
goog.provide('goog.storage.RichStorage.Wrapper');

goog.require('goog.storage.ErrorCode');
goog.require('goog.storage.Storage');
goog.require('goog.storage.mechanism.Mechanism');



***REMOVED***
***REMOVED*** Provides a storage for data with attached metadata.
***REMOVED***
***REMOVED*** @param {!goog.storage.mechanism.Mechanism} mechanism The underlying
***REMOVED***     storage mechanism.
***REMOVED***
***REMOVED*** @extends {goog.storage.Storage}
***REMOVED***
goog.storage.RichStorage = function(mechanism) {
  goog.storage.RichStorage.base(this, 'constructor', mechanism);
***REMOVED***
goog.inherits(goog.storage.RichStorage, goog.storage.Storage);


***REMOVED***
***REMOVED*** Metadata key under which the actual data is stored.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @protected
***REMOVED***
goog.storage.RichStorage.DATA_KEY = 'data';



***REMOVED***
***REMOVED*** Wraps a value so metadata can be associated with it. You probably want
***REMOVED*** to use goog.storage.RichStorage.Wrapper.wrapIfNecessary to avoid multiple
***REMOVED*** embeddings.
***REMOVED***
***REMOVED*** @param {*} value The value to wrap.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.storage.RichStorage.Wrapper = function(value) {
  this[goog.storage.RichStorage.DATA_KEY] = value;
***REMOVED***


***REMOVED***
***REMOVED*** Convenience method for wrapping a value so metadata can be associated with
***REMOVED*** it. No-op if the value is already wrapped or is undefined.
***REMOVED***
***REMOVED*** @param {*} value The value to wrap.
***REMOVED*** @return {(!goog.storage.RichStorage.Wrapper|undefined)} The wrapper.
***REMOVED***
goog.storage.RichStorage.Wrapper.wrapIfNecessary = function(value) {
  if (!goog.isDef(value) || value instanceof goog.storage.RichStorage.Wrapper) {
    return***REMOVED*****REMOVED*** @type {(!goog.storage.RichStorage.Wrapper|undefined)}***REMOVED*** (value);
  }
  return new goog.storage.RichStorage.Wrapper(value);
***REMOVED***


***REMOVED***
***REMOVED*** Unwraps a value, any metadata is discarded (not returned). You might want to
***REMOVED*** use goog.storage.RichStorage.Wrapper.unwrapIfPossible to handle cases where
***REMOVED*** the wrapper is missing.
***REMOVED***
***REMOVED*** @param {!Object} wrapper The wrapper.
***REMOVED*** @return {*} The wrapped value.
***REMOVED***
goog.storage.RichStorage.Wrapper.unwrap = function(wrapper) {
  var value = wrapper[goog.storage.RichStorage.DATA_KEY];
  if (!goog.isDef(value)) {
    throw goog.storage.ErrorCode.INVALID_VALUE;
  }
  return value;
***REMOVED***


***REMOVED***
***REMOVED*** Convenience method for unwrapping a value. Returns undefined if the
***REMOVED*** wrapper is missing.
***REMOVED***
***REMOVED*** @param {(!Object|undefined)} wrapper The wrapper.
***REMOVED*** @return {*} The wrapped value or undefined.
***REMOVED***
goog.storage.RichStorage.Wrapper.unwrapIfPossible = function(wrapper) {
  if (!wrapper) {
    return undefined;
  }
  return goog.storage.RichStorage.Wrapper.unwrap(wrapper);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.storage.RichStorage.prototype.set = function(key, value) {
  goog.storage.RichStorage.base(this, 'set', key,
      goog.storage.RichStorage.Wrapper.wrapIfNecessary(value));
***REMOVED***


***REMOVED***
***REMOVED*** Get an item wrapper (the item and its metadata) from the storage.
***REMOVED***
***REMOVED*** WARNING: This returns an Object, which once used to be
***REMOVED*** goog.storage.RichStorage.Wrapper. This is due to the fact
***REMOVED*** that deserialized objects lose type information and it
***REMOVED*** is hard to do proper typecasting in JavaScript. Be sure
***REMOVED*** you know what you are doing when using the returned value.
***REMOVED***
***REMOVED*** @param {string} key The key to get.
***REMOVED*** @return {(!Object|undefined)} The wrapper, or undefined if not found.
***REMOVED***
goog.storage.RichStorage.prototype.getWrapper = function(key) {
  var wrapper = goog.storage.RichStorage.superClass_.get.call(this, key);
  if (!goog.isDef(wrapper) || wrapper instanceof Object) {
    return***REMOVED*****REMOVED*** @type {(!Object|undefined)}***REMOVED*** (wrapper);
  }
  throw goog.storage.ErrorCode.INVALID_VALUE;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.storage.RichStorage.prototype.get = function(key) {
  return goog.storage.RichStorage.Wrapper.unwrapIfPossible(
      this.getWrapper(key));
***REMOVED***
