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
***REMOVED*** @fileoverview Utility functions for supporting Bidi issues.
***REMOVED***


***REMOVED***
***REMOVED*** Namespace for bidi supporting functions.
***REMOVED***
goog.provide('goog.i18n.bidi');
goog.provide('goog.i18n.bidi.Dir');
goog.provide('goog.i18n.bidi.DirectionalString');
goog.provide('goog.i18n.bidi.Format');


***REMOVED***
***REMOVED*** @define {boolean} FORCE_RTL forces the {@link goog.i18n.bidi.IS_RTL} constant
***REMOVED*** to say that the current locale is a RTL locale.  This should only be used
***REMOVED*** if you want to override the default behavior for deciding whether the
***REMOVED*** current locale is RTL or not.
***REMOVED***
***REMOVED*** {@see goog.i18n.bidi.IS_RTL}
***REMOVED***
goog.define('goog.i18n.bidi.FORCE_RTL', false);


***REMOVED***
***REMOVED*** Constant that defines whether or not the current locale is a RTL locale.
***REMOVED*** If {@link goog.i18n.bidi.FORCE_RTL} is not true, this constant will default
***REMOVED*** to check that {@link goog.LOCALE} is one of a few major RTL locales.
***REMOVED***
***REMOVED*** <p>This is designed to be a maximally efficient compile-time constant. For
***REMOVED*** example, for the default goog.LOCALE, compiling
***REMOVED*** "if (goog.i18n.bidi.IS_RTL) alert('rtl') else {}" should produce no code. It
***REMOVED*** is this design consideration that limits the implementation to only
***REMOVED*** supporting a few major RTL locales, as opposed to the broader repertoire of
***REMOVED*** something like goog.i18n.bidi.isRtlLanguage.
***REMOVED***
***REMOVED*** <p>Since this constant refers to the directionality of the locale, it is up
***REMOVED*** to the caller to determine if this constant should also be used for the
***REMOVED*** direction of the UI.
***REMOVED***
***REMOVED*** {@see goog.LOCALE}
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED***
***REMOVED*** TODO(user): write a test that checks that this is a compile-time constant.
***REMOVED***
goog.i18n.bidi.IS_RTL = goog.i18n.bidi.FORCE_RTL ||
    (
        (goog.LOCALE.substring(0, 2).toLowerCase() == 'ar' ||
         goog.LOCALE.substring(0, 2).toLowerCase() == 'fa' ||
         goog.LOCALE.substring(0, 2).toLowerCase() == 'he' ||
         goog.LOCALE.substring(0, 2).toLowerCase() == 'iw' ||
         goog.LOCALE.substring(0, 2).toLowerCase() == 'ps' ||
         goog.LOCALE.substring(0, 2).toLowerCase() == 'sd' ||
         goog.LOCALE.substring(0, 2).toLowerCase() == 'ug' ||
         goog.LOCALE.substring(0, 2).toLowerCase() == 'ur' ||
         goog.LOCALE.substring(0, 2).toLowerCase() == 'yi') &&
        (goog.LOCALE.length == 2 ||
         goog.LOCALE.substring(2, 3) == '-' ||
         goog.LOCALE.substring(2, 3) == '_')
    ) || (
        goog.LOCALE.length >= 3 &&
        goog.LOCALE.substring(0, 3).toLowerCase() == 'ckb' &&
        (goog.LOCALE.length == 3 ||
         goog.LOCALE.substring(3, 4) == '-' ||
         goog.LOCALE.substring(3, 4) == '_')
  ***REMOVED***


***REMOVED***
***REMOVED*** Unicode formatting characters and directionality string constants.
***REMOVED*** @enum {string}
***REMOVED***
goog.i18n.bidi.Format = {
 ***REMOVED*****REMOVED*** Unicode "Left-To-Right Embedding" (LRE) character.***REMOVED***
  LRE: '\u202A',
 ***REMOVED*****REMOVED*** Unicode "Right-To-Left Embedding" (RLE) character.***REMOVED***
  RLE: '\u202B',
 ***REMOVED*****REMOVED*** Unicode "Pop Directional Formatting" (PDF) character.***REMOVED***
  PDF: '\u202C',
 ***REMOVED*****REMOVED*** Unicode "Left-To-Right Mark" (LRM) character.***REMOVED***
  LRM: '\u200E',
 ***REMOVED*****REMOVED*** Unicode "Right-To-Left Mark" (RLM) character.***REMOVED***
  RLM: '\u200F'
***REMOVED***


***REMOVED***
***REMOVED*** Directionality enum.
***REMOVED*** @enum {number}
***REMOVED***
goog.i18n.bidi.Dir = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Left-to-right.
 ***REMOVED*****REMOVED***
  LTR: 1,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Right-to-left.
 ***REMOVED*****REMOVED***
  RTL: -1,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Neither left-to-right nor right-to-left.
 ***REMOVED*****REMOVED***
  NEUTRAL: 0,

 ***REMOVED*****REMOVED***
  ***REMOVED*** A historical misnomer for NEUTRAL.
  ***REMOVED*** @deprecated For "neutral", use NEUTRAL; for "unknown", use null.
 ***REMOVED*****REMOVED***
  UNKNOWN: 0
***REMOVED***


***REMOVED***
***REMOVED*** 'right' string constant.
***REMOVED*** @type {string}
***REMOVED***
goog.i18n.bidi.RIGHT = 'right';


***REMOVED***
***REMOVED*** 'left' string constant.
***REMOVED*** @type {string}
***REMOVED***
goog.i18n.bidi.LEFT = 'left';


***REMOVED***
***REMOVED*** 'left' if locale is RTL, 'right' if not.
***REMOVED*** @type {string}
***REMOVED***
goog.i18n.bidi.I18N_RIGHT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.LEFT :
    goog.i18n.bidi.RIGHT;


***REMOVED***
***REMOVED*** 'right' if locale is RTL, 'left' if not.
***REMOVED*** @type {string}
***REMOVED***
goog.i18n.bidi.I18N_LEFT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.RIGHT :
    goog.i18n.bidi.LEFT;


***REMOVED***
***REMOVED*** Convert a directionality given in various formats to a goog.i18n.bidi.Dir
***REMOVED*** constant. Useful for interaction with different standards of directionality
***REMOVED*** representation.
***REMOVED***
***REMOVED*** @param {goog.i18n.bidi.Dir|number|boolean|null} givenDir Directionality given
***REMOVED***     in one of the following formats:
***REMOVED***     1. A goog.i18n.bidi.Dir constant.
***REMOVED***     2. A number (positive = LTR, negative = RTL, 0 = neutral).
***REMOVED***     3. A boolean (true = RTL, false = LTR).
***REMOVED***     4. A null for unknown directionality.
***REMOVED*** @param {boolean=} opt_noNeutral Whether a givenDir of zero or
***REMOVED***     goog.i18n.bidi.Dir.NEUTRAL should be treated as null, i.e. unknown, in
***REMOVED***     order to preserve legacy behavior.
***REMOVED*** @return {?goog.i18n.bidi.Dir} A goog.i18n.bidi.Dir constant matching the
***REMOVED***     given directionality. If given null, returns null (i.e. unknown).
***REMOVED***
goog.i18n.bidi.toDir = function(givenDir, opt_noNeutral) {
  if (typeof givenDir == 'number') {
    // This includes the non-null goog.i18n.bidi.Dir case.
    return givenDir > 0 ? goog.i18n.bidi.Dir.LTR :
        givenDir < 0 ? goog.i18n.bidi.Dir.RTL :
        opt_noNeutral ? null : goog.i18n.bidi.Dir.NEUTRAL;
  } else if (givenDir == null) {
    return null;
  } else {
    // Must be typeof givenDir == 'boolean'.
    return givenDir ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR;
  }
***REMOVED***


***REMOVED***
***REMOVED*** A practical pattern to identify strong LTR characters. This pattern is not
***REMOVED*** theoretically correct according to the Unicode standard. It is simplified for
***REMOVED*** performance and small code size.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.ltrChars_ =
    'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' +
    '\u200E\u2C00-\uFB1C\uFE00-\uFE6F\uFEFD-\uFFFF';


***REMOVED***
***REMOVED*** A practical pattern to identify strong RTL character. This pattern is not
***REMOVED*** theoretically correct according to the Unicode standard. It is simplified
***REMOVED*** for performance and small code size.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.rtlChars_ = '\u0591-\u07FF\u200F\uFB1D-\uFDFF\uFE70-\uFEFC';


***REMOVED***
***REMOVED*** Simplified regular expression for an HTML tag (opening or closing) or an HTML
***REMOVED*** escape. We might want to skip over such expressions when estimating the text
***REMOVED*** directionality.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;


***REMOVED***
***REMOVED*** Returns the input text with spaces instead of HTML tags or HTML escapes, if
***REMOVED*** opt_isStripNeeded is true. Else returns the input as is.
***REMOVED*** Useful for text directionality estimation.
***REMOVED*** Note: the function should not be used in other contexts; it is not 100%
***REMOVED*** correct, but rather a good-enough implementation for directionality
***REMOVED*** estimation purposes.
***REMOVED*** @param {string} str The given string.
***REMOVED*** @param {boolean=} opt_isStripNeeded Whether to perform the stripping.
***REMOVED***     Default: false (to retain consistency with calling functions).
***REMOVED*** @return {string} The given string cleaned of HTML tags / escapes.
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.stripHtmlIfNeeded_ = function(str, opt_isStripNeeded) {
  return opt_isStripNeeded ? str.replace(goog.i18n.bidi.htmlSkipReg_, '') :
      str;
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression to check for RTL characters.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.rtlCharReg_ = new RegExp('[' + goog.i18n.bidi.rtlChars_ + ']');


***REMOVED***
***REMOVED*** Regular expression to check for LTR characters.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.ltrCharReg_ = new RegExp('[' + goog.i18n.bidi.ltrChars_ + ']');


***REMOVED***
***REMOVED*** Test whether the given string has any RTL characters in it.
***REMOVED*** @param {string} str The given string that need to be tested.
***REMOVED*** @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {boolean} Whether the string contains RTL characters.
***REMOVED***
goog.i18n.bidi.hasAnyRtl = function(str, opt_isHtml) {
  return goog.i18n.bidi.rtlCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(
      str, opt_isHtml));
***REMOVED***


***REMOVED***
***REMOVED*** Test whether the given string has any RTL characters in it.
***REMOVED*** @param {string} str The given string that need to be tested.
***REMOVED*** @return {boolean} Whether the string contains RTL characters.
***REMOVED*** @deprecated Use hasAnyRtl.
***REMOVED***
goog.i18n.bidi.hasRtlChar = goog.i18n.bidi.hasAnyRtl;


***REMOVED***
***REMOVED*** Test whether the given string has any LTR characters in it.
***REMOVED*** @param {string} str The given string that need to be tested.
***REMOVED*** @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {boolean} Whether the string contains LTR characters.
***REMOVED***
goog.i18n.bidi.hasAnyLtr = function(str, opt_isHtml) {
  return goog.i18n.bidi.ltrCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(
      str, opt_isHtml));
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression pattern to check if the first character in the string
***REMOVED*** is LTR.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.ltrRe_ = new RegExp('^[' + goog.i18n.bidi.ltrChars_ + ']');


***REMOVED***
***REMOVED*** Regular expression pattern to check if the first character in the string
***REMOVED*** is RTL.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.rtlRe_ = new RegExp('^[' + goog.i18n.bidi.rtlChars_ + ']');


***REMOVED***
***REMOVED*** Check if the first character in the string is RTL or not.
***REMOVED*** @param {string} str The given string that need to be tested.
***REMOVED*** @return {boolean} Whether the first character in str is an RTL char.
***REMOVED***
goog.i18n.bidi.isRtlChar = function(str) {
  return goog.i18n.bidi.rtlRe_.test(str);
***REMOVED***


***REMOVED***
***REMOVED*** Check if the first character in the string is LTR or not.
***REMOVED*** @param {string} str The given string that need to be tested.
***REMOVED*** @return {boolean} Whether the first character in str is an LTR char.
***REMOVED***
goog.i18n.bidi.isLtrChar = function(str) {
  return goog.i18n.bidi.ltrRe_.test(str);
***REMOVED***


***REMOVED***
***REMOVED*** Check if the first character in the string is neutral or not.
***REMOVED*** @param {string} str The given string that need to be tested.
***REMOVED*** @return {boolean} Whether the first character in str is a neutral char.
***REMOVED***
goog.i18n.bidi.isNeutralChar = function(str) {
  return !goog.i18n.bidi.isLtrChar(str) && !goog.i18n.bidi.isRtlChar(str);
***REMOVED***


***REMOVED***
***REMOVED*** Regular expressions to check if a piece of text is of LTR directionality
***REMOVED*** on first character with strong directionality.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.ltrDirCheckRe_ = new RegExp(
    '^[^' + goog.i18n.bidi.rtlChars_ + ']*[' + goog.i18n.bidi.ltrChars_ + ']');


***REMOVED***
***REMOVED*** Regular expressions to check if a piece of text is of RTL directionality
***REMOVED*** on first character with strong directionality.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.rtlDirCheckRe_ = new RegExp(
    '^[^' + goog.i18n.bidi.ltrChars_ + ']*[' + goog.i18n.bidi.rtlChars_ + ']');


***REMOVED***
***REMOVED*** Check whether the first strongly directional character (if any) is RTL.
***REMOVED*** @param {string} str String being checked.
***REMOVED*** @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {boolean} Whether RTL directionality is detected using the first
***REMOVED***     strongly-directional character method.
***REMOVED***
goog.i18n.bidi.startsWithRtl = function(str, opt_isHtml) {
  return goog.i18n.bidi.rtlDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(
      str, opt_isHtml));
***REMOVED***


***REMOVED***
***REMOVED*** Check whether the first strongly directional character (if any) is RTL.
***REMOVED*** @param {string} str String being checked.
***REMOVED*** @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {boolean} Whether RTL directionality is detected using the first
***REMOVED***     strongly-directional character method.
***REMOVED*** @deprecated Use startsWithRtl.
***REMOVED***
goog.i18n.bidi.isRtlText = goog.i18n.bidi.startsWithRtl;


***REMOVED***
***REMOVED*** Check whether the first strongly directional character (if any) is LTR.
***REMOVED*** @param {string} str String being checked.
***REMOVED*** @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {boolean} Whether LTR directionality is detected using the first
***REMOVED***     strongly-directional character method.
***REMOVED***
goog.i18n.bidi.startsWithLtr = function(str, opt_isHtml) {
  return goog.i18n.bidi.ltrDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(
      str, opt_isHtml));
***REMOVED***


***REMOVED***
***REMOVED*** Check whether the first strongly directional character (if any) is LTR.
***REMOVED*** @param {string} str String being checked.
***REMOVED*** @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {boolean} Whether LTR directionality is detected using the first
***REMOVED***     strongly-directional character method.
***REMOVED*** @deprecated Use startsWithLtr.
***REMOVED***
goog.i18n.bidi.isLtrText = goog.i18n.bidi.startsWithLtr;


***REMOVED***
***REMOVED*** Regular expression to check if a string looks like something that must
***REMOVED*** always be LTR even in RTL text, e.g. a URL. When estimating the
***REMOVED*** directionality of text containing these, we treat these as weakly LTR,
***REMOVED*** like numbers.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.isRequiredLtrRe_ = /^http:\/\/.*/;


***REMOVED***
***REMOVED*** Check whether the input string either contains no strongly directional
***REMOVED*** characters or looks like a url.
***REMOVED*** @param {string} str String being checked.
***REMOVED*** @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {boolean} Whether neutral directionality is detected.
***REMOVED***
goog.i18n.bidi.isNeutralText = function(str, opt_isHtml) {
  str = goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml);
  return goog.i18n.bidi.isRequiredLtrRe_.test(str) ||
      !goog.i18n.bidi.hasAnyLtr(str) && !goog.i18n.bidi.hasAnyRtl(str);
***REMOVED***


***REMOVED***
***REMOVED*** Regular expressions to check if the last strongly-directional character in a
***REMOVED*** piece of text is LTR.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.ltrExitDirCheckRe_ = new RegExp(
    '[' + goog.i18n.bidi.ltrChars_ + '][^' + goog.i18n.bidi.rtlChars_ + ']*$');


***REMOVED***
***REMOVED*** Regular expressions to check if the last strongly-directional character in a
***REMOVED*** piece of text is RTL.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.rtlExitDirCheckRe_ = new RegExp(
    '[' + goog.i18n.bidi.rtlChars_ + '][^' + goog.i18n.bidi.ltrChars_ + ']*$');


***REMOVED***
***REMOVED*** Check if the exit directionality a piece of text is LTR, i.e. if the last
***REMOVED*** strongly-directional character in the string is LTR.
***REMOVED*** @param {string} str String being checked.
***REMOVED*** @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {boolean} Whether LTR exit directionality was detected.
***REMOVED***
goog.i18n.bidi.endsWithLtr = function(str, opt_isHtml) {
  return goog.i18n.bidi.ltrExitDirCheckRe_.test(
      goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
***REMOVED***


***REMOVED***
***REMOVED*** Check if the exit directionality a piece of text is LTR, i.e. if the last
***REMOVED*** strongly-directional character in the string is LTR.
***REMOVED*** @param {string} str String being checked.
***REMOVED*** @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {boolean} Whether LTR exit directionality was detected.
***REMOVED*** @deprecated Use endsWithLtr.
***REMOVED***
goog.i18n.bidi.isLtrExitText = goog.i18n.bidi.endsWithLtr;


***REMOVED***
***REMOVED*** Check if the exit directionality a piece of text is RTL, i.e. if the last
***REMOVED*** strongly-directional character in the string is RTL.
***REMOVED*** @param {string} str String being checked.
***REMOVED*** @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {boolean} Whether RTL exit directionality was detected.
***REMOVED***
goog.i18n.bidi.endsWithRtl = function(str, opt_isHtml) {
  return goog.i18n.bidi.rtlExitDirCheckRe_.test(
      goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
***REMOVED***


***REMOVED***
***REMOVED*** Check if the exit directionality a piece of text is RTL, i.e. if the last
***REMOVED*** strongly-directional character in the string is RTL.
***REMOVED*** @param {string} str String being checked.
***REMOVED*** @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {boolean} Whether RTL exit directionality was detected.
***REMOVED*** @deprecated Use endsWithRtl.
***REMOVED***
goog.i18n.bidi.isRtlExitText = goog.i18n.bidi.endsWithRtl;


***REMOVED***
***REMOVED*** A regular expression for matching right-to-left language codes.
***REMOVED*** See {@link #isRtlLanguage} for the design.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.rtlLocalesRe_ = new RegExp(
    '^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|' +
    '.*[-_](Arab|Hebr|Thaa|Nkoo|Tfng))' +
    '(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)',
    'i');


***REMOVED***
***REMOVED*** Check if a BCP 47 / III language code indicates an RTL language, i.e. either:
***REMOVED*** - a language code explicitly specifying one of the right-to-left scripts,
***REMOVED***   e.g. "az-Arab", or<p>
***REMOVED*** - a language code specifying one of the languages normally written in a
***REMOVED***   right-to-left script, e.g. "fa" (Farsi), except ones explicitly specifying
***REMOVED***   Latin or Cyrillic script (which are the usual LTR alternatives).<p>
***REMOVED*** The list of right-to-left scripts appears in the 100-199 range in
***REMOVED*** http://www.unicode.org/iso15924/iso15924-num.html, of which Arabic and
***REMOVED*** Hebrew are by far the most widely used. We also recognize Thaana, N'Ko, and
***REMOVED*** Tifinagh, which also have significant modern usage. The rest (Syriac,
***REMOVED*** Samaritan, Mandaic, etc.) seem to have extremely limited or no modern usage
***REMOVED*** and are not recognized to save on code size.
***REMOVED*** The languages usually written in a right-to-left script are taken as those
***REMOVED*** with Suppress-Script: Hebr|Arab|Thaa|Nkoo|Tfng  in
***REMOVED*** http://www.iana.org/assignments/language-subtag-registry,
***REMOVED*** as well as Central (or Sorani) Kurdish (ckb), Sindhi (sd) and Uyghur (ug).
***REMOVED*** Other subtags of the language code, e.g. regions like EG (Egypt), are
***REMOVED*** ignored.
***REMOVED*** @param {string} lang BCP 47 (a.k.a III) language code.
***REMOVED*** @return {boolean} Whether the language code is an RTL language.
***REMOVED***
goog.i18n.bidi.isRtlLanguage = function(lang) {
  return goog.i18n.bidi.rtlLocalesRe_.test(lang);
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression for bracket guard replacement in html.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.bracketGuardHtmlRe_ =
    /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(&lt;.*?(&gt;)+)/g;


***REMOVED***
***REMOVED*** Regular expression for bracket guard replacement in text.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.bracketGuardTextRe_ =
    /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;


***REMOVED***
***REMOVED*** Apply bracket guard using html span tag. This is to address the problem of
***REMOVED*** messy bracket display frequently happens in RTL layout.
***REMOVED*** @param {string} s The string that need to be processed.
***REMOVED*** @param {boolean=} opt_isRtlContext specifies default direction (usually
***REMOVED***     direction of the UI).
***REMOVED*** @return {string} The processed string, with all bracket guarded.
***REMOVED***
goog.i18n.bidi.guardBracketInHtml = function(s, opt_isRtlContext) {
  var useRtl = opt_isRtlContext === undefined ?
      goog.i18n.bidi.hasAnyRtl(s) : opt_isRtlContext;
  if (useRtl) {
    return s.replace(goog.i18n.bidi.bracketGuardHtmlRe_,
        '<span dir=rtl>$&</span>');
  }
  return s.replace(goog.i18n.bidi.bracketGuardHtmlRe_,
      '<span dir=ltr>$&</span>');
***REMOVED***


***REMOVED***
***REMOVED*** Apply bracket guard using LRM and RLM. This is to address the problem of
***REMOVED*** messy bracket display frequently happens in RTL layout.
***REMOVED*** This version works for both plain text and html. But it does not work as
***REMOVED*** good as guardBracketInHtml in some cases.
***REMOVED*** @param {string} s The string that need to be processed.
***REMOVED*** @param {boolean=} opt_isRtlContext specifies default direction (usually
***REMOVED***     direction of the UI).
***REMOVED*** @return {string} The processed string, with all bracket guarded.
***REMOVED***
goog.i18n.bidi.guardBracketInText = function(s, opt_isRtlContext) {
  var useRtl = opt_isRtlContext === undefined ?
      goog.i18n.bidi.hasAnyRtl(s) : opt_isRtlContext;
  var mark = useRtl ? goog.i18n.bidi.Format.RLM : goog.i18n.bidi.Format.LRM;
  return s.replace(goog.i18n.bidi.bracketGuardTextRe_, mark + '$&' + mark);
***REMOVED***


***REMOVED***
***REMOVED*** Enforce the html snippet in RTL directionality regardless overall context.
***REMOVED*** If the html piece was enclosed by tag, dir will be applied to existing
***REMOVED*** tag, otherwise a span tag will be added as wrapper. For this reason, if
***REMOVED*** html snippet start with with tag, this tag must enclose the whole piece. If
***REMOVED*** the tag already has a dir specified, this new one will override existing
***REMOVED*** one in behavior (tested on FF and IE).
***REMOVED*** @param {string} html The string that need to be processed.
***REMOVED*** @return {string} The processed string, with directionality enforced to RTL.
***REMOVED***
goog.i18n.bidi.enforceRtlInHtml = function(html) {
  if (html.charAt(0) == '<') {
    return html.replace(/<\w+/, '$& dir=rtl');
  }
  // '\n' is important for FF so that it won't incorrectly merge span groups
  return '\n<span dir=rtl>' + html + '</span>';
***REMOVED***


***REMOVED***
***REMOVED*** Enforce RTL on both end of the given text piece using unicode BiDi formatting
***REMOVED*** characters RLE and PDF.
***REMOVED*** @param {string} text The piece of text that need to be wrapped.
***REMOVED*** @return {string} The wrapped string after process.
***REMOVED***
goog.i18n.bidi.enforceRtlInText = function(text) {
  return goog.i18n.bidi.Format.RLE + text + goog.i18n.bidi.Format.PDF;
***REMOVED***


***REMOVED***
***REMOVED*** Enforce the html snippet in RTL directionality regardless overall context.
***REMOVED*** If the html piece was enclosed by tag, dir will be applied to existing
***REMOVED*** tag, otherwise a span tag will be added as wrapper. For this reason, if
***REMOVED*** html snippet start with with tag, this tag must enclose the whole piece. If
***REMOVED*** the tag already has a dir specified, this new one will override existing
***REMOVED*** one in behavior (tested on FF and IE).
***REMOVED*** @param {string} html The string that need to be processed.
***REMOVED*** @return {string} The processed string, with directionality enforced to RTL.
***REMOVED***
goog.i18n.bidi.enforceLtrInHtml = function(html) {
  if (html.charAt(0) == '<') {
    return html.replace(/<\w+/, '$& dir=ltr');
  }
  // '\n' is important for FF so that it won't incorrectly merge span groups
  return '\n<span dir=ltr>' + html + '</span>';
***REMOVED***


***REMOVED***
***REMOVED*** Enforce LTR on both end of the given text piece using unicode BiDi formatting
***REMOVED*** characters LRE and PDF.
***REMOVED*** @param {string} text The piece of text that need to be wrapped.
***REMOVED*** @return {string} The wrapped string after process.
***REMOVED***
goog.i18n.bidi.enforceLtrInText = function(text) {
  return goog.i18n.bidi.Format.LRE + text + goog.i18n.bidi.Format.PDF;
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression to find dimensions such as "padding: .3 0.4ex 5px 6;"
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.dimensionsRe_ =
    /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;


***REMOVED***
***REMOVED*** Regular expression for left.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.leftRe_ = /left/gi;


***REMOVED***
***REMOVED*** Regular expression for right.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.rightRe_ = /right/gi;


***REMOVED***
***REMOVED*** Placeholder regular expression for swapping.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.tempRe_ = /%%%%/g;


***REMOVED***
***REMOVED*** Swap location parameters and 'left'/'right' in CSS specification. The
***REMOVED*** processed string will be suited for RTL layout. Though this function can
***REMOVED*** cover most cases, there are always exceptions. It is suggested to put
***REMOVED*** those exceptions in separate group of CSS string.
***REMOVED*** @param {string} cssStr CSS spefication string.
***REMOVED*** @return {string} Processed CSS specification string.
***REMOVED***
goog.i18n.bidi.mirrorCSS = function(cssStr) {
  return cssStr.
      // reverse dimensions
      replace(goog.i18n.bidi.dimensionsRe_, ':$1 $4 $3 $2').
      replace(goog.i18n.bidi.leftRe_, '%%%%').          // swap left and right
      replace(goog.i18n.bidi.rightRe_, goog.i18n.bidi.LEFT).
      replace(goog.i18n.bidi.tempRe_, goog.i18n.bidi.RIGHT);
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression for hebrew double quote substitution, finding quote
***REMOVED*** directly after hebrew characters.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g;


***REMOVED***
***REMOVED*** Regular expression for hebrew single quote substitution, finding quote
***REMOVED*** directly after hebrew characters.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g;


***REMOVED***
***REMOVED*** Replace the double and single quote directly after a Hebrew character with
***REMOVED*** GERESH and GERSHAYIM. In such case, most likely that's user intention.
***REMOVED*** @param {string} str String that need to be processed.
***REMOVED*** @return {string} Processed string with double/single quote replaced.
***REMOVED***
goog.i18n.bidi.normalizeHebrewQuote = function(str) {
  return str.
      replace(goog.i18n.bidi.doubleQuoteSubstituteRe_, '$1\u05f4').
      replace(goog.i18n.bidi.singleQuoteSubstituteRe_, '$1\u05f3');
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression to split a string into "words" for directionality
***REMOVED*** estimation based on relative word counts.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.wordSeparatorRe_ = /\s+/;


***REMOVED***
***REMOVED*** Regular expression to check if a string contains any numerals. Used to
***REMOVED*** differentiate between completely neutral strings and those containing
***REMOVED*** numbers, which are weakly LTR.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.hasNumeralsRe_ = /\d/;


***REMOVED***
***REMOVED*** This constant controls threshold of RTL directionality.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.i18n.bidi.rtlDetectionThreshold_ = 0.40;


***REMOVED***
***REMOVED*** Estimates the directionality of a string based on relative word counts.
***REMOVED*** If the number of RTL words is above a certain percentage of the total number
***REMOVED*** of strongly directional words, returns RTL.
***REMOVED*** Otherwise, if any words are strongly or weakly LTR, returns LTR.
***REMOVED*** Otherwise, returns UNKNOWN, which is used to mean "neutral".
***REMOVED*** Numbers are counted as weakly LTR.
***REMOVED*** @param {string} str The string to be checked.
***REMOVED*** @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {goog.i18n.bidi.Dir} Estimated overall directionality of {@code str}.
***REMOVED***
goog.i18n.bidi.estimateDirection = function(str, opt_isHtml) {
  var rtlCount = 0;
  var totalCount = 0;
  var hasWeaklyLtr = false;
  var tokens = goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml).
      split(goog.i18n.bidi.wordSeparatorRe_);
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if (goog.i18n.bidi.startsWithRtl(token)) {
      rtlCount++;
      totalCount++;
    } else if (goog.i18n.bidi.isRequiredLtrRe_.test(token)) {
      hasWeaklyLtr = true;
    } else if (goog.i18n.bidi.hasAnyLtr(token)) {
      totalCount++;
    } else if (goog.i18n.bidi.hasNumeralsRe_.test(token)) {
      hasWeaklyLtr = true;
    }
  }

  return totalCount == 0 ?
      (hasWeaklyLtr ? goog.i18n.bidi.Dir.LTR : goog.i18n.bidi.Dir.NEUTRAL) :
      (rtlCount / totalCount > goog.i18n.bidi.rtlDetectionThreshold_ ?
          goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR);
***REMOVED***


***REMOVED***
***REMOVED*** Check the directionality of a piece of text, return true if the piece of
***REMOVED*** text should be laid out in RTL direction.
***REMOVED*** @param {string} str The piece of text that need to be detected.
***REMOVED*** @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
***REMOVED***     Default: false.
***REMOVED*** @return {boolean} Whether this piece of text should be laid out in RTL.
***REMOVED***
goog.i18n.bidi.detectRtlDirectionality = function(str, opt_isHtml) {
  return goog.i18n.bidi.estimateDirection(str, opt_isHtml) ==
      goog.i18n.bidi.Dir.RTL;
***REMOVED***


***REMOVED***
***REMOVED*** Sets text input element's directionality and text alignment based on a
***REMOVED*** given directionality. Does nothing if the given directionality is unknown or
***REMOVED*** neutral.
***REMOVED*** @param {Element} element Input field element to set directionality to.
***REMOVED*** @param {goog.i18n.bidi.Dir|number|boolean|null} dir Desired directionality,
***REMOVED***     given in one of the following formats:
***REMOVED***     1. A goog.i18n.bidi.Dir constant.
***REMOVED***     2. A number (positive = LRT, negative = RTL, 0 = neutral).
***REMOVED***     3. A boolean (true = RTL, false = LTR).
***REMOVED***     4. A null for unknown directionality.
***REMOVED***
goog.i18n.bidi.setElementDirAndAlign = function(element, dir) {
  if (element) {
    dir = goog.i18n.bidi.toDir(dir);
    if (dir) {
      element.style.textAlign =
          dir == goog.i18n.bidi.Dir.RTL ?
          goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT;
      element.dir = dir == goog.i18n.bidi.Dir.RTL ? 'rtl' : 'ltr';
    }
  }
***REMOVED***



***REMOVED***
***REMOVED*** Strings that have an (optional) known direction.
***REMOVED***
***REMOVED*** Implementations of this interface are string-like objects that carry an
***REMOVED*** attached direction, if known.
***REMOVED*** @interface
***REMOVED***
goog.i18n.bidi.DirectionalString = function() {***REMOVED***


***REMOVED***
***REMOVED*** Interface marker of the DirectionalString interface.
***REMOVED***
***REMOVED*** This property can be used to determine at runtime whether or not an object
***REMOVED*** implements this interface.  All implementations of this interface set this
***REMOVED*** property to {@code true}.
***REMOVED*** @type {boolean}
***REMOVED***
goog.i18n.bidi.DirectionalString.prototype.
    implementsGoogI18nBidiDirectionalString;


***REMOVED***
***REMOVED*** Retrieves this object's known direction (if any).
***REMOVED*** @return {?goog.i18n.bidi.Dir} The known direction. Null if unknown.
***REMOVED***
goog.i18n.bidi.DirectionalString.prototype.getDirection;
