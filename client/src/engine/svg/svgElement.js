***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.svg.Element');



goog.require('goog.array');
goog.require('goog.math.AffineTransform');
goog.require('goog.style');
goog.require('xrx.drawing.State');
goog.require('xrx.svg');
goog.require('xrx.svg.Namespace');



xrx.svg.Element = function(element) {

  this.element_ = element;

  this.transform_ = new goog.math.AffineTransform();
***REMOVED***



xrx.svg.Element.prototype.getGraphic = function() {
  return this.graphic_;
***REMOVED***



xrx.svg.Element.prototype.getElement = function() {
  return this.element_;
***REMOVED***



xrx.svg.Element.prototype.setWidth = function(width) {
  this.width_ = width;
  this.element_.setAttribute('width', width);
***REMOVED***



xrx.svg.Element.prototype.setHeight = function(height) {
  this.height_ = height;
  this.element_.setAttribute('height', height);
***REMOVED***



xrx.svg.Element.hasClass = function(element, className) {
  var classes;
  var string = element.getAttribute('class');
  if (string) classes = string.split(/\s+/);
  return !classes ? false : goog.array.contains(classes, className);
***REMOVED***



xrx.svg.Element.setProperties = function(element, properties) {

  for(var key in properties) {
    var val = properties[key];
    var colonIndex = key.indexOf(':');

    if (colonIndex === -1) {
      element.setAttribute(key, val);
    } else {
      var prefix = key.substring(0, colonIndex);
      element.setAttributeNS(xrx.svg.Namespace[prefix], key, val);
    }
 ***REMOVED*****REMOVED***  
***REMOVED***



xrx.svg.Element.create = function(elementClass) {
  return document.createElementNS(xrx.svg.Namespace['svg'],
      elementClass.tagName);
***REMOVED***
