/**
 * @fileoverview A class representing the view-box of a drawing canvas.
 */

goog.provide('xrx.drawing.Viewbox');



goog.require('goog.math');
goog.require('goog.math.AffineTransform');
goog.require('xrx.drawing');
goog.require('xrx.drawing.ViewboxZoom');



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

  this.create_();

  goog.base(this);
};
goog.inherits(xrx.drawing.Viewbox, xrx.drawing.ViewboxZoom);



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
 * @private
 */
xrx.drawing.Viewbox.prototype.resetState_ = function() {
  this.state_ = xrx.drawing.State.NONE;
  this.origin_ = null;
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



xrx.drawing.Viewbox.prototype.fitToWidth = function() {
  var image = this.getDrawing().getLayerBackground().getImage();
	var canvasWidth = this.drawing_.getCanvas().getWidth();
  var scale = canvasWidth / image.getWidth();
  var tmp = this.rotation_; // we want to keep the rotation

  this.resetTransform_();
  this.rotate(tmp, xrx.drawing.ViewboxGeometry.FixPoint.NW);
  this.zoom(scale, xrx.drawing.ViewboxGeometry.FixPoint.NW);
};



xrx.drawing.Viewbox.prototype.fitToHeight = function() {
  var image = this.getDrawing().getLayerBackground().getImage();
	var canvasHeight = this.drawing_.getCanvas().getHeight();
  var scale = canvasHeight / image.getHeight();
  var tmp = this.rotation_; // we want to keep the rotation

  this.resetTransform_();
  this.rotate(tmp, xrx.drawing.ViewboxGeometry.FixPoint.NW);
  this.zoom(scale, xrx.drawing.ViewboxGeometry.FixPoint.NW);
};



xrx.drawing.Viewbox.prototype.fit = function() {
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
  e.deltaY < 0 ? this.zoomIn([e.offsetX, e.offsetY]) :
      this.zoomOut([e.offsetX, e.offsetY]);
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
 * @private
 */
xrx.drawing.Viewbox.prototype.getOffsetTranslate_ = function(scale, fixPoint) {
  var at = this.ctm_.clone();
  at.rotate(goog.math.toRadians(-this.rotation_), 0, 0);
  var scl = at.getScaleX();
  var image = this.getDrawing().getLayerBackground().getImage();
  var width = image.getWidth() * scl;
  var height = image.getHeight() * scl;
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
 * @private
 */
xrx.drawing.Viewbox.prototype.create_ = function() {
  var graphics = this.drawing_.getGraphics();
  var canvas = this.drawing_.getCanvas();
  this.group_ = graphics.Group.create(canvas);
};
