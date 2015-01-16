/**
 * @fileoverview Components implementing HTML DOM manipulation.
 */

goog.provide('xrx.mvc.Dom');
goog.provide('xrx.mvc.ClassesAdd');
goog.provide('xrx.mvc.ClassesRemove');



goog.require('goog.array');
goog.require('goog.dom.classes');
goog.require('goog.dom.DomHelper');
goog.require('xrx.mvc.AbstractAction');



/**
 * @constructor
 */
xrx.mvc.Dom = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.mvc.Dom, xrx.mvc.AbstractAction);



xrx.mvc.Dom.prototype.getElementsSelected = function() {
  var elements;
  var selector = this.getDataset('xrxSelect');
  if (selector[0] === '.') {
    elements = goog.dom.getElementsByClass(selector.substr(1));
  } else if (selector[0] === '#') {
    elements = [goog.dom.getElement(selector.substr(1))];
  } else {
    throw Error('Invalid selector: "' + selector + '".');
  };
  return goog.array.toArray(elements);
};



xrx.mvc.Dom.prototype.getClasses = function() {
  return this.getDataset('xrxClasses').split(' ');
};



/**
 * @constructor
 */
xrx.mvc.ClassesAdd = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.mvc.ClassesAdd, xrx.mvc.Dom);



xrx.mvc.ClassesAdd.prototype.execute_ = function() {
  goog.array.forEach(this.getElementsSelected(), function(element) {
    goog.array.forEach(this.getClasses(), function(clss) {
      goog.dom.classes.add(element, clss);
    });
  }, this);
};



/**
 * @constructor
 */
xrx.mvc.ClassesRemove = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.mvc.ClassesRemove, xrx.mvc.Dom);



xrx.mvc.ClassesRemove.prototype.execute_ = function() {
  goog.array.forEach(this.getElementsSelected(), function(element) {
    goog.array.forEach(this.getClasses(), function(clss) {
      goog.dom.classes.remove(element, clss);
    });
  }, this);
};
