// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Methods for annotating occurrences of query terms in text or
***REMOVED***   in a DOM tree. Adapted from Gmail code.
***REMOVED***
***REMOVED***

goog.provide('goog.dom.annotate');
goog.provide('goog.dom.annotate.AnnotateFn');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.safe');
goog.require('goog.html.SafeHtml');


***REMOVED***
***REMOVED*** A function that takes:
***REMOVED***   (1) the number of the term that is "hit",
***REMOVED***   (2) the HTML (search term) to be annotated,
***REMOVED*** and returns the annotated term as an HTML.
***REMOVED*** @typedef {function(number, !goog.html.SafeHtml): !goog.html.SafeHtml}
***REMOVED***
goog.dom.annotate.AnnotateFn;


***REMOVED***
***REMOVED*** Calls {@code annotateFn} for each occurrence of a search term in text nodes
***REMOVED*** under {@code node}. Returns the number of hits.
***REMOVED***
***REMOVED*** @param {Node} node  A DOM node.
***REMOVED*** @param {Array} terms  An array of [searchTerm, matchWholeWordOnly] tuples.
***REMOVED***   The matchWholeWordOnly value is a per-term attribute because some terms
***REMOVED***   may be CJK, while others are not. (For correctness, matchWholeWordOnly
***REMOVED***   should always be false for CJK terms.).
***REMOVED*** @param {goog.dom.annotate.AnnotateFn} annotateFn
***REMOVED*** @param {*=} opt_ignoreCase  Whether to ignore the case of the query
***REMOVED***   terms when looking for matches.
***REMOVED*** @param {Array.<string>=} opt_classesToSkip  Nodes with one of these CSS class
***REMOVED***   names (and its descendants) will be skipped.
***REMOVED*** @param {number=} opt_maxMs  Number of milliseconds after which this function,
***REMOVED***   if still annotating, should stop and return.
***REMOVED***
***REMOVED*** @return {boolean} Whether any terms were annotated.
***REMOVED***
goog.dom.annotate.annotateTerms = function(node, terms, annotateFn,
                                           opt_ignoreCase,
                                           opt_classesToSkip,
                                           opt_maxMs) {
  if (opt_ignoreCase) {
    terms = goog.dom.annotate.lowercaseTerms_(terms);
  }
  var stopTime = opt_maxMs > 0 ? goog.now() + opt_maxMs : 0;

  return goog.dom.annotate.annotateTermsInNode_(
      node, terms, annotateFn, opt_ignoreCase, opt_classesToSkip || [],
      stopTime, 0);
***REMOVED***


***REMOVED***
***REMOVED*** The maximum recursion depth allowed. Any DOM nodes deeper than this are
***REMOVED*** ignored.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.dom.annotate.MAX_RECURSION_ = 200;


***REMOVED***
***REMOVED*** The node types whose descendants should not be affected by annotation.
***REMOVED*** @type {Array}
***REMOVED*** @private
***REMOVED***
goog.dom.annotate.NODES_TO_SKIP_ = ['SCRIPT', 'STYLE', 'TEXTAREA'];


***REMOVED***
***REMOVED*** Recursive helper function.
***REMOVED***
***REMOVED*** @param {Node} node  A DOM node.
***REMOVED*** @param {Array} terms  An array of [searchTerm, matchWholeWordOnly] tuples.
***REMOVED***     The matchWholeWordOnly value is a per-term attribute because some terms
***REMOVED***     may be CJK, while others are not. (For correctness, matchWholeWordOnly
***REMOVED***     should always be false for CJK terms.).
***REMOVED*** @param {goog.dom.annotate.AnnotateFn} annotateFn
***REMOVED*** @param {*} ignoreCase  Whether to ignore the case of the query terms
***REMOVED***     when looking for matches.
***REMOVED*** @param {Array.<string>} classesToSkip  Nodes with one of these CSS class
***REMOVED***     names will be skipped (as will their descendants).
***REMOVED*** @param {number} stopTime  Deadline for annotation operation (ignored if 0).
***REMOVED*** @param {number} recursionLevel  How deep this recursive call is; pass the
***REMOVED***     value 0 in the initial call.
***REMOVED*** @return {boolean} Whether any terms were annotated.
***REMOVED*** @private
***REMOVED***
goog.dom.annotate.annotateTermsInNode_ =
    function(node, terms, annotateFn, ignoreCase, classesToSkip,
             stopTime, recursionLevel) {
  if ((stopTime > 0 && goog.now() >= stopTime) ||
      recursionLevel > goog.dom.annotate.MAX_RECURSION_) {
    return false;
  }

  var annotated = false;

  if (node.nodeType == goog.dom.NodeType.TEXT) {
    var html = goog.dom.annotate.helpAnnotateText_(node.nodeValue, terms,
                                                   annotateFn, ignoreCase);
    if (html != null) {
      // Replace the text with the annotated html. First we put the html into
      // a temporary node, to get its DOM structure. To avoid adding a wrapper
      // element as a side effect, we'll only actually use the temporary node's
      // children.
      var tempNode = goog.dom.getOwnerDocument(node).createElement('SPAN');
      goog.dom.safe.setInnerHtml(tempNode, html);

      var parentNode = node.parentNode;
      var nodeToInsert;
      while ((nodeToInsert = tempNode.firstChild) != null) {
        // Each parentNode.insertBefore call removes the inserted node from
        // tempNode's list of children.
        parentNode.insertBefore(nodeToInsert, node);
      }

      parentNode.removeChild(node);
      annotated = true;
    }
  } else if (node.hasChildNodes() &&
             !goog.array.contains(goog.dom.annotate.NODES_TO_SKIP_,
                 node.tagName)) {
    var classes = node.className.split(/\s+/);
    var skip = goog.array.some(classes, function(className) {
      return goog.array.contains(classesToSkip, className);
    });

    if (!skip) {
      ++recursionLevel;
      var curNode = node.firstChild;
      var numTermsAnnotated = 0;
      while (curNode) {
        var nextNode = curNode.nextSibling;
        var curNodeAnnotated = goog.dom.annotate.annotateTermsInNode_(
            curNode, terms, annotateFn, ignoreCase, classesToSkip,
            stopTime, recursionLevel);
        annotated = annotated || curNodeAnnotated;
        curNode = nextNode;
      }
    }
  }

  return annotated;
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression that matches non-word characters.
***REMOVED***
***REMOVED*** Performance note: Testing a one-character string using this regex is as fast
***REMOVED*** as the equivalent string test ("a-zA-Z0-9_".indexOf(c) < 0), give or take a
***REMOVED*** few percent. (The regex is about 5% faster in IE 6 and about 4% slower in
***REMOVED*** Firefox 1.5.) If performance becomes critical, it may be better to convert
***REMOVED*** the character to a numerical char code and check whether it falls in the
***REMOVED*** word character ranges. A quick test suggests that could be 33% faster.
***REMOVED***
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.dom.annotate.NONWORD_RE_ = /\W/;


***REMOVED***
***REMOVED*** Annotates occurrences of query terms in plain text. This process consists of
***REMOVED*** identifying all occurrences of all query terms, calling a provided function
***REMOVED*** to get the appropriate replacement HTML for each occurrence, and
***REMOVED*** HTML-escaping all the text.
***REMOVED***
***REMOVED*** @param {string} text  The plain text to be searched.
***REMOVED*** @param {Array} terms  An array of
***REMOVED***   [{string} searchTerm, {boolean} matchWholeWordOnly] tuples.
***REMOVED***   The matchWholeWordOnly value is a per-term attribute because some terms
***REMOVED***   may be CJK, while others are not. (For correctness, matchWholeWordOnly
***REMOVED***   should always be false for CJK terms.).
***REMOVED*** @param {goog.dom.annotate.AnnotateFn} annotateFn
***REMOVED*** @param {*=} opt_ignoreCase  Whether to ignore the case of the query
***REMOVED***   terms when looking for matches.
***REMOVED*** @return {goog.html.SafeHtml} The HTML equivalent of {@code text} with terms
***REMOVED***   annotated, or null if the text did not contain any of the terms.
***REMOVED***
goog.dom.annotate.annotateText = function(text, terms, annotateFn,
                                          opt_ignoreCase) {
  if (opt_ignoreCase) {
    terms = goog.dom.annotate.lowercaseTerms_(terms);
  }
  return goog.dom.annotate.helpAnnotateText_(text, terms, annotateFn,
                                             opt_ignoreCase);
***REMOVED***


***REMOVED***
***REMOVED*** Annotates occurrences of query terms in plain text. This process consists of
***REMOVED*** identifying all occurrences of all query terms, calling a provided function
***REMOVED*** to get the appropriate replacement HTML for each occurrence, and
***REMOVED*** HTML-escaping all the text.
***REMOVED***
***REMOVED*** @param {string} text  The plain text to be searched.
***REMOVED*** @param {Array} terms  An array of
***REMOVED***   [{string} searchTerm, {boolean} matchWholeWordOnly] tuples.
***REMOVED***   If {@code ignoreCase} is true, each search term must already be lowercase.
***REMOVED***   The matchWholeWordOnly value is a per-term attribute because some terms
***REMOVED***   may be CJK, while others are not. (For correctness, matchWholeWordOnly
***REMOVED***   should always be false for CJK terms.).
***REMOVED*** @param {goog.dom.annotate.AnnotateFn} annotateFn
***REMOVED*** @param {*} ignoreCase  Whether to ignore the case of the query terms
***REMOVED***   when looking for matches.
***REMOVED*** @return {goog.html.SafeHtml} The HTML equivalent of {@code text} with terms
***REMOVED***   annotated, or null if the text did not contain any of the terms.
***REMOVED*** @private
***REMOVED***
goog.dom.annotate.helpAnnotateText_ = function(text, terms, annotateFn,
                                               ignoreCase) {
  var hit = false;
  var resultHtml = null;
  var textToSearch = ignoreCase ? text.toLowerCase() : text;
  var textLen = textToSearch.length;
  var numTerms = terms.length;

  // Each element will be an array of hit positions for the term.
  var termHits = new Array(numTerms);

  // First collect all the hits into allHits.
  for (var i = 0; i < numTerms; i++) {
    var term = terms[i];
    var hits = [];
    var termText = term[0];
    if (termText != '') {
      var matchWholeWordOnly = term[1];
      var termLen = termText.length;
      var pos = 0;
      // Find each hit for term t and append to termHits.
      while (pos < textLen) {
        var hitPos = textToSearch.indexOf(termText, pos);
        if (hitPos == -1) {
          break;
        } else {
          var prevCharPos = hitPos - 1;
          var nextCharPos = hitPos + termLen;
          if (!matchWholeWordOnly ||
              ((prevCharPos < 0 ||
                goog.dom.annotate.NONWORD_RE_.test(
                    textToSearch.charAt(prevCharPos))) &&
               (nextCharPos >= textLen ||
                goog.dom.annotate.NONWORD_RE_.test(
                    textToSearch.charAt(nextCharPos))))) {
            hits.push(hitPos);
            hit = true;
          }
          pos = hitPos + termLen;
        }
      }
    }
    termHits[i] = hits;
  }

  if (hit) {
    var html = [];
    var pos = 0;

    while (true) {
      // First determine which of the n terms is the next hit.
      var termIndexOfNextHit;
      var posOfNextHit = -1;

      for (var i = 0; i < numTerms; i++) {
        var hits = termHits[i];
        // pull off the position of the next hit of term t
        // (it's always the first in the array because we're shifting
        // hits off the front of the array as we process them)
        // this is the next candidate to consider for the next overall hit
        if (!goog.array.isEmpty(hits)) {
          var hitPos = hits[0];

          // Discard any hits embedded in the previous hit.
          while (hitPos >= 0 && hitPos < pos) {
            hits.shift();
            hitPos = goog.array.isEmpty(hits) ? -1 : hits[0];
          }

          if (hitPos >= 0 && (posOfNextHit < 0 || hitPos < posOfNextHit)) {
            termIndexOfNextHit = i;
            posOfNextHit = hitPos;
          }
        }
      }

      // Quit if there are no more hits.
      if (posOfNextHit < 0) break;

      // Remove the next hit from our hit list.
      termHits[termIndexOfNextHit].shift();

      // Append everything from the end of the last hit up to this one.
      html.push(text.substr(pos, posOfNextHit - pos));

      // Append the annotated term.
      var termLen = terms[termIndexOfNextHit][0].length;
      var termHtml = goog.html.SafeHtml.htmlEscape(
          text.substr(posOfNextHit, termLen));
      html.push(
          annotateFn(goog.asserts.assertNumber(termIndexOfNextHit), termHtml));

      pos = posOfNextHit + termLen;
    }

    // Append everything after the last hit.
    html.push(text.substr(pos));
    return goog.html.SafeHtml.concat(html);
  } else {
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Converts terms to lowercase.
***REMOVED***
***REMOVED*** @param {Array} terms  An array of
***REMOVED***   [{string} searchTerm, {boolean} matchWholeWordOnly] tuples.
***REMOVED*** @return {!Array}  An array of
***REMOVED***   [{string} searchTerm, {boolean} matchWholeWordOnly] tuples.
***REMOVED*** @private
***REMOVED***
goog.dom.annotate.lowercaseTerms_ = function(terms) {
  var lowercaseTerms = [];
  for (var i = 0; i < terms.length; ++i) {
    var term = terms[i];
    lowercaseTerms[i] = [term[0].toLowerCase(), term[1]];
  }
  return lowercaseTerms;
***REMOVED***
