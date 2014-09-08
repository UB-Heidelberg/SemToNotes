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
***REMOVED*** @fileoverview DOM pattern to match any children of a tag, and
***REMOVED*** specifically collect those that match a child pattern.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.dom.pattern.ChildMatches');

goog.require('goog.dom.pattern.AllChildren');
goog.require('goog.dom.pattern.MatchType');



***REMOVED***
***REMOVED*** Pattern object that matches any nodes at or below the current tree depth.
***REMOVED***
***REMOVED*** @param {goog.dom.pattern.AbstractPattern} childPattern Pattern to collect
***REMOVED***     child matches of.
***REMOVED*** @param {number=} opt_minimumMatches Enforce a minimum nuber of matches.
***REMOVED***     Defaults to 0.
***REMOVED***
***REMOVED*** @extends {goog.dom.pattern.AllChildren}
***REMOVED*** @final
***REMOVED***
goog.dom.pattern.ChildMatches = function(childPattern, opt_minimumMatches) {
  this.childPattern_ = childPattern;
  this.matches = [];
  this.minimumMatches_ = opt_minimumMatches || 0;
  goog.dom.pattern.AllChildren.call(this);
***REMOVED***
goog.inherits(goog.dom.pattern.ChildMatches, goog.dom.pattern.AllChildren);


***REMOVED***
***REMOVED*** Array of matched child nodes.
***REMOVED***
***REMOVED*** @type {Array.<Node>}
***REMOVED***
goog.dom.pattern.ChildMatches.prototype.matches;


***REMOVED***
***REMOVED*** Minimum number of matches.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.ChildMatches.prototype.minimumMatches_ = 0;


***REMOVED***
***REMOVED*** The child pattern to collect matches from.
***REMOVED***
***REMOVED*** @type {goog.dom.pattern.AbstractPattern}
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.ChildMatches.prototype.childPattern_;


***REMOVED***
***REMOVED*** Whether the pattern has recently matched or failed to match and will need to
***REMOVED*** be reset when starting a new round of matches.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.ChildMatches.prototype.needsReset_ = false;


***REMOVED***
***REMOVED*** Test whether the given token is on the same level.
***REMOVED***
***REMOVED*** @param {Node} token Token to match against.
***REMOVED*** @param {goog.dom.TagWalkType} type The type of token.
***REMOVED*** @return {goog.dom.pattern.MatchType} {@code MATCHING} if the token is on the
***REMOVED***     same level or deeper and {@code BACKTRACK_MATCH} if not.
***REMOVED*** @override
***REMOVED***
goog.dom.pattern.ChildMatches.prototype.matchToken = function(token, type) {
  // Defer resets so we maintain our matches array until the last possible time.
  if (this.needsReset_) {
    this.reset();
  }

  // Call the super-method to ensure we stay in the child tree.
  var status =
      goog.dom.pattern.AllChildren.prototype.matchToken.apply(this, arguments);

  switch (status) {
    case goog.dom.pattern.MatchType.MATCHING:
      var backtrack = false;

      switch (this.childPattern_.matchToken(token, type)) {
        case goog.dom.pattern.MatchType.BACKTRACK_MATCH:
          backtrack = true;
        case goog.dom.pattern.MatchType.MATCH:
          // Collect the match.
          this.matches.push(this.childPattern_.matchedNode);
          break;

        default:
          // Keep trying if we haven't hit a terminal state.
          break;
      }

      if (backtrack) {
        // The only interesting result is a MATCH, since BACKTRACK_MATCH means
        // we are hitting an infinite loop on something like a Repeat(0).
        if (this.childPattern_.matchToken(token, type) ==
            goog.dom.pattern.MatchType.MATCH) {
          this.matches.push(this.childPattern_.matchedNode);
        }
      }
      return goog.dom.pattern.MatchType.MATCHING;

    case goog.dom.pattern.MatchType.BACKTRACK_MATCH:
      // TODO(robbyw): this should return something like BACKTRACK_NO_MATCH
      // when we don't meet our minimum.
      this.needsReset_ = true;
      return (this.matches.length >= this.minimumMatches_) ?
             goog.dom.pattern.MatchType.BACKTRACK_MATCH :
             goog.dom.pattern.MatchType.NO_MATCH;

    default:
      this.needsReset_ = true;
      return status;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Reset any internal state this pattern keeps.
***REMOVED*** @override
***REMOVED***
goog.dom.pattern.ChildMatches.prototype.reset = function() {
  this.needsReset_ = false;
  this.matches.length = 0;
  this.childPattern_.reset();
  goog.dom.pattern.AllChildren.prototype.reset.call(this);
***REMOVED***
