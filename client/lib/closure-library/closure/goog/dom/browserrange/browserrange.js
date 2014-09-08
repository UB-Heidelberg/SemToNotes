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
***REMOVED*** @fileoverview Definition of the browser range namespace and interface, as
***REMOVED*** well as several useful utility functions.
***REMOVED***
***REMOVED*** DO NOT USE THIS FILE DIRECTLY.  Use goog.dom.Range instead.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @author ojan@google.com (Ojan Vafai)
***REMOVED*** @author jparent@google.com (Julie Parent)
***REMOVED***
***REMOVED*** @supported IE6, IE7, FF1.5+, Safari.
***REMOVED***


goog.provide('goog.dom.browserrange');
goog.provide('goog.dom.browserrange.Error');

goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.browserrange.GeckoRange');
goog.require('goog.dom.browserrange.IeRange');
goog.require('goog.dom.browserrange.OperaRange');
goog.require('goog.dom.browserrange.W3cRange');
goog.require('goog.dom.browserrange.WebKitRange');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Common error constants.
***REMOVED*** @enum {string}
***REMOVED***
goog.dom.browserrange.Error = {
  NOT_IMPLEMENTED: 'Not Implemented'
***REMOVED***


// NOTE(robbyw): While it would be nice to eliminate the duplicate switches
//               below, doing so uncovers bugs in the JsCompiler in which
//               necessary code is stripped out.


***REMOVED***
***REMOVED*** Static method that returns the proper type of browser range.
***REMOVED*** @param {Range|TextRange} range A browser range object.
***REMOVED*** @return {!goog.dom.browserrange.AbstractRange} A wrapper object.
***REMOVED***
goog.dom.browserrange.createRange = function(range) {
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    return new goog.dom.browserrange.IeRange(
       ***REMOVED*****REMOVED*** @type {TextRange}***REMOVED*** (range),
        goog.dom.getOwnerDocument(range.parentElement()));
  } else if (goog.userAgent.WEBKIT) {
    return new goog.dom.browserrange.WebKitRange(
       ***REMOVED*****REMOVED*** @type {Range}***REMOVED*** (range));
  } else if (goog.userAgent.GECKO) {
    return new goog.dom.browserrange.GeckoRange(
       ***REMOVED*****REMOVED*** @type {Range}***REMOVED*** (range));
  } else if (goog.userAgent.OPERA) {
    return new goog.dom.browserrange.OperaRange(
       ***REMOVED*****REMOVED*** @type {Range}***REMOVED*** (range));
  } else {
    // Default other browsers, including Opera, to W3c ranges.
    return new goog.dom.browserrange.W3cRange(
       ***REMOVED*****REMOVED*** @type {Range}***REMOVED*** (range));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Static method that returns the proper type of browser range.
***REMOVED*** @param {Node} node The node to select.
***REMOVED*** @return {!goog.dom.browserrange.AbstractRange} A wrapper object.
***REMOVED***
goog.dom.browserrange.createRangeFromNodeContents = function(node) {
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    return goog.dom.browserrange.IeRange.createFromNodeContents(node);
  } else if (goog.userAgent.WEBKIT) {
    return goog.dom.browserrange.WebKitRange.createFromNodeContents(node);
  } else if (goog.userAgent.GECKO) {
    return goog.dom.browserrange.GeckoRange.createFromNodeContents(node);
  } else if (goog.userAgent.OPERA) {
    return goog.dom.browserrange.OperaRange.createFromNodeContents(node);
  } else {
    // Default other browsers to W3c ranges.
    return goog.dom.browserrange.W3cRange.createFromNodeContents(node);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Static method that returns the proper type of browser range.
***REMOVED*** @param {Node} startNode The node to start with.
***REMOVED*** @param {number} startOffset The offset within the node to start.  This is
***REMOVED***     either the index into the childNodes array for element startNodes or
***REMOVED***     the index into the character array for text startNodes.
***REMOVED*** @param {Node} endNode The node to end with.
***REMOVED*** @param {number} endOffset The offset within the node to end.  This is
***REMOVED***     either the index into the childNodes array for element endNodes or
***REMOVED***     the index into the character array for text endNodes.
***REMOVED*** @return {!goog.dom.browserrange.AbstractRange} A wrapper object.
***REMOVED***
goog.dom.browserrange.createRangeFromNodes = function(startNode, startOffset,
    endNode, endOffset) {
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    return goog.dom.browserrange.IeRange.createFromNodes(startNode, startOffset,
        endNode, endOffset);
  } else if (goog.userAgent.WEBKIT) {
    return goog.dom.browserrange.WebKitRange.createFromNodes(startNode,
        startOffset, endNode, endOffset);
  } else if (goog.userAgent.GECKO) {
    return goog.dom.browserrange.GeckoRange.createFromNodes(startNode,
        startOffset, endNode, endOffset);
  } else if (goog.userAgent.OPERA) {
    return goog.dom.browserrange.OperaRange.createFromNodes(startNode,
        startOffset, endNode, endOffset);
  } else {
    // Default other browsers to W3c ranges.
    return goog.dom.browserrange.W3cRange.createFromNodes(startNode,
        startOffset, endNode, endOffset);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether the given node can contain a range end point.
***REMOVED*** @param {Node} node The node to check.
***REMOVED*** @return {boolean} Whether the given node can contain a range end point.
***REMOVED***
goog.dom.browserrange.canContainRangeEndpoint = function(node) {
  // NOTE(user, bloom): This is not complete, as divs with style -
  // 'display:inline-block' or 'position:absolute' can also not contain range
  // endpoints. A more complete check is to see if that element can be partially
  // selected (can be container) or not.
  return goog.dom.canHaveChildren(node) ||
      node.nodeType == goog.dom.NodeType.TEXT;
***REMOVED***
