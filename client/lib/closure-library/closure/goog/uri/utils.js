// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Simple utilities for dealing with URI strings.
***REMOVED***
***REMOVED*** This is intended to be a lightweight alternative to constructing goog.Uri
***REMOVED*** objects.  Whereas goog.Uri adds several kilobytes to the binary regardless
***REMOVED*** of how much of its functionality you use, this is designed to be a set of
***REMOVED*** mostly-independent utilities so that the compiler includes only what is
***REMOVED*** necessary for the task.  Estimated savings of porting is 5k pre-gzip and
***REMOVED*** 1.5k post-gzip.  To ensure the savings remain, future developers should
***REMOVED*** avoid adding new functionality to existing functions, but instead create
***REMOVED*** new ones and factor out shared code.
***REMOVED***
***REMOVED*** Many of these utilities have limited functionality, tailored to common
***REMOVED*** cases.  The query parameter utilities assume that the parameter keys are
***REMOVED*** already encoded, since most keys are compile-time alphanumeric strings.  The
***REMOVED*** query parameter mutation utilities also do not tolerate fragment identifiers.
***REMOVED***
***REMOVED*** By design, these functions can be slower than goog.Uri equivalents.
***REMOVED*** Repeated calls to some of functions may be quadratic in behavior for IE,
***REMOVED*** although the effect is somewhat limited given the 2kb limit.
***REMOVED***
***REMOVED*** One advantage of the limited functionality here is that this approach is
***REMOVED*** less sensitive to differences in URI encodings than goog.Uri, since these
***REMOVED*** functions modify the strings in place, rather than decoding and
***REMOVED*** re-encoding.
***REMOVED***
***REMOVED*** Uses features of RFC 3986 for parsing/formatting URIs:
***REMOVED***   http://www.ietf.org/rfc/rfc3986.txt
***REMOVED***
***REMOVED*** @author gboyer@google.com (Garrett Boyer) - The "lightened" design.
***REMOVED*** @author msamuel@google.com (Mike Samuel) - Domain knowledge and regexes.
***REMOVED***

goog.provide('goog.uri.utils');
goog.provide('goog.uri.utils.ComponentIndex');
goog.provide('goog.uri.utils.QueryArray');
goog.provide('goog.uri.utils.QueryValue');
goog.provide('goog.uri.utils.StandardQueryParam');

