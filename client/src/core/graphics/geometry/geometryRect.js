***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.geometry.Rect');



goog.require('xrx.geometry');
goog.require('goog.math.Box');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.geometry.Rect = function() {

  this.x = 0;

  this.y = 0;

  this.width = 0;

  this.height = 0;
***REMOVED***



xrx.geometry.Rect.prototype.getBox = function() {
  return new goog.math.Box(this.y, this.x + this.width, this.y + this.height,
      this.x);
***REMOVED***



xrx.geometry.Rect.prototype.containsPoint = function(point) {
  return point[0] >= this.x && point[1] >= this.y &&
      point[0] <= this.x + this.width && point[1] <= this.y + this.height; 
***REMOVED***
