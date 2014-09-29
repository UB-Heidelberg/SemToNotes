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
***REMOVED*** @fileoverview An HSV (hue/saturation/value) color palette/picker
***REMOVED*** implementation. Inspired by examples like
***REMOVED*** http://johndyer.name/lab/colorpicker/ and the author's initial work. This
***REMOVED*** control allows for more control in picking colors than a simple swatch-based
***REMOVED*** palette. Without the styles from the demo css file, only a hex color label
***REMOVED*** and input field show up.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author smcbride@google.com (Sean McBride)
***REMOVED*** @author manucornet@google.com (Manu Cornet)
***REMOVED*** @see ../demos/hsvpalette.html
***REMOVED***

goog.provide('goog.ui.HsvPalette');

goog.require('goog.color');
goog.require('goog.dom');
***REMOVED***
***REMOVED***
goog.require('goog.events.Event');
***REMOVED***
goog.require('goog.events.InputHandler');
goog.require('goog.style');
goog.require('goog.style.bidi');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Creates an HSV palette. Allows a user to select the hue, saturation and
***REMOVED*** value/brightness.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @param {string=} opt_color Optional initial color (default is red).
***REMOVED*** @param {string=} opt_class Optional base for creating classnames (default is
***REMOVED***     goog.getCssName('goog-hsv-palette')).
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
***REMOVED***
goog.ui.HsvPalette = function(opt_domHelper, opt_color, opt_class) {
  goog.ui.Component.call(this, opt_domHelper);

  this.setColor_(opt_color || '#f00');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The base class name for the component.
  ***REMOVED*** @type {string}
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.className = opt_class || goog.getCssName('goog-hsv-palette');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The document which is being listened to.
  ***REMOVED*** type {HTMLDocument}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.document_ = this.getDomHelper().getDocument();
***REMOVED***
goog.inherits(goog.ui.HsvPalette, goog.ui.Component);
// TODO(user): Make this inherit from goog.ui.Control and split this into
// a control and a renderer.


***REMOVED***
***REMOVED*** DOM element representing the hue/saturation background image.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.HsvPalette.prototype.hsImageEl_;


***REMOVED***
***REMOVED*** DOM element representing the hue/saturation handle.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.HsvPalette.prototype.hsHandleEl_;


***REMOVED***
***REMOVED*** DOM element representing the value background image.
***REMOVED*** @type {Element}
***REMOVED*** @protected
***REMOVED***
goog.ui.HsvPalette.prototype.valueBackgroundImageElement;


***REMOVED***
***REMOVED*** DOM element representing the value handle.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.HsvPalette.prototype.vHandleEl_;


***REMOVED***
***REMOVED*** DOM element representing the current color swatch.
***REMOVED*** @type {Element}
***REMOVED*** @protected
***REMOVED***
goog.ui.HsvPalette.prototype.swatchElement;


***REMOVED***
***REMOVED*** DOM element representing the hex color input text field.
***REMOVED*** @type {Element}
***REMOVED*** @protected
***REMOVED***
goog.ui.HsvPalette.prototype.inputElement;


***REMOVED***
***REMOVED*** Input handler object for the hex value input field.
***REMOVED*** @type {goog.events.InputHandler}
***REMOVED*** @private
***REMOVED***
goog.ui.HsvPalette.prototype.inputHandler_;


***REMOVED***
***REMOVED*** Listener key for the mousemove event (during a drag operation).
***REMOVED*** @type {goog.events.Key}
***REMOVED*** @private
***REMOVED***
goog.ui.HsvPalette.prototype.mouseMoveListener_;


***REMOVED***
***REMOVED*** Listener key for the mouseup event (during a drag operation).
***REMOVED*** @type {goog.events.Key}
***REMOVED*** @private
***REMOVED***
goog.ui.HsvPalette.prototype.mouseUpListener_;


***REMOVED***
***REMOVED*** Gets the color that is currently selected in this color picker.
***REMOVED*** @return {string} The string of the selected color.
***REMOVED***
goog.ui.HsvPalette.prototype.getColor = function() {
  return this.color_;
***REMOVED***


***REMOVED***
***REMOVED*** Alpha transparency of the currently selected color, in [0, 1].
***REMOVED*** For the HSV palette this always returns 1. The HSVA palette overrides
***REMOVED*** this method.
***REMOVED*** @return {number} The current alpha value.
***REMOVED***
goog.ui.HsvPalette.prototype.getAlpha = function() {
  return 1;
***REMOVED***


***REMOVED***
***REMOVED*** Updates the text entry field.
***REMOVED*** @protected
***REMOVED***
goog.ui.HsvPalette.prototype.updateInput = function() {
  var parsed;
  try {
    parsed = goog.color.parse(this.inputElement.value).hex;
  } catch (e) {
    // ignore
  }
  if (this.color_ != parsed) {
    this.inputElement.value = this.color_;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets which color is selected and update the UI.
***REMOVED*** @param {string} color The selected color.
***REMOVED***
goog.ui.HsvPalette.prototype.setColor = function(color) {
  if (color != this.color_) {
    this.setColor_(color);
    this.updateUi();
    this.dispatchEvent(goog.ui.Component.EventType.ACTION);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets which color is selected.
***REMOVED*** @param {string} color The selected color.
***REMOVED*** @private
***REMOVED***
goog.ui.HsvPalette.prototype.setColor_ = function(color) {
  var rgbHex = goog.color.parse(color).hex;
  var rgbArray = goog.color.hexToRgb(rgbHex);
  this.hsv_ = goog.color.rgbArrayToHsv(rgbArray);
  // Hue is divided by 360 because the documentation for goog.color is currently
  // incorrect.
  // TODO(user): Fix this, see http://1324469 .
  this.hsv_[0] = this.hsv_[0] / 360;
  this.color_ = rgbHex;
***REMOVED***


***REMOVED***
***REMOVED*** Alters the hue, saturation, and/or value of the currently selected color and
***REMOVED*** updates the UI.
***REMOVED*** @param {?number=} opt_hue (optional) hue in [0, 1].
***REMOVED*** @param {?number=} opt_saturation (optional) saturation in [0, 1].
***REMOVED*** @param {?number=} opt_value (optional) value in [0, 255].
***REMOVED***
goog.ui.HsvPalette.prototype.setHsv = function(opt_hue,
                                               opt_saturation,
                                               opt_value) {
  if (opt_hue != null || opt_saturation != null || opt_value != null) {
    this.setHsv_(opt_hue, opt_saturation, opt_value);
    this.updateUi();
    this.dispatchEvent(goog.ui.Component.EventType.ACTION);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Alters the hue, saturation, and/or value of the currently selected color.
***REMOVED*** @param {?number=} opt_hue (optional) hue in [0, 1].
***REMOVED*** @param {?number=} opt_saturation (optional) saturation in [0, 1].
***REMOVED*** @param {?number=} opt_value (optional) value in [0, 255].
***REMOVED*** @private
***REMOVED***
goog.ui.HsvPalette.prototype.setHsv_ = function(opt_hue,
                                                opt_saturation,
                                                opt_value) {
  this.hsv_[0] = (opt_hue != null) ? opt_hue : this.hsv_[0];
  this.hsv_[1] = (opt_saturation != null) ? opt_saturation : this.hsv_[1];
  this.hsv_[2] = (opt_value != null) ? opt_value : this.hsv_[2];
  // Hue is multiplied by 360 because the documentation for goog.color is
  // currently incorrect.
  // TODO(user): Fix this, see http://1324469 .
  this.color_ = goog.color.hsvArrayToHex([
    this.hsv_[0]***REMOVED*** 360,
    this.hsv_[1],
    this.hsv_[2]
  ]);
***REMOVED***


***REMOVED***
***REMOVED*** HsvPalettes cannot be used to decorate pre-existing html, since the
***REMOVED*** structure they build is fairly complicated.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {boolean} Returns always false.
***REMOVED*** @override
***REMOVED***
goog.ui.HsvPalette.prototype.canDecorate = function(element) {
  return false;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.HsvPalette.prototype.createDom = function() {
  var dom = this.getDomHelper();
  var noalpha = (goog.userAgent.IE && !goog.userAgent.isVersion('7')) ?
      ' ' + goog.getCssName(this.className, 'noalpha') : '';

  var backdrop = dom.createDom(goog.dom.TagName.DIV,
      goog.getCssName(this.className, 'hs-backdrop'));

  this.hsHandleEl_ = dom.createDom(goog.dom.TagName.DIV,
      goog.getCssName(this.className, 'hs-handle'));

  this.hsImageEl_ = dom.createDom(goog.dom.TagName.DIV,
      goog.getCssName(this.className, 'hs-image'),
      this.hsHandleEl_);

  this.valueBackgroundImageElement = dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName(this.className, 'v-image'));

  this.vHandleEl_ = dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName(this.className, 'v-handle'));

  this.swatchElement = dom.createDom(goog.dom.TagName.DIV,
      goog.getCssName(this.className, 'swatch'));

  this.inputElement = dom.createDom('input', {
    'class': goog.getCssName(this.className, 'input'),
    'type': 'text', 'dir': 'ltr'
  });

  var labelElement = dom.createDom('label', null, this.inputElement);

  var element = dom.createDom(goog.dom.TagName.DIV,
      this.className + noalpha,
      backdrop,
      this.hsImageEl_,
      this.valueBackgroundImageElement,
      this.vHandleEl_,
      this.swatchElement,
      labelElement);

  this.setElementInternal(element);

  // TODO(arv): Set tabIndex
***REMOVED***


***REMOVED***
***REMOVED*** Renders the color picker inside the provided element. This will override the
***REMOVED*** current content of the element.
***REMOVED*** @override
***REMOVED***
goog.ui.HsvPalette.prototype.enterDocument = function() {
  goog.ui.HsvPalette.superClass_.enterDocument.call(this);

  // TODO(user): Accessibility.

  this.updateUi();

  var handler = this.getHandler();
  handler.listen(this.getElement(), goog.events.EventType.MOUSEDOWN,
      this.handleMouseDown, false, this);

  // Cannot create InputHandler in createDom because IE throws an exception
  // on document.activeElement
  if (!this.inputHandler_) {
    this.inputHandler_ = new goog.events.InputHandler(this.inputElement);
  }

  handler.listen(this.inputHandler_,
      goog.events.InputHandler.EventType.INPUT, this.handleInput, false, this);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.HsvPalette.prototype.disposeInternal = function() {
  goog.ui.HsvPalette.superClass_.disposeInternal.call(this);

  delete this.hsImageEl_;
  delete this.hsHandleEl_;
  delete this.valueBackgroundImageElement;
  delete this.vHandleEl_;
  delete this.swatchElement;
  delete this.inputElement;
  if (this.inputHandler_) {
    this.inputHandler_.dispose();
    delete this.inputHandler_;
  }
  goog.events.unlistenByKey(this.mouseMoveListener_);
  goog.events.unlistenByKey(this.mouseUpListener_);
***REMOVED***


***REMOVED***
***REMOVED*** Updates the position, opacity, and styles for the UI representation of the
***REMOVED*** palette.
***REMOVED*** @protected
***REMOVED***
goog.ui.HsvPalette.prototype.updateUi = function() {
  if (this.isInDocument()) {
    var h = this.hsv_[0];
    var s = this.hsv_[1];
    var v = this.hsv_[2];

    var left = this.hsImageEl_.offsetWidth***REMOVED*** h;

    // We don't use a flipped gradient image in RTL, so we need to flip the
    // offset in RTL so that it still hovers over the correct color on the
    // gradiant.
    if (this.isRightToLeft()) {
      left = this.hsImageEl_.offsetWidth - left;
    }

    // We also need to account for the handle size.
    var handleOffset = Math.ceil(this.hsHandleEl_.offsetWidth / 2);
    left -= handleOffset;

    var top = this.hsImageEl_.offsetHeight***REMOVED*** (1 - s);
    // Account for the handle size.
    top -= Math.ceil(this.hsHandleEl_.offsetHeight / 2);

    goog.style.bidi.setPosition(this.hsHandleEl_, left, top,
        this.isRightToLeft());

    top = this.valueBackgroundImageElement.offsetTop -
        Math.floor(this.vHandleEl_.offsetHeight / 2) +
        this.valueBackgroundImageElement.offsetHeight***REMOVED*** ((255 - v) / 255);

    this.vHandleEl_.style.top = top + 'px';
    goog.style.setOpacity(this.hsImageEl_, (v / 255));

    goog.style.setStyle(this.valueBackgroundImageElement, 'background-color',
        goog.color.hsvToHex(this.hsv_[0]***REMOVED*** 360, this.hsv_[1], 255));

    goog.style.setStyle(this.swatchElement, 'background-color', this.color_);
    goog.style.setStyle(this.swatchElement, 'color',
                        (this.hsv_[2] > 255 / 2) ? '#000' : '#fff');
    this.updateInput();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles mousedown events on palette UI elements.
***REMOVED*** @param {goog.events.BrowserEvent} e Event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.HsvPalette.prototype.handleMouseDown = function(e) {
  if (e.target == this.valueBackgroundImageElement ||
      e.target == this.vHandleEl_) {
    // Setup value change listeners
    var b = goog.style.getBounds(this.valueBackgroundImageElement);
    this.handleMouseMoveV_(b, e);
    this.mouseMoveListener_ = goog.events.listen(this.document_,
        goog.events.EventType.MOUSEMOVE,
        goog.bind(this.handleMouseMoveV_, this, b));
    this.mouseUpListener_ = goog.events.listen(this.document_,
        goog.events.EventType.MOUSEUP, this.handleMouseUp, false, this);
  } else if (e.target == this.hsImageEl_ || e.target == this.hsHandleEl_) {
    // Setup hue/saturation change listeners
    var b = goog.style.getBounds(this.hsImageEl_);
    this.handleMouseMoveHs_(b, e);
    this.mouseMoveListener_ = goog.events.listen(this.document_,
        goog.events.EventType.MOUSEMOVE,
        goog.bind(this.handleMouseMoveHs_, this, b));
    this.mouseUpListener_ = goog.events.listen(this.document_,
        goog.events.EventType.MOUSEUP, this.handleMouseUp, false, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles mousemove events on the document once a drag operation on the value
***REMOVED*** slider has started.
***REMOVED*** @param {goog.math.Rect} b Boundaries of the value slider object at the start
***REMOVED***     of the drag operation.
***REMOVED*** @param {goog.events.BrowserEvent} e Event object.
***REMOVED*** @private
***REMOVED***
goog.ui.HsvPalette.prototype.handleMouseMoveV_ = function(b, e) {
  e.preventDefault();
  var vportPos = this.getDomHelper().getDocumentScroll();

  var height = Math.min(
      Math.max(vportPos.y + e.clientY, b.top),
      b.top + b.height);

  var newV = Math.round(
      255***REMOVED*** (b.top + b.height - height) / b.height);

  this.setHsv(null, null, newV);
***REMOVED***


***REMOVED***
***REMOVED*** Handles mousemove events on the document once a drag operation on the
***REMOVED*** hue/saturation slider has started.
***REMOVED*** @param {goog.math.Rect} b Boundaries of the value slider object at the start
***REMOVED***     of the drag operation.
***REMOVED*** @param {goog.events.BrowserEvent} e Event object.
***REMOVED*** @private
***REMOVED***
goog.ui.HsvPalette.prototype.handleMouseMoveHs_ = function(b, e) {
  e.preventDefault();
  var vportPos = this.getDomHelper().getDocumentScroll();
  var newH = (Math.min(Math.max(vportPos.x + e.clientX, b.left),
      b.left + b.width) - b.left) / b.width;
  var newS = (-Math.min(Math.max(vportPos.y + e.clientY, b.top),
      b.top + b.height) + b.top + b.height) / b.height;
  this.setHsv(newH, newS, null);
***REMOVED***


***REMOVED***
***REMOVED*** Handles mouseup events on the document, which ends a drag operation.
***REMOVED*** @param {goog.events.Event} e Event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.HsvPalette.prototype.handleMouseUp = function(e) {
  goog.events.unlistenByKey(this.mouseMoveListener_);
  goog.events.unlistenByKey(this.mouseUpListener_);
***REMOVED***


***REMOVED***
***REMOVED*** Handles input events on the hex value input field.
***REMOVED*** @param {goog.events.Event} e Event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.HsvPalette.prototype.handleInput = function(e) {
  if (/^#[0-9a-f]{6}$/i.test(this.inputElement.value)) {
    this.setColor(this.inputElement.value);
  }
***REMOVED***
