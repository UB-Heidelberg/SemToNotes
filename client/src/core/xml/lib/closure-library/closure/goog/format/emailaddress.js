// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Provides functions to parse and manipulate email addresses.
***REMOVED***
***REMOVED***

goog.provide('goog.format.EmailAddress');

goog.require('goog.string');



***REMOVED***
***REMOVED*** Formats an email address string for display, and allows for extraction of
***REMOVED*** The individual componants of the address.
***REMOVED*** @param {string=} opt_address The email address.
***REMOVED*** @param {string=} opt_name The name associated with the email address.
***REMOVED***
***REMOVED***
goog.format.EmailAddress = function(opt_address, opt_name) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The name or personal string associated with the address.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.name_ = opt_name || '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** The email address.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.address_ = opt_address || '';
***REMOVED***


***REMOVED***
***REMOVED*** Match string for opening tokens.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.format.EmailAddress.OPENERS_ = '"<([';


***REMOVED***
***REMOVED*** Match string for closing tokens.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.format.EmailAddress.CLOSERS_ = '">)]';


***REMOVED***
***REMOVED*** A RegExp to check special characters to be quoted.  Used in cleanAddress().
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.format.EmailAddress.SPECIAL_CHARS_RE_ = /[()<>@,;:\\\".\[\]]/;


***REMOVED***
***REMOVED*** A RegExp to match all double quotes.  Used in cleanAddress().
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.format.EmailAddress.ALL_DOUBLE_QUOTES_ = /\"/g;


***REMOVED***
***REMOVED*** A RegExp to match escaped double quotes.  Used in parse().
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.format.EmailAddress.ESCAPED_DOUBLE_QUOTES_ = /\\\"/g;


***REMOVED***
***REMOVED*** A RegExp to match all backslashes.  Used in cleanAddress().
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.format.EmailAddress.ALL_BACKSLASHES_ = /\\/g;


***REMOVED***
***REMOVED*** A RegExp to match escaped backslashes.  Used in parse().
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.format.EmailAddress.ESCAPED_BACKSLASHES_ = /\\\\/g;


***REMOVED***
***REMOVED*** Get the name associated with the email address.
***REMOVED*** @return {string} The name or personal portion of the address.
***REMOVED***
goog.format.EmailAddress.prototype.getName = function() {
  return this.name_;
***REMOVED***


***REMOVED***
***REMOVED*** Get the email address.
***REMOVED*** @return {string} The email address.
***REMOVED***
goog.format.EmailAddress.prototype.getAddress = function() {
  return this.address_;
***REMOVED***


***REMOVED***
***REMOVED*** Set the name associated with the email address.
***REMOVED*** @param {string} name The name to associate.
***REMOVED***
goog.format.EmailAddress.prototype.setName = function(name) {
  this.name_ = name;
***REMOVED***


***REMOVED***
***REMOVED*** Set the email address.
***REMOVED*** @param {string} address The email address.
***REMOVED***
goog.format.EmailAddress.prototype.setAddress = function(address) {
  this.address_ = address;
***REMOVED***


***REMOVED***
***REMOVED*** Return the address in a standard format:
***REMOVED***  - remove extra spaces.
***REMOVED***  - Surround name with quotes if it contains special characters.
***REMOVED*** @return {string} The cleaned address.
***REMOVED*** @override
***REMOVED***
goog.format.EmailAddress.prototype.toString = function() {
  var name = this.getName();

  // We intentionally remove double quotes in the name because escaping
  // them to \" looks ugly.
  name = name.replace(goog.format.EmailAddress.ALL_DOUBLE_QUOTES_, '');

  // If the name has special characters, we need to quote it and escape \'s.
  var quoteNeeded = goog.format.EmailAddress.SPECIAL_CHARS_RE_.test(name);
  if (quoteNeeded) {
    name = '"' +
        name.replace(goog.format.EmailAddress.ALL_BACKSLASHES_, '\\\\') + '"';
  }

  if (name == '') {
    return this.address_;
  }
  if (this.address_ == '') {
    return name;
  }
  return name + ' <' + this.address_ + '>';
***REMOVED***


***REMOVED***
***REMOVED*** Determines is the current object is a valid email address.
***REMOVED*** @return {boolean} Whether the email address is valid.
***REMOVED***
goog.format.EmailAddress.prototype.isValid = function() {
  return goog.format.EmailAddress.isValidAddrSpec(this.address_);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the provided string is a valid email address. Supports both
***REMOVED*** simple email addresses (address specs) and addresses that contain display
***REMOVED*** names.
***REMOVED*** @param {string} str The email address to check.
***REMOVED*** @return {boolean} Whether the provided string is a valid address.
***REMOVED***
goog.format.EmailAddress.isValidAddress = function(str) {
  return goog.format.EmailAddress.parse(str).isValid();
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the provided string is a valid address spec (local@domain.com).
***REMOVED*** @param {string} str The email address to check.
***REMOVED*** @return {boolean} Whether the provided string is a valid address spec.
***REMOVED***
goog.format.EmailAddress.isValidAddrSpec = function(str) {
  // This is a fairly naive implementation, but it covers 99% of use cases.
  // For more details, see http://en.wikipedia.org/wiki/Email_address#Syntax
  // TODO(mariakhomenko): we should also be handling i18n domain names as per
  // http://en.wikipedia.org/wiki/Internationalized_domain_name
  var filter =
      /^[+a-zA-Z0-9_.!#$%&'*\/=?^`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,6}$/;
  return filter.test(str);
***REMOVED***


***REMOVED***
***REMOVED*** Parse an email address of the form "name" &lt;address&gt; into
***REMOVED*** an email address.
***REMOVED*** @param {string} addr The address string.
***REMOVED*** @return {goog.format.EmailAddress} The parsed address.
***REMOVED***
goog.format.EmailAddress.parse = function(addr) {
  // TODO(ecattell): Strip bidi markers.
  var name = '';
  var address = '';
  for (var i = 0; i < addr.length;) {
    var token = goog.format.EmailAddress.getToken_(addr, i);
    if (token.charAt(0) == '<' && token.indexOf('>') != -1) {
      var end = token.indexOf('>');
      address = token.substring(1, end);
    } else if (address == '') {
      name += token;
    }
    i += token.length;
  }

  // Check if it's a simple email address of the form "jlim@google.com".
  if (address == '' && name.indexOf('@') != -1) {
    address = name;
    name = '';
  }

  name = goog.string.collapseWhitespace(name);
  name = goog.string.stripQuotes(name, '\'');
  name = goog.string.stripQuotes(name, '"');
  // Replace escaped quotes and slashes.
  name = name.replace(goog.format.EmailAddress.ESCAPED_DOUBLE_QUOTES_, '"');
  name = name.replace(goog.format.EmailAddress.ESCAPED_BACKSLASHES_, '\\');
  address = goog.string.collapseWhitespace(address);
  return new goog.format.EmailAddress(address, name);
***REMOVED***


***REMOVED***
***REMOVED*** Parse a string containing email addresses of the form
***REMOVED*** "name" &lt;address&gt; into an array of email addresses.
***REMOVED*** @param {string} str The address list.
***REMOVED*** @return {Array.<goog.format.EmailAddress>} The parsed emails.
***REMOVED***
goog.format.EmailAddress.parseList = function(str) {
  var result = [];
  var email = '';
  var token;

  for (var i = 0; i < str.length; ) {
    token = goog.format.EmailAddress.getToken_(str, i);
    if (token == ',' || token == ';' ||
        (token == ' ' && goog.format.EmailAddress.parse(email).isValid())) {
      if (!goog.string.isEmpty(email)) {
        result.push(goog.format.EmailAddress.parse(email));
      }
      email = '';
      i++;
      continue;
    }
    email += token;
    i += token.length;
  }

  // Add the final token.
  if (!goog.string.isEmpty(email)) {
    result.push(goog.format.EmailAddress.parse(email));
  }
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Get the next token from a position in an address string.
***REMOVED*** @param {string} str the string.
***REMOVED*** @param {number} pos the position.
***REMOVED*** @return {string} the token.
***REMOVED*** @private
***REMOVED***
goog.format.EmailAddress.getToken_ = function(str, pos) {
  var ch = str.charAt(pos);
  var p = goog.format.EmailAddress.OPENERS_.indexOf(ch);
  if (p == -1) {
    return ch;
  }
  if (goog.format.EmailAddress.isEscapedDlQuote_(str, pos)) {

    // If an opener is an escaped quote we do not treat it as a real opener
    // and keep accumulating the token.
    return ch;
  }
  var closerChar = goog.format.EmailAddress.CLOSERS_.charAt(p);
  var endPos = str.indexOf(closerChar, pos + 1);

  // If the closer is a quote we go forward skipping escaped quotes until we
  // hit the real closing one.
  while (endPos >= 0 &&
         goog.format.EmailAddress.isEscapedDlQuote_(str, endPos)) {
    endPos = str.indexOf(closerChar, endPos + 1);
  }
  var token = (endPos >= 0) ? str.substring(pos, endPos + 1) : ch;
  return token;
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the character in the current position is an escaped double quote
***REMOVED*** ( \" ).
***REMOVED*** @param {string} str the string.
***REMOVED*** @param {number} pos the position.
***REMOVED*** @return {boolean} true if the char is escaped double quote.
***REMOVED*** @private
***REMOVED***
goog.format.EmailAddress.isEscapedDlQuote_ = function(str, pos) {
  if (str.charAt(pos) != '"') {
    return false;
  }
  var slashCount = 0;
  for (var idx = pos - 1; idx >= 0 && str.charAt(idx) == '\\'; idx--) {
    slashCount++;
  }
  return ((slashCount % 2) != 0);
***REMOVED***
