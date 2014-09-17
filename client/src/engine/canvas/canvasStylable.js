***REMOVED***
***REMOVED*** @fileoverview Canvas class representing a stylable element.
***REMOVED***

goog.provide('xrx.canvas.Stylable');



goog.require('xrx.canvas.Element');



***REMOVED***
***REMOVED*** Canvas class representing a stylable element.
***REMOVED*** @param {HTMLCanvasElement} canvas The parent canvas element.
***REMOVED*** @param {xrx.geometry.Geometry} geometry A geometry object.
***REMOVED***
***REMOVED*** @extends {xrx.canvas.Element}
***REMOVED***
xrx.canvas.Stylable = function(canvas, geometry) {

  goog.base(this, canvas);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Object describing the geometry of the stylable element.
  ***REMOVED*** @type {xrx.geometry.Geometry}
 ***REMOVED*****REMOVED***
  this.geometry_ = geometry;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Object describing the stroke style.
 ***REMOVED*****REMOVED***
  this.stroke_ = {
    color: 'black',
    width: 1
 ***REMOVED*****REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Object describing the fill style.
 ***REMOVED*****REMOVED***
  this.fill_ = {
    color: 'black',
    opacity: 1
 ***REMOVED*****REMOVED***
***REMOVED***
goog.inherits(xrx.canvas.Stylable, xrx.canvas.Element);



***REMOVED***
***REMOVED*** Sets the stroke width of the stylable element.
***REMOVED*** @param {number} width The stroke width.
***REMOVED***
xrx.canvas.Stylable.prototype.setStrokeWidth = function(width) {
  this.stroke_.width = width;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the stroke color of the stylable element.
***REMOVED*** @param {string} color The stroke color.
***REMOVED***
xrx.canvas.Stylable.prototype.setStrokeColor = function(color) {
  this.stroke_.color = color;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the fill color of the stylable element.
***REMOVED*** @param {string} color The fill color.
***REMOVED***
xrx.canvas.Stylable.prototype.setFillColor = function(color) {
  this.fill_.color = color;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the fill opacity of the stylable element.
***REMOVED*** @param {string} factor The fill opacity.
***REMOVED***
xrx.canvas.Stylable.prototype.setFillOpacity = function(factor) {
  this.fill_.opacity = factor;
***REMOVED***


***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.Stylable.prototype.strokeAndFill_ = function() {
  this.context_.fillStyle = this.fill_.color;
  this.context_.globalAlpha = this.fill_.opacity;
  this.context_.fill();
  this.context_.globalAlpha = 1;
  this.context_.strokeStyle = this.stroke_.color;
  this.context_.lineWidth = this.stroke_.width;
  if (this.stroke_.width > 0) this.context_.stroke();
***REMOVED***
