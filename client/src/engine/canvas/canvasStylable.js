***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.canvas.Stylable');



goog.require('xrx.canvas.Element');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.canvas.Stylable = function(canvas) {

  goog.base(this, undefined, canvas);

  this.stroke_ = {
    color: 'black',
    width: 1
 ***REMOVED*****REMOVED***

  this.fill_ = {
    color: 'black',
    opacity: 1
 ***REMOVED*****REMOVED***
***REMOVED***
goog.inherits(xrx.canvas.Stylable, xrx.canvas.Element);



xrx.canvas.Stylable.prototype.setStrokeWidth = function(width) {
  this.stroke_.width = width;
***REMOVED***



xrx.canvas.Stylable.prototype.setStrokeColor = function(color) {
  this.stroke_.color = color;
***REMOVED***



xrx.canvas.Stylable.prototype.setFillColor = function(color) {
  this.fill_.color = color;
***REMOVED***



xrx.canvas.Stylable.prototype.setFillOpacity = function(factor) {
  this.fill_.opacity = factor;
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
