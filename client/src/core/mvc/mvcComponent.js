***REMOVED***
***REMOVED*** @fileoverview An abstract class which represents
***REMOVED*** a component of the model-view-controller.
***REMOVED***

goog.provide('xrx.mvc.Component');



goog.require('goog.events.EventHandler');
goog.require('goog.ui.IdGenerator');



***REMOVED***
***REMOVED*** Constructs a new model-view-controller component.
***REMOVED***
***REMOVED***
xrx.mvc.Component = function(element) {

  this.element_ = element;
***REMOVED***



***REMOVED***
***REMOVED*** Function is called by the model-view-controller when the component
***REMOVED*** is inizialized the first time. Each component must implement this.
***REMOVED***
xrx.mvc.Component.prototype.createDom = goog.abstractMethod;



***REMOVED***
***REMOVED*** Generator for unique IDs.
***REMOVED*** @type {goog.ui.IdGenerator}
***REMOVED*** @private
***REMOVED***
xrx.mvc.Component.prototype.idGenerator_ = goog.ui.IdGenerator.getInstance();



***REMOVED***
***REMOVED*** Unique ID of the component, lazily initialized in {@link
***REMOVED*** xrx.mvc.Component#getId} if needed. This property is strictly private and
***REMOVED*** must not be accessed directly outside of this class!
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
xrx.mvc.Component.prototype.id_ = null;



***REMOVED***
***REMOVED*** Event handler.
***REMOVED*** @type {goog.events.EventHandler}
***REMOVED*** @private
***REMOVED***
xrx.mvc.Component.prototype.handler_;




***REMOVED***
***REMOVED*** Returns the component's element.
***REMOVED*** @return {Element} The element for the component.
***REMOVED***
xrx.mvc.Component.prototype.getElement = function() {
  return this.element_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the unique ID for the instance of this component. If the instance
***REMOVED*** doesn't already have an ID, generates one on the fly.
***REMOVED*** @return {string} Unique component ID.
***REMOVED***
xrx.mvc.Component.prototype.getId = function() {
  return this.id_ || this.element_.getAttribute('id') || 
      (this.id_ = this.idGenerator_.getNextUniqueId());
***REMOVED***



***REMOVED***
***REMOVED*** Returns the XPath expression found in the component's data-xrx-ref attribute.
***REMOVED*** @return {?string} The expression.
***REMOVED***
xrx.mvc.Component.prototype.getRefExpression = function() {
  return this.getElement().getAttribute('data-xrx-ref');
***REMOVED***



***REMOVED***
***REMOVED*** Returns the bind ID found in the component's data-xrx-bind attribute.
***REMOVED*** @return {?string} The bind ID.
***REMOVED***
xrx.mvc.Component.prototype.getBindId = function() {
  return this.getElement().getAttribute('data-xrx-bind');
***REMOVED***



***REMOVED***
***REMOVED*** Returns the source URI found in the component's data-xrx-src attribute.
***REMOVED*** @return {?string} The source URI.
***REMOVED***
xrx.mvc.Component.prototype.getSrcUri = function() {
  return this.getElement().getAttribute('data-xrx-src');
***REMOVED***



***REMOVED***
***REMOVED*** Returns the bind referenced by the component.
***REMOVED*** @return {?xrx.mvc.Bind} The bind.
***REMOVED***
xrx.mvc.Component.prototype.getBind = function() {
  return xrx.mvc.Mvc.getModelComponent(this.getBindId());
***REMOVED***



***REMOVED***
***REMOVED*** Returns the event handler for this component, lazily created the first time
***REMOVED*** this method is called.
***REMOVED*** @return {!goog.events.EventHandler} Event handler for this component.
***REMOVED*** @protected
***REMOVED***
xrx.mvc.Component.prototype.getHandler = function() {
  return this.handler_ ||
      (this.handler_ = new goog.events.EventHandler(this));
***REMOVED***
