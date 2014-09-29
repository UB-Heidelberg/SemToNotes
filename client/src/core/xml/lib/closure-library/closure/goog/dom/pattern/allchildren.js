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
***REMOVED*** @fileoverview DOM pattern to match any children of a tag.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.dom.pattern.AllChildren');

goog.require('goog.dom.pattern.AbstractPattern');
goog.require('goog.dom.pattern.MatchType');



***REMOVED***
***REMOVED*** Pattern object that matches any nodes at or below the current tree depth.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.dom.pattern.AbstractPattern}
***REMOVED***
goog.dom.pattern.AllChildren = function() {
***REMOVED***
goog.inherits(goog.dom.pattern.AllChildren, goog.dom.pattern.AbstractPattern);


***REMOVED***
***REMOVED*** Tracks the matcher's depth to detect the end of the tag.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.AllChildren.prototype.depth_ = 0;


***REMOVED***
***REMOVED*** Test whether the given token is on the same level.
***REMOVED***
***REMOVED*** @param {Node} token Token to match against.
***REMOVED*** @param {goog.dom.TagWalkType} type The type of token.
***REMOVED*** @return {goog.dom.pattern.MatchType} {@code MATCHING} if the token is on the
***REMOVED***     same level or deeper and {@code BACKTRACK_MATCH} if not.
***REMOVED*** @override
***REMOVED***
goog.dom.pattern.AllChildren.prototype.matchToken = function(token, type) {
  this.depth_ += type;

  if (this.depth_ >= 0) {
    return goog.dom.pattern.MatchType.MATCHING;
  } else {
    this.depth_ = 0;
    return goog.dom.pattern.MatchType.BACKTRACK_MATCH;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Reset any internal state this pattern keeps.
***REMOVED*** @override
***REMOVED***
goog.dom.pattern.AllChildren.prototype.reset = function() {
  this.depth_ = 0;
***REMOVED***
