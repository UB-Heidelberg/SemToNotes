/**
 * @fileoverview A class representing an event-target. This
 * class is introduced (in addition to goog.event.EventTarget)
 * since we sometimes want to offer events for external JavaScript
 * classes such as jQuery or Angular that do not know about
 * Google Closure event handling.
 */

goog.provide('xrx.EventTarget');



goog.require('goog.string');



/**
 * A class representing an event-target.
 * @constructor
 */
xrx.EventTarget = function() {};



/**
 * Dispatch an event to a foreign JavaScript application. The function only
 * applies the event if the foreign JavaScript object implements
 * an according event handler.
 * @param {string} eventType The name of the event. Must start with prefix "event*".
 * @param {?Object} opt_eventTarget The object used to apply the event.
 *   Defaults to the "this" object.  
 */
xrx.EventTarget.prototype.dispatchExternal = function(eventType, opt_eventTarget) {
  if (!goog.string.startsWith(eventType, 'event')) throw Error('Invalid event-type "' +
      '". Prefix "event*" expected.');
  var target;
  opt_eventTarget === undefined ? target = this : target = opt_eventTarget;
  if (target[eventType]) {
    if (arguments.length <= 2) {
      target[eventType].apply(target);
    } else {
      target[eventType].apply(target, this.argsArray_(arguments));
    }
  }
};



/**
 * @private
 */
xrx.EventTarget.prototype.argsArray_ = function(args) {
  var length = args.length - 2;
  var arr = new Array(length);
  for (var i = 0; i < length; i++) {
    arr[i] = args[i + 2];
  };
  return arr;
}; 
