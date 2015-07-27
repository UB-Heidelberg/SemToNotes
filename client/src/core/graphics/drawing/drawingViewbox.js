/**
 * @fileoverview A class representing the view-box of a drawing canvas.
 */

goog.provide('xrx.drawing.Viewbox');



goog.require('goog.math');
goog.require('goog.math.AffineTransform');
goog.require('xrx.drawing');



/**
 * A class representing the view-box of a drawing canvas.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @constructor
 */
xrx.drawing.Viewbox = function(drawing) {

  this.drawing_ = drawing;

  this.group_;

  this.ctm_ = new goog.math.AffineTransform();

  this.state_ = xrx.drawing.State.NONE;

  this.origin_;

  this.rotation_ = 0;

  this.create_();
};



/**
 * @private
 */
xrx.drawing.Viewbox.FixPoint_ = {
  C:  'C',  // center
  NE: 'NE', // northeast
  SE: 'SE', // southeast
  SW: 'SW', // southwest
  NW: 'NW'  // northwest
};



/**
 * @private
 */
xrx.drawing.Viewbox.Direction_ = {
  NORTH: 0,
  EAST:  1,
  SOUTH: 2,
  WEST:  3
};



/**
 * Makes the whole view-box width visible.
 * @deprecated
 */
xrx.drawing.Viewbox.prototype.setOptimalWidth = function() {
  var canvasWidth = this.drawing_.getCanvas().getWidth();
  var imageWidth = this.drawing_.getLayerBackground().getImage().getWidth();
  var scale = canvasWidth / imageWidth;
  this.ctm_.scale(scale, scale);
};



/**
 * Makes the whole view-box height visible.
 * @deprecated
 */
xrx.drawing.Viewbox.prototype.setOptimalHeight = function() {
  var canvasHeight = this.drawing_.getCanvas().getHeight();
  var imageHeight = this.drawing_.getLayerBackground().getImage().getHeight();
  var scale = canvasHeight / imageHeight;
  this.ctm_.scale(scale, scale);
};



/**
 * @private
 */
xrx.drawing.Viewbox.prototype.resetTransform_ = function() {
  this.ctm_.setTransform(1, 0, 0, 1, 0, 0);
  this.rotation_ = 0;
};



/**
 * @private
 */
xrx.drawing.Viewbox.prototype.isVertical_ = function() {
  return this.rotation_ === 0 || goog.math.isInt(this.rotation_ / 180);
};



xrx.drawing.Viewbox.prototype.fitToWidth = function() {
  var image = this.getDrawing().getLayerBackground().getImage();
	var canvasWidth = this.drawing_.getCanvas().getWidth();
  var scale = canvasWidth / image.getWidth();
  var tmp = this.rotation_; // we want to keep the rotation

  this.resetTransform_();
  this.rotate(tmp, xrx.drawing.Viewbox.FixPoint_.NW);
  this.zoom(scale, xrx.drawing.Viewbox.FixPoint_.NW);
};



xrx.drawing.Viewbox.prototype.fitToHeight = function() {
  var image = this.getDrawing().getLayerBackground().getImage();
	var canvasHeight = this.drawing_.getCanvas().getHeight();
  var scale = canvasHeight / image.getHeight();
  var tmp = this.rotation_; // we want to keep the rotation

  this.resetTransform_();
  this.rotate(tmp, xrx.drawing.Viewbox.FixPoint_.NW);
  this.zoom(scale, xrx.drawing.Viewbox.FixPoint_.NW);
};



xrx.drawing.Viewbox.prototype.fit = function() {
};



/**
 * Sets the maximal zoom factor.
 * @param {number} factor The maximal zoom factor, e.g., 2.5.
 */
xrx.drawing.Viewbox.prototype.setZoomMax = function(factor) {
  this.zoomMax_ = factor;
};



/**
 * Sets the minimum zoom factor.
 * @param {number} factor The minimal zoom factor, e.g., 0.1.
 */
xrx.drawing.Viewbox.prototype.setZoomMin = function(factor) {
  this.zoomMin_ = factor;
};



/**
 * Returns the parent drawing object of the view-box.
 * @return {xrx.drawing.Drawing} The drawing object.
 */
xrx.drawing.Viewbox.prototype.getDrawing = function() {
  return this.drawing_;
};



/**
 * Returns the group of the view-box.
 * @return {Object} The group.
 */
xrx.drawing.Viewbox.prototype.getGroup = function() {
  return this.group_;
};



/**
 * Returns the current transformation matrix of the view-box.
 * @return {goog.math.affineTransform} The transformation matrix.
 */
xrx.drawing.Viewbox.prototype.getCTM = function() {
  return this.ctm_;
};



/**
 * Sets the current transformation matrix of the view-box.
 * @param {goog.math.affineTransform} ctm The matrix object.
 */
xrx.drawing.Viewbox.prototype.setCTM = function(ctm) {
  this.ctm_ = ctm;
};



/**
 * Returns a dump of the current CTM as an array.
 * @return Array.<number> The number array.
 */
