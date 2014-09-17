***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.geometry.Polygon');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.geometry.Polygon = function() {

  this.coords = [];
***REMOVED***



xrx.geometry.Polygon.prototype.containsPoint = function(point) {
  var x = point[0], y = point[1];
  var coords = this.coords;
  var xi;
  var xj;
  var intersect;

  var inside = false;
  for (var i = 0, j = coords.length - 1; i < coords.length; j = i++) {
    xi = coords[i][0], yi = coords[i][1];
    xj = coords[j][0], yj = coords[j][1];

    intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi)***REMOVED*** (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
***REMOVED***
