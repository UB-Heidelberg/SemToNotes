/**
 * @fileoverview Classes representing a modifiable and creatable
 *     engine-independent poly-line shape.
 */

goog.provide('xrx.shape.Polyline');
goog.provide('xrx.shape.PolylineCreatable');
goog.provide('xrx.shape.PolylineModifiable');



goog.require('xrx.geometry.Path');
goog.require('xrx.shape.Stylable');



/**
 * Classes representing an engine-independent poly-line shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @constructor
 */
xrx.shape.Polyline = function(canvas) {

  goog.base(this, canvas,
      canvas.getEngine().createPolyline(canvas.getEngineElement()),
      new xrx.geometry.Path());
};
goog.inherits(xrx.shape.Polyline, xrx.shape.Stylable);



/**
 * Draws this poly-line shape.
 */
xrx.shape.Polyline.prototype.draw = function() {
  this.startDrawing_();
  this.engineElement_.draw(this.getCoords(), this.getFillColor(),
      this.getFillOpacity(), this.getStrokeColor(),
      this.getStrokeWidth());
  this.finishDrawing_();
};



/**
 * Creates a new poly-line shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 */
xrx.shape.Polyline.create = function(canvas) {
  return new xrx.shape.Polyline(canvas);
};



/**
 * Returns a modifiable poly-line shape. Create it lazily if not existent.
 * @return {xrx.shape.PolylineModify} The modifiable poly-line shape.
 */
xrx.shape.Polyline.prototype.getModifiable = function() {
  if (!this.modifiable_) this.modifiable_ = xrx.shape.PolylineModifiable.create(this);
  return this.modifiable_;
};



/**
 * Returns a creatable poly-line shape. Create it lazily if not existent.
 * @return {xrx.shape.PolylineModify} The creatable poly-line shape.
 */
xrx.shape.Polyline.prototype.getCreatable = function() {
  if (!this.creatable_) this.creatable_ = xrx.shape.PolylineCreatable.create(this);
  return this.creatable_;
};



/**
 * A class representing a modifiable poly-line shape.
 * @constructor
 */
xrx.shape.PolylineModifiable = function(polyline, helper) {

  goog.base(this, polyline, helper);
};
goog.inherits(xrx.shape.PolylineModifiable, xrx.shape.Modifiable);




xrx.shape.PolylineModifiable.prototype.setCoords = function(coords, position) {
  for(var i = 0, len = this.dragger_.length; i < len; i++) {
    if (i !== position) {
      this.dragger_[i].setCoordX(coords[i][0]);
      this.dragger_[i].setCoordY(coords[i][1]);
    }
  }
  this.shape_.setCoords(coords);
};



xrx.shape.PolylineModifiable.prototype.setCoordAt = function(pos, coord) {
  this.dragger_[pos].setCoordX(coord[0]);
  this.dragger_[pos].setCoordY(coord[1]);
  this.shape_.setCoordXAt(pos, coord[0]);
  this.shape_.setCoordYAt(pos, coord[1]);
};



/**
 * Creates a new modifiable poly-line shape.
 * @param {xrx.shape.Polygon} polyline The related poly-line shape.
 */
xrx.shape.PolylineModifiable.create = function(polyline) {
  var coords = polyline.getCoords();
  var draggers = [];
  var dragger;
  for(var i = 0, len = coords.length; i < len; i++) {
    dragger = xrx.shape.VertexDragger.create(polyline.getCanvas());
    dragger.setCoords([coords[i]]);
    dragger.setPosition(i);
    draggers.push(dragger);
  }
  return new xrx.shape.PolylineModifiable(polyline, draggers);
};



/**
 * A class representing a creatable poly-line shape.
 * @param {xrx.shape.Polygon} polygon A styled poly-line to be drawn.
 * @constructor
 */
xrx.shape.PolylineCreatable = function(polyline) {

  goog.base(this, polyline, xrx.shape.Polyline.create(polyline.getCanvas()));

  /**
   * The last point created by the user, which closes the poly-line when clicked.
   * @type {xrx.shape.VertexDragger}
   * @private
   */
  this.close_;

  /**
   * Number of points the user has created so far.
   * @type {number}
   * @private
   */
  this.count_ = 0;
};
goog.inherits(xrx.shape.PolylineCreatable, xrx.shape.Creatable);



/**
 * Returns the coordinates of the poly-line created so far.
 * @return Array<Array<number>> The coordinates.
 */
xrx.shape.PolylineCreatable.prototype.getCoords = function() {
  return this.helper_.getCoords();
};



/**
 * Handles click events for a creatable poly-line shape.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.shape.PolylineCreatable.prototype.handleClick = function(e, point, shape) {
  if (this.count_ === 0) { // user creates the first point
    // update the poly-line
    this.helper_.setCoords([point, point]);
    // insert a vertex
    //this.close_ = xrx.shape.VertexDragger.create(this.target_.getCanvas());
    //this.close_.setCoords([point]);
    //this.vertexes_.push(this.close_);
    this.count_ += 1;
    this.eventHandler_.eventShapeCreate([this.helper_]);
  } else if (this.close_ && shape === this.close_ && this.count_ === 1) {
    // Do nothing if the user tries to close the path at the time
    // when there is only one point yet
  } else if (this.close_ && shape === this.close_) { // user closes the poly-line
    // create a poly-line
    var polyline = xrx.shape.Polyline.create(this.target_.getCanvas());
    polyline.setStylable(this.target_);
    polyline.setCoords(this.helper_.getCoordsCopy());
    this.eventHandler_.eventShapeCreated(polyline);
    // reset for next drawing
    this.close_ = null;
    this.count_ = 0;
  } else { // user creates another point
    // extend the poly-line
    this.helper_.appendCoord(point);
    // create or move the closing point
    if (this.count_ === 1) this.close_ = xrx.shape.VertexDragger.create(this.target_.getCanvas());
    this.close_.setCoords([point]);
    this.count_ += 1;
    this.eventHandler_.eventShapeCreate([this.close_]);
  } 
};



xrx.shape.PolylineCreatable.prototype.handleMove = function(e, point, shape) {
  if (this.count_ === 0) {
    return;
  } else {
    this.helper_.setLastCoord(point);
  }
  if (this.close_ && shape === this.close_) {
    this.close_.setStrokeColor('red');
    this.close_.setStrokeWidth(3);
  } else if (this.close_) {
    this.close_.setStrokeColor('black');
    this.close_.setStrokeWidth(1);
  } else {}
};



xrx.shape.PolylineCreatable.create = function(polygon) {
  return new xrx.shape.PolylineCreatable(polygon);
};

