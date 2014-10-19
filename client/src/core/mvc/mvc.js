***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.mvc');



***REMOVED***
goog.require('goog.object');
goog.require('xrx.mvc.Components');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc = function() {***REMOVED***



***REMOVED*** @const***REMOVED*** xrx.mvc.MODEL = 'model';



***REMOVED*** @const***REMOVED*** xrx.mvc.VIEW = 'view';



***REMOVED***
***REMOVED*** Stack of model components.
***REMOVED***
xrx.mvc[xrx.mvc.MODEL] = {***REMOVED***



***REMOVED***
***REMOVED*** Stack of view components.
***REMOVED***
xrx.mvc[xrx.mvc.VIEW] = {***REMOVED***



xrx.mvc.registerComponent = function(htmlClassName, componentClass) {
  if (xrx.mvc.Components[htmlClassName] !== undefined) throw Error('Component <' + htmlClassName +
      '> already registered.');
  xrx.mvc.Components[htmlClassName] = componentClass;
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.mvc.addComponent_ = function(id, component, mv) {
  xrx.mvc[mv][id] = component;
***REMOVED***



***REMOVED***
***REMOVED*** Add a model component to the MVC stack.
***REMOVED***
xrx.mvc.addModelComponent = function(id, component) {
  xrx.mvc.addComponent_(id, component, xrx.mvc.MODEL);
***REMOVED***



***REMOVED***
***REMOVED*** Add a view component to the MVC stack.
***REMOVED***
xrx.mvc.addViewComponent = function(id, component) {
  xrx.mvc.addComponent_(id, component, xrx.mvc.VIEW);
***REMOVED***



xrx.mvc.getComponent = function(id) {
  return xrx.mvc[xrx.mvc.MODEL][id] ||
      xrx.mvc[xrx.mvc.VIEW][id];
***REMOVED***



xrx.mvc.getModelComponent = function(id) {
  return xrx.mvc[xrx.mvc.MODEL][id];
***REMOVED***



xrx.mvc.getViewComponent = function(id) {
  return xrx.mvc[xrx.mvc.VIEW][id];
***REMOVED***



xrx.mvc.getModelComponents = function() {
  return xrx.mvc[xrx.mvc.MODEL];
***REMOVED***



xrx.mvc.getViewComponents = function() {
  return xrx.mvc[xrx.mvc.VIEW];
***REMOVED***


xrx.mvc.hasComponent = function(id) {
  return !!xrx.mvc.getComponent(id);
***REMOVED***



xrx.mvc.removeModelComponent = function(id) {
  var component = xrx.mvc[xrx.mvc.MODEL][id];
  if (component) {
    component.mvcRemove();
    goog.object.remove(xrx.mvc[xrx.mvc.MODEL], id);
  }
***REMOVED***



xrx.mvc.removeModelComponents = function(parent) {
  goog.object.forEach(xrx.mvc[xrx.mvc.MODEL], function(component, id) {
    if (goog.dom.contains(parent, component.getElement()))
        if (parent !== component.getElement()) xrx.mvc.removeModelComponent(id);
  }, this);
***REMOVED***



xrx.mvc.removeViewComponent = function(id) {
  var component = xrx.mvc[xrx.mvc.VIEW][id];
  if (component) { 
    component.mvcRemove();
    goog.object.remove(xrx.mvc[xrx.mvc.VIEW], id);
  }
***REMOVED***



xrx.mvc.removeViewComponents = function(parent) {
  goog.object.forEach(xrx.mvc[xrx.mvc.VIEW], function(component, id) {
    if (goog.dom.contains(parent, component.getElement())) {
      if (parent !== component.getElement()) {
        xrx.mvc.removeViewComponent(id);
      }
    }
  }, this);
***REMOVED***



xrx.mvc.getInstanceDefault = function() {
  var instance;
  for(var i in xrx.mvc[xrx.mvc.MODEL]) {
    var component = xrx.mvc[xrx.mvc.MODEL][i];
    if (component instanceof xrx.mvc.Instance) {
      instance = component;
      break;
    }
  }
  return instance;
***REMOVED***
