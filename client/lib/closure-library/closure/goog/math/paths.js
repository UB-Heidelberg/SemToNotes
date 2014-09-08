// Copyright 2010 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


***REMOVED***
***REMOVED*** @fileoverview Factories for common path types.
***REMOVED*** @author nicksantos@google.com (Nick Santos)
***REMOVED***


goog.provide('goog.math.paths');

goog.require('goog.math.Coordinate');
goog.require('goog.math.Path');


***REMOVED***
***REMOVED*** Defines a regular n-gon by specifing the center, a vertex, and the total
***REMOVED*** number of vertices.
***REMOVED*** @param {goog.math.Coordinate} center The center point.
***REMOVED*** @param {goog.math.Coordinate} vertex The vertex, which implicitly defines
***REMOVED***     a radius as well.
***REMOVED*** @param {number} n The number of vertices.
***REMOVED*** @return {!goog.math.Path} The path.
***REMOVED***
goog.math.paths.createRegularNGon = function(center, vertex, n) {
  var path = new goog.math.Path();
  path.moveTo(vertex.x, vertex.y);

  var startAngle = Math.atan2(vertex.y - center.y, vertex.x - center.x);
  var radius = goog.math.Coordinate.distance(center, vertex);
  for (var i = 1; i < n; i++) {
    var angle = startAngle + 2***REMOVED*** Math.PI***REMOVED*** (i / n);
    path.lineTo(center.x + radius***REMOVED*** Math.cos(angle),
                center.y + radius***REMOVED*** Math.sin(angle));
  }
  path.close();
  return path;
***REMOVED***


***REMOVED***
***REMOVED*** Defines an arrow.
***REMOVED*** @param {goog.math.Coordinate} a Point A.
***REMOVED*** @param {goog.math.Coordinate} b Point B.
***REMOVED*** @param {?number} aHead The size of the arrow head at point A.
***REMOVED***     0 omits the head.
***REMOVED*** @param {?number} bHead The size of the arrow head at point B.
***REMOVED***     0 omits the head.
***REMOVED*** @return {!goog.math.Path} The path.
***REMOVED***
goog.math.paths.createArrow = function(a, b, aHead, bHead) {
  var path = new goog.math.Path();
  path.moveTo(a.x, a.y);
  path.lineTo(b.x, b.y);

  var angle = Math.atan2(b.y - a.y, b.x - a.x);
  if (aHead) {
    path.appendPath(
        goog.math.paths.createRegularNGon(
            new goog.math.Coordinate(
                a.x + aHead***REMOVED*** Math.cos(angle),
                a.y + aHead***REMOVED*** Math.sin(angle)),
            a, 3));
  }
  if (bHead) {
    path.appendPath(
        goog.math.paths.createRegularNGon(
            new goog.math.Coordinate(
                b.x + bHead***REMOVED*** Math.cos(angle + Math.PI),
                b.y + bHead***REMOVED*** Math.sin(angle + Math.PI)),
            b, 3));
  }
  return path;
***REMOVED***
