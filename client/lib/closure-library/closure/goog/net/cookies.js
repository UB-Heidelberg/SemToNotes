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
***REMOVED*** @fileoverview Functions for setting, getting and deleting cookies.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED***


goog.provide('goog.net.Cookies');
goog.provide('goog.net.cookies');



***REMOVED***
***REMOVED*** A class for handling browser cookies.
***REMOVED*** @param {Document} context The context document to get/set cookies on.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.net.Cookies = function(context) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The context document to get/set cookies on
  ***REMOVED*** @type {Document}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.document_ = context;
***REMOVED***


***REMOVED***
***REMOVED*** Static constant for the size of cookies. Per the spec, there's a 4K limit
***REMOVED*** to the size of a cookie. To make sure users can't break this limit, we
***REMOVED*** should truncate long cookies at 3950 bytes, to be extra careful with dumb
***REMOVED*** browsers/proxies that interpret 4K as 4000 rather than 4096.
***REMOVED*** @type {number}
***REMOVED***
goog.net.Cookies.MAX_COOKIE_LENGTH = 3950;


***REMOVED***
***REMOVED*** RegExp used to split the cookies string.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.net.Cookies.SPLIT_RE_ = /\s*;\s*/;


***REMOVED***
***REMOVED*** Returns true if cookies are enabled.
***REMOVED*** @return {boolean} True if cookies are enabled.
***REMOVED***
goog.net.Cookies.prototype.isEnabled = function() {
  return navigator.cookieEnabled;
***REMOVED***


***REMOVED***
***REMOVED*** We do not allow '=', ';', or white space in the name.
***REMOVED***
***REMOVED*** NOTE: The following are allowed by this method, but should be avoided for
***REMOVED*** cookies handled by the server.
***REMOVED*** - any name starting with '$'
***REMOVED*** - 'Comment'
***REMOVED*** - 'Domain'
***REMOVED*** - 'Expires'
***REMOVED*** - 'Max-Age'
***REMOVED*** - 'Path'
***REMOVED*** - 'Secure'
***REMOVED*** - 'Version'
***REMOVED***
***REMOVED*** @param {string} name Cookie name.
***REMOVED*** @return {boolean} Whether name is valid.
***REMOVED***
***REMOVED*** @see <a href="http://tools.ietf.org/html/rfc2109">RFC 2109</a>
***REMOVED*** @see <a href="http://tools.ietf.org/html/rfc2965">RFC 2965</a>
***REMOVED***
goog.net.Cookies.prototype.isValidName = function(name) {
  return !(/[;=\s]/.test(name));
***REMOVED***


***REMOVED***
***REMOVED*** We do not allow ';' or line break in the value.
***REMOVED***
***REMOVED*** Spec does not mention any illegal characters, but in practice semi-colons
***REMOVED*** break parsing and line breaks truncate the name.
***REMOVED***
***REMOVED*** @param {string} value Cookie value.
***REMOVED*** @return {boolean} Whether value is valid.
***REMOVED***
***REMOVED*** @see <a href="http://tools.ietf.org/html/rfc2109">RFC 2109</a>
***REMOVED*** @see <a href="http://tools.ietf.org/html/rfc2965">RFC 2965</a>
***REMOVED***
goog.net.Cookies.prototype.isValidValue = function(value) {
  return !(/[;\r\n]/.test(value));
***REMOVED***


***REMOVED***
***REMOVED*** Sets a cookie.  The max_age can be -1 to set a session cookie. To remove and
***REMOVED*** expire cookies, use remove() instead.
***REMOVED***
***REMOVED*** Neither the {@code name} nor the {@code value} are encoded in any way. It is
***REMOVED*** up to the callers of {@code get} and {@code set} (as well as all the other
***REMOVED*** methods) to handle any possible encoding and decoding.
***REMOVED***
***REMOVED*** @throws {!Error} If the {@code name} fails #goog.net.cookies.isValidName.
***REMOVED*** @throws {!Error} If the {@code value} fails #goog.net.cookies.isValidValue.
***REMOVED***
***REMOVED*** @param {string} name  The cookie name.
***REMOVED*** @param {string} value  The cookie value.
***REMOVED*** @param {number=} opt_maxAge  The max age in seconds (from now). Use -1 to
***REMOVED***     set a session cookie. If not provided, the default is -1
***REMOVED***     (i.e. set a session cookie).
***REMOVED*** @param {?string=} opt_path  The path of the cookie. If not present then this
***REMOVED***     uses the full request path.
***REMOVED*** @param {?string=} opt_domain  The domain of the cookie, or null to not
***REMOVED***     specify a domain attribute (browser will use the full request host name).
***REMOVED***     If not provided, the default is null (i.e. let browser use full request
***REMOVED***     host name).
***REMOVED*** @param {boolean=} opt_secure Whether the cookie should only be sent over
***REMOVED***     a secure channel.
***REMOVED***
goog.net.Cookies.prototype.set = function(
    name, value, opt_maxAge, opt_path, opt_domain, opt_secure) {
  if (!this.isValidName(name)) {
    throw Error('Invalid cookie name "' + name + '"');
  }
  if (!this.isValidValue(value)) {
    throw Error('Invalid cookie value "' + value + '"');
  }

  if (!goog.isDef(opt_maxAge)) {
    opt_maxAge = -1;
  }

  var domainStr = opt_domain ? ';domain=' + opt_domain : '';
  var pathStr = opt_path ? ';path=' + opt_path : '';
  var secureStr = opt_secure ? ';secure' : '';

  var expiresStr;

  // Case 1: Set a session cookie.
  if (opt_maxAge < 0) {
    expiresStr = '';

  // Case 2: Remove the cookie.
  // Note: We don't tell people about this option in the function doc because
  // we prefer people to use remove() to remove cookies.
  } else if (opt_maxAge == 0) {
    // Note: Don't use Jan 1, 1970 for date because NS 4.76 will try to convert
    // it to local time, and if the local time is before Jan 1, 1970, then the
    // browser will ignore the Expires attribute altogether.
    var pastDate = new Date(1970, 1 /*Feb*/, 1);  // Feb 1, 1970
    expiresStr = ';expires=' + pastDate.toUTCString();

  // Case 3: Set a persistent cookie.
  } else {
    var futureDate = new Date(goog.now() + opt_maxAge***REMOVED*** 1000);
    expiresStr = ';expires=' + futureDate.toUTCString();
  }

  this.setCookie_(name + '=' + value + domainStr + pathStr +
                  expiresStr + secureStr);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value for the first cookie with the given name.
***REMOVED*** @param {string} name  The name of the cookie to get.
***REMOVED*** @param {string=} opt_default  If not found this is returned instead.
***REMOVED*** @return {string|undefined}  The value of the cookie. If no cookie is set this
***REMOVED***     returns opt_default or undefined if opt_default is not provided.
***REMOVED***
goog.net.Cookies.prototype.get = function(name, opt_default) {
  var nameEq = name + '=';
  var parts = this.getParts_();
  for (var i = 0, part; part = parts[i]; i++) {
    // startsWith
    if (part.lastIndexOf(nameEq, 0) == 0) {
      return part.substr(nameEq.length);
    }
    if (part == name) {
      return '';
    }
  }
  return opt_default;
***REMOVED***


***REMOVED***
***REMOVED*** Removes and expires a cookie.
***REMOVED*** @param {string} name  The cookie name.
***REMOVED*** @param {string=} opt_path  The path of the cookie, or null to expire a cookie
***REMOVED***     set at the full request path. If not provided, the default is '/'
***REMOVED***     (i.e. path=/).
***REMOVED*** @param {string=} opt_domain  The domain of the cookie, or null to expire a
***REMOVED***     cookie set at the full request host name. If not provided, the default is
***REMOVED***     null (i.e. cookie at full request host name).
***REMOVED*** @return {boolean} Whether the cookie existed before it was removed.
***REMOVED***
goog.net.Cookies.prototype.remove = function(name, opt_path, opt_domain) {
  var rv = this.containsKey(name);
  this.set(name, '', 0, opt_path, opt_domain);
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the names for all the cookies.
***REMOVED*** @return {Array.<string>} An array with the names of the cookies.
***REMOVED***
goog.net.Cookies.prototype.getKeys = function() {
  return this.getKeyValues_().keys;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the values for all the cookies.
***REMOVED*** @return {Array.<string>} An array with the values of the cookies.
***REMOVED***
goog.net.Cookies.prototype.getValues = function() {
  return this.getKeyValues_().values;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether there are any cookies for this document.
***REMOVED***
goog.net.Cookies.prototype.isEmpty = function() {
  return !this.getCookie_();
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of cookies for this document.
***REMOVED***
goog.net.Cookies.prototype.getCount = function() {
  var cookie = this.getCookie_();
  if (!cookie) {
    return 0;
  }
  return this.getParts_().length;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether there is a cookie with the given name.
***REMOVED*** @param {string} key The name of the cookie to test for.
***REMOVED*** @return {boolean} Whether there is a cookie by that name.
***REMOVED***
goog.net.Cookies.prototype.containsKey = function(key) {
  // substring will return empty string if the key is not found, so the get
  // function will only return undefined
  return goog.isDef(this.get(key));
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether there is a cookie with the given value. (This is an O(n)
***REMOVED*** operation.)
***REMOVED*** @param {string} value  The value to check for.
***REMOVED*** @return {boolean} Whether there is a cookie with that value.
***REMOVED***
goog.net.Cookies.prototype.containsValue = function(value) {
  // this O(n) in any case so lets do the trivial thing.
  var values = this.getKeyValues_().values;
  for (var i = 0; i < values.length; i++) {
    if (values[i] == value) {
      return true;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Removes all cookies for this document.  Note that this will only remove
***REMOVED*** cookies from the current path and domain.  If there are cookies set using a
***REMOVED*** subpath and/or another domain these will still be there.
***REMOVED***
goog.net.Cookies.prototype.clear = function() {
  var keys = this.getKeyValues_().keys;
  for (var i = keys.length - 1; i >= 0; i--) {
    this.remove(keys[i]);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Private helper function to allow testing cookies without depending on the
***REMOVED*** browser.
***REMOVED*** @param {string} s The cookie string to set.
***REMOVED*** @private
***REMOVED***
goog.net.Cookies.prototype.setCookie_ = function(s) {
  this.document_.cookie = s;
***REMOVED***


***REMOVED***
***REMOVED*** Private helper function to allow testing cookies without depending on the
***REMOVED*** browser. IE6 can return null here.
***REMOVED*** @return {string} Returns the {@code document.cookie}.
***REMOVED*** @private
***REMOVED***
goog.net.Cookies.prototype.getCookie_ = function() {
  return this.document_.cookie;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Array.<string>} The cookie split on semi colons.
***REMOVED*** @private
***REMOVED***
goog.net.Cookies.prototype.getParts_ = function() {
  return (this.getCookie_() || '').
      split(goog.net.Cookies.SPLIT_RE_);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the names and values for all the cookies.
***REMOVED*** @return {!Object} An object with keys and values.
***REMOVED*** @private
***REMOVED***
goog.net.Cookies.prototype.getKeyValues_ = function() {
  var parts = this.getParts_();
  var keys = [], values = [], index, part;
  for (var i = 0; part = parts[i]; i++) {
    index = part.indexOf('=');

    if (index == -1) { // empty name
      keys.push('');
      values.push(part);
    } else {
      keys.push(part.substring(0, index));
      values.push(part.substring(index + 1));
    }
  }
  return {keys: keys, values: values***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** A static default instance.
***REMOVED*** @type {goog.net.Cookies}
***REMOVED***
goog.net.cookies = new goog.net.Cookies(document);


***REMOVED***
***REMOVED*** Define the constant on the instance in order not to break many references to
***REMOVED*** it.
***REMOVED*** @type {number}
***REMOVED*** @deprecated Use goog.net.Cookies.MAX_COOKIE_LENGTH instead.
***REMOVED***
goog.net.cookies.MAX_COOKIE_LENGTH = goog.net.Cookies.MAX_COOKIE_LENGTH;
