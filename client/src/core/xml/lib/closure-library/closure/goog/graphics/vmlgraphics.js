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
***REMOVED*** @fileoverview VmlGraphics sub class that uses VML to draw the graphics.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author yoah@google.com (Yoah Bar-David)
***REMOVED***


goog.provide('goog.graphics.VmlGraphics');


goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
***REMOVED***
goog.require('goog.graphics.AbstractGraphics');
goog.require('goog.graphics.Font');
goog.require('goog.graphics.LinearGradient');
goog.require('goog.graphics.SolidFill');
goog.require('goog.graphics.Stroke');
goog.require('goog.graphics.VmlEllipseElement');
goog.require('goog.graphics.VmlGroupElement');
goog.require('goog.graphics.VmlImageElement');
goog.require('goog.graphics.VmlPathElement');
goog.require('goog.graphics.VmlRectElement');
goog.require('goog.graphics.VmlTextElement');
goog.require('goog.math.Size');
goog.require('goog.string');
goog.require('goog.style');



***REMOVED***
***REMOVED*** A Graphics implementation for drawing using VML.
***REMOVED*** @param {string|number} width The (non-zero) width in pixels.  Strings
***REMOVED***     expressing percentages of parent with (e.g. '80%') are also accepted.
***REMOVED*** @param {string|number} height The (non-zero) height in pixels.  Strings
***REMOVED***     expressing percentages of parent with (e.g. '80%') are also accepted.
***REMOVED*** @param {?number=} opt_coordWidth The coordinate width - if
***REMOVED***     omitted or null, defaults to same as width.
***REMOVED*** @param {?number=} opt_coordHeight The coordinate height - if
***REMOVED***     omitted or null, defaults to same as height.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DOM helper object for the
***REMOVED***     document we want to render in.
***REMOVED***
***REMOVED*** @extends {goog.graphics.AbstractGraphics}
***REMOVED***
goog.graphics.VmlGraphics = function(width, height,
                                     opt_coordWidth, opt_coordHeight,
                                     opt_domHelper) {
  goog.graphics.AbstractGraphics.call(this, width, height,
                                      opt_coordWidth, opt_coordHeight,
                                      opt_domHelper);
  this.handler_ = new goog.events.EventHandler(this);
***REMOVED***
goog.inherits(goog.graphics.VmlGraphics, goog.graphics.AbstractGraphics);


***REMOVED***
***REMOVED*** The prefix to use for VML elements
***REMOVED*** @private
***REMOVED*** @type {string}
***REMOVED***
goog.graphics.VmlGraphics.VML_PREFIX_ = 'g_vml_';


***REMOVED***
***REMOVED*** The VML namespace URN
***REMOVED*** @private
***REMOVED*** @type {string}
***REMOVED***
goog.graphics.VmlGraphics.VML_NS_ = 'urn:schemas-microsoft-com:vml';


***REMOVED***
***REMOVED*** The VML behavior URL.
***REMOVED*** @private
***REMOVED*** @type {string}
***REMOVED***
goog.graphics.VmlGraphics.VML_IMPORT_ = '#default#VML';


***REMOVED***
***REMOVED*** Whether the document is using IE8 standards mode, and therefore needs hacks.
***REMOVED*** @private
***REMOVED*** @type {boolean}
***REMOVED***
goog.graphics.VmlGraphics.IE8_MODE_ = document.documentMode &&
    document.documentMode >= 8;


***REMOVED***
***REMOVED*** The coordinate multiplier to allow sub-pixel rendering
***REMOVED*** @type {number}
***REMOVED***
goog.graphics.VmlGraphics.COORD_MULTIPLIER = 100;


***REMOVED***
***REMOVED*** Converts the given size to a css size.  If it is a percentage, leaves it
***REMOVED*** alone.  Otherwise assumes px.
***REMOVED***
***REMOVED*** @param {number|string} size The size to use.
***REMOVED*** @return {string} The position adjusted for COORD_MULTIPLIER.
***REMOVED***
goog.graphics.VmlGraphics.toCssSize = function(size) {
  return goog.isString(size) && goog.string.endsWith(size, '%') ?
         size : parseFloat(size.toString()) + 'px';
***REMOVED***


***REMOVED***
***REMOVED*** Multiplies positioning coordinates by COORD_MULTIPLIER to allow sub-pixel
***REMOVED*** coordinates.  Also adds a half pixel offset to match SVG.
***REMOVED***
***REMOVED*** This function is internal for the VML supporting classes, and
***REMOVED*** should not be used externally.
***REMOVED***
***REMOVED*** @param {number|string} number A position in pixels.
***REMOVED*** @return {number} The position adjusted for COORD_MULTIPLIER.
***REMOVED***
goog.graphics.VmlGraphics.toPosCoord = function(number) {
  return Math.round((parseFloat(number.toString()) - 0.5)***REMOVED***
      goog.graphics.VmlGraphics.COORD_MULTIPLIER);
***REMOVED***


***REMOVED***
***REMOVED*** Add a "px" suffix to a number of pixels, and multiplies all coordinates by
***REMOVED*** COORD_MULTIPLIER to allow sub-pixel coordinates.
***REMOVED***
***REMOVED*** This function is internal for the VML supporting classes, and
***REMOVED*** should not be used externally.
***REMOVED***
***REMOVED*** @param {number|string} number A position in pixels.
***REMOVED*** @return {string} The position with suffix 'px'.
***REMOVED***
goog.graphics.VmlGraphics.toPosPx = function(number) {
  return goog.graphics.VmlGraphics.toPosCoord(number) + 'px';
***REMOVED***


***REMOVED***
***REMOVED*** Multiplies the width or height coordinate by COORD_MULTIPLIER to allow
***REMOVED*** sub-pixel coordinates.
***REMOVED***
***REMOVED*** This function is internal for the VML supporting classes, and
***REMOVED*** should not be used externally.
***REMOVED***
***REMOVED*** @param {string|number} number A size in units.
***REMOVED*** @return {number} The size multiplied by the correct factor.
***REMOVED***
goog.graphics.VmlGraphics.toSizeCoord = function(number) {
  return Math.round(parseFloat(number.toString())***REMOVED***
      goog.graphics.VmlGraphics.COORD_MULTIPLIER);
***REMOVED***


***REMOVED***
***REMOVED*** Add a "px" suffix to a number of pixels, and multiplies all coordinates by
***REMOVED*** COORD_MULTIPLIER to allow sub-pixel coordinates.
***REMOVED***
***REMOVED*** This function is internal for the VML supporting classes, and
***REMOVED*** should not be used externally.
***REMOVED***
***REMOVED*** @param {number|string} number A size in pixels.
***REMOVED*** @return {string} The size with suffix 'px'.
***REMOVED***
goog.graphics.VmlGraphics.toSizePx = function(number) {
  return goog.graphics.VmlGraphics.toSizeCoord(number) + 'px';
***REMOVED***


***REMOVED***
***REMOVED*** Sets an attribute on the given VML element, in the way best suited to the
***REMOVED*** current version of IE.  Should only be used in the goog.graphics package.
***REMOVED*** @param {Element} element The element to set an attribute
***REMOVED***     on.
***REMOVED*** @param {string} name The name of the attribute to set.
***REMOVED*** @param {string} value The value to set it to.
***REMOVED***
goog.graphics.VmlGraphics.setAttribute = function(element, name, value) {
  if (goog.graphics.VmlGraphics.IE8_MODE_) {
    element[name] = value;
  } else {
    element.setAttribute(name, value);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Event handler.
***REMOVED*** @type {goog.events.EventHandler}
***REMOVED*** @private
***REMOVED***
goog.graphics.VmlGraphics.prototype.handler_;


***REMOVED***
***REMOVED*** Creates a VML element. Used internally and by different VML classes.
***REMOVED*** @param {string} tagName The type of element to create.
***REMOVED*** @return {Element} The created element.
***REMOVED***
goog.graphics.VmlGraphics.prototype.createVmlElement = function(tagName) {
  var element =
      this.dom_.createElement(goog.graphics.VmlGraphics.VML_PREFIX_ + ':' +
                              tagName);
  element.id = goog.string.createUniqueString();
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the VML element with the given id that is a child of this graphics
***REMOVED*** object.
***REMOVED*** Should be considered package private, and not used externally.
***REMOVED*** @param {string} id The element id to find.
***REMOVED*** @return {Element} The element with the given id, or null if none is found.
***REMOVED***
goog.graphics.VmlGraphics.prototype.getVmlElement = function(id) {
  return this.dom_.getElement(id);
***REMOVED***


***REMOVED***
***REMOVED*** Resets the graphics so they will display properly on IE8.  Noop in older
***REMOVED*** versions.
***REMOVED*** @private
***REMOVED***
goog.graphics.VmlGraphics.prototype.updateGraphics_ = function() {
  if (goog.graphics.VmlGraphics.IE8_MODE_ && this.isInDocument()) {
    this.getElement().innerHTML = this.getElement().innerHTML;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Appends an element.
***REMOVED***
***REMOVED*** @param {goog.graphics.Element} element The element wrapper.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element
***REMOVED***     to append to. If not specified, appends to the main canvas.
***REMOVED*** @private
***REMOVED***
goog.graphics.VmlGraphics.prototype.append_ = function(element, opt_group) {
  var parent = opt_group || this.canvasElement;
  parent.getElement().appendChild(element.getElement());
  this.updateGraphics_();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the fill for the given element.
***REMOVED*** @param {goog.graphics.StrokeAndFillElement} element The element wrapper.
***REMOVED*** @param {goog.graphics.Fill?} fill The fill object.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGraphics.prototype.setElementFill = function(element, fill) {
  var vmlElement = element.getElement();
  this.removeFill(vmlElement);
  if (fill instanceof goog.graphics.SolidFill) {
    // NOTE(arv): VML does not understand 'transparent' so hard code support
    // for it.
    if (fill.getColor() == 'transparent') {
      vmlElement.filled = false;
    } else if (fill.getOpacity() != 1) {
      vmlElement.filled = true;
      // Set opacity (number 0-1 is translated to percent)
      var fillNode = this.createVmlElement('fill');
      fillNode.opacity = Math.round(fill.getOpacity()***REMOVED*** 100) + '%';
      fillNode.color = fill.getColor();
      vmlElement.appendChild(fillNode);
    } else {
      vmlElement.filled = true;
      vmlElement.fillcolor = fill.getColor();
    }
  } else if (fill instanceof goog.graphics.LinearGradient) {
    vmlElement.filled = true;
    // Add a 'fill' element
    var gradient = this.createVmlElement('fill');
    gradient.color = fill.getColor1();
    gradient.color2 = fill.getColor2();
    if (goog.isNumber(fill.getOpacity1())) {
      gradient.opacity = fill.getOpacity1();
    }
    if (goog.isNumber(fill.getOpacity2())) {
      gradient.opacity2 = fill.getOpacity2();
    }
    var angle = goog.math.angle(fill.getX1(), fill.getY1(),
        fill.getX2(), fill.getY2());
    // Our angles start from 0 to the right, and grow clockwise.
    // MSIE starts from 0 to top, and grows anti-clockwise.
    angle = Math.round(goog.math.standardAngle(270 - angle));
    gradient.angle = angle;
    gradient.type = 'gradient';
    vmlElement.appendChild(gradient);
  } else {
    vmlElement.filled = false;
  }
  this.updateGraphics_();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the stroke for the given element.
***REMOVED*** @param {goog.graphics.StrokeAndFillElement} element The element wrapper.
***REMOVED*** @param {goog.graphics.Stroke?} stroke The stroke object.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGraphics.prototype.setElementStroke = function(element,
    stroke) {
  var vmlElement = element.getElement();
  if (stroke) {
    vmlElement.stroked = true;

    var width = stroke.getWidth();
    if (goog.isString(width) && width.indexOf('px') == -1) {
      width = parseFloat(width);
    } else {
      width = width***REMOVED*** this.getPixelScaleX();
    }

    var strokeElement = vmlElement.getElementsByTagName('stroke')[0];
    if (width < 1) {
      strokeElement = strokeElement || this.createVmlElement('stroke');
      strokeElement.opacity = width;
      strokeElement.weight = '1px';
      strokeElement.color = stroke.getColor();
      vmlElement.appendChild(strokeElement);
    } else {
      if (strokeElement) {
        vmlElement.removeChild(strokeElement);
      }
      vmlElement.strokecolor = stroke.getColor();
      vmlElement.strokeweight = width + 'px';
    }
  } else {
    vmlElement.stroked = false;
  }
  this.updateGraphics_();
***REMOVED***


***REMOVED***
***REMOVED*** Set the transformation of an element.
***REMOVED*** @param {goog.graphics.Element} element The element wrapper.
***REMOVED*** @param {number} x The x coordinate of the translation transform.
***REMOVED*** @param {number} y The y coordinate of the translation transform.
***REMOVED*** @param {number} angle The angle of the rotation transform.
***REMOVED*** @param {number} centerX The horizontal center of the rotation transform.
***REMOVED*** @param {number} centerY The vertical center of the rotation transform.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGraphics.prototype.setElementTransform = function(element, x,
    y, angle, centerX, centerY) {
  var el = element.getElement();

  el.style.left = goog.graphics.VmlGraphics.toPosPx(x);
  el.style.top = goog.graphics.VmlGraphics.toPosPx(y);
  if (angle || el.rotation) {
    el.rotation = angle;
    el.coordsize = goog.graphics.VmlGraphics.toSizeCoord(centerX***REMOVED*** 2) + ' ' +
        goog.graphics.VmlGraphics.toSizeCoord(centerY***REMOVED*** 2);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the fill information from a dom element.
***REMOVED*** @param {Element} element DOM element.
***REMOVED***
goog.graphics.VmlGraphics.prototype.removeFill = function(element) {
  element.fillcolor = '';
  var v = element.childNodes.length;
  for (var i = 0; i < element.childNodes.length; i++) {
    var child = element.childNodes[i];
    if (child.tagName == 'fill') {
      element.removeChild(child);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Set top, left, width and height for an element.
***REMOVED*** This function is internal for the VML supporting classes, and
***REMOVED*** should not be used externally.
***REMOVED***
***REMOVED*** @param {Element} element DOM element.
***REMOVED*** @param {number} left Left ccordinate in pixels.
***REMOVED*** @param {number} top Top ccordinate in pixels.
***REMOVED*** @param {number} width Width in pixels.
***REMOVED*** @param {number} height Height in pixels.
***REMOVED***
goog.graphics.VmlGraphics.setPositionAndSize = function(
    element, left, top, width, height) {
  var style = element.style;
  style.position = 'absolute';
  style.left = goog.graphics.VmlGraphics.toPosPx(left);
  style.top = goog.graphics.VmlGraphics.toPosPx(top);
  style.width = goog.graphics.VmlGraphics.toSizePx(width);
  style.height = goog.graphics.VmlGraphics.toSizePx(height);

  if (element.tagName == 'shape') {
    element.coordsize = goog.graphics.VmlGraphics.toSizeCoord(width) + ' ' +
                        goog.graphics.VmlGraphics.toSizeCoord(height);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates an element spanning the surface.
***REMOVED***
***REMOVED*** @param {string} type The type of element to create.
***REMOVED*** @return {Element} The created, positioned, and sized element.
***REMOVED*** @private
***REMOVED***
goog.graphics.VmlGraphics.prototype.createFullSizeElement_ = function(type) {
  var element = this.createVmlElement(type);
  var size = this.getCoordSize();
  goog.graphics.VmlGraphics.setPositionAndSize(element, 0, 0, size.width,
      size.height);
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** IE magic - if this "no-op" line is not here, the if statement below will
***REMOVED*** fail intermittently.  The eval is used to prevent the JsCompiler from
***REMOVED*** stripping this piece of code, which it quite reasonably thinks is doing
***REMOVED*** nothing. Put it in try-catch block to prevent "Unspecified Error" when
***REMOVED*** this statement is executed in a defer JS in IE.
***REMOVED*** More info here:
***REMOVED*** http://www.mail-archive.com/users@openlayers.org/msg01838.html
***REMOVED***
try {
  eval('document.namespaces');
} catch (ex) {}


***REMOVED***
***REMOVED*** Creates the DOM representation of the graphics area.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGraphics.prototype.createDom = function() {
  var doc = this.dom_.getDocument();

  // Add the namespace.
  if (!doc.namespaces[goog.graphics.VmlGraphics.VML_PREFIX_]) {
    if (goog.graphics.VmlGraphics.IE8_MODE_) {
      doc.namespaces.add(goog.graphics.VmlGraphics.VML_PREFIX_,
                         goog.graphics.VmlGraphics.VML_NS_,
                         goog.graphics.VmlGraphics.VML_IMPORT_);
    } else {
      doc.namespaces.add(goog.graphics.VmlGraphics.VML_PREFIX_,
                         goog.graphics.VmlGraphics.VML_NS_);
    }

    // We assume that we only need to add the CSS if the namespace was not
    // present
    var ss = doc.createStyleSheet();
    ss.cssText = goog.graphics.VmlGraphics.VML_PREFIX_ + '\\:*' +
                 '{behavior:url(#default#VML)}';
  }

  // Outer a DIV with overflow hidden for clipping.
  // All inner elements are absolutly positioned on-top of this div.
  var pixelWidth = this.width;
  var pixelHeight = this.height;
  var divElement = this.dom_.createDom('div', {
    'style': 'overflow:hidden;position:relative;width:' +
        goog.graphics.VmlGraphics.toCssSize(pixelWidth) + ';height:' +
        goog.graphics.VmlGraphics.toCssSize(pixelHeight)
  });

  this.setElementInternal(divElement);

  var group = this.createVmlElement('group');
  var style = group.style;

  style.position = 'absolute';
  style.left = style.top = 0;
  style.width = this.width;
  style.height = this.height;
  if (this.coordWidth) {
    group.coordsize =
        goog.graphics.VmlGraphics.toSizeCoord(this.coordWidth) + ' ' +
        goog.graphics.VmlGraphics.toSizeCoord(
           ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.coordHeight));
  } else {
    group.coordsize = goog.graphics.VmlGraphics.toSizeCoord(pixelWidth) + ' ' +
        goog.graphics.VmlGraphics.toSizeCoord(pixelHeight);
  }

  if (goog.isDef(this.coordLeft)) {
    group.coordorigin = goog.graphics.VmlGraphics.toSizeCoord(this.coordLeft) +
        ' ' + goog.graphics.VmlGraphics.toSizeCoord(this.coordTop);
  } else {
    group.coordorigin = '0 0';
  }
  divElement.appendChild(group);

  this.canvasElement = new goog.graphics.VmlGroupElement(group, this);

***REMOVED***divElement, goog.events.EventType.RESIZE, goog.bind(
      this.handleContainerResize_, this));
***REMOVED***


***REMOVED***
***REMOVED*** Changes the canvas element size to match the container element size.
***REMOVED*** @private
***REMOVED***
goog.graphics.VmlGraphics.prototype.handleContainerResize_ = function() {
  var size = goog.style.getSize(this.getElement());
  var style = this.canvasElement.getElement().style;

  if (size.width) {
    style.width = size.width + 'px';
    style.height = size.height + 'px';
  } else {
    var current = this.getElement();
    while (current && current.currentStyle &&
        current.currentStyle.display != 'none') {
      current = current.parentNode;
    }
    if (current && current.currentStyle) {
      this.handler_.listen(current, 'propertychange',
          this.handleContainerResize_);
    }
  }

  this.dispatchEvent(goog.events.EventType.RESIZE);
***REMOVED***


***REMOVED***
***REMOVED*** Handle property changes on hidden ancestors.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.graphics.VmlGraphics.prototype.handlePropertyChange_ = function(e) {
  var prop = e.getBrowserEvent().propertyName;
  if (prop == 'display' || prop == 'className') {
    this.handler_.unlisten(***REMOVED*** @type {Element}***REMOVED***(e.target),
        'propertychange', this.handlePropertyChange_);
    this.handleContainerResize_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Changes the coordinate system position.
***REMOVED*** @param {number} left The coordinate system left bound.
***REMOVED*** @param {number} top The coordinate system top bound.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGraphics.prototype.setCoordOrigin = function(left, top) {
  this.coordLeft = left;
  this.coordTop = top;

  this.canvasElement.getElement().coordorigin =
      goog.graphics.VmlGraphics.toSizeCoord(this.coordLeft) + ' ' +
      goog.graphics.VmlGraphics.toSizeCoord(this.coordTop);
***REMOVED***


***REMOVED***
***REMOVED*** Changes the coordinate size.
***REMOVED*** @param {number} coordWidth The coordinate width.
***REMOVED*** @param {number} coordHeight The coordinate height.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGraphics.prototype.setCoordSize = function(coordWidth,
                                                            coordHeight) {
  goog.graphics.VmlGraphics.superClass_.setCoordSize.apply(this, arguments);

  this.canvasElement.getElement().coordsize =
      goog.graphics.VmlGraphics.toSizeCoord(coordWidth) + ' ' +
      goog.graphics.VmlGraphics.toSizeCoord(coordHeight);
***REMOVED***


***REMOVED***
***REMOVED*** Change the size of the canvas.
***REMOVED*** @param {number} pixelWidth The width in pixels.
***REMOVED*** @param {number} pixelHeight The height in pixels.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGraphics.prototype.setSize = function(pixelWidth,
    pixelHeight) {
  goog.style.setSize(this.getElement(), pixelWidth, pixelHeight);
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.math.Size} Returns the number of pixels spanned by the surface.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGraphics.prototype.getPixelSize = function() {
  var el = this.getElement();
  // The following relies on the fact that the size can never be 0.
  return new goog.math.Size(el.style.pixelWidth || el.offsetWidth || 1,
      el.style.pixelHeight || el.offsetHeight || 1);
***REMOVED***


***REMOVED***
***REMOVED*** Remove all drawing elements from the graphics.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGraphics.prototype.clear = function() {
  this.canvasElement.clear();
***REMOVED***


***REMOVED***
***REMOVED*** Draw an ellipse.
***REMOVED***
***REMOVED*** @param {number} cx Center X coordinate.
***REMOVED*** @param {number} cy Center Y coordinate.
***REMOVED*** @param {number} rx Radius length for the x-axis.
***REMOVED*** @param {number} ry Radius length for the y-axis.
***REMOVED*** @param {goog.graphics.Stroke?} stroke Stroke object describing the
***REMOVED***    stroke.
***REMOVED*** @param {goog.graphics.Fill?} fill Fill object describing the fill.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element
***REMOVED***     to append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {goog.graphics.EllipseElement} The newly created element.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGraphics.prototype.drawEllipse = function(cx, cy, rx, ry,
    stroke, fill, opt_group) {
  var element = this.createVmlElement('oval');
  goog.graphics.VmlGraphics.setPositionAndSize(element, cx - rx, cy - ry,
      rx***REMOVED*** 2, ry***REMOVED*** 2);
  var wrapper = new goog.graphics.VmlEllipseElement(element, this,
      cx, cy, rx, ry, stroke, fill);
  this.append_(wrapper, opt_group);
  return wrapper;
***REMOVED***


***REMOVED***
***REMOVED*** Draw a rectangle.
***REMOVED***
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED*** @param {number} width Width of rectangle.
***REMOVED*** @param {number} height Height of rectangle.
***REMOVED*** @param {goog.graphics.Stroke?} stroke Stroke object describing the
***REMOVED***    stroke.
***REMOVED*** @param {goog.graphics.Fill?} fill Fill object describing the fill.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element
***REMOVED***     to append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {goog.graphics.RectElement} The newly created element.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGraphics.prototype.drawRect = function(x, y, width, height,
    stroke, fill, opt_group) {
  var element = this.createVmlElement('rect');
  goog.graphics.VmlGraphics.setPositionAndSize(element, x, y, width, height);
  var wrapper = new goog.graphics.VmlRectElement(element, this, stroke, fill);
  this.append_(wrapper, opt_group);
  return wrapper;
***REMOVED***


***REMOVED***
***REMOVED*** Draw an image.
***REMOVED***
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED*** @param {number} width Width of image.
***REMOVED*** @param {number} height Height of image.
***REMOVED*** @param {string} src Source of the image.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element
***REMOVED***     to append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {goog.graphics.ImageElement} The newly created element.
***REMOVED***
goog.graphics.VmlGraphics.prototype.drawImage = function(x, y, width, height,
    src, opt_group) {
  var element = this.createVmlElement('image');
  goog.graphics.VmlGraphics.setPositionAndSize(element, x, y, width, height);
  goog.graphics.VmlGraphics.setAttribute(element, 'src', src);
  var wrapper = new goog.graphics.VmlImageElement(element, this);
  this.append_(wrapper, opt_group);
  return wrapper;
***REMOVED***


***REMOVED***
***REMOVED*** Draw a text string vertically centered on a given line.
***REMOVED***
***REMOVED*** @param {string} text The text to draw.
***REMOVED*** @param {number} x1 X coordinate of start of line.
***REMOVED*** @param {number} y1 Y coordinate of start of line.
***REMOVED*** @param {number} x2 X coordinate of end of line.
***REMOVED*** @param {number} y2 Y coordinate of end of line.
***REMOVED*** @param {?string} align Horizontal alignment: left (default), center, right.
***REMOVED*** @param {goog.graphics.Font} font Font describing the font properties.
***REMOVED*** @param {goog.graphics.Stroke?} stroke Stroke object describing the stroke.
***REMOVED*** @param {goog.graphics.Fill?} fill Fill object describing the fill.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element
***REMOVED***     to append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {goog.graphics.TextElement} The newly created element.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGraphics.prototype.drawTextOnLine = function(
    text, x1, y1, x2, y2, align, font, stroke, fill, opt_group) {
  var shape = this.createFullSizeElement_('shape');

  var pathElement = this.createVmlElement('path');
  var path = 'M' + goog.graphics.VmlGraphics.toPosCoord(x1) + ',' +
             goog.graphics.VmlGraphics.toPosCoord(y1) + 'L' +
             goog.graphics.VmlGraphics.toPosCoord(x2) + ',' +
             goog.graphics.VmlGraphics.toPosCoord(y2) + 'E';
  goog.graphics.VmlGraphics.setAttribute(pathElement, 'v', path);
  goog.graphics.VmlGraphics.setAttribute(pathElement, 'textpathok', 'true');

  var textPathElement = this.createVmlElement('textpath');
  textPathElement.setAttribute('on', 'true');
  var style = textPathElement.style;
  style.fontSize = font.size***REMOVED*** this.getPixelScaleX();
  style.fontFamily = font.family;
  if (align != null) {
    style['v-text-align'] = align;
  }
  if (font.bold) {
    style.fontWeight = 'bold';
  }
  if (font.italic) {
    style.fontStyle = 'italic';
  }
  goog.graphics.VmlGraphics.setAttribute(textPathElement, 'string', text);

  shape.appendChild(pathElement);
  shape.appendChild(textPathElement);
  var wrapper = new goog.graphics.VmlTextElement(shape, this, stroke, fill);
  this.append_(wrapper, opt_group);
  return wrapper;
***REMOVED***


***REMOVED***
***REMOVED*** Draw a path.
***REMOVED***
***REMOVED*** @param {!goog.graphics.Path} path The path object to draw.
***REMOVED*** @param {goog.graphics.Stroke?} stroke Stroke object describing the stroke.
***REMOVED*** @param {goog.graphics.Fill?} fill Fill object describing the fill.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element
***REMOVED***     to append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {goog.graphics.PathElement} The newly created element.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGraphics.prototype.drawPath = function(path, stroke, fill,
    opt_group) {
  var element = this.createFullSizeElement_('shape');
  goog.graphics.VmlGraphics.setAttribute(element, 'path',
      goog.graphics.VmlGraphics.getVmlPath(path));

  var wrapper = new goog.graphics.VmlPathElement(element, this, stroke, fill);
  this.append_(wrapper, opt_group);
  return wrapper;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a string representation of a logical path suitable for use in
***REMOVED*** a VML element.
***REMOVED***
***REMOVED*** @param {goog.graphics.Path} path The logical path.
***REMOVED*** @return {string} The VML path representation.
***REMOVED***
goog.graphics.VmlGraphics.getVmlPath = function(path) {
  var list = [];
  path.forEachSegment(function(segment, args) {
    switch (segment) {
      case goog.graphics.Path.Segment.MOVETO:
        list.push('m');
        Array.prototype.push.apply(list, goog.array.map(args,
            goog.graphics.VmlGraphics.toSizeCoord));
        break;
      case goog.graphics.Path.Segment.LINETO:
        list.push('l');
        Array.prototype.push.apply(list, goog.array.map(args,
            goog.graphics.VmlGraphics.toSizeCoord));
        break;
      case goog.graphics.Path.Segment.CURVETO:
        list.push('c');
        Array.prototype.push.apply(list, goog.array.map(args,
            goog.graphics.VmlGraphics.toSizeCoord));
        break;
      case goog.graphics.Path.Segment.CLOSE:
        list.push('x');
        break;
      case goog.graphics.Path.Segment.ARCTO:
        var toAngle = args[2] + args[3];
        var cx = goog.graphics.VmlGraphics.toSizeCoord(
            args[4] - goog.math.angleDx(toAngle, args[0]));
        var cy = goog.graphics.VmlGraphics.toSizeCoord(
            args[5] - goog.math.angleDy(toAngle, args[1]));
        var rx = goog.graphics.VmlGraphics.toSizeCoord(args[0]);
        var ry = goog.graphics.VmlGraphics.toSizeCoord(args[1]);
        // VML angles are in fd units (see http://www.w3.org/TR/NOTE-VML) and
        // are positive counter-clockwise.
        var fromAngle = Math.round(args[2]***REMOVED*** -65536);
        var extent = Math.round(args[3]***REMOVED*** -65536);
        list.push('ae', cx, cy, rx, ry, fromAngle, extent);
        break;
    }
  });
  return list.join(' ');
***REMOVED***


***REMOVED***
***REMOVED*** Create an empty group of drawing elements.
***REMOVED***
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element
***REMOVED***     to append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {goog.graphics.GroupElement} The newly created group.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGraphics.prototype.createGroup = function(opt_group) {
  var element = this.createFullSizeElement_('group');
  var parent = opt_group || this.canvasElement;
  parent.getElement().appendChild(element);
  return new goog.graphics.VmlGroupElement(element, this);
***REMOVED***


***REMOVED***
***REMOVED*** Measure and return the width (in pixels) of a given text string.
***REMOVED*** Text measurement is needed to make sure a text can fit in the allocated
***REMOVED*** area. The way text length is measured is by writing it into a div that is
***REMOVED*** after the visible area, measure the div width, and immediatly erase the
***REMOVED*** written value.
***REMOVED***
***REMOVED*** @param {string} text The text string to measure.
***REMOVED*** @param {goog.graphics.Font} font The font object describing the font style.
***REMOVED***
***REMOVED*** @return {number} The width in pixels of the text strings.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGraphics.prototype.getTextWidth = function(text, font) {
  // TODO(arv): Implement
  return 0;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.graphics.VmlGraphics.prototype.enterDocument = function() {
  goog.graphics.VmlGraphics.superClass_.enterDocument.call(this);
  this.handleContainerResize_();
  this.updateGraphics_();
***REMOVED***


***REMOVED***
***REMOVED*** Disposes of the component by removing event handlers, detacing DOM nodes from
***REMOVED*** the document body, and removing references to them.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.graphics.VmlGraphics.prototype.disposeInternal = function() {
  this.canvasElement = null;
  goog.graphics.VmlGraphics.superClass_.disposeInternal.call(this);
***REMOVED***
