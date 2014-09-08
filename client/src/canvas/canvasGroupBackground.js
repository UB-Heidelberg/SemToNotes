***REMOVED***
***REMOVED*** @fileoverview A class representing the background group of a canvas.
***REMOVED***

goog.provide('xrx.canvas.GroupBackground');



***REMOVED***
goog.require('goog.math.AffineTransform');
goog.require('goog.math');
goog.require('xrx.canvas.Group');
goog.require('xrx.canvas.Mode');
goog.require('xrx.canvas.Shield');
goog.require('xrx.canvas.State');
goog.require('xrx.canvas.GroupHandler');



***REMOVED***
***REMOVED*** A class representing the background group of a canvas. The 
***REMOVED*** background group can hold an image for image annotation.
***REMOVED*** @param {xrx.canvas.Canvas} canvas A canvas object.
***REMOVED***
***REMOVED*** @extends xrx.canvas.Group
***REMOVED***
xrx.canvas.GroupBackground = function(canvas) {

  goog.base(this, canvas);
***REMOVED***
goog.inherits(xrx.canvas.GroupBackground, xrx.canvas.Group);



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.GroupBackground.prototype.create_ = function() {
  var graphics = this.getCanvas().getGraphics();
  var image = this.getCanvas().getImage();
  this.element_ = graphics.Group.create();

  // install a black rectangle for panning
  var rect = graphics.Element.createNS('rect');
  graphics.Element.setProperties(rect, {
    'width': '100%',
    'height': '100%'
  });
  goog.dom.append(this.element_, rect);

  console.log();

  // install the background image
  var image2 = this.getCanvas().image_.element = graphics.Image.create({
    'xlink:href': image.getAttribute('src'),
    'width': image.naturalWidth,
    'height': image.naturalHeight
  });
  goog.dom.append(this.element_, image2);

  // install a shield
  this.shield_ = new xrx.canvas.Shield(this.getCanvas());
  goog.dom.append(this.element_, this.shield_.getElement());
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.GroupBackground.prototype.registerEvents_ = function() {
  this.registerMouseZoom(this.element_, xrx.canvas.GroupHandler);
  this.registerMouseDrag(this.element_, xrx.canvas.GroupHandler);
  this.registerMouseRotate(this.element_, xrx.canvas.GroupHandler);
***REMOVED***
