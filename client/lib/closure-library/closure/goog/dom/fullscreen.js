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
***REMOVED*** @fileoverview Functions for managing full screen status of the DOM.
***REMOVED***
***REMOVED***

goog.provide('goog.dom.fullscreen');
goog.provide('goog.dom.fullscreen.EventType');

goog.require('goog.dom');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Event types for full screen.
***REMOVED*** @enum {string}
***REMOVED***
goog.dom.fullscreen.EventType = {
 ***REMOVED*****REMOVED*** Dispatched by the Document when the fullscreen status changes.***REMOVED***
  CHANGE: (function() {
    if (goog.userAgent.WEBKIT) {
      return 'webkitfullscreenchange';
    }
    if (goog.userAgent.GECKO) {
      return 'mozfullscreenchange';
    }
    if (goog.userAgent.IE) {
      return 'MSFullscreenChange';
    }
    // Opera 12-14, and W3C standard (Draft):
    // https://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html
    return 'fullscreenchange';
  })()
***REMOVED***


***REMOVED***
***REMOVED*** Determines if full screen is supported.
***REMOVED*** @param {!goog.dom.DomHelper=} opt_domHelper The DomHelper for the DOM being
***REMOVED***     queried. If not provided, use the current DOM.
***REMOVED*** @return {boolean} True iff full screen is supported.
***REMOVED***
goog.dom.fullscreen.isSupported = function(opt_domHelper) {
  var doc = goog.dom.fullscreen.getDocument_(opt_domHelper);
  var body = doc.body;
  return !!(body.webkitRequestFullscreen ||
      (body.mozRequestFullScreen && doc.mozFullScreenEnabled) ||
      (body.msRequestFullscreen && doc.msFullscreenEnabled) ||
      (body.requestFullscreen && doc.fullscreenEnabled));
***REMOVED***


***REMOVED***
***REMOVED*** Requests putting the element in full screen.
***REMOVED*** @param {!Element} element The element to put full screen.
***REMOVED***
goog.dom.fullscreen.requestFullScreen = function(element) {
  if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.requestFullscreen) {
    element.requestFullscreen();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Requests putting the element in full screen with full keyboard access.
***REMOVED*** @param {!Element} element The element to put full screen.
***REMOVED***
goog.dom.fullscreen.requestFullScreenWithKeys = function(
    element) {
  if (element.mozRequestFullScreenWithKeys) {
    element.mozRequestFullScreenWithKeys();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else {
    goog.dom.fullscreen.requestFullScreen(element);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Exits full screen.
***REMOVED*** @param {!goog.dom.DomHelper=} opt_domHelper The DomHelper for the DOM being
***REMOVED***     queried. If not provided, use the current DOM.
***REMOVED***
goog.dom.fullscreen.exitFullScreen = function(opt_domHelper) {
  var doc = goog.dom.fullscreen.getDocument_(opt_domHelper);
  if (doc.webkitCancelFullScreen) {
    doc.webkitCancelFullScreen();
  } else if (doc.mozCancelFullScreen) {
    doc.mozCancelFullScreen();
  } else if (doc.msExitFullscreen) {
    doc.msExitFullscreen();
  } else if (doc.exitFullscreen) {
    doc.exitFullscreen();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the document is full screen.
***REMOVED*** @param {!goog.dom.DomHelper=} opt_domHelper The DomHelper for the DOM being
***REMOVED***     queried. If not provided, use the current DOM.
***REMOVED*** @return {boolean} Whether the document is full screen.
***REMOVED***
goog.dom.fullscreen.isFullScreen = function(opt_domHelper) {
  var doc = goog.dom.fullscreen.getDocument_(opt_domHelper);
  // IE 11 doesn't have similar boolean property, so check whether
  // document.msFullscreenElement is null instead.
  return !!(doc.webkitIsFullScreen || doc.mozFullScreen ||
      doc.msFullscreenElement || doc.fullscreenElement);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the document object of the dom.
***REMOVED*** @param {!goog.dom.DomHelper=} opt_domHelper The DomHelper for the DOM being
***REMOVED***     queried. If not provided, use the current DOM.
***REMOVED*** @return {!Document} The dom document.
***REMOVED*** @private
***REMOVED***
goog.dom.fullscreen.getDocument_ = function(opt_domHelper) {
  return opt_domHelper ?
      opt_domHelper.getDocument() :
      goog.dom.getDomHelper().getDocument();
***REMOVED***
