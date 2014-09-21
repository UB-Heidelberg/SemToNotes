***REMOVED***
***REMOVED*** @fileoverview A class representing the background layer of a drawing canvas.
***REMOVED***

goog.provide('xrx.drawing.LayerBackground');



goog.require('xrx.drawing.Layer');



***REMOVED***
***REMOVED*** A class representing the background layer of a drawing canvas. The 
***REMOVED*** background layer can hold an image for image annotation.
***REMOVED*** @param {xrx.drawing.Drawing} canvas A canvas object.
***REMOVED***
***REMOVED*** @extends xrx.drawing.Layer
***REMOVED***
xrx.drawing.LayerBackground = function(drawing) {

  goog.base(this, drawing);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Pointer to the background image object.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.image_;
***REMOVED***
goog.inherits(xrx.drawing.LayerBackground, xrx.drawing.Layer);



***REMOVED***
***REMOVED*** Returns the background image object.
***REMOVED*** @return {Object} The background image object. 
***REMOVED***
xrx.drawing.LayerBackground.prototype.getImage = function(image) {
  return this.image_;
***REMOVED***



***REMOVED***
***REMOVED*** Sets a new background image.
***REMOVED*** @param {Image} image The new image.
***REMOVED***
xrx.drawing.LayerBackground.prototype.setImage = function(image) {
  this.image_.setImage(image);
***REMOVED***



***REMOVED***
***REMOVED*** Draws the layer.
***REMOVED***
xrx.drawing.LayerBackground.prototype.draw = function() {
  this.image_.draw();
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.drawing.LayerBackground.prototype.create_ = function() {
  var graphics = this.getDrawing().getGraphics();
  var canvas = this.getDrawing().getCanvas();

  this.group_ = graphics.Group.create(canvas);

  // install the background image
  this.image_ = graphics.Image.create(undefined, canvas);
  this.group_.addChildren(this.image_);
***REMOVED***
