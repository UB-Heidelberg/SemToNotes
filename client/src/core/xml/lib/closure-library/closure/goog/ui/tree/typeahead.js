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

***REMOVED***
***REMOVED*** @fileoverview Provides the typeahead functionality for the tree class.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.tree.TypeAhead');
goog.provide('goog.ui.tree.TypeAhead.Offset');

goog.require('goog.array');
goog.require('goog.events.KeyCodes');
goog.require('goog.string');
goog.require('goog.structs.Trie');



***REMOVED***
***REMOVED*** Constructs a TypeAhead object.
***REMOVED***
***REMOVED***
goog.ui.tree.TypeAhead = function() {
  this.nodeMap_ = new goog.structs.Trie();
***REMOVED***


***REMOVED***
***REMOVED*** Map of tree nodes to allow for quick access by characters in the label text.
***REMOVED*** @type {goog.structs.Trie}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TypeAhead.prototype.nodeMap_;


***REMOVED***
***REMOVED*** Buffer for storing typeahead characters.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TypeAhead.prototype.buffer_ = '';


***REMOVED***
***REMOVED*** Matching labels from the latest typeahead search.
***REMOVED*** @type {Array.<string>?}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TypeAhead.prototype.matchingLabels_ = null;


***REMOVED***
***REMOVED*** Matching nodes from the latest typeahead search. Used when more than
***REMOVED*** one node is present with the same label text.
***REMOVED*** @type {Array.<goog.ui.tree.BaseNode>?}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TypeAhead.prototype.matchingNodes_ = null;


***REMOVED***
***REMOVED*** Specifies the current index of the label from the latest typeahead search.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TypeAhead.prototype.matchingLabelIndex_ = 0;


***REMOVED***
***REMOVED*** Specifies the index into matching nodes when more than one node is found
***REMOVED*** with the same label.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TypeAhead.prototype.matchingNodeIndex_ = 0;


***REMOVED***
***REMOVED*** Enum for offset values that are used for ctrl-key navigation among the
***REMOVED*** multiple matches of a given typeahead buffer.
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
goog.ui.tree.TypeAhead.Offset = {
  DOWN: 1,
  UP: -1
***REMOVED***


***REMOVED***
***REMOVED*** Handles navigation keys.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @return {boolean} The handled value.
***REMOVED***
goog.ui.tree.TypeAhead.prototype.handleNavigation = function(e) {
  var handled = false;

  switch (e.keyCode) {
    // Handle ctrl+down, ctrl+up to navigate within typeahead results.
    case goog.events.KeyCodes.DOWN:
    case goog.events.KeyCodes.UP:
      if (e.ctrlKey) {
        this.jumpTo_(e.keyCode == goog.events.KeyCodes.DOWN ?
                     goog.ui.tree.TypeAhead.Offset.DOWN :
                     goog.ui.tree.TypeAhead.Offset.UP);
        handled = true;
      }
      break;

    // Remove the last typeahead char.
    case goog.events.KeyCodes.BACKSPACE:
      var length = this.buffer_.length - 1;
      handled = true;
      if (length > 0) {
        this.buffer_ = this.buffer_.substring(0, length);
        this.jumpToLabel_(this.buffer_);
      } else if (length == 0) {
        // Clear the last character in typeahead.
        this.buffer_ = '';
      } else {
        handled = false;
      }
      break;

    // Clear typeahead buffer.
    case goog.events.KeyCodes.ESC:
      this.buffer_ = '';
      handled = true;
      break;
  }

  return handled;
***REMOVED***


***REMOVED***
***REMOVED*** Handles the character presses.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED***    Expected event type is goog.events.KeyHandler.EventType.KEY.
***REMOVED*** @return {boolean} The handled value.
***REMOVED***
goog.ui.tree.TypeAhead.prototype.handleTypeAheadChar = function(e) {
  var handled = false;

  if (!e.ctrlKey && !e.altKey) {
    // Since goog.structs.Trie.getKeys compares characters during
    // lookup, we should use charCode instead of keyCode where possible.
    // Convert to lowercase, typeahead is case insensitive.
    var ch = String.fromCharCode(e.charCode || e.keyCode).toLowerCase();
    if (goog.string.isUnicodeChar(ch) && (ch != ' ' || this.buffer_)) {
      this.buffer_ += ch;
      handled = this.jumpToLabel_(this.buffer_);
    }
  }

  return handled;
***REMOVED***


***REMOVED***
***REMOVED*** Adds or updates the given node in the nodemap. The label text is used as a
***REMOVED*** key and the node id is used as a value. In the case that the key already
***REMOVED*** exists, such as when more than one node exists with the same label, then this
***REMOVED*** function creates an array to hold the multiple nodes.
***REMOVED*** @param {goog.ui.tree.BaseNode} node Node to be added or updated.
***REMOVED***
goog.ui.tree.TypeAhead.prototype.setNodeInMap = function(node) {
  var labelText = node.getText();
  if (labelText && !goog.string.isEmptySafe(labelText)) {
    // Typeahead is case insensitive, convert to lowercase.
    labelText = labelText.toLowerCase();

    var previousValue = this.nodeMap_.get(labelText);
    if (previousValue) {
      // Found a previously created array, add the given node.
      previousValue.push(node);
    } else {
      // Create a new array and set the array as value.
      var nodeList = [node];
      this.nodeMap_.set(labelText, nodeList);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the given node from the nodemap.
***REMOVED*** @param {goog.ui.tree.BaseNode} node Node to be removed.
***REMOVED***
goog.ui.tree.TypeAhead.prototype.removeNodeFromMap = function(node) {
  var labelText = node.getText();
  if (labelText && !goog.string.isEmptySafe(labelText)) {
    labelText = labelText.toLowerCase();

    var nodeList =***REMOVED*****REMOVED*** @type {Array}***REMOVED*** (this.nodeMap_.get(labelText));
    if (nodeList) {
      // Remove the node from the array.
      goog.array.remove(nodeList, node);
      if (!!nodeList.length) {
        this.nodeMap_.remove(labelText);
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Select the first matching node for the given typeahead.
***REMOVED*** @param {string} typeAhead Typeahead characters to match.
***REMOVED*** @return {boolean} True iff a node is found.
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TypeAhead.prototype.jumpToLabel_ = function(typeAhead) {
  var handled = false;
  var labels = this.nodeMap_.getKeys(typeAhead);

  // Make sure we have at least one matching label.
  if (labels && labels.length) {
    this.matchingNodeIndex_ = 0;
    this.matchingLabelIndex_ = 0;

    var nodes =***REMOVED*****REMOVED*** @type {Array}***REMOVED*** (this.nodeMap_.get(labels[0]));
    if ((handled = this.selectMatchingNode_(nodes))) {
      this.matchingLabels_ = labels;
    }
  }

  // TODO(user): beep when no node is found
  return handled;
***REMOVED***


***REMOVED***
***REMOVED*** Select the next or previous node based on the offset.
***REMOVED*** @param {goog.ui.tree.TypeAhead.Offset} offset DOWN or UP.
***REMOVED*** @return {boolean} Whether a node is found.
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TypeAhead.prototype.jumpTo_ = function(offset) {
  var handled = false;
  var labels = this.matchingLabels_;

  if (labels) {
    var nodes = null;
    var nodeIndexOutOfRange = false;

    // Navigate within the nodes array.
    if (this.matchingNodes_) {
      var newNodeIndex = this.matchingNodeIndex_ + offset;
      if (newNodeIndex >= 0 && newNodeIndex < this.matchingNodes_.length) {
        this.matchingNodeIndex_ = newNodeIndex;
        nodes = this.matchingNodes_;
      } else {
        nodeIndexOutOfRange = true;
      }
    }

    // Navigate to the next or previous label.
    if (!nodes) {
      var newLabelIndex = this.matchingLabelIndex_ + offset;
      if (newLabelIndex >= 0 && newLabelIndex < labels.length) {
        this.matchingLabelIndex_ = newLabelIndex;
      }

      if (labels.length > this.matchingLabelIndex_) {
        nodes =***REMOVED*****REMOVED*** @type {Array}***REMOVED*** (this.nodeMap_.get(
            labels[this.matchingLabelIndex_]));
      }

      // Handle the case where we are moving beyond the available nodes,
      // while going UP select the last item of multiple nodes with same label
      // and while going DOWN select the first item of next set of nodes
      if (nodes && nodes.length && nodeIndexOutOfRange) {
        this.matchingNodeIndex_ = (offset == goog.ui.tree.TypeAhead.Offset.UP) ?
                                  nodes.length - 1 : 0;
      }
    }

    if ((handled = this.selectMatchingNode_(nodes))) {
      this.matchingLabels_ = labels;
    }
  }

  // TODO(user): beep when no node is found
  return handled;
***REMOVED***


***REMOVED***
***REMOVED*** Given a nodes array reveals and selects the node while using node index.
***REMOVED*** @param {Array.<goog.ui.tree.BaseNode>?} nodes Nodes array to select the
***REMOVED***    node from.
***REMOVED*** @return {boolean} Whether a matching node was found.
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TypeAhead.prototype.selectMatchingNode_ = function(nodes) {
  var node;

  if (nodes) {
    // Find the matching node.
    if (this.matchingNodeIndex_ < nodes.length) {
      node = nodes[this.matchingNodeIndex_];
      this.matchingNodes_ = nodes;
    }

    if (node) {
      node.reveal();
      node.select();
    }
  }

  return !!node;
***REMOVED***


***REMOVED***
***REMOVED*** Clears the typeahead buffer.
***REMOVED***
goog.ui.tree.TypeAhead.prototype.clear = function() {
  this.buffer_ = '';
***REMOVED***
