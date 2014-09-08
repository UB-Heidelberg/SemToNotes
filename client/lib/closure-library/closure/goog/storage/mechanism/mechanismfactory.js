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
***REMOVED*** @fileoverview Provides factory methods for selecting the best storage
***REMOVED*** mechanism, depending on availability and needs.
***REMOVED***
***REMOVED***

goog.provide('goog.storage.mechanism.mechanismfactory');

goog.require('goog.storage.mechanism.HTML5LocalStorage');
goog.require('goog.storage.mechanism.HTML5SessionStorage');
goog.require('goog.storage.mechanism.IEUserData');
goog.require('goog.storage.mechanism.IterableMechanism');
goog.require('goog.storage.mechanism.PrefixedMechanism');


***REMOVED***
***REMOVED*** The key to shared userData storage.
***REMOVED*** @type {string}
***REMOVED***
goog.storage.mechanism.mechanismfactory.USER_DATA_SHARED_KEY =
    'UserDataSharedStore';


***REMOVED***
***REMOVED*** Returns the best local storage mechanism, or null if unavailable.
***REMOVED*** Local storage means that the database is placed on user's computer.
***REMOVED*** The key-value database is normally shared between all the code paths
***REMOVED*** that request it, so using an optional namespace is recommended. This
***REMOVED*** provides separation and makes key collisions unlikely.
***REMOVED***
***REMOVED*** @param {string=} opt_namespace Restricts the visibility to given namespace.
***REMOVED*** @return {goog.storage.mechanism.IterableMechanism} Created mechanism or null.
***REMOVED***
goog.storage.mechanism.mechanismfactory.create = function(opt_namespace) {
  return goog.storage.mechanism.mechanismfactory.createHTML5LocalStorage(
      opt_namespace) ||
      goog.storage.mechanism.mechanismfactory.createIEUserData(opt_namespace);
***REMOVED***


***REMOVED***
***REMOVED*** Returns an HTML5 local storage mechanism, or null if unavailable.
***REMOVED*** Since the HTML5 local storage does not support namespaces natively,
***REMOVED*** and the key-value database is shared between all the code paths
***REMOVED*** that request it, it is recommended that an optional namespace is
***REMOVED*** used to provide key separation employing a prefix.
***REMOVED***
***REMOVED*** @param {string=} opt_namespace Restricts the visibility to given namespace.
***REMOVED*** @return {goog.storage.mechanism.IterableMechanism} Created mechanism or null.
***REMOVED***
goog.storage.mechanism.mechanismfactory.createHTML5LocalStorage = function(
    opt_namespace) {
  var storage = new goog.storage.mechanism.HTML5LocalStorage();
  if (storage.isAvailable()) {
    return opt_namespace ? new goog.storage.mechanism.PrefixedMechanism(
        storage, opt_namespace) : storage;
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an HTML5 session storage mechanism, or null if unavailable.
***REMOVED*** Since the HTML5 session storage does not support namespaces natively,
***REMOVED*** and the key-value database is shared between all the code paths
***REMOVED*** that request it, it is recommended that an optional namespace is
***REMOVED*** used to provide key separation employing a prefix.
***REMOVED***
***REMOVED*** @param {string=} opt_namespace Restricts the visibility to given namespace.
***REMOVED*** @return {goog.storage.mechanism.IterableMechanism} Created mechanism or null.
***REMOVED***
goog.storage.mechanism.mechanismfactory.createHTML5SessionStorage = function(
    opt_namespace) {
  var storage = new goog.storage.mechanism.HTML5SessionStorage();
  if (storage.isAvailable()) {
    return opt_namespace ? new goog.storage.mechanism.PrefixedMechanism(
        storage, opt_namespace) : storage;
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an IE userData local storage mechanism, or null if unavailable.
***REMOVED*** Using an optional namespace is recommended to provide separation and
***REMOVED*** avoid key collisions.
***REMOVED***
***REMOVED*** @param {string=} opt_namespace Restricts the visibility to given namespace.
***REMOVED*** @return {goog.storage.mechanism.IterableMechanism} Created mechanism or null.
***REMOVED***
goog.storage.mechanism.mechanismfactory.createIEUserData = function(
    opt_namespace) {
  var storage = new goog.storage.mechanism.IEUserData(opt_namespace ||
      goog.storage.mechanism.mechanismfactory.USER_DATA_SHARED_KEY);
  if (storage.isAvailable()) {
    return storage;
  }
  return null;
***REMOVED***
