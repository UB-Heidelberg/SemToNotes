***REMOVED***
***REMOVED*** @fileoverview SVG class representing a stylable element.
***REMOVED***

goog.provide('xrx.svg.Stylable');



goog.require('xrx.svg.Element');



***REMOVED***
***REMOVED*** SVG class representing a stylable element.
***REMOVED*** @param {SVGElement} element A SVG element.
***REMOVED*** @param {xrx.geometry.Geometry} geometry A geometry object.
***REMOVED***
***REMOVED*** @extends {xrx.svg.Element}
***REMOVED***
xrx.svg.Stylable = function(element, geometry) {

***REMOVED***

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
goog.inherits(xrx.svg.Stylable, xrx.svg.Element);



***REMOVED***
***REMOVED*** Returns the geometry object of the stylable element.
***REMOVED*** @return {xrx.geometry.Geometry} The geometry object.
***REMOVED***
xrx.svg.Stylable.prototype.getGeometry = function() {
  return this.geometry_;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the stroke width of the stylable element.
***REMOVED*** @param {number} width The stroke width.
***REMOVED***
xrx.svg.Stylable.prototype.setStrokeWidth = function(width) {
  this.stroke_.width = width;
  this.element_.setAttribute('stroke-width', width);
***REMOVED***



***REMOVED***
***REMOVED*** Sets the stroke color of the stylable element.
***REMOVED*** @param {string} color The stroke color.
***REMOVED***
xrx.svg.Stylable.prototype.setStrokeColor = function(color) {
  this.stroke_.color = color;
  this.element_.setAttribute('stroke', color);
  this.element_.setAttribute('stroke-color', color);
***REMOVED***



***REMOVED***
***REMOVED*** Sets the fill color of the stylable element.
***REMOVED*** @param {string} color The fill color.
***REMOVED***
xrx.svg.Stylable.prototype.setFillColor = function(color) {
  this.fill_.color = color;
  this.element_.setAttribute('fill', color);
***REMOVED***



***REMOVED***
***REMOVED*** Sets the fill opacity of the stylable element.
***REMOVED*** @param {string} factor The fill opacity.
***REMOVED***
xrx.svg.Stylable.prototype.setFillOpacity = function(factor) {
  this.fill_.opacity = factor;
  this.element_.setAttribute('fill-opacity', factor);
***REMOVED***
