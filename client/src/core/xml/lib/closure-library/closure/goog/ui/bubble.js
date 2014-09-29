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
***REMOVED*** @fileoverview Definition of the Bubble class.
***REMOVED***
***REMOVED***
***REMOVED*** @see ../demos/bubble.html
***REMOVED***
***REMOVED*** TODO: support decoration and addChild
***REMOVED***

goog.provide('goog.ui.Bubble');

goog.require('goog.Timer');
goog.require('goog.dom');
***REMOVED***
goog.require('goog.events.Event');
***REMOVED***
goog.require('goog.math.Box');
goog.require('goog.positioning');
goog.require('goog.positioning.AbsolutePosition');
goog.require('goog.positioning.AbstractPosition');
goog.require('goog.positioning.AnchoredPosition');
goog.require('goog.positioning.Corner');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.Popup');
goog.require('goog.ui.Popup.AnchoredPosition');



***REMOVED***
***REMOVED*** The Bubble provides a general purpose bubble implementation that can be
***REMOVED*** anchored to a particular element and displayed for a period of time.
***REMOVED***
***REMOVED*** @param {string|Element} message HTML string or an element to display inside
***REMOVED***     the bubble.
***REMOVED*** @param {Object=} opt_config The configuration
***REMOVED***     for the bubble. If not specified, the default configuration will be
***REMOVED***     used. {@see goog.ui.Bubble.defaultConfig}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.Bubble = function(message, opt_config, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The HTML string or element to display inside the bubble.
  ***REMOVED***
  ***REMOVED*** @type {string|Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.message_ = message;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The Popup element used to position and display the bubble.
  ***REMOVED***
  ***REMOVED*** @type {goog.ui.Popup}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.popup_ = new goog.ui.Popup();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Configuration map that contains bubble's UI elements.
  ***REMOVED***
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.config_ = opt_config || goog.ui.Bubble.defaultConfig;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Id of the close button for this bubble.
  ***REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.closeButtonId_ = this.makeId('cb');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Id of the div for the embedded element.
  ***REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.messageId_ = this.makeId('mi');

***REMOVED***
goog.inherits(goog.ui.Bubble, goog.ui.Component);


***REMOVED***
***REMOVED*** In milliseconds, timeout after which the button auto-hides. Null means
***REMOVED*** infinite.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.ui.Bubble.prototype.timeout_ = null;


***REMOVED***
***REMOVED*** Key returned by the bubble timer.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.Bubble.prototype.timerId_ = 0;


***REMOVED***
***REMOVED*** Key returned by the listen function for the close button.
***REMOVED*** @type {goog.events.Key}
***REMOVED*** @private
***REMOVED***
goog.ui.Bubble.prototype.listener_ = null;


***REMOVED***
***REMOVED*** Key returned by the listen function for the close button.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.Bubble.prototype.anchor_ = null;


***REMOVED*** @override***REMOVED***
goog.ui.Bubble.prototype.createDom = function() {
  goog.ui.Bubble.superClass_.createDom.call(this);

  var element = this.getElement();
  element.style.position = 'absolute';
  element.style.visibility = 'hidden';

  this.popup_.setElement(element);
***REMOVED***


***REMOVED***
***REMOVED*** Attaches the bubble to an anchor element. Computes the positioning and
***REMOVED*** orientation of the bubble.
***REMOVED***
***REMOVED*** @param {Element} anchorElement The element to which we are attaching.
***REMOVED***
goog.ui.Bubble.prototype.attach = function(anchorElement) {
  this.setAnchoredPosition_(
      anchorElement, this.computePinnedCorner_(anchorElement));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the corner of the bubble to used in the positioning algorithm.
***REMOVED***
***REMOVED*** @param {goog.positioning.Corner} corner The bubble corner used for
***REMOVED***     positioning constants.
***REMOVED***
goog.ui.Bubble.prototype.setPinnedCorner = function(corner) {
  this.popup_.setPinnedCorner(corner);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the position of the bubble. Pass null for corner in AnchoredPosition
***REMOVED*** for corner to be computed automatically.
***REMOVED***
***REMOVED*** @param {goog.positioning.AbstractPosition} position The position of the
***REMOVED***     bubble.
***REMOVED***
goog.ui.Bubble.prototype.setPosition = function(position) {
  if (position instanceof goog.positioning.AbsolutePosition) {
    this.popup_.setPosition(position);
  } else if (position instanceof goog.positioning.AnchoredPosition) {
    this.setAnchoredPosition_(position.element, position.corner);
  } else {
    throw Error('Bubble only supports absolute and anchored positions!');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the timeout after which bubble hides itself.
***REMOVED***
***REMOVED*** @param {number} timeout Timeout of the bubble.
***REMOVED***
goog.ui.Bubble.prototype.setTimeout = function(timeout) {
  this.timeout_ = timeout;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the bubble should be automatically hidden whenever user clicks
***REMOVED*** outside the bubble element.
***REMOVED***
***REMOVED*** @param {boolean} autoHide Whether to hide if user clicks outside the bubble.
***REMOVED***
goog.ui.Bubble.prototype.setAutoHide = function(autoHide) {
  this.popup_.setAutoHide(autoHide);
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the bubble should be visible.
***REMOVED***
***REMOVED*** @param {boolean} visible Desired visibility state.
***REMOVED***
goog.ui.Bubble.prototype.setVisible = function(visible) {
  if (visible && !this.popup_.isVisible()) {
    this.configureElement_();
  }
  this.popup_.setVisible(visible);
  if (!this.popup_.isVisible()) {
    this.unconfigureElement_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the bubble is visible.
***REMOVED***
goog.ui.Bubble.prototype.isVisible = function() {
  return this.popup_.isVisible();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Bubble.prototype.disposeInternal = function() {
  this.unconfigureElement_();
  this.popup_.dispose();
  this.popup_ = null;
  goog.ui.Bubble.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** Creates element's contents and configures all timers. This is called on
***REMOVED*** setVisible(true).
***REMOVED*** @private
***REMOVED***
goog.ui.Bubble.prototype.configureElement_ = function() {
  if (!this.isInDocument()) {
    throw Error('You must render the bubble before showing it!');
  }

  var element = this.getElement();
  var corner = this.popup_.getPinnedCorner();
  element.innerHTML = this.computeHtmlForCorner_(corner);

  if (typeof this.message_ == 'object') {
    var messageDiv = this.getDomHelper().getElement(this.messageId_);
    this.getDomHelper().appendChild(messageDiv, this.message_);
  }
  var closeButton = this.getDomHelper().getElement(this.closeButtonId_);
  this.listener_ = goog.events.listen(closeButton,
        goog.events.EventType.CLICK, this.hideBubble_, false, this);

  if (this.timeout_) {
    this.timerId_ = goog.Timer.callOnce(this.hideBubble_, this.timeout_, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets rid of the element's contents and all assoicated timers and listeners.
***REMOVED*** This is called on dispose as well as on setVisible(false).
***REMOVED*** @private
***REMOVED***
goog.ui.Bubble.prototype.unconfigureElement_ = function() {
  if (this.listener_) {
    goog.events.unlistenByKey(this.listener_);
    this.listener_ = null;
  }
  if (this.timerId_) {
    goog.Timer.clear(this.timerId_);
    this.timerId = null;
  }

  var element = this.getElement();
  if (element) {
    this.getDomHelper().removeChildren(element);
    element.innerHTML = '';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Computes bubble position based on anchored element.
***REMOVED***
***REMOVED*** @param {Element} anchorElement The element to which we are attaching.
***REMOVED*** @param {goog.positioning.Corner} corner The bubble corner used for
***REMOVED***     positioning.
***REMOVED*** @private
***REMOVED***
goog.ui.Bubble.prototype.setAnchoredPosition_ = function(anchorElement,
    corner) {
  this.popup_.setPinnedCorner(corner);
  var margin = this.createMarginForCorner_(corner);
  this.popup_.setMargin(margin);
  var anchorCorner = goog.positioning.flipCorner(corner);
  this.popup_.setPosition(new goog.positioning.AnchoredPosition(
      anchorElement, anchorCorner));
***REMOVED***


***REMOVED***
***REMOVED*** Hides the bubble. This is called asynchronously by timer of event processor
***REMOVED*** for the mouse click on the close button.
***REMOVED*** @private
***REMOVED***
goog.ui.Bubble.prototype.hideBubble_ = function() {
  this.setVisible(false);
***REMOVED***


***REMOVED***
***REMOVED*** Returns an AnchoredPosition that will position the bubble optimally
***REMOVED*** given the position of the anchor element and the size of the viewport.
***REMOVED***
***REMOVED*** @param {Element} anchorElement The element to which the bubble is attached.
***REMOVED*** @return {goog.ui.Popup.AnchoredPosition} The AnchoredPosition to give to
***REMOVED***     {@link #setPosition}.
***REMOVED***
goog.ui.Bubble.prototype.getComputedAnchoredPosition = function(anchorElement) {
  return new goog.ui.Popup.AnchoredPosition(
      anchorElement, this.computePinnedCorner_(anchorElement));
***REMOVED***


***REMOVED***
***REMOVED*** Computes the pinned corner for the bubble.
***REMOVED***
***REMOVED*** @param {Element} anchorElement The element to which the button is attached.
***REMOVED*** @return {goog.positioning.Corner} The pinned corner.
***REMOVED*** @private
***REMOVED***
goog.ui.Bubble.prototype.computePinnedCorner_ = function(anchorElement) {
  var doc = this.getDomHelper().getOwnerDocument(anchorElement);
  var viewportElement = goog.style.getClientViewportElement(doc);
  var viewportWidth = viewportElement.offsetWidth;
  var viewportHeight = viewportElement.offsetHeight;
  var anchorElementOffset = goog.style.getPageOffset(anchorElement);
  var anchorElementSize = goog.style.getSize(anchorElement);
  var anchorType = 0;
  // right margin or left?
  if (viewportWidth - anchorElementOffset.x - anchorElementSize.width >
      anchorElementOffset.x) {
    anchorType += 1;
  }
  // attaches to the top or to the bottom?
  if (viewportHeight - anchorElementOffset.y - anchorElementSize.height >
      anchorElementOffset.y) {
    anchorType += 2;
  }
  return goog.ui.Bubble.corners_[anchorType];
***REMOVED***


***REMOVED***
***REMOVED*** Computes the right offset for a given bubble corner
***REMOVED*** and creates a margin element for it. This is done to have the
***REMOVED*** button anchor element on its frame rather than on the corner.
***REMOVED***
***REMOVED*** @param {goog.positioning.Corner} corner The corner.
***REMOVED*** @return {goog.math.Box} the computed margin. Only left or right fields are
***REMOVED***     non-zero, but they may be negative.
***REMOVED*** @private
***REMOVED***
goog.ui.Bubble.prototype.createMarginForCorner_ = function(corner) {
  var margin = new goog.math.Box(0, 0, 0, 0);
  if (corner & goog.positioning.CornerBit.RIGHT) {
    margin.right -= this.config_.marginShift;
  } else {
    margin.left -= this.config_.marginShift;
  }
  return margin;
***REMOVED***


***REMOVED***
***REMOVED*** Computes the HTML string for a given bubble orientation.
***REMOVED***
***REMOVED*** @param {goog.positioning.Corner} corner The corner.
***REMOVED*** @return {string} The HTML string to place inside the bubble's popup.
***REMOVED*** @private
***REMOVED***
goog.ui.Bubble.prototype.computeHtmlForCorner_ = function(corner) {
  var bubbleTopClass;
  var bubbleBottomClass;
  switch (corner) {
    case goog.positioning.Corner.TOP_LEFT:
      bubbleTopClass = this.config_.cssBubbleTopLeftAnchor;
      bubbleBottomClass = this.config_.cssBubbleBottomNoAnchor;
      break;
    case goog.positioning.Corner.TOP_RIGHT:
      bubbleTopClass = this.config_.cssBubbleTopRightAnchor;
      bubbleBottomClass = this.config_.cssBubbleBottomNoAnchor;
      break;
    case goog.positioning.Corner.BOTTOM_LEFT:
      bubbleTopClass = this.config_.cssBubbleTopNoAnchor;
      bubbleBottomClass = this.config_.cssBubbleBottomLeftAnchor;
      break;
    case goog.positioning.Corner.BOTTOM_RIGHT:
      bubbleTopClass = this.config_.cssBubbleTopNoAnchor;
      bubbleBottomClass = this.config_.cssBubbleBottomRightAnchor;
      break;
    default:
      throw Error('This corner type is not supported by bubble!');
  }
  var message = null;
  if (typeof this.message_ == 'object') {
    message = '<div id="' + this.messageId_ + '">';
  } else {
    message = this.message_;
  }
  var html =
      '<table border=0 cellspacing=0 cellpadding=0 style="z-index:1"' +
      ' width=' + this.config_.bubbleWidth + '>' +
      '<tr><td colspan=4 class="' + bubbleTopClass + '">' +
      '<tr>' +
      '<td class="' + this.config_.cssBubbleLeft + '">' +
      '<td class="' + this.config_.cssBubbleFont + '"' +
      ' style="padding:0 4;background:white">' + message +
      '<td id="' + this.closeButtonId_ + '"' +
      ' class="' + this.config_.cssCloseButton + '"/>' +
      '<td class="' + this.config_.cssBubbleRight + '">' +
      '<tr>' +
      '<td colspan=4 class="' + bubbleBottomClass + '">' +
      '</table>';
  return html;
***REMOVED***


***REMOVED***
***REMOVED*** A default configuration for the bubble.
***REMOVED***
***REMOVED*** @type {Object}
***REMOVED***
goog.ui.Bubble.defaultConfig = {
  bubbleWidth: 147,
  marginShift: 60,
  cssBubbleFont: goog.getCssName('goog-bubble-font'),
  cssCloseButton: goog.getCssName('goog-bubble-close-button'),
  cssBubbleTopRightAnchor: goog.getCssName('goog-bubble-top-right-anchor'),
  cssBubbleTopLeftAnchor: goog.getCssName('goog-bubble-top-left-anchor'),
  cssBubbleTopNoAnchor: goog.getCssName('goog-bubble-top-no-anchor'),
  cssBubbleBottomRightAnchor:
      goog.getCssName('goog-bubble-bottom-right-anchor'),
  cssBubbleBottomLeftAnchor: goog.getCssName('goog-bubble-bottom-left-anchor'),
  cssBubbleBottomNoAnchor: goog.getCssName('goog-bubble-bottom-no-anchor'),
  cssBubbleLeft: goog.getCssName('goog-bubble-left'),
  cssBubbleRight: goog.getCssName('goog-bubble-right')
***REMOVED***


***REMOVED***
***REMOVED*** An auxiliary array optimizing the corner computation.
***REMOVED***
***REMOVED*** @type {Array.<goog.positioning.Corner>}
***REMOVED*** @private
***REMOVED***
goog.ui.Bubble.corners_ = [
  goog.positioning.Corner.BOTTOM_RIGHT,
  goog.positioning.Corner.BOTTOM_LEFT,
  goog.positioning.Corner.TOP_RIGHT,
  goog.positioning.Corner.TOP_LEFT
];
