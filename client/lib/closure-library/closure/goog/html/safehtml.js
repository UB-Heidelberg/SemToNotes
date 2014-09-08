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
***REMOVED*** @fileoverview The SafeHtml type and its builders.
***REMOVED***
***REMOVED*** TODO(user): Link to document stating type contract.
***REMOVED***

goog.provide('goog.html.SafeHtml');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom.tags');
goog.require('goog.html.SafeStyle');
goog.require('goog.html.SafeUrl');
goog.require('goog.i18n.bidi.Dir');
goog.require('goog.i18n.bidi.DirectionalString');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.string.Const');
goog.require('goog.string.TypedString');



***REMOVED***
***REMOVED*** A string that is safe to use in HTML context in DOM APIs and HTML documents.
***REMOVED***
***REMOVED*** A SafeHtml is a string-like object that carries the security type contract
***REMOVED*** that its value as a string will not cause untrusted script execution when
***REMOVED*** evaluated as HTML in a browser.
***REMOVED***
***REMOVED*** Values of this type are guaranteed to be safe to use in HTML contexts,
***REMOVED*** such as, assignment to the innerHTML DOM property, or interpolation into
***REMOVED*** a HTML template in HTML PC_DATA context, in the sense that the use will not
***REMOVED*** result in a Cross-Site-Scripting vulnerability.
***REMOVED***
***REMOVED*** Instances of this type must be created via the factory methods
***REMOVED*** ({@code goog.html.SafeHtml.create}, {@code goog.html.SafeHtml.htmlEscape}),
***REMOVED*** etc and not by invoking its constructor.  The constructor intentionally
***REMOVED*** takes no parameters and the type is immutable; hence only a default instance
***REMOVED*** corresponding to the empty string can be obtained via constructor invocation.
***REMOVED***
***REMOVED*** @see goog.html.SafeHtml#create
***REMOVED*** @see goog.html.SafeHtml#htmlEscape
***REMOVED***
***REMOVED*** @final
***REMOVED*** @struct
***REMOVED*** @implements {goog.i18n.bidi.DirectionalString}
***REMOVED*** @implements {goog.string.TypedString}
***REMOVED***
goog.html.SafeHtml = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The contained value of this SafeHtml.  The field has a purposely ugly
  ***REMOVED*** name to make (non-compiled) code that attempts to directly access this
  ***REMOVED*** field stand out.
  ***REMOVED*** @private {string}
 ***REMOVED*****REMOVED***
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** A type marker used to implement additional run-time type checking.
  ***REMOVED*** @see goog.html.SafeHtml#unwrap
  ***REMOVED*** @const
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ =
      goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** This SafeHtml's directionality, or null if unknown.
  ***REMOVED*** @private {?goog.i18n.bidi.Dir}
 ***REMOVED*****REMOVED***
  this.dir_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** @const
***REMOVED***
goog.html.SafeHtml.prototype.implementsGoogI18nBidiDirectionalString = true;


