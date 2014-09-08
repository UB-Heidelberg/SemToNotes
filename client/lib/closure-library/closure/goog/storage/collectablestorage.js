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
***REMOVED*** @fileoverview Provides a convenient API for data persistence with data
***REMOVED*** expiration and user-initiated expired key collection.
***REMOVED***
***REMOVED***

goog.provide('goog.storage.CollectableStorage');

goog.require('goog.array');
goog.require('goog.iter');
goog.require('goog.storage.ErrorCode');
goog.require('goog.storage.ExpiringStorage');
goog.require('goog.storage.RichStorage');



***REMOVED***
***REMOVED*** Provides a storage with expirning keys and a collection method.
***REMOVED***
***REMOVED*** @param {!goog.storage.mechanism.IterableMechanism} mechanism The underlying
***REMOVED***     storage mechanism.
***REMOVED***
***REMOVED*** @extends {goog.storage.ExpiringStorage}
***REMOVED***
goog.storage.CollectableStorage = function(mechanism) {
  goog.storage.CollectableStorage.base(this, 'constructor', mechanism);
***REMOVED***
goog.inherits(goog.storage.CollectableStorage, goog.storage.ExpiringStorage);


***REMOVED***
***REMOVED*** Iterate over keys and returns those that expired.
***REMOVED***
***REMOVED*** @param {goog.iter.Iterable} keys keys to iterate over.
***REMOVED*** @param {boolean=} opt_strict Also return invalid keys.
***REMOVED*** @return {!Array.<string>} Keys of values that expired.
***REMOVED*** @private
***REMOVED***
goog.storage.CollectableStorage.prototype.getExpiredKeys_ =
    function(keys, opt_strict) {
  var keysToRemove = [];
  goog.iter.forEach(keys, function(key) {
    // Get the wrapper.
    var wrapper;
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      wrapper = goog.storage.CollectableStorage.prototype.getWrapper.call(
          this, key, true);
    } catch (ex) {
      if (ex == goog.storage.ErrorCode.INVALID_VALUE) {
        // Bad wrappers are removed in strict mode.
        if (opt_strict) {
          keysToRemove.push(key);
        }
        // Skip over bad wrappers and continue.
        return;
      }
      // Unknown error, escalate.
      throw ex;
    }
    if (!goog.isDef(wrapper)) {
      // A value for a given key is no longer available. Clean it up.
      keysToRemove.push(key);
      return;
    }
    // Remove expired objects.
    if (goog.storage.ExpiringStorage.isExpired(wrapper)) {
      keysToRemove.push(key);
      // Continue with the next key.
      return;
    }
    // Objects which can't be decoded are removed in strict mode.
    if (opt_strict) {
     ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
      try {
        goog.storage.RichStorage.Wrapper.unwrap(wrapper);
      } catch (ex) {
        if (ex == goog.storage.ErrorCode.INVALID_VALUE) {
          keysToRemove.push(key);
          // Skip over bad wrappers and continue.
          return;
        }
        // Unknown error, escalate.
        throw ex;
      }
    }
  }, this);
  return keysToRemove;
***REMOVED***


***REMOVED***
***REMOVED*** Cleans up the storage by removing expired keys.
***REMOVED***
***REMOVED*** @param {Array.<string>} keys List of all keys.
***REMOVED*** @param {boolean=} opt_strict Also remove invalid keys.
***REMOVED*** @return {!Array.<string>} a list of expired keys.
***REMOVED*** @protected
***REMOVED***
goog.storage.CollectableStorage.prototype.collectInternal = function(
    keys, opt_strict) {
  var keysToRemove = this.getExpiredKeys_(keys, opt_strict);
  goog.array.forEach(keysToRemove, function(key) {
    goog.storage.CollectableStorage.prototype.remove.call(this, key);
  }, this);
  return keysToRemove;
***REMOVED***


***REMOVED***
***REMOVED*** Cleans up the storage by removing expired keys.
***REMOVED***
***REMOVED*** @param {boolean=} opt_strict Also remove invalid keys.
***REMOVED***
goog.storage.CollectableStorage.prototype.collect = function(opt_strict) {
  this.collectInternal(this.mechanism.__iterator__(true), opt_strict);
***REMOVED***
