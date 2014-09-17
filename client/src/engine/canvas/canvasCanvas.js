***REMOVED***
***REMOVED*** @fileoverview Canvas rendering class representing a canvas.
***REMOVED***

goog.provide('xrx.canvas.Canvas');



***REMOVED***



***REMOVED***
***REMOVED*** Canvas rendering class representing a canvas.
***REMOVED*** @param {HTMLCanvasElement} element The HTML canvas element.
***REMOVED***
***REMOVED***
xrx.canvas.Canvas = function(element) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** The rendering context.
  ***REMOVED*** @type {CanvasRenderingContext2D}
 ***REMOVED*****REMOVED***
  this.context_ = element.getContext('2d');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The HTML canvas element.
  ***REMOVED*** @type {HTMLCanvasElement}
 ***REMOVED*****REMOVED***
  this.element_ = element;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The child elements of the canvas.
  ***REMOVED*** @type {xrx.canvas.Element}
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



***REMOVED***
***REMOVED*** Returns the HTML canvas element.
***REMOVED*** @return {HTMLCanvasElement} The HTML canvas element.
***REMOVED***
xrx.canvas.Canvas.prototype.getElement = function() {
  return this.element_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the width of the canvas.
***REMOVED*** @return {number} The width.
***REMOVED***
xrx.canvas.Canvas.prototype.getWidth = function() {
  return this.width_;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the width of the canvas.
***REMOVED*** @param {number} width the width.
***REMOVED***
xrx.canvas.Canvas.prototype.setWidth = function(width) {
  this.width_ = width;
  this.element_.setAttribute('width', width);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the height of the canvas.
***REMOVED*** @return {number} The height.
***REMOVED***
xrx.canvas.Canvas.prototype.getHeight = function() {
  return this.height_;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the height of the canvas.
***REMOVED*** @param {number} width the height.
***REMOVED***
xrx.canvas.Canvas.prototype.setHeight = function(height) {
  this.height_ = height;
  this.element_.setAttribute('height', height);
***REMOVED***



***REMOVED***
***REMOVED*** Adds a child element to the canvas.
***REMOVED*** @param {Object} element The child element.
***REMOVED***
xrx.canvas.Canvas.prototype.addChild = function(element) {
  this.childs_.push(element);
  element.draw();
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new canvas.
***REMOVED*** @param {Element} parent The parent HTML element to which the canvas
***REMOVED***     shall be appended.
***REMOVED***
xrx.canvas.Canvas.create = function(parent) {
  var element = goog.dom.createElement('canvas');
  var canvas = new xrx.canvas.Canvas(element);
  goog.dom.appendChild(parent, canvas.getElement());
  return canvas;
***REMOVED***
