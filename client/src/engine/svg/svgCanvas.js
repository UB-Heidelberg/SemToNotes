***REMOVED***
***REMOVED*** @fileoverview SVG rendering class representing a canvas.
***REMOVED***

goog.provide('xrx.svg.Canvas');



***REMOVED***
goog.require('xrx.svg');
goog.require('xrx.svg.Element');



***REMOVED***
***REMOVED*** SVG rendering class representing a canvas.
***REMOVED*** @param {SVGElement} element The SVG element.
***REMOVED***
***REMOVED*** @extends xrx.svg.Element
***REMOVED***
xrx.svg.Canvas = function(element) {

***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The child elements of the canvas.
  ***REMOVED*** @type {xrx.svg.Element}
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
***REMOVED***
goog.inherits(xrx.svg.Canvas, xrx.svg.Element);



xrx.svg.Canvas.prototype.getEventTarget = function() {
  return this.element_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the width of the canvas.
***REMOVED*** @return {number} The width.
***REMOVED***
xrx.svg.Canvas.prototype.getWidth = function() {
  return this.width_;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the width of the canvas.
***REMOVED*** @param {number} width the width.
***REMOVED***
xrx.svg.Canvas.prototype.setWidth = function(width) {
  this.width_ = width;
  this.element_.setAttribute('width', width);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the height of the canvas.
***REMOVED*** @return {number} The height.
***REMOVED***
xrx.svg.Canvas.prototype.getHeight = function() {
  return this.height_;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the height of the canvas.
***REMOVED*** @param {number} width the height.
***REMOVED***
xrx.svg.Canvas.prototype.setHeight = function(height) {
  this.height_ = height;
  this.element_.setAttribute('height', height);
***REMOVED***



***REMOVED***
***REMOVED*** Adds a child element to the canvas.
***REMOVED*** @param {Object} element The child element.
***REMOVED***
xrx.svg.Canvas.prototype.addChild = function(element) {
  goog.dom.append(this.element_, element.getElement());
  element.draw();
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new canvas.
***REMOVED*** @param {Element} parent The parent HTML element to which the canvas
***REMOVED***     shall be appended.
***REMOVED***
xrx.svg.Canvas.create = function(parent) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'svg');
  var canvas = new xrx.svg.Canvas(element);
  goog.dom.appendChild(parent, canvas.getElement());
  return canvas;
***REMOVED***
