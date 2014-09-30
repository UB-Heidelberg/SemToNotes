***REMOVED***
***REMOVED*** @fileoverview An abstract class which represents
***REMOVED*** a component of the model-view-controller.
***REMOVED***

goog.provide('xrx.component');


goog.require('goog.events.EventHandler');
goog.require('goog.ui.IdGenerator');



***REMOVED***
***REMOVED*** Constructs a new model-view-controller component.
***REMOVED***
***REMOVED***
xrx.component = function(element) {



  this.element_ = element;
***REMOVED***



***REMOVED***
***REMOVED*** Function is called by the model-view-controller when the component
***REMOVED*** is inizialized the first time. Each component must implement this.
***REMOVED***
xrx.component.prototype.createDom = goog.abstractMethod;



***REMOVED***
***REMOVED*** Generator for unique IDs.
***REMOVED*** @type {goog.ui.IdGenerator}
***REMOVED*** @private
***REMOVED***
xrx.component.prototype.idGenerator_ = goog.ui.IdGenerator.getInstance();



***REMOVED***
***REMOVED*** Unique ID of the component, lazily initialized in {@link
***REMOVED*** xrx.component#getId} if needed. This property is strictly private and
***REMOVED*** must not be accessed directly outside of this class!
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
xrx.component.prototype.id_ = null;



***REMOVED***
***REMOVED*** Event handler.
***REMOVED*** @type {goog.events.EventHandler}
***REMOVED*** @private
***REMOVED***
xrx.component.prototype.handler_;




***REMOVED***
***REMOVED*** Gets the component's element.
***REMOVED*** @return {Element} The element for the component.
***REMOVED***
xrx.component.prototype.getElement = function() {
  return this.element_;
***REMOVED***



***REMOVED***
***REMOVED*** Gets the unique ID for the instance of this component. If the instance
***REMOVED*** doesn't already have an ID, generates one on the fly.
***REMOVED*** @return {string} Unique component ID.
***REMOVED***
xrx.component.prototype.getId = function() {
  return this.id_ || this.element_.getAttribute('id') || 
      (this.id_ = this.idGenerator_.getNextUniqueId());
***REMOVED***



***REMOVED***
***REMOVED*** Gets the XPath expression found in the component's data-xrx-ref attribute.
***REMOVED*** @return {?string} The expression.
***REMOVED***
xrx.component.prototype.getRefExpression = function() {
  return this.getElement().getAttribute('data-xrx-ref');
***REMOVED***



***REMOVED***
***REMOVED*** Gets the bind ID found in the component's data-xrx-bind attribute.
***REMOVED*** @return {?string} The bind ID.
***REMOVED***
xrx.component.prototype.getBindId = function() {
  return this.getElement().getAttribute('data-xrx-bind');
***REMOVED***



***REMOVED***
***REMOVED*** Gets the source URI found in the component's data-xrx-src attribute.
***REMOVED*** @return {?string} The source URI.
***REMOVED***
xrx.component.prototype.getSrcUri = function() {
  return this.getElement().getAttribute('data-xrx-src');
***REMOVED***



***REMOVED***
***REMOVED*** Gets the bind referenced by the component.
***REMOVED*** @return {?xrx.bind} The bind.
***REMOVED***
xrx.component.prototype.getBind = function() {
  return xrx.model.getComponent(this.getBindId());
***REMOVED***



***REMOVED***
***REMOVED*** Returns the event handler for this component, lazily created the first time
***REMOVED*** this method is called.
***REMOVED*** @return {!goog.events.EventHandler} Event handler for this component.
***REMOVED*** @protected
***REMOVED***
xrx.component.prototype.getHandler = function() {
  return this.handler_ ||
      (this.handler_ = new goog.events.EventHandler(this));
***REMOVED***

