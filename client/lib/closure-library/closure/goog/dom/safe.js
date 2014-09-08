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
***REMOVED*** @fileoverview Type-safe wrappers for unsafe DOM APIs.
***REMOVED***
***REMOVED*** This file provides type-safe wrappers for DOM APIs that can result in
***REMOVED*** cross-site scripting (XSS) vulnerabilities, if the API is supplied with
***REMOVED*** untrusted (attacker-controlled) input.  Instead of plain strings, the type
***REMOVED*** safe wrappers consume values of types from the goog.html package whose
***REMOVED*** contract promises that values are safe to use in the corresponding context.
***REMOVED***
***REMOVED*** Hence, a program that exclusively uses the wrappers in this file (i.e., whose
***REMOVED*** only reference to security-sensitive raw DOM APIs are in this file) is
***REMOVED*** guaranteed to be free of XSS due to incorrect use of such DOM APIs (modulo
***REMOVED*** correctness of code that produces values of the respective goog.html types,
***REMOVED*** and absent code that violates type safety).
***REMOVED***
***REMOVED*** For example, assigning to an element's .innerHTML property a string that is
***REMOVED*** derived (even partially) from untrusted input typically results in an XSS
***REMOVED*** vulnerability. The type-safe wrapper goog.html.setInnerHtml consumes a value
***REMOVED*** of type goog.html.SafeHtml, whose contract states that using its values in a
***REMOVED*** HTML context will not result in XSS. Hence a program that is free of direct
***REMOVED*** assignments to any element's innerHTML property (with the exception of the
***REMOVED*** assignment to .innerHTML in this file) is guaranteed to be free of XSS due to
***REMOVED*** assignment of untrusted strings to the innerHTML property.
***REMOVED***

goog.provide('goog.dom.safe');

goog.require('goog.html.SafeHtml');
goog.require('goog.html.SafeUrl');


***REMOVED***
***REMOVED*** Assigns known-safe HTML to an element's innerHTML property.
***REMOVED*** @param {!Element} elem The element whose innerHTML is to be assigned to.
***REMOVED*** @param {!goog.html.SafeHtml} html The known-safe HTML to assign.
***REMOVED***
goog.dom.safe.setInnerHtml = function(elem, html) {
  elem.innerHTML = goog.html.SafeHtml.unwrap(html);
***REMOVED***


***REMOVED***
***REMOVED*** Writes known-safe HTML to a document.
***REMOVED*** @param {!Document} doc The document to be written to.
***REMOVED*** @param {!goog.html.SafeHtml} html The known-safe HTML to assign.
***REMOVED***
goog.dom.safe.documentWrite = function(doc, html) {
  doc.write(goog.html.SafeHtml.unwrap(html));
***REMOVED***


***REMOVED***
***REMOVED*** Safely assigns a URL to an anchor element's href property.
***REMOVED***
***REMOVED*** If url is of type goog.html.SafeUrl, its value is unwrapped and assigned to
***REMOVED*** anchor's href property.  If url is of type string however, it is first
***REMOVED*** sanitized using goog.html.SafeUrl.sanitize.
***REMOVED***
***REMOVED*** Example usage:
***REMOVED***   goog.dom.safe.setAnchorHref(anchorEl, url);
***REMOVED*** which is a safe alternative to
***REMOVED***   anchorEl.href = url;
***REMOVED*** The latter can result in XSS vulnerabilities if url is a
***REMOVED*** user-/attacker-controlled value.
***REMOVED***
***REMOVED*** @param {!HTMLAnchorElement} anchor The anchor element whose href property
***REMOVED***     is to be assigned to.
***REMOVED*** @param {string|!goog.html.SafeUrl} url The URL to assign.
***REMOVED*** @see goog.html.SafeUrl#sanitize
***REMOVED***
goog.dom.safe.setAnchorHref = function(anchor, url) {
 ***REMOVED*****REMOVED*** @type {!goog.html.SafeUrl}***REMOVED***
  var safeUrl;
  if (url instanceof goog.html.SafeUrl) {
    safeUrl = url;
  } else {
    safeUrl = goog.html.SafeUrl.sanitize(url);
  }
  anchor.href = goog.html.SafeUrl.unwrap(safeUrl);
***REMOVED***


***REMOVED***
***REMOVED*** Safely assigns a URL to a Location object's href property.
***REMOVED***
***REMOVED*** If url is of type goog.html.SafeUrl, its value is unwrapped and assigned to
***REMOVED*** loc's href property.  If url is of type string however, it is first sanitized
***REMOVED*** using goog.html.SafeUrl.sanitize.
***REMOVED***
***REMOVED*** Example usage:
***REMOVED***   goog.dom.safe.setLocationHref(document.location, redirectUrl);
***REMOVED*** which is a safe alternative to
***REMOVED***   document.location.href = redirectUrl;
***REMOVED*** The latter can result in XSS vulnerabilities if redirectUrl is a
***REMOVED*** user-/attacker-controlled value.
***REMOVED***
***REMOVED*** @param {!Location} loc The Location object whose href property is to be
***REMOVED***     assigned to.
***REMOVED*** @param {string|!goog.html.SafeUrl} url The URL to assign.
***REMOVED*** @see goog.html.SafeUrl#sanitize
***REMOVED***
goog.dom.safe.setLocationHref = function(loc, url) {
 ***REMOVED*****REMOVED*** @type {!goog.html.SafeUrl}***REMOVED***
  var safeUrl;
  if (url instanceof goog.html.SafeUrl) {
    safeUrl = url;
  } else {
    safeUrl = goog.html.SafeUrl.sanitize(url);
  }
  loc.href = goog.html.SafeUrl.unwrap(safeUrl);
***REMOVED***
