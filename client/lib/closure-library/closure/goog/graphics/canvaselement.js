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
***REMOVED*** @fileoverview Objects representing shapes drawn on a canvas.
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @author wcrosby@google.com (Wayne Crosby)
***REMOVED***

goog.provide('goog.graphics.CanvasEllipseElement');
goog.provide('goog.graphics.CanvasGroupElement');
goog.provide('goog.graphics.CanvasImageElement');
goog.provide('goog.graphics.CanvasPathElement');
goog.provide('goog.graphics.CanvasRectElement');
goog.provide('goog.graphics.CanvasTextElement');


goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.graphics.EllipseElement');
goog.require('goog.graphics.GroupElement');
goog.require('goog.graphics.ImageElement');
goog.require('goog.graphics.Path');
goog.require('goog.graphics.PathElement');
goog.require('goog.graphics.RectElement');
goog.require('goog.graphics.TextElement');
goog.require('goog.math');
goog.require('goog.string');



***REMOVED***
***REMOVED*** Object representing a group of objects in a canvas.
***REMOVED*** This is an implementation of the goog.graphics.GroupElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {goog.graphics.CanvasGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.GroupElement}
***REMOVED*** @deprecated goog.graphics is deprecated. It existed to abstract over browser
***REMOVED***     differences before the canvas tag was widely supported.  See
***REMOVED***     http://en.wikipedia.org/wiki/Canvas_element for details.
***REMOVED*** @final
***REMOVED***
goog.graphics.CanvasGroupElement = function(graphics) {
  goog.graphics.GroupElement.call(this, null, graphics);


 ***REMOVED*****REMOVED***
  ***REMOVED*** Children contained by this group.
  ***REMOVED*** @type {Array.<goog.graphics.Element>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.children_ = [];
***REMOVED***
goog.inherits(goog.graphics.CanvasGroupElement, goog.graphics.GroupElement);


***REMOVED***
***REMOVED*** Remove all drawing elements from the group.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGroupElement.prototype.clear = function() {
  if (this.children_.length) {
    this.children_.length = 0;
    this.getGraphics().redraw();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Set the size of the group element.
***REMOVED*** @param {number|string} width The width of the group element.
***REMOVED*** @param {number|string} height The height of the group element.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGroupElement.prototype.setSize = function(width, height) {
  // Do nothing.
***REMOVED***


***REMOVED***
***REMOVED*** Append a child to the group.  Does not draw it
***REMOVED*** @param {goog.graphics.Element} element The child to append.
***REMOVED***
goog.graphics.CanvasGroupElement.prototype.appendChild = function(element) {
  this.children_.push(element);
***REMOVED***


***REMOVED***
***REMOVED*** Draw the group.
***REMOVED*** @param {CanvasRenderingContext2D} ctx The context to draw the element in.
***REMOVED***
goog.graphics.CanvasGroupElement.prototype.draw = function(ctx) {
  for (var i = 0, len = this.children_.length; i < len; i++) {
    this.getGraphics().drawElement(this.children_[i]);
  }
***REMOVED***



***REMOVED***
***REMOVED*** Thin wrapper for canvas ellipse elements.
***REMOVED*** This is an implementation of the goog.graphics.EllipseElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.CanvasGraphics} graphics  The graphics creating
***REMOVED***     this element.
***REMOVED*** @param {number} cx Center X coordinate.
***REMOVED*** @param {number} cy Center Y coordinate.
***REMOVED*** @param {number} rx Radius length for the x-axis.
***REMOVED*** @param {number} ry Radius length for the y-axis.
***REMOVED*** @param {goog.graphics.Stroke} stroke The stroke to use for this element.
***REMOVED*** @param {goog.graphics.Fill} fill The fill to use for this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.EllipseElement}
***REMOVED*** @final
***REMOVED***
goog.graphics.CanvasEllipseElement = function(element, graphics,
    cx, cy, rx, ry, stroke, fill) {
  goog.graphics.EllipseElement.call(this, element, graphics, stroke, fill);

 ***REMOVED*****REMOVED***
  ***REMOVED*** X coordinate of the ellipse center.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.cx_ = cx;


 ***REMOVED*****REMOVED***
  ***REMOVED*** Y coordinate of the ellipse center.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.cy_ = cy;


 ***REMOVED*****REMOVED***
  ***REMOVED*** Radius length for the x-axis.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.rx_ = rx;


 ***REMOVED*****REMOVED***
  ***REMOVED*** Radius length for the y-axis.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.ry_ = ry;


 ***REMOVED*****REMOVED***
  ***REMOVED*** Internal path approximating an ellipse.
  ***REMOVED*** @type {goog.graphics.Path}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.path_ = new goog.graphics.Path();
  this.setUpPath_();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Internal path element that actually does the drawing.
  ***REMOVED*** @type {goog.graphics.CanvasPathElement}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.pathElement_ = new goog.graphics.CanvasPathElement(null, graphics,
      this.path_, stroke, fill);
***REMOVED***
goog.inherits(goog.graphics.CanvasEllipseElement, goog.graphics.EllipseElement);


***REMOVED***
***REMOVED*** Sets up the path.
***REMOVED*** @private
***REMOVED***
goog.graphics.CanvasEllipseElement.prototype.setUpPath_ = function() {
  this.path_.clear();
  this.path_.moveTo(this.cx_ + goog.math.angleDx(0, this.rx_),
                    this.cy_ + goog.math.angleDy(0, this.ry_));
  this.path_.arcTo(this.rx_, this.ry_, 0, 360);
  this.path_.close();
***REMOVED***


***REMOVED***
***REMOVED*** Update the center point of the ellipse.
***REMOVED*** @param {number} cx Center X coordinate.
***REMOVED*** @param {number} cy Center Y coordinate.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasEllipseElement.prototype.setCenter = function(cx, cy) {
  this.cx_ = cx;
  this.cy_ = cy;
  this.setUpPath_();
  this.pathElement_.setPath(***REMOVED*** @type {!goog.graphics.Path}***REMOVED*** (this.path_));
***REMOVED***


***REMOVED***
***REMOVED*** Update the radius of the ellipse.
***REMOVED*** @param {number} rx Center X coordinate.
***REMOVED*** @param {number} ry Center Y coordinate.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasEllipseElement.prototype.setRadius = function(rx, ry) {
  this.rx_ = rx;
  this.ry_ = ry;
  this.setUpPath_();
  this.pathElement_.setPath(***REMOVED*** @type {!goog.graphics.Path}***REMOVED*** (this.path_));
***REMOVED***


***REMOVED***
***REMOVED*** Draw the ellipse.  Should be treated as package scope.
***REMOVED*** @param {CanvasRenderingContext2D} ctx The context to draw the element in.
***REMOVED***
goog.graphics.CanvasEllipseElement.prototype.draw = function(ctx) {
  this.pathElement_.draw(ctx);
***REMOVED***



***REMOVED***
***REMOVED*** Thin wrapper for canvas rectangle elements.
***REMOVED*** This is an implementation of the goog.graphics.RectElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.CanvasGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED*** @param {number} w Width of rectangle.
***REMOVED*** @param {number} h Height of rectangle.
***REMOVED*** @param {goog.graphics.Stroke} stroke The stroke to use for this element.
***REMOVED*** @param {goog.graphics.Fill} fill The fill to use for this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.RectElement}
***REMOVED*** @final
***REMOVED***
goog.graphics.CanvasRectElement = function(element, graphics, x, y, w, h,
    stroke, fill) {
  goog.graphics.RectElement.call(this, element, graphics, stroke, fill);

 ***REMOVED*****REMOVED***
  ***REMOVED*** X coordinate of the top left corner.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.x_ = x;


 ***REMOVED*****REMOVED***
  ***REMOVED*** Y coordinate of the top left corner.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.y_ = y;


 ***REMOVED*****REMOVED***
  ***REMOVED*** Width of the rectangle.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.w_ = w;


 ***REMOVED*****REMOVED***
  ***REMOVED*** Height of the rectangle.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.h_ = h;
***REMOVED***
goog.inherits(goog.graphics.CanvasRectElement, goog.graphics.RectElement);


***REMOVED***
***REMOVED*** Update the position of the rectangle.
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasRectElement.prototype.setPosition = function(x, y) {
  this.x_ = x;
  this.y_ = y;
  if (this.drawn_) {
    this.getGraphics().redraw();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Whether the rectangle has been drawn yet.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.graphics.CanvasRectElement.prototype.drawn_ = false;


***REMOVED***
***REMOVED*** Update the size of the rectangle.
***REMOVED*** @param {number} width Width of rectangle.
***REMOVED*** @param {number} height Height of rectangle.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasRectElement.prototype.setSize = function(width, height) {
  this.w_ = width;
  this.h_ = height;
  if (this.drawn_) {
    this.getGraphics().redraw();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Draw the rectangle.  Should be treated as package scope.
***REMOVED*** @param {CanvasRenderingContext2D} ctx The context to draw the element in.
***REMOVED***
goog.graphics.CanvasRectElement.prototype.draw = function(ctx) {
  this.drawn_ = true;
  ctx.beginPath();
  ctx.moveTo(this.x_, this.y_);
  ctx.lineTo(this.x_, this.y_ + this.h_);
  ctx.lineTo(this.x_ + this.w_, this.y_ + this.h_);
  ctx.lineTo(this.x_ + this.w_, this.y_);
  ctx.closePath();
***REMOVED***



***REMOVED***
***REMOVED*** Thin wrapper for canvas path elements.
***REMOVED*** This is an implementation of the goog.graphics.PathElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.CanvasGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED*** @param {!goog.graphics.Path} path The path object to draw.
***REMOVED*** @param {goog.graphics.Stroke} stroke The stroke to use for this element.
***REMOVED*** @param {goog.graphics.Fill} fill The fill to use for this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.PathElement}
***REMOVED*** @final
***REMOVED***
goog.graphics.CanvasPathElement = function(element, graphics, path, stroke,
    fill) {
  goog.graphics.PathElement.call(this, element, graphics, stroke, fill);

  this.setPath(path);
***REMOVED***
goog.inherits(goog.graphics.CanvasPathElement, goog.graphics.PathElement);


***REMOVED***
***REMOVED*** Whether the shape has been drawn yet.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.graphics.CanvasPathElement.prototype.drawn_ = false;


***REMOVED***
***REMOVED*** The path to draw.
***REMOVED*** @type {goog.graphics.Path}
***REMOVED*** @private
***REMOVED***
goog.graphics.CanvasPathElement.prototype.path_;


***REMOVED***
***REMOVED*** Update the underlying path.
***REMOVED*** @param {!goog.graphics.Path} path The path object to draw.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasPathElement.prototype.setPath = function(path) {
  this.path_ = path.isSimple() ? path :
      goog.graphics.Path.createSimplifiedPath(path);
  if (this.drawn_) {
    this.getGraphics().redraw();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Draw the path.  Should be treated as package scope.
***REMOVED*** @param {CanvasRenderingContext2D} ctx The context to draw the element in.
***REMOVED*** @suppress {deprecated} goog.graphics is deprecated.
***REMOVED***
goog.graphics.CanvasPathElement.prototype.draw = function(ctx) {
  this.drawn_ = true;

  ctx.beginPath();
  this.path_.forEachSegment(function(segment, args) {
    switch (segment) {
      case goog.graphics.Path.Segment.MOVETO:
        ctx.moveTo(args[0], args[1]);
        break;
      case goog.graphics.Path.Segment.LINETO:
        for (var i = 0; i < args.length; i += 2) {
          ctx.lineTo(args[i], args[i + 1]);
        }
        break;
      case goog.graphics.Path.Segment.CURVETO:
        for (var i = 0; i < args.length; i += 6) {
          ctx.bezierCurveTo(args[i], args[i + 1], args[i + 2],
              args[i + 3], args[i + 4], args[i + 5]);
        }
        break;
      case goog.graphics.Path.Segment.ARCTO:
        throw Error('Canvas paths cannot contain arcs');
      case goog.graphics.Path.Segment.CLOSE:
        ctx.closePath();
        break;
    }
  });
***REMOVED***



***REMOVED***
***REMOVED*** Thin wrapper for canvas text elements.
***REMOVED*** This is an implementation of the goog.graphics.TextElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {!goog.graphics.CanvasGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED*** @param {string} text The text to draw.
***REMOVED*** @param {number} x1 X coordinate of start of line.
***REMOVED*** @param {number} y1 Y coordinate of start of line.
***REMOVED*** @param {number} x2 X coordinate of end of line.
***REMOVED*** @param {number} y2 Y coordinate of end of line.
***REMOVED*** @param {?string} align Horizontal alignment: left (default), center, right.
***REMOVED*** @param {!goog.graphics.Font} font Font describing the font properties.
***REMOVED*** @param {goog.graphics.Stroke} stroke The stroke to use for this element.
***REMOVED*** @param {goog.graphics.Fill} fill The fill to use for this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.TextElement}
***REMOVED*** @final
***REMOVED***
goog.graphics.CanvasTextElement = function(graphics, text, x1, y1, x2, y2,
    align, font, stroke, fill) {
  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'style': 'display:table;position:absolute;padding:0;margin:0;border:0'
  });
  goog.graphics.TextElement.call(this, element, graphics, stroke, fill);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The text to draw.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.text_ = text;

 ***REMOVED*****REMOVED***
  ***REMOVED*** X coordinate of the start of the line the text is drawn on.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.x1_ = x1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Y coordinate of the start of the line the text is drawn on.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.y1_ = y1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** X coordinate of the end of the line the text is drawn on.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.x2_ = x2;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Y coordinate of the end of the line the text is drawn on.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.y2_ = y2;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Horizontal alignment: left (default), center, right.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.align_ = align || 'left';

 ***REMOVED*****REMOVED***
  ***REMOVED*** Font object describing the font properties.
  ***REMOVED*** @type {goog.graphics.Font}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.font_ = font;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The inner element that contains the text.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.innerElement_ = goog.dom.createDom('DIV', {
    'style': 'display:table-cell;padding: 0;margin: 0;border: 0'
  });

  this.updateStyle_();
  this.updateText_();

  // Append to the DOM.
  graphics.getElement().appendChild(element);
  element.appendChild(this.innerElement_);
***REMOVED***
goog.inherits(goog.graphics.CanvasTextElement, goog.graphics.TextElement);


***REMOVED***
***REMOVED*** Update the displayed text of the element.
***REMOVED*** @param {string} text The text to draw.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasTextElement.prototype.setText = function(text) {
  this.text_ = text;
  this.updateText_();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the fill for this element.
***REMOVED*** @param {goog.graphics.Fill} fill The fill object.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasTextElement.prototype.setFill = function(fill) {
  this.fill = fill;
  var element = this.getElement();
  if (element) {
    element.style.color = fill.getColor() || fill.getColor1();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the stroke for this element.
***REMOVED*** @param {goog.graphics.Stroke} stroke The stroke object.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasTextElement.prototype.setStroke = function(stroke) {
  // Ignore stroke
***REMOVED***


***REMOVED***
***REMOVED*** Draw the text.  Should be treated as package scope.
***REMOVED*** @param {CanvasRenderingContext2D} ctx The context to draw the element in.
***REMOVED***
goog.graphics.CanvasTextElement.prototype.draw = function(ctx) {
  // Do nothing - the text is already drawn.
***REMOVED***


***REMOVED***
***REMOVED*** Update the styles of the DIVs.
***REMOVED*** @private
***REMOVED***
goog.graphics.CanvasTextElement.prototype.updateStyle_ = function() {
  var x1 = this.x1_;
  var x2 = this.x2_;
  var y1 = this.y1_;
  var y2 = this.y2_;
  var align = this.align_;
  var font = this.font_;
  var style = this.getElement().style;
  var scaleX = this.getGraphics().getPixelScaleX();
  var scaleY = this.getGraphics().getPixelScaleY();

  if (x1 == x2) {
    // Special case vertical text
    style.lineHeight = '90%';

    this.innerElement_.style.verticalAlign = align == 'center' ? 'middle' :
        align == 'left' ? (y1 < y2 ? 'top' : 'bottom') :
        y1 < y2 ? 'bottom' : 'top';
    style.textAlign = 'center';

    var w = font.size***REMOVED*** scaleX;
    style.top = Math.round(Math.min(y1, y2)***REMOVED*** scaleY) + 'px';
    style.left = Math.round((x1 - w / 2)***REMOVED*** scaleX) + 'px';
    style.width = Math.round(w) + 'px';
    style.height = Math.abs(y1 - y2)***REMOVED*** scaleY + 'px';

    style.fontSize = font.size***REMOVED*** 0.6***REMOVED*** scaleY + 'pt';
  } else {
    style.lineHeight = '100%';
    this.innerElement_.style.verticalAlign = 'top';
    style.textAlign = align;

    style.top = Math.round(((y1 + y2) / 2 - font.size***REMOVED*** 2 / 3)***REMOVED*** scaleY) + 'px';
    style.left = Math.round(x1***REMOVED*** scaleX) + 'px';
    style.width = Math.round(Math.abs(x2 - x1)***REMOVED*** scaleX) + 'px';
    style.height = 'auto';

    style.fontSize = font.size***REMOVED*** scaleY + 'pt';
  }

  style.fontWeight = font.bold ? 'bold' : 'normal';
  style.fontStyle = font.italic ? 'italic' : 'normal';
  style.fontFamily = font.family;

  var fill = this.getFill();
  style.color = fill.getColor() || fill.getColor1();
***REMOVED***


***REMOVED***
***REMOVED*** Update the text content.
***REMOVED*** @private
***REMOVED***
goog.graphics.CanvasTextElement.prototype.updateText_ = function() {
  if (this.x1_ == this.x2_) {
    // Special case vertical text
    this.innerElement_.innerHTML =
        goog.array.map(this.text_.split(''),
            function(entry) { return goog.string.htmlEscape(entry); }).
            join('<br>');
  } else {
    this.innerElement_.innerHTML = goog.string.htmlEscape(this.text_);
  }
***REMOVED***



***REMOVED***
***REMOVED*** Thin wrapper for canvas image elements.
***REMOVED*** This is an implementation of the goog.graphics.ImageElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.CanvasGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED*** @param {number} w Width of rectangle.
***REMOVED*** @param {number} h Height of rectangle.
***REMOVED*** @param {string} src Source of the image.
***REMOVED***
***REMOVED*** @extends {goog.graphics.ImageElement}
***REMOVED*** @final
***REMOVED***
goog.graphics.CanvasImageElement = function(element, graphics, x, y, w, h,
    src) {
  goog.graphics.ImageElement.call(this, element, graphics);

 ***REMOVED*****REMOVED***
  ***REMOVED*** X coordinate of the top left corner.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.x_ = x;


 ***REMOVED*****REMOVED***
  ***REMOVED*** Y coordinate of the top left corner.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.y_ = y;


 ***REMOVED*****REMOVED***
  ***REMOVED*** Width of the rectangle.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.w_ = w;


 ***REMOVED*****REMOVED***
  ***REMOVED*** Height of the rectangle.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.h_ = h;


 ***REMOVED*****REMOVED***
  ***REMOVED*** URL of the image source.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.src_ = src;
***REMOVED***
goog.inherits(goog.graphics.CanvasImageElement, goog.graphics.ImageElement);


***REMOVED***
***REMOVED*** Whether the image has been drawn yet.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.graphics.CanvasImageElement.prototype.drawn_ = false;


***REMOVED***
***REMOVED*** Update the position of the image.
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasImageElement.prototype.setPosition = function(x, y) {
  this.x_ = x;
  this.y_ = y;
  if (this.drawn_) {
    this.getGraphics().redraw();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Update the size of the image.
***REMOVED*** @param {number} width Width of rectangle.
***REMOVED*** @param {number} height Height of rectangle.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasImageElement.prototype.setSize = function(width, height) {
  this.w_ = width;
  this.h_ = height;
  if (this.drawn_) {
    this.getGraphics().redraw();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Update the source of the image.
***REMOVED*** @param {string} src Source of the image.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasImageElement.prototype.setSource = function(src) {
  this.src_ = src;
  if (this.drawn_) {
    // TODO(robbyw): Probably need to reload the image here.
    this.getGraphics().redraw();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Draw the image.  Should be treated as package scope.
***REMOVED*** @param {CanvasRenderingContext2D} ctx The context to draw the element in.
***REMOVED***
goog.graphics.CanvasImageElement.prototype.draw = function(ctx) {
  if (this.img_) {
    if (this.w_ && this.h_) {
      // If the image is already loaded, draw it.
      ctx.drawImage(this.img_, this.x_, this.y_, this.w_, this.h_);
    }
    this.drawn_ = true;

  } else {
    // Otherwise, load it.
    var img = new Image();
    img.onload = goog.bind(this.handleImageLoad_, this, img);
    // TODO(robbyw): Handle image load errors.
    img.src = this.src_;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handle an image load.
***REMOVED*** @param {Element} img The image element that finished loading.
***REMOVED*** @private
***REMOVED***
goog.graphics.CanvasImageElement.prototype.handleImageLoad_ = function(img) {
  this.img_ = img;

  // TODO(robbyw): Add a small delay to catch batched images
  this.getGraphics().redraw();
***REMOVED***
