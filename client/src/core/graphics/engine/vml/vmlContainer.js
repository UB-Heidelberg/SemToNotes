/**
 * @fileoverview Abstract VML class representing a container.
 */

goog.provide('xrx.vml.Container');



goog.require('xrx.vml.Element');



/**
 * Abstract VML class representing a container.
 * @param {Raphael} raphael The Raphael object.
 * @constructor
 */
xrx.vml.Container = function(raphael) {

  goog.base(this, raphael);

  /**
   * The child elements of this container.
   * @type {Array<xrx.vml.Element>}
   */
  this.childs_ = [];
};
goog.inherits(xrx.vml.Container, xrx.vml.Element);



/**
 * Adds a child element to this container.
 * @param {xrx.vml.Element} element The child element.
 */
xrx.vml.Container.prototype.addChild = function(element) {
  var shield = this.raphael_.paper.getById('shield');
  this.childs_.push(element);
  if (this.raphael_ instanceof Array) { // Raphael set?
    this.raphael_.push(element.getRaphael());
  } else { // Raphael paper?
    if (this.getElement()) goog.dom.append(this.getElement(),
        element.getElement());
  }
  if (shield) shield.toFront();
};



/**
 * Returns the child elements of this container.
 * @return {xrx.vml.Element} The child elements.
 */
xrx.vml.Container.prototype.getChildren = function() {
  return this.childs_;
};



/**
 * Removes all child elements from this container.
 */
xrx.vml.Container.prototype.removeChildren = function() {
  var len = this.childs_.length;
  if (this.raphael_ instanceof Array) {
    for (var i = 0; i < len; i++) {
      goog.dom.removeNode(this.raphael_.pop().node);
    }
  } else {
    for (var i = 0; i < len; i++) {
      this.childs_[i].getRaphael().remove();
    }
  }
  this.childs_ = [];
};



/**
 * Removes a child element at an index.
 * @param {number} index The index.
 */
xrx.vml.Container.prototype.removeChildAt = function(index) {
  if (this.raphael_ instanceof Array) { // Raphael set?
    goog.dom.removeNode(this.raphael_.splice(index, 1)[0].node);
  } else {
    this.childs_[index].getRaphael().remove();
  }
  this.childs_.splice(index, 1);
};
