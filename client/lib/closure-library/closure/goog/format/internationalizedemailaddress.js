// Copyright 2014 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Provides functions to parse and manipulate internationalized
***REMOVED*** email addresses. This is useful in the context of Email Address
***REMOVED*** Internationalization (EAI) as defined by RFC6530.
***REMOVED***
***REMOVED***

goog.provide('goog.format.InternationalizedEmailAddress');

goog.require('goog.format.EmailAddress');



***REMOVED***
***REMOVED*** Formats an email address string for display, and allows for extraction of
***REMOVED*** the individual components of the address.
***REMOVED*** @param {string=} opt_address The email address.
***REMOVED*** @param {string=} opt_name The name associated with the email address.
***REMOVED***
***REMOVED*** @extends {goog.format.EmailAddress}
***REMOVED***
goog.format.InternationalizedEmailAddress = function(opt_address, opt_name) {
  goog.format.InternationalizedEmailAddress.base(
      this, 'constructor', opt_address, opt_name);
***REMOVED***
goog.inherits(
    goog.format.InternationalizedEmailAddress, goog.format.EmailAddress);


***REMOVED***
***REMOVED*** A string representing the RegExp for the local part of an EAI email address.
***REMOVED*** @private
***REMOVED***
goog.format.InternationalizedEmailAddress.EAI_LOCAL_PART_REGEXP_STR_ =
    '((?!\\s)[+a-zA-Z0-9_.!#$%&\'*\\/=?^`{|}~\u0080-\uFFFFFF-])+';


***REMOVED***
***REMOVED*** A string representing the RegExp for the domain part of an EAI email address.
***REMOVED*** @private
***REMOVED***
goog.format.InternationalizedEmailAddress.EAI_DOMAIN_PART_REGEXP_STR_ =
    '((?!\\s)[a-zA-Z0-9\u0080-\uFFFFFF-]+\\.)+' +
    '((?!\\s)[a-zA-Z0-9\u0080-\uFFFFFF-]){2,63}';


***REMOVED***
***REMOVED*** A RegExp to match the local part of an EAI email address.
***REMOVED*** @private {!RegExp}
***REMOVED***
goog.format.InternationalizedEmailAddress.EAI_LOCAL_PART_ =
    new RegExp('^' +
        goog.format.InternationalizedEmailAddress.EAI_LOCAL_PART_REGEXP_STR_ +
        '$');


***REMOVED***
***REMOVED*** A RegExp to match the domain part of an EAI email address.
***REMOVED*** @private {!RegExp}
***REMOVED***
goog.format.InternationalizedEmailAddress.EAI_DOMAIN_PART_ =
    new RegExp('^' +
        goog.format.InternationalizedEmailAddress.EAI_DOMAIN_PART_REGEXP_STR_ +
        '$');


***REMOVED***
***REMOVED*** A RegExp to match an EAI email address.
***REMOVED*** @private {!RegExp}
***REMOVED***
goog.format.InternationalizedEmailAddress.EAI_EMAIL_ADDRESS_ =
    new RegExp('^' +
        goog.format.InternationalizedEmailAddress.EAI_LOCAL_PART_REGEXP_STR_ +
        '@' +
        goog.format.InternationalizedEmailAddress.EAI_DOMAIN_PART_REGEXP_STR_ +
        '$');


***REMOVED***
***REMOVED*** Checks if the provided string is a valid local part (part before the '@') of
***REMOVED*** an EAI email address.
***REMOVED*** @param {string} str The local part to check.
***REMOVED*** @return {boolean} Whether the provided string is a valid local part.
***REMOVED***
goog.format.InternationalizedEmailAddress.isValidLocalPartSpec = function(str) {
  if (!goog.isDefAndNotNull(str)) {
    return false;
  }
  return goog.format.InternationalizedEmailAddress.EAI_LOCAL_PART_.test(str);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the provided string is a valid domain part (part after the '@') of
***REMOVED*** an EAI email address.
***REMOVED*** @param {string} str The domain part to check.
***REMOVED*** @return {boolean} Whether the provided string is a valid domain part.
***REMOVED***
goog.format.InternationalizedEmailAddress.isValidDomainPartSpec =
    function(str) {
  if (!goog.isDefAndNotNull(str)) {
    return false;
  }
  return goog.format.InternationalizedEmailAddress.EAI_DOMAIN_PART_.test(str);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.format.InternationalizedEmailAddress.prototype.isValid = function() {
  return goog.format.InternationalizedEmailAddress.isValidAddrSpec(
      this.address);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the provided string is a valid email address. Supports both
***REMOVED*** simple email addresses (address specs) and addresses that contain display
***REMOVED*** names.
***REMOVED*** @param {string} str The email address to check.
***REMOVED*** @return {boolean} Whether the provided string is a valid address.
***REMOVED***
goog.format.InternationalizedEmailAddress.isValidAddress = function(str) {
  if (!goog.isDefAndNotNull(str)) {
    return false;
  }
  return goog.format.InternationalizedEmailAddress.parse(str).isValid();
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the provided string is a valid address spec (local@domain.com).
***REMOVED*** @param {string} str The email address to check.
***REMOVED*** @return {boolean} Whether the provided string is a valid address spec.
***REMOVED***
goog.format.InternationalizedEmailAddress.isValidAddrSpec = function(str) {
  if (!goog.isDefAndNotNull(str)) {
    return false;
  }

  // This is a fairly naive implementation, but it covers 99% of use cases.
  // For more details, see http://en.wikipedia.org/wiki/Email_address#Syntax
  return goog.format.InternationalizedEmailAddress.EAI_EMAIL_ADDRESS_.test(str);
***REMOVED***


***REMOVED***
***REMOVED*** Parses a string containing email addresses of the form
***REMOVED*** "name" &lt;address&gt; into an array of email addresses.
***REMOVED*** @param {string} str The address list.
***REMOVED*** @return {!Array.<!goog.format.EmailAddress>} The parsed emails.
***REMOVED***
goog.format.InternationalizedEmailAddress.parseList = function(str) {
  return goog.format.EmailAddress.parseListInternal(
      str, goog.format.InternationalizedEmailAddress.parse);
***REMOVED***


***REMOVED***
***REMOVED*** Parses an email address of the form "name" &lt;address&gt; into
***REMOVED*** an email address.
***REMOVED*** @param {string} addr The address string.
***REMOVED*** @return {!goog.format.EmailAddress} The parsed address.
***REMOVED***
goog.format.InternationalizedEmailAddress.parse = function(addr) {
  return goog.format.EmailAddress.parseInternal(
      addr, goog.format.InternationalizedEmailAddress);
***REMOVED***
