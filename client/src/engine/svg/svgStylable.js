/**
 * @fileoverview
 */

goog.provide('xrx.svg.Stylable');



goog.require('xrx.svg.Element');



xrx.svg.Stylable = function(element) {

  goog.base(this, element);

  this.stroke_ = {
    color: 'black',
    width: 1
  };

  this.fill_ = {
    color: 'black',
    opacity: 1
  };
};
goog.inherits(xrx.svg.Stylable, xrx.svg.Element);



xrx.svg.Stylable.prototype.setStrokeWidth = function(width) {
  this.stroke_.width = width;
  this.element_.setAttribute('stroke-width', width);
};



xrx.svg.Stylable.prototype.setStrokeColor = function(color) {
  this.stroke_.color = color;
  this.element_.setAttribute('stroke', color);
  this.element_.setAttribute('stroke-color', color);
};



xrx.svg.Stylable.prototype.setFillColor = function(color) {
  this.fill_.color = color;
  this.element_.setAttribute('fill', color);
};



xrx.svg.Stylable.prototype.setFillOpacity = function(factor) {
  this.fill_.opacity = factor;
  this.element_.setAttribute('fill-opacity', factor);
};