***REMOVED*** @override***REMOVED***
goog.html.SafeHtml.prototype.getDirection = function() {
  return this.dir_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** @const
***REMOVED***
goog.html.SafeHtml.prototype.implementsGoogStringTypedString = true;


***REMOVED***
***REMOVED*** Returns this SafeHtml's value a string.
***REMOVED***
***REMOVED*** IMPORTANT: In code where it is security relevant that an object's type is
***REMOVED*** indeed {@code SafeHtml}, use {@code goog.html.SafeHtml.unwrap} instead of
***REMOVED*** this method. If in doubt, assume that it's security relevant. In particular,
***REMOVED*** note that goog.html functions which return a goog.html type do not guarantee
***REMOVED*** that the returned instance is of the right type. For example:
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
***REMOVED*** @see goog.html.SafeHtml#unwrap
***REMOVED*** @override
***REMOVED***
goog.html.SafeHtml.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
***REMOVED***


if (goog.DEBUG) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Returns a debug string-representation of this value.
  ***REMOVED***
  ***REMOVED*** To obtain the actual string value wrapped in a SafeHtml, use
  ***REMOVED*** {@code goog.html.SafeHtml.unwrap}.
  ***REMOVED***
  ***REMOVED*** @see goog.html.SafeHtml#unwrap
  ***REMOVED*** @override
 ***REMOVED*****REMOVED***
  goog.html.SafeHtml.prototype.toString = function() {
    return 'SafeHtml{' + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ +
        '}';
 ***REMOVED*****REMOVED***
}


***REMOVED***
***REMOVED*** Performs a runtime check that the provided object is indeed a SafeHtml
***REMOVED*** object, and returns its value.
***REMOVED*** @param {!goog.html.SafeHtml} safeHtml The object to extract from.
***REMOVED*** @return {string} The SafeHtml object's contained string, unless the run-time
***REMOVED***     type check fails. In that case, {@code unwrap} returns an innocuous
***REMOVED***     string, or, if assertions are enabled, throws
***REMOVED***     {@code goog.asserts.AssertionError}.
***REMOVED***
goog.html.SafeHtml.unwrap = function(safeHtml) {
  // Perform additional run-time type-checking to ensure that safeHtml is indeed
  // an instance of the expected type.  This provides some additional protection
  // against security bugs due to application code that disables type checks.
  // Specifically, the following checks are performed:
  // 1. The object is an instance of the expected type.
  // 2. The object is not an instance of a subclass.
  // 3. The object carries a type marker for the expected type. "Faking" an
  // object requires a reference to the type marker, which has names intended
  // to stand out in code reviews.
  if (safeHtml instanceof goog.html.SafeHtml &&
      safeHtml.constructor === goog.html.SafeHtml &&
      safeHtml.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ ===
          goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeHtml.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
  } else {
    goog.asserts.fail('expected object of type SafeHtml, got \'' +
                      safeHtml + '\'');
    return 'type_error:SafeHtml';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Shorthand for union of types that can sensibly be converted to strings
***REMOVED*** or might already be SafeHtml (as SafeHtml is a goog.string.TypedString).
***REMOVED*** @private
***REMOVED*** @typedef {string|number|boolean|!goog.string.TypedString|
***REMOVED***           !goog.i18n.bidi.DirectionalString}
***REMOVED***
goog.html.SafeHtml.TextOrHtml_;


***REMOVED***
***REMOVED*** Returns HTML-escaped text as a SafeHtml object.
***REMOVED***
***REMOVED*** If text is of a type that implements
***REMOVED*** {@code goog.i18n.bidi.DirectionalString}, the directionality of the new
***REMOVED*** {@code SafeHtml} object is set to {@code text}'s directionality, if known.
***REMOVED*** Otherwise, the directionality of the resulting SafeHtml is unknown (i.e.,
***REMOVED*** {@code null}).
***REMOVED***
***REMOVED*** @param {!goog.html.SafeHtml.TextOrHtml_} textOrHtml The text to escape. If
***REMOVED***     the parameter is of type SafeHtml it is returned directly (no escaping
***REMOVED***     is done).
***REMOVED*** @return {!goog.html.SafeHtml} The escaped text, wrapped as a SafeHtml.
***REMOVED***
goog.html.SafeHtml.htmlEscape = function(textOrHtml) {
  if (textOrHtml instanceof goog.html.SafeHtml) {
    return textOrHtml;
  }
  var dir = null;
  if (textOrHtml.implementsGoogI18nBidiDirectionalString) {
    dir = textOrHtml.getDirection();
  }
  var textAsString;
  if (textOrHtml.implementsGoogStringTypedString) {
    textAsString = textOrHtml.getTypedStringValue();
  } else {
    textAsString = String(textOrHtml);
  }
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(
      goog.string.htmlEscape(textAsString), dir);
***REMOVED***


***REMOVED***
***REMOVED*** Returns HTML-escaped text as a SafeHtml object, with newlines changed to
***REMOVED*** &lt;br&gt;.
***REMOVED*** @param {!goog.html.SafeHtml.TextOrHtml_} textOrHtml The text to escape. If
***REMOVED***     the parameter is of type SafeHtml it is returned directly (no escaping
***REMOVED***     is done).
***REMOVED*** @return {!goog.html.SafeHtml} The escaped text, wrapped as a SafeHtml.
***REMOVED***
goog.html.SafeHtml.htmlEscapePreservingNewlines = function(textOrHtml) {
  if (textOrHtml instanceof goog.html.SafeHtml) {
    return textOrHtml;
  }
  var html = goog.html.SafeHtml.htmlEscape(textOrHtml);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(
      goog.string.newLineToBr(goog.html.SafeHtml.unwrap(html)),
      html.getDirection());
***REMOVED***


***REMOVED***
***REMOVED*** Coerces an arbitrary object into a SafeHtml object.
***REMOVED***
***REMOVED*** If {@code textOrHtml} is already of type {@code goog.html.SafeHtml}, the same
***REMOVED*** object is returned. Otherwise, {@code textOrHtml} is coerced to string, and
***REMOVED*** HTML-escaped. If {@code textOrHtml} is of a type that implements
***REMOVED*** {@code goog.i18n.bidi.DirectionalString}, its directionality, if known, is
***REMOVED*** preserved.
***REMOVED***
***REMOVED*** @param {!goog.html.SafeHtml.TextOrHtml_} textOrHtml The text or SafeHtml to
***REMOVED***     coerce.
***REMOVED*** @return {!goog.html.SafeHtml} The resulting SafeHtml object.
***REMOVED*** @deprecated Use goog.html.SafeHtml.htmlEscape.
***REMOVED***
goog.html.SafeHtml.from = goog.html.SafeHtml.htmlEscape;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.html.SafeHtml.VALID_NAMES_IN_TAG_ = /^[a-zA-Z0-9-]+$/;


***REMOVED***
***REMOVED*** Set of attributes containing URL as defined at
***REMOVED*** http://www.w3.org/TR/html5/index.html#attributes-1.
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.html.SafeHtml.URL_ATTRIBUTES_ = goog.object.createSet('action', 'cite',
    'data', 'formaction', 'href', 'manifest', 'poster', 'src');


// TODO(user): Perhaps add <template> used by Polymer?
***REMOVED***
***REMOVED*** Set of tag names that are too dangerous.
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_ = goog.object.createSet('link',
    'script', 'style');


***REMOVED***
***REMOVED*** @private
***REMOVED*** @typedef {string|number|goog.string.Const|goog.html.SafeUrl|
***REMOVED***     goog.html.SafeStyle|goog.html.SafeStyle.PropertyMap}
***REMOVED***
goog.html.SafeHtml.AttributeValue_;


***REMOVED***
***REMOVED*** Creates a SafeHtml content consisting of a tag with optional attributes and
***REMOVED*** optional content.
***REMOVED***
***REMOVED*** For convenience tag names and attribute names are accepted as regular
***REMOVED*** strings, instead of goog.string.Const. Nevertheless, you should not pass
***REMOVED*** user-controlled values to these parameters. Note that these parameters are
***REMOVED*** syntactically validated at runtime, and invalid values will result in
***REMOVED*** an exception.
***REMOVED***
***REMOVED*** Example usage:
***REMOVED***
***REMOVED*** goog.html.SafeHtml.create('br');
***REMOVED*** goog.html.SafeHtml.create('div', {'class': 'a'});
***REMOVED*** goog.html.SafeHtml.create('p', {}, 'a');
***REMOVED*** goog.html.SafeHtml.create('p', {}, goog.html.SafeHtml.create('br'));
***REMOVED***
***REMOVED*** goog.html.SafeHtml.create('span', {
***REMOVED***   'style': {'margin': '0'}
***REMOVED*** });
***REMOVED***
***REMOVED*** @param {string} tagName The name of the tag. Only tag names consisting of
***REMOVED***     [a-zA-Z0-9-] are allowed. <link>, <script> and <style> tags are not
***REMOVED***     supported.
***REMOVED*** @param {!Object.<string, goog.html.SafeHtml.AttributeValue_>=}
***REMOVED***     opt_attributes Mapping from attribute names to their values. Only
***REMOVED***     attribute names consisting of [a-zA-Z0-9-] are allowed. Attributes with
***REMOVED***     a special meaning (e.g. on*) require goog.string.Const value, attributes
***REMOVED***     containing URL require goog.string.Const or goog.html.SafeUrl. The
***REMOVED***     "style" attribute accepts goog.html.SafeStyle or a map which will be
***REMOVED***     passed to goog.html.SafeStyle.create. Value of null or undefined causes
***REMOVED***     the attribute to be omitted. Values are HTML-escaped before usage.
***REMOVED*** @param {!goog.html.SafeHtml.TextOrHtml_|
***REMOVED***     !Array.<!goog.html.SafeHtml.TextOrHtml_>=} opt_content Content to put
***REMOVED***     inside the tag. This must be empty for void tags like <br>. Array
***REMOVED***     elements are concatenated.
***REMOVED*** @return {!goog.html.SafeHtml} The SafeHtml content with the tag.
***REMOVED*** @throws {Error} If invalid tag name, attribute name, or attribute value is
***REMOVED***     provided.
***REMOVED*** @throws {goog.asserts.AssertionError} If content for void tag is provided.
***REMOVED***
goog.html.SafeHtml.create = function(tagName, opt_attributes, opt_content) {
  if (!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(tagName)) {
    throw Error('Invalid tag name <' + tagName + '>.');
  }
  if (tagName.toLowerCase() in goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_) {
    throw Error('Tag name <' + tagName + '> is not allowed for SafeHtml.');
  }
  var dir = null;
  var result = '<' + tagName;

  if (opt_attributes) {
    for (var name in opt_attributes) {
      if (!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(name)) {
        throw Error('Invalid attribute name "' + name + '".');
      }
      var value = opt_attributes[name];
      if (value == null) {
        continue;
      }
      if (value instanceof goog.string.Const) {
        // If it's goog.string.Const, allow any valid attribute name.
        value = goog.string.Const.unwrap(value);
      } else if (name.toLowerCase() == 'style') {
        value = goog.html.SafeHtml.getStyleValue_(value);
      } else if (/^on/i.test(name)) {
        // TODO(user): Disallow more attributes with a special meaning.
        throw Error('Attribute "' + name +
            '" requires goog.string.Const value, "' + value + '" given.');
      } else if (value instanceof goog.html.SafeUrl) {
        // If it's goog.html.SafeUrl, allow any non-JavaScript attribute name.
        value = goog.html.SafeUrl.unwrap(value);
      } else if (name.toLowerCase() in goog.html.SafeHtml.URL_ATTRIBUTES_) {
        throw Error('Attribute "' + name +
            '" requires goog.string.Const or goog.html.SafeUrl value, "' +
            value + '" given.');
      }
      goog.asserts.assert(goog.isString(value) || goog.isNumber(value),
          'String or number value expected, got ' +
          (typeof value) + ' with value: ' + value);
      result += ' ' + name + '="' + goog.string.htmlEscape(String(value)) + '"';
    }
  }

  var content = opt_content;
  if (!goog.isDef(content)) {
    content = [];
  } else if (!goog.isArray(content)) {
    content = [content];
  }

  if (goog.dom.tags.isVoidTag(tagName.toLowerCase())) {
    goog.asserts.assert(!content.length,
        'Void tag <' + tagName + '> does not allow content.');
    result += '>';
  } else {
    var html = goog.html.SafeHtml.concat(content);
    result += '>' + goog.html.SafeHtml.unwrap(html) + '</' + tagName + '>';
    dir = html.getDirection();
  }

  var dirAttribute = opt_attributes && opt_attributes['dir'];
  if (dirAttribute) {
    if (/^(ltr|rtl|auto)$/i.test(dirAttribute)) {
      // If the tag has the "dir" attribute specified then its direction is
      // neutral because it can be safely used in any context.
      dir = goog.i18n.bidi.Dir.NEUTRAL;
    } else {
      dir = null;
    }
  }

  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(
      result, dir);
***REMOVED***


***REMOVED***
***REMOVED*** Gets value allowed in "style" attribute.
***REMOVED*** @param {goog.html.SafeHtml.AttributeValue_} value It could be SafeStyle or a
***REMOVED***     map which will be passed to goog.html.SafeStyle.create.
***REMOVED*** @return {string} Unwrapped value.
***REMOVED*** @throws {Error} If string value is given.
***REMOVED*** @private
***REMOVED***
goog.html.SafeHtml.getStyleValue_ = function(value) {
  if (!goog.isObject(value)) {
    throw Error('The "style" attribute requires goog.html.SafeStyle or map ' +
        'of style properties, ' + (typeof value) + ' given: ' + value);
  }
  if (!(value instanceof goog.html.SafeStyle)) {
    // Process the property bag into a style object.
    value = goog.html.SafeStyle.create(value);
  }
  return goog.html.SafeStyle.unwrap(value);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a SafeHtml content with known directionality consisting of a tag with
***REMOVED*** optional attributes and optional content.
***REMOVED*** @param {!goog.i18n.bidi.Dir} dir Directionality.
***REMOVED*** @param {string} tagName
***REMOVED*** @param {!Object.<string, goog.html.SafeHtml.AttributeValue_>=} opt_attributes
***REMOVED*** @param {!goog.html.SafeHtml.TextOrHtml_|
***REMOVED***     !Array.<!goog.html.SafeHtml.TextOrHtml_>=} opt_content
***REMOVED*** @return {!goog.html.SafeHtml} The SafeHtml content with the tag.
***REMOVED***
goog.html.SafeHtml.createWithDir = function(dir, tagName, opt_attributes,
    opt_content) {
  var html = goog.html.SafeHtml.create(tagName, opt_attributes, opt_content);
  html.dir_ = dir;
  return html;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new SafeHtml object by concatenating the values.
***REMOVED*** @param {...!goog.html.SafeHtml.TextOrHtml_|
***REMOVED***     !Array.<!goog.html.SafeHtml.TextOrHtml_>} var_args Elements of array
***REMOVED***     arguments would be processed recursively.
***REMOVED*** @return {!goog.html.SafeHtml}
***REMOVED***
goog.html.SafeHtml.concat = function(var_args) {
  var dir = goog.i18n.bidi.Dir.NEUTRAL;
  var content = '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** @param {!goog.html.SafeHtml.TextOrHtml_|
  ***REMOVED***     !Array.<!goog.html.SafeHtml.TextOrHtml_>} argument
 ***REMOVED*****REMOVED***
  var addArgument = function(argument) {
    if (goog.isArray(argument)) {
      goog.array.forEach(argument, addArgument);
    } else {
      var html = goog.html.SafeHtml.htmlEscape(argument);
      content += goog.html.SafeHtml.unwrap(html);
      var htmlDir = html.getDirection();
      if (dir == goog.i18n.bidi.Dir.NEUTRAL) {
        dir = htmlDir;
      } else if (htmlDir != goog.i18n.bidi.Dir.NEUTRAL && dir != htmlDir) {
        dir = null;
      }
    }
 ***REMOVED*****REMOVED***

  goog.array.forEach(arguments, addArgument);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(
      content, dir);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new SafeHtml object with known directionality by concatenating the
***REMOVED*** values.
***REMOVED*** @param {!goog.i18n.bidi.Dir} dir Directionality.
***REMOVED*** @param {...!goog.html.SafeHtml.TextOrHtml_|
***REMOVED***     !Array.<!goog.html.SafeHtml.TextOrHtml_>} var_args Elements of array
***REMOVED***     arguments would be processed recursively.
***REMOVED*** @return {!goog.html.SafeHtml}
***REMOVED***
goog.html.SafeHtml.concatWithDir = function(dir, var_args) {
  var html = goog.html.SafeHtml.concat(goog.array.slice(arguments, 1));
  html.dir_ = dir;
  return html;
***REMOVED***


***REMOVED***
***REMOVED*** Type marker for the SafeHtml type, used to implement additional run-time
***REMOVED*** type checking.
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {***REMOVED***


***REMOVED***
***REMOVED*** Utility method to create SafeHtml instances.
***REMOVED***
***REMOVED*** This function is considered "package private", i.e. calls (using "suppress
***REMOVED*** visibility") from other files within this package are considered acceptable.
***REMOVED*** DO NOT call this function from outside the goog.html package; use appropriate
***REMOVED*** wrappers instead.
***REMOVED***
***REMOVED*** @param {string} html The string to initialize the SafeHtml object with.
***REMOVED*** @param {?goog.i18n.bidi.Dir} dir The directionality of the SafeHtml to be
***REMOVED***     constructed, or null if unknown.
***REMOVED*** @return {!goog.html.SafeHtml} The initialized SafeHtml object.
***REMOVED*** @private
***REMOVED***
goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_ = function(
    html, dir) {
  var safeHtml = new goog.html.SafeHtml();
  safeHtml.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = html;
  safeHtml.dir_ = dir;
  return safeHtml;
***REMOVED***


***REMOVED***
***REMOVED*** A SafeHtml instance corresponding to the empty string.
***REMOVED*** @const {!goog.html.SafeHtml}
***REMOVED***
goog.html.SafeHtml.EMPTY =
    goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(
        '', goog.i18n.bidi.Dir.NEUTRAL);
