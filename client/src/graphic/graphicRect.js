***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.graphic.Rect');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.graphic.Rect = function() {

  this.x = 0;

  this.y = 0;

  this.width = 0;

  this.height = 0;
***REMOVED***



xrx.graphic.Rect.prototype.containsPoint = function(point) {
  return point[0] >= this.x && point[1] >= this.y &&
      point[0] <= this.x + this.width && point[1] <= this.y + this.height; 
***REMOVED***
