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
***REMOVED*** @fileoverview Utilities to create arbitrary values of goog.html types for
***REMOVED*** testing purposes. These utility methods perform no validation, and the
***REMOVED*** resulting instances may violate type contracts.
***REMOVED***
***REMOVED*** These methods are useful when types are constructed in a manner where using
***REMOVED*** the production API is too inconvenient. Please do use the production API
***REMOVED*** whenever possible; there is value in having tests reflect common usage and it
***REMOVED*** avoids, by design, non-contract complying instances from being created.
***REMOVED***


goog.provide('goog.html.testing');
goog.setTestOnly();

goog.require('goog.html.SafeHtml');
goog.require('goog.html.SafeStyle');
goog.require('goog.html.SafeUrl');
goog.require('goog.html.TrustedResourceUrl');


***REMOVED***
***REMOVED*** Creates a SafeHtml wrapping the given value. No validation is performed.
***REMOVED***
***REMOVED*** This function is for use in tests only and must never be used in production
***REMOVED*** code.
***REMOVED***
***REMOVED*** @param {string} html The string to wrap into a SafeHtml.
***REMOVED*** @param {?goog.i18n.bidi.Dir=} opt_dir The optional directionality of the
***REMOVED***     SafeHtml to be constructed. A null or undefined value signifies an
***REMOVED***     unknown directionality.
***REMOVED*** @return {!goog.html.SafeHtml}
***REMOVED*** @suppress {visibility} For access to SafeHtml.create...  Note that this
***REMOVED***     use is appropriate since this method is intended to be "package private"
***REMOVED***     within goog.html.  DO NOT call SafeHtml.create... from outside this
***REMOVED***     package; use appropriate wrappers instead.
***REMOVED***
goog.html.testing.newSafeHtmlForTest = function(html, opt_dir) {
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(
      html, (opt_dir == undefined ? null : opt_dir));
***REMOVED***


***REMOVED***
***REMOVED*** Creates a SafeStyle wrapping the given value. No validation is performed.
***REMOVED***
***REMOVED*** This function is for use in tests only and must never be used in production
***REMOVED*** code.
***REMOVED***
***REMOVED*** @param {string} style String to wrap into a SafeStyle.
***REMOVED*** @return {!goog.html.SafeStyle}
***REMOVED*** @suppress {visibility} For access to SafeStyle.create...  Note that this
***REMOVED***     use is appropriate since this method is intended to be "package private"
***REMOVED***     within goog.html.  DO NOT call SafeStyle.create... from outside this
***REMOVED***     package; use appropriate wrappers instead.
***REMOVED***
goog.html.testing.newSafeStyleForTest = function(style) {
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_(
      style);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a SafeUrl wrapping the given value. No validation is performed.
***REMOVED***
***REMOVED*** This function is for use in tests only and must never be used in production
***REMOVED*** code.
***REMOVED***
***REMOVED*** @param {string} url String to wrap into a SafeUrl.
***REMOVED*** @return {!goog.html.SafeUrl}
***REMOVED*** @suppress {visibility} For access to SafeUrl.create...  Note that this
***REMOVED***     use is appropriate since this method is intended to be "package private"
***REMOVED***     within goog.html.  DO NOT call SafeUrl.create... from outside this
***REMOVED***     package; use appropriate wrappers instead.
***REMOVED***
goog.html.testing.newSafeUrlForTest = function(url) {
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse_(url);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a TrustedResourceUrl wrapping the given value. No validation is
***REMOVED*** performed.
***REMOVED***
***REMOVED*** This function is for use in tests only and must never be used in production
***REMOVED*** code.
***REMOVED***
***REMOVED*** @param {string} url String to wrap into a TrustedResourceUrl.
***REMOVED*** @return {!goog.html.TrustedResourceUrl}
***REMOVED*** @suppress {visibility} For access to TrustedResourceUrl.create...  Note that
***REMOVED***     this use is appropriate since this method is intended to be
***REMOVED***     "package private" within goog.html.  DO NOT call
***REMOVED***     TrustedResourceUrl.create... from outside this package; use appropriate
***REMOVED***     wrappers instead.
***REMOVED***
goog.html.testing.newTrustedResourceUrlForTest = function(url) {
  return goog.html.TrustedResourceUrl.
      createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse_(url);
***REMOVED***
