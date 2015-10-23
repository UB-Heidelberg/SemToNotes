/**
 * @fileoverview Super-class representing an engine-independent
 * shape.
 */

goog.provide('xrx.shape.Shape');



goog.require('xrx.engine.Engines');
goog.require('xrx.shape.RenderStylable');
goog.require('xrx.shape');



/**
 * Super-class representing an engine-independent shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing canvas.
 * @param {xrx.engine.Element} engineElement The engine element
 *   used to render this shape.
 * @constructor
 * @private
 */
xrx.shape.Shape = function(drawing, engineElement) {

  goog.base(this, engineElement);

  /**
   * The parent drawing canvas.
   * @type {xrx.drawing.Drawing}
   */
  this.drawing_ = drawing;

  /**
   *
   */
  this.hoverable_;

  /**
   *
   */
  this.selectable_;

  /**
   *
   */
  this.modifiable_;

  /**
   * Whether this shape is set modifiable. Defaults to true.
   * @type {boolean}
   */
  this.isModifiable_ = true;

  /**
   *
   */
  this.creatable_;
};
goog.inherits(xrx.shape.Shape, xrx.shape.RenderStylable);



xrx.shape.Shape.prototype.getHoverable = goog.abstractMethod;



xrx.shape.Shape.prototype.setHoverable =  goog.abstractMethod;



xrx.shape.Shape.prototype.getSelectable = goog.abstractMethod;



xrx.shape.Shape.prototype.setSelectable =  goog.abstractMethod;



/**
 * Abstract function to be implemented by each shape class. Returns
 * a modifiable shape.
 * @return {xrx.shape.Modifiable} A modifiable shape.
 */
xrx.shape.Shape.prototype.getModifiable = goog.abstractMethod;



xrx.shape.Shape.prototype.setModifiable = goog.abstractMethod;



/**
 * Abstract function to be implemented by each shape class. Returns
 * a creatable shape.
 * @return {xrx.shape.Creatable} A creatable shape.
 */
xrx.shape.Shape.prototype.getCreatable = goog.abstractMethod;



xrx.shape.Shape.prototype.setCreatable = goog.abstractMethod;



/**
 * Returns the parent drawing object of this shape.
 * @return {xrx.drawing.Drawing} The drawing object.
 */ 
xrx.shape.Shape.prototype.getDrawing = function() {
  return this.drawing_;
};



/**
 * Sets whether the shape shall be modifiable or not. Defaults
 * to true.
 * @param {boolean} modifiable Whether modifiable or not.
 */
xrx.shape.Shape.prototype.setModifiable = function(modifiable) {
  modifiable === false ? this.isModifiable_ = false : this.isModifiable_ = true;
};



/**
 * Whether this shape is set modifiable.
 * @return {boolean} Is modifiable.
 */
xrx.shape.Shape.prototype.isModifiable = function() {
  return this.isModifiable_;
};



xrx.shape.Shape.prototype.disposeInternal = function() {
  this.drawing_.dispose();
  this.drawing_ = null;
  goog.dispose(this.hoverable_);
  this.hoverable_ = null;
  goog.dispose(this.selectable_);
  this.selectable_ = null;
  goog.dispose(this.modifiable_);
  this.modifiable_ = null;
  goog.dispose(this.creatable_);
  this.creatable_ = null;
  goog.base(this, 'disposeInternal');
};
