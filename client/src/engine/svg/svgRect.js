***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.svg.Rect');



goog.require('xrx.graphic.Rect');
goog.require('xrx.svg.Element');
goog.require('xrx.svg.Stylable');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.svg.Rect = function(element) {

***REMOVED***

  this.graphic_ = new xrx.graphic.Rect()
***REMOVED***
goog.inherits(xrx.svg.Rect, xrx.svg.Stylable);



xrx.svg.Rect.tagName = 'rect';



xrx.svg.Rect.prototype.setX = function(x) {
  this.graphic_.x = x;
  this.element_.setAttribute('x', x);
***REMOVED***



xrx.svg.Rect.prototype.setY = function(y) {
  this.graphic_.y = y;
  this.element_.setAttribute('y', y);
***REMOVED***



xrx.svg.Rect.prototype.setWidth = function(width) {
  this.graphic_.width = width;
  this.element_.setAttribute('width', width);
***REMOVED***



xrx.svg.Rect.prototype.setHeight = function(height) {
  this.graphic_.height = height;
  this.element_.setAttribute('height', height);
***REMOVED***



xrx.svg.Rect.prototype.draw = function() {***REMOVED***



xrx.svg.Rect.create = function() {
  var element = xrx.svg.Element.create(xrx.svg.Rect);
  return new xrx.svg.Rect(element);
***REMOVED***
