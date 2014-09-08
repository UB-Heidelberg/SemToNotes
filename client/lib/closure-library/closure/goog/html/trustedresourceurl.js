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
***REMOVED*** @fileoverview The TrustedResourceUrl type and its builders.
***REMOVED***
***REMOVED*** TODO(user): Link to document stating type contract.
***REMOVED***

goog.provide('goog.html.TrustedResourceUrl');

goog.require('goog.asserts');
goog.require('goog.i18n.bidi.Dir');
goog.require('goog.i18n.bidi.DirectionalString');
goog.require('goog.string.Const');
goog.require('goog.string.TypedString');



***REMOVED***
***REMOVED*** A URL which is under application control and from which script, CSS, and
***REMOVED*** other resources that represent executable code, can be fetched.
***REMOVED***
***REMOVED*** Given that the URL can only be constructed from strings under application
***REMOVED*** control and is used to load resources, bugs resulting in a malformed URL
***REMOVED*** should not have a security impact and are likely to be easily detectable
***REMOVED*** during testing. Given the wide number of non-RFC compliant URLs in use,
***REMOVED*** stricter validation could prevent some applications from being able to use
***REMOVED*** this type.
***REMOVED***
***REMOVED*** Instances of this type must be created via the factory method,
***REMOVED*** ({@code goog.html.TrustedResourceUrl.fromConstant}), and not by invoking its
***REMOVED*** constructor. The constructor intentionally takes no parameters and the type
***REMOVED*** is immutable; hence only a default instance corresponding to the empty
***REMOVED*** string can be obtained via constructor invocation.
***REMOVED***
***REMOVED*** @see goog.html.TrustedResourceUrl#fromConstant
***REMOVED***
***REMOVED*** @final
***REMOVED*** @struct
***REMOVED*** @implements {goog.i18n.bidi.DirectionalString}
***REMOVED*** @implements {goog.string.TypedString}
***REMOVED***
goog.html.TrustedResourceUrl = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The contained value of this TrustedResourceUrl.  The field has a purposely
  ***REMOVED*** ugly name to make (non-compiled) code that attempts to directly access this
  ***REMOVED*** field stand out.
  ***REMOVED*** @private {string}
 ***REMOVED*****REMOVED***
  this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** A type marker used to implement additional run-time type checking.
  ***REMOVED*** @see goog.html.TrustedResourceUrl#unwrap
  ***REMOVED*** @const
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ =
      goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** @const
***REMOVED***
goog.html.TrustedResourceUrl.prototype.implementsGoogStringTypedString = true;


***REMOVED***
***REMOVED*** Returns this TrustedResourceUrl's value as a string.
***REMOVED***
***REMOVED*** IMPORTANT: In code where it is security relevant that an object's type is
***REMOVED*** indeed {@code TrustedResourceUrl}, use
***REMOVED*** {@code goog.html.TrustedResourceUrl.unwrap} instead of this method. If in
***REMOVED*** doubt, assume that it's security relevant. In particular, note that
***REMOVED*** goog.html functions which return a goog.html type do not guarantee that
***REMOVED*** the returned instance is of the right type. For example:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** var fakeSafeHtml = new String('fake');
***REMOVED*** fakeSafeHtml.__proto__ = goog.html.SafeHtml.prototype;
***REMOVED*** var newSafeHtml = goog.html.SafeHtml.htmlEscape(fakeSafeHtml);
***REMOVED*** // newSafeHtml is just an alias for fakeSafeHtml, it's passed through by
***REMOVED*** // goog.html.SafeHtml.htmlEscape() as fakeSafeHtml instanceof
***REMOVED*** // goog.html.SafeHtml.
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @see goog.html.TrustedResourceUrl#unwrap
***REMOVED*** @override
***REMOVED***
goog.html.TrustedResourceUrl.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** @const
***REMOVED***
goog.html.TrustedResourceUrl.prototype.implementsGoogI18nBidiDirectionalString =
    true;


