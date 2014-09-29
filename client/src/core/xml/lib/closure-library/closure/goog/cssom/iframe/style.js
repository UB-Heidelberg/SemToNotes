// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
// All Rights Reserved.

***REMOVED***
***REMOVED*** @fileoverview Provides utility routines for copying modified
***REMOVED*** {@code CSSRule} objects from the parent document into iframes so that any
***REMOVED*** content in the iframe will be styled as if it was inline in the parent
***REMOVED*** document.
***REMOVED***
***REMOVED*** <p>
***REMOVED*** For example, you might have this CSS rule:
***REMOVED***
***REMOVED*** #content .highlighted { background-color: yellow; }
***REMOVED***
***REMOVED*** And this DOM structure:
***REMOVED***
***REMOVED*** <div id="content">
***REMOVED***   <iframe />
***REMOVED*** </div>
***REMOVED***
***REMOVED*** Then inside the iframe you have:
***REMOVED***
***REMOVED*** <body>
***REMOVED*** <div class="highlighted">
***REMOVED*** </body>
***REMOVED***
***REMOVED*** If you copied the CSS rule directly into the iframe, it wouldn't match the
***REMOVED*** .highlighted div. So we rewrite the original stylesheets based on the
***REMOVED*** context where the iframe is going to be inserted. In this case the CSS
***REMOVED*** selector would be rewritten to:
***REMOVED***
***REMOVED*** body .highlighted { background-color: yellow; }
***REMOVED*** </p>
***REMOVED***
***REMOVED***


goog.provide('goog.cssom.iframe.style');

goog.require('goog.cssom');
goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.classes');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Regexp that matches "a", "a:link", "a:visited", etc.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.selectorPartAnchorRegex_ =
    /a(:(link|visited|active|hover))?/;


***REMOVED***
***REMOVED*** Delimiter between selectors (h1, h2)
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.SELECTOR_DELIMITER_ = ',';


***REMOVED***
***REMOVED*** Delimiter between selector parts (.main h1)
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.SELECTOR_PART_DELIMITER_ = ' ';


***REMOVED***
***REMOVED*** Delimiter marking the start of a css rules section ( h1 { )
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.DECLARATION_START_DELIMITER_ = '{';


***REMOVED***
***REMOVED*** Delimiter marking the end of a css rules section ( } )
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.DECLARATION_END_DELIMITER_ = '}\n';



