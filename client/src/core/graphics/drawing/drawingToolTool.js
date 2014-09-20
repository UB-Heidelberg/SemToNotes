***REMOVED***
***REMOVED*** @fileoverview A class implementing a magnifier tool for a drawing canvas.
***REMOVED***

goog.provide('xrx.drawing.tool.Tool');



xrx.drawing.tool.Tool = function(drawing, element, canvas) {

  this.drawing_ = drawing;

  this.isActive_ = false;

  this.element_ = element;

  this.canvas_ = canvas;
***REMOVED***



xrx.drawing.tool.Tool.prototype.isActive = function() {
  return this.isActive_;
***REMOVED***



xrx.drawing.tool.Tool.prototype.getCanvas = function() {
  return this.canvas_;
***REMOVED***
