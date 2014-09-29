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
***REMOVED*** @fileoverview Useful callback functions for the DOM matcher.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.dom.pattern.callback');

goog.require('goog.dom');
goog.require('goog.dom.TagWalkType');
goog.require('goog.iter');


***REMOVED***
***REMOVED*** Callback function for use in {@link goog.dom.pattern.Matcher.addPattern}
***REMOVED*** that removes the matched node from the tree.  Should be used in conjunciton
***REMOVED*** with a {@link goog.dom.pattern.StartTag} pattern.
***REMOVED***
***REMOVED*** @param {Node} node The node matched by the pattern.
***REMOVED*** @param {goog.dom.TagIterator} position The position where the match
***REMOVED***     finished.
***REMOVED*** @return {boolean} Returns true to indicate tree changes were made.
***REMOVED***
goog.dom.pattern.callback.removeNode = function(node, position) {
  // Find out which position would be next.
  position.setPosition(node, goog.dom.TagWalkType.END_TAG);

  goog.iter.nextOrValue(position, null);

  // Remove the node.
  goog.dom.removeNode(node);

  // Correct for the depth change.
  position.depth -= 1;

  // Indicate that we made position/tree changes.
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Callback function for use in {@link goog.dom.pattern.Matcher.addPattern}
***REMOVED*** that removes the matched node from the tree and replaces it with its
***REMOVED*** children.  Should be used in conjunction with a
***REMOVED*** {@link goog.dom.pattern.StartTag} pattern.
***REMOVED***
***REMOVED*** @param {Element} node The node matched by the pattern.
***REMOVED*** @param {goog.dom.TagIterator} position The position where the match
***REMOVED***     finished.
***REMOVED*** @return {boolean} Returns true to indicate tree changes were made.
***REMOVED***
goog.dom.pattern.callback.flattenElement = function(node, position) {
  // Find out which position would be next.
  position.setPosition(node, node.firstChild ?
      goog.dom.TagWalkType.START_TAG :
      goog.dom.TagWalkType.END_TAG);

  goog.iter.nextOrValue(position, null);

  // Flatten the node.
  goog.dom.flattenElement(node);

  // Correct for the depth change.
  position.depth -= 1;

  // Indicate that we made position/tree changes.
  return true;
***REMOVED***
