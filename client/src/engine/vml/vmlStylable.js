***REMOVED***
***REMOVED*** @fileoverview VML class representing a stylable element.
***REMOVED***

goog.provide('xrx.vml.Stylable');



goog.require('xrx.vml.Element');



***REMOVED***
***REMOVED*** VML class representing a stylable element.
***REMOVED*** @param {Object} raphael A Raphael object.
***REMOVED*** @param {xrx.geometry.Geometry} geometry A geometry object.
***REMOVED***
***REMOVED*** @extends {xrx.vml.Element}
***REMOVED***
xrx.vml.Stylable = function(raphael, geometry) {

  goog.base(this, raphael);

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
goog.inherits(xrx.vml.Stylable, xrx.vml.Element);



***REMOVED***
***REMOVED*** Sets the stroke width of the stylable element.
***REMOVED*** @param {number} width The stroke width.
***REMOVED***
xrx.vml.Stylable.prototype.setStrokeWidth = function(width) {
  this.stroke_.width = width;
  this.raphael_.attr({'stroke-width': width});
***REMOVED***



***REMOVED***
***REMOVED*** Sets the stroke color of the stylable element.
***REMOVED*** @param {string} color The stroke color.
***REMOVED***
xrx.vml.Stylable.prototype.setStrokeColor = function(color) {
  this.stroke_.color = color;
  this.raphael_.attr({'stroke': color});
***REMOVED***



***REMOVED***
***REMOVED*** Sets the fill color of the stylable element.
***REMOVED*** @param {string} color The fill color.
***REMOVED***
xrx.vml.Stylable.prototype.setFillColor = function(color) {
  this.fill_.color = color;
  this.raphael_.attr({'fill': color});
***REMOVED***



***REMOVED***
***REMOVED*** Sets the fill opacity of the stylable element.
***REMOVED*** @param {string} factor The fill opacity.
***REMOVED***
xrx.vml.Stylable.prototype.setFillOpacity = function(factor) {
  this.fill_.opacity = factor;
  this.raphael_.attr({'fill-opacity': factor});
***REMOVED***