xrx.drawing.Viewbox.prototype.ctmDump = function() {
  return [this.ctm_.m00_, this.ctm_.m10_, this.ctm_.m01_,
      this.ctm_.m11_, this.ctm_.m02_, this.ctm_.m12_];
};



/**
 * Restores a CTM from an array.
 * @param Array.<number> dump The number array.
 */
xrx.drawing.Viewbox.prototype.ctmRestore = function(dump) {
  if (dump.length !== 6) throw Error('Invalid CTM dump.');
  this.ctm_.setTransform(dump[0], dump[1], dump[2], dump[3],
      dump[4], dump[5]);
};



/**
 * Returns the bounding-box for the view-box.
 * @return {goog.math.Box} The bounding box.
 */
xrx.drawing.Viewbox.prototype.getBox = function() {
  var image = this.drawing_.getLayerBackground().getImage();
  return image.getGeometry().getBox();
};



/**
 * Handles double-click events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleDblClick = function(e) {
  this.rotateRight();
};



/**
 * Handles mouse-down events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleDown = function(e) {
  var eventPoint = [e.clientX, e.clientY];
  var transform = new goog.math.AffineTransform();

  if (!this.origin_) this.origin_ = new Array(2);

  transform.createInverse().transform(eventPoint, 0, this.origin_, 0, 1);

  this.state_ = xrx.drawing.State.DRAG;
};



/**
 * Handles mouse-move events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleMove = function(e) {
  if (this.state_ !== xrx.drawing.State.DRAG) return;

  var point = new Array(2);
  var eventPoint = [e.clientX, e.clientY];
  var transform = new goog.math.AffineTransform();

  transform.createInverse().transform(eventPoint, 0, point, 0, 1);

  var x = point[0] - this.origin_[0];
  var y = point[1] - this.origin_[1];

  this.ctm_ = transform.translate(x, y).concatenate(this.ctm_);

  this.origin_ = point;

  if (this.drawing_.eventViewboxChange) this.drawing_.eventViewboxChange(); 
};



/**
 * Handles mouse-out events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleOut = function(e) {
  this.resetState_();
};



/**
 * Handles mouse-up events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleUp = function(e) {
  this.state_ = xrx.drawing.State.NONE;
};



/**
 * Handles mouse-wheel events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleZoom = function(e) {
  e.deltaY < 0 ? this.zoomIn(e) : this.zoomOut(e);
};



/**
 * @private
 */
xrx.drawing.Viewbox.prototype.resetState_ = function() {
  this.state_ = xrx.drawing.State.NONE;
  this.origin_ = null;
};



/**
 * @private
 */
xrx.drawing.Viewbox.prototype.getCenterPoint_ = function(opt_transformed) {
  var image = this.getDrawing().getLayerBackground().getImage();
  var natural = [image.getWidth() / 2, image.getHeight() / 2];
  var transformed;
  if (opt_transformed !== true) {
    return natural;
  } else {
    transformed = new Array(2);
    this.ctm_.transform(natural, 0, transformed, 0, 1);
    return transformed;
  }
};



xrx.drawing.Viewbox.prototype.getDirection_ = function() {
  var direction = {
    0:   xrx.drawing.Viewbox.Direction_.NORTH,
    90:  xrx.drawing.Viewbox.Direction_.EAST,
    180: xrx.drawing.Viewbox.Direction_.SOUTH,
    270: xrx.drawing.Viewbox.Direction_.WEST
  };
  return direction[this.rotation_];
};



/**
 * @private
 */
xrx.drawing.Viewbox.prototype.getAnchorPoints_ = function(opt_anchorPoint) {
  var image = this.getDrawing().getLayerBackground().getImage();
  var width = image.getWidth();
  var height = image.getHeight();
  return {
    0: [width / 2, width / 2], // north
    1: [height / 2, height / 2], // east 
    2: [width / 2, width / 2 + height / 2], // south
    3: [-height / 2 + width, height / 2] // west
  };
};



/**
 * @private
 */
xrx.drawing.Viewbox.prototype.getAnchorPoint_ = function(fixPoint) {
  var anchorPoints = this.getAnchorPoints_();
  var point = {
    'C': function(ap, vb) {
      return vb.getCenterPoint_();
    },
    'NE': function(ap, vb) {
      var order = [0, 1, 2, 3];
      return ap[order[vb.getDirection_()]];
    },
    'SE': function(ap, vb) {
      var order = [3, 0, 1, 2];
      return ap[order[vb.getDirection_()]];
    },
    'SW': function(ap, vb) {
      var order = [2, 3, 0, 1];
      return ap[order[vb.getDirection_()]];
    },
    'NW': function(ap, vb) {
      var order = [1, 2, 3, 0];
      return ap[order[vb.getDirection_()]];
    }
  };
  return point[fixPoint](anchorPoints, this);
};



/**
 * Rotates the view-box by an angle, respecting a fix-point.
 * @param {number?} opt_angle The angle of rotation, e.g. -40. Defaults
 *     to 90.
 * @param {enum?} opt_fixPoint The fix-point. Defaults to
 *     xrx.drawing.Viewbox.FixPoint_.C.
 */
