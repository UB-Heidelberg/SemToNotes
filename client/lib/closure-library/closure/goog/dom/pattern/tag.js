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
***REMOVED*** @fileoverview DOM pattern to match a tag.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.dom.pattern.Tag');

goog.require('goog.dom.pattern');
goog.require('goog.dom.pattern.AbstractPattern');
goog.require('goog.dom.pattern.MatchType');
goog.require('goog.object');



***REMOVED***
***REMOVED*** Pattern object that matches an tag.
***REMOVED***
***REMOVED*** @param {string|RegExp} tag Name of the tag.  Also will accept a regular
***REMOVED***     expression to match against the tag name.
***REMOVED*** @param {goog.dom.TagWalkType} type Type of token to match.
***REMOVED*** @param {Object=} opt_attrs Optional map of attribute names to desired values.
***REMOVED***     This pattern will only match when all attributes are present and match
***REMOVED***     the string or regular expression value provided here.
***REMOVED*** @param {Object=} opt_styles Optional map of CSS style names to desired
***REMOVED***     values. This pattern will only match when all styles are present and
***REMOVED***     match the string or regular expression value provided here.
***REMOVED*** @param {Function=} opt_test Optional function that takes the element as a
***REMOVED***     parameter and returns true if this pattern should match it.
***REMOVED***
***REMOVED*** @extends {goog.dom.pattern.AbstractPattern}
***REMOVED***
goog.dom.pattern.Tag = function(tag, type, opt_attrs, opt_styles, opt_test) {
  if (goog.isString(tag)) {
    this.tag_ = tag.toUpperCase();
  } else {
    this.tag_ = tag;
  }

  this.type_ = type;

  this.attrs_ = opt_attrs || null;
  this.styles_ = opt_styles || null;
  this.test_ = opt_test || null;
***REMOVED***
goog.inherits(goog.dom.pattern.Tag, goog.dom.pattern.AbstractPattern);


***REMOVED***
***REMOVED*** The tag to match.
***REMOVED***
***REMOVED*** @type {string|RegExp}
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.Tag.prototype.tag_;


***REMOVED***
***REMOVED*** The type of token to match.
***REMOVED***
***REMOVED*** @type {goog.dom.TagWalkType}
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.Tag.prototype.type_;


***REMOVED***
***REMOVED*** The attributes to test for.
***REMOVED***
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.Tag.prototype.attrs_ = null;


***REMOVED***
***REMOVED*** The styles to test for.
***REMOVED***
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.Tag.prototype.styles_ = null;


***REMOVED***
***REMOVED*** Function that takes the element as a parameter and returns true if this
***REMOVED*** pattern should match it.
***REMOVED***
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
goog.dom.pattern.Tag.prototype.test_ = null;


***REMOVED***
***REMOVED*** Test whether the given token is a tag token which matches the tag name,
***REMOVED*** style, and attributes provided in the constructor.
***REMOVED***
***REMOVED*** @param {Node} token Token to match against.
***REMOVED*** @param {goog.dom.TagWalkType} type The type of token.
***REMOVED*** @return {goog.dom.pattern.MatchType} <code>MATCH</code> if the pattern
***REMOVED***     matches, <code>NO_MATCH</code> otherwise.
***REMOVED*** @override
***REMOVED***
goog.dom.pattern.Tag.prototype.matchToken = function(token, type) {
  // Check the direction and tag name.
  if (type == this.type_ &&
      goog.dom.pattern.matchStringOrRegex(this.tag_, token.nodeName)) {
    // Check the attributes.
    if (this.attrs_ &&
        !goog.object.every(
            this.attrs_,
            goog.dom.pattern.matchStringOrRegexMap,
            token)) {
      return goog.dom.pattern.MatchType.NO_MATCH;
    }
    // Check the styles.
    if (this.styles_ &&
        !goog.object.every(
            this.styles_,
            goog.dom.pattern.matchStringOrRegexMap,
            token.style)) {
      return goog.dom.pattern.MatchType.NO_MATCH;
    }

    if (this.test_ && !this.test_(token)) {
      return goog.dom.pattern.MatchType.NO_MATCH;
    }

    // If we reach this point, we have a match and should save it.
    this.matchedNode = token;
    return goog.dom.pattern.MatchType.MATCH;
  }

  return goog.dom.pattern.MatchType.NO_MATCH;
***REMOVED***
