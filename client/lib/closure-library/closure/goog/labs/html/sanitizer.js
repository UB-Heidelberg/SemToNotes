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
***REMOVED*** @fileoverview
***REMOVED*** An HTML sanitizer that takes untrusted HTML snippets and produces
***REMOVED*** safe HTML by filtering/rewriting tags and attributes that contain
***REMOVED*** high-privilege instructions.
***REMOVED***


goog.provide('goog.labs.html.Sanitizer');

goog.require('goog.asserts');
goog.require('goog.html.SafeUrl');
goog.require('goog.labs.html.attributeRewriterPresubmitWorkaround');
goog.require('goog.labs.html.scrubber');
goog.require('goog.object');
goog.require('goog.string');



***REMOVED***
***REMOVED*** A sanitizer that converts untrusted, messy HTML into more regular HTML
***REMOVED*** that cannot abuse high-authority constructs like the ability to execute
***REMOVED*** arbitrary JavaScript.
***REMOVED***
***REMOVED***
goog.labs.html.Sanitizer = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Maps the lower-case names of allowed elements to attribute white-lists.
  ***REMOVED*** An attribute white-list maps lower-case attribute names to functions
  ***REMOVED*** from values to values or undefined to disallow.
  ***REMOVED***
  ***REMOVED*** The special element name {@code "*"} contains a white-list of attributes
  ***REMOVED*** allowed on any tag, which is useful for attributes like {@code title} and
  ***REMOVED*** {@code id} which are widely available with element-agnostic meanings.
  ***REMOVED*** It should not be used for attributes like {@code type} whose meaning
  ***REMOVED*** differs based on the element on which it appears:
  ***REMOVED*** e.g. {@code <input type=text>} vs {@code <style type=text/css>}.
  ***REMOVED***
  ***REMOVED*** @type {!Object.<string, !Object.<string, goog.labs.html.AttributeRewriter>>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.whitelist_ = goog.labs.html.Sanitizer.createBlankObject_();
  this.whitelist_['*'] = goog.labs.html.Sanitizer.createBlankObject_();

  // To use the sanitizer, we build inputs for the scrubber.
  // These inputs are invalidated by changes to the policy, so we (re)build them
  // lazily.

 ***REMOVED*****REMOVED***
  ***REMOVED*** Maps element names to {@code true} so the scrubber does not have to do
  ***REMOVED*** own property checks for every tag filtered.
  ***REMOVED***
  ***REMOVED*** Built lazily and invalidated when the white-list is modified.
  ***REMOVED***
  ***REMOVED*** @type {Object.<string, boolean>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.allowedElementSet_ = null;
***REMOVED***


// TODO(user): Should the return type be goog.html.SafeHtml?
// If we receive a safe HTML string as input, should we simply rebalance
// tags?
***REMOVED***
***REMOVED*** Yields a string of safe HTML that contains all and only the safe
***REMOVED*** text-nodes and elements in the input.
***REMOVED***
***REMOVED*** <p>
***REMOVED*** For the purposes of this function, "safe" is defined thus:
***REMOVED*** <ul>
***REMOVED***   <li>Contains only elements explicitly allowed via {@code this.allow*}.
***REMOVED***   <li>Contains only attributes explicitly allowed via {@code this.allow*}
***REMOVED***       and having had all relevant transformations applied.
***REMOVED***   <li>Contains an end tag for all and only non-void open tags.
***REMOVED***   <li>Tags nest per XHTML rules.
***REMOVED***   <li>Tags do not nest beyond a finite but fairly large level.
***REMOVED*** </ul>
***REMOVED***
***REMOVED*** @param {!string} unsafeHtml A string of HTML which need not originate with
***REMOVED***    a trusted source.
***REMOVED*** @return {!string} A string of HTML that contains only tags and attributes
***REMOVED***    explicitly allowed by this sanitizer, and with end tags for all and only
***REMOVED***    non-void elements.
***REMOVED***
goog.labs.html.Sanitizer.prototype.sanitize = function(unsafeHtml) {
  var unsafeHtmlString = '' + unsafeHtml;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!Object.<string, !Object.<string, goog.labs.html.AttributeRewriter>>}
 ***REMOVED*****REMOVED***
  var whitelist = this.whitelist_;
  if (!this.allowedElementSet_) {
    this.allowedElementSet_ = goog.object.createSet(
        // This can lead to '*' in the allowed element set, but the scrubber
        // will not parse "<*" as a tag beginning.
        goog.object.getKeys(whitelist));
  }

  return goog.labs.html.scrubber.scrub(
      this.allowedElementSet_, whitelist, unsafeHtmlString);
***REMOVED***


***REMOVED***
***REMOVED*** Adds the element names to the white-list of elements that are allowed
***REMOVED*** in the safe HTML output.
***REMOVED*** <p>
***REMOVED*** Allowing elements does not, by itself, allow any attributes on
***REMOVED*** those elements.
***REMOVED***
***REMOVED*** @param {...!string} var_args element names that should be allowed in the
***REMOVED***     safe HTML output.
***REMOVED*** @return {!goog.labs.html.Sanitizer} {@code this}.
***REMOVED***
goog.labs.html.Sanitizer.prototype.allowElements = function(var_args) {
  this.allowedElementSet_ = null;  // Invalidate.
  var whitelist = this.whitelist_;
  for (var i = 0; i < arguments.length; ++i) {
    var elementName = arguments[i].toLowerCase();

    goog.asserts.assert(
        goog.labs.html.Sanitizer.isValidHtmlName_(elementName), elementName);

    if (!Object.prototype.hasOwnProperty.call(whitelist, elementName)) {
      whitelist[elementName] = goog.labs.html.Sanitizer.createBlankObject_();
    }
  }
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Allows in the sanitized output
***REMOVED*** <tt>&lt;<i>element</i> <i>attr</i>="..."&gt;</tt>
***REMOVED*** when <i>element</i> is in {@code elementNames} and
***REMOVED*** <i>attrNames</i> is in {@code attrNames}.
***REMOVED***
***REMOVED*** If specified, {@code opt_valueXform} is a function that takes the
***REMOVED*** HTML-entity-decoded attribute value, and can choose to disallow the
***REMOVED*** attribute by returning {@code null} or substitute a new value
***REMOVED*** by returning a string with the new value.
***REMOVED***
***REMOVED*** @param {!Array.<string>|string} elementNames names (or name) on which the
***REMOVED***     attributes are allowed.
***REMOVED***
***REMOVED***     Element names should be allowed via {@code allowElements(...)} prior
***REMOVED***     to white-listing attributes.
***REMOVED***
***REMOVED***     The special element name {@code "*"} has the same meaning as in CSS
***REMOVED***     selectors: it can be used to white-list attributes like {@code title}
***REMOVED***     and {@code id} which are widely available with element-agnostic
***REMOVED***     meanings.
***REMOVED***
***REMOVED***     It should not be used for attributes like {@code type} whose meaning
***REMOVED***     differs based on the element on which it appears:
***REMOVED***     e.g. {@code <input type=text>} vs {@code <style type=text/css>}.
***REMOVED***
***REMOVED*** @param {!Array.<string>|string} attrNames names (or name) of the attribute
***REMOVED***     that should be allowed.
***REMOVED***
***REMOVED*** @param {goog.labs.html.AttributeRewriter=} opt_rewriteValue A function
***REMOVED***     that receives the HTML-entity-decoded attribute value and can return
***REMOVED***     {@code null} to disallow the attribute entirely or the value for the
***REMOVED***     attribute as a string.
***REMOVED***     <p>
***REMOVED***     The default is the identity function ({@code function(x){return x}}),
***REMOVED***     and the value rewriter is composed with an attribute specific handler:
***REMOVED***     <table>
***REMOVED***      <tr>
***REMOVED***        <th>href, src</th>
***REMOVED***        <td>Requires that the value be an absolute URL with a protocol in
***REMOVED***            (http, https, mailto) or a protocol relative URL.
***REMOVED***      </tr>
***REMOVED***     </table>
***REMOVED***
***REMOVED*** @return {!goog.labs.html.Sanitizer} {@code this}.
***REMOVED***
goog.labs.html.Sanitizer.prototype.allowAttributes =
    function(elementNames, attrNames, opt_rewriteValue) {
  if (!goog.isArray(elementNames)) {
    elementNames = [elementNames];
  }
  if (!goog.isArray(attrNames)) {
    attrNames = [attrNames];
  }
  goog.asserts.assert(
      !opt_rewriteValue || 'function' === typeof opt_rewriteValue,
      'opt_rewriteValue should be a function');

  var whitelist = this.whitelist_;
  for (var ei = 0; ei < elementNames.length; ++ei) {
    var elementName = elementNames[ei].toLowerCase();
    goog.asserts.assert(
        goog.labs.html.Sanitizer.isValidHtmlName_(elementName) ||
        '*' === elementName,
        elementName);
    // If the element has not been white-listed then panic.
    // TODO(user): allow allow{Elements,Attributes} to be called in any
    // order if someone needs it.
    if (!Object.prototype.hasOwnProperty.call(whitelist, elementName)) {
      throw new Error(elementName);
    }
    var attrWhitelist = whitelist[elementName];
    for (var ai = 0, an = attrNames.length; ai < an; ++ai) {
      var attrName = attrNames[ai].toLowerCase();
      goog.asserts.assert(
          goog.labs.html.Sanitizer.isValidHtmlName_(attrName), attrName);

      // If the value has already been allowed, then chain the rewriters
      // so that both white-listers concerns are met.
      // We do not use the default rewriter here since it should have
      // been introduced by the call that created the initial white-list
      // entry.
      attrWhitelist[attrName] = goog.labs.html.Sanitizer.chain_(
          opt_rewriteValue || goog.labs.html.Sanitizer.valueIdentity_,
          Object.prototype.hasOwnProperty.call(attrWhitelist, attrName) ?
              attrWhitelist[attrName] :
              goog.labs.html.Sanitizer.defaultRewriterForAttr_(attrName));
    }
  }
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** A new object that is as blank as possible.
***REMOVED***
***REMOVED*** Using {@code Object.create} to create an object with
***REMOVED*** no prototype speeds up whitelist access since there's fewer prototypes
***REMOVED*** to fall-back to for a common case where an element is not in the
***REMOVED*** white-list, and reduces the chance of confusing a member of
***REMOVED*** {@code Object.prototype} with a whitelist entry.
***REMOVED***
***REMOVED*** @return {!Object.<string, ?>} a reference to a newly allocated object that
***REMOVED***    does not alias any reference that existed prior.
***REMOVED*** @private
***REMOVED***
goog.labs.html.Sanitizer.createBlankObject_ = function() {
  return (Object.create || Object)(null);
***REMOVED***


***REMOVED***
***REMOVED*** HTML element and attribute names may be almost arbitrary strings, but the
***REMOVED*** sanitizer is more restrictive as to what can be white-listed.
***REMOVED***
***REMOVED*** Since HTML is case-insensitive, only lower-case identifiers composed of
***REMOVED*** ASCII letters, digits, and select punctuation are allowed.
***REMOVED***
***REMOVED*** @param {string} name
***REMOVED*** @return {boolean} true iff name is a valid white-list key.
***REMOVED*** @private
***REMOVED***
goog.labs.html.Sanitizer.isValidHtmlName_ = function(name) {
  return 'string' === typeof name &&  // Names must be strings.
      // Names must be lower-case and ASCII identifier chars only.
      /^[a-z][a-z0-9\-:]*$/.test(name);
***REMOVED***


***REMOVED***
***REMOVED*** @param  {goog.labs.html.AttributeValue} x
***REMOVED*** @return {goog.labs.html.AttributeValue}
***REMOVED*** @private
***REMOVED***
goog.labs.html.Sanitizer.valueIdentity_ = function(x) {
  return x;
***REMOVED***


***REMOVED***
***REMOVED*** @param  {goog.labs.html.AttributeValue} x
***REMOVED*** @return {null}
***REMOVED*** @private
***REMOVED***
goog.labs.html.Sanitizer.disallow_ = function(x) {
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Chains attribute rewriters.
***REMOVED***
***REMOVED*** @param  {goog.labs.html.AttributeRewriter} f
***REMOVED*** @param  {goog.labs.html.AttributeRewriter} g
***REMOVED*** @return {goog.labs.html.AttributeRewriter}
***REMOVED***      a function that return g(f(x)) or null if f(x) is null.
***REMOVED*** @private
***REMOVED***
goog.labs.html.Sanitizer.chain_ = function(f, g) {
  // Sometimes white-listing code ends up allowing things multiple times.
  if (f === goog.labs.html.Sanitizer.valueIdentity_) {
    return g;
  }
  if (g === goog.labs.html.Sanitizer.valueIdentity_) {
    return f;
  }
  // If someone tries to white-list a really problematic value, we reject
  // it by returning disallow_.  Disallow it quickly.
  if (f === goog.labs.html.Sanitizer.disallow_) {
    return f;
  }
  if (g === goog.labs.html.Sanitizer.disallow_) {
    return g;
  }
  return (
     ***REMOVED*****REMOVED***
      ***REMOVED*** @param {goog.labs.html.AttributeValue} x
      ***REMOVED*** @return {goog.labs.html.AttributeValue}
     ***REMOVED*****REMOVED***
      function(x) {
        var y = f(x);
        return y != null ? g(y) : null;
      });
***REMOVED***


***REMOVED***
***REMOVED*** Given an attribute name, returns a value rewriter that enforces some
***REMOVED*** minimal safety properties.
***REMOVED***
***REMOVED*** <p>
***REMOVED*** For url atributes, it checks that any protocol is on a safe set that
***REMOVED*** doesn't allow script execution.
***REMOVED*** <p>
***REMOVED*** It also blanket disallows CSS and event handler attributes.
***REMOVED***
***REMOVED*** @param  {string} attrName lower-cased attribute name.
***REMOVED*** @return {goog.labs.html.AttributeRewriter}
***REMOVED*** @private
***REMOVED***
goog.labs.html.Sanitizer.defaultRewriterForAttr_ = function(attrName) {
  if ('href' === attrName || 'src' === attrName) {
    return goog.labs.html.Sanitizer.checkUrl_;
  } else if ('style' === attrName || 'on' === attrName.substr(0, 2)) {
    // TODO(user): delegate to a CSS sanitizer if one is available.
    return goog.labs.html.Sanitizer.disallow_;
  }
  return goog.labs.html.Sanitizer.valueIdentity_;
***REMOVED***


***REMOVED***
***REMOVED*** Applied automatically to URL attributes to check that they are safe as per
***REMOVED*** {@link SafeUrl}.
***REMOVED***
***REMOVED*** @param {goog.labs.html.AttributeValue} attrValue a decoded attribute value.
***REMOVED*** @return {goog.html.SafeUrl | null} a URL that is equivalent to the
***REMOVED***    input or {@code null} if the input is not a safe URL.
***REMOVED*** @private
***REMOVED***
goog.labs.html.Sanitizer.checkUrl_ = function(attrValue) {
  if (attrValue == null) {
    return null;
  }
 ***REMOVED*****REMOVED*** @type {!goog.html.SafeUrl}***REMOVED***
  var safeUrl;
  if (attrValue instanceof goog.html.SafeUrl) {
    safeUrl =***REMOVED*****REMOVED*** @type {!goog.html.SafeUrl}***REMOVED*** (attrValue);
  } else {
    if (typeof attrValue === 'string') {
      // Whitespace at the ends of URL-valued attributes in HTML is ignored.
      attrValue = goog.string.trim(***REMOVED*** @type {string}***REMOVED*** (attrValue));
    }
    safeUrl = goog.html.SafeUrl.sanitize(
       ***REMOVED*****REMOVED*** @type {!goog.string.TypedString | string}***REMOVED*** (attrValue));
  }
  if (goog.html.SafeUrl.unwrap(safeUrl) == goog.html.SafeUrl.INNOCUOUS_STRING) {
    return null;
  } else {
    return safeUrl;
  }
***REMOVED***


goog.labs.html.attributeRewriterPresubmitWorkaround();
