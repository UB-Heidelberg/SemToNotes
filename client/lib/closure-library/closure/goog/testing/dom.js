// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Testing utilities for DOM related tests.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.testing.dom');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.NodeIterator');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.TagIterator');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.iter');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.testing.asserts');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** @return {!Node} A DIV node with a unique ID identifying the
***REMOVED***     {@code END_TAG_MARKER_}.
***REMOVED*** @private
***REMOVED***
goog.testing.dom.createEndTagMarker_ = function() {
  var marker = goog.dom.createElement(goog.dom.TagName.DIV);
  marker.id = goog.getUid(marker);
  return marker;
***REMOVED***


***REMOVED***
***REMOVED*** A unique object to use as an end tag marker.
***REMOVED*** @private {!Node}
***REMOVED*** @const
***REMOVED***
goog.testing.dom.END_TAG_MARKER_ = goog.testing.dom.createEndTagMarker_();


***REMOVED***
***REMOVED*** Tests if the given iterator over nodes matches the given Array of node
***REMOVED*** descriptors.  Throws an error if any match fails.
***REMOVED*** @param {goog.iter.Iterator} it  An iterator over nodes.
***REMOVED*** @param {Array.<Node|number|string>} array Array of node descriptors to match
***REMOVED***     against.  Node descriptors can be any of the following:
***REMOVED***         Node: Test if the two nodes are equal.
***REMOVED***         number: Test node.nodeType == number.
***REMOVED***         string starting with '#': Match the node's id with the text
***REMOVED***             after "#".
***REMOVED***         other string: Match the text node's contents.
***REMOVED***
goog.testing.dom.assertNodesMatch = function(it, array) {
  var i = 0;
  goog.iter.forEach(it, function(node) {
    if (array.length <= i) {
      fail('Got more nodes than expected: ' + goog.testing.dom.describeNode_(
          node));
    }
    var expected = array[i];

    if (goog.dom.isNodeLike(expected)) {
      assertEquals('Nodes should match at position ' + i, expected, node);
    } else if (goog.isNumber(expected)) {
      assertEquals('Node types should match at position ' + i, expected,
          node.nodeType);
    } else if (expected.charAt(0) == '#') {
      assertEquals('Expected element at position ' + i,
          goog.dom.NodeType.ELEMENT, node.nodeType);
      var expectedId = expected.substr(1);
      assertEquals('IDs should match at position ' + i,
          expectedId, node.id);

    } else {
      assertEquals('Expected text node at position ' + i,
          goog.dom.NodeType.TEXT, node.nodeType);
      assertEquals('Node contents should match at position ' + i,
          expected, node.nodeValue);
    }

    i++;
  });

  assertEquals('Used entire match array', array.length, i);
***REMOVED***


***REMOVED***
***REMOVED*** Exposes a node as a string.
***REMOVED*** @param {Node} node A node.
***REMOVED*** @return {string} A string representation of the node.
***REMOVED***
goog.testing.dom.exposeNode = function(node) {
  return (node.tagName || node.nodeValue) + (node.id ? '#' + node.id : '') +
      ':"' + (node.innerHTML || '') + '"';
***REMOVED***


***REMOVED***
***REMOVED*** Exposes the nodes of a range wrapper as a string.
***REMOVED*** @param {goog.dom.AbstractRange} range A range.
***REMOVED*** @return {string} A string representation of the range.
***REMOVED***
goog.testing.dom.exposeRange = function(range) {
  // This is deliberately not implemented as
  // goog.dom.AbstractRange.prototype.toString, because it is non-authoritative.
  // Two equivalent ranges may have very different exposeRange values, and
  // two different ranges may have equal exposeRange values.
  // (The mapping of ranges to DOM nodes/offsets is a many-to-many mapping).
  if (!range) {
    return 'null';
  }
  return goog.testing.dom.exposeNode(range.getStartNode()) + ':' +
         range.getStartOffset() + ' to ' +
         goog.testing.dom.exposeNode(range.getEndNode()) + ':' +
         range.getEndOffset();
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the current user agent matches the specified string.  Returns
***REMOVED*** false if the string does specify at least one user agent but does not match
***REMOVED*** the running agent.
***REMOVED*** @param {string} userAgents Space delimited string of user agents.
***REMOVED*** @return {boolean} Whether the user agent was matched.  Also true if no user
***REMOVED***     agent was listed in the expectation string.
***REMOVED*** @private
***REMOVED***
goog.testing.dom.checkUserAgents_ = function(userAgents) {
  if (goog.string.startsWith(userAgents, '!')) {
    if (goog.string.contains(userAgents, ' ')) {
      throw new Error('Only a single negative user agent may be specified');
    }
    return !goog.userAgent[userAgents.substr(1)];
  }

  var agents = userAgents.split(' ');
  var hasUserAgent = false;
  for (var i = 0, len = agents.length; i < len; i++) {
    var cls = agents[i];
    if (cls in goog.userAgent) {
      hasUserAgent = true;
      if (goog.userAgent[cls]) {
        return true;
      }
    }
  }
  // If we got here, there was a user agent listed but we didn't match it.
  return !hasUserAgent;
***REMOVED***


***REMOVED***
***REMOVED*** Map function that converts end tags to a specific object.
***REMOVED*** @param {Node} node The node to map.
***REMOVED*** @param {undefined} ignore Always undefined.
***REMOVED*** @param {!goog.iter.Iterator.<Node>} iterator The iterator.
***REMOVED*** @return {Node} The resulting iteration item.
***REMOVED*** @private
***REMOVED***
goog.testing.dom.endTagMap_ = function(node, ignore, iterator) {
  return iterator.isEndTag() ? goog.testing.dom.END_TAG_MARKER_ : node;
***REMOVED***


***REMOVED***
***REMOVED*** Check if the given node is important.  A node is important if it is a
***REMOVED*** non-empty text node, a non-annotated element, or an element annotated to
***REMOVED*** match on this user agent.
***REMOVED*** @param {Node} node The node to test.
***REMOVED*** @return {boolean} Whether this node should be included for iteration.
***REMOVED*** @private
***REMOVED***
goog.testing.dom.nodeFilter_ = function(node) {
  if (node.nodeType == goog.dom.NodeType.TEXT) {
    // If a node is part of a string of text nodes and it has spaces in it,
    // we allow it since it's going to affect the merging of nodes done below.
    if (goog.string.isBreakingWhitespace(node.nodeValue) &&
        (!node.previousSibling ||
             node.previousSibling.nodeType != goog.dom.NodeType.TEXT) &&
        (!node.nextSibling ||
             node.nextSibling.nodeType != goog.dom.NodeType.TEXT)) {
      return false;
    }
    // Allow optional text to be specified as [[BROWSER1 BROWSER2]]Text
    var match = node.nodeValue.match(/^\[\[(.+)\]\]/);
    if (match) {
      return goog.testing.dom.checkUserAgents_(match[1]);
    }
  } else if (node.className) {
    return goog.testing.dom.checkUserAgents_(node.className);
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Determines the text to match from the given node, removing browser
***REMOVED*** specification strings.
***REMOVED*** @param {Node} node The node expected to match.
***REMOVED*** @return {string} The text, stripped of browser specification strings.
***REMOVED*** @private
***REMOVED***
goog.testing.dom.getExpectedText_ = function(node) {
  // Strip off the browser specifications.
  return node.nodeValue.match(/^(\[\[.+\]\])?(.*)/)[2];
***REMOVED***


***REMOVED***
***REMOVED*** Describes the given node.
***REMOVED*** @param {Node} node The node to describe.
***REMOVED*** @return {string} A description of the node.
***REMOVED*** @private
***REMOVED***
goog.testing.dom.describeNode_ = function(node) {
  if (node.nodeType == goog.dom.NodeType.TEXT) {
    return '[Text: ' + node.nodeValue + ']';
  } else {
    return '<' + node.tagName + (node.id ? ' #' + node.id : '') + ' .../>';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Assert that the html in {@code actual} is substantially similar to
***REMOVED*** htmlPattern.  This method tests for the same set of styles, for the same
***REMOVED*** order of nodes, and the presence of attributes.  Breaking whitespace nodes
***REMOVED*** are ignored.  Elements can be
***REMOVED*** annotated with classnames corresponding to keys in goog.userAgent and will be
***REMOVED*** expected to show up in that user agent and expected not to show up in
***REMOVED*** others.
***REMOVED*** @param {string} htmlPattern The pattern to match.
***REMOVED*** @param {!Node} actual The element to check: its contents are matched
***REMOVED***     against the HTML pattern.
***REMOVED*** @param {boolean=} opt_strictAttributes If false, attributes that appear in
***REMOVED***     htmlPattern must be in actual, but actual can have attributes not
***REMOVED***     present in htmlPattern.  If true, htmlPattern and actual must have the
***REMOVED***     same set of attributes.  Default is false.
***REMOVED***
goog.testing.dom.assertHtmlContentsMatch = function(htmlPattern, actual,
    opt_strictAttributes) {
  var div = goog.dom.createDom(goog.dom.TagName.DIV);
  div.innerHTML = htmlPattern;

  var errorSuffix = '\nExpected\n' + htmlPattern + '\nActual\n' +
      actual.innerHTML;

  var actualIt = goog.iter.filter(
      goog.iter.map(new goog.dom.TagIterator(actual),
          goog.testing.dom.endTagMap_),
      goog.testing.dom.nodeFilter_);

  var expectedIt = goog.iter.filter(new goog.dom.NodeIterator(div),
      goog.testing.dom.nodeFilter_);

  var actualNode;
  var preIterated = false;
  var advanceActualNode = function() {
    // If the iterator has already been advanced, don't advance it again.
    if (!preIterated) {
      actualNode =***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (goog.iter.nextOrValue(actualIt, null));
    }
    preIterated = false;

    // Advance the iterator so long as it is return end tags.
    while (actualNode == goog.testing.dom.END_TAG_MARKER_) {
      actualNode =***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (goog.iter.nextOrValue(actualIt, null));
    }
 ***REMOVED*****REMOVED***

  // HACK(brenneman): IE has unique ideas about whitespace handling when setting
  // innerHTML. This results in elision of leading whitespace in the expected
  // nodes where doing so doesn't affect visible rendering. As a workaround, we
  // remove the leading whitespace in the actual nodes where necessary.
  //
  // The collapsible variable tracks whether we should collapse the whitespace
  // in the next Text node we encounter.
  var IE_TEXT_COLLAPSE =
      goog.userAgent.IE && !goog.userAgent.isVersionOrHigher('9');

  var collapsible = true;

  var number = 0;
  goog.iter.forEach(expectedIt, function(expectedNode) {
    expectedNode =***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (expectedNode);

    advanceActualNode();
    assertNotNull('Finished actual HTML before finishing expected HTML at ' +
                  'node number ' + number + ': ' +
                  goog.testing.dom.describeNode_(expectedNode) + errorSuffix,
                  actualNode);

    // Do no processing for expectedNode == div.
    if (expectedNode == div) {
      return;
    }

    assertEquals('Should have the same node type, got ' +
        goog.testing.dom.describeNode_(actualNode) + ' but expected ' +
        goog.testing.dom.describeNode_(expectedNode) + '.' + errorSuffix,
        expectedNode.nodeType, actualNode.nodeType);

    if (expectedNode.nodeType == goog.dom.NodeType.ELEMENT) {
      var expectedElem = goog.asserts.assertElement(expectedNode);
      var actualElem = goog.asserts.assertElement(actualNode);

      assertEquals('Tag names should match' + errorSuffix,
          expectedElem.tagName, actualElem.tagName);
      assertObjectEquals('Should have same styles' + errorSuffix,
          goog.style.parseStyleAttribute(expectedElem.style.cssText),
          goog.style.parseStyleAttribute(actualElem.style.cssText));
      goog.testing.dom.assertAttributesEqual_(errorSuffix, expectedElem,
          actualElem, !!opt_strictAttributes);

      if (IE_TEXT_COLLAPSE &&
          goog.style.getCascadedStyle(actualElem, 'display') != 'inline') {
        // Text may be collapsed after any non-inline element.
        collapsible = true;
      }
    } else {
      // Concatenate text nodes until we reach a non text node.
      var actualText = actualNode.nodeValue;
      preIterated = true;
      while ((actualNode =***REMOVED*****REMOVED*** @type {Node}***REMOVED***
              (goog.iter.nextOrValue(actualIt, null))) &&
          actualNode.nodeType == goog.dom.NodeType.TEXT) {
        actualText += actualNode.nodeValue;
      }

      if (IE_TEXT_COLLAPSE) {
        // Collapse the leading whitespace, unless the string consists entirely
        // of whitespace.
        if (collapsible && !goog.string.isEmpty(actualText)) {
          actualText = goog.string.trimLeft(actualText);
        }
        // Prepare to collapse whitespace in the next Text node if this one does
        // not end in a whitespace character.
        collapsible = /\s$/.test(actualText);
      }

      var expectedText = goog.testing.dom.getExpectedText_(expectedNode);
      if ((actualText && !goog.string.isBreakingWhitespace(actualText)) ||
          (expectedText && !goog.string.isBreakingWhitespace(expectedText))) {
        var normalizedActual = actualText.replace(/\s+/g, ' ');
        var normalizedExpected = expectedText.replace(/\s+/g, ' ');

        assertEquals('Text should match' + errorSuffix, normalizedExpected,
            normalizedActual);
      }
    }

    number++;
  });

  advanceActualNode();
  assertNull('Finished expected HTML before finishing actual HTML' +
      errorSuffix, goog.iter.nextOrValue(actualIt, null));
***REMOVED***


***REMOVED***
***REMOVED*** Assert that the html in {@code actual} is substantially similar to
***REMOVED*** htmlPattern.  This method tests for the same set of styles, and for the same
***REMOVED*** order of nodes.  Breaking whitespace nodes are ignored.  Elements can be
***REMOVED*** annotated with classnames corresponding to keys in goog.userAgent and will be
***REMOVED*** expected to show up in that user agent and expected not to show up in
***REMOVED*** others.
***REMOVED*** @param {string} htmlPattern The pattern to match.
***REMOVED*** @param {string} actual The html to check.
***REMOVED***
goog.testing.dom.assertHtmlMatches = function(htmlPattern, actual) {
  var div = goog.dom.createDom(goog.dom.TagName.DIV);
  div.innerHTML = actual;

  goog.testing.dom.assertHtmlContentsMatch(htmlPattern, div);
***REMOVED***


***REMOVED***
***REMOVED*** Finds the first text node descendant of root with the given content.  Note
***REMOVED*** that this operates on a text node level, so if text nodes get split this
***REMOVED*** may not match the user visible text.  Using normalize() may help here.
***REMOVED*** @param {string|RegExp} textOrRegexp The text to find, or a regular
***REMOVED***     expression to find a match of.
***REMOVED*** @param {Element} root The element to search in.
***REMOVED*** @return {Node} The first text node that matches, or null if none is found.
***REMOVED***
goog.testing.dom.findTextNode = function(textOrRegexp, root) {
  var it = new goog.dom.NodeIterator(root);
  var ret = goog.iter.nextOrValue(goog.iter.filter(it, function(node) {
    if (node.nodeType == goog.dom.NodeType.TEXT) {
      if (goog.isString(textOrRegexp)) {
        return node.nodeValue == textOrRegexp;
      } else {
        return !!node.nodeValue.match(textOrRegexp);
      }
    } else {
      return false;
    }
  }), null);
  return***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (ret);
***REMOVED***


***REMOVED***
***REMOVED*** Assert the end points of a range.
***REMOVED***
***REMOVED*** Notice that "Are two ranges visually identical?" and "Do two ranges have
***REMOVED*** the same endpoint?" are independent questions. Two visually identical ranges
***REMOVED*** may have different endpoints. And two ranges with the same endpoints may
***REMOVED*** be visually different.
***REMOVED***
***REMOVED*** @param {Node} start The expected start node.
***REMOVED*** @param {number} startOffset The expected start offset.
***REMOVED*** @param {Node} end The expected end node.
***REMOVED*** @param {number} endOffset The expected end offset.
***REMOVED*** @param {goog.dom.AbstractRange} range The actual range.
***REMOVED***
goog.testing.dom.assertRangeEquals = function(start, startOffset, end,
    endOffset, range) {
  assertEquals('Unexpected start node', start, range.getStartNode());
  assertEquals('Unexpected end node', end, range.getEndNode());
  assertEquals('Unexpected start offset', startOffset, range.getStartOffset());
  assertEquals('Unexpected end offset', endOffset, range.getEndOffset());
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of a DOM attribute in deterministic way.
***REMOVED*** @param {!Node} node A node.
***REMOVED*** @param {string} name Attribute name.
***REMOVED*** @return {*} Attribute value.
***REMOVED*** @private
***REMOVED***
goog.testing.dom.getAttributeValue_ = function(node, name) {
  // These hacks avoid nondetermistic results in the following cases:
  // IE7: document.createElement('input').height returns a random number.
  // FF3: getAttribute('disabled') returns different value for <div disabled="">
  //      and <div disabled="disabled">
  // WebKit: Two radio buttons with the same name can't be checked at the same
  //      time, even if only one of them is in the document.
  if (goog.userAgent.WEBKIT && node.tagName == 'INPUT' &&
      node['type'] == 'radio' && name == 'checked') {
    return false;
  }
  return goog.isDef(node[name]) &&
      typeof node.getAttribute(name) != typeof node[name] ?
      node[name] : node.getAttribute(name);
***REMOVED***


***REMOVED***
***REMOVED*** Assert that the attributes of two Nodes are the same (ignoring any
***REMOVED*** instances of the style attribute).
***REMOVED*** @param {string} errorSuffix String to add to end of error messages.
***REMOVED*** @param {!Element} expectedElem The element whose attributes we are expecting.
***REMOVED*** @param {!Element} actualElem The element with the actual attributes.
***REMOVED*** @param {boolean} strictAttributes If false, attributes that appear in
***REMOVED***     expectedNode must also be in actualNode, but actualNode can have
***REMOVED***     attributes not present in expectedNode.  If true, expectedNode and
***REMOVED***     actualNode must have the same set of attributes.
***REMOVED*** @private
***REMOVED***
goog.testing.dom.assertAttributesEqual_ = function(errorSuffix,
    expectedElem, actualElem, strictAttributes) {
  if (strictAttributes) {
    goog.testing.dom.compareClassAttribute_(expectedElem, actualElem);
  }

  var expectedAttributes = expectedElem.attributes;
  var actualAttributes = actualElem.attributes;

  for (var i = 0, len = expectedAttributes.length; i < len; i++) {
    var expectedName = expectedAttributes[i].name;
    var expectedValue = goog.testing.dom.getAttributeValue_(expectedElem,
        expectedName);

    var actualAttribute = actualAttributes[expectedName];
    var actualValue = goog.testing.dom.getAttributeValue_(actualElem,
        expectedName);

    // IE enumerates attribute names in the expected node that are not present,
    // causing an undefined actualAttribute.
    if (!expectedValue && !actualValue) {
      continue;
    }

    if (expectedName == 'id' && goog.userAgent.IE) {
      goog.testing.dom.compareIdAttributeForIe_(
         ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (expectedValue), actualAttribute,
          strictAttributes, errorSuffix);
      continue;
    }

    if (goog.testing.dom.ignoreAttribute_(expectedName)) {
      continue;
    }

    assertNotUndefined('Expected to find attribute with name ' +
        expectedName + ', in element ' +
        goog.testing.dom.describeNode_(actualElem) + errorSuffix,
        actualAttribute);
    assertEquals('Expected attribute ' + expectedName +
        ' has a different value ' + errorSuffix,
        expectedValue,
        goog.testing.dom.getAttributeValue_(actualElem, actualAttribute.name));
  }

  if (strictAttributes) {
    for (i = 0; i < actualAttributes.length; i++) {
      var actualName = actualAttributes[i].name;
      var actualAttribute = actualAttributes.getNamedItem(actualName);

      if (!actualAttribute || goog.testing.dom.ignoreAttribute_(actualName)) {
        continue;
      }

      assertNotUndefined('Unexpected attribute with name ' +
          actualName + ' in element ' +
          goog.testing.dom.describeNode_(actualElem) + errorSuffix,
          expectedAttributes[actualName]);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Assert the class attribute of actualElem is the same as the one in
***REMOVED*** expectedElem, ignoring classes that are useragents.
***REMOVED*** @param {!Element} expectedElem The DOM element whose class we expect.
***REMOVED*** @param {!Element} actualElem The DOM element with the actual class.
***REMOVED*** @private
***REMOVED***
goog.testing.dom.compareClassAttribute_ = function(expectedElem,
    actualElem) {
  var classes = goog.dom.classlist.get(expectedElem);

  var expectedClasses = [];
  for (var i = 0, len = classes.length; i < len; i++) {
    if (!(classes[i] in goog.userAgent)) {
      expectedClasses.push(classes[i]);
    }
  }
  expectedClasses.sort();

  var actualClasses = goog.array.toArray(goog.dom.classlist.get(actualElem));
  actualClasses.sort();

  assertArrayEquals(
      'Expected class was: ' + expectedClasses.join(' ') +
      ', but actual class was: ' + actualElem.className,
      expectedClasses, actualClasses);
***REMOVED***


***REMOVED***
***REMOVED*** Set of attributes IE adds to elements randomly.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.testing.dom.BAD_IE_ATTRIBUTES_ = goog.object.createSet(
    'methods', 'CHECKED', 'dataFld', 'dataFormatAs', 'dataSrc');


***REMOVED***
***REMOVED*** Whether to ignore the attribute.
***REMOVED*** @param {string} name Name of the attribute.
***REMOVED*** @return {boolean} True if the attribute should be ignored.
***REMOVED*** @private
***REMOVED***
goog.testing.dom.ignoreAttribute_ = function(name) {
  if (name == 'style' || name == 'class') {
    return true;
  }
  return goog.userAgent.IE && goog.testing.dom.BAD_IE_ATTRIBUTES_[name];
***REMOVED***


***REMOVED***
***REMOVED*** Compare id attributes for IE.  In IE, if an element lacks an id attribute
***REMOVED*** in the original HTML, the element object will still have such an attribute,
***REMOVED*** but its value will be the empty string.
***REMOVED*** @param {string} expectedValue The expected value of the id attribute.
***REMOVED*** @param {Attr} actualAttribute The actual id attribute.
***REMOVED*** @param {boolean} strictAttributes Whether strict attribute checking should be
***REMOVED***     done.
***REMOVED*** @param {string} errorSuffix String to append to error messages.
***REMOVED*** @private
***REMOVED***
goog.testing.dom.compareIdAttributeForIe_ = function(expectedValue,
    actualAttribute, strictAttributes, errorSuffix) {
  if (expectedValue === '') {
    if (strictAttributes) {
      assertTrue('Unexpected attribute with name id in element ' +
          errorSuffix, actualAttribute.value == '');
    }
  } else {
    assertNotUndefined('Expected to find attribute with name id, in element ' +
        errorSuffix, actualAttribute);
    assertNotEquals('Expected to find attribute with name id, in element ' +
        errorSuffix, '', actualAttribute.value);
    assertEquals('Expected attribute has a different value ' + errorSuffix,
        expectedValue, actualAttribute.value);
  }
***REMOVED***
