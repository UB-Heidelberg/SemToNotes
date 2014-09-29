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

goog.provide('goog.dom.pattern.FullTag');

goog.require('goog.dom.pattern.MatchType');
goog.require('goog.dom.pattern.StartTag');
goog.require('goog.dom.pattern.Tag');



***REMOVED***
***REMOVED*** Pattern object that matches a full tag including all its children.
***REMOVED***
***REMOVED*** @param {string|RegExp} tag Name of the tag.  Also will accept a regular
***REMOVED***     expression to match against the tag name.
***REMOVED*** @param {Object=} opt_attrs Optional map of attribute names to desired values.
***REMOVED***     This pattern will only match when all attributes are present and match
***REMOVED***     the string or regular expression value provided here.
***REMOVED*** @param {Object=} opt_styles Optional map of CSS style names to desired
***REMOVED***     values. This pattern will only match when all styles are present and
***REMOVED***     match the string or regular expression value provided here.
***REMOVED*** @param {Function=} opt_test Optional function that takes the element as a
***REMOVED***     parameter and returns true if this pattern should match it.
***REMOVED***
***REMOVED*** @extends {goog.dom.pattern.StartTag}
***REMOVED***
goog.dom.pattern.FullTag = function(tag, opt_attrs, opt_styles, opt_test) {
  goog.dom.pattern.StartTag.call(
      this,
      tag,
      opt_attrs,
      opt_styles,
      opt_test);
***REMOVED***
goog.inherits(goog.dom.pattern.FullTag, goog.dom.pattern.StartTag);


***REMOVED***
***REMOVED*** Tracks the matcher's depth to detect the end of the tag.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.FullTag.prototype.depth_ = 0;


***REMOVED***
***REMOVED*** Test whether the given token is a start tag token which matches the tag name,
***REMOVED*** style, and attributes provided in the constructor.
***REMOVED***
***REMOVED*** @param {Node} token Token to match against.
***REMOVED*** @param {goog.dom.TagWalkType} type The type of token.
***REMOVED*** @return {goog.dom.pattern.MatchType} <code>MATCH</code> at the end of our
***REMOVED***    tag, <code>MATCHING</code> if we are within the tag, and
***REMOVED***    <code>NO_MATCH</code> if the starting tag does not match.
***REMOVED*** @override
***REMOVED***
goog.dom.pattern.FullTag.prototype.matchToken = function(token, type) {
  if (!this.depth_) {
    // If we have not yet started, make sure we match as a StartTag.
    if (goog.dom.pattern.Tag.prototype.matchToken.call(this, token, type)) {
      this.depth_ = type;
      return goog.dom.pattern.MatchType.MATCHING;

    } else {
      return goog.dom.pattern.MatchType.NO_MATCH;
    }
  } else {
    this.depth_ += type;

    return this.depth_ ?
           goog.dom.pattern.MatchType.MATCHING :
           goog.dom.pattern.MatchType.MATCH;
  }
***REMOVED***
