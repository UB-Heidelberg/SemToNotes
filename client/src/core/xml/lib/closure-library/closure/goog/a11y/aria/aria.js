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
***REMOVED*** @fileoverview Utilities for adding, removing and setting ARIA roles
***REMOVED*** as defined by W3C ARIA Working Draft:
***REMOVED***     http://www.w3.org/TR/2010/WD-wai-aria-20100916/
***REMOVED*** All modern browsers have some form of ARIA support, so no browser checks are
***REMOVED*** performed when adding ARIA to components.
***REMOVED***
***REMOVED***
goog.provide('goog.a11y.aria');

goog.require('goog.a11y.aria.Role');
goog.require('goog.a11y.aria.State');
goog.require('goog.dom');


***REMOVED***
***REMOVED*** Sets the role of an element.
***REMOVED*** @param {!Element} element DOM node to set role of.
***REMOVED*** @param {!goog.a11y.aria.Role|string} roleName role name(s).
***REMOVED***
goog.a11y.aria.setRole = function(element, roleName) {
  element.setAttribute('role', roleName);
***REMOVED***


***REMOVED***
***REMOVED*** Gets role of an element.
***REMOVED*** @param {!Element} element DOM node to get role of.
***REMOVED*** @return {!goog.a11y.aria.Role|string} rolename.
***REMOVED***
goog.a11y.aria.getRole = function(element) {
  return***REMOVED*****REMOVED*** @type {goog.a11y.aria.Role}***REMOVED*** (
      element.getAttribute('role')) || '';
***REMOVED***


***REMOVED***
***REMOVED*** Sets the state or property of an element.
***REMOVED*** @param {!Element} element DOM node where we set state.
***REMOVED*** @param {!goog.a11y.aria.State|string} state State attribute being set.
***REMOVED*** Automatically adds prefix 'aria-' to the state name.
***REMOVED*** @param {string|boolean|number} value Value for the state attribute.
***REMOVED***
goog.a11y.aria.setState = function(element, state, value) {
  element.setAttribute('aria-' + state, value);
***REMOVED***


***REMOVED***
***REMOVED*** Gets value of specified state or property.
***REMOVED*** @param {!Element} element DOM node to get state from.
***REMOVED*** @param {!goog.a11y.aria.State|string} stateName State name.
***REMOVED*** @return {string} Value of the state attribute.
***REMOVED***
goog.a11y.aria.getState = function(element, stateName) {
  var attrb =***REMOVED*****REMOVED*** @type {string|number|boolean}***REMOVED*** (
      element.getAttribute('aria-' + stateName));
  // Check for multiple representations -  attrb might
  // be a boolean or a string
  if ((attrb === true) || (attrb === false)) {
    return attrb ? 'true' : 'false';
  } else if (!attrb) {
    return '';
  } else {
    return String(attrb);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the activedescendant of the given element.
***REMOVED*** @param {!Element} element DOM node to get activedescendant from.
***REMOVED*** @return {Element} DOM node of the activedescendant.
***REMOVED***
goog.a11y.aria.getActiveDescendant = function(element) {
  var id = goog.a11y.aria.getState(
      element, goog.a11y.aria.State.ACTIVEDESCENDANT);
  return goog.dom.getOwnerDocument(element).getElementById(id);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the activedescendant value for an element.
***REMOVED*** @param {!Element} element DOM node to set activedescendant to.
***REMOVED*** @param {Element} activeElement DOM node being set as activedescendant.
***REMOVED***
goog.a11y.aria.setActiveDescendant = function(element, activeElement) {
  goog.a11y.aria.setState(element, goog.a11y.aria.State.ACTIVEDESCENDANT,
      activeElement ? activeElement.id : '');
***REMOVED***


***REMOVED***
***REMOVED*** Gets the label of the given element.
***REMOVED*** @param {!Element} element DOM node to get label from.
***REMOVED*** @return {string} label The label.
***REMOVED***
goog.a11y.aria.getLabel = function(element) {
  return goog.a11y.aria.getState(element, goog.a11y.aria.State.LABEL);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the label of the given element.
***REMOVED*** @param {!Element} element DOM node to set label to.
***REMOVED*** @param {string} label The label to set.
***REMOVED***
goog.a11y.aria.setLabel = function(element, label) {
  goog.a11y.aria.setState(element, goog.a11y.aria.State.LABEL, label);
***REMOVED***

