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
***REMOVED*** @fileoverview Utilities used by goog.labs.userAgent tools. These functions
***REMOVED*** should not be used outside of goog.labs.userAgent.*.
***REMOVED***
***REMOVED*** @visibility {//closure/goog/bin/sizetests:__pkg__}
***REMOVED*** @visibility {//closure/goog/dom:__subpackages__}
***REMOVED*** @visibility {//closure/goog/style:__pkg__}
***REMOVED*** @visibility {//closure/goog/testing:__pkg__}
***REMOVED*** @visibility {//closure/goog/useragent:__subpackages__}
***REMOVED*** @visibility {//testing/puppet/modules:__pkg__}***REMOVED***
***REMOVED***
***REMOVED*** @author nnaze@google.com (Nathan Naze)
***REMOVED***

goog.provide('goog.labs.userAgent.util');

goog.require('goog.string');


***REMOVED***
***REMOVED*** Gets the native userAgent string from navigator if it exists.
***REMOVED*** If navigator or navigator.userAgent string is missing, returns an empty
***REMOVED*** string.
***REMOVED*** @return {string}
***REMOVED*** @private
***REMOVED***
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
  var navigator = goog.labs.userAgent.util.getNavigator_();
  if (navigator) {
    var userAgent = navigator.userAgent;
    if (userAgent) {
      return userAgent;
    }
  }
  return '';
***REMOVED***


***REMOVED***
***REMOVED*** Getter for the native navigator.
***REMOVED*** This is a separate function so it can be stubbed out in testing.
***REMOVED*** @return {Navigator}
***REMOVED*** @private
***REMOVED***
goog.labs.userAgent.util.getNavigator_ = function() {
  return goog.global.navigator;
***REMOVED***


***REMOVED***
***REMOVED*** A possible override for applications which wish to not check
***REMOVED*** navigator.userAgent but use a specified value for detection instead.
***REMOVED*** @private {string}
***REMOVED***
goog.labs.userAgent.util.userAgent_ =
    goog.labs.userAgent.util.getNativeUserAgentString_();


***REMOVED***
***REMOVED*** Applications may override browser detection on the built in
***REMOVED*** navigator.userAgent object by setting this string. Set to null to use the
***REMOVED*** browser object instead.
***REMOVED*** @param {?string=} opt_userAgent The User-Agent override.
***REMOVED***
goog.labs.userAgent.util.setUserAgent = function(opt_userAgent) {
  goog.labs.userAgent.util.userAgent_ = opt_userAgent ||
      goog.labs.userAgent.util.getNativeUserAgentString_();
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The user agent string.
***REMOVED***
goog.labs.userAgent.util.getUserAgent = function() {
  return goog.labs.userAgent.util.userAgent_;
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} str
***REMOVED*** @return {boolean} Whether the user agent contains the given string, ignoring
***REMOVED***     case.
***REMOVED***
goog.labs.userAgent.util.matchUserAgent = function(str) {
  var userAgent = goog.labs.userAgent.util.getUserAgent();
  return goog.string.contains(userAgent, str);
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} str
***REMOVED*** @return {boolean} Whether the user agent contains the given string.
***REMOVED***
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(str) {
  var userAgent = goog.labs.userAgent.util.getUserAgent();
  return goog.string.caseInsensitiveContains(userAgent, str);
***REMOVED***


***REMOVED***
***REMOVED*** Parses the user agent into tuples for each section.
***REMOVED*** @param {string} userAgent
***REMOVED*** @return {!Array.<!Array.<string>>} Tuples of key, version, and the contents
***REMOVED***     of the parenthetical.
***REMOVED***
goog.labs.userAgent.util.extractVersionTuples = function(userAgent) {
  // Matches each section of a user agent string.
  // Example UA:
  // Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us)
  // AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405
  // This has three version tuples: Mozilla, AppleWebKit, and Mobile.

  var versionRegExp = new RegExp(
      // Key. Note that a key may have a space.
      // (i.e. 'Mobile Safari' in 'Mobile Safari/5.0')
      '(\\w[\\w ]+)' +

      '/' +                // slash
      '([^\\s]+)' +        // version (i.e. '5.0b')
      '\\s*' +             // whitespace
      '(?:\\((.*?)\\))?',  // parenthetical info. parentheses not matched.
      'g');

  var data = [];
  var match;

  // Iterate and collect the version tuples.  Each iteration will be the
  // next regex match.
  while (match = versionRegExp.exec(userAgent)) {
    data.push([
      match[1],  // key
      match[2],  // value
      // || undefined as this is not undefined in IE7 and IE8
      match[3] || undefined  // info
    ]);
  }

  return data;
***REMOVED***

