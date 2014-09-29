// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utility for formatting text for display in a potentially
***REMOVED*** opposite-directionality context without garbling.
***REMOVED*** Mostly a port of http://go/formatter.cc.
***REMOVED***


goog.provide('goog.i18n.BidiFormatter');

goog.require('goog.i18n.bidi');
goog.require('goog.string');



***REMOVED***
***REMOVED*** Utility class for formatting text for display in a potentially
***REMOVED*** opposite-directionality context without garbling. Provides the following
***REMOVED*** functionality:
***REMOVED***
***REMOVED*** 1. BiDi Wrapping
***REMOVED*** When text in one language is mixed into a document in another, opposite-
***REMOVED*** directionality language, e.g. when an English business name is embedded in a
***REMOVED*** Hebrew web page, both the inserted string and the text following it may be
***REMOVED*** displayed incorrectly unless the inserted string is explicitly separated
***REMOVED*** from the surrounding text in a "wrapper" that declares its directionality at
***REMOVED*** the start and then resets it back at the end. This wrapping can be done in
***REMOVED*** HTML mark-up (e.g. a 'span dir="rtl"' tag) or - only in contexts where
***REMOVED*** mark-up can not be used - in Unicode BiDi formatting codes (LRE|RLE and PDF).
***REMOVED*** Providing such wrapping services is the basic purpose of the BiDi formatter.
***REMOVED***
***REMOVED*** 2. Directionality estimation
***REMOVED*** How does one know whether a string about to be inserted into surrounding
***REMOVED*** text has the same directionality? Well, in many cases, one knows that this
***REMOVED*** must be the case when writing the code doing the insertion, e.g. when a
***REMOVED*** localized message is inserted into a localized page. In such cases there is
***REMOVED*** no need to involve the BiDi formatter at all. In the remaining cases, e.g.
***REMOVED*** when the string is user-entered or comes from a database, the language of
***REMOVED*** the string (and thus its directionality) is not known a priori, and must be
***REMOVED*** estimated at run-time. The BiDi formatter does this automatically.
***REMOVED***
***REMOVED*** 3. Escaping
***REMOVED*** When wrapping plain text - i.e. text that is not already HTML or HTML-
***REMOVED*** escaped - in HTML mark-up, the text must first be HTML-escaped to prevent XSS
***REMOVED*** attacks and other nasty business. This of course is always true, but the
***REMOVED*** escaping can not be done after the string has already been wrapped in
***REMOVED*** mark-up, so the BiDi formatter also serves as a last chance and includes
***REMOVED*** escaping services.
***REMOVED***
***REMOVED*** Thus, in a single call, the formatter will escape the input string as
***REMOVED*** specified, determine its directionality, and wrap it as necessary. It is
***REMOVED*** then up to the caller to insert the return value in the output.
***REMOVED***
***REMOVED*** See http://wiki/Main/TemplatesAndBiDi for more information.
***REMOVED***
***REMOVED*** @param {goog.i18n.bidi.Dir|number|boolean} contextDir The context
***REMOVED***     directionality. May be supplied either as a goog.i18n.bidi.Dir constant,
***REMOVED***     as a number (positive = LRT, negative = RTL, 0 = unknown) or as a boolean
***REMOVED***     (true = RTL, false = LTR).
***REMOVED*** @param {boolean=} opt_alwaysSpan Whether {@link #spanWrap} should always
***REMOVED***     use a 'span' tag, even when the input directionality is neutral or
***REMOVED***     matches the context, so that the DOM structure of the output does not
***REMOVED***     depend on the combination of directionalities. Default: false.
***REMOVED***
***REMOVED***
goog.i18n.BidiFormatter = function(contextDir, opt_alwaysSpan) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The overall directionality of the context in which the formatter is being
  ***REMOVED*** used.
  ***REMOVED*** @type {goog.i18n.bidi.Dir}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.contextDir_ = goog.i18n.bidi.toDir(contextDir);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether {@link #spanWrap} and similar methods should always use the same
  ***REMOVED*** span structure, regardless of the combination of directionalities, for a
  ***REMOVED*** stable DOM structure.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.alwaysSpan_ = !!opt_alwaysSpan;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.i18n.bidi.Dir} The context directionality.
***REMOVED***
goog.i18n.BidiFormatter.prototype.getContextDir = function() {
  return this.contextDir_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether alwaysSpan is set.
***REMOVED***
goog.i18n.BidiFormatter.prototype.getAlwaysSpan = function() {
  return this.alwaysSpan_;
***REMOVED***


***REMOVED***
***REMOVED*** @param {goog.i18n.bidi.Dir|number|boolean} contextDir The context
***REMOVED***     directionality. May be supplied either as a goog.i18n.bidi.Dir constant,
***REMOVED***     as a number (positive = LRT, negative = RTL, 0 = unknown) or as a boolean
***REMOVED***     (true = RTL, false = LTR).
***REMOVED***
goog.i18n.BidiFormatter.prototype.setContextDir = function(contextDir) {
  this.contextDir_ = goog.i18n.bidi.toDir(contextDir);
***REMOVED***


***REMOVED***
***REMOVED*** @param {boolean} alwaysSpan Whether {@link #spanWrap} should always use a
***REMOVED***     'span' tag, even when the input directionality is neutral or matches the
***REMOVED***     context, so that the DOM structure of the output does not depend on the
***REMOVED***     combination of directionalities.
***REMOVED***
goog.i18n.BidiFormatter.prototype.setAlwaysSpan = function(alwaysSpan) {
  this.alwaysSpan_ = alwaysSpan;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the directionality of input argument {@code str}.
***REMOVED*** Identical to {@link goog.i18n.bidi.estimateDirection}.
***REMOVED***
***REMOVED*** @param {string} str The input text.
***REMOVED*** @param {boolean=} opt_isHtml Whether {@code str} is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {goog.i18n.bidi.Dir} Estimated overall directionality of {@code str}.
***REMOVED***
goog.i18n.BidiFormatter.prototype.estimateDirection =
    goog.i18n.bidi.estimateDirection;


***REMOVED***
***REMOVED*** Returns true if two given directionalities are opposite.
***REMOVED*** Note: the implementation is based on the numeric values of the Dir enum.
***REMOVED***
***REMOVED*** @param {goog.i18n.bidi.Dir} dir1 1st directionality.
***REMOVED*** @param {goog.i18n.bidi.Dir} dir2 2nd directionality.
***REMOVED*** @return {boolean} Whether the directionalities are opposite.
***REMOVED*** @private
***REMOVED***
goog.i18n.BidiFormatter.prototype.areDirectionalitiesOpposite_ = function(dir1,
    dir2) {
  return dir1***REMOVED*** dir2 < 0;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a unicode BiDi mark matching the context directionality (LRM or
***REMOVED*** RLM) if {@code opt_dirReset}, and if either the directionality or the exit
***REMOVED*** directionality of {@code str} is opposite to the context directionality.
***REMOVED*** Otherwise returns the empty string.
***REMOVED***
***REMOVED*** @param {string} str The input text.
***REMOVED*** @param {goog.i18n.bidi.Dir} dir {@code str}'s overall directionality.
***REMOVED*** @param {boolean=} opt_isHtml Whether {@code str} is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @param {boolean=} opt_dirReset Whether to perform the reset. Default: false.
***REMOVED*** @return {string} A unicode BiDi mark or the empty string.
***REMOVED*** @private
***REMOVED***
goog.i18n.BidiFormatter.prototype.dirResetIfNeeded_ = function(str, dir,
    opt_isHtml, opt_dirReset) {
  // endsWithRtl and endsWithLtr are called only if needed (short-circuit).
  if (opt_dirReset &&
      (this.areDirectionalitiesOpposite_(dir, this.contextDir_) ||
       (this.contextDir_ == goog.i18n.bidi.Dir.LTR &&
        goog.i18n.bidi.endsWithRtl(str, opt_isHtml)) ||
       (this.contextDir_ == goog.i18n.bidi.Dir.RTL &&
        goog.i18n.bidi.endsWithLtr(str, opt_isHtml)))) {
    return this.contextDir_ == goog.i18n.bidi.Dir.LTR ?
        goog.i18n.bidi.Format.LRM : goog.i18n.bidi.Format.RLM;
  } else {
    return '';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns "rtl" if {@code str}'s estimated directionality is RTL, and "ltr" if
***REMOVED*** it is LTR. In case it's UNKNOWN, returns "rtl" if the context directionality
***REMOVED*** is RTL, and "ltr" otherwise.
***REMOVED*** Needed for GXP, which can't handle dirAttr.
***REMOVED*** Example use case:
***REMOVED*** <td expr:dir='bidiFormatter.dirAttrValue(foo)'><gxp:eval expr='foo'></td>
***REMOVED***
***REMOVED*** @param {string} str Text whose directionality is to be estimated.
***REMOVED*** @param {boolean=} opt_isHtml Whether {@code str} is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {string} "rtl" or "ltr", according to the logic described above.
***REMOVED***
goog.i18n.BidiFormatter.prototype.dirAttrValue = function(str, opt_isHtml) {
  return this.knownDirAttrValue(this.estimateDirection(str, opt_isHtml));
***REMOVED***


***REMOVED***
***REMOVED*** Returns "rtl" if the given directionality is RTL, and "ltr" if it is LTR. In
***REMOVED*** case it's UNKNOWN, returns "rtl" if the context directionality is RTL, and
***REMOVED*** "ltr" otherwise.
***REMOVED***
***REMOVED*** @param {goog.i18n.bidi.Dir} dir A directionality.
***REMOVED*** @return {string} "rtl" or "ltr", according to the logic described above.
***REMOVED***
goog.i18n.BidiFormatter.prototype.knownDirAttrValue = function(dir) {
  if (dir == goog.i18n.bidi.Dir.UNKNOWN) {
    dir = this.contextDir_;
  }

  return dir == goog.i18n.bidi.Dir.RTL ? 'rtl' : 'ltr';
***REMOVED***


***REMOVED***
***REMOVED*** Returns 'dir="ltr"' or 'dir="rtl"', depending on {@code str}'s estimated
***REMOVED*** directionality, if it is not the same as the context directionality.
***REMOVED*** Otherwise, returns the empty string.
***REMOVED***
***REMOVED*** @param {string} str Text whose directionality is to be estimated.
***REMOVED*** @param {boolean=} opt_isHtml Whether {@code str} is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {string} 'dir="rtl"' for RTL text in non-RTL context; 'dir="ltr"' for
***REMOVED***     LTR text in non-LTR context; else, the empty string.
***REMOVED***
goog.i18n.BidiFormatter.prototype.dirAttr = function(str, opt_isHtml) {
  return this.knownDirAttr(this.estimateDirection(str, opt_isHtml));
***REMOVED***


***REMOVED***
***REMOVED*** Returns 'dir="ltr"' or 'dir="rtl"', depending on the given directionality, if
***REMOVED*** it is not the same as the context directionality. Otherwise, returns the
***REMOVED*** empty string.
***REMOVED***
***REMOVED*** @param {goog.i18n.bidi.Dir} dir A directionality.
***REMOVED*** @return {string} 'dir="rtl"' for RTL text in non-RTL context; 'dir="ltr"' for
***REMOVED***     LTR text in non-LTR context; else, the empty string.
***REMOVED***
goog.i18n.BidiFormatter.prototype.knownDirAttr = function(dir) {
  if (dir != this.contextDir_) {
    return dir == goog.i18n.bidi.Dir.RTL ? 'dir="rtl"' :
        dir == goog.i18n.bidi.Dir.LTR ? 'dir="ltr"' : '';
  }
  return '';
***REMOVED***


***REMOVED***
***REMOVED*** Formats a string of unknown directionality for use in HTML output of the
***REMOVED*** context directionality, so an opposite-directionality string is neither
***REMOVED*** garbled nor garbles what follows it.
***REMOVED*** The algorithm: estimates the directionality of input argument {@code str}. In
***REMOVED*** case its directionality doesn't match the context directionality, wraps it
***REMOVED*** with a 'span' tag and adds a "dir" attribute (either 'dir="rtl"' or
***REMOVED*** 'dir="ltr"'). If setAlwaysSpan(true) was used, the input is always wrapped
***REMOVED*** with 'span', skipping just the dir attribute when it's not needed.
***REMOVED***
***REMOVED*** If {@code opt_dirReset}, and if the overall directionality or the exit
***REMOVED*** directionality of {@code str} are opposite to the context directionality, a
***REMOVED*** trailing unicode BiDi mark matching the context directionality is appened
***REMOVED*** (LRM or RLM).
***REMOVED***
***REMOVED*** If !{@code opt_isHtml}, HTML-escapes {@code str} regardless of wrapping.
***REMOVED***
***REMOVED*** @param {string} str The input text.
***REMOVED*** @param {boolean=} opt_isHtml Whether {@code str} is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @param {boolean=} opt_dirReset Whether to append a trailing unicode bidi mark
***REMOVED***     matching the context directionality, when needed, to prevent the possible
***REMOVED***     garbling of whatever may follow {@code str}. Default: true.
***REMOVED*** @return {string} Input text after applying the above processing.
***REMOVED***
goog.i18n.BidiFormatter.prototype.spanWrap = function(str, opt_isHtml,
    opt_dirReset) {
  var dir = this.estimateDirection(str, opt_isHtml);
  return this.spanWrapWithKnownDir(dir, str, opt_isHtml, opt_dirReset);
***REMOVED***


***REMOVED***
***REMOVED*** Formats a string of given directionality for use in HTML output of the
***REMOVED*** context directionality, so an opposite-directionality string is neither
***REMOVED*** garbled nor garbles what follows it.
***REMOVED*** The algorithm: If {@code dir} doesn't match the context directionality, wraps
***REMOVED*** {@code str} with a 'span' tag and adds a "dir" attribute (either 'dir="rtl"'
***REMOVED*** or 'dir="ltr"'). If setAlwaysSpan(true) was used, the input is always wrapped
***REMOVED*** with 'span', skipping just the dir attribute when it's not needed.
***REMOVED***
***REMOVED*** If {@code opt_dirReset}, and if {@code dir} or the exit directionality of
***REMOVED*** {@code str} are opposite to the context directionality, a trailing unicode
***REMOVED*** BiDi mark matching the context directionality is appened (LRM or RLM).
***REMOVED***
***REMOVED*** If !{@code opt_isHtml}, HTML-escapes {@code str} regardless of wrapping.
***REMOVED***
***REMOVED*** @param {goog.i18n.bidi.Dir} dir {@code str}'s overall directionality.
***REMOVED*** @param {string} str The input text.
***REMOVED*** @param {boolean=} opt_isHtml Whether {@code str} is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @param {boolean=} opt_dirReset Whether to append a trailing unicode bidi mark
***REMOVED***     matching the context directionality, when needed, to prevent the possible
***REMOVED***     garbling of whatever may follow {@code str}. Default: true.
***REMOVED*** @return {string} Input text after applying the above processing.
***REMOVED***
goog.i18n.BidiFormatter.prototype.spanWrapWithKnownDir = function(dir, str,
    opt_isHtml, opt_dirReset) {
  opt_dirReset = opt_dirReset || (opt_dirReset == undefined);
  // Whether to add the "dir" attribute.
  var dirCondition = dir != goog.i18n.bidi.Dir.UNKNOWN && dir !=
      this.contextDir_;
  if (!opt_isHtml) {
    str = goog.string.htmlEscape(str);
  }

  var result = [];
  if (this.alwaysSpan_ || dirCondition) {  // Wrap is needed
    result.push('<span');
    if (dirCondition) {
      result.push(dir == goog.i18n.bidi.Dir.RTL ? ' dir="rtl"' : ' dir="ltr"');
    }
    result.push('>' + str + '</span>');
  } else {
    result.push(str);
  }

  result.push(this.dirResetIfNeeded_(str, dir, true, opt_dirReset));
  return result.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Formats a string of unknown directionality for use in plain-text output of
***REMOVED*** the context directionality, so an opposite-directionality string is neither
***REMOVED*** garbled nor garbles what follows it.
***REMOVED*** As opposed to {@link #spanWrap}, this makes use of unicode BiDi formatting
***REMOVED*** characters. In HTML, its***REMOVED***only* valid use is inside of elements that do not
***REMOVED*** allow mark-up, e.g. an 'option' tag.
***REMOVED*** The algorithm: estimates the directionality of input argument {@code str}.
***REMOVED*** In case it doesn't match  the context directionality, wraps it with Unicode
***REMOVED*** BiDi formatting characters: RLE{@code str}PDF for RTL text, and
***REMOVED*** LRE{@code str}PDF for LTR text.
***REMOVED***
***REMOVED*** If {@code opt_dirReset}, and if the overall directionality or the exit
***REMOVED*** directionality of {@code str} are opposite to the context directionality, a
***REMOVED*** trailing unicode BiDi mark matching the context directionality is appended
***REMOVED*** (LRM or RLM).
***REMOVED***
***REMOVED*** Does***REMOVED***not* do HTML-escaping regardless of the value of {@code opt_isHtml}.
***REMOVED*** The return value can be HTML-escaped as necessary.
***REMOVED***
***REMOVED*** @param {string} str The input text.
***REMOVED*** @param {boolean=} opt_isHtml Whether {@code str} is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @param {boolean=} opt_dirReset Whether to append a trailing unicode bidi mark
***REMOVED***     matching the context directionality, when needed, to prevent the possible
***REMOVED***     garbling of whatever may follow {@code str}. Default: true.
***REMOVED*** @return {string} Input text after applying the above processing.
***REMOVED***
goog.i18n.BidiFormatter.prototype.unicodeWrap = function(str, opt_isHtml,
    opt_dirReset) {
  var dir = this.estimateDirection(str, opt_isHtml);
  return this.unicodeWrapWithKnownDir(dir, str, opt_isHtml, opt_dirReset);
***REMOVED***


***REMOVED***
***REMOVED*** Formats a string of given directionality for use in plain-text output of the
***REMOVED*** context directionality, so an opposite-directionality string is neither
***REMOVED*** garbled nor garbles what follows it.
***REMOVED*** As opposed to {@link #spanWrapWithKnownDir}, makes use of unicode BiDi
***REMOVED*** formatting characters. In HTML, its***REMOVED***only* valid use is inside of elements
***REMOVED*** that do not allow mark-up, e.g. an 'option' tag.
***REMOVED*** The algorithm: If {@code dir} doesn't match the context directionality, wraps
***REMOVED*** {@code str} with Unicode BiDi formatting characters: RLE{@code str}PDF for
***REMOVED*** RTL text, and LRE{@code str}PDF for LTR text.
***REMOVED***
***REMOVED*** If {@code opt_dirReset}, and if the overall directionality or the exit
***REMOVED*** directionality of {@code str} are opposite to the context directionality, a
***REMOVED*** trailing unicode BiDi mark matching the context directionality is appended
***REMOVED*** (LRM or RLM).
***REMOVED***
***REMOVED*** Does***REMOVED***not* do HTML-escaping regardless of the value of {@code opt_isHtml}.
***REMOVED*** The return value can be HTML-escaped as necessary.
***REMOVED***
***REMOVED*** @param {goog.i18n.bidi.Dir} dir {@code str}'s overall directionality.
***REMOVED*** @param {string} str The input text.
***REMOVED*** @param {boolean=} opt_isHtml Whether {@code str} is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @param {boolean=} opt_dirReset Whether to append a trailing unicode bidi mark
***REMOVED***     matching the context directionality, when needed, to prevent the possible
***REMOVED***     garbling of whatever may follow {@code str}. Default: true.
***REMOVED*** @return {string} Input text after applying the above processing.
***REMOVED***
goog.i18n.BidiFormatter.prototype.unicodeWrapWithKnownDir = function(dir, str,
    opt_isHtml, opt_dirReset) {
  opt_dirReset = opt_dirReset || (opt_dirReset == undefined);
  var result = [];
  if (dir != goog.i18n.bidi.Dir.UNKNOWN && dir != this.contextDir_) {
    result.push(dir == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.Format.RLE :
                                                goog.i18n.bidi.Format.LRE);
    result.push(str);
    result.push(goog.i18n.bidi.Format.PDF);
  } else {
    result.push(str);
  }

  result.push(this.dirResetIfNeeded_(str, dir, opt_isHtml, opt_dirReset));
  return result.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Returns a Unicode BiDi mark matching the context directionality (LRM or RLM)
***REMOVED*** if the directionality or the exit directionality of {@code str} are opposite
***REMOVED*** to the context directionality. Otherwise returns the empty string.
***REMOVED***
***REMOVED*** @param {string} str The input text.
***REMOVED*** @param {boolean=} opt_isHtml Whether {@code str} is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {string} A Unicode bidi mark matching the global directionality or
***REMOVED***     the empty string.
***REMOVED***
goog.i18n.BidiFormatter.prototype.markAfter = function(str, opt_isHtml) {
  return this.dirResetIfNeeded_(str,
      this.estimateDirection(str, opt_isHtml), opt_isHtml, true);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the Unicode BiDi mark matching the context directionality (LRM for
***REMOVED*** LTR context directionality, RLM for RTL context directionality), or the
***REMOVED*** empty string for neutral / unknown context directionality.
***REMOVED***
***REMOVED*** @return {string} LRM for LTR context directionality and RLM for RTL context
***REMOVED***     directionality.
***REMOVED***
goog.i18n.BidiFormatter.prototype.mark = function() {
  switch (this.contextDir_) {
    case (goog.i18n.bidi.Dir.LTR):
      return goog.i18n.bidi.Format.LRM;
    case (goog.i18n.bidi.Dir.RTL):
      return goog.i18n.bidi.Format.RLM;
    default:
      return '';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns 'right' for RTL context directionality. Otherwise (LTR or neutral /
***REMOVED*** unknown context directionality) returns 'left'.
***REMOVED***
***REMOVED*** @return {string} 'right' for RTL context directionality and 'left' for other
***REMOVED***     context directionality.
***REMOVED***
goog.i18n.BidiFormatter.prototype.startEdge = function() {
  return this.contextDir_ == goog.i18n.bidi.Dir.RTL ?
      goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT;
***REMOVED***


***REMOVED***
***REMOVED*** Returns 'left' for RTL context directionality. Otherwise (LTR or neutral /
***REMOVED*** unknown context directionality) returns 'right'.
***REMOVED***
***REMOVED*** @return {string} 'left' for RTL context directionality and 'right' for other
***REMOVED***     context directionality.
***REMOVED***
goog.i18n.BidiFormatter.prototype.endEdge = function() {
  return this.contextDir_ == goog.i18n.bidi.Dir.RTL ?
      goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT;
***REMOVED***
