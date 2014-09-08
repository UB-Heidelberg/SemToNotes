***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.graphic.Circle');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.graphic.Circle = function() {

  this.cx = 0;

  this.cy = 0;

  this.r = 0;
***REMOVED***



xrx.graphic.Circle.prototype.containsPoint = function(point) {
  return ((this.cx - point[0])***REMOVED*** (this.cx - point[0]) + (this.cy - point[1])***REMOVED***
      (this.cy - point[1]) <= this.r***REMOVED*** this.r) 
***REMOVED***
