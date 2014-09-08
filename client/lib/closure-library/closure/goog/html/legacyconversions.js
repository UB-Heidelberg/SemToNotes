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
***REMOVED*** @fileoverview Conversions from plain string to goog.html types for use in
***REMOVED*** legacy APIs that do not use goog.html types.
***REMOVED***
***REMOVED*** This file provides conversions to create values of goog.html types from plain
***REMOVED*** strings.  These conversions are intended for use in legacy APIs that consume
***REMOVED*** HTML in the form of plain string types, but whose implementations use
***REMOVED*** goog.html types internally (and expose such types in an augmented, HTML-type-
***REMOVED*** safe API).
***REMOVED***
***REMOVED*** IMPORTANT: No new code should use the conversion functions in this file.
***REMOVED***
***REMOVED*** The conversion functions in this file are guarded with global flag
***REMOVED*** (goog.html.legacyconversions.ALLOW_LEGACY_CONVERSIONS). If set to false, it
***REMOVED*** effectively "locks in" an entire application to only use HTML-type-safe APIs.
***REMOVED***
***REMOVED*** Intended use of the functions in this file are as follows:
***REMOVED***
***REMOVED*** Many Closure and application-specific classes expose methods that consume
***REMOVED*** values that in the class' implementation are forwarded to DOM APIs that can
***REMOVED*** result in security vulnerabilities.  For example, goog.ui.Dialog's setContent
***REMOVED*** method consumes a string that is assigned to an element's innerHTML property;
***REMOVED*** if this string contains untrusted (attacker-controlled) data, this can result
***REMOVED*** in a cross-site-scripting vulnerability.
***REMOVED***
***REMOVED*** Widgets such as goog.ui.Dialog are being augmented to expose safe APIs
***REMOVED*** expressed in terms of goog.html types.  For instance, goog.ui.Dialog has a
***REMOVED*** method setSafeHtmlContent that consumes an object of type goog.html.SafeHtml,
***REMOVED*** a type whose contract guarantees that its value is safe to use in HTML
***REMOVED*** context, i.e. can be safely assigned to .innerHTML. An application that only
***REMOVED*** uses this API is forced to only supply values of this type, i.e. values that
***REMOVED*** are safe.
***REMOVED***
***REMOVED*** However, the legacy method setContent cannot (for the time being) be removed
***REMOVED*** from goog.ui.Dialog, due to a large number of existing callers.  The
***REMOVED*** implementation of goog.ui.Dialog has been refactored to use
***REMOVED*** goog.html.SafeHtml throughout.  This in turn requires that the value consumed
***REMOVED*** by its setContent method is converted to goog.html.SafeHtml in an unchecked
***REMOVED*** conversion. The conversion function is provided by this file:
***REMOVED*** goog.html.legacyconversions.safeHtmlFromString.
***REMOVED***
***REMOVED*** Note that the semantics of the conversions in goog.html.legacyconversions are
***REMOVED*** very different from the ones provided by goog.html.uncheckedconversions:  The
***REMOVED*** latter are for use in code where it has been established through manual
***REMOVED*** security review that the value produced by a piece of code must always
***REMOVED*** satisfy the SafeHtml contract (e.g., the output of a secure HTML sanitizer).
***REMOVED*** In uses of goog.html.legacyconversions, this guarantee is not given -- the
***REMOVED*** value in question originates in unreviewed legacy code and there is no
***REMOVED*** guarantee that it satisfies the SafeHtml contract.
***REMOVED***
***REMOVED*** To establish correctness with confidence, application code should be
***REMOVED*** refactored to use SafeHtml instead of plain string to represent HTML markup,
***REMOVED*** and to use goog.html-typed APIs (e.g., goog.ui.Dialog#setSafeHtmlContent
***REMOVED*** instead of goog.ui.Dialog#setContent).
***REMOVED***
***REMOVED*** To prevent introduction of new vulnerabilities, application owners can
***REMOVED*** effectively disable unsafe legacy APIs by compiling with the define
***REMOVED*** goog.html.legacyconversions.ALLOW_LEGACY_CONVERSIONS set to false.  When
***REMOVED*** set, this define causes the conversion methods in this file to
***REMOVED*** unconditionally throw an exception.
***REMOVED***
***REMOVED*** Note that new code should always be compiled with
***REMOVED*** ALLOW_LEGACY_CONVERSIONS=false.  At some future point, the default for this
***REMOVED*** define may change to false.
***REMOVED***


goog.provide('goog.html.legacyconversions');

goog.require('goog.html.SafeHtml');
goog.require('goog.html.SafeUrl');
goog.require('goog.html.TrustedResourceUrl');


***REMOVED***
***REMOVED*** @define {boolean} Whether conversion from string to goog.html types for
***REMOVED*** legacy API purposes is permitted.
***REMOVED***
***REMOVED*** If false, the conversion functions in this file unconditionally throw an
***REMOVED*** exception.
***REMOVED***
goog.define('goog.html.legacyconversions.ALLOW_LEGACY_CONVERSIONS', true);


***REMOVED***
***REMOVED*** Performs an "unchecked conversion" from string to SafeHtml for legacy API
***REMOVED*** purposes.
***REMOVED***
***REMOVED*** Unchecked conversion will not proceed if ALLOW_LEGACY_CONVERSIONS is false,
***REMOVED*** and instead this function unconditionally throws an exception.
***REMOVED***
***REMOVED*** @param {string} html A string to be converted to SafeHtml.
***REMOVED*** @return {!goog.html.SafeHtml} The value of html, wrapped in a SafeHtml
***REMOVED***     object.
***REMOVED***
goog.html.legacyconversions.safeHtmlFromString = function(html) {
  goog.html.legacyconversions.throwIfConversionDisallowed_();
  return goog.html.legacyconversions.
      createSafeHtmlSecurityPrivateDoNotAccessOrElse_(html);
***REMOVED***


***REMOVED***
***REMOVED*** Performs an "unchecked conversion" from string to TrustedResourceUrl for
***REMOVED*** legacy API purposes.
***REMOVED***
***REMOVED*** Unchecked conversion will not proceed if ALLOW_LEGACY_CONVERSIONS is false,
***REMOVED*** and instead this function unconditionally throws an exception.
***REMOVED***
***REMOVED*** @param {string} url A string to be converted to TrustedResourceUrl.
***REMOVED*** @return {!goog.html.TrustedResourceUrl} The value of url, wrapped in a
***REMOVED***     TrustedResourceUrl object.
***REMOVED***
goog.html.legacyconversions.trustedResourceUrlFromString = function(url) {
  goog.html.legacyconversions.throwIfConversionDisallowed_();
  return goog.html.legacyconversions.
      createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse_(url);
***REMOVED***


***REMOVED***
***REMOVED*** Performs an "unchecked conversion" from string to SafeUrl for legacy API
***REMOVED*** purposes.
***REMOVED***
***REMOVED*** Unchecked conversion will not proceed if ALLOW_LEGACY_CONVERSIONS is false,
***REMOVED*** and instead this function unconditionally throws an exception.
***REMOVED***
***REMOVED*** @param {string} url A string to be converted to SafeUrl.
***REMOVED*** @return {!goog.html.SafeUrl} The value of url, wrapped in a SafeUrl
***REMOVED***     object.
***REMOVED***
goog.html.legacyconversions.safeUrlFromString = function(url) {
  goog.html.legacyconversions.throwIfConversionDisallowed_();
  return goog.html.legacyconversions.
      createSafeUrlSecurityPrivateDoNotAccessOrElse_(url);
***REMOVED***


***REMOVED***
***REMOVED*** @private {function(): undefined}
***REMOVED***
goog.html.legacyconversions.reportCallback_ = goog.nullFunction;


***REMOVED***
***REMOVED*** Sets a function that will be called every time a legacy conversion is
***REMOVED*** performed. The function is called with no parameters but it can use
***REMOVED*** goog.debug.getStacktrace to get a stacktrace.
***REMOVED***
***REMOVED*** @param {function(): undefined} callback Error callback as defined above.
***REMOVED***
goog.html.legacyconversions.setReportCallback = function(callback) {
  goog.html.legacyconversions.reportCallback_ = callback;
***REMOVED***


***REMOVED***
***REMOVED*** Internal wrapper for the package-private
***REMOVED*** goog.html.SafeHtml.createSafeHtml... function.
***REMOVED*** @param {string} html A string to be converted to SafeHtml.
***REMOVED*** @return {!goog.html.SafeHtml}
***REMOVED*** @private
***REMOVED*** @suppress {visibility} For access to SafeHtml.create...  Note that this
***REMOVED***     use is appropriate since this method is intended to be "package private"
***REMOVED***     within goog.html.  DO NOT call SafeHtml.create... from outside this
***REMOVED***     package; use appropriate wrappers instead.
***REMOVED***
goog.html.legacyconversions.createSafeHtmlSecurityPrivateDoNotAccessOrElse_ =
    function(html) {
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(
      html, null);
***REMOVED***


***REMOVED***
***REMOVED*** Internal wrapper for the package-private
***REMOVED*** goog.html.TrustedResourceUrl.createTrustedResourceUrl... function.
***REMOVED*** @param {string} url A string to be converted to TrustedResourceUrl.
***REMOVED*** @return {!goog.html.TrustedResourceUrl}
***REMOVED*** @private
***REMOVED*** @suppress {visibility} For access to TrustedResourceUrl.create...  Note that
***REMOVED***     this use is appropriate since this method is intended to be
***REMOVED***     "package private" within goog.html.  DO NOT call
***REMOVED***     TrustedResourceUrl.create... from outside this package; use appropriate
***REMOVED***     wrappers instead.
***REMOVED***
goog.html.legacyconversions.
    createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse_ = function(url) {
  return goog.html.TrustedResourceUrl
      .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse_(url);
***REMOVED***


***REMOVED***
***REMOVED*** Internal wrapper for the package-private goog.html.SafeUrl.createSafeUrl...
***REMOVED*** function.
***REMOVED*** @param {string} url A string to be converted to TrustedResourceUrl.
***REMOVED*** @return {!goog.html.SafeUrl}
***REMOVED*** @private
***REMOVED*** @suppress {visibility} For access to SafeUrl.create...  Note that this use
***REMOVED***     is appropriate since this method is intended to be "package private"
***REMOVED***     within goog.html.  DO NOT call SafeUrl.create... from outside this
***REMOVED***     package; use appropriate wrappers instead.
***REMOVED***
goog.html.legacyconversions.createSafeUrlSecurityPrivateDoNotAccessOrElse_ =
    function(url) {
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse_(url);
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether legacy conversion is allowed. Throws an exception if not.
***REMOVED*** @private
***REMOVED***
goog.html.legacyconversions.throwIfConversionDisallowed_ = function() {
  if (!goog.html.legacyconversions.ALLOW_LEGACY_CONVERSIONS) {
    throw Error(
        'Error: Legacy conversion from string to goog.html types is disabled');
  }
  goog.html.legacyconversions.reportCallback_();
***REMOVED***
