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
***REMOVED*** @fileoverview Class that allows for simple text editing tests.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.testing.editor.TestHelper');

goog.require('goog.Disposable');
goog.require('goog.dom');
goog.require('goog.dom.Range');
goog.require('goog.editor.BrowserFeature');
goog.require('goog.editor.node');
goog.require('goog.testing.dom');


***REMOVED***
***REMOVED*** Create a new test controller.
***REMOVED*** @param {Element} root The root editable element.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.testing.editor.TestHelper = function(root) {
  if (!root) {
    throw Error('Null root');
  }
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Convenience variable for root DOM element.
  ***REMOVED*** @type {!Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.root_ = root;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The starting HTML of the editable element.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.savedHtml_ = '';
***REMOVED***
goog.inherits(goog.testing.editor.TestHelper, goog.Disposable);


***REMOVED***
***REMOVED*** Selects a new root element.
***REMOVED*** @param {Element} root The root editable element.
***REMOVED***
goog.testing.editor.TestHelper.prototype.setRoot = function(root) {
  if (!root) {
    throw Error('Null root');
  }
  this.root_ = root;
***REMOVED***


***REMOVED***
***REMOVED*** Make the root element editable.  Alse saves its HTML to be restored
***REMOVED*** in tearDown.
***REMOVED***
goog.testing.editor.TestHelper.prototype.setUpEditableElement = function() {
  this.savedHtml_ = this.root_.innerHTML;
  if (goog.editor.BrowserFeature.HAS_CONTENT_EDITABLE) {
    this.root_.contentEditable = true;
  } else {
    this.root_.ownerDocument.designMode = 'on';
  }
  this.root_.setAttribute('g_editable', 'true');
***REMOVED***


***REMOVED***
***REMOVED*** Reset the element previously initialized, restoring its HTML and making it
***REMOVED*** non editable.
***REMOVED***
goog.testing.editor.TestHelper.prototype.tearDownEditableElement = function() {
  if (goog.editor.BrowserFeature.HAS_CONTENT_EDITABLE) {
    this.root_.contentEditable = false;
  } else {
    this.root_.ownerDocument.designMode = 'off';
  }
  goog.dom.removeChildren(this.root_);
  this.root_.innerHTML = this.savedHtml_;
  this.root_.removeAttribute('g_editable');

  if (goog.editor.plugins && goog.editor.plugins.AbstractBubblePlugin) {
    // Remove old bubbles.
    for (var key in goog.editor.plugins.AbstractBubblePlugin.bubbleMap_) {
      goog.editor.plugins.AbstractBubblePlugin.bubbleMap_[key].dispose();
    }
    // Ensure we get a new bubble for each test.
    goog.editor.plugins.AbstractBubblePlugin.bubbleMap_ = {***REMOVED***
  }
***REMOVED***


***REMOVED***
***REMOVED*** Assert that the html in 'root' is substantially similar to htmlPattern.
***REMOVED*** This method tests for the same set of styles, and for the same order of
***REMOVED*** nodes.  Breaking whitespace nodes are ignored.  Elements can be annotated
***REMOVED*** with classnames corresponding to keys in goog.userAgent and will be
***REMOVED*** expected to show up in that user agent and expected not to show up in
***REMOVED*** others.
***REMOVED*** @param {string} htmlPattern The pattern to match.
***REMOVED***
goog.testing.editor.TestHelper.prototype.assertHtmlMatches = function(
    htmlPattern) {
  goog.testing.dom.assertHtmlContentsMatch(htmlPattern, this.root_);
***REMOVED***


***REMOVED***
***REMOVED*** Finds the first text node descendant of root with the given content.
***REMOVED*** @param {string|RegExp} textOrRegexp The text to find, or a regular
***REMOVED***     expression to find a match of.
***REMOVED*** @return {Node} The first text node that matches, or null if none is found.
***REMOVED***
goog.testing.editor.TestHelper.prototype.findTextNode = function(textOrRegexp) {
  return goog.testing.dom.findTextNode(textOrRegexp, this.root_);
***REMOVED***


***REMOVED***
***REMOVED*** Select from the given from offset in the given from node to the given
***REMOVED*** to offset in the optionally given to node. If nodes are passed in, uses them,
***REMOVED*** otherwise uses findTextNode to find the nodes to select. Selects a caret
***REMOVED*** if opt_to and opt_toOffset are not given.
***REMOVED*** @param {Node|string} from Node or text of the node to start the selection at.
***REMOVED*** @param {number} fromOffset Offset within the above node to start the
***REMOVED***     selection at.
***REMOVED*** @param {Node|string=} opt_to Node or text of the node to end the selection
***REMOVED***     at.
***REMOVED*** @param {number=} opt_toOffset Offset within the above node to end the
***REMOVED***     selection at.
***REMOVED***
goog.testing.editor.TestHelper.prototype.select = function(from, fromOffset,
    opt_to, opt_toOffset) {
  var end;
  var start = end = goog.isString(from) ? this.findTextNode(from) : from;
  var endOffset;
  var startOffset = endOffset = fromOffset;

  if (opt_to && goog.isNumber(opt_toOffset)) {
    end = goog.isString(opt_to) ? this.findTextNode(opt_to) : opt_to;
    endOffset = opt_toOffset;
  }

  goog.dom.Range.createFromNodes(start, startOffset, end, endOffset).select();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.editor.TestHelper.prototype.disposeInternal = function() {
  if (goog.editor.node.isEditableContainer(this.root_)) {
    this.tearDownEditableElement();
  }
  delete this.root_;
  goog.base(this, 'disposeInternal');
***REMOVED***
