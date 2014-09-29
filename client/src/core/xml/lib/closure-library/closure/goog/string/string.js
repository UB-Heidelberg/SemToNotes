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
***REMOVED*** @fileoverview Utilities for string manipulation.
***REMOVED***


***REMOVED***
***REMOVED*** Namespace for string utilities
***REMOVED***
goog.provide('goog.string');
goog.provide('goog.string.Unicode');


***REMOVED***
***REMOVED*** Common Unicode string characters.
***REMOVED*** @enum {string}
***REMOVED***
goog.string.Unicode = {
  NBSP: '\xa0'
***REMOVED***


***REMOVED***
***REMOVED*** Fast prefix-checker.
***REMOVED*** @param {string} str The string to check.
***REMOVED*** @param {string} prefix A string to look for at the start of {@code str}.
***REMOVED*** @return {boolean} True if {@code str} begins with {@code prefix}.
***REMOVED***
goog.string.startsWith = function(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0;
***REMOVED***


***REMOVED***
***REMOVED*** Fast suffix-checker.
***REMOVED*** @param {string} str The string to check.
***REMOVED*** @param {string} suffix A string to look for at the end of {@code str}.
***REMOVED*** @return {boolean} True if {@code str} ends with {@code suffix}.
***REMOVED***
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l;
***REMOVED***


***REMOVED***
***REMOVED*** Case-insensitive prefix-checker.
***REMOVED*** @param {string} str The string to check.
***REMOVED*** @param {string} prefix  A string to look for at the end of {@code str}.
***REMOVED*** @return {boolean} True if {@code str} begins with {@code prefix} (ignoring
***REMOVED***     case).
***REMOVED***
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return goog.string.caseInsensitiveCompare(
      prefix, str.substr(0, prefix.length)) == 0;
***REMOVED***


***REMOVED***
***REMOVED*** Case-insensitive suffix-checker.
***REMOVED*** @param {string} str The string to check.
***REMOVED*** @param {string} suffix A string to look for at the end of {@code str}.
***REMOVED*** @return {boolean} True if {@code str} ends with {@code suffix} (ignoring
***REMOVED***     case).
***REMOVED***
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return goog.string.caseInsensitiveCompare(
      suffix, str.substr(str.length - suffix.length, suffix.length)) == 0;
***REMOVED***


***REMOVED***
***REMOVED*** Does simple python-style string substitution.
***REMOVED*** subs("foo%s hot%s", "bar", "dog") becomes "foobar hotdog".
***REMOVED*** @param {string} str The string containing the pattern.
***REMOVED*** @param {...*} var_args The items to substitute into the pattern.
***REMOVED*** @return {string} A copy of {@code str} in which each occurrence of
***REMOVED***     {@code %s} has been replaced an argument from {@code var_args}.
***REMOVED***
goog.string.subs = function(str, var_args) {
  // This appears to be slow, but testing shows it compares more or less
  // equivalent to the regex.exec method.
  for (var i = 1; i < arguments.length; i++) {
    // We cast to String in case an argument is a Function.  Replacing $&, for
    // example, with $$$& stops the replace from subsituting the whole match
    // into the resultant string.  $$$& in the first replace becomes $$& in the
    //  second, which leaves $& in the resultant string.  Also:
    // $$, $`, $', $n $nn
    var replacement = String(arguments[i]).replace(/\$/g, '$$$$');
    str = str.replace(/\%s/, replacement);
  }
  return str;
***REMOVED***


***REMOVED***
***REMOVED*** Converts multiple whitespace chars (spaces, non-breaking-spaces, new lines
***REMOVED*** and tabs) to a single space, and strips leading and trailing whitespace.
***REMOVED*** @param {string} str Input string.
***REMOVED*** @return {string} A copy of {@code str} with collapsed whitespace.
***REMOVED***
goog.string.collapseWhitespace = function(str) {
  // Since IE doesn't include non-breaking-space (0xa0) in their \s character
  // class (as required by section 7.2 of the ECMAScript spec), we explicitly
  // include it in the regexp to enforce consistent cross-browser behavior.
  return str.replace(/[\s\xa0]+/g, ' ').replace(/^\s+|\s+$/g, '');
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a string is empty or contains only whitespaces.
***REMOVED*** @param {string} str The string to check.
***REMOVED*** @return {boolean} True if {@code str} is empty or whitespace only.
***REMOVED***
goog.string.isEmpty = function(str) {
  // testing length == 0 first is actually slower in all browsers (about the
  // same in Opera).
  // Since IE doesn't include non-breaking-space (0xa0) in their \s character
  // class (as required by section 7.2 of the ECMAScript spec), we explicitly
  // include it in the regexp to enforce consistent cross-browser behavior.
  return /^[\s\xa0]*$/.test(str);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a string is null, undefined, empty or contains only whitespaces.
***REMOVED*** @param {*} str The string to check.
***REMOVED*** @return {boolean} True if{@code str} is null, undefined, empty, or
***REMOVED***     whitespace only.
***REMOVED***
goog.string.isEmptySafe = function(str) {
  return goog.string.isEmpty(goog.string.makeSafe(str));
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a string is all breaking whitespace.
***REMOVED*** @param {string} str The string to check.
***REMOVED*** @return {boolean} Whether the string is all breaking whitespace.
***REMOVED***
goog.string.isBreakingWhitespace = function(str) {
  return !/[^\t\n\r ]/.test(str);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a string contains all letters.
***REMOVED*** @param {string} str string to check.
***REMOVED*** @return {boolean} True if {@code str} consists entirely of letters.
***REMOVED***
goog.string.isAlpha = function(str) {
  return !/[^a-zA-Z]/.test(str);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a string contains only numbers.
***REMOVED*** @param {*} str string to check. If not a string, it will be
***REMOVED***     casted to one.
***REMOVED*** @return {boolean} True if {@code str} is numeric.
***REMOVED***
goog.string.isNumeric = function(str) {
  return !/[^0-9]/.test(str);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a string contains only numbers or letters.
***REMOVED*** @param {string} str string to check.
***REMOVED*** @return {boolean} True if {@code str} is alphanumeric.
***REMOVED***
goog.string.isAlphaNumeric = function(str) {
  return !/[^a-zA-Z0-9]/.test(str);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a character is a space character.
***REMOVED*** @param {string} ch Character to check.
***REMOVED*** @return {boolean} True if {code ch} is a space.
***REMOVED***
goog.string.isSpace = function(ch) {
  return ch == ' ';
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a character is a valid unicode character.
***REMOVED*** @param {string} ch Character to check.
***REMOVED*** @return {boolean} True if {code ch} is a valid unicode character.
***REMOVED***
goog.string.isUnicodeChar = function(ch) {
  return ch.length == 1 && ch >= ' ' && ch <= '~' ||
         ch >= '\u0080' && ch <= '\uFFFD';
***REMOVED***


***REMOVED***
***REMOVED*** Takes a string and replaces newlines with a space. Multiple lines are
***REMOVED*** replaced with a single space.
***REMOVED*** @param {string} str The string from which to strip newlines.
***REMOVED*** @return {string} A copy of {@code str} stripped of newlines.
***REMOVED***
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, ' ');
***REMOVED***


***REMOVED***
***REMOVED*** Replaces Windows and Mac new lines with unix style: \r or \r\n with \n.
***REMOVED*** @param {string} str The string to in which to canonicalize newlines.
***REMOVED*** @return {string} {@code str} A copy of {@code} with canonicalized newlines.
***REMOVED***
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, '\n');
***REMOVED***


***REMOVED***
***REMOVED*** Normalizes whitespace in a string, replacing all whitespace chars with
***REMOVED*** a space.
***REMOVED*** @param {string} str The string in which to normalize whitespace.
***REMOVED*** @return {string} A copy of {@code str} with all whitespace normalized.
***REMOVED***
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, ' ');
***REMOVED***


***REMOVED***
***REMOVED*** Normalizes spaces in a string, replacing all consecutive spaces and tabs
***REMOVED*** with a single space. Replaces non-breaking space with a space.
***REMOVED*** @param {string} str The string in which to normalize spaces.
***REMOVED*** @return {string} A copy of {@code str} with all consecutive spaces and tabs
***REMOVED***    replaced with a single space.
***REMOVED***
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, ' ');
***REMOVED***


***REMOVED***
***REMOVED*** Removes the breaking spaces from the left and right of the string and
***REMOVED*** collapses the sequences of breaking spaces in the middle into single spaces.
***REMOVED*** The original and the result strings render the same way in HTML.
***REMOVED*** @param {string} str A string in which to collapse spaces.
***REMOVED*** @return {string} Copy of the string with normalized breaking spaces.
***REMOVED***
goog.string.collapseBreakingSpaces = function(str) {
  return str.replace(/[\t\r\n ]+/g, ' ').replace(
      /^[\t\r\n ]+|[\t\r\n ]+$/g, '');
***REMOVED***


***REMOVED***
***REMOVED*** Trims white spaces to the left and right of a string.
***REMOVED*** @param {string} str The string to trim.
***REMOVED*** @return {string} A trimmed copy of {@code str}.
***REMOVED***
goog.string.trim = function(str) {
  // Since IE doesn't include non-breaking-space (0xa0) in their \s character
  // class (as required by section 7.2 of the ECMAScript spec), we explicitly
  // include it in the regexp to enforce consistent cross-browser behavior.
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
***REMOVED***


***REMOVED***
***REMOVED*** Trims whitespaces at the left end of a string.
***REMOVED*** @param {string} str The string to left trim.
***REMOVED*** @return {string} A trimmed copy of {@code str}.
***REMOVED***
goog.string.trimLeft = function(str) {
  // Since IE doesn't include non-breaking-space (0xa0) in their \s character
  // class (as required by section 7.2 of the ECMAScript spec), we explicitly
  // include it in the regexp to enforce consistent cross-browser behavior.
  return str.replace(/^[\s\xa0]+/, '');
***REMOVED***


***REMOVED***
***REMOVED*** Trims whitespaces at the right end of a string.
***REMOVED*** @param {string} str The string to right trim.
***REMOVED*** @return {string} A trimmed copy of {@code str}.
***REMOVED***
goog.string.trimRight = function(str) {
  // Since IE doesn't include non-breaking-space (0xa0) in their \s character
  // class (as required by section 7.2 of the ECMAScript spec), we explicitly
  // include it in the regexp to enforce consistent cross-browser behavior.
  return str.replace(/[\s\xa0]+$/, '');
***REMOVED***


***REMOVED***
***REMOVED*** A string comparator that ignores case.
***REMOVED*** -1 = str1 less than str2
***REMOVED***  0 = str1 equals str2
***REMOVED***  1 = str1 greater than str2
***REMOVED***
***REMOVED*** @param {string} str1 The string to compare.
***REMOVED*** @param {string} str2 The string to compare {@code str1} to.
***REMOVED*** @return {number} The comparator result, as described above.
***REMOVED***
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase();
  var test2 = String(str2).toLowerCase();

  if (test1 < test2) {
    return -1;
  } else if (test1 == test2) {
    return 0;
  } else {
    return 1;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression used for splitting a string into substrings of fractional
***REMOVED*** numbers, integers, and non-numeric characters.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;


***REMOVED***
***REMOVED*** String comparison function that handles numbers in a way humans might expect.
***REMOVED*** Using this function, the string "File 2.jpg" sorts before "File 10.jpg". The
***REMOVED*** comparison is mostly case-insensitive, though strings that are identical
***REMOVED*** except for case are sorted with the upper-case strings before lower-case.
***REMOVED***
***REMOVED*** This comparison function is significantly slower (about 500x) than either
***REMOVED*** the default or the case-insensitive compare. It should not be used in
***REMOVED*** time-critical code, but should be fast enough to sort several hundred short
***REMOVED*** strings (like filenames) with a reasonable delay.
***REMOVED***
***REMOVED*** @param {string} str1 The string to compare in a numerically sensitive way.
***REMOVED*** @param {string} str2 The string to compare {@code str1} to.
***REMOVED*** @return {number} less than 0 if str1 < str2, 0 if str1 == str2, greater than
***REMOVED***     0 if str1 > str2.
***REMOVED***
goog.string.numerateCompare = function(str1, str2) {
  if (str1 == str2) {
    return 0;
  }
  if (!str1) {
    return -1;
  }
  if (!str2) {
    return 1;
  }

  // Using match to split the entire string ahead of time turns out to be faster
  // for most inputs than using RegExp.exec or iterating over each character.
  var tokens1 = str1.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var tokens2 = str2.toLowerCase().match(goog.string.numerateCompareRegExp_);

  var count = Math.min(tokens1.length, tokens2.length);

  for (var i = 0; i < count; i++) {
    var a = tokens1[i];
    var b = tokens2[i];

    // Compare pairs of tokens, returning if one token sorts before the other.
    if (a != b) {

      // Only if both tokens are integers is a special comparison required.
      // Decimal numbers are sorted as strings (e.g., '.09' < '.1').
      var num1 = parseInt(a, 10);
      if (!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if (!isNaN(num2) && num1 - num2) {
          return num1 - num2;
        }
      }
      return a < b ? -1 : 1;
    }
  }

  // If one string is a substring of the other, the shorter string sorts first.
  if (tokens1.length != tokens2.length) {
    return tokens1.length - tokens2.length;
  }

  // The two strings must be equivalent except for case (perfect equality is
  // tested at the head of the function.) Revert to default ASCII-betical string
  // comparison to stablize the sort.
  return str1 < str2 ? -1 : 1;
***REMOVED***


***REMOVED***
***REMOVED*** URL-encodes a string
***REMOVED*** @param {*} str The string to url-encode.
***REMOVED*** @return {string} An encoded copy of {@code str} that is safe for urls.
***REMOVED***     Note that '#', ':', and other characters used to delimit portions
***REMOVED***     of URLs***REMOVED***will* be encoded.
***REMOVED***
goog.string.urlEncode = function(str) {
  return encodeURIComponent(String(str));
***REMOVED***


***REMOVED***
***REMOVED*** URL-decodes the string. We need to specially handle '+'s because
***REMOVED*** the javascript library doesn't convert them to spaces.
***REMOVED*** @param {string} str The string to url decode.
***REMOVED*** @return {string} The decoded {@code str}.
***REMOVED***
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, ' '));
***REMOVED***


***REMOVED***
***REMOVED*** Converts \n to <br>s or <br />s.
***REMOVED*** @param {string} str The string in which to convert newlines.
***REMOVED*** @param {boolean=} opt_xml Whether to use XML compatible tags.
***REMOVED*** @return {string} A copy of {@code str} with converted newlines.
***REMOVED***
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? '<br />' : '<br>');
***REMOVED***


***REMOVED***
***REMOVED*** Escape double quote '"' characters in addition to '&', '<', and '>' so that a
***REMOVED*** string can be included in an HTML tag attribute value within double quotes.
***REMOVED***
***REMOVED*** It should be noted that > doesn't need to be escaped for the HTML or XML to
***REMOVED*** be valid, but it has been decided to escape it for consistency with other
***REMOVED*** implementations.
***REMOVED***
***REMOVED*** NOTE(user):
***REMOVED*** HtmlEscape is often called during the generation of large blocks of HTML.
***REMOVED*** Using statics for the regular expressions and strings is an optimization
***REMOVED*** that can more than half the amount of time IE spends in this function for
***REMOVED*** large apps, since strings and regexes both contribute to GC allocations.
***REMOVED***
***REMOVED*** Testing for the presence of a character before escaping increases the number
***REMOVED*** of function calls, but actually provides a speed increase for the average
***REMOVED*** case -- since the average case often doesn't require the escaping of all 4
***REMOVED*** characters and indexOf() is much cheaper than replace().
***REMOVED*** The worst case does suffer slightly from the additional calls, therefore the
***REMOVED*** opt_isLikelyToContainHtmlChars option has been included for situations
***REMOVED*** where all 4 HTML entities are very likely to be present and need escaping.
***REMOVED***
***REMOVED*** Some benchmarks (times tended to fluctuate +-0.05ms):
***REMOVED***                                     FireFox                     IE6
***REMOVED*** (no chars / average (mix of cases) / all 4 chars)
***REMOVED*** no checks                     0.13 / 0.22 / 0.22         0.23 / 0.53 / 0.80
***REMOVED*** indexOf                       0.08 / 0.17 / 0.26         0.22 / 0.54 / 0.84
***REMOVED*** indexOf + re test             0.07 / 0.17 / 0.28         0.19 / 0.50 / 0.85
***REMOVED***
***REMOVED*** An additional advantage of checking if replace actually needs to be called
***REMOVED*** is a reduction in the number of object allocations, so as the size of the
***REMOVED*** application grows the difference between the various methods would increase.
***REMOVED***
***REMOVED*** @param {string} str string to be escaped.
***REMOVED*** @param {boolean=} opt_isLikelyToContainHtmlChars Don't perform a check to see
***REMOVED***     if the character needs replacing - use this option if you expect each of
***REMOVED***     the characters to appear often. Leave false if you expect few html
***REMOVED***     characters to occur in your strings, such as if you are escaping HTML.
***REMOVED*** @return {string} An escaped copy of {@code str}.
***REMOVED***
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {

  if (opt_isLikelyToContainHtmlChars) {
    return str.replace(goog.string.amperRe_, '&amp;')
          .replace(goog.string.ltRe_, '&lt;')
          .replace(goog.string.gtRe_, '&gt;')
          .replace(goog.string.quotRe_, '&quot;');

  } else {
    // quick test helps in the case when there are no chars to replace, in
    // worst case this makes barely a difference to the time taken
    if (!goog.string.allRe_.test(str)) return str;

    // str.indexOf is faster than regex.test in this case
    if (str.indexOf('&') != -1) {
      str = str.replace(goog.string.amperRe_, '&amp;');
    }
    if (str.indexOf('<') != -1) {
      str = str.replace(goog.string.ltRe_, '&lt;');
    }
    if (str.indexOf('>') != -1) {
      str = str.replace(goog.string.gtRe_, '&gt;');
    }
    if (str.indexOf('"') != -1) {
      str = str.replace(goog.string.quotRe_, '&quot;');
    }
    return str;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression that matches an ampersand, for use in escaping.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.string.amperRe_ = /&/g;


***REMOVED***
***REMOVED*** Regular expression that matches a less than sign, for use in escaping.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.string.ltRe_ = /</g;


***REMOVED***
***REMOVED*** Regular expression that matches a greater than sign, for use in escaping.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.string.gtRe_ = />/g;


***REMOVED***
***REMOVED*** Regular expression that matches a double quote, for use in escaping.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.string.quotRe_ = /\"/g;


***REMOVED***
***REMOVED*** Regular expression that matches any character that needs to be escaped.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.string.allRe_ = /[&<>\"]/;


***REMOVED***
***REMOVED*** Unescapes an HTML string.
***REMOVED***
***REMOVED*** @param {string} str The string to unescape.
***REMOVED*** @return {string} An unescaped copy of {@code str}.
***REMOVED***
goog.string.unescapeEntities = function(str) {
  if (goog.string.contains(str, '&')) {
    // We are careful not to use a DOM if we do not have one. We use the []
    // notation so that the JSCompiler will not complain about these objects and
    // fields in the case where we have no DOM.
    if ('document' in goog.global) {
      return goog.string.unescapeEntitiesUsingDom_(str);
    } else {
      // Fall back on pure XML entities
      return goog.string.unescapePureXmlEntities_(str);
    }
  }
  return str;
***REMOVED***


***REMOVED***
***REMOVED*** Unescapes an HTML string using a DOM to resolve non-XML, non-numeric
***REMOVED*** entities. This function is XSS-safe and whitespace-preserving.
***REMOVED*** @private
***REMOVED*** @param {string} str The string to unescape.
***REMOVED*** @return {string} The unescaped {@code str} string.
***REMOVED***
goog.string.unescapeEntitiesUsingDom_ = function(str) {
  var seen = {'&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"'***REMOVED***
  var div = document.createElement('div');
  // Match as many valid entity characters as possible. If the actual entity
  // happens to be shorter, it will still work as innerHTML will return the
  // trailing characters unchanged. Since the entity characters do not include
  // open angle bracket, there is no chance of XSS from the innerHTML use.
  // Since no whitespace is passed to innerHTML, whitespace is preserved.
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    // Check for cached entity.
    var value = seen[s];
    if (value) {
      return value;
    }
    // Check for numeric entity.
    if (entity.charAt(0) == '#') {
      // Prefix with 0 so that hex entities (e.g. &#x10) parse as hex numbers.
      var n = Number('0' + entity.substr(1));
      if (!isNaN(n)) {
        value = String.fromCharCode(n);
      }
    }
    // Fall back to innerHTML otherwise.
    if (!value) {
      // Append a non-entity character to avoid a bug in Webkit that parses
      // an invalid entity at the end of innerHTML text as the empty string.
      div.innerHTML = s + ' ';
      // Then remove the trailing character from the result.
      value = div.firstChild.nodeValue.slice(0, -1);
    }
    // Cache and return.
    return seen[s] = value;
  });
***REMOVED***


***REMOVED***
***REMOVED*** Unescapes XML entities.
***REMOVED*** @private
***REMOVED*** @param {string} str The string to unescape.
***REMOVED*** @return {string} An unescaped copy of {@code str}.
***REMOVED***
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch (entity) {
      case 'amp':
        return '&';
      case 'lt':
        return '<';
      case 'gt':
        return '>';
      case 'quot':
        return '"';
      default:
        if (entity.charAt(0) == '#') {
          // Prefix with 0 so that hex entities (e.g. &#x10) parse as hex.
          var n = Number('0' + entity.substr(1));
          if (!isNaN(n)) {
            return String.fromCharCode(n);
          }
        }
        // For invalid entities we just return the entity
        return s;
    }
  });
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression that matches an HTML entity.
***REMOVED*** See also HTML5: Tokenization / Tokenizing character references.
***REMOVED*** @private
***REMOVED*** @type {!RegExp}
***REMOVED***
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;


***REMOVED***
***REMOVED*** Do escaping of whitespace to preserve spatial formatting. We use character
***REMOVED*** entity #160 to make it safer for xml.
***REMOVED*** @param {string} str The string in which to escape whitespace.
***REMOVED*** @param {boolean=} opt_xml Whether to use XML compatible tags.
***REMOVED*** @return {string} An escaped copy of {@code str}.
***REMOVED***
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, ' &#160;'), opt_xml);
***REMOVED***


***REMOVED***
***REMOVED*** Strip quote characters around a string.  The second argument is a string of
***REMOVED*** characters to treat as quotes.  This can be a single character or a string of
***REMOVED*** multiple character and in that case each of those are treated as possible
***REMOVED*** quote characters. For example:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** goog.string.stripQuotes('"abc"', '"`') --> 'abc'
***REMOVED*** goog.string.stripQuotes('`abc`', '"`') --> 'abc'
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {string} str The string to strip.
***REMOVED*** @param {string} quoteChars The quote characters to strip.
***REMOVED*** @return {string} A copy of {@code str} without the quotes.
***REMOVED***
goog.string.stripQuotes = function(str, quoteChars) {
  var length = quoteChars.length;
  for (var i = 0; i < length; i++) {
    var quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
    if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1);
    }
  }
  return str;
***REMOVED***


***REMOVED***
***REMOVED*** Truncates a string to a certain length and adds '...' if necessary.  The
***REMOVED*** length also accounts for the ellipsis, so a maximum length of 10 and a string
***REMOVED*** 'Hello World!' produces 'Hello W...'.
***REMOVED*** @param {string} str The string to truncate.
***REMOVED*** @param {number} chars Max number of characters.
***REMOVED*** @param {boolean=} opt_protectEscapedCharacters Whether to protect escaped
***REMOVED***     characters from being cut off in the middle.
***REMOVED*** @return {string} The truncated {@code str} string.
***REMOVED***
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }

  if (str.length > chars) {
    str = str.substring(0, chars - 3) + '...';
  }

  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }

  return str;
***REMOVED***


***REMOVED***
***REMOVED*** Truncate a string in the middle, adding "..." if necessary,
***REMOVED*** and favoring the beginning of the string.
***REMOVED*** @param {string} str The string to truncate the middle of.
***REMOVED*** @param {number} chars Max number of characters.
***REMOVED*** @param {boolean=} opt_protectEscapedCharacters Whether to protect escaped
***REMOVED***     characters from being cutoff in the middle.
***REMOVED*** @param {number=} opt_trailingChars Optional number of trailing characters to
***REMOVED***     leave at the end of the string, instead of truncating as close to the
***REMOVED***     middle as possible.
***REMOVED*** @return {string} A truncated copy of {@code str}.
***REMOVED***
goog.string.truncateMiddle = function(str, chars,
    opt_protectEscapedCharacters, opt_trailingChars) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }

  if (opt_trailingChars && str.length > chars) {
    if (opt_trailingChars > chars) {
      opt_trailingChars = chars;
    }
    var endPoint = str.length - opt_trailingChars;
    var startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + '...' + str.substring(endPoint);
  } else if (str.length > chars) {
    // Favor the beginning of the string:
    var half = Math.floor(chars / 2);
    var endPos = str.length - half;
    half += chars % 2;
    str = str.substring(0, half) + '...' + str.substring(endPos);
  }

  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }

  return str;
***REMOVED***


***REMOVED***
***REMOVED*** Special chars that need to be escaped for goog.string.quote.
***REMOVED*** @private
***REMOVED*** @type {Object}
***REMOVED***
goog.string.specialEscapeChars_ = {
  '\0': '\\0',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  '\x0B': '\\x0B', // '\v' is not supported in JScript
  '"': '\\"',
  '\\': '\\\\'
***REMOVED***


***REMOVED***
***REMOVED*** Character mappings used internally for goog.string.escapeChar.
***REMOVED*** @private
***REMOVED*** @type {Object}
***REMOVED***
goog.string.jsEscapeCache_ = {
  '\'': '\\\''
***REMOVED***


***REMOVED***
***REMOVED*** Encloses a string in double quotes and escapes characters so that the
***REMOVED*** string is a valid JS string.
***REMOVED*** @param {string} s The string to quote.
***REMOVED*** @return {string} A copy of {@code s} surrounded by double quotes.
***REMOVED***
goog.string.quote = function(s) {
  s = String(s);
  if (s.quote) {
    return s.quote();
  } else {
    var sb = ['"'];
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      var cc = ch.charCodeAt(0);
      sb[i + 1] = goog.string.specialEscapeChars_[ch] ||
          ((cc > 31 && cc < 127) ? ch : goog.string.escapeChar(ch));
    }
    sb.push('"');
    return sb.join('');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Takes a string and returns the escaped string for that character.
***REMOVED*** @param {string} str The string to escape.
***REMOVED*** @return {string} An escaped string representing {@code str}.
***REMOVED***
goog.string.escapeString = function(str) {
  var sb = [];
  for (var i = 0; i < str.length; i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i));
  }
  return sb.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Takes a character and returns the escaped string for that character. For
***REMOVED*** example escapeChar(String.fromCharCode(15)) -> "\\x0E".
***REMOVED*** @param {string} c The character to escape.
***REMOVED*** @return {string} An escaped string representing {@code c}.
***REMOVED***
goog.string.escapeChar = function(c) {
  if (c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c];
  }

  if (c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c];
  }

  var rv = c;
  var cc = c.charCodeAt(0);
  if (cc > 31 && cc < 127) {
    rv = c;
  } else {
    // tab is 9 but handled above
    if (cc < 256) {
      rv = '\\x';
      if (cc < 16 || cc > 256) {
        rv += '0';
      }
    } else {
      rv = '\\u';
      if (cc < 4096) { // \u1000
        rv += '0';
      }
    }
    rv += cc.toString(16).toUpperCase();
  }

  return goog.string.jsEscapeCache_[c] = rv;
***REMOVED***


***REMOVED***
***REMOVED*** Takes a string and creates a map (Object) in which the keys are the
***REMOVED*** characters in the string. The value for the key is set to true. You can
***REMOVED*** then use goog.object.map or goog.array.map to change the values.
***REMOVED*** @param {string} s The string to build the map from.
***REMOVED*** @return {Object} The map of characters used.
***REMOVED***
// TODO(arv): It seems like we should have a generic goog.array.toMap. But do
//            we want a dependency on goog.array in goog.string?
goog.string.toMap = function(s) {
  var rv = {***REMOVED***
  for (var i = 0; i < s.length; i++) {
    rv[s.charAt(i)] = true;
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether a string contains a given substring.
***REMOVED*** @param {string} s The string to test.
***REMOVED*** @param {string} ss The substring to test for.
***REMOVED*** @return {boolean} True if {@code s} contains {@code ss}.
***REMOVED***
goog.string.contains = function(s, ss) {
  return s.indexOf(ss) != -1;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the non-overlapping occurrences of ss in s.
***REMOVED*** If either s or ss evalutes to false, then returns zero.
***REMOVED*** @param {string} s The string to look in.
***REMOVED*** @param {string} ss The string to look for.
***REMOVED*** @return {number} Number of occurrences of ss in s.
***REMOVED***
goog.string.countOf = function(s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0;
***REMOVED***


***REMOVED***
***REMOVED*** Removes a substring of a specified length at a specific
***REMOVED*** index in a string.
***REMOVED*** @param {string} s The base string from which to remove.
***REMOVED*** @param {number} index The index at which to remove the substring.
***REMOVED*** @param {number} stringLength The length of the substring to remove.
***REMOVED*** @return {string} A copy of {@code s} with the substring removed or the full
***REMOVED***     string if nothing is removed or the input is invalid.
***REMOVED***
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  // If the index is greater or equal to 0 then remove substring
  if (index >= 0 && index < s.length && stringLength > 0) {
    resultStr = s.substr(0, index) +
        s.substr(index + stringLength, s.length - index - stringLength);
  }
  return resultStr;
***REMOVED***


***REMOVED***
***REMOVED***  Removes the first occurrence of a substring from a string.
***REMOVED***  @param {string} s The base string from which to remove.
***REMOVED***  @param {string} ss The string to remove.
***REMOVED***  @return {string} A copy of {@code s} with {@code ss} removed or the full
***REMOVED***      string if nothing is removed.
***REMOVED***
goog.string.remove = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), '');
  return s.replace(re, '');
***REMOVED***


***REMOVED***
***REMOVED***  Removes all occurrences of a substring from a string.
***REMOVED***  @param {string} s The base string from which to remove.
***REMOVED***  @param {string} ss The string to remove.
***REMOVED***  @return {string} A copy of {@code s} with {@code ss} removed or the full
***REMOVED***      string if nothing is removed.
***REMOVED***
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), 'g');
  return s.replace(re, '');
***REMOVED***


***REMOVED***
***REMOVED*** Escapes characters in the string that are not safe to use in a RegExp.
***REMOVED*** @param {*} s The string to escape. If not a string, it will be casted
***REMOVED***     to one.
***REMOVED*** @return {string} A RegExp safe, escaped copy of {@code s}.
***REMOVED***
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
      replace(/\x08/g, '\\x08');
***REMOVED***


***REMOVED***
***REMOVED*** Repeats a string n times.
***REMOVED*** @param {string} string The string to repeat.
***REMOVED*** @param {number} length The number of times to repeat.
***REMOVED*** @return {string} A string containing {@code length} repetitions of
***REMOVED***     {@code string}.
***REMOVED***
goog.string.repeat = function(string, length) {
  return new Array(length + 1).join(string);
***REMOVED***


***REMOVED***
***REMOVED*** Pads number to given length and optionally rounds it to a given precision.
***REMOVED*** For example:
***REMOVED*** <pre>padNumber(1.25, 2, 3) -> '01.250'
***REMOVED*** padNumber(1.25, 2) -> '01.25'
***REMOVED*** padNumber(1.25, 2, 1) -> '01.3'
***REMOVED*** padNumber(1.25, 0) -> '1.25'</pre>
***REMOVED***
***REMOVED*** @param {number} num The number to pad.
***REMOVED*** @param {number} length The desired length.
***REMOVED*** @param {number=} opt_precision The desired precision.
***REMOVED*** @return {string} {@code num} as a string with the given options.
***REMOVED***
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num);
  var index = s.indexOf('.');
  if (index == -1) {
    index = s.length;
  }
  return goog.string.repeat('0', Math.max(0, length - index)) + s;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a string representation of the given object, with
***REMOVED*** null and undefined being returned as the empty string.
***REMOVED***
***REMOVED*** @param {*} obj The object to convert.
***REMOVED*** @return {string} A string representation of the {@code obj}.
***REMOVED***
goog.string.makeSafe = function(obj) {
  return obj == null ? '' : String(obj);
***REMOVED***


***REMOVED***
***REMOVED*** Concatenates string expressions. This is useful
***REMOVED*** since some browsers are very inefficient when it comes to using plus to
***REMOVED*** concat strings. Be careful when using null and undefined here since
***REMOVED*** these will not be included in the result. If you need to represent these
***REMOVED*** be sure to cast the argument to a String first.
***REMOVED*** For example:
***REMOVED*** <pre>buildString('a', 'b', 'c', 'd') -> 'abcd'
***REMOVED*** buildString(null, undefined) -> ''
***REMOVED*** </pre>
***REMOVED*** @param {...*} var_args A list of strings to concatenate. If not a string,
***REMOVED***     it will be casted to one.
***REMOVED*** @return {string} The concatenation of {@code var_args}.
***REMOVED***
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, '');
***REMOVED***


***REMOVED***
***REMOVED*** Returns a string with at least 64-bits of randomness.
***REMOVED***
***REMOVED*** Doesn't trust Javascript's random function entirely. Uses a combination of
***REMOVED*** random and current timestamp, and then encodes the string in base-36 to
***REMOVED*** make it shorter.
***REMOVED***
***REMOVED*** @return {string} A random string, e.g. sn1s7vb4gcic.
***REMOVED***
goog.string.getRandomString = function() {
  var x = 2147483648;
  return Math.floor(Math.random()***REMOVED*** x).toString(36) +
         Math.abs(Math.floor(Math.random()***REMOVED*** x) ^ goog.now()).toString(36);
***REMOVED***


***REMOVED***
***REMOVED*** Compares two version numbers.
***REMOVED***
***REMOVED*** @param {string|number} version1 Version of first item.
***REMOVED*** @param {string|number} version2 Version of second item.
***REMOVED***
***REMOVED*** @return {number}  1 if {@code version1} is higher.
***REMOVED***                   0 if arguments are equal.
***REMOVED***                  -1 if {@code version2} is higher.
***REMOVED***
goog.string.compareVersions = function(version1, version2) {
  var order = 0;
  // Trim leading and trailing whitespace and split the versions into
  // subversions.
  var v1Subs = goog.string.trim(String(version1)).split('.');
  var v2Subs = goog.string.trim(String(version2)).split('.');
  var subCount = Math.max(v1Subs.length, v2Subs.length);

  // Iterate over the subversions, as long as they appear to be equivalent.
  for (var subIdx = 0; order == 0 && subIdx < subCount; subIdx++) {
    var v1Sub = v1Subs[subIdx] || '';
    var v2Sub = v2Subs[subIdx] || '';

    // Split the subversions into pairs of numbers and qualifiers (like 'b').
    // Two different RegExp objects are needed because they are both using
    // the 'g' flag.
    var v1CompParser = new RegExp('(\\d*)(\\D*)', 'g');
    var v2CompParser = new RegExp('(\\d*)(\\D*)', 'g');
    do {
      var v1Comp = v1CompParser.exec(v1Sub) || ['', '', ''];
      var v2Comp = v2CompParser.exec(v2Sub) || ['', '', ''];
      // Break if there are no more matches.
      if (v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break;
      }

      // Parse the numeric part of the subversion. A missing number is
      // equivalent to 0.
      var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
      var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);

      // Compare the subversion components. The number has the highest
      // precedence. Next, if the numbers are equal, a subversion without any
      // qualifier is always higher than a subversion with any qualifier. Next,
      // the qualifiers are compared as strings.
      order = goog.string.compareElements_(v1CompNum, v2CompNum) ||
          goog.string.compareElements_(v1Comp[2].length == 0,
              v2Comp[2].length == 0) ||
          goog.string.compareElements_(v1Comp[2], v2Comp[2]);
      // Stop as soon as an inequality is discovered.
    } while (order == 0);
  }

  return order;
***REMOVED***


***REMOVED***
***REMOVED*** Compares elements of a version number.
***REMOVED***
***REMOVED*** @param {string|number|boolean} left An element from a version number.
***REMOVED*** @param {string|number|boolean} right An element from a version number.
***REMOVED***
***REMOVED*** @return {number}  1 if {@code left} is higher.
***REMOVED***                   0 if arguments are equal.
***REMOVED***                  -1 if {@code right} is higher.
***REMOVED*** @private
***REMOVED***
goog.string.compareElements_ = function(left, right) {
  if (left < right) {
    return -1;
  } else if (left > right) {
    return 1;
  }
  return 0;
***REMOVED***


***REMOVED***
***REMOVED*** Maximum value of #goog.string.hashCode, exclusive. 2^32.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.string.HASHCODE_MAX_ = 0x100000000;


***REMOVED***
***REMOVED*** String hash function similar to java.lang.String.hashCode().
***REMOVED*** The hash code for a string is computed as
***REMOVED*** s[0]***REMOVED*** 31 ^ (n - 1) + s[1]***REMOVED*** 31 ^ (n - 2) + ... + s[n - 1],
***REMOVED*** where s[i] is the ith character of the string and n is the length of
***REMOVED*** the string. We mod the result to make it between 0 (inclusive) and 2^32
***REMOVED*** (exclusive).
***REMOVED*** @param {string} str A string.
***REMOVED*** @return {number} Hash value for {@code str}, between 0 (inclusive) and 2^32
***REMOVED***  (exclusive). The empty string returns 0.
***REMOVED***
goog.string.hashCode = function(str) {
  var result = 0;
  for (var i = 0; i < str.length; ++i) {
    result = 31***REMOVED*** result + str.charCodeAt(i);
    // Normalize to 4 byte range, 0 ... 2^32.
    result %= goog.string.HASHCODE_MAX_;
  }
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** The most recent unique ID. |0 is equivalent to Math.floor in this case.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.string.uniqueStringCounter_ = Math.random()***REMOVED*** 0x80000000 | 0;


***REMOVED***
***REMOVED*** Generates and returns a string which is unique in the current document.
***REMOVED*** This is useful, for example, to create unique IDs for DOM elements.
***REMOVED*** @return {string} A unique id.
***REMOVED***
goog.string.createUniqueString = function() {
  return 'goog_' + goog.string.uniqueStringCounter_++;
***REMOVED***


***REMOVED***
***REMOVED*** Converts the supplied string to a number, which may be Ininity or NaN.
***REMOVED*** This function strips whitespace: (toNumber(' 123') === 123)
***REMOVED*** This function accepts scientific notation: (toNumber('1e1') === 10)
***REMOVED***
***REMOVED*** This is better than Javascript's built-in conversions because, sadly:
***REMOVED***     (Number(' ') === 0) and (parseFloat('123a') === 123)
***REMOVED***
***REMOVED*** @param {string} str The string to convert.
***REMOVED*** @return {number} The number the supplied string represents, or NaN.
***REMOVED***
goog.string.toNumber = function(str) {
  var num = Number(str);
  if (num == 0 && goog.string.isEmpty(str)) {
    return NaN;
  }
  return num;
***REMOVED***


***REMOVED***
***REMOVED*** Converts a string from selector-case to camelCase (e.g. from
***REMOVED*** "multi-part-string" to "multiPartString"), useful for converting
***REMOVED*** CSS selectors and HTML dataset keys to their equivalent JS properties.
***REMOVED*** @param {string} str The string in selector-case form.
***REMOVED*** @return {string} The string in camelCase form.
***REMOVED***
goog.string.toCamelCase = function(str) {
  return String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase();
  });
***REMOVED***


***REMOVED***
***REMOVED*** Converts a string from camelCase to selector-case (e.g. from
***REMOVED*** "multiPartString" to "multi-part-string"), useful for converting JS
***REMOVED*** style and dataset properties to equivalent CSS selectors and HTML keys.
***REMOVED*** @param {string} str The string in camelCase form.
***REMOVED*** @return {string} The string in selector-case form.
***REMOVED***
goog.string.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, '-$1').toLowerCase();
***REMOVED***


***REMOVED***
***REMOVED*** Converts a string into TitleCase. First character of the string is always
***REMOVED*** capitalized in addition to the first letter of every subsequent word.
***REMOVED*** Words are delimited by one or more whitespaces by default. Custom delimiters
***REMOVED*** can optionally be specified to replace the default, which doesn't preserve
***REMOVED*** whitespace delimiters and instead must be explicitly included if needed.
***REMOVED***
***REMOVED*** Default delimiter => " ":
***REMOVED***    goog.string.toTitleCase('oneTwoThree')    => 'OneTwoThree'
***REMOVED***    goog.string.toTitleCase('one two three')  => 'One Two Three'
***REMOVED***    goog.string.toTitleCase('  one   two   ') => '  One   Two   '
***REMOVED***    goog.string.toTitleCase('one_two_three')  => 'One_two_three'
***REMOVED***    goog.string.toTitleCase('one-two-three')  => 'One-two-three'
***REMOVED***
***REMOVED*** Custom delimiter => "_-.":
***REMOVED***    goog.string.toTitleCase('oneTwoThree', '_-.')       => 'OneTwoThree'
***REMOVED***    goog.string.toTitleCase('one two three', '_-.')     => 'One two three'
***REMOVED***    goog.string.toTitleCase('  one   two   ', '_-.')    => '  one   two   '
***REMOVED***    goog.string.toTitleCase('one_two_three', '_-.')     => 'One_Two_Three'
***REMOVED***    goog.string.toTitleCase('one-two-three', '_-.')     => 'One-Two-Three'
***REMOVED***    goog.string.toTitleCase('one...two...three', '_-.') => 'One...Two...Three'
***REMOVED***    goog.string.toTitleCase('one. two. three', '_-.')   => 'One. two. three'
***REMOVED***    goog.string.toTitleCase('one-two.three', '_-.')     => 'One-Two.Three'
***REMOVED***
***REMOVED*** @param {string} str String value in camelCase form.
***REMOVED*** @param {string=} opt_delimiters Custom delimiter character set used to
***REMOVED***      distinguish words in the string value. Each character represents a
***REMOVED***      single delimiter. When provided, default whitespace delimiter is
***REMOVED***      overridden and must be explicitly included if needed.
***REMOVED*** @return {string} String value in TitleCase form.
***REMOVED***
goog.string.toTitleCase = function(str, opt_delimiters) {
  var delimiters = goog.isString(opt_delimiters) ?
      goog.string.regExpEscape(opt_delimiters) : '\\s';

  // For IE8, we need to prevent using an empty character set. Otherwise,
  // incorrect matching will occur.
  delimiters = delimiters ? '|[' + delimiters + ']+' : '';

  var regexp = new RegExp('(^' + delimiters + ')([a-z])', 'g');
  return str.replace(regexp, function(all, p1, p2) {
    return p1 + p2.toUpperCase();
  });
***REMOVED***


***REMOVED***
***REMOVED*** Parse a string in decimal or hexidecimal ('0xFFFF') form.
***REMOVED***
***REMOVED*** To parse a particular radix, please use parseInt(string, radix) directly. See
***REMOVED*** https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/parseInt
***REMOVED***
***REMOVED*** This is a wrapper for the built-in parseInt function that will only parse
***REMOVED*** numbers as base 10 or base 16.  Some JS implementations assume strings
***REMOVED*** starting with "0" are intended to be octal. ES3 allowed but discouraged
***REMOVED*** this behavior. ES5 forbids it.  This function emulates the ES5 behavior.
***REMOVED***
***REMOVED*** For more information, see Mozilla JS Reference: http://goo.gl/8RiFj
***REMOVED***
***REMOVED*** @param {string|number|null|undefined} value The value to be parsed.
***REMOVED*** @return {number} The number, parsed. If the string failed to parse, this
***REMOVED***     will be NaN.
***REMOVED***
goog.string.parseInt = function(value) {
  // Force finite numbers to strings.
  if (isFinite(value)) {
    value = String(value);
  }

  if (goog.isString(value)) {
    // If the string starts with '0x' or '-0x', parse as hex.
    return /^\s*-?0x/i.test(value) ?
        parseInt(value, 16) : parseInt(value, 10);
  }

  return NaN;
***REMOVED***
