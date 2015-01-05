***REMOVED***
***REMOVED*** @fileoverview 
***REMOVED***

goog.provide('xrx.html5.Component');



goog.require('goog.dom.classes');
goog.require('goog.dom.dataset');
***REMOVED***
goog.require('xrx.mvc');
goog.require('xrx.mvc.ComponentView');



xrx.html5.Component = function(element) {

***REMOVED***

  this.first_ = true;

  this.registerEvents();
***REMOVED***
goog.inherits(xrx.html5.Component, xrx.mvc.ComponentView);



xrx.html5.Component.prototype.registerClick = function(element) {
  this.keyClick_ = goog.events.listen(this.element_, goog.events.EventType.CLICK, function(e) {
    e.preventDefault();
    xrx.mvc.getModelComponent(element.id).execute();
  }, false, this);
***REMOVED***



xrx.html5.Component.prototype.registerEvents = function() {
  var element;
  var ev;
  var actionElements = goog.dom.findNodes(this.element_, function(node) {
    return goog.dom.isElement(node) && goog.dom.classes.has(node, 'xrx-action');
  });
  for (var i = 0, len = actionElements.length; i < len; i++) {
    element = actionElements[i];
    ev = goog.dom.dataset.get(element, 'event');
    switch (ev) {
    case 'xrx-event-click':
      this.registerClick(element);
      break;
    default:
      throw Error('Unkown event "' + ev + '".');
      break; 
   ***REMOVED*****REMOVED***
 ***REMOVED*****REMOVED***
***REMOVED***
