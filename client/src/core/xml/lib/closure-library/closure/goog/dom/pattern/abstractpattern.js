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
***REMOVED*** @fileoverview DOM pattern base class.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.dom.pattern.AbstractPattern');

goog.require('goog.dom.pattern.MatchType');



***REMOVED***
***REMOVED*** Base pattern class for DOM matching.
***REMOVED***
***REMOVED***
***REMOVED***
goog.dom.pattern.AbstractPattern = function() {
***REMOVED***


***REMOVED***
***REMOVED*** The first node matched by this pattern.
***REMOVED*** @type {Node}
***REMOVED***
goog.dom.pattern.AbstractPattern.prototype.matchedNode = null;


***REMOVED***
***REMOVED*** Reset any internal state this pattern keeps.
***REMOVED***
goog.dom.pattern.AbstractPattern.prototype.reset = function() {
  // The base implementation does nothing.
***REMOVED***


***REMOVED***
***REMOVED*** Test whether this pattern matches the given token.
***REMOVED***
***REMOVED*** @param {Node} token Token to match against.
***REMOVED*** @param {goog.dom.TagWalkType} type The type of token.
***REMOVED*** @return {goog.dom.pattern.MatchType} {@code MATCH} if the pattern matches.
***REMOVED***
goog.dom.pattern.AbstractPattern.prototype.matchToken = function(token, type) {
  return goog.dom.pattern.MatchType.NO_MATCH;
***REMOVED***
