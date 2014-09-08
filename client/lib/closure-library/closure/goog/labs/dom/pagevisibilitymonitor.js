// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview This event monitor wraps the Page Visibility API.
***REMOVED*** @see http://www.w3.org/TR/page-visibility/
***REMOVED***

goog.provide('goog.labs.dom.PageVisibilityEvent');
goog.provide('goog.labs.dom.PageVisibilityMonitor');
goog.provide('goog.labs.dom.PageVisibilityState');

goog.require('goog.dom');
goog.require('goog.dom.vendor');
***REMOVED***
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.memoize');

goog.scope(function() {
var dom = goog.labs.dom;


***REMOVED***
***REMOVED*** The different visibility states.
***REMOVED*** @enum {string}
***REMOVED***
dom.PageVisibilityState = {
  HIDDEN: 'hidden',
  VISIBLE: 'visible',
  PRERENDER: 'prerender',
  UNLOADED: 'unloaded'
***REMOVED***



***REMOVED***
***REMOVED*** This event handler allows you to catch page visibility change events.
***REMOVED*** @param {!goog.dom.DomHelper=} opt_domHelper
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED*** @final
***REMOVED***
dom.PageVisibilityMonitor = function(opt_domHelper) {
  dom.PageVisibilityMonitor.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private {!goog.dom.DomHelper}
 ***REMOVED*****REMOVED***
  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private {?string}
 ***REMOVED*****REMOVED***
  this.eventType_ = this.getBrowserEventType_();

  // Some browsers do not support visibilityChange and therefore we don't bother
  // setting up events.
  if (this.eventType_) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** @private {goog.events.Key}
   ***REMOVED*****REMOVED***
    this.eventKey_ = goog.events.listen(this.domHelper_.getDocument(),
        this.eventType_, goog.bind(this.handleChange_, this));
  }
***REMOVED***
goog.inherits(dom.PageVisibilityMonitor, goog.events.EventTarget);


***REMOVED***
***REMOVED*** @return {?string} The visibility change event type, or null if not supported.
***REMOVED***     Memoized for performance.
***REMOVED*** @private
***REMOVED***
dom.PageVisibilityMonitor.prototype.getBrowserEventType_ =
    goog.memoize(function() {
  var isSupported = this.isSupported();
  var isPrefixed = this.isPrefixed_();

  if (isSupported) {
    return isPrefixed ? goog.dom.vendor.getPrefixedEventType(
        goog.events.EventType.VISIBILITYCHANGE) :
        goog.events.EventType.VISIBILITYCHANGE;
  } else {
    return null;
  }
});


***REMOVED***
***REMOVED*** @return {?string} The browser-specific document.hidden property.  Memoized
***REMOVED***     for performance.
***REMOVED*** @private
***REMOVED***
dom.PageVisibilityMonitor.prototype.getHiddenPropertyName_ = goog.memoize(
    function() {
      return goog.dom.vendor.getPrefixedPropertyName(
          'hidden', this.domHelper_.getDocument());
    });


***REMOVED***
***REMOVED*** @return {boolean} Whether the visibility API is prefixed.
***REMOVED*** @private
***REMOVED***
dom.PageVisibilityMonitor.prototype.isPrefixed_ = function() {
  return this.getHiddenPropertyName_() != 'hidden';
***REMOVED***


***REMOVED***
***REMOVED*** @return {?string} The browser-specific document.visibilityState property.
***REMOVED***     Memoized for performance.
***REMOVED*** @private
***REMOVED***
dom.PageVisibilityMonitor.prototype.getVisibilityStatePropertyName_ =
    goog.memoize(function() {
  return goog.dom.vendor.getPrefixedPropertyName(
      'visibilityState', this.domHelper_.getDocument());
});


***REMOVED***
***REMOVED*** @return {boolean} Whether the visibility API is supported.
***REMOVED***
dom.PageVisibilityMonitor.prototype.isSupported = function() {
  return !!this.getHiddenPropertyName_();
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the page is visible.
***REMOVED***
dom.PageVisibilityMonitor.prototype.isHidden = function() {
  return !!this.domHelper_.getDocument()[this.getHiddenPropertyName_()];
***REMOVED***


***REMOVED***
***REMOVED*** @return {?dom.PageVisibilityState} The page visibility state, or null if
***REMOVED***     not supported.
***REMOVED***
dom.PageVisibilityMonitor.prototype.getVisibilityState = function() {
  if (!this.isSupported()) {
    return null;
  }
  return this.domHelper_.getDocument()[this.getVisibilityStatePropertyName_()];
***REMOVED***


***REMOVED***
***REMOVED*** Handles the events on the element.
***REMOVED*** @param {goog.events.BrowserEvent} e The underlying browser event.
***REMOVED*** @private
***REMOVED***
dom.PageVisibilityMonitor.prototype.handleChange_ = function(e) {
  var state = this.getVisibilityState();
  var visibilityEvent = new dom.PageVisibilityEvent(
      this.isHidden(),***REMOVED*****REMOVED*** @type {dom.PageVisibilityState}***REMOVED*** (state));
  this.dispatchEvent(visibilityEvent);
***REMOVED***


***REMOVED*** @override***REMOVED***
dom.PageVisibilityMonitor.prototype.disposeInternal = function() {
  goog.events.unlistenByKey(this.eventKey_);
  dom.PageVisibilityMonitor.base(this, 'disposeInternal');
***REMOVED***



***REMOVED***
***REMOVED*** A page visibility change event.
***REMOVED*** @param {boolean} hidden Whether the page is hidden.
***REMOVED*** @param {goog.labs.dom.PageVisibilityState} visibilityState A more detailed
***REMOVED***     visibility state.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED*** @final
***REMOVED***
dom.PageVisibilityEvent = function(hidden, visibilityState) {
  dom.PageVisibilityEvent.base(
      this, 'constructor', goog.events.EventType.VISIBILITYCHANGE);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the page is hidden.
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.hidden = hidden;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A more detailed visibility state.
  ***REMOVED*** @type {dom.PageVisibilityState}
 ***REMOVED*****REMOVED***
  this.visibilityState = visibilityState;
***REMOVED***
goog.inherits(dom.PageVisibilityEvent, goog.events.Event);

});  // goog.scope
