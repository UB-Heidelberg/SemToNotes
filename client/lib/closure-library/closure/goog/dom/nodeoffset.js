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
***REMOVED*** @fileoverview Object to store the offset from one node to another in a way
***REMOVED*** that works on any similar DOM structure regardless of whether it is the same
***REMOVED*** actual nodes.
***REMOVED***
***REMOVED***

goog.provide('goog.dom.NodeOffset');

goog.require('goog.Disposable');
goog.require('goog.dom.TagName');



***REMOVED***
***REMOVED*** Object to store the offset from one node to another in a way that works on
***REMOVED*** any similar DOM structure regardless of whether it is the same actual nodes.
***REMOVED*** @param {Node} node The node to get the offset for.
***REMOVED*** @param {Node} baseNode The node to calculate the offset from.
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.dom.NodeOffset = function(node, baseNode) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** A stack of childNode offsets.
  ***REMOVED*** @type {Array.<number>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.offsetStack_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** A stack of childNode names.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.nameStack_ = [];

  while (node && node.nodeName != goog.dom.TagName.BODY && node != baseNode) {
    // Compute the sibling offset.
    var siblingOffset = 0;
    var sib = node.previousSibling;
    while (sib) {
      sib = sib.previousSibling;
      ++siblingOffset;
    }
    this.offsetStack_.unshift(siblingOffset);
    this.nameStack_.unshift(node.nodeName);

    node = node.parentNode;
  }
***REMOVED***
goog.inherits(goog.dom.NodeOffset, goog.Disposable);


***REMOVED***
***REMOVED*** @return {string} A string representation of this object.
***REMOVED*** @override
***REMOVED***
goog.dom.NodeOffset.prototype.toString = function() {
  var strs = [];
  var name;
  for (var i = 0; name = this.nameStack_[i]; i++) {
    strs.push(this.offsetStack_[i] + ',' + name);
  }
  return strs.join('\n');
***REMOVED***


***REMOVED***
***REMOVED*** Walk the dom and find the node relative to baseNode.  Returns null on
***REMOVED*** failure.
***REMOVED*** @param {Node} baseNode The node to start walking from.  Should be equivalent
***REMOVED***     to the node passed in to the constructor, in that it should have the
***REMOVED***     same contents.
***REMOVED*** @return {Node} The node relative to baseNode, or null on failure.
***REMOVED***
goog.dom.NodeOffset.prototype.findTargetNode = function(baseNode) {
  var name;
  var curNode = baseNode;
  for (var i = 0; name = this.nameStack_[i]; ++i) {
    curNode = curNode.childNodes[this.offsetStack_[i]];

    // Sanity check and make sure the element names match.
    if (!curNode || curNode.nodeName != name) {
      return null;
    }
  }
  return curNode;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.NodeOffset.prototype.disposeInternal = function() {
  delete this.offsetStack_;
  delete this.nameStack_;
***REMOVED***
