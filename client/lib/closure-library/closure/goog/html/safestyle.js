// Copyright 2014 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview The SafeStyle type and its builders.
***REMOVED***
***REMOVED*** TODO(user): Link to document stating type contract.
***REMOVED***

goog.provide('goog.html.SafeStyle');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.string');
goog.require('goog.string.Const');
goog.require('goog.string.TypedString');



***REMOVED***
***REMOVED*** A string-like object which represents a sequence of CSS declarations
***REMOVED*** ({@code propertyName1: propertyvalue1; propertyName2: propertyValue2; ...})
***REMOVED*** and that carries the security type contract that its value, as a string,
***REMOVED*** will not cause untrusted script execution (XSS) when evaluated as CSS in a
***REMOVED*** browser.
***REMOVED***
***REMOVED*** Instances of this type must be created via the factory methods
***REMOVED*** ({@code goog.html.SafeStyle.create} or
***REMOVED*** {@code goog.html.SafeStyle.fromConstant}) and not by invoking its
***REMOVED*** constructor. The constructor intentionally takes no parameters and the type
***REMOVED*** is immutable; hence only a default instance corresponding to the empty string
***REMOVED*** can be obtained via constructor invocation.
***REMOVED***
***REMOVED*** A SafeStyle's string representation ({@link #getSafeStyleString()}) can
***REMOVED*** safely:
***REMOVED*** <ul>
***REMOVED***   <li>Be interpolated as the entire content of a***REMOVED***quoted* HTML style
***REMOVED***       attribute, or before already existing properties. The SafeStyle string
***REMOVED***      ***REMOVED***must be HTML-attribute-escaped* (where " and ' are escaped) before
***REMOVED***       interpolation.
***REMOVED***   <li>Be interpolated as the entire content of a {}-wrapped block within a
***REMOVED***       stylesheet, or before already existing properties. The SafeStyle string
***REMOVED***       should not be escaped before interpolation. SafeStyle's contract also
***REMOVED***       guarantees that the string will not be able to introduce new properties
***REMOVED***       or elide existing ones.
***REMOVED***   <li>Be assigned to the style property of a DOM node. The SafeStyle string
***REMOVED***       should not be escaped before being assigned to the property.
***REMOVED*** </ul>
***REMOVED***
***REMOVED*** A SafeStyle may never contain literal angle brackets. Otherwise, it could
***REMOVED*** be unsafe to place a SafeStyle into a &lt;style&gt; tag (where it can't
***REMOVED*** be HTML escaped). For example, if the SafeStyle containing
***REMOVED*** "{@code font: 'foo &lt;style/&gt;&lt;script&gt;evil&lt;/script&gt;'}" were
***REMOVED*** interpolated within a &lt;style&gt; tag, this would then break out of the
***REMOVED*** style context into HTML.
***REMOVED***
***REMOVED*** A SafeStyle may contain literal single or double quotes, and as such the
***REMOVED*** entire style string must be escaped when used in a style attribute (if
***REMOVED*** this were not the case, the string could contain a matching quote that
***REMOVED*** would escape from the style attribute).
***REMOVED***
***REMOVED*** Values of this type must be composable, i.e. for any two values
***REMOVED*** {@code style1} and {@code style2} of this type,
***REMOVED*** {@code style1.getSafeStyleString() + style2.getSafeStyleString()} must
***REMOVED*** itself be a value that satisfies the SafeStyle type constraint. This
***REMOVED*** requirement implies that for any value {@code style} of this type,
***REMOVED*** {@code style.getSafeStyleString()} must not end in a "property value" or
***REMOVED*** "property name" context. For example, a value of {@code background:url("}
***REMOVED*** or {@code font-} would not satisfy the SafeStyle contract. This is because
***REMOVED*** concatenating such strings with a second value that itself does not contain
***REMOVED*** unsafe CSS can result in an overall string that does. For example, if
***REMOVED*** {@code javascript:evil())"} is appended to {@code background:url("}, the
***REMOVED*** resulting string may result in the execution of a malicious script.
***REMOVED***
***REMOVED*** TODO(user): Consider whether we should implement UTF-8 interchange
***REMOVED*** validity checks and blacklisting of newlines (including Unicode ones) and
***REMOVED*** other whitespace characters (\t, \f). Document here if so and also update
***REMOVED*** SafeStyle.fromConstant().
***REMOVED***
***REMOVED*** The following example values comply with this type's contract:
***REMOVED*** <ul>
***REMOVED***   <li><pre>width: 1em;</pre>
***REMOVED***   <li><pre>height:1em;</pre>
***REMOVED***   <li><pre>width: 1em;height: 1em;</pre>
***REMOVED***   <li><pre>background:url('http://url');</pre>
***REMOVED*** </ul>
***REMOVED*** In addition, the empty string is safe for use in a CSS attribute.
***REMOVED***
***REMOVED*** The following example values do NOT comply with this type's contract:
***REMOVED*** <ul>
***REMOVED***   <li><pre>background: red</pre> (missing a trailing semi-colon)
***REMOVED***   <li><pre>background:</pre> (missing a value and a trailing semi-colon)
***REMOVED***   <li><pre>1em</pre> (missing an attribute name, which provides context for
***REMOVED***       the value)
***REMOVED*** </ul>
***REMOVED***
***REMOVED*** @see goog.html.SafeStyle#create
***REMOVED*** @see goog.html.SafeStyle#fromConstant
***REMOVED*** @see http://www.w3.org/TR/css3-syntax/
***REMOVED***
***REMOVED*** @final
***REMOVED*** @struct
***REMOVED*** @implements {goog.string.TypedString}
***REMOVED***
goog.html.SafeStyle = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The contained value of this SafeStyle.  The field has a purposely
  ***REMOVED*** ugly name to make (non-compiled) code that attempts to directly access this
  ***REMOVED*** field stand out.
  ***REMOVED*** @private {string}
 ***REMOVED*****REMOVED***
  this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** A type marker used to implement additional run-time type checking.
  ***REMOVED*** @see goog.html.SafeStyle#unwrap
  ***REMOVED*** @const
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ =
      goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** @const
***REMOVED***
goog.html.SafeStyle.prototype.implementsGoogStringTypedString = true;


***REMOVED***
***REMOVED*** Type marker for the SafeStyle type, used to implement additional
***REMOVED*** run-time type checking.
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {***REMOVED***


***REMOVED***
***REMOVED*** Creates a SafeStyle object from a compile-time constant string.
***REMOVED***
***REMOVED*** {@code style} should be in the format
***REMOVED*** {@code name: value; [name: value; ...]} and must not have any < or >
***REMOVED*** characters in it. This is so that SafeStyle's contract is preserved,
***REMOVED*** allowing the SafeStyle to correctly be interpreted as a sequence of CSS
***REMOVED*** declarations and without affecting the syntactic structure of any
***REMOVED*** surrounding CSS and HTML.
***REMOVED***
***REMOVED*** This method performs basic sanity checks on the format of {@code style}
***REMOVED*** but does not constrain the format of {@code name} and {@code value}, except
***REMOVED*** for disallowing tag characters.
***REMOVED***
***REMOVED*** @param {!goog.string.Const} style A compile-time-constant string from which
***REMOVED***     to create a SafeStyle.
***REMOVED*** @return {!goog.html.SafeStyle} A SafeStyle object initialized to
***REMOVED***     {@code style}.
***REMOVED***
goog.html.SafeStyle.fromConstant = function(style) {
  var styleString = goog.string.Const.unwrap(style);
  if (styleString.length === 0) {
    return goog.html.SafeStyle.EMPTY;
  }
  goog.html.SafeStyle.checkStyle_(styleString);
  goog.asserts.assert(goog.string.endsWith(styleString, ';'),
      'Last character of style string is not \';\': ' + styleString);
  goog.asserts.assert(goog.string.contains(styleString, ':'),
      'Style string must contain at least one \':\', to ' +
      'specify a "name: value" pair: ' + styleString);
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_(
      styleString);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the style definition is valid.
***REMOVED*** @param {string} style
***REMOVED*** @private
***REMOVED***
goog.html.SafeStyle.checkStyle_ = function(style) {
  goog.asserts.assert(!/[<>]/.test(style),
      'Forbidden characters in style string: ' + style);
***REMOVED***


***REMOVED***
***REMOVED*** Returns this SafeStyle's value as a string.
***REMOVED***
***REMOVED*** IMPORTANT: In code where it is security relevant that an object's type is
***REMOVED*** indeed {@code SafeStyle}, use {@code goog.html.SafeStyle.unwrap} instead of
***REMOVED*** this method. If in doubt, assume that it's security relevant. In particular,
***REMOVED*** note that goog.html functions which return a goog.html type do not guarantee
***REMOVED*** the returned instance is of the right type. For example:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** var fakeSafeHtml = new String('fake');
***REMOVED*** fakeSafeHtml.__proto__ = goog.html.SafeHtml.prototype;
***REMOVED*** var newSafeHtml = goog.html.SafeHtml.htmlEscape(fakeSafeHtml);
***REMOVED*** // newSafeHtml is just an alias for fakeSafeHtml, it's passed through by
***REMOVED*** // goog.html.SafeHtml.htmlEscape() as fakeSafeHtml
***REMOVED*** // instanceof goog.html.SafeHtml.
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @see goog.html.SafeStyle#unwrap
***REMOVED*** @override
***REMOVED***
goog.html.SafeStyle.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeStyleWrappedValue_;
***REMOVED***


if (goog.DEBUG) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Returns a debug string-representation of this value.
  ***REMOVED***
  ***REMOVED*** To obtain the actual string value wrapped in a SafeStyle, use
  ***REMOVED*** {@code goog.html.SafeStyle.unwrap}.
  ***REMOVED***
  ***REMOVED*** @see goog.html.SafeStyle#unwrap
  ***REMOVED*** @override
 ***REMOVED*****REMOVED***
  goog.html.SafeStyle.prototype.toString = function() {
    return 'SafeStyle{' +
        this.privateDoNotAccessOrElseSafeStyleWrappedValue_ + '}';
 ***REMOVED*****REMOVED***
}


***REMOVED***
***REMOVED*** Performs a runtime check that the provided object is indeed a
***REMOVED*** SafeStyle object, and returns its value.
***REMOVED***
***REMOVED*** @param {!goog.html.SafeStyle} safeStyle The object to extract from.
***REMOVED*** @return {string} The safeStyle object's contained string, unless
***REMOVED***     the run-time type check fails. In that case, {@code unwrap} returns an
***REMOVED***     innocuous string, or, if assertions are enabled, throws
***REMOVED***     {@code goog.asserts.AssertionError}.
***REMOVED***
goog.html.SafeStyle.unwrap = function(safeStyle) {
  // Perform additional Run-time type-checking to ensure that
  // safeStyle is indeed an instance of the expected type.  This
  // provides some additional protection against security bugs due to
  // application code that disables type checks.
  // Specifically, the following checks are performed:
  // 1. The object is an instance of the expected type.
  // 2. The object is not an instance of a subclass.
  // 3. The object carries a type marker for the expected type. "Faking" an
  // object requires a reference to the type marker, which has names intended
  // to stand out in code reviews.
  if (safeStyle instanceof goog.html.SafeStyle &&
      safeStyle.constructor === goog.html.SafeStyle &&
      safeStyle.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ ===
          goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeStyle.privateDoNotAccessOrElseSafeStyleWrappedValue_;
  } else {
    goog.asserts.fail(
        'expected object of type SafeStyle, got \'' + safeStyle + '\'');
    return 'type_error:SafeStyle';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Utility method to create SafeStyle instances.
***REMOVED***
***REMOVED*** This function is considered "package private", i.e. calls (using "suppress
***REMOVED*** visibility") from other files within this package are considered acceptable.
***REMOVED*** DO NOT call this function from outside the goog.html package; use appropriate
***REMOVED*** wrappers instead.
***REMOVED***
***REMOVED*** @param {string} style The string to initialize the SafeStyle object with.
***REMOVED*** @return {!goog.html.SafeStyle} The initialized SafeStyle object.
***REMOVED*** @private
***REMOVED***
goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_ =
    function(style) {
  var safeStyle = new goog.html.SafeStyle();
  safeStyle.privateDoNotAccessOrElseSafeStyleWrappedValue_ = style;
  return safeStyle;
***REMOVED***


***REMOVED***
***REMOVED*** A SafeStyle instance corresponding to the empty string.
***REMOVED*** @const {!goog.html.SafeStyle}
***REMOVED***
goog.html.SafeStyle.EMPTY =
    goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_('');


***REMOVED***
***REMOVED*** The innocuous string generated by goog.html.SafeUrl.create when passed
***REMOVED*** an unsafe value.
***REMOVED*** @const {string}
***REMOVED***
goog.html.SafeStyle.INNOCUOUS_STRING = 'zClosurez';


***REMOVED***
***REMOVED*** Mapping of property names to their values.
***REMOVED*** @typedef {!Object.<string, goog.string.Const|string>}
***REMOVED***
goog.html.SafeStyle.PropertyMap;


***REMOVED***
***REMOVED*** Creates a new SafeStyle object from the properties specified in the map.
***REMOVED*** @param {goog.html.SafeStyle.PropertyMap} map Mapping of property names to
***REMOVED***     their values, for example {'margin': '1px'}. Names must consist of
***REMOVED***     [-_a-zA-Z0-9]. Values might be strings consisting of [-.%_!# a-zA-Z0-9].
***REMOVED***     Other values must be wrapped in goog.string.Const. Null value causes
***REMOVED***     skipping the property.
***REMOVED*** @return {!goog.html.SafeStyle}
***REMOVED*** @throws {Error} If invalid name is provided.
***REMOVED*** @throws {goog.asserts.AssertionError} If invalid value is provided. With
***REMOVED***     disabled assertions, invalid value is replaced by
***REMOVED***     goog.html.SafeStyle.INNOCUOUS_STRING.
***REMOVED***
goog.html.SafeStyle.create = function(map) {
  var style = '';
  for (var name in map) {
    if (!/^[-_a-zA-Z0-9]+$/.test(name)) {
      throw Error('Name allows only [-_a-zA-Z0-9], got: ' + name);
    }
    var value = map[name];
    if (value == null) {
      continue;
    }
    if (value instanceof goog.string.Const) {
      value = goog.string.Const.unwrap(value);
      // These characters can be used to change context and we don't want that
      // even with const values.
      goog.asserts.assert(!/[{;}]/.test(value), 'Value does not allow [{;}].');
    } else if (!goog.html.SafeStyle.VALUE_RE_.test(value)) {
      goog.asserts.fail(
          'String value allows only [-.%_!# a-zA-Z0-9], got: ' + value);
      value = goog.html.SafeStyle.INNOCUOUS_STRING;
    }
    style += name + ':' + value + ';';
  }
  if (!style) {
    return goog.html.SafeStyle.EMPTY;
  }
  goog.html.SafeStyle.checkStyle_(style);
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_(
      style);
***REMOVED***


// Keep in sync with the error string in create().
***REMOVED***
***REMOVED*** Regular expression for safe values.
***REMOVED*** @const {!RegExp}
***REMOVED*** @private
***REMOVED***
goog.html.SafeStyle.VALUE_RE_ = /^[-.%_!# a-zA-Z0-9]+$/;


***REMOVED***
***REMOVED*** Creates a new SafeStyle object by concatenating the values.
***REMOVED*** @param {...(!goog.html.SafeStyle|!Array.<!goog.html.SafeStyle>)} var_args
***REMOVED***     SafeStyles to concatenate.
***REMOVED*** @return {!goog.html.SafeStyle}
***REMOVED***
goog.html.SafeStyle.concat = function(var_args) {
  var style = '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** @param {!goog.html.SafeStyle|!Array.<!goog.html.SafeStyle>} argument
 ***REMOVED*****REMOVED***
  var addArgument = function(argument) {
    if (goog.isArray(argument)) {
      goog.array.forEach(argument, addArgument);
    } else {
      style += goog.html.SafeStyle.unwrap(argument);
    }
 ***REMOVED*****REMOVED***

  goog.array.forEach(arguments, addArgument);
  if (!style) {
    return goog.html.SafeStyle.EMPTY;
  }
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_(
      style);
***REMOVED***
