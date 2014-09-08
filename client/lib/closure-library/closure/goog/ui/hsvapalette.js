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
***REMOVED*** @fileoverview An HSVA (hue/saturation/value/alpha) color palette/picker
***REMOVED*** implementation.
***REMOVED*** Without the styles from the demo css file, only a hex color label and input
***REMOVED*** field show up.
***REMOVED***
***REMOVED*** @see ../demos/hsvapalette.html
***REMOVED***

goog.provide('goog.ui.HsvaPalette');

goog.require('goog.array');
goog.require('goog.color.alpha');
goog.require('goog.dom.TagName');
***REMOVED***
***REMOVED***
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.HsvPalette');



***REMOVED***
***REMOVED*** Creates an HSVA palette. Allows a user to select the hue, saturation,
***REMOVED*** value/brightness and alpha/opacity.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @param {string=} opt_color Optional initial color, without alpha (default is
***REMOVED***     red).
***REMOVED*** @param {number=} opt_alpha Optional initial alpha (default is 1).
***REMOVED*** @param {string=} opt_class Optional base for creating classnames (default is
***REMOVED***     'goog-hsva-palette').
***REMOVED*** @extends {goog.ui.HsvPalette}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.ui.HsvaPalette = function(opt_domHelper, opt_color, opt_alpha, opt_class) {
  goog.ui.HsvaPalette.base(
      this, 'constructor', opt_domHelper, opt_color, opt_class);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Alpha transparency of the currently selected color, in [0, 1]. When
  ***REMOVED*** undefined, the palette will behave as a non-transparent HSV palette,
  ***REMOVED*** assuming full opacity.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.alpha_ = goog.isDef(opt_alpha) ? opt_alpha : 1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @override
 ***REMOVED*****REMOVED***
  this.className = opt_class || goog.getCssName('goog-hsva-palette');
***REMOVED***
goog.inherits(goog.ui.HsvaPalette, goog.ui.HsvPalette);


***REMOVED***
***REMOVED*** DOM element representing the alpha background image.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.HsvaPalette.prototype.aImageEl_;


***REMOVED***
***REMOVED*** DOM element representing the alpha handle.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.HsvaPalette.prototype.aHandleEl_;


***REMOVED***
***REMOVED*** DOM element representing the swatch backdrop image.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.HsvaPalette.prototype.swatchBackdropEl_;


***REMOVED*** @override***REMOVED***
goog.ui.HsvaPalette.prototype.getAlpha = function() {
  return this.alpha_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets which color is selected and update the UI. The passed color should be
***REMOVED*** in #rrggbb format. The alpha value will be set to 1.
***REMOVED*** @param {number} alpha The selected alpha value, in [0, 1].
***REMOVED***
goog.ui.HsvaPalette.prototype.setAlpha = function(alpha) {
  this.setColorAlphaHelper_(this.color_, alpha);
***REMOVED***


***REMOVED***
***REMOVED*** Sets which color is selected and update the UI. The passed color should be
***REMOVED*** in #rrggbb format. The alpha value will be set to 1.
***REMOVED*** @param {string} color The selected color.
***REMOVED*** @override
***REMOVED***
goog.ui.HsvaPalette.prototype.setColor = function(color) {
  this.setColorAlphaHelper_(color, 1);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the color that is currently selected in this color picker, in #rrggbbaa
***REMOVED*** format.
***REMOVED*** @return {string} The string of the selected color with alpha.
***REMOVED***
goog.ui.HsvaPalette.prototype.getColorRgbaHex = function() {
  var alphaHex = Math.floor(this.alpha_***REMOVED*** 255).toString(16);
  return this.color_ + (alphaHex.length == 1 ? '0' + alphaHex : alphaHex);
***REMOVED***


***REMOVED***
***REMOVED*** Sets which color is selected and update the UI. The passed color should be
***REMOVED*** in #rrggbbaa format. The alpha value will be set to 1.
***REMOVED*** @param {string} color The selected color with alpha.
***REMOVED***
goog.ui.HsvaPalette.prototype.setColorRgbaHex = function(color) {
  var parsed = goog.ui.HsvaPalette.parseColorRgbaHex_(color);
  this.setColorAlphaHelper_(parsed[0], parsed[1]);
***REMOVED***


***REMOVED***
***REMOVED*** Sets which color and alpha value are selected and update the UI. The passed
***REMOVED*** color should be in #rrggbb format.
***REMOVED*** @param {string} color The selected color in #rrggbb format.
***REMOVED*** @param {number} alpha The selected alpha value, in [0, 1].
***REMOVED*** @private
***REMOVED***
goog.ui.HsvaPalette.prototype.setColorAlphaHelper_ = function(color, alpha) {
  var colorChange = this.color_ != color;
  var alphaChange = this.alpha_ != alpha;
  this.alpha_ = alpha;
  this.color_ = color;
  if (colorChange) {
    // This is to prevent multiple event dispatches.
    this.setColorInternal(color);
  }
  if (colorChange || alphaChange) {
    this.updateUi();
    this.dispatchEvent(goog.ui.Component.EventType.ACTION);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.HsvaPalette.prototype.createDom = function() {
  goog.ui.HsvaPalette.base(this, 'createDom');

  var dom = this.getDomHelper();
  this.aImageEl_ = dom.createDom(
      goog.dom.TagName.DIV, goog.getCssName(this.className, 'a-image'));
  this.aHandleEl_ = dom.createDom(
      goog.dom.TagName.DIV, goog.getCssName(this.className, 'a-handle'));
  this.swatchBackdropEl_ = dom.createDom(
      goog.dom.TagName.DIV, goog.getCssName(this.className, 'swatch-backdrop'));
  var element = this.getElement();
  dom.appendChild(element, this.aImageEl_);
  dom.appendChild(element, this.aHandleEl_);
  dom.appendChild(element, this.swatchBackdropEl_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.HsvaPalette.prototype.disposeInternal = function() {
  goog.ui.HsvaPalette.base(this, 'disposeInternal');

  delete this.aImageEl_;
  delete this.aHandleEl_;
  delete this.swatchBackdropEl_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.HsvaPalette.prototype.updateUi = function() {
  goog.ui.HsvaPalette.base(this, 'updateUi');
  if (this.isInDocument()) {
    var a = this.alpha_***REMOVED*** 255;
    var top = this.aImageEl_.offsetTop -
        Math.floor(this.aHandleEl_.offsetHeight / 2) +
        this.aImageEl_.offsetHeight***REMOVED*** ((255 - a) / 255);
    this.aHandleEl_.style.top = top + 'px';
    this.aImageEl_.style.backgroundColor = this.color_;
    goog.style.setOpacity(this.swatchElement, a / 255);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.HsvaPalette.prototype.updateInput = function() {
  if (!goog.array.equals([this.color_, this.alpha_],
      goog.ui.HsvaPalette.parseUserInput_(this.inputElement.value))) {
    this.inputElement.value = this.getColorRgbaHex();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.HsvaPalette.prototype.handleMouseDown = function(e) {
  goog.ui.HsvaPalette.base(this, 'handleMouseDown', e);
  if (e.target == this.aImageEl_ || e.target == this.aHandleEl_) {
    // Setup value change listeners
    var b = goog.style.getBounds(this.valueBackgroundImageElement);
    this.handleMouseMoveA_(b, e);
    this.mouseMoveListener = goog.events.listen(
        this.getDomHelper().getDocument(),
        goog.events.EventType.MOUSEMOVE,
        goog.bind(this.handleMouseMoveA_, this, b));
    this.mouseUpListener = goog.events.listen(
        this.getDomHelper().getDocument(),
        goog.events.EventType.MOUSEUP, this.handleMouseUp, false, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles mousemove events on the document once a drag operation on the alpha
***REMOVED*** slider has started.
***REMOVED*** @param {goog.math.Rect} b Boundaries of the value slider object at the start
***REMOVED***     of the drag operation.
***REMOVED*** @param {goog.events.Event} e Event object.
***REMOVED*** @private
***REMOVED***
goog.ui.HsvaPalette.prototype.handleMouseMoveA_ = function(b, e) {
  e.preventDefault();
  var vportPos = this.getDomHelper().getDocumentScroll();
  var newA = (b.top + b.height - Math.min(
      Math.max(vportPos.y + e.clientY, b.top),
      b.top + b.height)) / b.height;
  this.setAlpha(newA);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.HsvaPalette.prototype.handleInput = function(e) {
  var parsed = goog.ui.HsvaPalette.parseUserInput_(this.inputElement.value);
  if (parsed) {
    this.setColorAlphaHelper_(parsed[0], parsed[1]);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Parses an #rrggbb or #rrggbbaa color string.
***REMOVED*** @param {string} value User-entered color value.
***REMOVED*** @return {Array} A two element array [color, alpha], where color is #rrggbb
***REMOVED***     and alpha is in [0, 1]. Null if the argument was invalid.
***REMOVED*** @private
***REMOVED***
goog.ui.HsvaPalette.parseUserInput_ = function(value) {
  if (/^#?[0-9a-f]{8}$/i.test(value)) {
    return goog.ui.HsvaPalette.parseColorRgbaHex_(value);
  } else if (/^#?[0-9a-f]{6}$/i.test(value)) {
    return [value, 1];
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Parses a #rrggbbaa color string.
***REMOVED*** @param {string} color The color and alpha in #rrggbbaa format.
***REMOVED*** @return {!Array} A two element array [color, alpha], where color is #rrggbb
***REMOVED***     and alpha is in [0, 1].
***REMOVED*** @private
***REMOVED***
goog.ui.HsvaPalette.parseColorRgbaHex_ = function(color) {
  var hex = goog.color.alpha.parse(color).hex;
  return [
    goog.color.alpha.extractHexColor(hex),
    parseInt(goog.color.alpha.extractAlpha(hex), 16) / 255
  ];
***REMOVED***