xrx.drawing.Viewbox.prototype.rotate = function(opt_angle, opt_fixPoint) {
  var fixPoint;
  var point;
  var angle;
  var x;
  var y;

  opt_angle === undefined ? angle = 90 : angle = opt_angle;
  opt_fixPoint === undefined ? fixPoint = xrx.drawing.Viewbox.FixPoint_.C :
      fixPoint = opt_fixPoint;
  point = this.getAnchorPoint_(fixPoint);

  this.ctm_.rotate(goog.math.toRadians(angle), point[0], point[1]);
  this.rotation_ += angle;
  // rotation shall always be positive and between 0° and 360°
  this.rotation_ = (this.rotation_ + 360) % 360;
  if (this.drawing_.eventViewboxChange) this.drawing_.eventViewboxChange(); 
};



/**
 * @private
 */
xrx.drawing.Viewbox.prototype.getOffsetTranslate_ = function(scale, fixPoint) {
  var at = this.ctm_.clone();
  at.rotate(goog.math.toRadians(-this.rotation_), 0, 0);
  var scl = at.getScaleX();
  var image = this.getDrawing().getLayerBackground().getImage();
  var width = image.getWidth() * scl;
  var height = image.getHeight() * scl;
  console.log(height);
  var offset = {
    0: [0, 0],
    1: [0, -(height * scale - height)],
    2: [0, 0],
    3: [0, -(scale * height - height)]
  };
  var off = offset[this.getDirection_()];
  return {x: off[0], y: off[1]};
};



/**
 * Rotates the view-box by 90° in left direction.
 */
xrx.drawing.Viewbox.prototype.rotateLeft = function() {
  this.rotate(-90, xrx.drawing.Viewbox.FixPoint_.C);
};



xrx.drawing.Viewbox.prototype.zoomFactor_ = 1.05;



xrx.drawing.Viewbox.prototype.zoomValue_ = 0;



xrx.drawing.Viewbox.prototype.zoomStep_ = 1;



xrx.drawing.Viewbox.prototype.zoomMin_ = .1;



xrx.drawing.Viewbox.prototype.zoomMax_ = 2;



/**
 * Rotates the view-box by 90° in right direction.
 */
xrx.drawing.Viewbox.prototype.rotateRight = function() {
  this.rotate(90, xrx.drawing.Viewbox.FixPoint_.C);
};



xrx.drawing.Viewbox.prototype.getScale = function() {
  return Math.sqrt(Math.pow(this.ctm_.getScaleX(), 2) +
      Math.pow(this.ctm_.getShearX(), 2))
};



/**
 * @private
 */
xrx.drawing.Viewbox.prototype.zoomOffset_ = function(point, scale) {
  this.ctm_.setTransform(
    this.ctm_.getScaleX(), this.ctm_.getShearY(), 
    this.ctm_.getShearX(), this.ctm_.getScaleY(),
    (this.ctm_.getTranslateX() - point[0]) * scale + point[0],
    (this.ctm_.getTranslateY() - point[1]) * scale + point[1]
  );
};



/**
 * 
 */
xrx.drawing.Viewbox.prototype.zoomTo = function(zoomValue, opt_fixPoint) {
	if(zoomValue === this.zoomValue_) return;

  var scale = Math.pow(this.zoomFactor_, zoomValue);
  var fixPoint = opt_fixPoint ? opt_fixPoint : this.getCenterPoint_(true);
	if(scale < this.zoomMin_) scale = this.zoomMin_;
	if(scale > this.zoomMax_) scale = this.zoomMax_;

	scale /= this.getScale();

	this.zoomOffset_(fixPoint, scale);
	this.ctm_.scale(scale, scale);

  this.zoomValue_ = zoomValue;
  if (this.drawing_.eventViewboxChange) this.drawing_.eventViewboxChange(); 
};



/**
 * Zoom in on the view-box.
 * @param {?goog.events.BrowserEvent} opt_e The browser event.
 */
xrx.drawing.Viewbox.prototype.zoomIn = function(opt_e) {
  var fixPoint = opt_e ? [opt_e.offsetX, opt_e.offsetY] :
      this.getCenterPoint_(true);
  this.zoomTo(this.zoomValue_ + this.zoomStep_, fixPoint);
};



/**
 * Zoom out the view-box.
 * @param {?goog.events.BrowserEvent} opt_e The browser event.
 */
xrx.drawing.Viewbox.prototype.zoomOut = function(opt_e) {
  var fixPoint = opt_e ? [opt_e.offsetX, opt_e.offsetY] :
      this.getCenterPoint_(true);
  this.zoomTo(this.zoomValue_ - this.zoomStep_, fixPoint);
};



/**
 * @private
 */
xrx.drawing.Viewbox.prototype.create_ = function() {
  var graphics = this.drawing_.getGraphics();
  var canvas = this.drawing_.getCanvas();
  this.group_ = graphics.Group.create(canvas);
};
