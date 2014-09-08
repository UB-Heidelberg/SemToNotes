***REMOVED***
***REMOVED*** @fileoverview A class representing a canvas shield.
***REMOVED***

goog.provide('xrx.canvas.Shield');



goog.require('xrx.graphics.Graphics');



***REMOVED***
***REMOVED*** A class representing a canvas shield. A canvas shield keeps
***REMOVED*** the different canvas groups separated, useful for sane mouse
***REMOVED*** event handling.
***REMOVED*** @see xrx.canvas.GroupBackground
***REMOVED*** @see xrx.canvas.GroupShape
***REMOVED*** @see xrx.canvas.GroupShapeModify
***REMOVED*** @see xrx.canvas.GroupShapeCreate
***REMOVED***
***REMOVED***
xrx.canvas.Shield = function(canvas) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** The DOM element acting as a shield.
  ***REMOVED*** @type {DOMElement}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.element_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The canvas.
  ***REMOVED*** @type {xrx.canvas.Canvas}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.canvas_ = canvas;

  this.create_();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the DOM element of the shield.
***REMOVED*** @return {DOMElement} The DOM element.
***REMOVED***
xrx.canvas.Shield.prototype.getElement = function() {
  return this.element_;
***REMOVED***



***REMOVED***
***REMOVED*** Activates a shield. All other shields of the canvas are
***REMOVED*** deactivated beforehand.
***REMOVED***
xrx.canvas.Shield.prototype.activate = function() {
  this.canvas_.shieldsDeactivate();
  this.element_.setAttribute('width', '100%');
  this.element_.setAttribute('height', '100%');
***REMOVED***



***REMOVED***
***REMOVED*** Deactivates a shield.
***REMOVED***
xrx.canvas.Shield.prototype.deactivate = function() {
  this.element_.setAttribute('width', '0px');
  this.element_.setAttribute('height', '0px');
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.Shield.prototype.create_ = function() {
  var graphics = this.canvas_.getGraphics();
  var shield = graphics.Element.createNS('rect');
  graphics.Element.setProperties(shield, {
    'width': '0px',
    'height': '0px',
    'style': 'fill-opacity:0.0',
    'class': 'xrx-canvas-shield'
  });
  this.element_ = shield;
***REMOVED***

