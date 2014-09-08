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
***REMOVED*** @fileoverview Interface for storing, retieving and scanning data using some
***REMOVED*** persistence mechanism.
***REMOVED***
***REMOVED***

goog.provide('goog.storage.mechanism.IterableMechanism');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.iter');
goog.require('goog.iter.Iterator');
goog.require('goog.storage.mechanism.Mechanism');



***REMOVED***
***REMOVED*** Interface for all iterable storage mechanisms.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.storage.mechanism.Mechanism}
***REMOVED***
goog.storage.mechanism.IterableMechanism = function() {
  goog.storage.mechanism.IterableMechanism.base(this, 'constructor');
***REMOVED***
goog.inherits(goog.storage.mechanism.IterableMechanism,
              goog.storage.mechanism.Mechanism);


***REMOVED***
***REMOVED*** Get the number of stored key-value pairs.
***REMOVED***
***REMOVED*** Could be overridden in a subclass, as the default implementation is not very
***REMOVED*** efficient - it iterates over all keys.
***REMOVED***
***REMOVED*** @return {number} Number of stored elements.
***REMOVED***
goog.storage.mechanism.IterableMechanism.prototype.getCount = function() {
  var count = 0;
  goog.iter.forEach(this.__iterator__(true), function(key) {
    goog.asserts.assertString(key);
    count++;
  });
  return count;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an iterator that iterates over the elements in the storage. Will
***REMOVED*** throw goog.iter.StopIteration after the last element.
***REMOVED***
***REMOVED*** @param {boolean=} opt_keys True to iterate over the keys. False to iterate
***REMOVED***     over the values.  The default value is false.
***REMOVED*** @return {!goog.iter.Iterator} The iterator.
***REMOVED***
goog.storage.mechanism.IterableMechanism.prototype.__iterator__ =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Remove all key-value pairs.
***REMOVED***
***REMOVED*** Could be overridden in a subclass, as the default implementation is not very
***REMOVED*** efficient - it iterates over all keys.
***REMOVED***
goog.storage.mechanism.IterableMechanism.prototype.clear = function() {
  var keys = goog.iter.toArray(this.__iterator__(true));
  var selfObj = this;
  goog.array.forEach(keys, function(key) {
    selfObj.remove(key);
  });
***REMOVED***
