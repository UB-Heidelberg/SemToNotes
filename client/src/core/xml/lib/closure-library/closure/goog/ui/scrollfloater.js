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
***REMOVED*** @fileoverview  Class for making an element detach and float to remain
***REMOVED*** visible when otherwise it would have scrolled up out of view.
***REMOVED*** <p>
***REMOVED*** The element remains at its normal position in the layout until scrolling
***REMOVED*** would cause its top edge to scroll off the top of the viewport; at that
***REMOVED*** point, the element is replaced with an invisible placeholder (to keep the
***REMOVED*** layout stable), reattached in the dom tree to a new parent (the body element
***REMOVED*** by default), and set to "fixed" positioning (emulated for IE < 7) so that it
***REMOVED*** remains at its original X position while staying fixed to the top of the
***REMOVED*** viewport in the Y dimension.
***REMOVED*** <p>
***REMOVED*** When the window is scrolled up past the point where the original element
***REMOVED*** would be fully visible again, the element snaps back into place, replacing
***REMOVED*** the placeholder.
***REMOVED***
***REMOVED*** @see ../demos/scrollfloater.html
***REMOVED***
***REMOVED*** Adapted from http://go/elementfloater.js
***REMOVED***


goog.provide('goog.ui.ScrollFloater');
goog.provide('goog.ui.ScrollFloater.EventType');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classes');
***REMOVED***
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Creates a ScrollFloater; see file overview for details.
***REMOVED***
***REMOVED*** @param {Element=} opt_parentElement Where to attach the element when it's
***REMOVED***     floating.  Default is the document body.  If the floating element
***REMOVED***     contains form inputs, it will be necessary to attach it to the
***REMOVED***     corresponding form element, or to an element in the DOM subtree under
***REMOVED***     the form element.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.ScrollFloater = function(opt_parentElement, opt_domHelper) {
  // If a parentElement is supplied, we want to use its domHelper,
  // ignoring the caller-supplied one.
  var domHelper = opt_parentElement ?
      goog.dom.getDomHelper(opt_parentElement) : opt_domHelper;

  goog.ui.Component.call(this, domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The element to which the scroll-floated element will be attached
  ***REMOVED*** when it is floating.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.parentElement_ =
      opt_parentElement || this.getDomHelper().getDocument().body;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The original styles applied to the element before it began floating;
  ***REMOVED*** used to restore those styles when the element stops floating.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.originalStyles_ = {***REMOVED***
***REMOVED***
goog.inherits(goog.ui.ScrollFloater, goog.ui.Component);


***REMOVED***
***REMOVED*** Events dispatched by this component.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.ScrollFloater.EventType = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched when the component starts floating. The event is
  ***REMOVED*** cancellable.
 ***REMOVED*****REMOVED***
  FLOAT: 'float',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched when the component stops floating and returns to its
  ***REMOVED*** original state. The event is cancellable.
 ***REMOVED*****REMOVED***
  DOCK: 'dock'
***REMOVED***


***REMOVED***
***REMOVED*** The placeholder element dropped in to hold the layout for
***REMOVED*** the floated element.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.ScrollFloater.prototype.placeholder_;


***REMOVED***
***REMOVED*** Whether scrolling is enabled for this element; true by default.
***REMOVED*** The {@link #setScrollingEnabled} method can be used to change this value.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ScrollFloater.prototype.scrollingEnabled_ = true;


***REMOVED***
***REMOVED*** A flag indicating whether this instance is currently floating.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ScrollFloater.prototype.floating_ = false;


***REMOVED***
***REMOVED*** The original vertical page offset at which the top of the element
***REMOVED*** was rendered.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.ScrollFloater.prototype.originalOffset_;


***REMOVED***
***REMOVED*** The style properties which are stored when we float an element, so they
***REMOVED*** can be restored when it 'docks' again.
***REMOVED*** @type {Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.ui.ScrollFloater.STORED_STYLE_PROPS_ = [
  'position', 'top', 'left', 'width', 'cssFloat'];


***REMOVED***
***REMOVED*** The style elements managed for the placeholder object.
***REMOVED*** @type {Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.ui.ScrollFloater.PLACEHOLDER_STYLE_PROPS_ = [
  'position', 'top', 'left', 'display', 'cssFloat',
  'marginTop', 'marginLeft', 'marginRight', 'marginBottom'];


***REMOVED***
***REMOVED*** The class name applied to the floating element.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.ScrollFloater.CSS_CLASS_ = goog.getCssName('goog-scrollfloater');


***REMOVED***
***REMOVED*** Delegates dom creation to superclass, then constructs and
***REMOVED*** decorates required DOM elements.
***REMOVED*** @override
***REMOVED***
goog.ui.ScrollFloater.prototype.createDom = function() {
  goog.ui.ScrollFloater.superClass_.createDom.call(this);

  this.decorateInternal(this.getElement());
***REMOVED***


***REMOVED***
***REMOVED*** Decorates the floated element with the standard ScrollFloater CSS class.
***REMOVED*** @param {Element} element The element to decorate.
***REMOVED*** @override
***REMOVED***
goog.ui.ScrollFloater.prototype.decorateInternal = function(element) {
  goog.ui.ScrollFloater.superClass_.decorateInternal.call(this, element);

  goog.dom.classes.add(element, goog.ui.ScrollFloater.CSS_CLASS_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ScrollFloater.prototype.enterDocument = function() {
  goog.ui.ScrollFloater.superClass_.enterDocument.call(this);

  if (!this.placeholder_) {
    this.placeholder_ =
        this.getDomHelper().createDom('div', {'style': 'visibility:hidden'});
  }

  this.originalOffset_ = goog.style.getPageOffsetTop(this.getElement());
  this.setScrollingEnabled(this.scrollingEnabled_);
  var win = this.getDomHelper().getWindow();
  this.getHandler().
      listen(win, goog.events.EventType.SCROLL, this.update_).
      listen(win, goog.events.EventType.RESIZE, this.handleResize_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ScrollFloater.prototype.disposeInternal = function() {
  goog.ui.ScrollFloater.superClass_.disposeInternal.call(this);

  delete this.placeholder_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the element should be floated if it scrolls out of view.
***REMOVED*** @param {boolean} enable Whether floating is enabled for this element.
***REMOVED***
goog.ui.ScrollFloater.prototype.setScrollingEnabled = function(enable) {
  this.scrollingEnabled_ = enable;

  if (enable) {
    this.applyIeBgHack_();
    this.update_();
  } else {
    this.stopFloating_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the component is enabled for scroll-floating.
***REMOVED***
goog.ui.ScrollFloater.prototype.isScrollingEnabled = function() {
  return this.scrollingEnabled_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the component is currently scroll-floating.
***REMOVED***
goog.ui.ScrollFloater.prototype.isFloating = function() {
  return this.floating_;
***REMOVED***


***REMOVED***
***REMOVED*** When a scroll event occurs, compares the element's position to the current
***REMOVED*** document scroll position, and stops or starts floating behavior if needed.
***REMOVED*** @param {goog.events.Event=} opt_e The event, which is ignored.
***REMOVED*** @private
***REMOVED***
goog.ui.ScrollFloater.prototype.update_ = function(opt_e) {
  if (this.scrollingEnabled_) {
    var doc = this.getDomHelper().getDocument();
    var currentScrollTop = this.getDomHelper().getDocumentScroll().y;

    if (currentScrollTop > this.originalOffset_) {
      this.startFloating_();
    } else {
      this.stopFloating_();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Begins floating behavior, making the element position:fixed (or IE hacked
***REMOVED*** equivalent) and inserting a placeholder where it used to be to keep the
***REMOVED*** layout from shifting around.
***REMOVED*** @private
***REMOVED***
goog.ui.ScrollFloater.prototype.startFloating_ = function() {
  // Ignore if the component is floating or the FLOAT event is cancelled.
  if (this.floating_ ||
      !this.dispatchEvent(goog.ui.ScrollFloater.EventType.FLOAT)) {
    return;
  }

  var elem = this.getElement();
  var doc = this.getDomHelper().getDocument();

  // Read properties of element before modifying it.
  var originalLeft_ = goog.style.getPageOffsetLeft(elem);
  var originalWidth_ = goog.style.getContentBoxSize(elem).width;

  this.originalStyles_ = {***REMOVED***

  // Store styles while not floating so we can restore them when the
  // element stops floating.
  goog.array.forEach(goog.ui.ScrollFloater.STORED_STYLE_PROPS_,
                     function(property) {
                       this.originalStyles_[property] = elem.style[property];
                     },
                     this);

  // Copy relevant styles to placeholder so it will be layed out the same
  // as the element that's about to be floated.
  goog.array.forEach(goog.ui.ScrollFloater.PLACEHOLDER_STYLE_PROPS_,
                     function(property) {
                       this.placeholder_.style[property] =
                           elem.style[property] ||
                               goog.style.getCascadedStyle(elem, property) ||
                               goog.style.getComputedStyle(elem, property);
                     },
                     this);

  goog.style.setSize(this.placeholder_, elem.offsetWidth, elem.offsetHeight);

  // Make element float.

  goog.style.setStyle(elem, {
    'left': originalLeft_ + 'px',
    'width': originalWidth_ + 'px',
    'cssFloat': 'none'
  });

  // If parents are the same, avoid detaching and reattaching elem.
  // This prevents Flash embeds from being reloaded, for example.
  if (elem.parentNode == this.parentElement_) {
    elem.parentNode.insertBefore(this.placeholder_, elem);
  } else {
    elem.parentNode.replaceChild(this.placeholder_, elem);
    this.parentElement_.appendChild(elem);
  }

  // Versions of IE below 7-in-standards-mode don't handle 'position: fixed',
  // so we must emulate it using an IE-specific idiom for JS-based calculated
  // style values.

  if (this.needsIePositionHack_()) {
    elem.style.position = 'absolute';
    elem.style.setExpression('top',
        'document.compatMode=="CSS1Compat"?' +
        'documentElement.scrollTop:document.body.scrollTop');
  } else {
    elem.style.position = 'fixed';
    elem.style.top = '0';
  }

  this.floating_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** Stops floating behavior, returning element to its original state.
***REMOVED*** @private
***REMOVED***
goog.ui.ScrollFloater.prototype.stopFloating_ = function() {
  // Ignore if the component is docked or the DOCK event is cancelled.
  if (!this.floating_ ||
      !this.dispatchEvent(goog.ui.ScrollFloater.EventType.DOCK)) {
    return;
  }

  var elem = this.getElement();

  for (var prop in this.originalStyles_) {
    elem.style[prop] = this.originalStyles_[prop];
  }

  if (this.needsIePositionHack_()) {
    elem.style.removeExpression('top');
  }

  // If placeholder_ was inserted and didn't replace elem then elem has
  // the right parent already, no need to replace (which removes elem before
  // inserting it).
  if (this.placeholder_.parentNode == this.parentElement_) {
    this.placeholder_.parentNode.removeChild(this.placeholder_);
  } else {
    this.placeholder_.parentNode.replaceChild(elem, this.placeholder_);
  }
  this.floating_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Responds to window resize events by snapping the floater back to the new
***REMOVED*** version of its original position, then allowing it to float again if
***REMOVED*** appropriate.
***REMOVED*** @private
***REMOVED***
goog.ui.ScrollFloater.prototype.handleResize_ = function() {
  this.stopFloating_();
  this.originalOffset_ = goog.style.getPageOffsetTop(this.getElement());
  this.update_();
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether we need to apply the position hack to emulated position:
***REMOVED*** fixed on this browser.
***REMOVED*** @return {boolean} Whether the current browser needs the position hack.
***REMOVED*** @private
***REMOVED***
goog.ui.ScrollFloater.prototype.needsIePositionHack_ = function() {
  return goog.userAgent.IE &&
      !(goog.userAgent.isVersion('7') &&
          this.getDomHelper().isCss1CompatMode());
***REMOVED***


***REMOVED***
***REMOVED*** Sets some magic CSS properties that make float-scrolling work smoothly
***REMOVED*** in IE6 (and IE7 in quirks mode). Without this hack, the floating element
***REMOVED*** will appear jumpy when you scroll the document. This involves modifying
***REMOVED*** the background of the HTML element (or BODY in quirks mode). If there's
***REMOVED*** already a background image in use this is not required.
***REMOVED*** For further reading, see
***REMOVED*** http://annevankesteren.nl/2005/01/position-fixed-in-ie
***REMOVED*** @private
***REMOVED***
goog.ui.ScrollFloater.prototype.applyIeBgHack_ = function() {
  if (this.needsIePositionHack_()) {
    var doc = this.getDomHelper().getDocument();
    var topLevelElement = goog.style.getClientViewportElement(doc);

    if (topLevelElement.currentStyle.backgroundImage == 'none') {
      // Using an https URL if the current windowbp is https avoids an IE
      // "This page contains a mix of secure and nonsecure items" warning.
      topLevelElement.style.backgroundImage =
          this.getDomHelper().getWindow().location.protocol == 'https:' ?
              'url(https:///)' : 'url(about:blank)';
      topLevelElement.style.backgroundAttachment = 'fixed';
    }
  }
***REMOVED***
