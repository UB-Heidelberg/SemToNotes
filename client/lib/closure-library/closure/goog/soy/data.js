// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Soy data primitives.
***REMOVED***
***REMOVED*** The goal is to encompass data types used by Soy, especially to mark content
***REMOVED*** as known to be "safe".
***REMOVED***
***REMOVED*** @author gboyer@google.com (Garrett Boyer)
***REMOVED***

goog.provide('goog.soy.data');
goog.provide('goog.soy.data.SanitizedContent');
goog.provide('goog.soy.data.SanitizedContentKind');

goog.require('goog.html.SafeHtml');
goog.require('goog.html.uncheckedconversions');
goog.require('goog.string.Const');


***REMOVED***
***REMOVED*** A type of textual content.
***REMOVED***
***REMOVED*** This is an enum of type Object so that these values are unforgeable.
***REMOVED***
***REMOVED*** @enum {!Object}
***REMOVED***
goog.soy.data.SanitizedContentKind = {

 ***REMOVED*****REMOVED***
  ***REMOVED*** A snippet of HTML that does not start or end inside a tag, comment, entity,
  ***REMOVED*** or DOCTYPE; and that does not contain any executable code
  ***REMOVED*** (JS, {@code <object>}s, etc.) from a different trust domain.
 ***REMOVED*****REMOVED***
  HTML: goog.DEBUG ? {sanitizedContentKindHtml: true} : {},

 ***REMOVED*****REMOVED***
  ***REMOVED*** Executable Javascript code or expression, safe for insertion in a
  ***REMOVED*** script-tag or event handler context, known to be free of any
  ***REMOVED*** attacker-controlled scripts. This can either be side-effect-free
  ***REMOVED*** Javascript (such as JSON) or Javascript that's entirely under Google's
  ***REMOVED*** control.
 ***REMOVED*****REMOVED***
  JS: goog.DEBUG ? {sanitizedContentJsChars: true} : {},

 ***REMOVED*****REMOVED***
  ***REMOVED*** A sequence of code units that can appear between quotes (either kind) in a
  ***REMOVED*** JS program without causing a parse error, and without causing any side
  ***REMOVED*** effects.
  ***REMOVED*** <p>
  ***REMOVED*** The content should not contain unescaped quotes, newlines, or anything else
  ***REMOVED*** that would cause parsing to fail or to cause a JS parser to finish the
  ***REMOVED*** string its parsing inside the content.
  ***REMOVED*** <p>
  ***REMOVED*** The content must also not end inside an escape sequence ; no partial octal
  ***REMOVED*** escape sequences or odd number of '{@code \}'s at the end.
 ***REMOVED*****REMOVED***
  JS_STR_CHARS: goog.DEBUG ? {sanitizedContentJsStrChars: true} : {},

 ***REMOVED*****REMOVED*** A properly encoded portion of a URI.***REMOVED***
  URI: goog.DEBUG ? {sanitizedContentUri: true} : {},

 ***REMOVED*****REMOVED***
  ***REMOVED*** Repeated attribute names and values. For example,
  ***REMOVED*** {@code dir="ltr" foo="bar" onclick="trustedFunction()" checked}.
 ***REMOVED*****REMOVED***
  ATTRIBUTES: goog.DEBUG ? {sanitizedContentHtmlAttribute: true} : {},

  // TODO: Consider separating rules, declarations, and values into
  // separate types, but for simplicity, we'll treat explicitly blessed
  // SanitizedContent as allowed in all of these contexts.
 ***REMOVED*****REMOVED***
  ***REMOVED*** A CSS3 declaration, property, value or group of semicolon separated
  ***REMOVED*** declarations.
 ***REMOVED*****REMOVED***
  CSS: goog.DEBUG ? {sanitizedContentCss: true} : {},

 ***REMOVED*****REMOVED***
  ***REMOVED*** Unsanitized plain-text content.
  ***REMOVED***
  ***REMOVED*** This is effectively the "null" entry of this enum, and is sometimes used
  ***REMOVED*** to explicitly mark content that should never be used unescaped. Since any
  ***REMOVED*** string is safe to use as text, being of ContentKind.TEXT makes no
  ***REMOVED*** guarantees about its safety in any other context such as HTML.
 ***REMOVED*****REMOVED***
  TEXT: goog.DEBUG ? {sanitizedContentKindText: true} : {}
***REMOVED***



***REMOVED***
***REMOVED*** A string-like object that carries a content-type and a content direction.
***REMOVED***
***REMOVED*** IMPORTANT! Do not create these directly, nor instantiate the subclasses.
***REMOVED*** Instead, use a trusted, centrally reviewed library as endorsed by your team
***REMOVED*** to generate these objects. Otherwise, you risk accidentally creating
***REMOVED*** SanitizedContent that is attacker-controlled and gets evaluated unescaped in
***REMOVED*** templates.
***REMOVED***
***REMOVED***
***REMOVED***
goog.soy.data.SanitizedContent = function() {
  throw Error('Do not instantiate directly');
***REMOVED***


***REMOVED***
***REMOVED*** The context in which this content is safe from XSS attacks.
***REMOVED*** @type {goog.soy.data.SanitizedContentKind}
***REMOVED***
goog.soy.data.SanitizedContent.prototype.contentKind;


***REMOVED***
***REMOVED*** The content's direction; null if unknown and thus to be estimated when
***REMOVED*** necessary.
***REMOVED*** @type {?goog.i18n.bidi.Dir}
***REMOVED***
goog.soy.data.SanitizedContent.prototype.contentDir = null;


***REMOVED***
***REMOVED*** The already-safe content.
***REMOVED*** @type {string}
***REMOVED***
goog.soy.data.SanitizedContent.prototype.content;


***REMOVED*** @override***REMOVED***
goog.soy.data.SanitizedContent.prototype.toString = function() {
  return this.content;
***REMOVED***


***REMOVED***
***REMOVED*** Converts sanitized content of kind TEXT or HTML into SafeHtml. HTML content
***REMOVED*** is converted without modification, while text content is HTML-escaped.
***REMOVED*** @return {!goog.html.SafeHtml}
***REMOVED*** @throws {Error} when the content kind is not TEXT or HTML.
***REMOVED***
goog.soy.data.SanitizedContent.prototype.toSafeHtml = function() {
  if (this.contentKind === goog.soy.data.SanitizedContentKind.TEXT) {
    return goog.html.SafeHtml.htmlEscape(this.toString());
  }
  if (this.contentKind !== goog.soy.data.SanitizedContentKind.HTML) {
    throw Error('Sanitized content was not of kind TEXT or HTML.');
  }
  return goog.html.uncheckedconversions.
      safeHtmlFromStringKnownToSatisfyTypeContract(
          goog.string.Const.from(
              'Soy SanitizedContent of kind HTML produces ' +
                  'SafeHtml-contract-compliant value.'),
          this.toString(), this.contentDir);
***REMOVED***
