/**
 * @fileoverview A class representing the view-box of a drawing canvas.
 */

goog.provide('xrx.drawing.Viewbox');



goog.require('goog.math');
goog.require('goog.math.AffineTransform');
goog.require('goog.ui.RangeModel');
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

  this.zoomStep_ = 1.2;

  this.zoomModel_ = new goog.ui.RangeModel();

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
  this.scale(scale, xrx.drawing.Viewbox.FixPoint_.NW);
};



xrx.drawing.Viewbox.prototype.fitToHeight = function() {
  var image = this.getDrawing().getLayerBackground().getImage();
	var canvasHeight = this.drawing_.getCanvas().getHeight();
  var scale = canvasHeight / image.getHeight();
  var tmp = this.rotation_; // we want to keep the rotation

  this.resetTransform_();
  this.rotate(tmp, xrx.drawing.Viewbox.FixPoint_.NW);
  this.scale(scale, xrx.drawing.Viewbox.FixPoint_.NW);
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
xrx.drawing.Viewbox.prototype.getCenterPoint_ = function() {
  var image = this.getDrawing().getLayerBackground().getImage();
  return [image.getWidth() / 2, image.getHeight() / 2];
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
 * Scales the view-box by a factor, respecting a fix-point.
 */
xrx.drawing.Viewbox.prototype.scale = function(scale, opt_fixPoint) {
  var fixPoint;
  var translate;

  opt_fixPoint === undefined ? fixPoint = xrx.drawing.Viewbox.FixPoint_.NW :
      fixPoint = opt_fixPoint;

  this.zoom(scale);
  translate = this.getOffsetTranslate_(scale, fixPoint);
  this.ctm_.translate(translate.x, translate.y);
};



/**
 * Rotates the view-box by 90° in left direction.
 */
xrx.drawing.Viewbox.prototype.rotateLeft = function() {
  this.rotate(-90, xrx.drawing.Viewbox.FixPoint_.C);
};



/**
 * Rotates the view-box by 90° in right direction.
 */
xrx.drawing.Viewbox.prototype.rotateRight = function() {
  this.rotate(90, xrx.drawing.Viewbox.FixPoint_.C);
};



xrx.drawing.Viewbox.prototype.getZoom = function() {
  return Math.sqrt(Math.pow(this.ctm_.getScaleX(), 2) +
      Math.pow(this.ctm_.getShearX(), 2))
};



/**
 * @private
 */
xrx.drawing.Viewbox.prototype.setOffsetZoom_ = function(opt_e, scale) {
  var offsetX = opt_e === undefined ? this.drawing_.getCanvas().getWidth() / 2 : opt_e.offsetX;
  var offsetY = opt_e === undefined ? this.drawing_.getCanvas().getHeight() / 2 : opt_e.offsetY;
  this.ctm_.setTransform(
    this.ctm_.getScaleX(), this.ctm_.getShearY(), 
    this.ctm_.getShearX(), this.ctm_.getScaleY(),
    (this.ctm_.getTranslateX() - offsetX) * scale + offsetX,
    (this.ctm_.getTranslateY() - offsetY) * scale + offsetY
  );
};



/**
 * Zoom in on the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.zoomIn = function(e) {
	var scale = this.zoomStep_;
  if (this.getZoom() < this.zoomModel_.getMaximum()) {
    this.ctm_.scale(scale, scale);
    this.setOffsetZoom_(e, scale);
  }
  if (this.drawing_.handleViewboxUpdate) this.drawing_.handleViewboxUpdate('zoomIn'); 
};



/**
 * Zoom out the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.zoomOut = function(e) {
  var scale = 1 / this.zoomStep_;
  if (this.getZoom() > this.zoomModel_.getMinimum()) {
    this.ctm_.scale(scale, scale);
    this.setOffsetZoom_(e, scale);
  }
  if (this.drawing_.handleViewboxUpdate) this.drawing_.handleViewboxUpdate('zoomOut'); 
};



/**
 * Zoom (to) the view-box; 0 == no zoom, n == zoomStep_ ^ n
 */
xrx.drawing.Viewbox.prototype.zoomTo = function(n) {
  var s = Math.pow(this.zoomStep_, n);

	if(this.zoomMin_ !== undefined && s < this.zoomMin_) s = this.zoomMin_;
	if(this.zoomMax_ !== undefined && s > this.zoomMax_) s = this.zoomMax_;
  var current_scale = Math.sqrt(Math.pow(this.ctm_.getScaleX(), 2) + Math.pow(this.ctm_.getShearX(), 2));
	if(s === current_scale) return;

	s /= current_scale;

	this.ctm_.scale(s, s);

	var offX = this.drawing_.getCanvas().getWidth() / 2;
	var offY = this.drawing_.getCanvas().getHeight()/ 2;
	this.ctm_.setTransform(
		this.ctm_.getScaleX(), this.ctm_.getShearY(), 
		this.ctm_.getShearX(), this.ctm_.getScaleY(),
		(this.ctm_.getTranslateX() - offX) * s + offX,
		(this.ctm_.getTranslateY() - offY) * s + offY
	);
  if (this.drawing_.handleViewboxUpdate) this.drawing_.handleViewboxUpdate('zoomTo'); 
};



/**
 * @private
 */
xrx.drawing.Viewbox.prototype.create_ = function() {
  var graphics = this.drawing_.getGraphics();
  var canvas = this.drawing_.getCanvas();
  this.group_ = graphics.Group.create(canvas);
};
