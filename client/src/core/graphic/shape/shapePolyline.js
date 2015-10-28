/**
 * @fileoverview Classes representing a modifiable and creatable
 *     engine-independent poly-line shape.
 */

goog.provide('xrx.shape.Polyline');
goog.provide('xrx.shape.PolylineCreatable');
goog.provide('xrx.shape.PolylineHoverable');
goog.provide('xrx.shape.PolylineModifiable');
goog.provide('xrx.shape.PolylineSelectable');



goog.require('goog.array');
goog.require('xrx.geometry.Polyline');
goog.require('xrx.shape.PathLike');
goog.require('xrx.shape.Hoverable');
goog.require('xrx.shape.Modifiable');
goog.require('xrx.shape.PathLike');
goog.require('xrx.shape.Selectable');



/**
 * Classes representing an engine-independent poly-line shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing canvas.
 * @constructor
 */
xrx.shape.Polyline = function(drawing) {

  goog.base(this, drawing, new xrx.geometry.Polyline());

  this.engineElement_ = this.drawing_.getEngine().createPolyline();
};
goog.inherits(xrx.shape.Polyline, xrx.shape.PathLike);



/**
 * Draws this poly-line shape.
 */
xrx.shape.Polyline.prototype.draw = function() {
  this.startDrawing_();
  this.engineElement_.draw(this.getCoords(), this.getFillColor(),
      this.getFillOpacity(), this.getStrokeColor(),
      this.getRenderingStrokeWidth());
  this.finishDrawing_();
};



xrx.shape.Polyline.prototype.getHoverable = function() {
  if (!this.hoverable_) this.hoverable_ = xrx.shape.PolylineHoverable.create(this);
  return this.hoverable_;
};



xrx.shape.Polyline.prototype.setHoverable = function(hoverable) {
  if (!hoverable instanceof xrx.shape.PolylineHoverable)
      throw Error('Instance of xrx.shape.PolylineHoverable expected.');
  this.hoverable_ = hoverable;
};



xrx.shape.Polyline.prototype.getSelectable = function() {
  if (!this.selectable_) this.selectable_ = xrx.shape.PolylineSelectable.create(this);
  return this.selectable_;
};



xrx.shape.Polyline.prototype.setSelectable = function(selectable) {
  if (!selectable instanceof xrx.shape.PolylineSelectable)
      throw Error('Instance of xrx.shape.PolylineSelectable expected.');
  this.selectable_ = selectable;
};



/**
 * Returns a modifiable poly-line shape. Create it lazily if not existent.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @return {xrx.shape.LineModifiable} The modifiable poly-line shape.
 */
xrx.shape.Polyline.prototype.getModifiable = function(drawing) {
  if (!this.modifiable_) this.modifiable_ = xrx.shape.PolylineModifiable.create(this);
  return this.modifiable_;
};



xrx.shape.Polyline.prototype.setModifiable = function(modifiable) {
  if (!modifiable instanceof xrx.shape.PolylineModifiable)
      throw Error('Instance of xrx.shape.PolylineModifiable expected.');
  this.modifiable_ = modifiable;
};



/**
 * Returns a creatable poly-line shape. Create it lazily if not existent.
 * @return {xrx.shape.EllipseCreatable} The creatable poly-line shape.
 */
xrx.shape.Polyline.prototype.getCreatable = function() {
  if (!this.creatable_) this.creatable_ = xrx.shape.PolylineCreatable.create(this);
  return this.creatable_;
};



xrx.shape.Polyline.prototype.setCreatable = function(creatable) {
  if (!creatable instanceof xrx.shape.PolylineCreatable)
      throw Error('Instance of xrx.shape.PolylineCreatable expected.');
  this.creatable_ = creatable;
};



/**
 * @constructor
 */
xrx.shape.PolylineHoverable = function(polyline) {

  goog.base(this, polyline);
};
goog.inherits(xrx.shape.PolylineHoverable, xrx.shape.Hoverable);