***REMOVED***
***REMOVED*** Returns this URLs directionality, which is always {@code LTR}.
***REMOVED*** @override
***REMOVED***
goog.html.TrustedResourceUrl.prototype.getDirection = function() {
  return goog.i18n.bidi.Dir.LTR;
***REMOVED***


if (goog.DEBUG) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Returns a debug string-representation of this value.
  ***REMOVED***
  ***REMOVED*** To obtain the actual string value wrapped in a TrustedResourceUrl, use
  ***REMOVED*** {@code goog.html.TrustedResourceUrl.unwrap}.
  ***REMOVED***
  ***REMOVED*** @see goog.html.TrustedResourceUrl#unwrap
  ***REMOVED*** @override
 ***REMOVED*****REMOVED***
  goog.html.TrustedResourceUrl.prototype.toString = function() {
    return 'TrustedResourceUrl{' +
        this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ + '}';
 ***REMOVED*****REMOVED***
}


***REMOVED***
***REMOVED*** Performs a runtime check that the provided object is indeed a
***REMOVED*** TrustedResourceUrl object, and returns its value.
***REMOVED***
***REMOVED*** @param {!goog.html.TrustedResourceUrl} trustedResourceUrl The object to
***REMOVED***     extract from.
***REMOVED*** @return {string} The trustedResourceUrl object's contained string, unless
***REMOVED***     the run-time type check fails. In that case, {@code unwrap} returns an
***REMOVED***     innocuous string, or, if assertions are enabled, throws
***REMOVED***     {@code goog.asserts.AssertionError}.
***REMOVED***
goog.html.TrustedResourceUrl.unwrap = function(trustedResourceUrl) {
  // Perform additional Run-time type-checking to ensure that
  // trustedResourceUrl is indeed an instance of the expected type.  This
  // provides some additional protection against security bugs due to
  // application code that disables type checks.
  // Specifically, the following checks are performed:
  // 1. The object is an instance of the expected type.
  // 2. The object is not an instance of a subclass.
  // 3. The object carries a type marker for the expected type. "Faking" an
  // object requires a reference to the type marker, which has names intended
  // to stand out in code reviews.
  if (trustedResourceUrl instanceof goog.html.TrustedResourceUrl &&
      trustedResourceUrl.constructor === goog.html.TrustedResourceUrl &&
      trustedResourceUrl
          .TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ ===
              goog.html.TrustedResourceUrl
                  .TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return trustedResourceUrl
        .privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
  } else {
    goog.asserts.fail('expected object of type TrustedResourceUrl, got \'' +
                      trustedResourceUrl + '\'');
    return 'type_error:TrustedResourceUrl';

  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a TrustedResourceUrl object from a compile-time constant string.
***REMOVED***
***REMOVED*** Compile-time constant strings are inherently program-controlled and hence
***REMOVED*** trusted.
***REMOVED***
***REMOVED*** @param {!goog.string.Const} url A compile-time-constant string from which to
***REMOVED***     create a TrustedResourceUrl.
***REMOVED*** @return {!goog.html.TrustedResourceUrl} A TrustedResourceUrl object
***REMOVED***     initialized to {@code url}.
***REMOVED***
goog.html.TrustedResourceUrl.fromConstant = function(url) {
  return goog.html.TrustedResourceUrl
      .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse_(
          goog.string.Const.unwrap(url));
***REMOVED***


***REMOVED***
***REMOVED*** Type marker for the TrustedResourceUrl type, used to implement additional
***REMOVED*** run-time type checking.
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {***REMOVED***


***REMOVED***
***REMOVED*** Utility method to create TrustedResourceUrl instances.
***REMOVED***
***REMOVED*** This function is considered "package private", i.e. calls (using "suppress
***REMOVED*** visibility") from other files within this package are considered acceptable.
***REMOVED*** DO NOT call this function from outside the goog.html package; use appropriate
***REMOVED*** wrappers instead.
***REMOVED***
***REMOVED*** @param {string} url The string to initialize the TrustedResourceUrl object
***REMOVED***     with.
***REMOVED*** @return {!goog.html.TrustedResourceUrl} The initialized TrustedResourceUrl
***REMOVED***     object.
***REMOVED*** @private
***REMOVED***
goog.html.TrustedResourceUrl.
    createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse_ = function(url) {
  var trustedResourceUrl = new goog.html.TrustedResourceUrl();
  trustedResourceUrl.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ =
      url;
  return trustedResourceUrl;
***REMOVED***
