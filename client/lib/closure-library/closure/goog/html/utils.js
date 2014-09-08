// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview HTML processing utilities for HTML in string form.
***REMOVED***

goog.provide('goog.html.utils');

goog.require('goog.string');


***REMOVED***
***REMOVED*** Extracts text from HTML.
***REMOVED*** Block-level elements such as div are surrounded with whitespace,
***REMOVED*** but inline elements are not. Span is treated as a block level element
***REMOVED*** because it is often used as a container.
***REMOVED*** Breaking spaces are compressed and trimmed.
***REMOVED***
***REMOVED*** @param {string} value The input HTML to have tags removed.
***REMOVED*** @return {string} A representation of value without tags, HTML comments, or
***REMOVED***     other non-text content.
***REMOVED***
goog.html.utils.stripHtmlTags = function(value) {
  // TODO(user): Make a version that extracts text attributes such as alt.
  return goog.string.unescapeEntities(goog.string.trim(value.replace(
      goog.html.utils.HTML_TAG_REGEX_, function(fullMatch, tagName) {
        return goog.html.utils.INLINE_HTML_TAG_REGEX_.test(tagName) ? '' : ' ';
      }).
      replace(/[\t\n ]+/g, ' ')));
***REMOVED***


***REMOVED***
***REMOVED*** Matches all tags that do not require extra space.
***REMOVED***
***REMOVED*** @const
***REMOVED*** @private {RegExp}
***REMOVED***
goog.html.utils.INLINE_HTML_TAG_REGEX_ =
    /^(?:abbr|acronym|address|b|em|i|small|strong|su[bp]|u)$/i;


***REMOVED***
***REMOVED*** Matches all tags, HTML comments, and DOCTYPEs in tag soup HTML.
***REMOVED*** By removing these, and replacing any '<' or '>' characters with
***REMOVED*** entities we guarantee that the result can be embedded into
***REMOVED*** an attribute without introducing a tag boundary.
***REMOVED***
***REMOVED*** @private {RegExp}
***REMOVED*** @const
***REMOVED***
goog.html.utils.HTML_TAG_REGEX_ = /<[!\/]?([a-z0-9]+)([\/ ][^>]*)?>/gi;
