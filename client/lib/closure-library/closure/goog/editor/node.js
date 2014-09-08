// Copyright 2005 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utilties for working with DOM nodes related to rich text
***REMOVED*** editing.  Many of these are not general enough to go into goog.dom.
***REMOVED***
***REMOVED***

goog.provide('goog.editor.node');

goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.TagName');
goog.require('goog.dom.iter.ChildIterator');
goog.require('goog.dom.iter.SiblingIterator');
goog.require('goog.iter');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.string.Unicode');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Names of all block-level tags
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.editor.node.BLOCK_TAG_NAMES_ = goog.object.createSet(
    goog.dom.TagName.ADDRESS,
    goog.dom.TagName.ARTICLE,
    goog.dom.TagName.ASIDE,
    goog.dom.TagName.BLOCKQUOTE,
    goog.dom.TagName.BODY,
    goog.dom.TagName.CAPTION,
    goog.dom.TagName.CENTER,
    goog.dom.TagName.COL,
    goog.dom.TagName.COLGROUP,
    goog.dom.TagName.DETAILS,
    goog.dom.TagName.DIR,
    goog.dom.TagName.DIV,
    goog.dom.TagName.DL,
    goog.dom.TagName.DD,
    goog.dom.TagName.DT,
    goog.dom.TagName.FIELDSET,
    goog.dom.TagName.FIGCAPTION,
    goog.dom.TagName.FIGURE,
    goog.dom.TagName.FOOTER,
    goog.dom.TagName.FORM,
    goog.dom.TagName.H1,
    goog.dom.TagName.H2,
    goog.dom.TagName.H3,
    goog.dom.TagName.H4,
    goog.dom.TagName.H5,
    goog.dom.TagName.H6,
    goog.dom.TagName.HEADER,
    goog.dom.TagName.HGROUP,
    goog.dom.TagName.HR,
    goog.dom.TagName.ISINDEX,
    goog.dom.TagName.OL,
    goog.dom.TagName.LI,
    goog.dom.TagName.MAP,
    goog.dom.TagName.MENU,
    goog.dom.TagName.NAV,
    goog.dom.TagName.OPTGROUP,
    goog.dom.TagName.OPTION,
    goog.dom.TagName.P,
    goog.dom.TagName.PRE,
    goog.dom.TagName.SECTION,
    goog.dom.TagName.SUMMARY,
    goog.dom.TagName.TABLE,
    goog.dom.TagName.TBODY,
    goog.dom.TagName.TD,
    goog.dom.TagName.TFOOT,
    goog.dom.TagName.TH,
    goog.dom.TagName.THEAD,
    goog.dom.TagName.TR,
    goog.dom.TagName.UL);


***REMOVED***
***REMOVED*** Names of tags that have intrinsic content.
***REMOVED*** TODO(robbyw): What about object, br, input, textarea, button, isindex,
***REMOVED*** hr, keygen, select, table, tr, td?
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.editor.node.NON_EMPTY_TAGS_ = goog.object.createSet(
    goog.dom.TagName.IMG, goog.dom.TagName.IFRAME, goog.dom.TagName.EMBED);


