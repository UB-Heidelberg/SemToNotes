***REMOVED***
***REMOVED*** @fileoverview Class implements a repeat control.
***REMOVED***

goog.provide('xrx.mvc.Repeat');
goog.provide('xrx.mvc.RepeatItem');



goog.require('goog.array');
***REMOVED***
goog.require('goog.dom.classes');
goog.require('goog.dom.dataset');
goog.require('xrx.mvc.ComponentView');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc.Repeat = function(element) {

  this.firstElements_;

  this.firstItem_;

  this.nextItems_ = [];

***REMOVED***
***REMOVED***
goog.inherits(xrx.mvc.Repeat, xrx.mvc.ComponentView);



xrx.mvc.Repeat.prototype.appendItem = function(item) {
  goog.array.forEach(item.getElements(), function(e, i, a) {
    goog.dom.append(this.element_, e);
  }, this)
***REMOVED***



xrx.mvc.Repeat.prototype.indexOfItem = function(item) {
  var index;
  item === this.firstItem_ ? index = 0 : index = goog.array.findIndex(
      this.nextItems_, function(e, i, a) { e === item }) + 3;
  return index;
***REMOVED***



xrx.mvc.Repeat.prototype.createDom = function() {
  var firstElements_ = goog.dom.getChildren(this.element_);
  if (firstElements_.length === 0) return;
  this.firstElements_ = [];
  goog.array.forEach(firstElements_, function(e, i, a) {
    this.firstElements_.push(e);
  }, this);
***REMOVED***



xrx.mvc.Repeat.prototype.refresh = function() {
  this.firstItem_ = new xrx.mvc.RepeatItem(this, this.firstElements_, 0);
  var n = 1;
  var item;
  while(this.getNode(n)) {
    item = new xrx.mvc.RepeatItem(this, this.firstItem_.getClonedElements(), n);
    this.nextItems_.push(item);
    n++;
  }
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc.RepeatItem = function(repeat, elements, index) {

  this.repeat_ = repeat;

  this.elements_ = elements;

  this.index_ = index;

  this.createDom();
***REMOVED***



xrx.mvc.RepeatItem.prototype.getElements = function() {
  return this.elements_;
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.mvc.RepeatItem.prototype.getClonedElements = function() {
  var elements = [];
  for (var i = 0, len = this.elements_.length; i < len; i++) {
    elements.push(this.elements_[i].cloneNode(true));
  }
  return elements;
***REMOVED***



xrx.mvc.RepeatItem.prototype.createDom = function() {
***REMOVED***
  this.repeat_.appendItem(this);
  for (var i = 0, len = this.elements_.length; i < len; i++) {
    goog.dom.classes.add(this.elements_[i], 'xrx-mvc-repeat-item');
    goog.dom.dataset.set(this.elements_[i], 'xrxRepeatIndex', this.index_);
  }
***REMOVED***
