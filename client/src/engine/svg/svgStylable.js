***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.svg.Stylable');



goog.require('xrx.svg.Element');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.svg.Stylable = function(element) {

***REMOVED***

  this.stroke_ = {
    color: 'black',
    width: 1
 ***REMOVED*****REMOVED***

  this.fill_ = {
    color: 'black',
    opacity: 1
 ***REMOVED*****REMOVED***
***REMOVED***
goog.inherits(xrx.svg.Stylable, xrx.svg.Element);



xrx.svg.Stylable.prototype.setStrokeWidth = function(width) {
  this.stroke_.width = width;
  this.element_.setAttribute('stroke-width', width);
***REMOVED***



xrx.svg.Stylable.prototype.setStrokeColor = function(color) {
  this.stroke_.color = color;
  this.element_.setAttribute('stroke', color);
  this.element_.setAttribute('stroke-color', color);
***REMOVED***



xrx.svg.Stylable.prototype.setFillColor = function(color) {
  this.fill_.color = color;
  this.element_.setAttribute('fill', color);
***REMOVED***



xrx.svg.Stylable.prototype.setFillOpacity = function(factor) {
  this.fill_.opacity = factor;
  this.element_.setAttribute('fill-opacity', factor);
***REMOVED***
