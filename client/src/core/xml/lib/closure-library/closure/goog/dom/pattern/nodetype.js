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
***REMOVED*** @fileoverview DOM pattern to match a node of the given type.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.dom.pattern.NodeType');

goog.require('goog.dom.pattern.AbstractPattern');
goog.require('goog.dom.pattern.MatchType');



***REMOVED***
***REMOVED*** Pattern object that matches any node of the given type.
***REMOVED*** @param {goog.dom.NodeType} nodeType The node type to match.
***REMOVED***
***REMOVED*** @extends {goog.dom.pattern.AbstractPattern}
***REMOVED***
goog.dom.pattern.NodeType = function(nodeType) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The node type to match.
  ***REMOVED*** @type {goog.dom.NodeType}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.nodeType_ = nodeType;
***REMOVED***
goog.inherits(goog.dom.pattern.NodeType, goog.dom.pattern.AbstractPattern);


***REMOVED***
***REMOVED*** Test whether the given token is a text token which matches the string or
***REMOVED*** regular expression provided in the constructor.
***REMOVED*** @param {Node} token Token to match against.
***REMOVED*** @param {goog.dom.TagWalkType} type The type of token.
***REMOVED*** @return {goog.dom.pattern.MatchType} <code>MATCH</code> if the pattern
***REMOVED***     matches, <code>NO_MATCH</code> otherwise.
***REMOVED*** @override
***REMOVED***
goog.dom.pattern.NodeType.prototype.matchToken = function(token, type) {
  return token.nodeType == this.nodeType_ ?
      goog.dom.pattern.MatchType.MATCH :
      goog.dom.pattern.MatchType.NO_MATCH;
***REMOVED***