goog.require('goog.asserts');
goog.require('goog.string');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Character codes inlined to avoid object allocations due to charCode.
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.uri.utils.CharCode_ = {
  AMPERSAND: 38,
  EQUAL: 61,
  HASH: 35,
  QUESTION: 63
***REMOVED***


***REMOVED***
***REMOVED*** Builds a URI string from already-encoded parts.
***REMOVED***
***REMOVED*** No encoding is performed.  Any component may be omitted as either null or
***REMOVED*** undefined.
***REMOVED***
***REMOVED*** @param {?string=} opt_scheme The scheme such as 'http'.
***REMOVED*** @param {?string=} opt_userInfo The user name before the '@'.
***REMOVED*** @param {?string=} opt_domain The domain such as 'www.google.com', already
***REMOVED***     URI-encoded.
***REMOVED*** @param {(string|number|null)=} opt_port The port number.
***REMOVED*** @param {?string=} opt_path The path, already URI-encoded.  If it is not
***REMOVED***     empty, it must begin with a slash.
***REMOVED*** @param {?string=} opt_queryData The URI-encoded query data.
***REMOVED*** @param {?string=} opt_fragment The URI-encoded fragment identifier.
***REMOVED*** @return {string} The fully combined URI.
***REMOVED***
goog.uri.utils.buildFromEncodedParts = function(opt_scheme, opt_userInfo,
    opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
  var out = '';

  if (opt_scheme) {
    out += opt_scheme + ':';
  }

  if (opt_domain) {
    out += '//';

    if (opt_userInfo) {
      out += opt_userInfo + '@';
    }

    out += opt_domain;

    if (opt_port) {
      out += ':' + opt_port;
    }
  }

  if (opt_path) {
    out += opt_path;
  }

  if (opt_queryData) {
    out += '?' + opt_queryData;
  }

  if (opt_fragment) {
    out += '#' + opt_fragment;
  }

  return out;
***REMOVED***


***REMOVED***
***REMOVED*** A regular expression for breaking a URI into its component parts.
***REMOVED***
***REMOVED*** {@link http://www.ietf.org/rfc/rfc3986.txt} says in Appendix B
***REMOVED*** As the "first-match-wins" algorithm is identical to the "greedy"
***REMOVED*** disambiguation method used by POSIX regular expressions, it is natural and
***REMOVED*** commonplace to use a regular expression for parsing the potential five
***REMOVED*** components of a URI reference.
***REMOVED***
***REMOVED*** The following line is the regular expression for breaking-down a
***REMOVED*** well-formed URI reference into its components.
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** ^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?
***REMOVED***  12            3  4          5       6  7        8 9
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** The numbers in the second line above are only to assist readability; they
***REMOVED*** indicate the reference points for each subexpression (i.e., each paired
***REMOVED*** parenthesis). We refer to the value matched for subexpression <n> as $<n>.
***REMOVED*** For example, matching the above expression to
***REMOVED*** <pre>
***REMOVED***     http://www.ics.uci.edu/pub/ietf/uri/#Related
***REMOVED*** </pre>
***REMOVED*** results in the following subexpression matches:
***REMOVED*** <pre>
***REMOVED***    $1 = http:
***REMOVED***    $2 = http
***REMOVED***    $3 = //www.ics.uci.edu
***REMOVED***    $4 = www.ics.uci.edu
***REMOVED***    $5 = /pub/ietf/uri/
***REMOVED***    $6 = <undefined>
***REMOVED***    $7 = <undefined>
***REMOVED***    $8 = #Related
***REMOVED***    $9 = Related
***REMOVED*** </pre>
***REMOVED*** where <undefined> indicates that the component is not present, as is the
***REMOVED*** case for the query component in the above example. Therefore, we can
***REMOVED*** determine the value of the five components as
***REMOVED*** <pre>
***REMOVED***    scheme    = $2
***REMOVED***    authority = $4
***REMOVED***    path      = $5
***REMOVED***    query     = $7
***REMOVED***    fragment  = $9
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** The regular expression has been modified slightly to expose the
***REMOVED*** userInfo, domain, and port separately from the authority.
***REMOVED*** The modified version yields
***REMOVED*** <pre>
***REMOVED***    $1 = http              scheme
***REMOVED***    $2 = <undefined>       userInfo -\
***REMOVED***    $3 = www.ics.uci.edu   domain     | authority
***REMOVED***    $4 = <undefined>       port     -/
***REMOVED***    $5 = /pub/ietf/uri/    path
***REMOVED***    $6 = <undefined>       query without ?
***REMOVED***    $7 = Related           fragment without #
***REMOVED*** </pre>
***REMOVED*** @type {!RegExp}
***REMOVED*** @private
***REMOVED***
goog.uri.utils.splitRe_ = new RegExp(
    '^' +
    '(?:' +
        '([^:/?#.]+)' +                  // scheme - ignore special characters
                                         // used by other URL parts such as :,
                                         // ?, /, #, and .
    ':)?' +
    '(?://' +
        '(?:([^/?#]*)@)?' +              // userInfo
        '([^/#?]*?)' +                   // domain
        '(?::([0-9]+))?' +               // port
        '(?=[/#?]|$)' +                  // authority-terminating character
    ')?' +
    '([^?#]+)?' +                        // path
    '(?:\\?([^#]*))?' +                  // query
    '(?:#(.*))?' +                       // fragment
    '$');


***REMOVED***
***REMOVED*** The index of each URI component in the return value of goog.uri.utils.split.
***REMOVED*** @enum {number}
***REMOVED***
goog.uri.utils.ComponentIndex = {
  SCHEME: 1,
  USER_INFO: 2,
  DOMAIN: 3,
  PORT: 4,
  PATH: 5,
  QUERY_DATA: 6,
  FRAGMENT: 7
***REMOVED***


***REMOVED***
***REMOVED*** Splits a URI into its component parts.
***REMOVED***
***REMOVED*** Each component can be accessed via the component indices; for example:
***REMOVED*** <pre>
***REMOVED*** goog.uri.utils.split(someStr)[goog.uri.utils.CompontentIndex.QUERY_DATA];
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {string} uri The URI string to examine.
***REMOVED*** @return {!Array.<string|undefined>} Each component still URI-encoded.
***REMOVED***     Each component that is present will contain the encoded value, whereas
***REMOVED***     components that are not present will be undefined or empty, depending
***REMOVED***     on the browser's regular expression implementation.  Never null, since
***REMOVED***     arbitrary strings may still look like path names.
***REMOVED***
goog.uri.utils.split = function(uri) {
  goog.uri.utils.phishingProtection_();

  // See @return comment -- never null.
  return***REMOVED*****REMOVED*** @type {!Array.<string|undefined>}***REMOVED*** (
      uri.match(goog.uri.utils.splitRe_));
***REMOVED***


***REMOVED***
***REMOVED*** Safari has a nasty bug where if you have an http URL with a username, e.g.,
***REMOVED*** http://evil.com%2F@google.com/
***REMOVED*** Safari will report that window.location.href is
***REMOVED*** http://evil.com/google.com/
***REMOVED*** so that anyone who tries to parse the domain of that URL will get
***REMOVED*** the wrong domain. We've seen exploits where people use this to trick
***REMOVED*** Safari into loading resources from evil domains.
***REMOVED***
***REMOVED*** To work around this, we run a little "Safari phishing check", and throw
***REMOVED*** an exception if we see this happening.
***REMOVED***
***REMOVED*** There is no convenient place to put this check. We apply it to
***REMOVED*** anyone doing URI parsing on Webkit. We're not happy about this, but
***REMOVED*** it fixes the problem.
***REMOVED***
***REMOVED*** This should be removed once Safari fixes their bug.
***REMOVED***
***REMOVED*** Exploit reported by Masato Kinugawa.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.uri.utils.needsPhishingProtection_ = goog.userAgent.WEBKIT;


***REMOVED***
***REMOVED*** Check to see if the user is being phished.
***REMOVED*** @private
***REMOVED***
goog.uri.utils.phishingProtection_ = function() {
  if (goog.uri.utils.needsPhishingProtection_) {
    // Turn protection off, so that we don't recurse.
    goog.uri.utils.needsPhishingProtection_ = false;

    // Use quoted access, just in case the user isn't using location externs.
    var location = goog.global['location'];
    if (location) {
      var href = location['href'];
      if (href) {
        var domain = goog.uri.utils.getDomain(href);
        if (domain && domain != location['hostname']) {
          // Phishing attack
          goog.uri.utils.needsPhishingProtection_ = true;
          throw Error();
        }
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @param {?string} uri A possibly null string.
***REMOVED*** @return {?string} The string URI-decoded, or null if uri is null.
***REMOVED*** @private
***REMOVED***
goog.uri.utils.decodeIfPossible_ = function(uri) {
  return uri && decodeURIComponent(uri);
***REMOVED***


***REMOVED***
***REMOVED*** Gets a URI component by index.
***REMOVED***
***REMOVED*** It is preferred to use the getPathEncoded() variety of functions ahead,
***REMOVED*** since they are more readable.
***REMOVED***
***REMOVED*** @param {goog.uri.utils.ComponentIndex} componentIndex The component index.
***REMOVED*** @param {string} uri The URI to examine.
***REMOVED*** @return {?string} The still-encoded component, or null if the component
***REMOVED***     is not present.
***REMOVED*** @private
***REMOVED***
goog.uri.utils.getComponentByIndex_ = function(componentIndex, uri) {
  // Convert undefined, null, and empty string into null.
  return goog.uri.utils.split(uri)[componentIndex] || null;
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} uri The URI to examine.
***REMOVED*** @return {?string} The protocol or scheme, or null if none.  Does not
***REMOVED***     include trailing colons or slashes.
***REMOVED***
goog.uri.utils.getScheme = function(uri) {
  return goog.uri.utils.getComponentByIndex_(
      goog.uri.utils.ComponentIndex.SCHEME, uri);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the effective scheme for the URL.  If the URL is relative then the
***REMOVED*** scheme is derived from the page's location.
***REMOVED*** @param {string} uri The URI to examine.
***REMOVED*** @return {string} The protocol or scheme, always lower case.
***REMOVED***
goog.uri.utils.getEffectiveScheme = function(uri) {
  var scheme = goog.uri.utils.getScheme(uri);
  if (!scheme && self.location) {
    var protocol = self.location.protocol;
    scheme = protocol.substr(0, protocol.length - 1);
  }
  // NOTE: When called from a web worker in Firefox 3.5, location maybe null.
  // All other browsers with web workers support self.location from the worker.
  return scheme ? scheme.toLowerCase() : '';
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} uri The URI to examine.
***REMOVED*** @return {?string} The user name still encoded, or null if none.
***REMOVED***
goog.uri.utils.getUserInfoEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(
      goog.uri.utils.ComponentIndex.USER_INFO, uri);
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} uri The URI to examine.
***REMOVED*** @return {?string} The decoded user info, or null if none.
***REMOVED***
goog.uri.utils.getUserInfo = function(uri) {
  return goog.uri.utils.decodeIfPossible_(
      goog.uri.utils.getUserInfoEncoded(uri));
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} uri The URI to examine.
***REMOVED*** @return {?string} The domain name still encoded, or null if none.
***REMOVED***
goog.uri.utils.getDomainEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(
      goog.uri.utils.ComponentIndex.DOMAIN, uri);
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} uri The URI to examine.
***REMOVED*** @return {?string} The decoded domain, or null if none.
***REMOVED***
goog.uri.utils.getDomain = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(uri));
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} uri The URI to examine.
***REMOVED*** @return {?number} The port number, or null if none.
***REMOVED***
goog.uri.utils.getPort = function(uri) {
  // Coerce to a number.  If the result of getComponentByIndex_ is null or
  // non-numeric, the number coersion yields NaN.  This will then return
  // null for all non-numeric cases (though also zero, which isn't a relevant
  // port number).
  return Number(goog.uri.utils.getComponentByIndex_(
      goog.uri.utils.ComponentIndex.PORT, uri)) || null;
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} uri The URI to examine.
***REMOVED*** @return {?string} The path still encoded, or null if none. Includes the
***REMOVED***     leading slash, if any.
***REMOVED***
goog.uri.utils.getPathEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(
      goog.uri.utils.ComponentIndex.PATH, uri);
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} uri The URI to examine.
***REMOVED*** @return {?string} The decoded path, or null if none.  Includes the leading
***REMOVED***     slash, if any.
***REMOVED***
goog.uri.utils.getPath = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(uri));
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} uri The URI to examine.
***REMOVED*** @return {?string} The query data still encoded, or null if none.  Does not
***REMOVED***     include the question mark itself.
***REMOVED***
goog.uri.utils.getQueryData = function(uri) {
  return goog.uri.utils.getComponentByIndex_(
      goog.uri.utils.ComponentIndex.QUERY_DATA, uri);
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} uri The URI to examine.
***REMOVED*** @return {?string} The fragment identifier, or null if none.  Does not
***REMOVED***     include the hash mark itself.
***REMOVED***
goog.uri.utils.getFragmentEncoded = function(uri) {
  // The hash mark may not appear in any other part of the URL.
  var hashIndex = uri.indexOf('#');
  return hashIndex < 0 ? null : uri.substr(hashIndex + 1);
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} uri The URI to examine.
***REMOVED*** @param {?string} fragment The encoded fragment identifier, or null if none.
***REMOVED***     Does not include the hash mark itself.
***REMOVED*** @return {string} The URI with the fragment set.
***REMOVED***
goog.uri.utils.setFragmentEncoded = function(uri, fragment) {
  return goog.uri.utils.removeFragment(uri) + (fragment ? '#' + fragment : '');
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} uri The URI to examine.
***REMOVED*** @return {?string} The decoded fragment identifier, or null if none.  Does
***REMOVED***     not include the hash mark.
***REMOVED***
goog.uri.utils.getFragment = function(uri) {
  return goog.uri.utils.decodeIfPossible_(
      goog.uri.utils.getFragmentEncoded(uri));
***REMOVED***


***REMOVED***
***REMOVED*** Extracts everything up to the port of the URI.
***REMOVED*** @param {string} uri The URI string.
***REMOVED*** @return {string} Everything up to and including the port.
***REMOVED***
goog.uri.utils.getHost = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(
      pieces[goog.uri.utils.ComponentIndex.SCHEME],
      pieces[goog.uri.utils.ComponentIndex.USER_INFO],
      pieces[goog.uri.utils.ComponentIndex.DOMAIN],
      pieces[goog.uri.utils.ComponentIndex.PORT]);
***REMOVED***


***REMOVED***
***REMOVED*** Extracts the path of the URL and everything after.
***REMOVED*** @param {string} uri The URI string.
***REMOVED*** @return {string} The URI, starting at the path and including the query
***REMOVED***     parameters and fragment identifier.
***REMOVED***
goog.uri.utils.getPathAndAfter = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(null, null, null, null,
      pieces[goog.uri.utils.ComponentIndex.PATH],
      pieces[goog.uri.utils.ComponentIndex.QUERY_DATA],
      pieces[goog.uri.utils.ComponentIndex.FRAGMENT]);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the URI with the fragment identifier removed.
***REMOVED*** @param {string} uri The URI to examine.
***REMOVED*** @return {string} Everything preceding the hash mark.
***REMOVED***
goog.uri.utils.removeFragment = function(uri) {
  // The hash mark may not appear in any other part of the URL.
  var hashIndex = uri.indexOf('#');
  return hashIndex < 0 ? uri : uri.substr(0, hashIndex);
***REMOVED***


***REMOVED***
***REMOVED*** Ensures that two URI's have the exact same domain, scheme, and port.
***REMOVED***
***REMOVED*** Unlike the version in goog.Uri, this checks protocol, and therefore is
***REMOVED*** suitable for checking against the browser's same-origin policy.
***REMOVED***
***REMOVED*** @param {string} uri1 The first URI.
***REMOVED*** @param {string} uri2 The second URI.
***REMOVED*** @return {boolean} Whether they have the same domain and port.
***REMOVED***
goog.uri.utils.haveSameDomain = function(uri1, uri2) {
  var pieces1 = goog.uri.utils.split(uri1);
  var pieces2 = goog.uri.utils.split(uri2);
  return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] ==
             pieces2[goog.uri.utils.ComponentIndex.DOMAIN] &&
         pieces1[goog.uri.utils.ComponentIndex.SCHEME] ==
             pieces2[goog.uri.utils.ComponentIndex.SCHEME] &&
         pieces1[goog.uri.utils.ComponentIndex.PORT] ==
             pieces2[goog.uri.utils.ComponentIndex.PORT];
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that there are no fragment or query identifiers, only in uncompiled
***REMOVED*** mode.
***REMOVED*** @param {string} uri The URI to examine.
***REMOVED*** @private
***REMOVED***
goog.uri.utils.assertNoFragmentsOrQueries_ = function(uri) {
  // NOTE: would use goog.asserts here, but jscompiler doesn't know that
  // indexOf has no side effects.
  if (goog.DEBUG && (uri.indexOf('#') >= 0 || uri.indexOf('?') >= 0)) {
    throw Error('goog.uri.utils: Fragment or query identifiers are not ' +
        'supported: [' + uri + ']');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Supported query parameter values by the parameter serializing utilities.
***REMOVED***
***REMOVED*** If a value is null or undefined, the key-value pair is skipped, as an easy
***REMOVED*** way to omit parameters conditionally.  Non-array parameters are converted
***REMOVED*** to a string and URI encoded.  Array values are expanded into multiple
***REMOVED*** &key=value pairs, with each element stringized and URI-encoded.
***REMOVED***
***REMOVED*** @typedef {*}
***REMOVED***
goog.uri.utils.QueryValue;


***REMOVED***
***REMOVED*** An array representing a set of query parameters with alternating keys
***REMOVED*** and values.
***REMOVED***
***REMOVED*** Keys are assumed to be URI encoded already and live at even indices.  See
***REMOVED*** goog.uri.utils.QueryValue for details on how parameter values are encoded.
***REMOVED***
***REMOVED*** Example:
***REMOVED*** <pre>
***REMOVED*** var data = [
***REMOVED***   // Simple param: ?name=BobBarker
***REMOVED***   'name', 'BobBarker',
***REMOVED***   // Conditional param -- may be omitted entirely.
***REMOVED***   'specialDietaryNeeds', hasDietaryNeeds() ? getDietaryNeeds() : null,
***REMOVED***   // Multi-valued param: &house=LosAngeles&house=NewYork&house=null
***REMOVED***   'house', ['LosAngeles', 'NewYork', null]
***REMOVED*** ];
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @typedef {!Array.<string|goog.uri.utils.QueryValue>}
***REMOVED***
goog.uri.utils.QueryArray;


***REMOVED***
***REMOVED*** Appends a URI and query data in a string buffer with special preconditions.
***REMOVED***
***REMOVED*** Internal implementation utility, performing very few object allocations.
***REMOVED***
***REMOVED*** @param {!Array.<string|undefined>} buffer A string buffer.  The first element
***REMOVED***     must be the base URI, and may have a fragment identifier.  If the array
***REMOVED***     contains more than one element, the second element must be an ampersand,
***REMOVED***     and may be overwritten, depending on the base URI.  Undefined elements
***REMOVED***     are treated as empty-string.
***REMOVED*** @return {string} The concatenated URI and query data.
***REMOVED*** @private
***REMOVED***
goog.uri.utils.appendQueryData_ = function(buffer) {
  if (buffer[1]) {
    // At least one query parameter was added.  We need to check the
    // punctuation mark, which is currently an ampersand, and also make sure
    // there aren't any interfering fragment identifiers.
    var baseUri =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (buffer[0]);
    var hashIndex = baseUri.indexOf('#');
    if (hashIndex >= 0) {
      // Move the fragment off the base part of the URI into the end.
      buffer.push(baseUri.substr(hashIndex));
      buffer[0] = baseUri = baseUri.substr(0, hashIndex);
    }
    var questionIndex = baseUri.indexOf('?');
    if (questionIndex < 0) {
      // No question mark, so we need a question mark instead of an ampersand.
      buffer[1] = '?';
    } else if (questionIndex == baseUri.length - 1) {
      // Question mark is the very last character of the existing URI, so don't
      // append an additional delimiter.
      buffer[1] = undefined;
    }
  }

  return buffer.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Appends key=value pairs to an array, supporting multi-valued objects.
***REMOVED*** @param {string} key The key prefix.
***REMOVED*** @param {goog.uri.utils.QueryValue} value The value to serialize.
***REMOVED*** @param {!Array.<string>} pairs The array to which the 'key=value' strings
***REMOVED***     should be appended.
***REMOVED*** @private
***REMOVED***
goog.uri.utils.appendKeyValuePairs_ = function(key, value, pairs) {
  if (goog.isArray(value)) {
    // Convince the compiler it's an array.
    goog.asserts.assertArray(value);
    for (var j = 0; j < value.length; j++) {
      // Convert to string explicitly, to short circuit the null and array
      // logic in this function -- this ensures that null and undefined get
      // written as literal 'null' and 'undefined', and arrays don't get
      // expanded out but instead encoded in the default way.
      goog.uri.utils.appendKeyValuePairs_(key, String(value[j]), pairs);
    }
  } else if (value != null) {
    // Skip a top-level null or undefined entirely.
    pairs.push('&', key,
        // Check for empty string. Zero gets encoded into the url as literal
        // strings.  For empty string, skip the equal sign, to be consistent
        // with UriBuilder.java.
        value === '' ? '' : '=',
        goog.string.urlEncode(value));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Builds a buffer of query data from a sequence of alternating keys and values.
***REMOVED***
***REMOVED*** @param {!Array.<string|undefined>} buffer A string buffer to append to.  The
***REMOVED***     first element appended will be an '&', and may be replaced by the caller.
***REMOVED*** @param {goog.uri.utils.QueryArray|Arguments} keysAndValues An array with
***REMOVED***     alternating keys and values -- see the typedef.
***REMOVED*** @param {number=} opt_startIndex A start offset into the arary, defaults to 0.
***REMOVED*** @return {!Array.<string|undefined>} The buffer argument.
***REMOVED*** @private
***REMOVED***
goog.uri.utils.buildQueryDataBuffer_ = function(
    buffer, keysAndValues, opt_startIndex) {
  goog.asserts.assert(Math.max(keysAndValues.length - (opt_startIndex || 0),
      0) % 2 == 0, 'goog.uri.utils: Key/value lists must be even in length.');

  for (var i = opt_startIndex || 0; i < keysAndValues.length; i += 2) {
    goog.uri.utils.appendKeyValuePairs_(
        keysAndValues[i], keysAndValues[i + 1], buffer);
  }

  return buffer;
***REMOVED***


***REMOVED***
***REMOVED*** Builds a query data string from a sequence of alternating keys and values.
***REMOVED*** Currently generates "&key&" for empty args.
***REMOVED***
***REMOVED*** @param {goog.uri.utils.QueryArray} keysAndValues Alternating keys and
***REMOVED***     values.  See the typedef.
***REMOVED*** @param {number=} opt_startIndex A start offset into the arary, defaults to 0.
***REMOVED*** @return {string} The encoded query string, in the form 'a=1&b=2'.
***REMOVED***
goog.uri.utils.buildQueryData = function(keysAndValues, opt_startIndex) {
  var buffer = goog.uri.utils.buildQueryDataBuffer_(
      [], keysAndValues, opt_startIndex);
  buffer[0] = ''; // Remove the leading ampersand.
  return buffer.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Builds a buffer of query data from a map.
***REMOVED***
***REMOVED*** @param {!Array.<string|undefined>} buffer A string buffer to append to.  The
***REMOVED***     first element appended will be an '&', and may be replaced by the caller.
***REMOVED*** @param {Object.<goog.uri.utils.QueryValue>} map An object where keys are
***REMOVED***     URI-encoded parameter keys, and the values conform to the contract
***REMOVED***     specified in the goog.uri.utils.QueryValue typedef.
***REMOVED*** @return {!Array.<string|undefined>} The buffer argument.
***REMOVED*** @private
***REMOVED***
goog.uri.utils.buildQueryDataBufferFromMap_ = function(buffer, map) {
  for (var key in map) {
    goog.uri.utils.appendKeyValuePairs_(key, map[key], buffer);
  }

  return buffer;
***REMOVED***


***REMOVED***
***REMOVED*** Builds a query data string from a map.
***REMOVED*** Currently generates "&key&" for empty args.
***REMOVED***
***REMOVED*** @param {Object} map An object where keys are URI-encoded parameter keys,
***REMOVED***     and the values are arbitrary types or arrays.  Keys with a null value
***REMOVED***     are dropped.
***REMOVED*** @return {string} The encoded query string, in the form 'a=1&b=2'.
***REMOVED***
goog.uri.utils.buildQueryDataFromMap = function(map) {
  var buffer = goog.uri.utils.buildQueryDataBufferFromMap_([], map);
  buffer[0] = '';
  return buffer.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Appends URI parameters to an existing URI.
***REMOVED***
***REMOVED*** The variable arguments may contain alternating keys and values.  Keys are
***REMOVED*** assumed to be already URI encoded.  The values should not be URI-encoded,
***REMOVED*** and will instead be encoded by this function.
***REMOVED*** <pre>
***REMOVED*** appendParams('http://www.foo.com?existing=true',
***REMOVED***     'key1', 'value1',
***REMOVED***     'key2', 'value?willBeEncoded',
***REMOVED***     'key3', ['valueA', 'valueB', 'valueC'],
***REMOVED***     'key4', null);
***REMOVED*** result: 'http://www.foo.com?existing=true&' +
***REMOVED***     'key1=value1&' +
***REMOVED***     'key2=value%3FwillBeEncoded&' +
***REMOVED***     'key3=valueA&key3=valueB&key3=valueC'
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** A single call to this function will not exhibit quadratic behavior in IE,
***REMOVED*** whereas multiple repeated calls may, although the effect is limited by
***REMOVED*** fact that URL's generally can't exceed 2kb.
***REMOVED***
***REMOVED*** @param {string} uri The original URI, which may already have query data.
***REMOVED*** @param {...(goog.uri.utils.QueryArray|string|goog.uri.utils.QueryValue)} var_args
***REMOVED***     An array or argument list conforming to goog.uri.utils.QueryArray.
***REMOVED*** @return {string} The URI with all query parameters added.
***REMOVED***
goog.uri.utils.appendParams = function(uri, var_args) {
  return goog.uri.utils.appendQueryData_(
      arguments.length == 2 ?
      goog.uri.utils.buildQueryDataBuffer_([uri], arguments[1], 0) :
      goog.uri.utils.buildQueryDataBuffer_([uri], arguments, 1));
***REMOVED***


***REMOVED***
***REMOVED*** Appends query parameters from a map.
***REMOVED***
***REMOVED*** @param {string} uri The original URI, which may already have query data.
***REMOVED*** @param {Object} map An object where keys are URI-encoded parameter keys,
***REMOVED***     and the values are arbitrary types or arrays.  Keys with a null value
***REMOVED***     are dropped.
***REMOVED*** @return {string} The new parameters.
***REMOVED***
goog.uri.utils.appendParamsFromMap = function(uri, map) {
  return goog.uri.utils.appendQueryData_(
      goog.uri.utils.buildQueryDataBufferFromMap_([uri], map));
***REMOVED***


***REMOVED***
***REMOVED*** Appends a single URI parameter.
***REMOVED***
***REMOVED*** Repeated calls to this can exhibit quadratic behavior in IE6 due to the
***REMOVED*** way string append works, though it should be limited given the 2kb limit.
***REMOVED***
***REMOVED*** @param {string} uri The original URI, which may already have query data.
***REMOVED*** @param {string} key The key, which must already be URI encoded.
***REMOVED*** @param {*=} opt_value The value, which will be stringized and encoded
***REMOVED***     (assumed not already to be encoded).  If omitted, undefined, or null, the
***REMOVED***     key will be added as a valueless parameter.
***REMOVED*** @return {string} The URI with the query parameter added.
***REMOVED***
goog.uri.utils.appendParam = function(uri, key, opt_value) {
  var paramArr = [uri, '&', key];
  if (goog.isDefAndNotNull(opt_value)) {
    paramArr.push('=', goog.string.urlEncode(opt_value));
  }
  return goog.uri.utils.appendQueryData_(paramArr);
***REMOVED***


***REMOVED***
***REMOVED*** Finds the next instance of a query parameter with the specified name.
***REMOVED***
***REMOVED*** Does not instantiate any objects.
***REMOVED***
***REMOVED*** @param {string} uri The URI to search.  May contain a fragment identifier
***REMOVED***     if opt_hashIndex is specified.
***REMOVED*** @param {number} startIndex The index to begin searching for the key at.  A
***REMOVED***     match may be found even if this is one character after the ampersand.
***REMOVED*** @param {string} keyEncoded The URI-encoded key.
***REMOVED*** @param {number} hashOrEndIndex Index to stop looking at.  If a hash
***REMOVED***     mark is present, it should be its index, otherwise it should be the
***REMOVED***     length of the string.
***REMOVED*** @return {number} The position of the first character in the key's name,
***REMOVED***     immediately after either a question mark or a dot.
***REMOVED*** @private
***REMOVED***
goog.uri.utils.findParam_ = function(
    uri, startIndex, keyEncoded, hashOrEndIndex) {
  var index = startIndex;
  var keyLength = keyEncoded.length;

  // Search for the key itself and post-filter for surronuding punctuation,
  // rather than expensively building a regexp.
  while ((index = uri.indexOf(keyEncoded, index)) >= 0 &&
      index < hashOrEndIndex) {
    var precedingChar = uri.charCodeAt(index - 1);
    // Ensure that the preceding character is '&' or '?'.
    if (precedingChar == goog.uri.utils.CharCode_.AMPERSAND ||
        precedingChar == goog.uri.utils.CharCode_.QUESTION) {
      // Ensure the following character is '&', '=', '#', or NaN
      // (end of string).
      var followingChar = uri.charCodeAt(index + keyLength);
      if (!followingChar ||
          followingChar == goog.uri.utils.CharCode_.EQUAL ||
          followingChar == goog.uri.utils.CharCode_.AMPERSAND ||
          followingChar == goog.uri.utils.CharCode_.HASH) {
        return index;
      }
    }
    index += keyLength + 1;
  }

  return -1;
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression for finding a hash mark or end of string.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.uri.utils.hashOrEndRe_ = /#|$/;


***REMOVED***
***REMOVED*** Determines if the URI contains a specific key.
***REMOVED***
***REMOVED*** Performs no object instantiations.
***REMOVED***
***REMOVED*** @param {string} uri The URI to process.  May contain a fragment
***REMOVED***     identifier.
***REMOVED*** @param {string} keyEncoded The URI-encoded key.  Case-sensitive.
***REMOVED*** @return {boolean} Whether the key is present.
***REMOVED***
goog.uri.utils.hasParam = function(uri, keyEncoded) {
  return goog.uri.utils.findParam_(uri, 0, keyEncoded,
      uri.search(goog.uri.utils.hashOrEndRe_)) >= 0;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the first value of a query parameter.
***REMOVED*** @param {string} uri The URI to process.  May contain a fragment.
***REMOVED*** @param {string} keyEncoded The URI-encoded key.  Case-sensitive.
***REMOVED*** @return {?string} The first value of the parameter (URI-decoded), or null
***REMOVED***     if the parameter is not found.
***REMOVED***
goog.uri.utils.getParamValue = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
  var foundIndex = goog.uri.utils.findParam_(
      uri, 0, keyEncoded, hashOrEndIndex);

  if (foundIndex < 0) {
    return null;
  } else {
    var endPosition = uri.indexOf('&', foundIndex);
    if (endPosition < 0 || endPosition > hashOrEndIndex) {
      endPosition = hashOrEndIndex;
    }
    // Progress forth to the end of the "key=" or "key&" substring.
    foundIndex += keyEncoded.length + 1;
    // Use substr, because it (unlike substring) will return empty string
    // if foundIndex > endPosition.
    return goog.string.urlDecode(
        uri.substr(foundIndex, endPosition - foundIndex));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets all values of a query parameter.
***REMOVED*** @param {string} uri The URI to process.  May contain a framgnet.
***REMOVED*** @param {string} keyEncoded The URI-encoded key.  Case-snsitive.
***REMOVED*** @return {!Array.<string>} All URI-decoded values with the given key.
***REMOVED***     If the key is not found, this will have length 0, but never be null.
***REMOVED***
goog.uri.utils.getParamValues = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
  var position = 0;
  var foundIndex;
  var result = [];

  while ((foundIndex = goog.uri.utils.findParam_(
      uri, position, keyEncoded, hashOrEndIndex)) >= 0) {
    // Find where this parameter ends, either the '&' or the end of the
    // query parameters.
    position = uri.indexOf('&', foundIndex);
    if (position < 0 || position > hashOrEndIndex) {
      position = hashOrEndIndex;
    }

    // Progress forth to the end of the "key=" or "key&" substring.
    foundIndex += keyEncoded.length + 1;
    // Use substr, because it (unlike substring) will return empty string
    // if foundIndex > position.
    result.push(goog.string.urlDecode(uri.substr(
        foundIndex, position - foundIndex)));
  }

  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Regexp to find trailing question marks and ampersands.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;


***REMOVED***
***REMOVED*** Removes all instances of a query parameter.
***REMOVED*** @param {string} uri The URI to process.  Must not contain a fragment.
***REMOVED*** @param {string} keyEncoded The URI-encoded key.
***REMOVED*** @return {string} The URI with all instances of the parameter removed.
***REMOVED***
goog.uri.utils.removeParam = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
  var position = 0;
  var foundIndex;
  var buffer = [];

  // Look for a query parameter.
  while ((foundIndex = goog.uri.utils.findParam_(
      uri, position, keyEncoded, hashOrEndIndex)) >= 0) {
    // Get the portion of the query string up to, but not including, the ?
    // or & starting the parameter.
    buffer.push(uri.substring(position, foundIndex));
    // Progress to immediately after the '&'.  If not found, go to the end.
    // Avoid including the hash mark.
    position = Math.min((uri.indexOf('&', foundIndex) + 1) || hashOrEndIndex,
        hashOrEndIndex);
  }

  // Append everything that is remaining.
  buffer.push(uri.substr(position));

  // Join the buffer, and remove trailing punctuation that remains.
  return buffer.join('').replace(
      goog.uri.utils.trailingQueryPunctuationRe_, '$1');
***REMOVED***


***REMOVED***
***REMOVED*** Replaces all existing definitions of a parameter with a single definition.
***REMOVED***
***REMOVED*** Repeated calls to this can exhibit quadratic behavior due to the need to
***REMOVED*** find existing instances and reconstruct the string, though it should be
***REMOVED*** limited given the 2kb limit.  Consider using appendParams to append multiple
***REMOVED*** parameters in bulk.
***REMOVED***
***REMOVED*** @param {string} uri The original URI, which may already have query data.
***REMOVED*** @param {string} keyEncoded The key, which must already be URI encoded.
***REMOVED*** @param {*} value The value, which will be stringized and encoded (assumed
***REMOVED***     not already to be encoded).
***REMOVED*** @return {string} The URI with the query parameter added.
***REMOVED***
goog.uri.utils.setParam = function(uri, keyEncoded, value) {
  return goog.uri.utils.appendParam(
      goog.uri.utils.removeParam(uri, keyEncoded), keyEncoded, value);
***REMOVED***


***REMOVED***
***REMOVED*** Generates a URI path using a given URI and a path with checks to
***REMOVED*** prevent consecutive "//". The baseUri passed in must not contain
***REMOVED*** query or fragment identifiers. The path to append may not contain query or
***REMOVED*** fragment identifiers.
***REMOVED***
***REMOVED*** @param {string} baseUri URI to use as the base.
***REMOVED*** @param {string} path Path to append.
***REMOVED*** @return {string} Updated URI.
***REMOVED***
goog.uri.utils.appendPath = function(baseUri, path) {
  goog.uri.utils.assertNoFragmentsOrQueries_(baseUri);

  // Remove any trailing '/'
  if (goog.string.endsWith(baseUri, '/')) {
    baseUri = baseUri.substr(0, baseUri.length - 1);
  }
  // Remove any leading '/'
  if (goog.string.startsWith(path, '/')) {
    path = path.substr(1);
  }
  return goog.string.buildString(baseUri, '/', path);
***REMOVED***


***REMOVED***
***REMOVED*** Replaces the path.
***REMOVED*** @param {string} uri URI to use as the base.
***REMOVED*** @param {string} path New path.
***REMOVED*** @return {string} Updated URI.
***REMOVED***
goog.uri.utils.setPath = function(uri, path) {
  // Add any missing '/'.
  if (!goog.string.startsWith(path, '/')) {
    path = '/' + path;
  }
  var parts = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(
      parts[goog.uri.utils.ComponentIndex.SCHEME],
      parts[goog.uri.utils.ComponentIndex.USER_INFO],
      parts[goog.uri.utils.ComponentIndex.DOMAIN],
      parts[goog.uri.utils.ComponentIndex.PORT],
      path,
      parts[goog.uri.utils.ComponentIndex.QUERY_DATA],
      parts[goog.uri.utils.ComponentIndex.FRAGMENT]);
***REMOVED***


***REMOVED***
***REMOVED*** Standard supported query parameters.
***REMOVED*** @enum {string}
***REMOVED***
goog.uri.utils.StandardQueryParam = {

 ***REMOVED*****REMOVED*** Unused parameter for unique-ifying.***REMOVED***
  RANDOM: 'zx'
***REMOVED***


***REMOVED***
***REMOVED*** Sets the zx parameter of a URI to a random value.
***REMOVED*** @param {string} uri Any URI.
***REMOVED*** @return {string} That URI with the "zx" parameter added or replaced to
***REMOVED***     contain a random string.
***REMOVED***
goog.uri.utils.makeUnique = function(uri) {
  return goog.uri.utils.setParam(uri,
      goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString());
***REMOVED***
