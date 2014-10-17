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



xrx.mvc.Component.idGenerator = goog.ui.IdGenerator.getInstance();



/**
 * Function is called by the model-view-controller when the component
 * is inizialized the first time. Each component must implement this.
 */
xrx.mvc.Component.prototype.createDom = goog.abstractMethod;



/**
 * Unique ID of the component, lazily initialized in {@link
 * xrx.mvc.Component#getId} if needed. This property is strictly private and
 * must not be accessed directly outside of this class.
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
 * Returns the component's element.
 * @return {Element} The element for the component.
 */
xrx.mvc.Component.prototype.getElement = function() {
  return this.element_;
};



/**
 * Returns the unique ID of this component. If the instance
 * doesn't already have an ID generate one on the fly.
 * @return {string} Unique component ID.
 */
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
};



/**
 * Returns the XPath expression found in the component's data-xrx-ref attribute.
 * @return {?string} The expression.
 */
xrx.mvc.Component.prototype.getRefExpression = function() {
  return this.getElement().getAttribute('data-xrx-ref');
};



/**
 * Returns the bind ID found in the component's data-xrx-bind attribute.
 * @return {?string} The bind ID.
 */
xrx.mvc.Component.prototype.getBindId = function() {
  return this.getElement().getAttribute('data-xrx-bind');
};



/**
 * Returns the source URI found in the component's data-xrx-src attribute.
 * @return {?string} The source URI.
 */
xrx.mvc.Component.prototype.getSrcUri = function() {
  return this.getElement().getAttribute('data-xrx-src');
};



/**
 * Returns the bind referenced by the component.
 * @return {?xrx.mvc.Bind} The bind.
 */
xrx.mvc.Component.prototype.getBind = function() {
  return xrx.mvc.getModelComponent(this.getBindId());
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
