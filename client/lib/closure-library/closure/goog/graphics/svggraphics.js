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
***REMOVED*** @fileoverview SvgGraphics sub class that uses SVG to draw the graphics.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author yoah@google.com (Yoah Bar-David)
***REMOVED***

goog.provide('goog.graphics.SvgGraphics');

goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
***REMOVED***
goog.require('goog.graphics.AbstractGraphics');
goog.require('goog.graphics.LinearGradient');
goog.require('goog.graphics.Path');
goog.require('goog.graphics.SolidFill');
goog.require('goog.graphics.Stroke');
goog.require('goog.graphics.SvgEllipseElement');
goog.require('goog.graphics.SvgGroupElement');
goog.require('goog.graphics.SvgImageElement');
goog.require('goog.graphics.SvgPathElement');
goog.require('goog.graphics.SvgRectElement');
goog.require('goog.graphics.SvgTextElement');
goog.require('goog.math');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** A Graphics implementation for drawing using SVG.
***REMOVED*** @param {string|number} width The width in pixels.  Strings
***REMOVED***     expressing percentages of parent with (e.g. '80%') are also accepted.
***REMOVED*** @param {string|number} height The height in pixels.  Strings
***REMOVED***     expressing percentages of parent with (e.g. '80%') are also accepted.
***REMOVED*** @param {?number=} opt_coordWidth The coordinate width - if
***REMOVED***     omitted or null, defaults to same as width.
***REMOVED*** @param {?number=} opt_coordHeight The coordinate height - if
***REMOVED***     omitted or null, defaults to same as height.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DOM helper object for the
***REMOVED***     document we want to render in.
***REMOVED***
***REMOVED*** @extends {goog.graphics.AbstractGraphics}
***REMOVED*** @deprecated goog.graphics is deprecated. It existed to abstract over browser
***REMOVED***     differences before the canvas tag was widely supported.  See
***REMOVED***     http://en.wikipedia.org/wiki/Canvas_element for details.
***REMOVED*** @final
***REMOVED***
goog.graphics.SvgGraphics = function(width, height,
                                     opt_coordWidth, opt_coordHeight,
                                     opt_domHelper) {
  goog.graphics.AbstractGraphics.call(this, width, height,
                                      opt_coordWidth, opt_coordHeight,
                                      opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map from def key to id of def root element.
  ***REMOVED*** Defs are global "defines" of svg that are used to share common attributes,
  ***REMOVED*** for example gradients.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.defs_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to manually implement viewBox by using a coordinate transform.
  ***REMOVED*** As of 1/11/08 this is necessary for Safari 3 but not for the nightly
  ***REMOVED*** WebKit build. Apply to webkit versions < 526. 525 is the
  ***REMOVED*** last version used by Safari 3.1.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.useManualViewbox_ = goog.userAgent.WEBKIT &&
                           !goog.userAgent.isVersionOrHigher(526);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event handler.
  ***REMOVED*** @type {goog.events.EventHandler.<!goog.graphics.SvgGraphics>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.handler_ = new goog.events.EventHandler(this);
***REMOVED***
goog.inherits(goog.graphics.SvgGraphics, goog.graphics.AbstractGraphics);


***REMOVED***
***REMOVED*** The SVG namespace URN
***REMOVED*** @private
***REMOVED*** @type {string}
***REMOVED***
goog.graphics.SvgGraphics.SVG_NS_ = 'http://www.w3.org/2000/svg';


***REMOVED***
***REMOVED*** The name prefix for def entries
***REMOVED*** @private
***REMOVED*** @type {string}
***REMOVED***
goog.graphics.SvgGraphics.DEF_ID_PREFIX_ = '_svgdef_';


***REMOVED***
***REMOVED*** The next available unique identifier for a def entry.
***REMOVED*** This is a static variable, so that when multiple graphics are used in one
***REMOVED*** document, the same def id can not be re-defined by another SvgGraphics.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.graphics.SvgGraphics.nextDefId_ = 0;


***REMOVED***
***REMOVED*** Svg element for definitions for other elements, e.g. linear gradients.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.graphics.SvgGraphics.prototype.defsElement_;


***REMOVED***
***REMOVED*** Creates an SVG element. Used internally and by different SVG classes.
***REMOVED*** @param {string} tagName The type of element to create.
***REMOVED*** @param {Object=} opt_attributes Map of name-value pairs for attributes.
***REMOVED*** @return {!Element} The created element.
***REMOVED*** @private
***REMOVED***
goog.graphics.SvgGraphics.prototype.createSvgElement_ = function(tagName,
    opt_attributes) {
  var element = this.dom_.getDocument().createElementNS(
      goog.graphics.SvgGraphics.SVG_NS_, tagName);

  if (opt_attributes) {
    this.setElementAttributes(element, opt_attributes);
  }

  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Sets properties to an SVG element. Used internally and by different
***REMOVED*** SVG elements.
***REMOVED*** @param {Element} element The svg element.
***REMOVED*** @param {Object} attributes Map of name-value pairs for attributes.
***REMOVED***
goog.graphics.SvgGraphics.prototype.setElementAttributes = function(element,
    attributes) {
  for (var key in attributes) {
    element.setAttribute(key, attributes[key]);
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
goog.graphics.SvgGraphics.prototype.append_ = function(element, opt_group) {
  var parent = opt_group || this.canvasElement;
  parent.getElement().appendChild(element.getElement());
***REMOVED***


***REMOVED***
***REMOVED*** Sets the fill of the given element.
***REMOVED*** @param {goog.graphics.StrokeAndFillElement} element The element wrapper.
***REMOVED*** @param {goog.graphics.Fill?} fill The fill object.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgGraphics.prototype.setElementFill = function(element, fill) {
  var svgElement = element.getElement();
  if (fill instanceof goog.graphics.SolidFill) {
    svgElement.setAttribute('fill', fill.getColor());
    svgElement.setAttribute('fill-opacity', fill.getOpacity());
  } else if (fill instanceof goog.graphics.LinearGradient) {
    // create a def key which is just a concat of all the relevant fields
    var defKey = 'lg-' +
                 fill.getX1() + '-' + fill.getY1() + '-' +
                 fill.getX2() + '-' + fill.getY2() + '-' +
                 fill.getColor1() + '-' + fill.getColor2();
    // It seems that the SVG version accepts opacity where the VML does not

    var id = this.getDef(defKey);

    if (!id) { // No def for this yet, create it
      // Create the gradient def entry (only linear gradient are supported)
      var gradient = this.createSvgElement_('linearGradient', {
        'x1': fill.getX1(),
        'y1': fill.getY1(),
        'x2': fill.getX2(),
        'y2': fill.getY2(),
        'gradientUnits': 'userSpaceOnUse'
      });

      var gstyle = 'stop-color:' + fill.getColor1();
      if (goog.isNumber(fill.getOpacity1())) {
        gstyle += ';stop-opacity:' + fill.getOpacity1();
      }
      var stop1 = this.createSvgElement_(
          'stop', {'offset': '0%', 'style': gstyle});
      gradient.appendChild(stop1);

      // LinearGradients don't have opacity in VML so implement that before
      // enabling the following code.
      // if (fill.getOpacity() != null) {
      //   gstyles += 'opacity:' + fill.getOpacity() + ';'
      // }
      gstyle = 'stop-color:' + fill.getColor2();
      if (goog.isNumber(fill.getOpacity2())) {
        gstyle += ';stop-opacity:' + fill.getOpacity2();
      }
      var stop2 = this.createSvgElement_(
          'stop', {'offset': '100%', 'style': gstyle});
      gradient.appendChild(stop2);

      // LinearGradients don't have opacity in VML so implement that before
      // enabling the following code.
      // if (fill.getOpacity() != null) {
      //   gstyles += 'opacity:' + fill.getOpacity() + ';'
      // }

      id = this.addDef(defKey, gradient);
    }

    // Link element to linearGradient definition
    svgElement.setAttribute('fill', 'url(#' + id + ')');
  } else {
    svgElement.setAttribute('fill', 'none');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the stroke of the given element.
***REMOVED*** @param {goog.graphics.StrokeAndFillElement} element The element wrapper.
***REMOVED*** @param {goog.graphics.Stroke?} stroke The stroke object.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgGraphics.prototype.setElementStroke = function(element,
    stroke) {
  var svgElement = element.getElement();
  if (stroke) {
    svgElement.setAttribute('stroke', stroke.getColor());

    var width = stroke.getWidth();
    if (goog.isString(width) && width.indexOf('px') != -1) {
      svgElement.setAttribute('stroke-width',
          parseFloat(width) / this.getPixelScaleX());
    } else {
      svgElement.setAttribute('stroke-width', width);
    }
  } else {
    svgElement.setAttribute('stroke', 'none');
  }
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
goog.graphics.SvgGraphics.prototype.setElementTransform = function(element, x,
    y, angle, centerX, centerY) {
  element.getElement().setAttribute('transform', 'translate(' + x + ',' + y +
      ') rotate(' + angle + ' ' + centerX + ' ' + centerY + ')');
***REMOVED***


***REMOVED***
***REMOVED*** Creates the DOM representation of the graphics area.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgGraphics.prototype.createDom = function() {
  // Set up the standard attributes.
  var attributes = {
    'width': this.width,
    'height': this.height,
    'overflow': 'hidden'
 ***REMOVED*****REMOVED***

  var svgElement = this.createSvgElement_('svg', attributes);

  var groupElement = this.createSvgElement_('g');

  this.defsElement_ = this.createSvgElement_('defs');
  this.canvasElement = new goog.graphics.SvgGroupElement(groupElement, this);

  svgElement.appendChild(this.defsElement_);
  svgElement.appendChild(groupElement);

  // Use the svgElement as the root element.
  this.setElementInternal(svgElement);

  // Set up the coordinate system.
  this.setViewBox_();
***REMOVED***


***REMOVED***
***REMOVED*** Changes the coordinate system position.
***REMOVED*** @param {number} left The coordinate system left bound.
***REMOVED*** @param {number} top The coordinate system top bound.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgGraphics.prototype.setCoordOrigin = function(left, top) {
  this.coordLeft = left;
  this.coordTop = top;

  this.setViewBox_();
***REMOVED***


***REMOVED***
***REMOVED*** Changes the coordinate size.
***REMOVED*** @param {number} coordWidth The coordinate width.
***REMOVED*** @param {number} coordHeight The coordinate height.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgGraphics.prototype.setCoordSize = function(coordWidth,
    coordHeight) {
  goog.graphics.SvgGraphics.superClass_.setCoordSize.apply(
      this, arguments);
  this.setViewBox_();
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The view box string.
***REMOVED*** @private
***REMOVED***
goog.graphics.SvgGraphics.prototype.getViewBox_ = function() {
  return this.coordLeft + ' ' + this.coordTop + ' ' +
      (this.coordWidth ? this.coordWidth + ' ' + this.coordHeight : '');
***REMOVED***


***REMOVED***
***REMOVED*** Sets up the view box.
***REMOVED*** @private
***REMOVED***
goog.graphics.SvgGraphics.prototype.setViewBox_ = function() {
  if (this.coordWidth || this.coordLeft || this.coordTop) {
    this.getElement().setAttribute('preserveAspectRatio', 'none');
    if (this.useManualViewbox_) {
      this.updateManualViewBox_();
    } else {
      this.getElement().setAttribute('viewBox', this.getViewBox_());
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the transform of the root element to fake a viewBox.  Should only
***REMOVED*** be called when useManualViewbox_ is set.
***REMOVED*** @private
***REMOVED***
goog.graphics.SvgGraphics.prototype.updateManualViewBox_ = function() {
  if (!this.isInDocument() ||
      !(this.coordWidth || this.coordLeft || !this.coordTop)) {
    return;
  }

  var size = this.getPixelSize();
  if (size.width == 0) {
    // In Safari, invisible SVG is sometimes shown.  Explicitly hide it.
    this.getElement().style.visibility = 'hidden';
    return;
  }

  this.getElement().style.visibility = '';

  var offsetX = - this.coordLeft;
  var offsetY = - this.coordTop;
  var scaleX = size.width / this.coordWidth;
  var scaleY = size.height / this.coordHeight;

  this.canvasElement.getElement().setAttribute('transform',
      'scale(' + scaleX + ' ' + scaleY + ') ' +
      'translate(' + offsetX + ' ' + offsetY + ')');
***REMOVED***


***REMOVED***
***REMOVED*** Change the size of the canvas.
***REMOVED*** @param {number} pixelWidth The width in pixels.
***REMOVED*** @param {number} pixelHeight The height in pixels.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgGraphics.prototype.setSize = function(pixelWidth,
    pixelHeight) {
  goog.style.setSize(this.getElement(), pixelWidth, pixelHeight);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.graphics.SvgGraphics.prototype.getPixelSize = function() {
  if (!goog.userAgent.GECKO) {
    return this.isInDocument() ?
        goog.style.getSize(this.getElement()) :
        goog.graphics.SvgGraphics.base(this, 'getPixelSize');
  }

  // In Gecko, goog.style.getSize does not work for SVG elements.  We have to
  // compute the size manually if it is percentage based.
  var width = this.width;
  var height = this.height;
  var computeWidth = goog.isString(width) && width.indexOf('%') != -1;
  var computeHeight = goog.isString(height) && height.indexOf('%') != -1;

  if (!this.isInDocument() && (computeWidth || computeHeight)) {
    return null;
  }

  var parent;
  var parentSize;

  if (computeWidth) {
    parent =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (this.getElement().parentNode);
    parentSize = goog.style.getSize(parent);
    width = parseFloat(***REMOVED*** @type {string}***REMOVED*** (width))***REMOVED*** parentSize.width / 100;
  }

  if (computeHeight) {
    parent = parent ||***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (this.getElement().parentNode);
    parentSize = parentSize || goog.style.getSize(parent);
    height = parseFloat(***REMOVED*** @type {string}***REMOVED*** (height))***REMOVED*** parentSize.height /
        100;
  }

  return new goog.math.Size(***REMOVED*** @type {number}***REMOVED*** (width),
     ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (height));
***REMOVED***


***REMOVED***
***REMOVED*** Remove all drawing elements from the graphics.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgGraphics.prototype.clear = function() {
  this.canvasElement.clear();
  goog.dom.removeChildren(this.defsElement_);
  this.defs_ = {***REMOVED***
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
***REMOVED*** @return {!goog.graphics.EllipseElement} The newly created element.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgGraphics.prototype.drawEllipse = function(
    cx, cy, rx, ry, stroke, fill, opt_group) {
  var element = this.createSvgElement_('ellipse',
      {'cx': cx, 'cy': cy, 'rx': rx, 'ry': ry});
  var wrapper = new goog.graphics.SvgEllipseElement(element, this, stroke,
      fill);
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
***REMOVED*** @return {!goog.graphics.RectElement} The newly created element.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgGraphics.prototype.drawRect = function(x, y, width, height,
    stroke, fill, opt_group) {
  var element = this.createSvgElement_('rect',
      {'x': x, 'y': y, 'width': width, 'height': height});
  var wrapper = new goog.graphics.SvgRectElement(element, this, stroke, fill);
  this.append_(wrapper, opt_group);
  return wrapper;
***REMOVED***


***REMOVED***
***REMOVED*** Draw an image.
***REMOVED***
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED*** @param {number} width Width of the image.
***REMOVED*** @param {number} height Height of the image.
***REMOVED*** @param {string} src The source fo the image.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element
***REMOVED***     to append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {!goog.graphics.ImageElement} The newly created image wrapped in a
***REMOVED***     rectangle element.
***REMOVED***
goog.graphics.SvgGraphics.prototype.drawImage = function(x, y, width, height,
    src, opt_group) {
  var element = this.createSvgElement_('image', {
    'x': x,
    'y': y,
    'width': width,
    'height': height,
    'image-rendering': 'optimizeQuality',
    'preserveAspectRatio': 'none'
  });
  element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', src);
  var wrapper = new goog.graphics.SvgImageElement(element, this);
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
***REMOVED*** @param {string} align Horizontal alignment: left (default), center, right.
***REMOVED*** @param {goog.graphics.Font} font Font describing the font properties.
***REMOVED*** @param {goog.graphics.Stroke?} stroke Stroke object describing the
***REMOVED***    stroke.
***REMOVED*** @param {goog.graphics.Fill?} fill Fill object describing the fill.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element
***REMOVED***     to append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {!goog.graphics.TextElement} The newly created element.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgGraphics.prototype.drawTextOnLine = function(
    text, x1, y1, x2, y2, align, font, stroke, fill, opt_group) {
  var angle = Math.round(goog.math.angle(x1, y1, x2, y2));
  var dx = x2 - x1;
  var dy = y2 - y1;
  var lineLength = Math.round(Math.sqrt(dx***REMOVED*** dx + dy***REMOVED*** dy)); // Length of line

  // SVG baseline is on the glyph's base line. We estimate it as 85% of the
  // font height. This is just a rough estimate, but do not have a better way.
  var fontSize = font.size;
  var attributes = {'font-family': font.family, 'font-size': fontSize***REMOVED***
  var baseline = Math.round(fontSize***REMOVED*** 0.85);
  var textY = Math.round(y1 - (fontSize / 2) + baseline);
  var textX = x1;
  if (align == 'center') {
    textX += Math.round(lineLength / 2);
    attributes['text-anchor'] = 'middle';
  } else if (align == 'right') {
    textX += lineLength;
    attributes['text-anchor'] = 'end';
  }
  attributes['x'] = textX;
  attributes['y'] = textY;
  if (font.bold) {
    attributes['font-weight'] = 'bold';
  }
  if (font.italic) {
    attributes['font-style'] = 'italic';
  }
  if (angle != 0) {
    attributes['transform'] = 'rotate(' + angle + ' ' + x1 + ' ' + y1 + ')';
  }

  var element = this.createSvgElement_('text', attributes);
  element.appendChild(this.dom_.getDocument().createTextNode(text));

  // Bypass a Firefox-Mac bug where text fill is ignored. If text has no stroke,
  // set a stroke, otherwise the text will not be visible.
  if (stroke == null && goog.userAgent.GECKO && goog.userAgent.MAC) {
    var color = 'black';
    // For solid fills, use the fill color
    if (fill instanceof goog.graphics.SolidFill) {
      color = fill.getColor();
    }
    stroke = new goog.graphics.Stroke(1, color);
  }

  var wrapper = new goog.graphics.SvgTextElement(element, this, stroke, fill);
  this.append_(wrapper, opt_group);
  return wrapper;
***REMOVED***


***REMOVED***
***REMOVED*** Draw a path.
***REMOVED***
***REMOVED*** @param {!goog.graphics.Path} path The path object to draw.
***REMOVED*** @param {goog.graphics.Stroke?} stroke Stroke object describing the
***REMOVED***    stroke.
***REMOVED*** @param {goog.graphics.Fill?} fill Fill object describing the fill.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element
***REMOVED***     to append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {!goog.graphics.PathElement} The newly created element.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgGraphics.prototype.drawPath = function(
    path, stroke, fill, opt_group) {

  var element = this.createSvgElement_('path',
      {'d': goog.graphics.SvgGraphics.getSvgPath(path)});
  var wrapper = new goog.graphics.SvgPathElement(element, this, stroke, fill);
  this.append_(wrapper, opt_group);
  return wrapper;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a string representation of a logical path suitable for use in
***REMOVED*** an SVG element.
***REMOVED***
***REMOVED*** @param {goog.graphics.Path} path The logical path.
***REMOVED*** @return {string} The SVG path representation.
***REMOVED*** @suppress {deprecated} goog.graphics is deprecated.
***REMOVED***
goog.graphics.SvgGraphics.getSvgPath = function(path) {
  var list = [];
  path.forEachSegment(function(segment, args) {
    switch (segment) {
      case goog.graphics.Path.Segment.MOVETO:
        list.push('M');
        Array.prototype.push.apply(list, args);
        break;
      case goog.graphics.Path.Segment.LINETO:
        list.push('L');
        Array.prototype.push.apply(list, args);
        break;
      case goog.graphics.Path.Segment.CURVETO:
        list.push('C');
        Array.prototype.push.apply(list, args);
        break;
      case goog.graphics.Path.Segment.ARCTO:
        var extent = args[3];
        var toAngle = args[2] + extent;
        list.push('A', args[0], args[1],
            0, Math.abs(extent) > 180 ? 1 : 0, extent > 0 ? 1 : 0,
            args[4], args[5]);
        break;
      case goog.graphics.Path.Segment.CLOSE:
        list.push('Z');
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
***REMOVED*** @return {!goog.graphics.GroupElement} The newly created group.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgGraphics.prototype.createGroup = function(opt_group) {
  var element = this.createSvgElement_('g');
  var parent = opt_group || this.canvasElement;
  parent.getElement().appendChild(element);
  return new goog.graphics.SvgGroupElement(element, this);
***REMOVED***


***REMOVED***
***REMOVED*** Measure and return the width (in pixels) of a given text string.
***REMOVED*** Text measurement is needed to make sure a text can fit in the allocated area.
***REMOVED*** The way text length is measured is by writing it into a div that is after
***REMOVED*** the visible area, measure the div width, and immediatly erase the written
***REMOVED*** value.
***REMOVED***
***REMOVED*** @param {string} text The text string to measure.
***REMOVED*** @param {goog.graphics.Font} font The font object describing the font style.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgGraphics.prototype.getTextWidth = function(text, font) {
  // TODO(user) Implement
***REMOVED***


***REMOVED***
***REMOVED*** Adds a defintion of an element to the global definitions.
***REMOVED*** @param {string} defKey This is a key that should be unique in a way that
***REMOVED***     if two definitions are equal the should have the same key.
***REMOVED*** @param {Element} defElement DOM element to add as a definition. It must
***REMOVED***     have an id attribute set.
***REMOVED*** @return {string} The assigned id of the defElement.
***REMOVED***
goog.graphics.SvgGraphics.prototype.addDef = function(defKey, defElement) {
  if (defKey in this.defs_) {
    return this.defs_[defKey];
  }
  var id = goog.graphics.SvgGraphics.DEF_ID_PREFIX_ +
      goog.graphics.SvgGraphics.nextDefId_++;
  defElement.setAttribute('id', id);
  this.defs_[defKey] = id;

  // Add the def defElement of the defs list.
  var defs = this.defsElement_;
  defs.appendChild(defElement);
  return id;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the id of a definition element.
***REMOVED*** @param {string} defKey This is a key that should be unique in a way that
***REMOVED***     if two definitions are equal the should have the same key.
***REMOVED*** @return {?string} The id of the found definition element or null if
***REMOVED***     not found.
***REMOVED***
goog.graphics.SvgGraphics.prototype.getDef = function(defKey) {
  return defKey in this.defs_ ? this.defs_[defKey] : null;
***REMOVED***


***REMOVED***
***REMOVED*** Removes a definition of an elemnt from the global definitions.
***REMOVED*** @param {string} defKey This is a key that should be unique in a way that
***REMOVED***     if two definitions are equal they should have the same key.
***REMOVED***
goog.graphics.SvgGraphics.prototype.removeDef = function(defKey) {
  var id = this.getDef(defKey);
  if (id) {
    var element = this.dom_.getElement(id);
    this.defsElement_.removeChild(element);
    delete this.defs_[defKey];
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.graphics.SvgGraphics.prototype.enterDocument = function() {
  var oldPixelSize = this.getPixelSize();
  goog.graphics.SvgGraphics.superClass_.enterDocument.call(this);

  // Dispatch a resize if this is the first time the size value is accurate.
  if (!oldPixelSize) {
    this.dispatchEvent(goog.events.EventType.RESIZE);
  }


  // For percentage based heights, listen for changes to size.
  if (this.useManualViewbox_) {
    var width = this.width;
    var height = this.height;

    if (typeof width == 'string' && width.indexOf('%') != -1 &&
        typeof height == 'string' && height.indexOf('%') != -1) {
      // SVG elements don't behave well with respect to size events, so we
      // resort to polling.
      this.handler_.listen(goog.graphics.SvgGraphics.getResizeCheckTimer_(),
          goog.Timer.TICK, this.updateManualViewBox_);
    }

    this.updateManualViewBox_();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.graphics.SvgGraphics.prototype.exitDocument = function() {
  goog.graphics.SvgGraphics.superClass_.exitDocument.call(this);

  // Stop polling.
  if (this.useManualViewbox_) {
    this.handler_.unlisten(goog.graphics.SvgGraphics.getResizeCheckTimer_(),
        goog.Timer.TICK, this.updateManualViewBox_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Disposes of the component by removing event handlers, detacing DOM nodes from
***REMOVED*** the document body, and removing references to them.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.graphics.SvgGraphics.prototype.disposeInternal = function() {
  delete this.defs_;
  delete this.defsElement_;
  delete this.canvasElement;
  goog.graphics.SvgGraphics.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** The centralized resize checking timer.
***REMOVED*** @type {goog.Timer|undefined}
***REMOVED*** @private
***REMOVED***
goog.graphics.SvgGraphics.resizeCheckTimer_;


***REMOVED***
***REMOVED*** @return {goog.Timer} The centralized timer object used for interval timing.
***REMOVED*** @private
***REMOVED***
goog.graphics.SvgGraphics.getResizeCheckTimer_ = function() {
  if (!goog.graphics.SvgGraphics.resizeCheckTimer_) {
    goog.graphics.SvgGraphics.resizeCheckTimer_ = new goog.Timer(400);
    goog.graphics.SvgGraphics.resizeCheckTimer_.start();
  }

  return***REMOVED*****REMOVED*** @type {goog.Timer}***REMOVED*** (
      goog.graphics.SvgGraphics.resizeCheckTimer_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.graphics.SvgGraphics.prototype.isDomClonable = function() {
  return true;
***REMOVED***
