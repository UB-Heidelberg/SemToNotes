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
***REMOVED*** @fileoverview Provides a convenient API for data persistence with expiration.
***REMOVED***
***REMOVED***

goog.provide('goog.storage.ExpiringStorage');

goog.require('goog.storage.RichStorage');
goog.require('goog.storage.RichStorage.Wrapper');
goog.require('goog.storage.mechanism.Mechanism');



***REMOVED***
***REMOVED*** Provides a storage with expirning keys.
***REMOVED***
***REMOVED*** @param {!goog.storage.mechanism.Mechanism} mechanism The underlying
***REMOVED***     storage mechanism.
***REMOVED***
***REMOVED*** @extends {goog.storage.RichStorage}
***REMOVED***
goog.storage.ExpiringStorage = function(mechanism) {
  goog.base(this, mechanism);
***REMOVED***
goog.inherits(goog.storage.ExpiringStorage, goog.storage.RichStorage);


***REMOVED***
***REMOVED*** Metadata key under which the expiration time is stored.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @protected
***REMOVED***
goog.storage.ExpiringStorage.EXPIRATION_TIME_KEY = 'expiration';


***REMOVED***
***REMOVED*** Metadata key under which the creation time is stored.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @protected
***REMOVED***
goog.storage.ExpiringStorage.CREATION_TIME_KEY = 'creation';


***REMOVED***
***REMOVED*** Returns the wrapper creation time.
***REMOVED***
***REMOVED*** @param {!Object} wrapper The wrapper.
***REMOVED*** @return {number|undefined} Wrapper creation time.
***REMOVED***
goog.storage.ExpiringStorage.getCreationTime = function(wrapper) {
  return wrapper[goog.storage.ExpiringStorage.CREATION_TIME_KEY];
***REMOVED***


***REMOVED***
***REMOVED*** Returns the wrapper expiration time.
***REMOVED***
***REMOVED*** @param {!Object} wrapper The wrapper.
***REMOVED*** @return {number|undefined} Wrapper expiration time.
***REMOVED***
goog.storage.ExpiringStorage.getExpirationTime = function(wrapper) {
  return wrapper[goog.storage.ExpiringStorage.EXPIRATION_TIME_KEY];
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the data item has expired.
***REMOVED***
***REMOVED*** @param {!Object} wrapper The wrapper.
***REMOVED*** @return {boolean} True if the item has expired.
***REMOVED***
goog.storage.ExpiringStorage.isExpired = function(wrapper) {
  var creation = goog.storage.ExpiringStorage.getCreationTime(wrapper);
  var expiration = goog.storage.ExpiringStorage.getExpirationTime(wrapper);
  return !!expiration && expiration < goog.now() ||
         !!creation && creation > goog.now();
***REMOVED***


***REMOVED***
***REMOVED*** Set an item in the storage.
***REMOVED***
***REMOVED*** @param {string} key The key to set.
***REMOVED*** @param {*} value The value to serialize to a string and save.
***REMOVED*** @param {number=} opt_expiration The number of miliseconds since epoch
***REMOVED***     (as in goog.now()) when the value is to expire. If the expiration
***REMOVED***     time is not provided, the value will persist as long as possible.
***REMOVED*** @override
***REMOVED***
goog.storage.ExpiringStorage.prototype.set = function(
    key, value, opt_expiration) {
  var wrapper = goog.storage.RichStorage.Wrapper.wrapIfNecessary(value);
  if (wrapper) {
    if (opt_expiration) {
      if (opt_expiration < goog.now()) {
        goog.storage.ExpiringStorage.prototype.remove.call(this, key);
        return;
      }
      wrapper[goog.storage.ExpiringStorage.EXPIRATION_TIME_KEY] =
          opt_expiration;
    }
    wrapper[goog.storage.ExpiringStorage.CREATION_TIME_KEY] = goog.now();
  }
  goog.base(this, 'set', key, wrapper);
***REMOVED***


***REMOVED***
***REMOVED*** Get an item wrapper (the item and its metadata) from the storage.
***REMOVED***
***REMOVED*** @param {string} key The key to get.
***REMOVED*** @param {boolean=} opt_expired If true, return expired wrappers as well.
***REMOVED*** @return {(!Object|undefined)} The wrapper, or undefined if not found.
***REMOVED*** @override
***REMOVED***
goog.storage.ExpiringStorage.prototype.getWrapper = function(key, opt_expired) {
  var wrapper = goog.base(this, 'getWrapper', key);
  if (!wrapper) {
    return undefined;
  }
  if (!opt_expired && goog.storage.ExpiringStorage.isExpired(wrapper)) {
    goog.storage.ExpiringStorage.prototype.remove.call(this, key);
    return undefined;
  }
  return wrapper;
***REMOVED***
