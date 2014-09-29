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
***REMOVED*** @fileoverview Utilities for adding, removing and setting values in
***REMOVED*** an Element's dataset.
***REMOVED*** See {@link http://www.w3.org/TR/html5/Overview.html#dom-dataset}.
***REMOVED***
***REMOVED***

goog.provide('goog.dom.dataset');

goog.require('goog.string');


***REMOVED***
***REMOVED*** The DOM attribute name prefix that must be present for it to be considered
***REMOVED*** for a dataset.
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.dom.dataset.PREFIX_ = 'data-';


***REMOVED***
***REMOVED*** Sets a custom data attribute on an element. The key should be
***REMOVED*** in camelCase format (e.g "keyName" for the "data-key-name" attribute).
***REMOVED*** @param {Element} element DOM node to set the custom data attribute on.
***REMOVED*** @param {string} key Key for the custom data attribute.
***REMOVED*** @param {string} value Value for the custom data attribute.
***REMOVED***
goog.dom.dataset.set = function(element, key, value) {
  if (element.dataset) {
    element.dataset[key] = value;
  } else {
    element.setAttribute(
        goog.dom.dataset.PREFIX_ + goog.string.toSelectorCase(key),
        value);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets a custom data attribute from an element. The key should be
***REMOVED*** in camelCase format (e.g "keyName" for the "data-key-name" attribute).
***REMOVED*** @param {Element} element DOM node to get the custom data attribute from.
***REMOVED*** @param {string} key Key for the custom data attribute.
***REMOVED*** @return {?string} The attribute value, if it exists.
***REMOVED***
goog.dom.dataset.get = function(element, key) {
  if (element.dataset) {
    return element.dataset[key];
  } else {
    return element.getAttribute(goog.dom.dataset.PREFIX_ +
                                goog.string.toSelectorCase(key));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes a custom data attribute from an element. The key should be
 ***REMOVED*** in camelCase format (e.g "keyName" for the "data-key-name" attribute).
***REMOVED*** @param {Element} element DOM node to get the custom data attribute from.
***REMOVED*** @param {string} key Key for the custom data attribute.
***REMOVED***
goog.dom.dataset.remove = function(element, key) {
  if (element.dataset) {
    delete element.dataset[key];
  } else {
    element.removeAttribute(goog.dom.dataset.PREFIX_ +
                            goog.string.toSelectorCase(key));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether custom data attribute exists on an element. The key should be
***REMOVED*** in camelCase format (e.g "keyName" for the "data-key-name" attribute).
***REMOVED***
***REMOVED*** @param {Element} element DOM node to get the custom data attribute from.
***REMOVED*** @param {string} key Key for the custom data attribute.
***REMOVED*** @return {boolean} Whether the attibute exists.
***REMOVED***
goog.dom.dataset.has = function(element, key) {
  if (element.dataset) {
    return key in element.dataset;
  } else if (element.hasAttribute) {
    return element.hasAttribute(goog.dom.dataset.PREFIX_ +
                                goog.string.toSelectorCase(key));
  } else {
    return !!(element.getAttribute(goog.dom.dataset.PREFIX_ +
                                   goog.string.toSelectorCase(key)));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets all custom data attributes as a string map.  The attribute names will be
***REMOVED*** camel cased (e.g., data-foo-bar -> dataset['fooBar']).  This operation is not
***REMOVED*** safe for attributes having camel-cased names clashing with already existing
***REMOVED*** properties (e.g., data-to-string -> dataset['toString']).
***REMOVED*** @param {!Element} element DOM node to get the data attributes from.
***REMOVED*** @return {!Object} The string map containing data attributes and their
***REMOVED***     respective values.
***REMOVED***
goog.dom.dataset.getAll = function(element) {
  if (element.dataset) {
    return element.dataset;
  } else {
    var dataset = {***REMOVED***
    var attributes = element.attributes;
    for (var i = 0; i < attributes.length; ++i) {
      var attribute = attributes[i];
      if (goog.string.startsWith(attribute.name,
                                 goog.dom.dataset.PREFIX_)) {
        // We use substr(5), since it's faster than replacing 'data-' with ''.
        var key = goog.string.toCamelCase(attribute.name.substr(5));
        dataset[key] = attribute.value;
      }
    }
    return dataset;
  }
***REMOVED***
