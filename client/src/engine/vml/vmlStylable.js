***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.vml.Stylable');



goog.require('xrx.vml');
goog.require('xrx.vml.Element');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.vml.Stylable = function(raphael) {

  goog.base(this, raphael);

  this.stroke_ = {
    color: 'black',
    width: 1
 ***REMOVED*****REMOVED***

  this.fill_ = {
    color: 'black',
    opacity: 1
 ***REMOVED*****REMOVED***
***REMOVED***
goog.inherits(xrx.vml.Stylable, xrx.vml.Element);



xrx.vml.Stylable.prototype.setStrokeWidth = function(width) {
  this.stroke_.width = width;
  this.raphael_.attr({'stroke-width': width});
***REMOVED***



xrx.vml.Stylable.prototype.setStrokeColor = function(color) {
  this.stroke_.color = color;
  this.raphael_.attr({'stroke': color});
***REMOVED***



xrx.vml.Stylable.prototype.setFillColor = function(color) {
  this.fill_.color = color;
  this.raphael_.attr({'fill': color});
***REMOVED***



xrx.vml.Stylable.prototype.setFillOpacity = function(factor) {
  this.fill_.opacity = factor;
  this.raphael_.attr({'fill-opacity': factor});
***REMOVED***
