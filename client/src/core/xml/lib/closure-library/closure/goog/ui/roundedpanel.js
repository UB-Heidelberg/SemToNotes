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
***REMOVED*** @fileoverview Class definition for a rounded corner panel.
***REMOVED*** @supported IE 6.0+, Safari 2.0+, Firefox 1.5+, Opera 9.2+.
***REMOVED*** @see ../demos/roundedpanel.html
***REMOVED***

goog.provide('goog.ui.BaseRoundedPanel');
goog.provide('goog.ui.CssRoundedPanel');
goog.provide('goog.ui.GraphicsRoundedPanel');
goog.provide('goog.ui.RoundedPanel');
goog.provide('goog.ui.RoundedPanel.Corner');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.graphics');
goog.require('goog.graphics.Path');
goog.require('goog.graphics.SolidFill');
goog.require('goog.graphics.Stroke');
goog.require('goog.math.Coordinate');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Factory method that returns an instance of a BaseRoundedPanel.
***REMOVED*** @param {number} radius The radius of the rounded corner(s), in pixels.
***REMOVED*** @param {number} borderWidth The thickness of the border, in pixels.
***REMOVED*** @param {string} borderColor The border color of the panel.
***REMOVED*** @param {string=} opt_backgroundColor The background color of the panel.
***REMOVED*** @param {number=} opt_corners The corners of the panel to be rounded. Any
***REMOVED***     corners not specified will be rendered as square corners. Will default
***REMOVED***     to all square corners if not specified.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DOM helper object for the
***REMOVED***     document we want to render in.
***REMOVED*** @return {goog.ui.BaseRoundedPanel} An instance of a
***REMOVED***     goog.ui.BaseRoundedPanel subclass.
***REMOVED***
goog.ui.RoundedPanel.create = function(radius,
                                       borderWidth,
                                       borderColor,
                                       opt_backgroundColor,
                                       opt_corners,
                                       opt_domHelper) {
  // This variable checks for the presence of Safari 3.0+ or Gecko 1.9+,
  // which can leverage special CSS styles to create rounded corners.
  var isCssReady = goog.userAgent.WEBKIT && goog.userAgent.isVersion('500') ||
      goog.userAgent.GECKO && goog.userAgent.isVersion('1.9a');

  if (isCssReady) {
    // Safari 3.0+ and Firefox 3.0+ support this instance.
    return new goog.ui.CssRoundedPanel(
        radius,
        borderWidth,
        borderColor,
        opt_backgroundColor,
        opt_corners,
        opt_domHelper);
  } else {
    return new goog.ui.GraphicsRoundedPanel(
        radius,
        borderWidth,
        borderColor,
        opt_backgroundColor,
        opt_corners,
        opt_domHelper);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Enum for specifying which corners to render.
***REMOVED*** @enum {number}
***REMOVED***
goog.ui.RoundedPanel.Corner = {
  NONE: 0,
  BOTTOM_LEFT: 2,
  TOP_LEFT: 4,
  LEFT: 6, // BOTTOM_LEFT | TOP_LEFT
  TOP_RIGHT: 8,
  TOP: 12, // TOP_LEFT | TOP_RIGHT
  BOTTOM_RIGHT: 1,
  BOTTOM: 3, // BOTTOM_LEFT | BOTTOM_RIGHT
  RIGHT: 9, // TOP_RIGHT | BOTTOM_RIGHT
  ALL: 15 // TOP | BOTTOM
***REMOVED***


***REMOVED***
***REMOVED*** CSS class name suffixes for the elements comprising the RoundedPanel.
***REMOVED*** @enum {string}
***REMOVED*** @private
***REMOVED***
goog.ui.RoundedPanel.Classes_ = {
  BACKGROUND: goog.getCssName('goog-roundedpanel-background'),
  PANEL: goog.getCssName('goog-roundedpanel'),
  CONTENT: goog.getCssName('goog-roundedpanel-content')
***REMOVED***



***REMOVED***
***REMOVED*** Base class for the hierarchy of RoundedPanel classes. Do not
***REMOVED*** instantiate directly. Instead, call goog.ui.RoundedPanel.create().
***REMOVED*** The HTML structure for the RoundedPanel is:
***REMOVED*** <pre>
***REMOVED*** - div (Contains the background and content. Class name: goog-roundedpanel)
***REMOVED***   - div (Contains the background/rounded corners. Class name:
***REMOVED***       goog-roundedpanel-bg)
***REMOVED***   - div (Contains the content. Class name: goog-roundedpanel-content)
***REMOVED*** </pre>
***REMOVED*** @param {number} radius The radius of the rounded corner(s), in pixels.
***REMOVED*** @param {number} borderWidth The thickness of the border, in pixels.
***REMOVED*** @param {string} borderColor The border color of the panel.
***REMOVED*** @param {string=} opt_backgroundColor The background color of the panel.
***REMOVED*** @param {number=} opt_corners The corners of the panel to be rounded. Any
***REMOVED***     corners not specified will be rendered as square corners. Will default
***REMOVED***     to all square corners if not specified.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DOM helper object for the
***REMOVED***     document we want to render in.
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
***REMOVED***
goog.ui.BaseRoundedPanel = function(radius,
                                    borderWidth,
                                    borderColor,
                                    opt_backgroundColor,
                                    opt_corners,
                                    opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The radius of the rounded corner(s), in pixels.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.radius_ = radius;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The thickness of the border, in pixels.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.borderWidth_ = borderWidth;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The border color of the panel.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.borderColor_ = borderColor;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The background color of the panel.
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.backgroundColor_ = opt_backgroundColor || null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The corners of the panel to be rounded; defaults to
  ***REMOVED*** goog.ui.RoundedPanel.Corner.NONE
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.corners_ = opt_corners || goog.ui.RoundedPanel.Corner.NONE;
***REMOVED***
goog.inherits(goog.ui.BaseRoundedPanel, goog.ui.Component);


***REMOVED***
***REMOVED*** The element containing the rounded corners and background.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.BaseRoundedPanel.prototype.backgroundElement_;


***REMOVED***
***REMOVED*** The element containing the actual content.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.BaseRoundedPanel.prototype.contentElement_;


***REMOVED***
***REMOVED*** This method performs all the necessary DOM manipulation to create the panel.
***REMOVED*** Overrides {@link goog.ui.Component#decorateInternal}.
***REMOVED*** @param {Element} element The element to decorate.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.BaseRoundedPanel.prototype.decorateInternal = function(element) {
  goog.ui.BaseRoundedPanel.superClass_.decorateInternal.call(this, element);
  goog.dom.classes.add(this.getElement(), goog.ui.RoundedPanel.Classes_.PANEL);

  // Create backgroundElement_, and add it to the DOM.
  this.backgroundElement_ = this.getDomHelper().createElement('div');
  this.backgroundElement_.className = goog.ui.RoundedPanel.Classes_.BACKGROUND;
  this.getElement().appendChild(this.backgroundElement_);

  // Set contentElement_ by finding a child node within element_ with the
  // proper class name. If none exists, create it and add it to the DOM.
  this.contentElement_ = goog.dom.getElementsByTagNameAndClass(
      null, goog.ui.RoundedPanel.Classes_.CONTENT, this.getElement())[0];
  if (!this.contentElement_) {
    this.contentElement_ = this.getDomHelper().createDom('div');
    this.contentElement_.className = goog.ui.RoundedPanel.Classes_.CONTENT;
    this.getElement().appendChild(this.contentElement_);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.BaseRoundedPanel.prototype.disposeInternal = function() {
  if (this.backgroundElement_) {
    this.getDomHelper().removeNode(this.backgroundElement_);
    this.backgroundElement_ = null;
  }
  this.contentElement_ = null;
  goog.ui.BaseRoundedPanel.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the DOM element containing the actual content.
***REMOVED*** @return {Element} The element containing the actual content (null if none).
***REMOVED*** @override
***REMOVED***
goog.ui.BaseRoundedPanel.prototype.getContentElement = function() {
  return this.contentElement_;
***REMOVED***



***REMOVED***
***REMOVED*** RoundedPanel class specifically for browsers that support CSS attributes
***REMOVED*** for elements with rounded borders (ex. Safari 3.0+, Firefox 3.0+). Do not
***REMOVED*** instantiate directly. Instead, call goog.ui.RoundedPanel.create().
***REMOVED*** @param {number} radius The radius of the rounded corner(s), in pixels.
***REMOVED*** @param {number} borderWidth The thickness of the border, in pixels.
***REMOVED*** @param {string} borderColor The border color of the panel.
***REMOVED*** @param {string=} opt_backgroundColor The background color of the panel.
***REMOVED*** @param {number=} opt_corners The corners of the panel to be rounded. Any
***REMOVED***     corners not specified will be rendered as square corners. Will
***REMOVED***     default to all square corners if not specified.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DOM helper object for the
***REMOVED***     document we want to render in.
***REMOVED*** @extends {goog.ui.BaseRoundedPanel}
***REMOVED***
***REMOVED***
goog.ui.CssRoundedPanel = function(radius,
                                   borderWidth,
                                   borderColor,
                                   opt_backgroundColor,
                                   opt_corners,
                                   opt_domHelper) {
  goog.ui.BaseRoundedPanel.call(this,
                                radius,
                                borderWidth,
                                borderColor,
                                opt_backgroundColor,
                                opt_corners,
                                opt_domHelper);
***REMOVED***
goog.inherits(goog.ui.CssRoundedPanel, goog.ui.BaseRoundedPanel);


***REMOVED***
***REMOVED*** This method performs all the necessary DOM manipulation to create the panel.
***REMOVED*** Overrides {@link goog.ui.Component#decorateInternal}.
***REMOVED*** @param {Element} element The element to decorate.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.CssRoundedPanel.prototype.decorateInternal = function(element) {
  goog.ui.CssRoundedPanel.superClass_.decorateInternal.call(this, element);

  // Set the border width and background color, if needed.
  this.backgroundElement_.style.border = this.borderWidth_ +
      'px solid ' +
      this.borderColor_;
  if (this.backgroundColor_) {
    this.backgroundElement_.style.backgroundColor = this.backgroundColor_;
  }

  // Set radii of the appropriate rounded corners.
  if (this.corners_ == goog.ui.RoundedPanel.Corner.ALL) {
    var styleName = this.getStyle_(goog.ui.RoundedPanel.Corner.ALL);
    this.backgroundElement_.style[styleName] = this.radius_ + 'px';
  } else {
    var topLeftRadius =
        this.corners_ & goog.ui.RoundedPanel.Corner.TOP_LEFT ?
        this.radius_ :
        0;
    var cornerStyle = this.getStyle_(goog.ui.RoundedPanel.Corner.TOP_LEFT);
    this.backgroundElement_.style[cornerStyle] = topLeftRadius + 'px';
    var topRightRadius =
        this.corners_ & goog.ui.RoundedPanel.Corner.TOP_RIGHT ?
        this.radius_ :
        0;
    cornerStyle = this.getStyle_(goog.ui.RoundedPanel.Corner.TOP_RIGHT);
    this.backgroundElement_.style[cornerStyle] = topRightRadius + 'px';
    var bottomRightRadius =
        this.corners_ & goog.ui.RoundedPanel.Corner.BOTTOM_RIGHT ?
        this.radius_ :
        0;
    cornerStyle = this.getStyle_(goog.ui.RoundedPanel.Corner.BOTTOM_RIGHT);
    this.backgroundElement_.style[cornerStyle] = bottomRightRadius + 'px';
    var bottomLeftRadius =
        this.corners_ & goog.ui.RoundedPanel.Corner.BOTTOM_LEFT ?
        this.radius_ :
        0;
    cornerStyle = this.getStyle_(goog.ui.RoundedPanel.Corner.BOTTOM_LEFT);
    this.backgroundElement_.style[cornerStyle] = bottomLeftRadius + 'px';
  }
***REMOVED***


***REMOVED***
***REMOVED*** This method returns the CSS style based on the corner of the panel, and the
***REMOVED*** user-agent.
***REMOVED*** @param {number} corner The corner whose style name to retrieve.
***REMOVED*** @private
***REMOVED*** @return {string} The CSS style based on the specified corner.
***REMOVED***
goog.ui.CssRoundedPanel.prototype.getStyle_ = function(corner) {
  // Determine the proper corner to work with.
  var cssCorner, suffixLeft, suffixRight;
  if (goog.userAgent.WEBKIT) {
    suffixLeft = 'Left';
    suffixRight = 'Right';
  } else {
    suffixLeft = 'left';
    suffixRight = 'right';
  }
  switch (corner) {
    case goog.ui.RoundedPanel.Corner.ALL:
      cssCorner = '';
      break;
    case goog.ui.RoundedPanel.Corner.TOP_LEFT:
      cssCorner = 'Top' + suffixLeft;
      break;
    case goog.ui.RoundedPanel.Corner.TOP_RIGHT:
      cssCorner = 'Top' + suffixRight;
      break;
    case goog.ui.RoundedPanel.Corner.BOTTOM_LEFT:
      cssCorner = 'Bottom' + suffixLeft;
      break;
    case goog.ui.RoundedPanel.Corner.BOTTOM_RIGHT:
      cssCorner = 'Bottom' + suffixRight;
      break;
  }

  return goog.userAgent.WEBKIT ?
      'WebkitBorder' + cssCorner + 'Radius' :
      'MozBorderRadius' + cssCorner;
***REMOVED***



***REMOVED***
***REMOVED*** RoundedPanel class that uses goog.graphics to create the rounded corners.
***REMOVED*** Do not instantiate directly. Instead, call goog.ui.RoundedPanel.create().
***REMOVED*** @param {number} radius The radius of the rounded corner(s), in pixels.
***REMOVED*** @param {number} borderWidth The thickness of the border, in pixels.
***REMOVED*** @param {string} borderColor The border color of the panel.
***REMOVED*** @param {string=} opt_backgroundColor The background color of the panel.
***REMOVED*** @param {number=} opt_corners The corners of the panel to be rounded. Any
***REMOVED***     corners not specified will be rendered as square corners. Will
***REMOVED***     default to all square corners if not specified.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DOM helper object for the
***REMOVED***     document we want to render in.
***REMOVED*** @extends {goog.ui.BaseRoundedPanel}
***REMOVED***
***REMOVED***
goog.ui.GraphicsRoundedPanel = function(radius,
                                        borderWidth,
                                        borderColor,
                                        opt_backgroundColor,
                                        opt_corners,
                                        opt_domHelper) {
  goog.ui.BaseRoundedPanel.call(this,
                                radius,
                                borderWidth,
                                borderColor,
                                opt_backgroundColor,
                                opt_corners,
                                opt_domHelper);
***REMOVED***
goog.inherits(goog.ui.GraphicsRoundedPanel, goog.ui.BaseRoundedPanel);


***REMOVED***
***REMOVED*** A 4-element array containing the circle centers for the arcs in the
***REMOVED*** bottom-left, top-left, top-right, and bottom-right corners, respectively.
***REMOVED*** @type {Array.<goog.math.Coordinate>}
***REMOVED*** @private
***REMOVED***
goog.ui.GraphicsRoundedPanel.prototype.arcCenters_;


***REMOVED***
***REMOVED*** A 4-element array containing the start coordinates for rendering the arcs
***REMOVED*** in the bottom-left, top-left, top-right, and bottom-right corners,
***REMOVED*** respectively.
***REMOVED*** @type {Array.<goog.math.Coordinate>}
***REMOVED*** @private
***REMOVED***
goog.ui.GraphicsRoundedPanel.prototype.cornerStarts_;


***REMOVED***
***REMOVED*** A 4-element array containing the arc end angles for the bottom-left,
***REMOVED*** top-left, top-right, and bottom-right corners, respectively.
***REMOVED*** @type {Array.<number>}
***REMOVED*** @private
***REMOVED***
goog.ui.GraphicsRoundedPanel.prototype.endAngles_;


***REMOVED***
***REMOVED*** Graphics object for rendering the background.
***REMOVED*** @type {goog.graphics.AbstractGraphics}
***REMOVED*** @private
***REMOVED***
goog.ui.GraphicsRoundedPanel.prototype.graphics_;


***REMOVED***
***REMOVED*** A 4-element array containing the rounded corner radii for the bottom-left,
***REMOVED*** top-left, top-right, and bottom-right corners, respectively.
***REMOVED*** @type {Array.<number>}
***REMOVED*** @private
***REMOVED***
goog.ui.GraphicsRoundedPanel.prototype.radii_;


***REMOVED***
***REMOVED*** A 4-element array containing the arc start angles for the bottom-left,
***REMOVED*** top-left, top-right, and bottom-right corners, respectively.
***REMOVED*** @type {Array.<number>}
***REMOVED*** @private
***REMOVED***
goog.ui.GraphicsRoundedPanel.prototype.startAngles_;


***REMOVED***
***REMOVED*** Thickness constant used as an offset to help determine where to start
***REMOVED*** rendering.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.GraphicsRoundedPanel.BORDER_WIDTH_FACTOR_ = 1 / 2;


***REMOVED***
***REMOVED*** This method performs all the necessary DOM manipulation to create the panel.
***REMOVED*** Overrides {@link goog.ui.Component#decorateInternal}.
***REMOVED*** @param {Element} element The element to decorate.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.GraphicsRoundedPanel.prototype.decorateInternal =
    function(element) {
  goog.ui.GraphicsRoundedPanel.superClass_.decorateInternal.call(this,
                                                                 element);

  // Calculate the points and angles for creating the rounded corners. Then
  // instantiate a Graphics object for drawing purposes.
  var elementSize = goog.style.getSize(this.getElement());
  this.calculateArcParameters_(elementSize);
  this.graphics_ = goog.graphics.createGraphics(
     ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (elementSize.width),
     ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (elementSize.height),
     ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (elementSize.width),
     ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (elementSize.height),
      this.getDomHelper());
  this.graphics_.createDom();

  // Create the path, starting from the bottom-right corner, moving clockwise.
  // End with the top-right corner.
  var path = new goog.graphics.Path();
  for (var i = 0; i < 4; i++) {
    if (this.radii_[i]) {
      // If radius > 0, draw an arc, moving to the first point and drawing
      // a line to the others.
      var cx = this.arcCenters_[i].x;
      var cy = this.arcCenters_[i].y;
      var rx = this.radii_[i];
      var ry = rx;
      var fromAngle = this.startAngles_[i];
      var extent = this.endAngles_[i] - fromAngle;
      var startX = cx + goog.math.angleDx(fromAngle, rx);
      var startY = cy + goog.math.angleDy(fromAngle, ry);
      if (i > 0) {
        var currentPoint = path.getCurrentPoint();
        if (!currentPoint || startX != currentPoint[0] ||
            startY != currentPoint[1]) {
          path.lineTo(startX, startY);
        }
      } else {
        path.moveTo(startX, startY);
      }
      path.arcTo(rx, ry, fromAngle, extent);
    } else if (i == 0) {
      // If we're just starting out (ie. i == 0), move to the starting point.
      path.moveTo(this.cornerStarts_[i].x,
                  this.cornerStarts_[i].y);
    } else {
      // Otherwise, draw a line to the starting point.
      path.lineTo(this.cornerStarts_[i].x,
                  this.cornerStarts_[i].y);
    }
  }

  // Close the path, create a stroke object, and fill the enclosed area, if
  // needed. Then render the path.
  path.close();
  var stroke = this.borderWidth_ ?
      new goog.graphics.Stroke(this.borderWidth_, this.borderColor_) :
      null;
  var fill = this.backgroundColor_ ?
      new goog.graphics.SolidFill(this.backgroundColor_, 1) :
      null;
  this.graphics_.drawPath(path, stroke, fill);
  this.graphics_.render(this.backgroundElement_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.GraphicsRoundedPanel.prototype.disposeInternal = function() {
  goog.ui.GraphicsRoundedPanel.superClass_.disposeInternal.call(this);
  this.graphics_.dispose();
  delete this.graphics_;
  delete this.radii_;
  delete this.cornerStarts_;
  delete this.arcCenters_;
  delete this.startAngles_;
  delete this.endAngles_;
***REMOVED***


***REMOVED***
***REMOVED*** Calculates the start coordinates, circle centers, and angles, for the rounded
***REMOVED*** corners at each corner of the panel.
***REMOVED*** @param {goog.math.Size} elementSize The size of element_.
***REMOVED*** @private
***REMOVED***
goog.ui.GraphicsRoundedPanel.prototype.calculateArcParameters_ =
    function(elementSize) {
  // Initialize the arrays containing the key points and angles.
  this.radii_ = [];
  this.cornerStarts_ = [];
  this.arcCenters_ = [];
  this.startAngles_ = [];
  this.endAngles_ = [];

  // Set the start points, circle centers, and angles for the bottom-right,
  // bottom-left, top-left and top-right corners, in that order.
  var angleInterval = 90;
  var borderWidthOffset = this.borderWidth_***REMOVED***
      goog.ui.GraphicsRoundedPanel.BORDER_WIDTH_FACTOR_;
  var radius, xStart, yStart, xCenter, yCenter, startAngle, endAngle;
  for (var i = 0; i < 4; i++) {
    var corner = Math.pow(2, i);  // Determines which corner we're dealing with.
    var isLeft = corner & goog.ui.RoundedPanel.Corner.LEFT;
    var isTop = corner & goog.ui.RoundedPanel.Corner.TOP;

    // Calculate the radius and the start coordinates.
    radius = corner & this.corners_ ? this.radius_ : 0;
    switch (corner) {
      case goog.ui.RoundedPanel.Corner.BOTTOM_LEFT:
        xStart = borderWidthOffset + radius;
        yStart = elementSize.height - borderWidthOffset;
        break;
      case goog.ui.RoundedPanel.Corner.TOP_LEFT:
        xStart = borderWidthOffset;
        yStart = radius + borderWidthOffset;
        break;
      case goog.ui.RoundedPanel.Corner.TOP_RIGHT:
        xStart = elementSize.width - radius - borderWidthOffset;
        yStart = borderWidthOffset;
        break;
      case goog.ui.RoundedPanel.Corner.BOTTOM_RIGHT:
        xStart = elementSize.width - borderWidthOffset;
        yStart = elementSize.height - radius - borderWidthOffset;
        break;
    }

    // Calculate the circle centers and start/end angles.
    xCenter = isLeft ?
        radius + borderWidthOffset :
        elementSize.width - radius - borderWidthOffset;
    yCenter = isTop ?
        radius + borderWidthOffset :
        elementSize.height - radius - borderWidthOffset;
    startAngle = angleInterval***REMOVED*** i;
    endAngle = startAngle + angleInterval;

    // Append the radius, angles, and coordinates to their arrays.
    this.radii_[i] = radius;
    this.cornerStarts_[i] = new goog.math.Coordinate(xStart, yStart);
    this.arcCenters_[i] = new goog.math.Coordinate(xCenter, yCenter);
    this.startAngles_[i] = startAngle;
    this.endAngles_[i] = endAngle;
  }
***REMOVED***
