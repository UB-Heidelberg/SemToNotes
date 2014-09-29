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
***REMOVED*** @fileoverview goog.editor plugin to handle splitting block quotes.
***REMOVED***
***REMOVED***

goog.provide('goog.editor.plugins.Blockquote');

goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.editor.BrowserFeature');
goog.require('goog.editor.Command');
goog.require('goog.editor.Plugin');
goog.require('goog.editor.node');
goog.require('goog.functions');



***REMOVED***
***REMOVED*** Plugin to handle splitting block quotes.  This plugin does nothing on its
***REMOVED*** own and should be used in conjunction with EnterHandler or one of its
***REMOVED*** subclasses.
***REMOVED*** @param {boolean} requiresClassNameToSplit Whether to split only blockquotes
***REMOVED***     that have the given classname.
***REMOVED*** @param {string=} opt_className The classname to apply to generated
***REMOVED***     blockquotes.  Defaults to 'tr_bq'.
***REMOVED***
***REMOVED*** @extends {goog.editor.Plugin}
***REMOVED***
goog.editor.plugins.Blockquote = function(requiresClassNameToSplit,
    opt_className) {
  goog.editor.Plugin.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether we only split blockquotes that have {@link classname}, or whether
  ***REMOVED*** all blockquote tags should be split on enter.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.requiresClassNameToSplit_ = requiresClassNameToSplit;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Classname to put on blockquotes that are generated via the toolbar for
  ***REMOVED*** blockquote, so that we can internally distinguish these from blockquotes
  ***REMOVED*** that are used for indentation.  This classname can be over-ridden by
  ***REMOVED*** clients for styling or other purposes.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.className_ = opt_className || goog.getCssName('tr_bq');
***REMOVED***
goog.inherits(goog.editor.plugins.Blockquote, goog.editor.Plugin);


***REMOVED***
***REMOVED*** Command implemented by this plugin.
***REMOVED*** @type {string}
***REMOVED***
goog.editor.plugins.Blockquote.SPLIT_COMMAND = '+splitBlockquote';


***REMOVED***
***REMOVED*** Class ID used to identify this plugin.
***REMOVED*** @type {string}
***REMOVED***
goog.editor.plugins.Blockquote.CLASS_ID = 'Blockquote';


***REMOVED***
***REMOVED*** Logging object.
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.editor.plugins.Blockquote.prototype.logger =
    goog.debug.Logger.getLogger('goog.editor.plugins.Blockquote');


***REMOVED*** @override***REMOVED***
goog.editor.plugins.Blockquote.prototype.getTrogClassId = function() {
  return goog.editor.plugins.Blockquote.CLASS_ID;
***REMOVED***


***REMOVED***
***REMOVED*** Since our exec command is always called from elsewhere, we make it silent.
***REMOVED*** @override
***REMOVED***
goog.editor.plugins.Blockquote.prototype.isSilentCommand = goog.functions.TRUE;


***REMOVED***
***REMOVED*** Checks if a node is a blockquote node.  If isAlreadySetup is set, it also
***REMOVED*** makes sure the node has the blockquote classname applied.  Otherwise, it
***REMOVED*** ensures that the blockquote does not already have the classname applied.
***REMOVED*** @param {Node} node DOM node to check.
***REMOVED*** @param {boolean} isAlreadySetup True to enforce that the classname must be
***REMOVED***                  set in order for it to count as a blockquote, false to
***REMOVED***                  enforce that the classname must not be set in order for
***REMOVED***                  it to count as a blockquote.
***REMOVED*** @param {boolean} requiresClassNameToSplit Whether only blockquotes with the
***REMOVED***     class name should be split.
***REMOVED*** @param {string} className The official blockquote class name.
***REMOVED*** @return {boolean} Whether node is a blockquote and if isAlreadySetup is
***REMOVED***    true, then whether this is a setup blockquote.
***REMOVED*** @deprecated Use {@link #isSplittableBlockquote},
***REMOVED***     {@link #isSetupBlockquote}, or {@link #isUnsetupBlockquote} instead
***REMOVED***     since this has confusing behavior.
***REMOVED***
goog.editor.plugins.Blockquote.isBlockquote = function(node, isAlreadySetup,
    requiresClassNameToSplit, className) {
  if (node.tagName != goog.dom.TagName.BLOCKQUOTE) {
    return false;
  }
  if (!requiresClassNameToSplit) {
    return isAlreadySetup;
  }
  var hasClassName = goog.dom.classes.has(***REMOVED*** @type {Element}***REMOVED*** (node),
      className);
  return isAlreadySetup ? hasClassName : !hasClassName;
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a node is a blockquote which can be split. A splittable blockquote
***REMOVED*** meets the following criteria:
***REMOVED*** <ol>
***REMOVED***   <li>Node is a blockquote element</li>
***REMOVED***   <li>Node has the blockquote classname if the classname is required to
***REMOVED***       split</li>
***REMOVED*** </ol>
***REMOVED***
***REMOVED*** @param {Node} node DOM node in question.
***REMOVED*** @return {boolean} Whether the node is a splittable blockquote.
***REMOVED***
goog.editor.plugins.Blockquote.prototype.isSplittableBlockquote =
    function(node) {
  if (node.tagName != goog.dom.TagName.BLOCKQUOTE) {
    return false;
  }

  if (!this.requiresClassNameToSplit_) {
    return true;
  }

  return goog.dom.classes.has(node, this.className_);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a node is a blockquote element which has been setup.
***REMOVED*** @param {Node} node DOM node to check.
***REMOVED*** @return {boolean} Whether the node is a blockquote with the required class
***REMOVED***     name applied.
***REMOVED***
goog.editor.plugins.Blockquote.prototype.isSetupBlockquote =
    function(node) {
  return node.tagName == goog.dom.TagName.BLOCKQUOTE &&
      goog.dom.classes.has(node, this.className_);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a node is a blockquote element which has not been setup yet.
***REMOVED*** @param {Node} node DOM node to check.
***REMOVED*** @return {boolean} Whether the node is a blockquote without the required
***REMOVED***     class name applied.
***REMOVED***
goog.editor.plugins.Blockquote.prototype.isUnsetupBlockquote =
    function(node) {
  return node.tagName == goog.dom.TagName.BLOCKQUOTE &&
      !this.isSetupBlockquote(node);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the class name required for setup blockquotes.
***REMOVED*** @return {string} The blockquote class name.
***REMOVED***
goog.editor.plugins.Blockquote.prototype.getBlockquoteClassName = function() {
  return this.className_;
***REMOVED***


***REMOVED***
***REMOVED*** Helper routine which walks up the tree to find the topmost
***REMOVED*** ancestor with only a single child. The ancestor node or the original
***REMOVED*** node (if no ancestor was found) is then removed from the DOM.
***REMOVED***
***REMOVED*** @param {Node} node The node whose ancestors have to be searched.
***REMOVED*** @param {Node} root The root node to stop the search at.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.Blockquote.findAndRemoveSingleChildAncestor_ = function(
    node, root) {
  var predicateFunc = function(parentNode) {
    return parentNode != root && parentNode.childNodes.length == 1;
  }
  var ancestor = goog.editor.node.findHighestMatchingAncestor(node,
      predicateFunc);
  if (!ancestor) {
    ancestor = node;
  }
  goog.dom.removeNode(ancestor);
***REMOVED***


***REMOVED***
***REMOVED*** Remove every nodes from the DOM tree that are all white space nodes.
***REMOVED*** @param {Array.<Node>} nodes Nodes to be checked.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.Blockquote.removeAllWhiteSpaceNodes_ = function(nodes) {
  for (var i = 0; i < nodes.length; ++i) {
    if (goog.editor.node.isEmpty(nodes[i], true)) {
      goog.dom.removeNode(nodes[i]);
    }
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.Blockquote.prototype.isSupportedCommand = function(
    command) {
  return command == goog.editor.plugins.Blockquote.SPLIT_COMMAND;
***REMOVED***


***REMOVED***
***REMOVED*** Splits a quoted region if any.  To be called on a key press event.  When this
***REMOVED*** function returns true, the event that caused it to be called should be
***REMOVED*** canceled.
***REMOVED*** @param {string} command The command to execute.
***REMOVED*** @param {...*} var_args Single additional argument representing the
***REMOVED***     current cursor position.  In IE, it is a single node.  In any other
***REMOVED***     browser, it is an object with a {@code node} key and an {@code offset}
***REMOVED***     key.
***REMOVED*** @return {boolean|undefined} Boolean true when the quoted region has been
***REMOVED***     split, false or undefined otherwise.
***REMOVED*** @override
***REMOVED***
goog.editor.plugins.Blockquote.prototype.execCommandInternal = function(
    command, var_args) {
  var pos = arguments[1];
  if (command == goog.editor.plugins.Blockquote.SPLIT_COMMAND && pos &&
      (this.className_ || !this.requiresClassNameToSplit_)) {
    return goog.editor.BrowserFeature.HAS_W3C_RANGES ?
        this.splitQuotedBlockW3C_(pos) :
        this.splitQuotedBlockIE_(***REMOVED*** @type {Node}***REMOVED*** (pos));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Version of splitQuotedBlock_ that uses W3C ranges.
***REMOVED*** @param {Object} anchorPos The current cursor position.
***REMOVED*** @return {boolean} Whether the blockquote was split.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.Blockquote.prototype.splitQuotedBlockW3C_ =
    function(anchorPos) {
  var cursorNode = anchorPos.node;
  var quoteNode = goog.editor.node.findTopMostEditableAncestor(
      cursorNode.parentNode, goog.bind(this.isSplittableBlockquote, this));

  var secondHalf, textNodeToRemove;
  var insertTextNode = false;
  // There are two special conditions that we account for here.
  //
  // 1. Whenever the cursor is after (one<BR>|) or just before a BR element
  //    (one|<BR>) and the user presses enter, the second quoted block starts
  //    with a BR which appears to the user as an extra newline. This stems
  //    from the fact that we create two text nodes as our split boundaries
  //    and the BR becomes a part of the second half because of this.
  //
  // 2. When the cursor is at the end of a text node with no siblings and
  //    the user presses enter, the second blockquote might contain a
  //    empty subtree that ends in a 0 length text node. We account for that
  //    as a post-splitting operation.
  if (quoteNode) {

    // selection is in a line that has text in it
    if (cursorNode.nodeType == goog.dom.NodeType.TEXT) {
      if (anchorPos.offset == cursorNode.length) {
        var siblingNode = cursorNode.nextSibling;

        // This accounts for the condition where the cursor appears at the
        // end of a text node and right before the BR eg: one|<BR>. We ensure
        // that we split on the BR in that case.
        if (siblingNode && siblingNode.tagName == goog.dom.TagName.BR) {
          cursorNode = siblingNode;
          // This might be null but splitDomTreeAt accounts for the null case.
          secondHalf = siblingNode.nextSibling;
        } else {
          textNodeToRemove = cursorNode.splitText(anchorPos.offset);
          secondHalf = textNodeToRemove;
        }
      } else {
        secondHalf = cursorNode.splitText(anchorPos.offset);
      }
    } else if (cursorNode.tagName == goog.dom.TagName.BR) {
      // This might be null but splitDomTreeAt accounts for the null case.
      secondHalf = cursorNode.nextSibling;
    } else {
      // The selection is in a line that is empty, with more than 1 level
      // of quote.
      insertTextNode = true;
    }
  } else {
    // Check if current node is a quote node.
    // This will happen if user clicks in an empty line in the quote,
    // when there is 1 level of quote.
    if (this.isSetupBlockquote(cursorNode)) {
      quoteNode = cursorNode;
      insertTextNode = true;
    }
  }

  if (insertTextNode) {
    // Create two empty text nodes to split between.
    cursorNode = this.insertEmptyTextNodeBeforeRange_();
    secondHalf = this.insertEmptyTextNodeBeforeRange_();
  }

  if (!quoteNode) {
    return false;
  }

  secondHalf = goog.editor.node.splitDomTreeAt(cursorNode, secondHalf,
      quoteNode);
  goog.dom.insertSiblingAfter(secondHalf, quoteNode);

  // Set the insertion point.
  var dh = this.getFieldDomHelper();
  var tagToInsert =
      this.getFieldObject().queryCommandValue(
          goog.editor.Command.DEFAULT_TAG) ||
          goog.dom.TagName.DIV;
  var container = dh.createElement(***REMOVED*** @type {string}***REMOVED*** (tagToInsert));
  container.innerHTML = '&nbsp;';  // Prevent the div from collapsing.
  quoteNode.parentNode.insertBefore(container, secondHalf);
  dh.getWindow().getSelection().collapse(container, 0);

  // We need to account for the condition where the second blockquote
  // might contain an empty DOM tree. This arises from trying to split
  // at the end of an empty text node. We resolve this by walking up the tree
  // till we either reach the blockquote or till we hit a node with more
  // than one child. The resulting node is then removed from the DOM.
  if (textNodeToRemove) {
    goog.editor.plugins.Blockquote.findAndRemoveSingleChildAncestor_(
        textNodeToRemove, secondHalf);
  }

  goog.editor.plugins.Blockquote.removeAllWhiteSpaceNodes_(
      [quoteNode, secondHalf]);
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Inserts an empty text node before the field's range.
***REMOVED*** @return {!Node} The empty text node.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.Blockquote.prototype.insertEmptyTextNodeBeforeRange_ =
    function() {
  var range = this.getFieldObject().getRange();
  var node = this.getFieldDomHelper().createTextNode('');
  range.insertNode(node, true);
  return node;
***REMOVED***


***REMOVED***
***REMOVED*** IE version of splitQuotedBlock_.
***REMOVED*** @param {Node} splitNode The current cursor position.
***REMOVED*** @return {boolean} Whether the blockquote was split.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.Blockquote.prototype.splitQuotedBlockIE_ =
    function(splitNode) {
  var dh = this.getFieldDomHelper();
  var quoteNode = goog.editor.node.findTopMostEditableAncestor(
      splitNode.parentNode, goog.bind(this.isSplittableBlockquote, this));

  if (!quoteNode) {
    return false;
  }

  var clone = splitNode.cloneNode(false);

  // Whenever the cursor is just before a BR element (one|<BR>) and the user
  // presses enter, the second quoted block starts with a BR which appears
  // to the user as an extra newline. This stems from the fact that the
  // dummy span that we create (splitNode) occurs before the BR and we split
  // on that.
  if (splitNode.nextSibling &&
      splitNode.nextSibling.tagName == goog.dom.TagName.BR) {
    splitNode = splitNode.nextSibling;
  }
  var secondHalf = goog.editor.node.splitDomTreeAt(splitNode, clone, quoteNode);
  goog.dom.insertSiblingAfter(secondHalf, quoteNode);

  // Set insertion point.
  var tagToInsert =
      this.getFieldObject().queryCommandValue(
          goog.editor.Command.DEFAULT_TAG) ||
          goog.dom.TagName.DIV;
  var div = dh.createElement(***REMOVED*** @type {string}***REMOVED*** (tagToInsert));
  quoteNode.parentNode.insertBefore(div, secondHalf);

  // The div needs non-whitespace contents in order for the insertion point
  // to get correctly inserted.
  div.innerHTML = '&nbsp;';

  // Moving the range 1 char isn't enough when you have markup.
  // This moves the range to the end of the nbsp.
  var range = dh.getDocument().selection.createRange();
  range.moveToElementText(splitNode);
  range.move('character', 2);
  range.select();

  // Remove the no-longer-necessary nbsp.
  div.innerHTML = '';

  // Clear the original selection.
  range.pasteHTML('');

  // We need to remove clone from the DOM but just removing clone alone will
  // not suffice. Let's assume we have the following DOM structure and the
  // cursor is placed after the first numbered list item "one".
  //
  // <blockquote class="gmail-quote">
  //   <div><div>a</div><ol><li>one|</li></ol></div>
  //   <div>b</div>
  // </blockquote>
  //
  // After pressing enter, we have the following structure.
  //
  // <blockquote class="gmail-quote">
  //   <div><div>a</div><ol><li>one|</li></ol></div>
  // </blockquote>
  // <div>&nbsp;</div>
  // <blockquote class="gmail-quote">
  //   <div><ol><li><span id=""></span></li></ol></div>
  //   <div>b</div>
  // </blockquote>
  //
  // The clone is contained in a subtree which should be removed. This stems
  // from the fact that we invoke splitDomTreeAt with the dummy span
  // as the starting splitting point and this results in the empty subtree
  // <div><ol><li><span id=""></span></li></ol></div>.
  //
  // We resolve this by walking up the tree till we either reach the
  // blockquote or till we hit a node with more than one child. The resulting
  // node is then removed from the DOM.
  goog.editor.plugins.Blockquote.findAndRemoveSingleChildAncestor_(
      clone, secondHalf);

  goog.editor.plugins.Blockquote.removeAllWhiteSpaceNodes_(
      [quoteNode, secondHalf]);
  return true;
***REMOVED***
