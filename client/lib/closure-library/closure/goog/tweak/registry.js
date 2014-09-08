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
***REMOVED*** @fileoverview Definition for goog.tweak.Registry.
***REMOVED*** Most clients should not use this class directly, but instead use the API
***REMOVED*** defined in tweak.js. One possible use case for directly using TweakRegistry
***REMOVED*** is to register tweaks that are not known at compile time.
***REMOVED***
***REMOVED*** @author agrieve@google.com (Andrew Grieve)
***REMOVED***

goog.provide('goog.tweak.Registry');

goog.require('goog.asserts');
goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.tweak.BaseEntry');
goog.require('goog.uri.utils');



***REMOVED***
***REMOVED*** Singleton that manages all tweaks. This should be instantiated only from
***REMOVED*** goog.tweak.getRegistry().
***REMOVED*** @param {string} queryParams Value of window.location.search.
***REMOVED*** @param {!Object.<string|number|boolean>} compilerOverrides Default value
***REMOVED***     overrides set by the compiler.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.tweak.Registry = function(queryParams, compilerOverrides) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** A map of entry id -> entry object
  ***REMOVED*** @type {!Object.<!goog.tweak.BaseEntry>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.entryMap_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The map of query params to use when initializing entry settings.
  ***REMOVED*** @type {!Object.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.parsedQueryParams_ = goog.tweak.Registry.parseQueryParams(queryParams);

 ***REMOVED*****REMOVED***
  ***REMOVED*** List of callbacks to call when a new entry is registered.
  ***REMOVED*** @type {!Array.<!Function>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.onRegisterListeners_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** A map of entry ID -> default value override for overrides set by the
  ***REMOVED*** compiler.
  ***REMOVED*** @type {!Object.<string|number|boolean>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.compilerDefaultValueOverrides_ = compilerOverrides;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A map of entry ID -> default value override for overrides set by
  ***REMOVED*** goog.tweak.overrideDefaultValue().
  ***REMOVED*** @type {!Object.<string|number|boolean>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.defaultValueOverrides_ = {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** The logger for this class.
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @private
***REMOVED***
goog.tweak.Registry.prototype.logger_ =
    goog.log.getLogger('goog.tweak.Registry');


***REMOVED***
***REMOVED*** Simple parser for query params. Makes all keys lower-case.
***REMOVED*** @param {string} queryParams The part of the url between the ? and the #.
***REMOVED*** @return {!Object.<string>} map of key->value.
***REMOVED***
goog.tweak.Registry.parseQueryParams = function(queryParams) {
  // Strip off the leading ? and split on &.
  var parts = queryParams.substr(1).split('&');
  var ret = {***REMOVED***

  for (var i = 0, il = parts.length; i < il; ++i) {
    var entry = parts[i].split('=');
    if (entry[0]) {
      ret[goog.string.urlDecode(entry[0]).toLowerCase()] =
          goog.string.urlDecode(entry[1] || '');
    }
  }
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Registers the given tweak setting/action.
***REMOVED*** @param {goog.tweak.BaseEntry} entry The entry.
***REMOVED***
goog.tweak.Registry.prototype.register = function(entry) {
  var id = entry.getId();
  var oldBaseEntry = this.entryMap_[id];
  if (oldBaseEntry) {
    if (oldBaseEntry == entry) {
      goog.log.warning(this.logger_, 'Tweak entry registered twice: ' + id);
      return;
    }
    goog.asserts.fail(
        'Tweak entry registered twice and with different types: ' + id);
  }

  // Check for a default value override, either from compiler flags or from a
  // call to overrideDefaultValue().
  var defaultValueOverride = (id in this.compilerDefaultValueOverrides_) ?
      this.compilerDefaultValueOverrides_[id] : this.defaultValueOverrides_[id];
  if (goog.isDef(defaultValueOverride)) {
    goog.asserts.assertInstanceof(entry, goog.tweak.BasePrimitiveSetting,
        'Cannot set the default value of non-primitive setting %s',
        entry.label);
    entry.setDefaultValue(defaultValueOverride);
  }

  // Set its value from the query params.
  if (entry instanceof goog.tweak.BaseSetting) {
    if (entry.getParamName()) {
      entry.setInitialQueryParamValue(
          this.parsedQueryParams_[entry.getParamName()]);
    }
  }

  this.entryMap_[id] = entry;
  // Call all listeners.
  for (var i = 0, callback; callback = this.onRegisterListeners_[i]; ++i) {
    callback(entry);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds a callback to be called whenever a new tweak is added.
***REMOVED*** @param {!Function} func The callback.
***REMOVED***
goog.tweak.Registry.prototype.addOnRegisterListener = function(func) {
  this.onRegisterListeners_.push(func);
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} id The unique string that identifies this entry.
***REMOVED*** @return {boolean} Whether a tweak with the given ID is registered.
***REMOVED***
goog.tweak.Registry.prototype.hasEntry = function(id) {
  return id in this.entryMap_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the BaseEntry with the given ID. Asserts if it does not exists.
***REMOVED*** @param {string} id The unique string that identifies this entry.
***REMOVED*** @return {!goog.tweak.BaseEntry} The entry.
***REMOVED***
goog.tweak.Registry.prototype.getEntry = function(id) {
  var ret = this.entryMap_[id];
  goog.asserts.assert(ret, 'Tweak not registered: %s', id);
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the boolean setting with the given ID. Asserts if the ID does not
***REMOVED*** refer to a registered entry or if it refers to one of the wrong type.
***REMOVED*** @param {string} id The unique string that identifies this entry.
***REMOVED*** @return {!goog.tweak.BooleanSetting} The entry.
***REMOVED***
goog.tweak.Registry.prototype.getBooleanSetting = function(id) {
  var entry = this.getEntry(id);
  goog.asserts.assertInstanceof(entry, goog.tweak.BooleanSetting,
      'getBooleanSetting called on wrong type of BaseSetting');
  return***REMOVED*****REMOVED*** @type {!goog.tweak.BooleanSetting}***REMOVED*** (entry);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the string setting with the given ID. Asserts if the ID does not
***REMOVED*** refer to a registered entry or if it refers to one of the wrong type.
***REMOVED*** @param {string} id The unique string that identifies this entry.
***REMOVED*** @return {!goog.tweak.StringSetting} The entry.
***REMOVED***
goog.tweak.Registry.prototype.getStringSetting = function(id) {
  var entry = this.getEntry(id);
  goog.asserts.assertInstanceof(entry, goog.tweak.StringSetting,
      'getStringSetting called on wrong type of BaseSetting');
  return***REMOVED*****REMOVED*** @type {!goog.tweak.StringSetting}***REMOVED*** (entry);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the numeric setting with the given ID. Asserts if the ID does not
***REMOVED*** refer to a registered entry or if it refers to one of the wrong type.
***REMOVED*** @param {string} id The unique string that identifies this entry.
***REMOVED*** @return {!goog.tweak.NumericSetting} The entry.
***REMOVED***
goog.tweak.Registry.prototype.getNumericSetting = function(id) {
  var entry = this.getEntry(id);
  goog.asserts.assertInstanceof(entry, goog.tweak.NumericSetting,
      'getNumericSetting called on wrong type of BaseSetting');
  return***REMOVED*****REMOVED*** @type {!goog.tweak.NumericSetting}***REMOVED*** (entry);
***REMOVED***


***REMOVED***
***REMOVED*** Creates and returns an array of all BaseSetting objects with an associted
***REMOVED*** query parameter.
***REMOVED*** @param {boolean} excludeChildEntries Exclude BooleanInGroupSettings.
***REMOVED*** @param {boolean} excludeNonSettings Exclude entries that are not subclasses
***REMOVED***     of BaseSetting.
***REMOVED*** @return {!Array.<!goog.tweak.BaseSetting>} The settings.
***REMOVED***
goog.tweak.Registry.prototype.extractEntries =
    function(excludeChildEntries, excludeNonSettings) {
  var entries = [];
  for (var id in this.entryMap_) {
    var entry = this.entryMap_[id];
    if (entry instanceof goog.tweak.BaseSetting) {
      if (excludeChildEntries && !entry.getParamName()) {
        continue;
      }
    } else if (excludeNonSettings) {
      continue;
    }
    entries.push(entry);
  }
  return entries;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the query part of the URL that will apply all set tweaks.
***REMOVED*** @param {string=} opt_existingSearchStr The part of the url between the ? and
***REMOVED***     the #. Uses window.location.search if not given.
***REMOVED*** @return {string} The query string.
***REMOVED***
goog.tweak.Registry.prototype.makeUrlQuery =
    function(opt_existingSearchStr) {
  var existingParams = opt_existingSearchStr == undefined ?
      window.location.search : opt_existingSearchStr;

  var sortedEntries = this.extractEntries(true /* excludeChildEntries***REMOVED***,
                                          true /* excludeNonSettings***REMOVED***);
  // Sort the params so that the urlQuery has stable ordering.
  sortedEntries.sort(function(a, b) {
    return goog.array.defaultCompare(a.getParamName(), b.getParamName());
  });

  // Add all values that are not set to their defaults.
  var keysAndValues = [];
  for (var i = 0, entry; entry = sortedEntries[i]; ++i) {
    var encodedValue = entry.getNewValueEncoded();
    if (encodedValue != null) {
      keysAndValues.push(entry.getParamName(), encodedValue);
    }
    // Strip all tweak query params from the existing query string. This will
    // make the final query string contain only the tweak settings that are set
    // to their non-default values and also maintain non-tweak related query
    // parameters.
    existingParams = goog.uri.utils.removeParam(existingParams,
        encodeURIComponent(***REMOVED*** @type {string}***REMOVED*** (entry.getParamName())));
  }

  var tweakParams = goog.uri.utils.buildQueryData(keysAndValues);
  // Decode spaces and commas in order to make the URL more readable.
  tweakParams = tweakParams.replace(/%2C/g, ',').replace(/%20/g, '+');
  return !tweakParams ? existingParams :
      existingParams ? existingParams + '&' + tweakParams :
      '?' + tweakParams;
***REMOVED***


***REMOVED***
***REMOVED*** Sets a default value to use for the given tweak instead of the one passed
***REMOVED*** to the register* function. This function must be called before the tweak is
***REMOVED*** registered.
***REMOVED*** @param {string} id The unique string that identifies the entry.
***REMOVED*** @param {string|number|boolean} value The replacement value to be used as the
***REMOVED***     default value for the setting.
***REMOVED***
goog.tweak.Registry.prototype.overrideDefaultValue = function(id, value) {
  goog.asserts.assert(!this.hasEntry(id),
      'goog.tweak.overrideDefaultValue must be called before the tweak is ' +
      'registered. Tweak: %s', id);
  this.defaultValueOverrides_[id] = value;
***REMOVED***

