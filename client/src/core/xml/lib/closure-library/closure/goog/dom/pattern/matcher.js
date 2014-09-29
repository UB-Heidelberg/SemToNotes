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
***REMOVED*** @fileoverview DOM pattern matcher.  Allows for simple searching of DOM
***REMOVED*** using patterns descended from {@link goog.dom.pattern.AbstractPattern}.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.dom.pattern.Matcher');

goog.require('goog.dom.TagIterator');
goog.require('goog.dom.pattern.MatchType');
goog.require('goog.iter');


// TODO(robbyw): Allow for backtracks of size > 1.



***REMOVED***
***REMOVED*** Given a set of patterns and a root node, this class tests the patterns in
***REMOVED*** parallel.
***REMOVED***
***REMOVED*** It is not (yet) a smart matcher - it doesn't do any advanced backtracking.
***REMOVED*** Given the pattern <code>DIV, SPAN</code> the matcher will not match
***REMOVED*** <code>DIV, DIV, SPAN</code> because it starts matching at the first
***REMOVED*** <code>DIV</code>, fails to match <code>SPAN</code> at the second, and never
***REMOVED*** backtracks to try again.
***REMOVED***
***REMOVED*** It is also possible to have a set of complex patterns that when matched in
***REMOVED*** parallel will miss some possible matches.  Running multiple times will catch
***REMOVED*** all matches eventually.
***REMOVED***
***REMOVED***
***REMOVED***
goog.dom.pattern.Matcher = function() {
  this.patterns_ = [];
  this.callbacks_ = [];
***REMOVED***


***REMOVED***
***REMOVED*** Array of patterns to attempt to match in parallel.
***REMOVED***
***REMOVED*** @type {Array.<goog.dom.pattern.AbstractPattern>}
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.Matcher.prototype.patterns_;


***REMOVED***
***REMOVED*** Array of callbacks to call when a pattern is matched.  The indexing is the
***REMOVED*** same as the {@link #patterns_} array.
***REMOVED***
***REMOVED*** @type {Array.<Function>}
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.Matcher.prototype.callbacks_;


***REMOVED***
***REMOVED*** Adds a pattern to be matched.  The callback can return an object whose keys
***REMOVED*** are processing instructions.
***REMOVED***
***REMOVED*** @param {goog.dom.pattern.AbstractPattern} pattern The pattern to add.
***REMOVED*** @param {Function} callback Function to call when a match is found.  Uses
***REMOVED***     the above semantics.
***REMOVED***
goog.dom.pattern.Matcher.prototype.addPattern = function(pattern, callback) {
  this.patterns_.push(pattern);
  this.callbacks_.push(callback);
***REMOVED***


***REMOVED***
***REMOVED*** Resets all the patterns.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.Matcher.prototype.reset_ = function() {
  for (var i = 0, len = this.patterns_.length; i < len; i++) {
    this.patterns_[i].reset();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Test the given node against all patterns.
***REMOVED***
***REMOVED*** @param {goog.dom.TagIterator} position A position in a node walk that is
***REMOVED***     located at the token to process.
***REMOVED*** @return {boolean} Whether a pattern modified the position or tree
***REMOVED***     and its callback resulted in DOM structure or position modification.
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.Matcher.prototype.matchToken_ = function(position) {
  for (var i = 0, len = this.patterns_.length; i < len; i++) {
    var pattern = this.patterns_[i];
    switch (pattern.matchToken(position.node, position.tagType)) {
      case goog.dom.pattern.MatchType.MATCH:
      case goog.dom.pattern.MatchType.BACKTRACK_MATCH:
        var callback = this.callbacks_[i];

        // Callbacks are allowed to modify the current position, but must
        // return true if the do.
        if (callback(pattern.matchedNode, position, pattern)) {
          return true;
        }

      default:
        // Do nothing.
        break;
    }
  }

  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Match the set of patterns against a match tree.
***REMOVED***
***REMOVED*** @param {Node} node The root node of the tree to match.
***REMOVED***
goog.dom.pattern.Matcher.prototype.match = function(node) {
  var position = new goog.dom.TagIterator(node);

  this.reset_();

  goog.iter.forEach(position, function() {
    while (this.matchToken_(position)) {
      // Since we've moved, our old pattern statuses don't make sense any more.
      // Reset them.
      this.reset_();
    }
  }, this);
***REMOVED***
