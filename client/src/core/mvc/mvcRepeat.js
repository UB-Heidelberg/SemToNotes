/**
 * @fileoverview Class implements a repeat control.
 */

goog.provide('xrx.mvc.Repeat');
goog.provide('xrx.mvc.RepeatItem');



goog.require('goog.array');
goog.require('goog.dom.DomHelper');
goog.require('goog.dom.classes');
goog.require('goog.dom.dataset');
goog.require('xrx.mvc');
goog.require('xrx.mvc.ComponentView');



/**
 * @constructor
 */
xrx.mvc.Repeat = function(element) {

  this.firstElements_;

  this.firstItem_;

  this.nextItems_ = [];

  goog.base(this, element);
};
goog.inherits(xrx.mvc.Repeat, xrx.mvc.ComponentView);



xrx.mvc.Repeat.prototype.appendItem = function(item) {
  goog.array.forEach(item.getElements(), function(e, i, a) {
    goog.dom.append(this.element_, e);
  }, this)
};



xrx.mvc.Repeat.prototype.indexOfItem = function(item) {
  var index;
  item === this.firstItem_ ? index = 0 : index = goog.array.findIndex(
      this.nextItems_, function(e, i, a) { e === item }) + 1;
  return index;
};



xrx.mvc.Repeat.prototype.createItems_ = function() {
  this.firstItem_ = new xrx.mvc.RepeatItem(this, this.firstElements_, 0);
  var n = 1;
  var item;
  while(this.getNode(n)) {
    item = new xrx.mvc.RepeatItem(this, this.firstItem_.getClonedElements(), n);
    this.nextItems_.push(item);
    n++;
  }
};



xrx.mvc.Repeat.prototype.removeItems_ = function() {
  var item;
  while (item = this.nextItems_.pop()) {
    item.removeDom();
  }
};



xrx.mvc.Repeat.prototype.createDom = function() {
  var firstElements_ = goog.dom.getChildren(this.element_);
  if (firstElements_.length === 0) return;
  this.firstElements_ = [];
  goog.array.forEach(firstElements_, function(e, i, a) {
    this.firstElements_.push(e);
  }, this);
};



xrx.mvc.Repeat.prototype.mvcRefresh = function() {
  xrx.mvc.removeViewComponents(this.element_);
  this.removeItems_();
  this.createItems_();
  //xrx.mvc.Mvc.getInstance().installComponents(this.element_);
};



/**
 * @constructor
 */
xrx.mvc.RepeatItem = function(repeat, elements, index) {

  this.repeat_ = repeat;

  this.elements_ = elements;

  this.index_ = index;

  this.createDom();
};



xrx.mvc.RepeatItem.prototype.getElements = function() {
  return this.elements_;
};



/**
 * @private
 */
xrx.mvc.RepeatItem.prototype.getClonedElements = function() {
  var elements = [];
  for (var i = 0, len = this.elements_.length; i < len; i++) {
    elements.push(this.elements_[i].cloneNode(true));
  }
  return elements;
};



xrx.mvc.RepeatItem.prototype.createDom = function() {
  var self = this;
  this.repeat_.appendItem(this);
  for (var i = 0, len = this.elements_.length; i < len; i++) {
    goog.dom.classes.add(this.elements_[i], 'xrx-mvc-repeat-item');
    goog.dom.dataset.set(this.elements_[i], 'xrxRepeatIndex', this.index_);
  }
};



xrx.mvc.RepeatItem.prototype.removeDom = function() {
  for (var i = 0, len = this.elements_.length; i < len; i++) {
    goog.dom.removeNode(this.elements_[i]);
  }
};

