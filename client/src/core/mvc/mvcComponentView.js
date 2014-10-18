/**
 * @fileoverview Abstract class which represents a
 * control of the model-view-controller.
 */

goog.provide('xrx.mvc.ComponentView');



goog.require('goog.dom.DomHelper');
goog.require('goog.dom.dataset');
goog.require('xrx.mvc.Component');
goog.require('xrx.mvc');
goog.require('xrx.node.ElementS');



/**
 * @constructor
 */
xrx.mvc.ComponentView = function(element) {

  goog.base(this, element);

  xrx.mvc.addViewComponent(this.getId(), this);

  this.createDom();

  this.mvcRefresh();
};
goog.inherits(xrx.mvc.ComponentView, xrx.mvc.Component);



xrx.mvc.ComponentView.prototype.getRepeat = function() {
  var element = goog.dom.getAncestorByClass(this.element_, 'xrx-mvc-repeat');
  return !element ? undefined : xrx.mvc.getViewComponent(element.id);
};



xrx.mvc.ComponentView.prototype.getRepeatIndex = function() {
  var repeatItem = goog.dom.getAncestorByClass(this.element_,
      'xrx-mvc-repeat-item');
  if (goog.dom.classes.has(this.element_, 'xrx-mvc-repeat-item')) {
    return this.element_.getAttribute('data-xrx-repeat-index');
  } else if (repeatItem) {
    return repeatItem.getAttribute('data-xrx-repeat-index');
  } else {
    throw Error('Repeat item could not be found.');
  }
}; 



xrx.mvc.ComponentView.prototype.getNodeBind = function(num) {
  return this.getBind().getNode(num);
};



xrx.mvc.ComponentView.prototype.getNodeRef = function() {
  var repeat = this.getRepeat();
  if (!repeat) return;
  var context = repeat.getNode(this.getRepeatIndex());
  if (!context) return;
  // TODO: Node conversion function
  var nodeS = new xrx.node.ElementS(context.getDocument(), context.getToken());
  var result = xrx.xpath.evaluate(this.getRefExpression(), nodeS, null,
      xrx.xpath.XPathResultType.ANY_TYPE);
  var next = result.iterateNext();
  return next;
};



/**
 * Returns the node referenced by the control.
 * @return {xrx.node} The node.
 */
xrx.mvc.ComponentView.prototype.getNode = function(num) {
  var n = num || 0;

  if (this.getBind()) {
    return this.getNodeBind(n);
  } else if (this.getRefExpression()) {
    return this.getNodeRef(n);
  } else {
    throw Error('A control must define a data-xrx-mvc-bind or a data-xrx-mvc-ref ' +
        'attribute.');
  }
};
