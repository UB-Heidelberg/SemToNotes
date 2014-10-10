***REMOVED***
***REMOVED*** @fileoverview A class representing a vertex dragging element to
***REMOVED***     modify the vertexes of a shape.
***REMOVED***

goog.provide('xrx.shape.VertexDragger');



goog.require('xrx.shape.Shape');



***REMOVED***
***REMOVED*** A class representing a vertex dragging element to modify the vertexes
***REMOVED*** of a shape.
***REMOVED*** @param {xrx.drawing.Drawing} drawing The parent drawing object.
***REMOVED***
***REMOVED***
xrx.shape.VertexDragger = function(drawing) {

  goog.base(this, drawing);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The nth vertex of a shape.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.pos_;
***REMOVED***
goog.inherits(xrx.shape.VertexDragger, xrx.shape.Shape);



***REMOVED***
***REMOVED*** The engine class used to render this shape.
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED***
xrx.shape.VertexDragger.prototype.engineClass_ = 'Circle';



***REMOVED***
***REMOVED*** Returns the position n of the vertex dragging element in the list
***REMOVED*** dragging elements.
***REMOVED*** @return {number} The position.
***REMOVED***
xrx.shape.VertexDragger.prototype.getPosition = function() {
  return this.pos_;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the position n of the vertex dragging element in the list
***REMOVED*** dragging elements.
***REMOVED*** @param {number} The position.
***REMOVED***
xrx.shape.VertexDragger.prototype.setPosition = function(pos) {
  this.pos_ = pos;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the coordinates of the vertex dragging element.
***REMOVED*** @return {Array.<Array.<number>>} The coordinates.
***REMOVED***
xrx.shape.VertexDragger.prototype.getCoords = function() {
  return [this.engineShape_.getCenter()];
***REMOVED***



***REMOVED***
***REMOVED*** Returns a copy of the shape's coordinate object.
***REMOVED*** @return {Array.<Array.<number>>} A new coordinate object.
***REMOVED***
xrx.shape.VertexDragger.prototype.getCoordsCopy = function() {
  var coords = [this.engineShape_.getCenter()];
  var len = coords.length;
  var newCoords = new Array(len);
  var coord;
  for (var i = 0; i < len; i++) {
    newCoords[i] = [coords[i][0], coords[i][1]];
  }
  return newCoords;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the shape's coordinates.
***REMOVED*** @param {Array.<Array.<number>>} The new coordinates.
***REMOVED***
xrx.shape.VertexDragger.prototype.setCoords = function(coords) {
  this.engineShape_.setCenter(coords[0][0], coords[0][1]);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the radius of the dragging element shape.
***REMOVED*** @return {number} The radius.
***REMOVED***
xrx.shape.VertexDragger.prototype.getRadius = function() {
  return this.engineShape_.getRadius();
***REMOVED***



***REMOVED***
***REMOVED*** Sets the radius of the dragging element shape.
***REMOVED*** @param {number} The radius.
***REMOVED***
xrx.shape.VertexDragger.prototype.setRadius = function(radius) {
  this.engineShape_.setRadius(radius);
***REMOVED***




***REMOVED***
***REMOVED*** Creates a new vertex dragging shape.
***REMOVED*** @param {xrx.drawing.Drawing} drawing The parent drawing object.
***REMOVED***
xrx.shape.VertexDragger.create = function(drawing) {
  var dragger = new xrx.shape.VertexDragger(drawing);
  dragger.setRadius(3);
  dragger.setStrokeColor('black');
  dragger.setStrokeWidth(1);
  dragger.setFillColor('white');
  dragger.setFillOpacity(1.0);
  return dragger;
***REMOVED***



goog.exportProperty(xrx.shape, 'VertexDragger', xrx.shape.VertexDragger);
