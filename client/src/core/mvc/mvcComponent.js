/**
 * @fileoverview An abstract class which represents
 * a component of the model-view-controller.
 */

goog.provide('xrx.mvc.Component');


goog.require('goog.events.EventHandler');
goog.require('goog.ui.IdGenerator');



/**
 * Constructs a new model-view-controller component.
 * @constructor
 */
xrx.mvc.Component = function(element) {

  this.element_ = element;
};



/**
 * Function is called by the model-view-controller when the component
 * is inizialized the first time. Each component must implement this.
 */
xrx.mvc.Component.prototype.createDom = goog.abstractMethod;



/**
 * Generator for unique IDs.
 * @type {goog.ui.IdGenerator}
 * @private
 */
xrx.mvc.Component.prototype.idGenerator_ = goog.ui.IdGenerator.getInstance();



/**
 * Unique ID of the component, lazily initialized in {@link
 * xrx.mvc.Component#getId} if needed. This property is strictly private and
 * must not be accessed directly outside of this class!
 * @type {?string}
 * @private
 */
xrx.mvc.Component.prototype.id_ = null;



/**
 * Event handler.
 * @type {goog.events.EventHandler}
 * @private
 */
xrx.mvc.Component.prototype.handler_;




/**
 * Gets the component's element.
 * @return {Element} The element for the component.
 */
xrx.mvc.Component.prototype.getElement = function() {
  return this.element_;
};



/**
 * Gets the unique ID for the instance of this component. If the instance
 * doesn't already have an ID, generates one on the fly.
 * @return {string} Unique component ID.
 */
xrx.mvc.Component.prototype.getId = function() {
  return this.id_ || this.element_.getAttribute('id') || 
      (this.id_ = this.idGenerator_.getNextUniqueId());
};



/**
 * Gets the XPath expression found in the component's data-xrx-ref attribute.
 * @return {?string} The expression.
 */
xrx.mvc.Component.prototype.getRefExpression = function() {
  return this.getElement().getAttribute('data-xrx-ref');
};



/**
 * Gets the bind ID found in the component's data-xrx-bind attribute.
 * @return {?string} The bind ID.
 */
xrx.mvc.Component.prototype.getBindId = function() {
  return this.getElement().getAttribute('data-xrx-bind');
};



/**
 * Gets the source URI found in the component's data-xrx-src attribute.
 * @return {?string} The source URI.
 */
xrx.mvc.Component.prototype.getSrcUri = function() {
  return this.getElement().getAttribute('data-xrx-src');
};



/**
 * Gets the bind referenced by the component.
 * @return {?xrx.mvc.Bind} The bind.
 */
xrx.mvc.Component.prototype.getBind = function() {
  return xrx.mvc.Mvc.getModelComponent(this.getBindId());
};



/**
 * Returns the event handler for this component, lazily created the first time
 * this method is called.
 * @return {!goog.events.EventHandler} Event handler for this component.
 * @protected
 */
xrx.mvc.Component.prototype.getHandler = function() {
  return this.handler_ ||
      (this.handler_ = new goog.events.EventHandler(this));
};
