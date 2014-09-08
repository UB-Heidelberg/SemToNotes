// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Vendor prefix getters.
***REMOVED***

goog.provide('goog.dom.vendor');

goog.require('goog.string');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Returns the JS vendor prefix used in CSS properties. Different vendors
***REMOVED*** use different methods of changing the case of the property names.
***REMOVED***
***REMOVED*** @return {?string} The JS vendor prefix or null if there is none.
***REMOVED***
goog.dom.vendor.getVendorJsPrefix = function() {
  if (goog.userAgent.WEBKIT) {
    return 'Webkit';
  } else if (goog.userAgent.GECKO) {
    return 'Moz';
  } else if (goog.userAgent.IE) {
    return 'ms';
  } else if (goog.userAgent.OPERA) {
    return 'O';
  }

  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the vendor prefix used in CSS properties.
***REMOVED***
***REMOVED*** @return {?string} The vendor prefix or null if there is none.
***REMOVED***
goog.dom.vendor.getVendorPrefix = function() {
  if (goog.userAgent.WEBKIT) {
    return '-webkit';
  } else if (goog.userAgent.GECKO) {
    return '-moz';
  } else if (goog.userAgent.IE) {
    return '-ms';
  } else if (goog.userAgent.OPERA) {
    return '-o';
  }

  return null;
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} propertyName A property name.
***REMOVED*** @param {!Object=} opt_object If provided, we verify if the property exists in
***REMOVED***     the object.
***REMOVED*** @return {?string} A vendor prefixed property name, or null if it does not
***REMOVED***     exist.
***REMOVED***
goog.dom.vendor.getPrefixedPropertyName = function(propertyName, opt_object) {
  // We first check for a non-prefixed property, if available.
  if (opt_object && propertyName in opt_object) {
    return propertyName;
  }
  var prefix = goog.dom.vendor.getVendorJsPrefix();
  if (prefix) {
    prefix = prefix.toLowerCase();
    var prefixedPropertyName = prefix + goog.string.toTitleCase(propertyName);
    return (!goog.isDef(opt_object) || prefixedPropertyName in opt_object) ?
        prefixedPropertyName : null;
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} eventType An event type.
***REMOVED*** @return {string} A lower-cased vendor prefixed event type.
***REMOVED***
goog.dom.vendor.getPrefixedEventType = function(eventType) {
  var prefix = goog.dom.vendor.getVendorJsPrefix() || '';
  return (prefix + eventType).toLowerCase();
***REMOVED***
