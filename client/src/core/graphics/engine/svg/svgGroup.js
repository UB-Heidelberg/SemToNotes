/**
 * @fileoverview SVG class representing a group.
 */

goog.provide('xrx.svg.Group');



goog.require('goog.dom.DomHelper');
goog.require('xrx.svg');
goog.require('xrx.svg.Element');



/**
 * SVG class representing a group.
 * @param {SVGGroupElement} element The SVG group element.
 * @constructor
 * @extends xrx.svg.Element
 */
xrx.svg.Group = function(element) {

  goog.base(this, element);

  /**
   * The child elements of the group.
   * @type {Array.<xrx.svg.Element>}
   */
  this.childs_ = [];
};
goog.inherits(xrx.svg.Group, xrx.svg.Element);



/**
 * Returns the child elements of the group.
 * @return {xrx.svg.Element} The child elements.
 */
xrx.svg.Group.prototype.getChildren = function() {
  return this.childs_;
};



/**
 * Adds child elements to a group.
 * @param {xrx.svg.Element} children The child elements.
 */
xrx.svg.Group.prototype.addChildren = function(children) {
  if (!goog.isArray(children)) children = [children];
  var child;
  for(var i = 0, len = children.length; i < len; i++) {
    child = children[i];
    this.childs_.push(child);
    goog.dom.append(this.element_, child.getElement());
  }
};



/**
 * Removes all child elements from the group.
 */
xrx.svg.Group.prototype.removeChildren = function() {
  goog.dom.removeChildren(this.element_);
  this.childs_ = [];
};



/**
 * Removes a child element at an index.
 * @param {number} index The index.
 */
xrx.svg.Group.prototype.removeChildAt = function(index) {
  var child = this.childs_[index];
  goog.dom.removeNode(child.getElement());
  this.childs_.splice(index, 1);
};



/**
 * Draws each child element of the group.
 */
xrx.svg.Group.prototype.draw = function() {};



/**
 * Creates a new group.
 */
xrx.svg.Group.create = function(undefined_) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'g');
  return new xrx.svg.Group(element);
};
