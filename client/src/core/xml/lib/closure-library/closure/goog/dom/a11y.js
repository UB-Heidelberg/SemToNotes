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
***REMOVED*** @deprecated Use {@link goog.a11y.aria} instead.
***REMOVED***     This file will be removed on 1 Apr 2013.
***REMOVED***
***REMOVED***
goog.provide('goog.dom.a11y');
goog.provide('goog.dom.a11y.Announcer');
goog.provide('goog.dom.a11y.LivePriority');
goog.provide('goog.dom.a11y.Role');
goog.provide('goog.dom.a11y.State');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Announcer');
goog.require('goog.a11y.aria.LivePriority');
goog.require('goog.a11y.aria.Role');
goog.require('goog.a11y.aria.State');


***REMOVED***
***REMOVED*** Enumeration of ARIA states and properties.
***REMOVED*** @enum {string}
***REMOVED*** @deprecated Use {@link goog.a11y.aria.State} instead.
***REMOVED***     This alias will be removed on 1 Apr 2013.
***REMOVED***
goog.dom.a11y.State = goog.a11y.aria.State;


***REMOVED***
***REMOVED*** Enumeration of ARIA roles.
***REMOVED*** @enum {string}
***REMOVED*** @deprecated Use {@link goog.a11y.aria.Role} instead.
***REMOVED***     This alias will be removed on 1 Apr 2013.
***REMOVED***
goog.dom.a11y.Role = goog.a11y.aria.Role;


***REMOVED***
***REMOVED*** Enumeration of ARIA state values for live regions.
***REMOVED***
***REMOVED*** See http://www.w3.org/TR/wai-aria/states_and_properties#aria-live
***REMOVED*** for more information.
***REMOVED*** @enum {string}
***REMOVED*** @deprecated Use {@link goog.a11y.aria.LivePriority} instead.
***REMOVED***     This alias will be removed on 1 Apr 2013.
***REMOVED***
goog.dom.a11y.LivePriority = goog.a11y.aria.LivePriority;


***REMOVED***
***REMOVED*** Sets the role of an element.
***REMOVED*** @param {Element} element DOM node to set role of.
***REMOVED*** @param {goog.dom.a11y.Role|string} roleName role name(s).
***REMOVED*** @deprecated Use {@link goog.a11y.aria.setRole} instead.
***REMOVED***     This alias will be removed on 1 Apr 2013.
***REMOVED***
goog.dom.a11y.setRole = function(element, roleName) {
  goog.a11y.aria.setRole(
     ***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (element),
     ***REMOVED*****REMOVED*** @type {!goog.dom.a11y.Role}***REMOVED*** (roleName));
***REMOVED***


***REMOVED***
***REMOVED*** Gets role of an element.
***REMOVED*** @param {Element} element DOM node to get role of.
***REMOVED*** @return {?(goog.dom.a11y.Role|string)} rolename.
***REMOVED*** @deprecated Use {@link goog.a11y.aria.getRole} instead.
***REMOVED***     This alias will be removed on 1 Apr 2013.
***REMOVED***
goog.dom.a11y.getRole = function(element) {
  return***REMOVED*****REMOVED*** @type {?(goog.dom.a11y.Role|string)}***REMOVED*** (
      goog.a11y.aria.getRole(***REMOVED*** @type {!Element}***REMOVED*** (element)));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the state or property of an element.
***REMOVED*** @param {Element} element DOM node where we set state.
***REMOVED*** @param {goog.dom.a11y.State|string} state State attribute being set.
***REMOVED***     Automatically adds prefix 'aria-' to the state name.
***REMOVED*** @param {boolean|number|string} value Value for the
***REMOVED***     state attribute.
***REMOVED*** @deprecated Use {@link goog.a11y.aria.setState} instead.
***REMOVED***     This alias will be removed on 1 Apr 2013.
***REMOVED***
goog.dom.a11y.setState = function(element, state, value) {
  goog.a11y.aria.setState(
     ***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (element),
     ***REMOVED*****REMOVED*** @type {!goog.dom.a11y.State}***REMOVED*** (state),
     ***REMOVED*****REMOVED*** @type {boolean|number|string}***REMOVED*** (value));
***REMOVED***


***REMOVED***
***REMOVED*** Gets value of specified state or property.
***REMOVED*** @param {Element} element DOM node to get state from.
***REMOVED*** @param {goog.dom.a11y.State|string} stateName State name.
***REMOVED*** @return {string} Value of the state attribute.
***REMOVED*** @deprecated Use {@link goog.a11y.aria.getState} instead.
***REMOVED***     This alias will be removed on 1 Apr 2013.
***REMOVED***
goog.dom.a11y.getState = function(element, stateName) {
  return goog.a11y.aria.getState(
     ***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (element),
     ***REMOVED*****REMOVED*** @type {!goog.dom.a11y.State}***REMOVED*** (stateName));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the activedescendant of the given element.
***REMOVED*** @param {Element} element DOM node to get activedescendant from.
***REMOVED*** @return {Element} DOM node of the activedescendant.
***REMOVED*** @deprecated Use {@link goog.a11y.aria.getActiveDescendant} instead.
***REMOVED***     This alias will be removed on 1 Apr 2013.
***REMOVED***
goog.dom.a11y.getActiveDescendant = function(element) {
  return goog.a11y.aria.getActiveDescendant(
     ***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (element));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the activedescendant value for an element.
***REMOVED*** @param {Element} element DOM node to set activedescendant to.
***REMOVED*** @param {Element} activeElement DOM node being set as activedescendant.
***REMOVED*** @deprecated Use {@link goog.a11y.aria.setActiveDescendant} instead.
***REMOVED***     This alias will be removed on 1 Apr 2013.
***REMOVED***
goog.dom.a11y.setActiveDescendant = function(element, activeElement) {
  goog.a11y.aria.setActiveDescendant(
     ***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (element),
      activeElement);
***REMOVED***



***REMOVED***
***REMOVED*** Class that allows messages to be spoken by assistive technologies that the
***REMOVED*** user may have active.
***REMOVED***
***REMOVED*** @param {goog.dom.DomHelper} domHelper DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @deprecated Use {@link goog.a11y.aria.Announcer} instead.
***REMOVED***     This alias will be removed on 1 Apr 2013.
***REMOVED***
goog.dom.a11y.Announcer = goog.a11y.aria.Announcer;

