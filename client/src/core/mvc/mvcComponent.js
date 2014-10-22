***REMOVED***
***REMOVED*** @fileoverview An abstract class which represents
***REMOVED***   a component of the model-view-controller.
***REMOVED***

goog.provide('xrx.mvc.Component');



goog.require('goog.dom.dataset');
goog.require('goog.events.EventHandler');
goog.require('goog.ui.IdGenerator');



***REMOVED***
***REMOVED*** Constructs a new model-view-controller component.
***REMOVED***
***REMOVED***
xrx.mvc.Component = function(element) {

  this.element_ = element;
***REMOVED***



xrx.mvc.Component.idGenerator = goog.ui.IdGenerator.getInstance();



***REMOVED***
***REMOVED*** Function is called by the model-view-controller when the component
***REMOVED*** is inizialized the first time. Each component must implement this.
***REMOVED***
xrx.mvc.Component.prototype.createDom = goog.abstractMethod;



***REMOVED***
***REMOVED*** Unique ID of the component, lazily initialized in {@link
***REMOVED*** xrx.mvc.Component#getId}.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
xrx.mvc.Component.prototype.id_ = null;




***REMOVED***
***REMOVED*** Returns the component's element.
***REMOVED*** @return {Element} The element for the component.
***REMOVED***
xrx.mvc.Component.prototype.getElement = function() {
  return this.element_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the unique ID of this component. If the instance
***REMOVED*** doesn't already have an ID generate one on the fly.
***REMOVED*** @return {string} Unique component ID.
***REMOVED***
xrx.mvc.Component.prototype.getId = function() {
  if (!this.id_) {
    if (this.element_.id && this.element_.id !== '') {
      this.id_ = this.element_.id;
    } else {
      this.id_ = xrx.mvc.Component.idGenerator.getNextUniqueId();
      this.element_.id = this.id_;
    }
  }
  return this.id_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the XPath expression found in the component's data-xrx-ref attribute.
***REMOVED*** @return {?string} The expression.
***REMOVED***
xrx.mvc.Component.prototype.getRefExpression = function(opt_dataset) {
  var dataset = opt_dataset || 'xrxRef';
  return goog.dom.dataset.get(this.getElement(), dataset);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the bind ID found in the component's data-xrx-bind attribute.
***REMOVED*** @return {?string} The bind ID.
***REMOVED***
xrx.mvc.Component.prototype.getBindId = function(opt_dataset) {
  var dataset = opt_dataset || 'xrxBind';
  return goog.dom.dataset.get(this.getElement(), dataset);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the source URI found in the component's data-xrx-src attribute.
***REMOVED*** @return {?string} The source URI.
***REMOVED***
xrx.mvc.Component.prototype.getSrcUri = function(opt_dataset) {
  var dataset = opt_dataset || 'xrxSrc';
  return goog.dom.dataset.get(this.getElement(), dataset);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the bind referenced by the component.
***REMOVED*** @return {?xrx.mvc.Bind} The bind.
***REMOVED***
xrx.mvc.Component.prototype.getBind = function(opt_dataset) {
  return xrx.mvc.getModelComponent(this.getBindId(opt_dataset));
***REMOVED***



xrx.mvc.Component.prototype.getRepeat = function() {
  var element = goog.dom.getAncestorByClass(this.element_, 'xrx-mvc-repeat');
  return !element ? undefined : xrx.mvc.getViewComponent(element.id);
***REMOVED***



xrx.mvc.Component.prototype.getRepeatIndex = function() {
  var repeatItem = goog.dom.getAncestorByClass(this.element_,
      'xrx-mvc-repeat-item');
  if (goog.dom.classes.has(this.element_, 'xrx-mvc-repeat-item')) {
    return this.element_.getAttribute('data-xrx-repeat-index');
  } else if (repeatItem) {
    return repeatItem.getAttribute('data-xrx-repeat-index');
  } else {
    throw Error('Repeat item could not be found.');
  }
***REMOVED*** 



xrx.mvc.Component.prototype.getNodeBind = function(num, opt_dataset) {
  return this.getBind(opt_dataset).getNode(num);
***REMOVED***



xrx.mvc.Component.prototype.getNodeRef = function(opt_dataset) {
  var repeat = this.getRepeat();
  if (!repeat) return;
  var context = repeat.getNode(this.getRepeatIndex());
  if (!context) return;
  // TODO: Node conversion function
  var nodeS = new xrx.node.ElementS(context.getDocument(), context.getToken());
  var result = xrx.xpath.evaluate(this.getRefExpression(opt_dataset), nodeS, null,
      xrx.xpath.XPathResultType.ANY_TYPE);
  var next = result.iterateNext();
  return next;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the node referenced by the component.
***REMOVED*** @return {xrx.node} The node.
***REMOVED***
xrx.mvc.Component.prototype.getNode = function(num, opt_dataset) {
  var n = num || 0;
  if (this.getBind(opt_dataset)) {
    return this.getNodeBind(n, opt_dataset);
  } else if (this.getRefExpression(opt_dataset)) {
    return this.getNodeRef(opt_dataset);
  } else {
    throw Error('A control must define a data-xrx-mvc-bind or a data-xrx-mvc-ref ' +
        'attribute.');
  }
***REMOVED***



xrx.mvc.Component.prototype.getParentComponent = function() {
***REMOVED***
