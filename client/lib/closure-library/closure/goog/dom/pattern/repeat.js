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
***REMOVED*** @fileoverview DOM pattern to match a tag and all of its children.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.dom.pattern.Repeat');

goog.require('goog.dom.NodeType');
goog.require('goog.dom.pattern.AbstractPattern');
goog.require('goog.dom.pattern.MatchType');



***REMOVED***
***REMOVED*** Pattern object that matches a repetition of another pattern.
***REMOVED*** @param {goog.dom.pattern.AbstractPattern} pattern The pattern to
***REMOVED***     repetitively match.
***REMOVED*** @param {number=} opt_minimum The minimum number of times to match.  Defaults
***REMOVED***     to 0.
***REMOVED*** @param {number=} opt_maximum The maximum number of times to match.  Defaults
***REMOVED***     to unlimited.
***REMOVED***
***REMOVED*** @extends {goog.dom.pattern.AbstractPattern}
***REMOVED*** @final
***REMOVED***
goog.dom.pattern.Repeat = function(pattern,
                                   opt_minimum,
                                   opt_maximum) {
  this.pattern_ = pattern;
  this.minimum_ = opt_minimum || 0;
  this.maximum_ = opt_maximum || null;
  this.matches = [];
***REMOVED***
goog.inherits(goog.dom.pattern.Repeat, goog.dom.pattern.AbstractPattern);


***REMOVED***
***REMOVED*** Pattern to repetitively match.
***REMOVED***
***REMOVED*** @type {goog.dom.pattern.AbstractPattern}
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.Repeat.prototype.pattern_;


***REMOVED***
***REMOVED*** Minimum number of times to match the pattern.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.Repeat.prototype.minimum_ = 0;


***REMOVED***
***REMOVED*** Optional maximum number of times to match the pattern.  A {@code null} value
***REMOVED*** will be treated as infinity.
***REMOVED***
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.Repeat.prototype.maximum_ = 0;


***REMOVED***
***REMOVED*** Number of times the pattern has matched.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED***
goog.dom.pattern.Repeat.prototype.count = 0;


***REMOVED***
***REMOVED*** Whether the pattern has recently matched or failed to match and will need to
***REMOVED*** be reset when starting a new round of matches.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.Repeat.prototype.needsReset_ = false;


***REMOVED***
***REMOVED*** The matched nodes.
***REMOVED***
***REMOVED*** @type {Array.<Node>}
***REMOVED***
goog.dom.pattern.Repeat.prototype.matches;


***REMOVED***
***REMOVED*** Test whether the given token continues a repeated series of matches of the
***REMOVED*** pattern given in the constructor.
***REMOVED***
***REMOVED*** @param {Node} token Token to match against.
***REMOVED*** @param {goog.dom.TagWalkType} type The type of token.
***REMOVED*** @return {goog.dom.pattern.MatchType} <code>MATCH</code> if the pattern
***REMOVED***     matches, <code>BACKTRACK_MATCH</code> if the pattern does not match
***REMOVED***     but already had accumulated matches, <code>MATCHING</code> if the pattern
***REMOVED***     starts a match, and <code>NO_MATCH</code> if the pattern does not match.
***REMOVED*** @suppress {missingProperties} See the broken line below.
***REMOVED*** @override
***REMOVED***
goog.dom.pattern.Repeat.prototype.matchToken = function(token, type) {
  // Reset if we're starting a new match
  if (this.needsReset_) {
    this.reset();
  }

  // If the option is set, ignore any whitespace only text nodes
  if (token.nodeType == goog.dom.NodeType.TEXT &&
      token.nodeValue.match(/^\s+$/)) {
    return goog.dom.pattern.MatchType.MATCHING;
  }

  switch (this.pattern_.matchToken(token, type)) {
    case goog.dom.pattern.MatchType.MATCH:
      // Record the first token we match.
      if (this.count == 0) {
        this.matchedNode = token;
      }

      // Mark the match
      this.count++;

      // Add to the list
      this.matches.push(this.pattern_.matchedNode);

      // Check if this match hits our maximum
      if (this.maximum_ !== null && this.count == this.maximum_) {
        this.needsReset_ = true;
        return goog.dom.pattern.MatchType.MATCH;
      } else {
        return goog.dom.pattern.MatchType.MATCHING;
      }

    case goog.dom.pattern.MatchType.MATCHING:
      // This can happen when our child pattern is a sequence or a repetition.
      return goog.dom.pattern.MatchType.MATCHING;

    case goog.dom.pattern.MatchType.BACKTRACK_MATCH:
      // This happens if our child pattern is repetitive too.
      // TODO(robbyw): Backtrack further if necessary.
      this.count++;

      // NOTE(nicksantos): This line of code is broken. this.patterns_ doesn't
      // exist, and this.currentPosition_ doesn't exit. When this is fixed,
      // remove the missingProperties suppression above.
      if (this.currentPosition_ == this.patterns_.length) {
        this.needsReset_ = true;
        return goog.dom.pattern.MatchType.BACKTRACK_MATCH;
      } else {
        // Retry the same token on the next iteration of the child pattern.
        return this.matchToken(token, type);
      }

    default:
      this.needsReset_ = true;
      if (this.count >= this.minimum_) {
        return goog.dom.pattern.MatchType.BACKTRACK_MATCH;
      } else {
        return goog.dom.pattern.MatchType.NO_MATCH;
      }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Reset any internal state this pattern keeps.
***REMOVED*** @override
***REMOVED***
goog.dom.pattern.Repeat.prototype.reset = function() {
  this.pattern_.reset();
  this.count = 0;
  this.needsReset_ = false;
  this.matches.length = 0;
***REMOVED***