***REMOVED***
***REMOVED*** Class representing a CSS rule set. A rule set is something like this:
***REMOVED*** h1, h2 { font-family: Arial; color: red; }
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.CssRuleSet_ = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Text of the declarations inside the rule set.
  ***REMOVED*** For example: 'font-family: Arial; color: red;'
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.declarationText = '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** Array of CssSelector objects, one for each selector.
  ***REMOVED*** Example: [h1, h2]
  ***REMOVED*** @type {Array.<goog.cssom.iframe.style.CssSelector_>}
 ***REMOVED*****REMOVED***
  this.selectors = [];
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the rule set from a {@code CSSRule}.
***REMOVED***
***REMOVED*** @param {CSSRule} cssRule The {@code CSSRule} to initialize from.
***REMOVED*** @return {boolean} True if initialization succeeded. We only support
***REMOVED***     {@code CSSStyleRule} and {@code CSSFontFaceRule} objects.
***REMOVED***
goog.cssom.iframe.style.CssRuleSet_.prototype.initializeFromCssRule =
    function(cssRule) {
  var ruleStyle = cssRule.style; // Cache object for performance.
  if (!ruleStyle) {
    return false;
  }
  var selector;
  var declarations;
  if (ruleStyle &&
      (selector = cssRule.selectorText) &&
      (declarations = ruleStyle.cssText)) {
    // IE get confused about cssText context if a stylesheet uses the
    // mid-pass hack, and it ends up with an open comment (/*) but no
    // closing comment. This will effectively comment out large parts
    // of generated stylesheets later. This errs on the safe side by
    // always tacking on an empty comment to force comments to be closed
    // We used to check for a troublesome open comment using a regular
    // expression, but it's faster not to check and always do this.
    if (goog.userAgent.IE) {
      declarations += '***REMOVED*****REMOVED***';
    }
  } else if (cssRule.cssText) {
    var cssSelectorMatch = /([^\{]+)\{/;
    var endTagMatch = /\}[^\}]*$/g;
    // cssRule.cssText contains both selector and declarations:
    // parse them out.
    selector = cssSelectorMatch.exec(cssRule.cssText)[1];
    // Remove selector, {, and trailing }.
    declarations = cssRule.cssText.replace(cssSelectorMatch, '').replace(
        endTagMatch, '');
  }
  if (selector) {
    this.setSelectorsFromString(selector);
    this.declarationText = declarations;
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Parses a selectors string (which may contain multiple comma-delimited
***REMOVED*** selectors) and loads the results into this.selectors.
***REMOVED*** @param {string} selectorsString String containing selectors.
***REMOVED***
goog.cssom.iframe.style.CssRuleSet_.prototype.setSelectorsFromString =
    function(selectorsString) {
  this.selectors = [];
  var selectors = selectorsString.split(/,\s*/gm);
  for (var i = 0; i < selectors.length; i++) {
    var selector = selectors[i];
    if (selector.length > 0) {
      this.selectors.push(new goog.cssom.iframe.style.CssSelector_(selector));
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Make a copy of this ruleset.
***REMOVED*** @return {goog.cssom.iframe.style.CssRuleSet_} A new CssRuleSet containing
***REMOVED***     the same data as this one.
***REMOVED***
goog.cssom.iframe.style.CssRuleSet_.prototype.clone = function() {
  var newRuleSet = new goog.cssom.iframe.style.CssRuleSet_();
  newRuleSet.selectors = this.selectors.concat();
  newRuleSet.declarationText = this.declarationText;
  return newRuleSet;
***REMOVED***


***REMOVED***
***REMOVED*** Set the declaration text with properties from a given object.
***REMOVED*** @param {Object} sourceObject Object whose properties and values should
***REMOVED***     be used to generate the declaration text.
***REMOVED*** @param {boolean=} opt_important Whether !important should be added to each
***REMOVED***     declaration.
***REMOVED***
goog.cssom.iframe.style.CssRuleSet_.prototype.setDeclarationTextFromObject =
    function(sourceObject, opt_important) {
  var stringParts = [];
  // TODO(user): for ... in is costly in IE6 (extra garbage collection).
  for (var prop in sourceObject) {
    var value = sourceObject[prop];
    if (value) {
      stringParts.push(prop,
                       ':',
                       value, (opt_important ? ' !important' : ''),
                       ';');
    }
  }
  this.declarationText = stringParts.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Serializes this CssRuleSet_ into an array as a series of strings.
***REMOVED*** The array can then be join()-ed to get a string representation
***REMOVED*** of this ruleset.
***REMOVED*** @param {Array.<string>} array The array to which to append strings.
***REMOVED***
goog.cssom.iframe.style.CssRuleSet_.prototype.writeToArray = function(array) {
  var selectorCount = this.selectors.length;
  var matchesAnchorTag = false;
  for (var i = 0; i < selectorCount; i++) {
    var selectorParts = this.selectors[i].parts;
    var partCount = selectorParts.length;
    for (var j = 0; j < partCount; j++) {
      array.push(selectorParts[j].inputString_,
                 goog.cssom.iframe.style.SELECTOR_PART_DELIMITER_);
    }
    if (i < (selectorCount - 1)) {
      array.push(goog.cssom.iframe.style.SELECTOR_DELIMITER_);
    }
    if (goog.userAgent.GECKO && !goog.userAgent.isVersion('1.9a')) {
      // In Gecko pre-1.9 (Firefox 2 and lower) we need to add !important
      // to rulesets that match "A" tags, otherwise Gecko's built-in
      // stylesheet will take precedence when designMode is on.
      matchesAnchorTag = matchesAnchorTag ||
          goog.cssom.iframe.style.selectorPartAnchorRegex_.test(
              selectorParts[partCount - 1].inputString_);
    }
  }
  var declarationText = this.declarationText;
  if (matchesAnchorTag) {
    declarationText = goog.cssom.iframe.style.makeColorRuleImportant_(
        declarationText);
  }
  array.push(goog.cssom.iframe.style.DECLARATION_START_DELIMITER_,
             declarationText,
             goog.cssom.iframe.style.DECLARATION_END_DELIMITER_);
***REMOVED***


***REMOVED***
***REMOVED*** Regexp that matches "color: value;".
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.colorImportantReplaceRegex_ =
    /(^|;|{)\s*color:([^;]+);/g;


***REMOVED***
***REMOVED*** Adds !important to a css color: rule
***REMOVED*** @param {string} cssText Text of the CSS rule(s) to modify.
***REMOVED*** @return {string} Text with !important added to the color: rule if found.
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.makeColorRuleImportant_ = function(cssText) {
  // Replace to insert a "! important" string.
  return cssText.replace(goog.cssom.iframe.style.colorImportantReplaceRegex_,
                         '$1 color: $2 ! important; ');
***REMOVED***



***REMOVED***
***REMOVED*** Represents a single CSS selector, as described in
***REMOVED*** http://www.w3.org/TR/REC-CSS2/selector.html
***REMOVED*** Currently UNSUPPORTED are the following selector features:
***REMOVED*** <ul>
***REMOVED***   <li>pseudo-classes (:hover)
***REMOVED***   <li>child selectors (div > h1)
***REMOVED***   <li>adjacent sibling selectors (div + h1)
***REMOVED***   <li>attribute selectors (input[type=submit])
***REMOVED*** </ul>
***REMOVED*** @param {string=} opt_selectorString String containing selectors to parse.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.CssSelector_ = function(opt_selectorString) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Array of CssSelectorPart objects representing the parts of this selector
  ***REMOVED*** Example: for the selector 'body h1' the parts would be [body, h1].
  ***REMOVED*** @type {Array.<goog.cssom.iframe.style.CssSelectorPart_>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.parts_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Object to track ancestry matches to speed up repeatedly testing this
  ***REMOVED*** CssSelector against the same NodeAncestry object.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.ancestryMatchCache_ = {***REMOVED***
  if (opt_selectorString) {
    this.setPartsFromString_(opt_selectorString);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Parses a selector string into individual parts.
***REMOVED*** @param {string} selectorString A string containing a CSS selector.
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.CssSelector_.prototype.setPartsFromString_ =
    function(selectorString) {
  var parts = [];
  var selectorPartStrings = selectorString.split(/\s+/gm);
  for (var i = 0; i < selectorPartStrings.length; i++) {
    if (!selectorPartStrings[i]) {
      continue; // Skip empty strings.
    }
    var part = new goog.cssom.iframe.style.CssSelectorPart_(
        selectorPartStrings[i]);
    parts.push(part);
  }
  this.parts = parts;
***REMOVED***


***REMOVED***
***REMOVED*** Tests to see what part of a DOM element hierarchy would be matched by
***REMOVED*** this selector, and returns the indexes of the matching element and matching
***REMOVED*** selector part.
***REMOVED*** <p>
***REMOVED*** For example, given this hierarchy:
***REMOVED***   document > html > body > div.content > div.sidebar > p
***REMOVED*** and this CSS selector:
***REMOVED***   body div.sidebar h1
***REMOVED*** This would return {elementIndex: 4, selectorPartIndex: 1},
***REMOVED*** indicating that the element at index 4 matched
***REMOVED*** the css selector at index 1.
***REMOVED*** </p>
***REMOVED*** @param {goog.cssom.iframe.style.NodeAncestry_} elementAncestry Object
***REMOVED***     representing an element and its ancestors.
***REMOVED*** @return {Object} Object with the properties elementIndex and
***REMOVED***     selectorPartIndex, or null if there was no match.
***REMOVED***
goog.cssom.iframe.style.CssSelector_.prototype.matchElementAncestry =
    function(elementAncestry) {

  var ancestryUid = elementAncestry.uid;
  if (this.ancestryMatchCache_[ancestryUid]) {
    return this.ancestryMatchCache_[ancestryUid];
  }

  // Walk through the selector parts and see how far down the element hierarchy
  // we can go while matching the selector parts.
  var elementIndex = 0;
  var match = null;
  var selectorPart = null;
  var lastSelectorPart = null;
  var ancestorNodes = elementAncestry.nodes;
  var ancestorNodeCount = ancestorNodes.length;

  for (var i = 0; i <= this.parts.length; i++) {
    selectorPart = this.parts[i];
    while (elementIndex < ancestorNodeCount) {
      var currentElementInfo = ancestorNodes[elementIndex];
      if (selectorPart &&
          selectorPart.testElement(currentElementInfo)) {
        match = {
          elementIndex: elementIndex,
          selectorPartIndex: i
       ***REMOVED*****REMOVED***
        elementIndex++;
        break;
      } else if (lastSelectorPart &&
                 lastSelectorPart.testElement(currentElementInfo)) {
        match = {
          elementIndex: elementIndex,
          selectorPartIndex: i - 1
       ***REMOVED*****REMOVED***
      }
      elementIndex++;
    }
    lastSelectorPart = selectorPart;
  }
  this.ancestryMatchCache_[ancestryUid] = match;
  return match;
***REMOVED***



***REMOVED***
***REMOVED*** Represents one part of a CSS Selector. For example in the selector
***REMOVED*** 'body #foo .bar', body, #foo, and .bar would be considered selector parts.
***REMOVED*** In the official CSS spec these are called "simple selectors".
***REMOVED*** @param {string} selectorPartString A string containing the selector part
***REMOVED***     in css format.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.CssSelectorPart_ = function(selectorPartString) {
  // Only one CssSelectorPart instance should exist for a given string.
  var cacheEntry = goog.cssom.iframe.style.CssSelectorPart_.instances_[
      selectorPartString];
  if (cacheEntry) {
    return cacheEntry;
  }

  // Optimization to avoid the more-expensive lookahead.
  var identifiers;
  if (selectorPartString.match(/[#\.]/)) {
    // Lookahead regexp, won't work on IE 5.0.
    identifiers = selectorPartString.split(/(?=[#\.])/);
  } else {
    identifiers = [selectorPartString];
  }
  var properties = {***REMOVED***
  for (var i = 0; i < identifiers.length; i++) {
    var identifier = identifiers[i];
    if (identifier.charAt(0) == '.') {
      properties.className = identifier.substring(1, identifier.length);
    } else if (identifier.charAt(0) == '#') {
      properties.id = identifier.substring(1, identifier.length);
    } else {
      properties.tagName = identifier.toUpperCase();
    }
  }
  this.inputString_ = selectorPartString;
  this.matchProperties_ = properties;
  this.testedElements_ = {***REMOVED***
  goog.cssom.iframe.style.CssSelectorPart_.instances_[selectorPartString] =
      this;
***REMOVED***


***REMOVED***
***REMOVED*** Cache of existing CssSelectorPart_ instances.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.CssSelectorPart_.instances_ = {***REMOVED***


***REMOVED***
***REMOVED*** Test whether an element matches this selector part, considered in isolation.
***REMOVED*** @param {Object} elementInfo Element properties to test.
***REMOVED*** @return {boolean} Whether the element matched.
***REMOVED***
goog.cssom.iframe.style.CssSelectorPart_.prototype.testElement =
    function(elementInfo) {

  var elementUid = elementInfo.uid;
  var cachedMatch = this.testedElements_[elementUid];
  if (typeof cachedMatch != 'undefined') {
    return cachedMatch;
  }

  var matchProperties = this.matchProperties_;
  var testTag = matchProperties.tagName;
  var testClass = matchProperties.className;
  var testId = matchProperties.id;

  var matched = true;
  if (testTag && testTag != '*' && testTag != elementInfo.nodeName) {
    matched = false;
  } else if (testId && testId != elementInfo.id) {
    matched = false;
  } else if (testClass &&
             !elementInfo.classNames[testClass]) {
    matched = false;
  }

  this.testedElements_[elementUid] = matched;
  return matched;
***REMOVED***



***REMOVED***
***REMOVED*** Represents an element and all its parent/ancestor nodes.
***REMOVED*** This class exists as an optimization so we run tests on an element
***REMOVED*** hierarchy multiple times without walking the dom each time.
***REMOVED*** @param {Element} el The DOM element whose ancestry should be stored.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.NodeAncestry_ = function(el) {
  var node = el;
  var nodeUid = goog.getUid(node);

  // Return an existing object from the cache if one exits for this node.
  var ancestry = goog.cssom.iframe.style.NodeAncestry_.instances_[nodeUid];
  if (ancestry) {
    return ancestry;
  }

  var nodes = [];
  do {
    var nodeInfo = {
      id: node.id,
      nodeName: node.nodeName
   ***REMOVED*****REMOVED***
    nodeInfo.uid = goog.getUid(nodeInfo);
    var className = node.className;
    var classNamesLookup = {***REMOVED***
    if (className) {
      var classNames = goog.dom.classes.get(node);
      for (var i = 0; i < classNames.length; i++) {
        classNamesLookup[classNames[i]] = 1;
      }
    }
    nodeInfo.classNames = classNamesLookup;
    nodes.unshift(nodeInfo);
  } while (node = node.parentNode);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Array of nodes in order of hierarchy from the top of the document
  ***REMOVED*** to the node passed to the constructor
  ***REMOVED*** @type {Array.<Node>}
 ***REMOVED*****REMOVED***
  this.nodes = nodes;

  this.uid = goog.getUid(this);
  goog.cssom.iframe.style.NodeAncestry_.instances_[nodeUid] = this;
***REMOVED***


***REMOVED***
***REMOVED*** Object for caching existing NodeAncestry instances.
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.NodeAncestry_.instances_ = {***REMOVED***


***REMOVED***
***REMOVED*** Throw away all cached dom information. Call this if you've modified
***REMOVED*** the structure or class/id attributes of your document and you want
***REMOVED*** to recalculate the currently applied CSS rules.
***REMOVED***
goog.cssom.iframe.style.resetDomCache = function() {
  goog.cssom.iframe.style.NodeAncestry_.instances_ = {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Inspects a document and returns all active rule sets
***REMOVED*** @param {Document} doc The document from which to read CSS rules.
***REMOVED*** @return {Array.<goog.cssom.iframe.style.CssRuleSet_>} An array of CssRuleSet
***REMOVED***     objects representing all the active rule sets in the document.
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.getRuleSetsFromDocument_ = function(doc) {
  var ruleSets = [];
  var styleSheets = goog.cssom.getAllCssStyleSheets(doc.styleSheets);
  for (var i = 0, styleSheet; styleSheet = styleSheets[i]; i++) {
    var domRuleSets = goog.cssom.getCssRulesFromStyleSheet(styleSheet);
    if (domRuleSets && domRuleSets.length) {
      for (var j = 0, n = domRuleSets.length; j < n; j++) {
        var ruleSet = new goog.cssom.iframe.style.CssRuleSet_();
        if (ruleSet.initializeFromCssRule(domRuleSets[j])) {
          ruleSets.push(ruleSet);
        }
      }
    }
  }
  return ruleSets;
***REMOVED***


***REMOVED***
***REMOVED*** Static object to cache rulesets read from documents. Inspecting all
***REMOVED*** active css rules is an expensive operation, so its best to only do
***REMOVED*** it once and then cache the results.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.ruleSetCache_ = {***REMOVED***


***REMOVED***
***REMOVED*** Cache of ruleset objects keyed by document unique ID.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.ruleSetCache_.ruleSetCache_ = {***REMOVED***


***REMOVED***
***REMOVED*** Loads ruleset definitions from a document. If the cache already
***REMOVED*** has rulesets for this document the cached version will be replaced.
***REMOVED*** @param {Document} doc The document from which to load rulesets.
***REMOVED***
goog.cssom.iframe.style.ruleSetCache_.loadRuleSetsForDocument = function(doc) {
  var docUid = goog.getUid(doc);
  goog.cssom.iframe.style.ruleSetCache_.ruleSetCache_[docUid] =
      goog.cssom.iframe.style.getRuleSetsFromDocument_(doc);
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the array of css rulesets for this document. A cached
***REMOVED*** version will be used when possible.
***REMOVED*** @param {Document} doc The document for which to get rulesets.
***REMOVED*** @return {Array.<goog.cssom.iframe.style.CssRuleSet_>} An array of CssRuleSet
***REMOVED***     objects representing the css rule sets in the supplied document.
***REMOVED***
goog.cssom.iframe.style.ruleSetCache_.getRuleSetsForDocument = function(doc) {
  var docUid = goog.getUid(doc);
  var cache = goog.cssom.iframe.style.ruleSetCache_.ruleSetCache_;
  if (!cache[docUid]) {
    goog.cssom.iframe.style.ruleSetCache_.loadRuleSetsForDocument(doc);
  }
  // Build a cloned copy of rulesets array, so if object in the returned array
  // get modified future calls will still return the original unmodified
  // versions.
  var ruleSets = cache[docUid];
  var ruleSetsCopy = [];
  for (var i = 0; i < ruleSets.length; i++) {
    ruleSetsCopy.push(ruleSets[i].clone());
  }
  return ruleSetsCopy;
***REMOVED***


***REMOVED***
***REMOVED*** Array of CSS properties that are inherited by child nodes, according to
***REMOVED*** the CSS 2.1 spec. Properties that may be set to relative values, such
***REMOVED*** as font-size, and line-height, are omitted.
***REMOVED*** @type {Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.inheritedProperties_ = [
  'color',
  'visibility',
  'quotes',
  'list-style-type',
  'list-style-image',
  'list-style-position',
  'list-style',
  'page-break-inside',
  'orphans',
  'widows',
  'font-family',
  'font-style',
  'font-variant',
  'font-weight',
  'text-indent',
  'text-align',
  'text-transform',
  'white-space',
  'caption-side',
  'border-collapse',
  'border-spacing',
  'empty-cells',
  'cursor'
];


***REMOVED***
***REMOVED*** Array of CSS 2.1 properties that directly effect text nodes.
***REMOVED*** @type {Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.textProperties_ = [
  'font-family',
  'font-size',
  'font-weight',
  'font-variant',
  'font-style',
  'color',
  'text-align',
  'text-decoration',
  'text-indent',
  'text-transform',
  'letter-spacing',
  'white-space',
  'word-spacing'
];


***REMOVED***
***REMOVED*** Reads the current css rules from element's document, and returns them
***REMOVED*** rewriting selectors so that any rules that formerly applied to element will
***REMOVED*** be applied to doc.body. This makes it possible to replace a block in a page
***REMOVED*** with an iframe and preserve the css styling of the contents.
***REMOVED***
***REMOVED*** @param {Element} element The element for which context should be calculated.
***REMOVED*** @param {boolean=} opt_forceRuleSetCacheUpdate Flag to force the internal
***REMOVED***     cache of rulesets to refresh itself before we read the same.
***REMOVED*** @param {boolean=} opt_copyBackgroundContext Flag indicating that if the
***REMOVED***     {@code element} has a transparent background, background rules
***REMOVED***     from the nearest ancestor element(s) that have background-color
***REMOVED***     and/or background-image set should be copied.
***REMOVED*** @return {string} String containing all CSS rules present in the original
***REMOVED***     document, with modified selectors.
***REMOVED*** @see goog.cssom.iframe.style.getBackgroundContext.
***REMOVED***
goog.cssom.iframe.style.getElementContext = function(
    element,
    opt_forceRuleSetCacheUpdate,
    opt_copyBackgroundContext) {
  var sourceDocument = element.ownerDocument;
  if (opt_forceRuleSetCacheUpdate) {
    goog.cssom.iframe.style.ruleSetCache_.loadRuleSetsForDocument(
        sourceDocument);
  }
  var ruleSets = goog.cssom.iframe.style.ruleSetCache_.
      getRuleSetsForDocument(sourceDocument);

  var elementAncestry = new goog.cssom.iframe.style.NodeAncestry_(element);
  var bodySelectorPart = new goog.cssom.iframe.style.CssSelectorPart_('body');

  for (var i = 0; i < ruleSets.length; i++) {
    var ruleSet = ruleSets[i];
    var selectors = ruleSet.selectors;
    // Cache selectors.length since we may be adding rules in the loop.
    var ruleCount = selectors.length;
    for (var j = 0; j < ruleCount; j++) {
      var selector = selectors[j];
      // Test whether all or part of this selector would match
      // this element or one of its ancestors
      var match = selector.matchElementAncestry(elementAncestry);
      if (match) {
        var ruleIndex = match.selectorPartIndex;
        var selectorParts = selector.parts;
        var lastSelectorPartIndex = selectorParts.length - 1;
        var selectorCopy;
        if (match.elementIndex == elementAncestry.nodes.length - 1 ||
            ruleIndex < lastSelectorPartIndex) {
          // Either the first part(s) of the selector matched this element,
          // or the first part(s) of the selector matched a parent element
          // and there are more parts of the selector that could target
          // children of this element.
          // So we inject a new selector, replacing the part that matched this
          // element with 'body' so it will continue to match.
          var selectorPartsCopy = selectorParts.concat();
          selectorPartsCopy.splice(0,
                                   ruleIndex + 1,
                                   bodySelectorPart);
          selectorCopy = new goog.cssom.iframe.style.CssSelector_();
          selectorCopy.parts = selectorPartsCopy;
          selectors.push(selectorCopy);
        } else if (ruleIndex > 0 && ruleIndex == lastSelectorPartIndex) {
          // The rule didn't match this element, but the entire rule did
          // match an ancestor element. In this case we want to copy
          // just the last part of the rule, to give it a chance to be applied
          // to additional matching elements inside this element.
          // Example DOM structure: body > div.funky > ul > li#editme
          // Example CSS selector: .funky ul
          // New CSS selector: body ul
          selectorCopy = new goog.cssom.iframe.style.CssSelector_();
          selectorCopy.parts = [
            bodySelectorPart,
            selectorParts[lastSelectorPartIndex]
          ];
          selectors.push(selectorCopy);
        }
      }
    }
  }

  // Insert a new ruleset, setting the current inheritable styles of this
  // element as the defaults for everything under in the frame.
  var defaultPropertiesRuleSet = new goog.cssom.iframe.style.CssRuleSet_();
  var declarationParts = [];
  var computedStyle = goog.cssom.iframe.style.getComputedStyleObject_(element);

  // Copy inheritable styles so they are applied to everything under HTML.
  var htmlSelector = new goog.cssom.iframe.style.CssSelector_();
  htmlSelector.parts = [new goog.cssom.iframe.style.CssSelectorPart_('html')];
  defaultPropertiesRuleSet.selectors = [htmlSelector];
  var defaultProperties = {***REMOVED***
  for (var i = 0, prop;
       prop = goog.cssom.iframe.style.inheritedProperties_[i];
       i++) {
    defaultProperties[prop] = computedStyle[goog.string.toCamelCase(prop)];
  }
  defaultPropertiesRuleSet.setDeclarationTextFromObject(defaultProperties);
  ruleSets.push(defaultPropertiesRuleSet);

  var bodyRuleSet = new goog.cssom.iframe.style.CssRuleSet_();
  var bodySelector = new goog.cssom.iframe.style.CssSelector_();
  bodySelector.parts = [new goog.cssom.iframe.style.CssSelectorPart_('body')];
  // Core set of sane property values for BODY, to prevent copied
  // styles from completely breaking the display.
  var bodyProperties = {
    position: 'relative',
    top: '0',
    left: '0',
    right: 'auto', // Override any existing right value so 'left' works.
    display: 'block',
    visibility: 'visible'
 ***REMOVED*****REMOVED***
  // Text formatting property values, to keep text nodes directly under BODY
  // looking right.
  for (i = 0; prop = goog.cssom.iframe.style.textProperties_[i]; i++) {
    bodyProperties[prop] = computedStyle[goog.string.toCamelCase(prop)];
  }
  if (opt_copyBackgroundContext &&
      goog.cssom.iframe.style.isTransparentValue_(
          computedStyle['backgroundColor'])) {
    // opt_useAncestorBackgroundRules means that, if the original element
    // has a transparent backgorund, background properties rules should be
    // added to explicitly make the body have the same background appearance
    // as in the original element, even if its positioned somewhere else
    // in the DOM.
    var bgProperties =
        goog.cssom.iframe.style.getBackgroundContext(element);
    bodyProperties['background-color'] = bgProperties['backgroundColor'];
    var elementBgImage = computedStyle['backgroundImage'];
    if (!elementBgImage || elementBgImage == 'none') {
      bodyProperties['background-image'] = bgProperties['backgroundImage'];
      bodyProperties['background-repeat'] = bgProperties['backgroundRepeat'];
      bodyProperties['background-position'] =
          bgProperties['backgroundPosition'];
    }
  }

  bodyRuleSet.setDeclarationTextFromObject(bodyProperties, true);
  bodyRuleSet.selectors = [bodySelector];
  ruleSets.push(bodyRuleSet);

  // Write outputTextParts to doc.
  var ruleSetStrings = [];
  ruleCount = ruleSets.length;
  for (i = 0; i < ruleCount; i++) {
    ruleSets[i].writeToArray(ruleSetStrings);
  }
  return ruleSetStrings.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether a value is equivalent to 'transparent'.
***REMOVED*** @param {string} colorValue The value to test.
***REMOVED*** @return {boolean} Whether the value is transparent.
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.isTransparentValue_ = function(colorValue) {
  return colorValue == 'transparent' || colorValue == 'rgba(0, 0, 0, 0)';
***REMOVED***


***REMOVED***
***REMOVED*** Returns an object containing the set of computedStyle/currentStyle
***REMOVED*** values for the given element. Note that this should be used with
***REMOVED*** caution as it ignores the fact that currentStyle and computedStyle
***REMOVED*** are not the same for certain properties.
***REMOVED***
***REMOVED*** @param {Element} element The element whose computed style to return.
***REMOVED*** @return {Object} Object containing style properties and values.
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.getComputedStyleObject_ = function(element) {
  // Return an object containing the element's computedStyle/currentStyle.
  // The resulting object can be re-used to read multiple properties, which
  // is faster than calling goog.style.getComputedStyle every time.
  return element.currentStyle ||
      goog.dom.getOwnerDocument(element).defaultView.getComputedStyle(
          element, '') || {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** RegExp that splits a value like "10px" or "-1em" into parts.
***REMOVED*** @private
***REMOVED*** @type {RegExp}
***REMOVED***
goog.cssom.iframe.style.valueWithUnitsRegEx_ = /^(-?)([0-9]+)([a-z]*|%)/;


***REMOVED***
***REMOVED*** Given an object containing a set of styles, returns a two-element array
***REMOVED*** containing the values of background-position-x and background-position-y.
***REMOVED*** @param {Object} styleObject Object from which to read style properties.
***REMOVED*** @return {Array.<string>} The background-position values in the order [x, y].
***REMOVED*** @private
***REMOVED***
goog.cssom.iframe.style.getBackgroundXYValues_ = function(styleObject) {
  // Gecko only has backgroundPosition, containing both values.
  // IE has only backgroundPositionX/backgroundPositionY.
  // WebKit has both.
  if (styleObject['backgroundPositionY']) {
    return [styleObject['backgroundPositionX'],
            styleObject['backgroundPositionY']];
  } else {
    return (styleObject['backgroundPosition'] || '0 0').split(' ');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Generates a set of CSS properties that can be used to make another
***REMOVED*** element's background look like the background of a given element.
***REMOVED*** This is useful when you want to copy the CSS context of an element,
***REMOVED*** but the element's background is transparent. In the original context
***REMOVED*** you would see the ancestor's backround color/image showing through,
***REMOVED*** but in the new context there might be a something different underneath.
***REMOVED*** Note that this assumes the element you're copying context from has a
***REMOVED*** fairly standard positioning/layout - it assumes that when the element
***REMOVED*** has a transparent background what you're going to see through it is its
***REMOVED*** ancestors.
***REMOVED*** @param {Element} element The element from which to copy background styles.
***REMOVED*** @return {Object} Object containing background* properties.
***REMOVED***
goog.cssom.iframe.style.getBackgroundContext = function(element) {
  var propertyValues = {
    'backgroundImage': 'none'
 ***REMOVED*****REMOVED***
  var ancestor = element;
  var currentIframeWindow;
  // Walk up the DOM tree to find the ancestor nodes whose backgrounds
  // may be visible underneath this element. Background-image and
  // background-color don't have to come from the same node, but as soon
  // an element with background-color is found there's no need to continue
  // because backgrounds farther up the chain won't be visible.
  // (This implementation is not sophisticated enough to handle opacity,
  // or multple layered partially-transparent background images.)
  while ((ancestor = ancestor.parentNode) &&
         ancestor.nodeType == goog.dom.NodeType.ELEMENT) {
    var computedStyle = goog.cssom.iframe.style.getComputedStyleObject_(
       ***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (ancestor));
    // Copy background color if a non-transparent value is found.
    var backgroundColorValue = computedStyle['backgroundColor'];
    if (!goog.cssom.iframe.style.isTransparentValue_(backgroundColorValue)) {
      propertyValues['backgroundColor'] = backgroundColorValue;
    }
    // If a background image value is found, copy background-image,
    // background-repeat, and background-position.
    if (computedStyle['backgroundImage'] &&
        computedStyle['backgroundImage'] != 'none') {
      propertyValues['backgroundImage'] = computedStyle['backgroundImage'];
      propertyValues['backgroundRepeat'] = computedStyle['backgroundRepeat'];
      // Calculate the offset between the original element and the element
      // providing the background image, so the background position can be
      // adjusted.
      var relativePosition;
      if (currentIframeWindow) {
        relativePosition = goog.style.getFramedPageOffset(
            element, currentIframeWindow);
        var frameElement = currentIframeWindow.frameElement;
        var iframeRelativePosition = goog.style.getRelativePosition(
           ***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (frameElement),
           ***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (ancestor));
        var iframeBorders = goog.style.getBorderBox(frameElement);
        relativePosition.x += iframeRelativePosition.x + iframeBorders.left;
        relativePosition.y += iframeRelativePosition.y + iframeBorders.top;
      } else {
        relativePosition = goog.style.getRelativePosition(
            element,***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (ancestor));
      }
      var backgroundXYValues = goog.cssom.iframe.style.getBackgroundXYValues_(
          computedStyle);
      // Parse background-repeat-* values in the form "10px", and adjust them.
      for (var i = 0; i < 2; i++) {
        var positionValue = backgroundXYValues[i];
        var coordinate = i == 0 ? 'X' : 'Y';
        var positionProperty = 'backgroundPosition' + coordinate;
        // relative position to its ancestor.
        var positionValueParts =
            goog.cssom.iframe.style.valueWithUnitsRegEx_.exec(positionValue);
        if (positionValueParts) {
          var value = parseInt(
              positionValueParts[1] + positionValueParts[2], 10);
          var units = positionValueParts[3];
          // This only attempts to handle pixel values for now (plus
          // '0anything', which is equivalent to 0px).
          // TODO(user) Convert non-pixel values to pixels when possible.
          if (value == 0 || units == 'px') {
            value -= (coordinate == 'X' ?
                      relativePosition.x : relativePosition.y);
          }
          positionValue = value + units;
        }
        propertyValues[positionProperty] = positionValue;
      }
      propertyValues['backgroundPosition'] =
          propertyValues['backgroundPositionX'] + ' ' +
          propertyValues['backgroundPositionY'];
    }
    if (propertyValues['backgroundColor']) {
      break;
    }
    if (ancestor.tagName == goog.dom.TagName.HTML) {
      try {
        currentIframeWindow = goog.dom.getWindow(
           ***REMOVED*****REMOVED*** @type {Document}***REMOVED*** (ancestor.parentNode));
        // This could theoretically throw a security exception if the parent
        // iframe is in a different domain.
        ancestor = currentIframeWindow.frameElement;
        if (!ancestor) {
          // Loop has reached the top level window.
          break;
        }
      } catch (e) {
        // We don't have permission to go up to the parent window, stop here.
        break;
      }
    }
  }
  return propertyValues;
***REMOVED***
