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
***REMOVED*** @fileoverview DOM patterns.  Allows for description of complex DOM patterns
***REMOVED*** using regular expression like constructs.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.dom.pattern');
goog.provide('goog.dom.pattern.MatchType');


***REMOVED***
***REMOVED*** Regular expression for breaking text nodes.
***REMOVED*** @type {RegExp}
***REMOVED***
goog.dom.pattern.BREAKING_TEXTNODE_RE = /^\s*$/;


***REMOVED***
***REMOVED*** Utility function to match a string against either a string or a regular
***REMOVED*** expression.
***REMOVED***
***REMOVED*** @param {string|RegExp} obj Either a string or a regular expression.
***REMOVED*** @param {string} str The string to match.
***REMOVED*** @return {boolean} Whether the strings are equal, or if the string matches
***REMOVED***     the regular expression.
***REMOVED***
goog.dom.pattern.matchStringOrRegex = function(obj, str) {
  if (goog.isString(obj)) {
    // Match a string
    return str == obj;
  } else {
    // Match a regular expression
    return !!(str && str.match(obj));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Utility function to match a DOM attribute against either a string or a
***REMOVED*** regular expression.  Conforms to the interface spec for
***REMOVED*** {@link goog.object#every}.
***REMOVED***
***REMOVED*** @param {string|RegExp} elem Either a string or a regular expression.
***REMOVED*** @param {string} index The attribute name to match.
***REMOVED*** @param {Object} orig The original map of matches to test.
***REMOVED*** @return {boolean} Whether the strings are equal, or if the attribute matches
***REMOVED***     the regular expression.
***REMOVED*** @this {Element} Called using goog.object every on an Element.
***REMOVED***
goog.dom.pattern.matchStringOrRegexMap = function(elem, index, orig) {
  return goog.dom.pattern.matchStringOrRegex(elem,
      index in this ? this[index] :
          (this.getAttribute ? this.getAttribute(index) : null));
***REMOVED***


***REMOVED***
***REMOVED*** When matched to a token, a pattern may return any of the following statuses:
***REMOVED***  <ol>
***REMOVED***    <li><code>NO_MATCH</code> - The pattern does not match.  This is the only
***REMOVED***      value that evaluates to <code>false</code> in a boolean context.
***REMOVED***    <li><code>MATCHING</code> - The token is part of an incomplete match.
***REMOVED***    <li><code>MATCH</code> - The token completes a match.
***REMOVED***    <li><code>BACKTRACK_MATCH</code> - The token does not match, but indicates
***REMOVED***      the end of a repetitive match.  For instance, in regular expressions,
***REMOVED***      the pattern <code>/a+/</code> would match <code>'aaaaaaaab'</code>.
***REMOVED***      Every <code>'a'</code> token would give a status of
***REMOVED***      <code>MATCHING</code> while the <code>'b'</code> token would give a
***REMOVED***      status of <code>BACKTRACK_MATCH</code>.
***REMOVED***  </ol>
***REMOVED*** @enum {number}
***REMOVED***
goog.dom.pattern.MatchType = {
  NO_MATCH: 0,
  MATCHING: 1,
  MATCH: 2,
  BACKTRACK_MATCH: 3
***REMOVED***
