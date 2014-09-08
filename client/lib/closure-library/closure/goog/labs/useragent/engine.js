// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Closure user agent detection.
***REMOVED*** @see http://en.wikipedia.org/wiki/User_agent
***REMOVED*** For more information on browser brand, platform, or device see the other
***REMOVED*** sub-namespaces in goog.labs.userAgent (browser, platform, and device).
***REMOVED***
***REMOVED***

goog.provide('goog.labs.userAgent.engine');

goog.require('goog.array');
goog.require('goog.labs.userAgent.util');
goog.require('goog.string');


***REMOVED***
***REMOVED*** @return {boolean} Whether the rendering engine is Presto.
***REMOVED***
goog.labs.userAgent.engine.isPresto = function() {
  return goog.labs.userAgent.util.matchUserAgent('Presto');
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the rendering engine is Trident.
***REMOVED***
goog.labs.userAgent.engine.isTrident = function() {
  // IE only started including the Trident token in IE8.
  return goog.labs.userAgent.util.matchUserAgent('Trident') ||
      goog.labs.userAgent.util.matchUserAgent('MSIE');
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the rendering engine is WebKit.
***REMOVED***
goog.labs.userAgent.engine.isWebKit = function() {
  return goog.labs.userAgent.util.matchUserAgentIgnoreCase('WebKit');
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the rendering engine is Gecko.
***REMOVED***
goog.labs.userAgent.engine.isGecko = function() {
  return goog.labs.userAgent.util.matchUserAgent('Gecko') &&
      !goog.labs.userAgent.engine.isWebKit() &&
      !goog.labs.userAgent.engine.isTrident();
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The rendering engine's version or empty string if version
***REMOVED***     can't be determined.
***REMOVED***
goog.labs.userAgent.engine.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  if (userAgentString) {
    var tuples = goog.labs.userAgent.util.extractVersionTuples(
        userAgentString);

    var engineTuple = tuples[1];
    if (engineTuple) {
      // In Gecko, the version string is either in the browser info or the
      // Firefox version.  See Gecko user agent string reference:
      // http://goo.gl/mULqa
      if (engineTuple[0] == 'Gecko') {
        return goog.labs.userAgent.engine.getVersionForKey_(
            tuples, 'Firefox');
      }

      return engineTuple[1];
    }

    // IE has only one version identifier, and the Trident version is
    // specified in the parenthetical.
    var browserTuple = tuples[0];
    var info;
    if (browserTuple && (info = browserTuple[2])) {
      var match = /Trident\/([^\s;]+)/.exec(info);
      if (match) {
        return match[1];
      }
    }
  }
  return '';
***REMOVED***


***REMOVED***
***REMOVED*** @param {string|number} version The version to check.
***REMOVED*** @return {boolean} Whether the rendering engine version is higher or the same
***REMOVED***     as the given version.
***REMOVED***
goog.labs.userAgent.engine.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(),
                                     version) >= 0;
***REMOVED***


***REMOVED***
***REMOVED*** @param {!Array.<!Array.<string>>} tuples Version tuples.
***REMOVED*** @param {string} key The key to look for.
***REMOVED*** @return {string} The version string of the given key, if present.
***REMOVED***     Otherwise, the empty string.
***REMOVED*** @private
***REMOVED***
goog.labs.userAgent.engine.getVersionForKey_ = function(tuples, key) {
  // TODO(nnaze): Move to util if useful elsewhere.

  var pair = goog.array.find(tuples, function(pair) {
    return key == pair[0];
  });

  return pair && pair[1] || '';
***REMOVED***
