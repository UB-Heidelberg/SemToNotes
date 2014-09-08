// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utilties for working with the styles of DOM nodes, and
***REMOVED*** related to rich text editing.
***REMOVED***
***REMOVED*** Many of these are not general enough to go into goog.style, and use
***REMOVED*** constructs (like "isContainer") that only really make sense inside
***REMOVED*** of an HTML editor.
***REMOVED***
***REMOVED*** The API has been optimized for iterating over large, irregular DOM
***REMOVED*** structures (with lots of text nodes), and so the API tends to be a bit
***REMOVED*** more permissive than the goog.style API should be. For example,
***REMOVED*** goog.style.getComputedStyle will throw an exception if you give it a
***REMOVED*** text node.
***REMOVED***
***REMOVED***

goog.provide('goog.editor.style');

goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.editor.BrowserFeature');
***REMOVED***
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Gets the computed or cascaded style.
***REMOVED***
***REMOVED*** This is different than goog.style.getStyle_ because it returns null
***REMOVED*** for text nodes (instead of throwing an exception), and never reads
***REMOVED*** inline style. These two functions may need to be reconciled.
***REMOVED***
***REMOVED*** @param {Node} node Node to get style of.
***REMOVED*** @param {string} stylePropertyName Property to get (must be camelCase,
***REMOVED***     not css-style).
***REMOVED*** @return {?string} Style value, or null if this is not an element node.
***REMOVED*** @private
***REMOVED***
goog.editor.style.getComputedOrCascadedStyle_ = function(
    node, stylePropertyName) {
  if (node.nodeType != goog.dom.NodeType.ELEMENT) {
    // Only element nodes have style.
    return null;
  }
  return goog.userAgent.IE ?
      goog.style.getCascadedStyle(***REMOVED*** @type {Element}***REMOVED*** (node),
          stylePropertyName) :
      goog.style.getComputedStyle(***REMOVED*** @type {Element}***REMOVED*** (node),
          stylePropertyName);
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether the given element inherits display: block.
***REMOVED*** @param {Node} node The Node to check.
***REMOVED*** @return {boolean} Whether the element inherits CSS display: block.
***REMOVED***
goog.editor.style.isDisplayBlock = function(node) {
  return goog.editor.style.getComputedOrCascadedStyle_(
      node, 'display') == 'block';
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the element is a container of other non-inline HTML
***REMOVED*** Note that span, strong and em tags, being inline can only contain
***REMOVED*** other inline elements and are thus, not containers. Containers are elements
***REMOVED*** that should not be broken up when wrapping selections with a node of an
***REMOVED*** inline block styling.
***REMOVED*** @param {Node} element The element to check.
***REMOVED*** @return {boolean} Whether the element is a container.
***REMOVED***
goog.editor.style.isContainer = function(element) {
  var nodeName = element && element.nodeName.toLowerCase();
  return !!(element &&
      (goog.editor.style.isDisplayBlock(element) ||
          nodeName == 'td' ||
          nodeName == 'table' ||
          nodeName == 'li'));
***REMOVED***


***REMOVED***
***REMOVED*** Return the first ancestor of this node that is a container, inclusive.
***REMOVED*** @see isContainer
***REMOVED*** @param {Node} node Node to find the container of.
***REMOVED*** @return {Element} The element which contains node.
***REMOVED***
goog.editor.style.getContainer = function(node) {
  // We assume that every node must have a container.
  return***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (
      goog.dom.getAncestor(node, goog.editor.style.isContainer, true));
***REMOVED***


***REMOVED***
***REMOVED*** Set of input types that should be kept selectable even when their ancestors
***REMOVED*** are made unselectable.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.editor.style.SELECTABLE_INPUT_TYPES_ = goog.object.createSet(
    'text', 'file', 'url');


***REMOVED***
***REMOVED*** Prevent the default action on mousedown events.
***REMOVED*** @param {goog.events.Event} e The mouse down event.
***REMOVED*** @private
***REMOVED***
goog.editor.style.cancelMouseDownHelper_ = function(e) {
  var targetTagName = e.target.tagName;
  if (targetTagName != goog.dom.TagName.TEXTAREA &&
      targetTagName != goog.dom.TagName.INPUT) {
    e.preventDefault();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Makes the given element unselectable, as well as all of its children, except
***REMOVED*** for text areas, text, file and url inputs.
***REMOVED*** @param {Element} element The element to make unselectable.
***REMOVED*** @param {goog.events.EventHandler} eventHandler An EventHandler to register
***REMOVED***     the event with. Assumes when the node is destroyed, the eventHandler's
***REMOVED***     listeners are destroyed as well.
***REMOVED***
goog.editor.style.makeUnselectable = function(element, eventHandler) {
  if (goog.editor.BrowserFeature.HAS_UNSELECTABLE_STYLE) {
    // The mousing down on a node should not blur the focused node.
    // This is consistent with how IE works.
    // TODO: Consider using just the mousedown handler and not the css property.
    eventHandler.listen(element, goog.events.EventType.MOUSEDOWN,
        goog.editor.style.cancelMouseDownHelper_, true);
  }

  goog.style.setUnselectable(element, true);

  // Make inputs and text areas selectable.
  var inputs = element.getElementsByTagName(goog.dom.TagName.INPUT);
  for (var i = 0, len = inputs.length; i < len; i++) {
    var input = inputs[i];
    if (input.type in goog.editor.style.SELECTABLE_INPUT_TYPES_) {
      goog.editor.style.makeSelectable(input);
    }
  }
  goog.array.forEach(element.getElementsByTagName(goog.dom.TagName.TEXTAREA),
      goog.editor.style.makeSelectable);
***REMOVED***


***REMOVED***
***REMOVED*** Make the given element selectable.
***REMOVED***
***REMOVED*** For IE this simply turns off the "unselectable" property.
***REMOVED***
***REMOVED*** Under FF no descendent of an unselectable node can be selectable:
***REMOVED***
***REMOVED*** https://bugzilla.mozilla.org/show_bug.cgi?id=203291
***REMOVED***
***REMOVED*** So we make each ancestor of node selectable, while trying to preserve the
***REMOVED*** unselectability of other nodes along that path
***REMOVED***
***REMOVED*** This may cause certain text nodes which should be unselectable, to become
***REMOVED*** selectable. For example:
***REMOVED***
***REMOVED*** <div id=div1 style="-moz-user-select: none">
***REMOVED***   Text1
***REMOVED***   <span id=span1>Text2</span>
***REMOVED*** </div>
***REMOVED***
***REMOVED*** If we call makeSelectable on span1, then it will cause "Text1" to become
***REMOVED*** selectable, since it had to make div1 selectable in order for span1 to be
***REMOVED*** selectable.
***REMOVED***
***REMOVED*** If "Text1" were enclosed within a <p> or <span>, then this problem would
***REMOVED*** not arise.  Text nodes do not have styles, so its style can't be set to
***REMOVED*** unselectable.
***REMOVED***
***REMOVED*** @param {Element} element The element to make selectable.
***REMOVED***
goog.editor.style.makeSelectable = function(element) {
  goog.style.setUnselectable(element, false);
  if (goog.editor.BrowserFeature.HAS_UNSELECTABLE_STYLE) {
    // Go up ancestor chain, searching for nodes that are unselectable.
    // If such a node exists, mark it as selectable but mark its other children
    // as unselectable so the minimum set of nodes is changed.
    var child = element;
    var current =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (element.parentNode);
    while (current && current.tagName != goog.dom.TagName.HTML) {
      if (goog.style.isUnselectable(current)) {
        goog.style.setUnselectable(current, false, true);

        for (var i = 0, len = current.childNodes.length; i < len; i++) {
          var node = current.childNodes[i];
          if (node != child && node.nodeType == goog.dom.NodeType.ELEMENT) {
            goog.style.setUnselectable(current.childNodes[i], true);
          }
        }
      }

      child = current;
      current =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (current.parentNode);
    }
  }
***REMOVED***
