***REMOVED***
***REMOVED*** @fileoverview Super-class representing a shape.
***REMOVED***

goog.provide('xrx.shape.Shape');



***REMOVED***
***REMOVED*** Super-class representing a shape.
***REMOVED*** @param {xrx.drawing.Drawing} drawing The parent drawing object.
***REMOVED***
***REMOVED***
xrx.shape.Shape = function(drawing) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** The parent drawing object.
  ***REMOVED*** @type {xrx.drawing.Drawing}
 ***REMOVED*****REMOVED***
  this.drawing_ = drawing;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Pointer to the underlying engine rendering shape.
  ***REMOVED*** @type {Object}
 ***REMOVED*****REMOVED***
  this.engineShape_;

  this.create_();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the parent drawing object.
***REMOVED*** @return {xrx.drawing.Drawing} The parent drawing object.
***REMOVED***
xrx.shape.Shape.prototype.getDrawing = function() {
  return this.drawing_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the underlying engine rendering shape.
***REMOVED*** @return {Object} The rendering shape.
***REMOVED***
xrx.shape.Shape.prototype.getEngineShape = function() {
  return this.engineShape_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the coordinates of the shape.
***REMOVED*** @return {Array.<Array.<number>>} The coordinates.
***REMOVED***
xrx.shape.Shape.prototype.getCoords = function() {
  return this.engineShape_.getCoords();
***REMOVED***



***REMOVED***
***REMOVED*** Returns a copy of the shape's coordinate object.
***REMOVED*** @return {Array.<Array.<number>>} A new coordinate object.
***REMOVED***
xrx.shape.Shape.prototype.getCoordsCopy = function() {
  var coords = this.engineShape_.getCoords();
  var len = coords.length;
  var newCoords = new Array(len);
  var coord;
  for (var i = 0; i < len; i++) {
    newCoords[i] = new Array(2);
    newCoords[i][0] = coords[i][0];
    newCoords[i][1] = coords[i][1];
  }
  return newCoords;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the shape's coordinates.
***REMOVED*** @param {Array.<Array.<number>>} The new coordinates.
***REMOVED***
xrx.shape.Shape.prototype.setCoords = function(coords) {
  this.engineShape_.setCoords(coords);
***REMOVED***



***REMOVED***
***REMOVED*** Changes one point of the coordinates at a position.
***REMOVED*** @param {number} pos The position.
***REMOVED*** @param {Array.<number>} The new point.
***REMOVED***
xrx.shape.Shape.prototype.setCoordAt = function(pos, coord) {
  this.engineShape_.setCoordAt(pos, coord);
***REMOVED***



***REMOVED***
***REMOVED*** Sets the fill-color of the shape.
***REMOVED*** @param {string} color The color.
***REMOVED***
xrx.shape.Shape.prototype.setFillColor = function(color) {
  this.engineShape_.setFillColor(color);
***REMOVED***



***REMOVED***
***REMOVED*** Sets the fill-opacity of the shape.
***REMOVED*** @param {number} factor The opacity factor.
***REMOVED***
xrx.shape.Shape.prototype.setFillOpacity = function(factor) {
  this.engineShape_.setFillOpacity(factor);
***REMOVED***



***REMOVED***
***REMOVED*** Sets the stroke-width of the shape.
***REMOVED*** @param {number} width The new width.
***REMOVED***
xrx.shape.Shape.prototype.setStrokeWidth = function(width) {
  this.engineShape_.setStrokeWidth(width);
***REMOVED***



***REMOVED***
***REMOVED*** Sets the stroke-color of the shape.
***REMOVED*** @param {string} color The new color.
***REMOVED***
xrx.shape.Shape.prototype.setStrokeColor = function(color) {
  this.engineShape_.setStrokeColor(color);
***REMOVED***



***REMOVED***
***REMOVED*** Returns an array of vertex dragging elements according to the number of 
***REMOVED*** vertexes of the shape.
***REMOVED*** @return {xrx.shape.VertexDragger} The vertex draggin elements.
***REMOVED***
xrx.shape.Shape.prototype.getVertexDraggers = function() {
  var coords = this.getCoords();
  var draggers = [];
  var dragger;

  for(var i = 0, len = coords.length; i < len; i++) {
    dragger = xrx.shape.VertexDragger.create(this.drawing_);
    dragger.setCoords([coords[i]]);
    draggers.push(dragger);
  }

  return draggers;
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.shape.Shape.prototype.create_ = function() {
  var primitiveShape = this.drawing_.getGraphics()[this.engineClass_];
  this.engineShape_ = primitiveShape.create(this.drawing_.getCanvas());
  this.engineShape_.setStrokeColor('#47D1FF');
  this.engineShape_.setStrokeWidth(1.);
  this.engineShape_.setFillOpacity(0.);
***REMOVED***