***REMOVED***
***REMOVED*** Check if the node is in a standards mode document.
***REMOVED*** @param {Node} node The node to test.
***REMOVED*** @return {boolean} Whether the node is in a standards mode document.
***REMOVED***
goog.editor.node.isStandardsMode = function(node) {
  return goog.dom.getDomHelper(node).isCss1CompatMode();
***REMOVED***


***REMOVED***
***REMOVED*** Get the right-most non-ignorable leaf node of the given node.
***REMOVED*** @param {Node} parent The parent ndoe.
***REMOVED*** @return {Node} The right-most non-ignorable leaf node.
***REMOVED***
goog.editor.node.getRightMostLeaf = function(parent) {
  var temp;
  while (temp = goog.editor.node.getLastChild(parent)) {
    parent = temp;
  }
  return parent;
***REMOVED***


***REMOVED***
***REMOVED*** Get the left-most non-ignorable leaf node of the given node.
***REMOVED*** @param {Node} parent The parent ndoe.
***REMOVED*** @return {Node} The left-most non-ignorable leaf node.
***REMOVED***
goog.editor.node.getLeftMostLeaf = function(parent) {
  var temp;
  while (temp = goog.editor.node.getFirstChild(parent)) {
    parent = temp;
  }
  return parent;
***REMOVED***


***REMOVED***
***REMOVED*** Version of firstChild that skips nodes that are entirely
***REMOVED*** whitespace and comments.
***REMOVED*** @param {Node} parent The reference node.
***REMOVED*** @return {Node} The first child of sibling that is important according to
***REMOVED***     goog.editor.node.isImportant, or null if no such node exists.
***REMOVED***
goog.editor.node.getFirstChild = function(parent) {
  return goog.editor.node.getChildHelper_(parent, false);
***REMOVED***


***REMOVED***
***REMOVED*** Version of lastChild that skips nodes that are entirely whitespace or
***REMOVED*** comments.  (Normally lastChild is a property of all DOM nodes that gives the
***REMOVED*** last of the nodes contained directly in the reference node.)
***REMOVED*** @param {Node} parent The reference node.
***REMOVED*** @return {Node} The last child of sibling that is important according to
***REMOVED***     goog.editor.node.isImportant, or null if no such node exists.
***REMOVED***
goog.editor.node.getLastChild = function(parent) {
  return goog.editor.node.getChildHelper_(parent, true);
***REMOVED***


***REMOVED***
***REMOVED*** Version of previoussibling that skips nodes that are entirely
***REMOVED*** whitespace or comments.  (Normally previousSibling is a property
***REMOVED*** of all DOM nodes that gives the sibling node, the node that is
***REMOVED*** a child of the same parent, that occurs immediately before the
***REMOVED*** reference node.)
***REMOVED*** @param {Node} sibling The reference node.
***REMOVED*** @return {Node} The closest previous sibling to sibling that is
***REMOVED***     important according to goog.editor.node.isImportant, or null if no such
***REMOVED***     node exists.
***REMOVED***
goog.editor.node.getPreviousSibling = function(sibling) {
  return***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (goog.editor.node.getFirstValue_(
      goog.iter.filter(new goog.dom.iter.SiblingIterator(sibling, false, true),
      goog.editor.node.isImportant)));
***REMOVED***


***REMOVED***
***REMOVED*** Version of nextSibling that skips nodes that are entirely whitespace or
***REMOVED*** comments.
***REMOVED*** @param {Node} sibling The reference node.
***REMOVED*** @return {Node} The closest next sibling to sibling that is important
***REMOVED***     according to goog.editor.node.isImportant, or null if no
***REMOVED***     such node exists.
***REMOVED***
goog.editor.node.getNextSibling = function(sibling) {
  return***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (goog.editor.node.getFirstValue_(
      goog.iter.filter(new goog.dom.iter.SiblingIterator(sibling),
      goog.editor.node.isImportant)));
***REMOVED***


***REMOVED***
***REMOVED*** Internal helper for lastChild/firstChild that skips nodes that are entirely
***REMOVED*** whitespace or comments.
***REMOVED*** @param {Node} parent The reference node.
***REMOVED*** @param {boolean} isReversed Whether children should be traversed forward
***REMOVED***     or backward.
***REMOVED*** @return {Node} The first/last child of sibling that is important according
***REMOVED***     to goog.editor.node.isImportant, or null if no such node exists.
***REMOVED*** @private
***REMOVED***
goog.editor.node.getChildHelper_ = function(parent, isReversed) {
  return (!parent || parent.nodeType != goog.dom.NodeType.ELEMENT) ? null :
     ***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (goog.editor.node.getFirstValue_(goog.iter.filter(
          new goog.dom.iter.ChildIterator(
             ***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (parent), isReversed),
          goog.editor.node.isImportant)));
***REMOVED***


***REMOVED***
***REMOVED*** Utility function that returns the first value from an iterator or null if
***REMOVED*** the iterator is empty.
***REMOVED*** @param {goog.iter.Iterator} iterator The iterator to get a value from.
***REMOVED*** @return {*} The first value from the iterator.
***REMOVED*** @private
***REMOVED***
goog.editor.node.getFirstValue_ = function(iterator) {
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    return iterator.next();
  } catch (e) {
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Determine if a node should be returned by the iterator functions.
***REMOVED*** @param {Node} node An object implementing the DOM1 Node interface.
***REMOVED*** @return {boolean} Whether the node is an element, or a text node that
***REMOVED***     is not all whitespace.
***REMOVED***
goog.editor.node.isImportant = function(node) {
  // Return true if the node is not either a TextNode or an ElementNode.
  return node.nodeType == goog.dom.NodeType.ELEMENT ||
         node.nodeType == goog.dom.NodeType.TEXT &&
         !goog.editor.node.isAllNonNbspWhiteSpace(node);
***REMOVED***


***REMOVED***
***REMOVED*** Determine whether a node's text content is entirely whitespace.
***REMOVED*** @param {Node} textNode A node implementing the CharacterData interface (i.e.,
***REMOVED***     a Text, Comment, or CDATASection node.
***REMOVED*** @return {boolean} Whether the text content of node is whitespace,
***REMOVED***     otherwise false.
***REMOVED***
goog.editor.node.isAllNonNbspWhiteSpace = function(textNode) {
  return goog.string.isBreakingWhitespace(textNode.nodeValue);
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the node contains only whitespace and is not and does not
***REMOVED*** contain any images, iframes or embed tags.
***REMOVED*** @param {Node} node The node to check.
***REMOVED*** @param {boolean=} opt_prohibitSingleNbsp By default, this function treats a
***REMOVED***     single nbsp as empty.  Set this to true to treat this case as non-empty.
***REMOVED*** @return {boolean} Whether the node contains only whitespace.
***REMOVED***
goog.editor.node.isEmpty = function(node, opt_prohibitSingleNbsp) {
  var nodeData = goog.dom.getRawTextContent(node);

  if (node.getElementsByTagName) {
    for (var tag in goog.editor.node.NON_EMPTY_TAGS_) {
      if (node.tagName == tag || node.getElementsByTagName(tag).length > 0) {
        return false;
      }
    }
  }
  return (!opt_prohibitSingleNbsp && nodeData == goog.string.Unicode.NBSP) ||
      goog.string.isBreakingWhitespace(nodeData);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the length of the text in node if it is a text node, or the number
***REMOVED*** of children of the node, if it is an element. Useful for range-manipulation
***REMOVED*** code where you need to know the offset for the right side of the node.
***REMOVED*** @param {Node} node The node to get the length of.
***REMOVED*** @return {number} The length of the node.
***REMOVED***
goog.editor.node.getLength = function(node) {
  return node.length || node.childNodes.length;
***REMOVED***


***REMOVED***
***REMOVED*** Search child nodes using a predicate function and return the first node that
***REMOVED*** satisfies the condition.
***REMOVED*** @param {Node} parent The parent node to search.
***REMOVED*** @param {function(Node):boolean} hasProperty A function that takes a child
***REMOVED***    node as a parameter and returns true if it meets the criteria.
***REMOVED*** @return {?number} The index of the node found, or null if no node is found.
***REMOVED***
goog.editor.node.findInChildren = function(parent, hasProperty) {
  for (var i = 0, len = parent.childNodes.length; i < len; i++) {
    if (hasProperty(parent.childNodes[i])) {
      return i;
    }
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Search ancestor nodes using a predicate function and returns the topmost
***REMOVED*** ancestor in the chain of consecutive ancestors that satisfies the condition.
***REMOVED***
***REMOVED*** @param {Node} node The node whose ancestors have to be searched.
***REMOVED*** @param {function(Node): boolean} hasProperty A function that takes a parent
***REMOVED***     node as a parameter and returns true if it meets the criteria.
***REMOVED*** @return {Node} The topmost ancestor or null if no ancestor satisfies the
***REMOVED***     predicate function.
***REMOVED***
goog.editor.node.findHighestMatchingAncestor = function(node, hasProperty) {
  var parent = node.parentNode;
  var ancestor = null;
  while (parent && hasProperty(parent)) {
    ancestor = parent;
    parent = parent.parentNode;
  }
  return ancestor;
***REMOVED***


***REMOVED***
* Checks if node is a block-level html element. The <tt>display</tt> css
***REMOVED*** property is ignored.
***REMOVED*** @param {Node} node The node to test.
***REMOVED*** @return {boolean} Whether the node is a block-level node.
***REMOVED***
goog.editor.node.isBlockTag = function(node) {
  return !!goog.editor.node.BLOCK_TAG_NAMES_[node.tagName];
***REMOVED***


***REMOVED***
***REMOVED*** Skips siblings of a node that are empty text nodes.
***REMOVED*** @param {Node} node A node. May be null.
***REMOVED*** @return {Node} The node or the first sibling of the node that is not an
***REMOVED***     empty text node. May be null.
***REMOVED***
goog.editor.node.skipEmptyTextNodes = function(node) {
  while (node && node.nodeType == goog.dom.NodeType.TEXT &&
      !node.nodeValue) {
    node = node.nextSibling;
  }
  return node;
***REMOVED***


***REMOVED***
***REMOVED*** Checks if an element is a top-level editable container (meaning that
***REMOVED*** it itself is not editable, but all its child nodes are editable).
***REMOVED*** @param {Node} element The element to test.
***REMOVED*** @return {boolean} Whether the element is a top-level editable container.
***REMOVED***
goog.editor.node.isEditableContainer = function(element) {
  return element.getAttribute &&
      element.getAttribute('g_editable') == 'true';
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a node is inside an editable container.
***REMOVED*** @param {Node} node The node to test.
***REMOVED*** @return {boolean} Whether the node is in an editable container.
***REMOVED***
goog.editor.node.isEditable = function(node) {
  return !!goog.dom.getAncestor(node, goog.editor.node.isEditableContainer);
***REMOVED***


***REMOVED***
***REMOVED*** Finds the top-most DOM node inside an editable field that is an ancestor
***REMOVED*** (or self) of a given DOM node and meets the specified criteria.
***REMOVED*** @param {Node} node The DOM node where the search starts.
***REMOVED*** @param {function(Node) : boolean} criteria A function that takes a DOM node
***REMOVED***     as a parameter and returns a boolean to indicate whether the node meets
***REMOVED***     the criteria or not.
***REMOVED*** @return {Node} The DOM node if found, or null.
***REMOVED***
goog.editor.node.findTopMostEditableAncestor = function(node, criteria) {
  var targetNode = null;
  while (node && !goog.editor.node.isEditableContainer(node)) {
    if (criteria(node)) {
      targetNode = node;
    }
    node = node.parentNode;
  }
  return targetNode;
***REMOVED***


***REMOVED***
***REMOVED*** Splits off a subtree.
***REMOVED*** @param {!Node} currentNode The starting splitting point.
***REMOVED*** @param {Node=} opt_secondHalf The initial leftmost leaf the new subtree.
***REMOVED***     If null, siblings after currentNode will be placed in the subtree, but
***REMOVED***     no additional node will be.
***REMOVED*** @param {Node=} opt_root The top of the tree where splitting stops at.
***REMOVED*** @return {!Node} The new subtree.
***REMOVED***
goog.editor.node.splitDomTreeAt = function(currentNode,
    opt_secondHalf, opt_root) {
  var parent;
  while (currentNode != opt_root && (parent = currentNode.parentNode)) {
    opt_secondHalf = goog.editor.node.getSecondHalfOfNode_(parent, currentNode,
        opt_secondHalf);
    currentNode = parent;
  }
  return***REMOVED*****REMOVED*** @type {!Node}***REMOVED***(opt_secondHalf);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a clone of node, moving all children after startNode to it.
***REMOVED*** When firstChild is not null or undefined, it is also appended to the clone
***REMOVED*** as the first child.
***REMOVED*** @param {!Node} node The node to clone.
***REMOVED*** @param {!Node} startNode All siblings after this node will be moved to the
***REMOVED***     clone.
***REMOVED*** @param {Node|undefined} firstChild The first child of the new cloned element.
***REMOVED*** @return {!Node} The cloned node that now contains the children after
***REMOVED***     startNode.
***REMOVED*** @private
***REMOVED***
goog.editor.node.getSecondHalfOfNode_ = function(node, startNode, firstChild) {
  var secondHalf =***REMOVED*****REMOVED*** @type {!Node}***REMOVED***(node.cloneNode(false));
  while (startNode.nextSibling) {
    goog.dom.appendChild(secondHalf, startNode.nextSibling);
  }
  if (firstChild) {
    secondHalf.insertBefore(firstChild, secondHalf.firstChild);
  }
  return secondHalf;
***REMOVED***


***REMOVED***
***REMOVED*** Appends all of oldNode's children to newNode. This removes all children from
***REMOVED*** oldNode and appends them to newNode. oldNode is left with no children.
***REMOVED*** @param {!Node} newNode Node to transfer children to.
***REMOVED*** @param {Node} oldNode Node to transfer children from.
***REMOVED*** @deprecated Use goog.dom.append directly instead.
***REMOVED***
goog.editor.node.transferChildren = function(newNode, oldNode) {
  goog.dom.append(newNode, oldNode.childNodes);
***REMOVED***


***REMOVED***
***REMOVED*** Replaces the innerHTML of a node.
***REMOVED***
***REMOVED*** IE has serious problems if you try to set innerHTML of an editable node with
***REMOVED*** any selection. Early versions of IE tear up the old internal tree storage, to
***REMOVED*** help avoid ref-counting loops. But this sometimes leaves the selection object
***REMOVED*** in a bad state and leads to segfaults.
***REMOVED***
***REMOVED*** Removing the nodes first prevents IE from tearing them up. This is not
***REMOVED*** strictly necessary in nodes that do not have the selection. You should always
***REMOVED*** use this function when setting innerHTML inside of a field.
***REMOVED***
***REMOVED*** @param {Node} node A node.
***REMOVED*** @param {string} html The innerHTML to set on the node.
***REMOVED***
goog.editor.node.replaceInnerHtml = function(node, html) {
  // Only do this IE. On gecko, we use element change events, and don't
  // want to trigger spurious events.
  if (goog.userAgent.IE) {
    goog.dom.removeChildren(node);
  }
  node.innerHTML = html;
***REMOVED***