xrx.shape.PolylineHoverable.create = function(polyline) {
  return new xrx.shape.PolylineHoverable(polyline);
};




/**
 * @constructor
 */
xrx.shape.PolylineSelectable = function(polyline) {

  goog.base(this, polyline);
};
goog.inherits(xrx.shape.PolylineSelectable, xrx.shape.Selectable);



xrx.shape.PolylineSelectable.create = function(polyline) {
  return new xrx.shape.PolylineSelectable(polyline);
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
  var modifiable = new xrx.shape.PolylineModifiable(polyline);
  var draggers = [];
  var dragger;
  for(var i = 0, len = coords.length; i < len; i++) {
    dragger = xrx.shape.Dragger.create(modifiable, i);
    dragger.setCoords([coords[i]]);
    draggers.push(dragger);
  }
  modifiable.setDragger(draggers);
  return modifiable;
};



xrx.shape.PolylineModifiable.prototype.move = function(distX, distY) {
  var coords = this.shape_.getCoordsCopy();
  for (var i = 0, len = coords.length; i < len; i++) {
    coords[i][0] += distX;
    coords[i][1] += distY;
  }
  this.setCoords(coords);
};



/**
 * A class representing a creatable poly-line shape.
 * @param {xrx.shape.Polygon} polygon A styled poly-line to be drawn.
 * @constructor
 */
xrx.shape.PolylineCreatable = function(polyline) {

  goog.base(this, polyline, xrx.shape.Polyline.create(polyline.getDrawing()));

  /**
   * The last point created by the user, which closes the poly-line when clicked.
   * @type {xrx.shape.Dragger}
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
  return this.preview_.getCoords();
};



/**
 * Handles click events for a creatable poly-line shape.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.shape.PolylineCreatable.prototype.handleDown = function(e, cursor) {
  var shape = cursor.getShape();
  var point = cursor.getPointTransformed();
  if (this.count_ === 0) { // user creates the first point
    // update the poly-line preview
    this.preview_.setCoords([point, goog.array.clone(point)]);
    this.count_ += 1;
    this.target_.getDrawing().eventShapeCreate([this.preview_]);
  } else if (this.close_ && shape === this.close_ && this.count_ === 1) {
    // Do nothing if the user tries to close the path at the time
    // when there is only one point yet
  } else if (this.close_ && shape === this.close_) { // user closes the poly-line
    // create a poly-line
    var polyline = xrx.shape.Polyline.create(this.target_.getDrawing());
    polyline.setStyle(this.target_);
    polyline.setCoords(this.preview_.getCoordsCopy().splice(0, this.count_));
    this.target_.getDrawing().eventShapeCreated(polyline);
    // reset for next drawing
    this.close_ = null;
    this.count_ = 0;
  } else { // user creates another point
    // extend the poly-line
    this.preview_.appendCoord(point);
    // create the closing point as soon as the user creates the second point
    if (this.count_ === 1) {
      this.close_ = xrx.shape.Dragger.create(this.target_.getModifiable(), 0);
      this.target_.getDrawing().eventShapeCreate([this.close_]);
    }
    this.close_.setCoords([point]);
    this.count_ += 1;
  } 
};



xrx.shape.PolylineCreatable.prototype.handleMove = function(e, cursor) {
  var shape = cursor.getShape();
  var point = cursor.getPointTransformed();
  if (this.count_ === 0) {
    return;
  } else {
    this.preview_.setLastCoord(point);
  }
  if (this.close_ && shape === this.close_) {
    this.close_.setStrokeColor('red');
    this.close_.setStrokeWidth(3);
  } else if (this.close_) {
    this.close_.setStrokeColor('black');
    this.close_.setStrokeWidth(1);
  } else {}
};



xrx.shape.PolylineCreatable.prototype.handleUp = function(e, cursor) {
};



xrx.shape.PolylineCreatable.create = function(polygon) {
  return new xrx.shape.PolylineCreatable(polygon);
};

