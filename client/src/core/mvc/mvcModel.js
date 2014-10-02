***REMOVED***
***REMOVED*** @fileoverview A class which represents the model of 
***REMOVED*** the model-view-controller.
***REMOVED***

goog.provide('xrx.model');



goog.require('xrx.component');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.model = function(element) {

***REMOVED***



  this.element_ = element;
***REMOVED***
goog.inherits(xrx.model, xrx.component);



xrx.model.prototype.recalculate = goog.abstractMethod;



xrx.model.classes = [
  'xrx-mvc-bind'
];



xrx.model.components_ = {***REMOVED***



xrx.model.addComponent = function(id, component) {
  xrx.model.components_[id] = component;
***REMOVED***



xrx.model.getComponent = function(id) {
  return xrx.model.components_[id];
***REMOVED***



xrx.model.getComponents = function() {
  return xrx.model.components_;
***REMOVED***



xrx.model.getInstanceDefault = function() {
  var instance;

  for(var i in xrx.model.components_) {
    var component = xrx.model.components_[i];
    if (component instanceof xrx.instance) {
      instance = component;
      break;
    }
  }

  return instance;
***REMOVED***



xrx.model.cursor = {***REMOVED***



xrx.model.cursor.node_ = [];



xrx.model.cursor.setNodes = function(nodes) {
  var n = xrx.model.cursor.node_;
  n.splice(0, n.length);

  for (var i = 0, len = nodes.length; i < len; i++) {
    n[i] = nodes[i];
  }
***REMOVED***



xrx.model.cursor.getNode = function(pos) {
  return xrx.model.cursor.node_[pos];
***REMOVED***

