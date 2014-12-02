***REMOVED***
***REMOVED*** @fileoverview An abstract class which represents
***REMOVED***   a component of the model-view-controller.
***REMOVED***

goog.provide('xrx.mvc.Component');



***REMOVED***
goog.require('goog.dom.dataset');
goog.require('goog.ui.IdGenerator');
goog.require('xrx.mvc.Validate');



***REMOVED***
***REMOVED*** Constructs a new model-view-controller component.
***REMOVED***
***REMOVED***
xrx.mvc.Component = function(element, uidl) {

  this.element_ = element;

  this.uidl = uidl;

  goog.base(this);

  this.validate();
***REMOVED***
goog.inherits(xrx.mvc.Component, xrx.mvc.Validate);



xrx.mvc.Component.prototype.getAction = function(eventKey) {
  xrx.mvc.getComponent;
***REMOVED***



***REMOVED***
***REMOVED*** Function is called by the model-view-controller when the component
***REMOVED*** is initialized the first time. Each component must implement this.
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
      this.id_ = goog.ui.IdGenerator.getInstance().getNextUniqueId();
      this.element_.id = this.id_;
    }
  }
  return this.id_;
***REMOVED***



***REMOVED***
***REMOVED*** Whether the component has its own context other than a
***REMOVED*** repeat context.
***REMOVED*** @return {boolean}
***REMOVED***
xrx.mvc.Component.prototype.hasContext = function() {
  return !!this.getContext;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the parent repeat component of the component.
***REMOVED*** @return {xrx.mvc.Repeat} The repeat component.
***REMOVED***
xrx.mvc.Component.prototype.getRepeat = function() {
  var element = goog.dom.getAncestorByClass(this.element_, 'xrx-mvc-repeat');
  return element ? xrx.mvc.getViewComponent(element.id) : undefined;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the index of a dynamically repeated component.
***REMOVED*** @return {number} The index.
***REMOVED***
xrx.mvc.Component.prototype.getRepeatIndex = function() {
  var value;
  var repeatItem = goog.dom.getAncestorByClass(this.element_,
      'xrx-mvc-repeat-item');
  if (goog.dom.classes.has(this.element_, 'xrx-mvc-repeat-item')) {
    value = goog.dom.dataset.get(this.element_, 'xrxRepeatIndex');
  } else if (repeatItem) {
    value = goog.dom.dataset.get(repeatItem, 'xrxRepeatIndex');
  } else {
    throw Error('Repeat item could not be found.');
  }
  return parseInt(value);
***REMOVED*** 



***REMOVED***
***REMOVED*** Returns the XPath expression found in the component's data-xrx-ref attribute.
***REMOVED*** @return {string} The expression.
***REMOVED***
xrx.mvc.Component.prototype.getRefExpression = function(opt_dataset) {
  var dataset = opt_dataset || 'xrxRef';
  return goog.dom.dataset.get(this.getElement(), dataset);
***REMOVED***



xrx.mvc.Component.prototype.getValueExpression = function(opt_dataset) {
  var dataset = opt_dataset || 'xrxValue';
  return goog.dom.dataset.get(this.getElement(), dataset);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the bind ID found in the component's data-xrx-bind attribute.
***REMOVED*** @return {string} The bind ID.
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
***REMOVED*** Returns the bind component referenced by the component.
***REMOVED*** @return {xrx.mvc.Bind} The bind component.
***REMOVED***
xrx.mvc.Component.prototype.getBind = function(opt_dataset) {
  return xrx.mvc.getModelComponent(this.getBindId(opt_dataset));
***REMOVED***



***REMOVED***
***REMOVED*** Returns the n'th node held by the component by means of a
***REMOVED*** bind expression.
***REMOVED*** @return {xrx.node.Node} The node.
***REMOVED***
xrx.mvc.Component.prototype.getNodeBind = function(num, opt_dataset) {
  return this.getBind(opt_dataset).getNode(num);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the node held by the component by means of a repeat component
***REMOVED*** and a ref expression.
***REMOVED*** @return {xrx.node.Node} The node.
***REMOVED***
xrx.mvc.Component.prototype.getNodeRefWithRepeat = function(opt_dataset, opt_context) {
  var repeat = this.getRepeat();
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
***REMOVED*** Returns the node held by the component by means of a context node
***REMOVED*** and a ref expression.
***REMOVED*** @return {xrx.node.Node} The node.
***REMOVED***
xrx.mvc.Component.prototype.getNodeRefWithContext = function(opt_dataset, opt_context) {
  var context = this.getContext();
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
***REMOVED*** @return {xrx.node.Node} The node.
***REMOVED***
xrx.mvc.Component.prototype.getNode = function(num, opt_dataset) {
  var node;
  var n = num || 0;
  if (this.hasContext()) {
    node = this.getNodeRefWithContext(opt_dataset, this.getContext());
  } else if (this.getBind(opt_dataset)) {
    node = this.getNodeBind(n, opt_dataset);
  } else if (this.getRefExpression(opt_dataset)) {
    node = this.getNodeRefWithRepeat(opt_dataset);
  } else {
    throw Error('A control must define a data-xrx-mvc-bind or a data-xrx-mvc-ref ' +
        'attribute.');
  }
  return node;
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.mvc.Component.prototype.getValue = function(opt_dataset) {
  return xrx.xpath.evaluate(this.getValueExpression(opt_dataset), undefined, null,
      xrx.xpath.XPathResultType.STRING_TYPE).stringValue;  
***REMOVED***



xrx.mvc.Component.prototype.getParentComponent = function() {
***REMOVED***
