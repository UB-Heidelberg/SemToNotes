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
***REMOVED*** @fileoverview Iterators over DOM nodes.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.dom.iter.AncestorIterator');
goog.provide('goog.dom.iter.ChildIterator');
goog.provide('goog.dom.iter.SiblingIterator');

goog.require('goog.iter.Iterator');
goog.require('goog.iter.StopIteration');



***REMOVED***
***REMOVED*** Iterator over a Node's siblings.
***REMOVED*** @param {Node} node The node to start with.
***REMOVED*** @param {boolean=} opt_includeNode Whether to return the given node as the
***REMOVED***     first return value from next.
***REMOVED*** @param {boolean=} opt_reverse Whether to traverse siblings in reverse
***REMOVED***     document order.
***REMOVED***
***REMOVED*** @extends {goog.iter.Iterator}
***REMOVED***
goog.dom.iter.SiblingIterator = function(node, opt_includeNode, opt_reverse) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The current node, or null if iteration is finished.
  ***REMOVED*** @type {Node}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.node_ = node;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to iterate in reverse.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.reverse_ = !!opt_reverse;

  if (node && !opt_includeNode) {
    this.next();
  }
***REMOVED***
goog.inherits(goog.dom.iter.SiblingIterator, goog.iter.Iterator);


***REMOVED*** @override***REMOVED***
goog.dom.iter.SiblingIterator.prototype.next = function() {
  var node = this.node_;
  if (!node) {
    throw goog.iter.StopIteration;
  }
  this.node_ = this.reverse_ ? node.previousSibling : node.nextSibling;
  return node;
***REMOVED***



***REMOVED***
***REMOVED*** Iterator over an Element's children.
***REMOVED*** @param {Element} element The element to iterate over.
***REMOVED*** @param {boolean=} opt_reverse Optionally traverse children from last to
***REMOVED***     first.
***REMOVED*** @param {number=} opt_startIndex Optional starting index.
***REMOVED***
***REMOVED*** @extends {goog.dom.iter.SiblingIterator}
***REMOVED***
goog.dom.iter.ChildIterator = function(element, opt_reverse, opt_startIndex) {
  if (!goog.isDef(opt_startIndex)) {
    opt_startIndex = opt_reverse && element.childNodes.length ?
        element.childNodes.length - 1 : 0;
  }
  goog.dom.iter.SiblingIterator.call(this, element.childNodes[opt_startIndex],
      true, opt_reverse);
***REMOVED***
goog.inherits(goog.dom.iter.ChildIterator, goog.dom.iter.SiblingIterator);



***REMOVED***
***REMOVED*** Iterator over a Node's ancestors, stopping after the document body.
***REMOVED*** @param {Node} node The node to start with.
***REMOVED*** @param {boolean=} opt_includeNode Whether to return the given node as the
***REMOVED***     first return value from next.
***REMOVED***
***REMOVED*** @extends {goog.iter.Iterator}
***REMOVED***
goog.dom.iter.AncestorIterator = function(node, opt_includeNode) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The current node, or null if iteration is finished.
  ***REMOVED*** @type {Node}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.node_ = node;

  if (node && !opt_includeNode) {
    this.next();
  }
***REMOVED***
goog.inherits(goog.dom.iter.AncestorIterator, goog.iter.Iterator);


***REMOVED*** @override***REMOVED***
goog.dom.iter.AncestorIterator.prototype.next = function() {
  var node = this.node_;
  if (!node) {
    throw goog.iter.StopIteration;
  }
  this.node_ = node.parentNode;
  return node;
***REMOVED***

