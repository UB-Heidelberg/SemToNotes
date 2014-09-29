***REMOVED***
***REMOVED*** @fileoverview VML rendering class representing a canvas.
***REMOVED***

goog.provide('xrx.vml.Canvas');



***REMOVED***
goog.require('goog.style');
goog.require('xrx.vml.Raphael');
goog.require('xrx.vml.Element');



***REMOVED***
***REMOVED*** VML rendering class representing a canvas.
***REMOVED*** @param {Raphael} raphael The Raphael object.
***REMOVED***
***REMOVED*** @extends xrx.vml.Element
***REMOVED***
xrx.vml.Canvas = function(raphael) {

  goog.base(this, raphael);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The child elements of the canvas.
  ***REMOVED*** @type {xrx.vml.Element}
 ***REMOVED*****REMOVED***
  this.childs_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The canvas width.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.width_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The canvas height.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.height_ = 0;

  this.shield_;
***REMOVED***
goog.inherits(xrx.vml.Canvas, xrx.vml.Element);



xrx.vml.Canvas.prototype.getEventTarget = function() {
  return this.raphael_.canvas;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the width of the canvas.
***REMOVED*** @return {number} The width.
***REMOVED***
xrx.vml.Canvas.prototype.getWidth = function() {
  return this.width_;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the width of the canvas.
***REMOVED*** @param {number} width the width.
***REMOVED***
xrx.vml.Canvas.prototype.setWidth = function(width) {
  this.width_ = width;
  this.raphael_.setSize(this.width_, this.height_);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the height of the canvas.
***REMOVED*** @return {number} The height.
***REMOVED***
xrx.vml.Canvas.prototype.getHeight = function() {
  return this.height_;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the height of the canvas.
***REMOVED*** @param {number} width the height.
***REMOVED***
xrx.vml.Canvas.prototype.setHeight = function(height) {
  this.height_ = height;
  this.raphael_.setSize(this.width_, this.height_);
***REMOVED***



***REMOVED***
***REMOVED*** Adds a child element to the canvas.
***REMOVED*** @param {Object} element The child element.
***REMOVED***
xrx.vml.Canvas.prototype.addChild = function(element) {
  goog.dom.append(this.getElement(), element.getElement());
  element.draw();
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new canvas.
***REMOVED*** @param {Element} parent The parent HTML element to which the canvas
***REMOVED***     shall be appended.
***REMOVED***
xrx.vml.Canvas.create = function(parent) {
  var element = goog.dom.createElement('div');
  var raphael = xrx.vml.Raphael(element, 0, 0);
  var canvas = new xrx.vml.Canvas(raphael);
  goog.style.setStyle(canvas.getElement(), 'z-index', '25');
  goog.dom.appendChild(parent, canvas.getElement());
  return canvas;
***REMOVED***
