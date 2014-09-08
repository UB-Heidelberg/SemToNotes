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
***REMOVED*** @fileoverview Unchecked conversions to create values of goog.html types from
***REMOVED*** plain strings.  Use of these functions could potentially result in instances
***REMOVED*** of goog.html types that violate their type contracts, and hence result in
***REMOVED*** security vulnerabilties.
***REMOVED***
***REMOVED*** Therefore, all uses of the methods herein must be carefully security
***REMOVED*** reviewed.  Avoid use of the methods in this file whenever possible; instead
***REMOVED*** prefer to create instances of goog.html types using inherently safe builders
***REMOVED*** or template systems.
***REMOVED***
***REMOVED***
***REMOVED*** @visibility {//closure/goog/html:approved_for_unchecked_conversion}
***REMOVED*** @visibility {//closure/goog/bin/sizetests:__pkg__}
***REMOVED***


goog.provide('goog.html.uncheckedconversions');

goog.require('goog.asserts');
goog.require('goog.html.SafeHtml');
goog.require('goog.html.SafeStyle');
goog.require('goog.html.SafeUrl');
goog.require('goog.html.TrustedResourceUrl');
goog.require('goog.string');
goog.require('goog.string.Const');


***REMOVED***
***REMOVED*** Performs an "unchecked conversion" to SafeHtml from a plain string that is
***REMOVED*** known to satisfy the SafeHtml type contract.
***REMOVED***
***REMOVED*** IMPORTANT: Uses of this method must be carefully security-reviewed to ensure
***REMOVED*** that the value of {@code html} satisfies the SafeHtml type contract in all
***REMOVED*** possible program states.
***REMOVED***
***REMOVED***
***REMOVED*** @param {!goog.string.Const} justification A constant string explaining why
***REMOVED***     this use of this method is safe. May include a security review ticket
***REMOVED***     number.
***REMOVED*** @param {string} html A string that is claimed to adhere to the SafeHtml
***REMOVED***     contract.
***REMOVED*** @param {?goog.i18n.bidi.Dir=} opt_dir The optional directionality of the
***REMOVED***     SafeHtml to be constructed. A null or undefined value signifies an
***REMOVED***     unknown directionality.
***REMOVED*** @return {!goog.html.SafeHtml} The value of html, wrapped in a SafeHtml
***REMOVED***     object.
***REMOVED*** @suppress {visibility} For access to SafeHtml.create...  Note that this
***REMOVED***     use is appropriate since this method is intended to be "package private"
***REMOVED***     withing goog.html.  DO NOT call SafeHtml.create... from outside this
***REMOVED***     package; use appropriate wrappers instead.
***REMOVED***
goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract =
    function(justification, html, opt_dir) {
  // unwrap() called inside an assert so that justification can be optimized
  // away in production code.
  goog.asserts.assertString(goog.string.Const.unwrap(justification),
                            'must provide justification');
  goog.asserts.assert(
      goog.string.trim(goog.string.Const.unwrap(justification)).length > 0,
      'must provide non-empty justification');
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(
      html, opt_dir || null);
***REMOVED***


***REMOVED***
***REMOVED*** Performs an "unchecked conversion" to SafeStyle from a plain string that is
***REMOVED*** known to satisfy the SafeStyle type contract.
***REMOVED***
***REMOVED*** IMPORTANT: Uses of this method must be carefully security-reviewed to ensure
***REMOVED*** that the value of {@code style} satisfies the SafeUrl type contract in all
***REMOVED*** possible program states.
***REMOVED***
***REMOVED***
***REMOVED*** @param {!goog.string.Const} justification A constant string explaining why
***REMOVED***     this use of this method is safe. May include a security review ticket
***REMOVED***     number.
***REMOVED*** @param {string} style The string to wrap as a SafeStyle.
***REMOVED***     contract.
***REMOVED*** @return {!goog.html.SafeStyle} The value of {@code style}, wrapped in a
***REMOVED***     SafeStyle object.
***REMOVED*** @suppress {visibility} For access to SafeStyle.create...  Note that this
***REMOVED***     use is appropriate since this method is intended to be "package private"
***REMOVED***     withing goog.html.  DO NOT call SafeStyle.create... from outside this
***REMOVED***     package; use appropriate wrappers instead.
***REMOVED***
goog.html.uncheckedconversions.safeStyleFromStringKnownToSatisfyTypeContract =
    function(justification, style) {
  // unwrap() called inside an assert so that justification can be optimized
  // away in production code.
  goog.asserts.assertString(goog.string.Const.unwrap(justification),
                            'must provide justification');
  goog.asserts.assert(
      goog.string.trim(goog.string.Const.unwrap(justification)).length > 0,
      'must provide non-empty justification');
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_(
      style);
***REMOVED***


***REMOVED***
***REMOVED*** Performs an "unchecked conversion" to SafeUrl from a plain string that is
***REMOVED*** known to satisfy the SafeUrl type contract.
***REMOVED***
***REMOVED*** IMPORTANT: Uses of this method must be carefully security-reviewed to ensure
***REMOVED*** that the value of {@code url} satisfies the SafeUrl type contract in all
***REMOVED*** possible program states.
***REMOVED***
***REMOVED***
***REMOVED*** @param {!goog.string.Const} justification A constant string explaining why
***REMOVED***     this use of this method is safe. May include a security review ticket
***REMOVED***     number.
***REMOVED*** @param {string} url The string to wrap as a SafeUrl.
***REMOVED***     contract.
***REMOVED*** @return {!goog.html.SafeUrl} The value of {@code url}, wrapped in a SafeUrl
***REMOVED***     object.
***REMOVED*** @suppress {visibility} For access to SafeUrl.create...  Note that this
***REMOVED***     use is appropriate since this method is intended to be "package private"
***REMOVED***     withing goog.html.  DO NOT call SafeUrl.create... from outside this
***REMOVED***     package; use appropriate wrappers instead.
***REMOVED***
goog.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract =
    function(justification, url) {
  // unwrap() called inside an assert so that justification can be optimized
  // away in production code.
  goog.asserts.assertString(goog.string.Const.unwrap(justification),
                            'must provide justification');
  goog.asserts.assert(
      goog.string.trim(goog.string.Const.unwrap(justification)).length > 0,
      'must provide non-empty justification');
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse_(url);
***REMOVED***


***REMOVED***
***REMOVED*** Performs an "unchecked conversion" to TrustedResourceUrl from a plain string
***REMOVED*** that is known to satisfy the TrustedResourceUrl type contract.
***REMOVED***
***REMOVED*** IMPORTANT: Uses of this method must be carefully security-reviewed to ensure
***REMOVED*** that the value of {@code url} satisfies the TrustedResourceUrl type contract
***REMOVED*** in all possible program states.
***REMOVED***
***REMOVED***
***REMOVED*** @param {!goog.string.Const} justification A constant string explaining why
***REMOVED***     this use of this method is safe. May include a security review ticket
***REMOVED***     number.
***REMOVED*** @param {string} url The string to wrap as a TrustedResourceUrl.
***REMOVED***     contract.
***REMOVED*** @return {!goog.html.TrustedResourceUrl} The value of {@code url}, wrapped in
***REMOVED***     a TrustedResourceUrl object.
***REMOVED*** @suppress {visibility} For access to TrustedResourceUrl.create...  Note that
***REMOVED***     this use is appropriate since this method is intended to be
***REMOVED***     "package private" withing goog.html.  DO NOT call SafeUrl.create... from
***REMOVED***     outside this package; use appropriate wrappers instead.
***REMOVED***
goog.html.uncheckedconversions.
    trustedResourceUrlFromStringKnownToSatisfyTypeContract =
    function(justification, url) {
  // unwrap() called inside an assert so that justification can be optimized
  // away in production code.
  goog.asserts.assertString(goog.string.Const.unwrap(justification),
                            'must provide justification');
  goog.asserts.assert(
      goog.string.trim(goog.string.Const.unwrap(justification)).length > 0,
      'must provide non-empty justification');
  return goog.html.TrustedResourceUrl.
      createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse_(url);
***REMOVED***
