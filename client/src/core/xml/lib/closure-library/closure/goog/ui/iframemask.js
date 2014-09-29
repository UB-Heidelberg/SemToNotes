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
***REMOVED*** @fileoverview Iframe shims, to protect controls on the underlying page
***REMOVED*** from bleeding through popups.
***REMOVED***
***REMOVED*** @author gboyer@google.com (Garrett Boyer)
***REMOVED*** @author nicksantos@google.com (Nick Santos) (Ported to Closure)
***REMOVED***


goog.provide('goog.ui.IframeMask');

goog.require('goog.Disposable');
goog.require('goog.Timer');
goog.require('goog.dom');
***REMOVED***
goog.require('goog.dom.iframe');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.style');



***REMOVED***
***REMOVED*** Controller for an iframe mask. The mask is only valid in the current
***REMOVED*** document, or else the document of the given DOM helper.
***REMOVED***
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DOM helper for the relevant
***REMOVED***     document.
***REMOVED*** @param {goog.structs.Pool=} opt_iframePool An optional source of iframes.
***REMOVED***     Iframes will be grabbed from the pool when they're needed and returned
***REMOVED***     to the pool (but still attached to the DOM) when they're done.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.ui.IframeMask = function(opt_domHelper, opt_iframePool) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The DOM helper for this document.
  ***REMOVED*** @type {goog.dom.DomHelper}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.dom_ = opt_domHelper || goog.dom.getDomHelper();

 ***REMOVED*****REMOVED***
  ***REMOVED*** An Element to snap the mask to. If none is given, defaults to
  ***REMOVED*** a full-screen iframe mask.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.snapElement_ = this.dom_.getDocument().documentElement;

 ***REMOVED*****REMOVED***
  ***REMOVED*** An event handler for listening to popups and the like.
  ***REMOVED*** @type {goog.events.EventHandler|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.handler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** An iframe pool.
  ***REMOVED*** @type {goog.structs.Pool|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.iframePool_ = opt_iframePool;
***REMOVED***
goog.inherits(goog.ui.IframeMask, goog.Disposable);


***REMOVED***
***REMOVED*** An iframe.
***REMOVED*** @type {HTMLIFrameElement}
***REMOVED*** @private
***REMOVED***
goog.ui.IframeMask.prototype.iframe_;


***REMOVED***
***REMOVED*** The z-index of the iframe mask.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.IframeMask.prototype.zIndex_ = 1;


***REMOVED***
***REMOVED*** The opacity of the iframe mask, expressed as a value between 0 and 1, with
***REMOVED*** 1 being totally opaque.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.IframeMask.prototype.opacity_ = 0;


***REMOVED***
***REMOVED*** Removes the iframe from the DOM.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.ui.IframeMask.prototype.disposeInternal = function() {
  if (this.iframePool_) {
    this.iframePool_.releaseObject(
       ***REMOVED*****REMOVED*** @type {HTMLIFrameElement}***REMOVED*** (this.iframe_));
  } else {
    goog.dom.removeNode(this.iframe_);
  }
  this.iframe_ = null;

  this.handler_.dispose();
  this.handler_ = null;

  goog.ui.IframeMask.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** CSS for a hidden iframe.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.IframeMask.HIDDEN_CSS_TEXT_ =
    'position:absolute;display:none;z-index:1';


***REMOVED***
***REMOVED*** Removes the mask from the screen.
***REMOVED***
goog.ui.IframeMask.prototype.hideMask = function() {
  if (this.iframe_) {
    this.iframe_.style.cssText = goog.ui.IframeMask.HIDDEN_CSS_TEXT_;
    if (this.iframePool_) {
      this.iframePool_.releaseObject(this.iframe_);
      this.iframe_ = null;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the iframe to use as a mask. Creates a new one if one has not been
***REMOVED*** created yet.
***REMOVED*** @return {HTMLIFrameElement} The iframe.
***REMOVED*** @private
***REMOVED***
goog.ui.IframeMask.prototype.getIframe_ = function() {
  if (!this.iframe_) {
    this.iframe_ = this.iframePool_ ?
       ***REMOVED*****REMOVED*** @type {HTMLIFrameElement}***REMOVED*** (this.iframePool_.getObject()) :
        goog.dom.iframe.createBlank(this.dom_);
    this.iframe_.style.cssText = goog.ui.IframeMask.HIDDEN_CSS_TEXT_;
    this.dom_.getDocument().body.appendChild(this.iframe_);
  }
  return this.iframe_;
***REMOVED***


***REMOVED***
***REMOVED*** Applies the iframe mask to the screen.
***REMOVED***
goog.ui.IframeMask.prototype.applyMask = function() {
  var iframe = this.getIframe_();
  var bounds = goog.style.getBounds(this.snapElement_);
  iframe.style.cssText =
      'position:absolute;' +
      'left:' + bounds.left + 'px;' +
      'top:' + bounds.top + 'px;' +
      'width:' + bounds.width + 'px;' +
      'height:' + bounds.height + 'px;' +
      'z-index:' + this.zIndex_;
  goog.style.setOpacity(iframe, this.opacity_);
  iframe.style.display = 'block';
***REMOVED***


***REMOVED***
***REMOVED*** Sets the opacity of the mask. Will take effect the next time the mask
***REMOVED*** is applied.
***REMOVED*** @param {number} opacity A value between 0 and 1, with 1 being
***REMOVED***     totally opaque.
***REMOVED***
goog.ui.IframeMask.prototype.setOpacity = function(opacity) {
  this.opacity_ = opacity;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the z-index of the mask. Will take effect the next time the mask
***REMOVED*** is applied.
***REMOVED*** @param {number} zIndex A z-index value.
***REMOVED***
goog.ui.IframeMask.prototype.setZIndex = function(zIndex) {
  this.zIndex_ = zIndex;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the element to use as the bounds of the mask. Takes effect immediately.
***REMOVED*** @param {Element} snapElement The snap element, which the iframe will be
***REMOVED***     "snapped" around.
***REMOVED***
goog.ui.IframeMask.prototype.setSnapElement = function(snapElement) {
  this.snapElement_ = snapElement;
  if (this.iframe_ && goog.style.isElementShown(this.iframe_)) {
    this.applyMask();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Listens on the specified target, hiding and showing the iframe mask
***REMOVED*** when the given event types are dispatched.
***REMOVED*** @param {goog.events.EventTarget} target The event target to listen on.
***REMOVED*** @param {string} showEvent When this event fires, the mask will be applied.
***REMOVED*** @param {string} hideEvent When this event fires, the mask will be hidden.
***REMOVED*** @param {Element=} opt_snapElement When the mask is applied, it will
***REMOVED***     automatically snap to this element. If no element is specified, it will
***REMOVED***     use the default snap element.
***REMOVED***
goog.ui.IframeMask.prototype.listenOnTarget = function(target, showEvent,
    hideEvent, opt_snapElement) {
  var timerKey;
  this.handler_.listen(target, showEvent, function() {
    if (opt_snapElement) {
      this.setSnapElement(opt_snapElement);
    }
    // Check out the iframe asynchronously, so we don't block the SHOW
    // event and cause a bounce.
    timerKey = goog.Timer.callOnce(this.applyMask, 0, this);
  });
  this.handler_.listen(target, hideEvent, function() {
    if (timerKey) {
      goog.Timer.clear(timerKey);
      timerKey = null;
    }
    this.hideMask();
  });
***REMOVED***


***REMOVED***
***REMOVED*** Removes all handlers attached by listenOnTarget.
***REMOVED***
goog.ui.IframeMask.prototype.removeHandlers = function() {
  this.handler_.removeAll();
***REMOVED***
