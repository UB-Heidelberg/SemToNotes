/**
 * @fileoverview
 */

goog.provide('xrx.mvc.Mvc');



goog.require('goog.object');



/**
 * @constructor
 */
xrx.mvc.Mvc = function() {};



xrx.mvc.Mvc.MODEL = 'model';



xrx.mvc.Mvc.VIEW = 'view';



xrx.mvc.Mvc[xrx.mvc.Mvc.MODEL] = {};



xrx.mvc.Mvc[xrx.mvc.Mvc.VIEW] = {};



xrx.mvc.Mvc.addComponent = function(id, component, mv) {
  xrx.mvc.Mvc[mv][id] = component;
};



xrx.mvc.Mvc.addModelComponent = function(id, component) {
  xrx.mvc.Mvc.addComponent(id, component, xrx.mvc.Mvc.MODEL);
};



xrx.mvc.Mvc.addViewComponent = function(id, component) {
  xrx.mvc.Mvc.addComponent(id, component, xrx.mvc.Mvc.VIEW);
};



xrx.mvc.Mvc.getComponent = function(id) {
  return xrx.mvc.Mvc[xrx.mvc.MODEL][id] ||
      xrx.mvc.Mvc[xrx.mvc.Mvc.VIEW][id];
};



xrx.mvc.Mvc.getModelComponent = function(id) {
  return xrx.mvc.Mvc[xrx.mvc.Mvc.MODEL][id];
};



xrx.mvc.Mvc.getViewComponent = function(id) {
  return xrx.mvc.Mvc[xrx.mvc.Mvc.VIEW][id];
};



xrx.mvc.Mvc.removeViewComponent = function(key) {
  goog.object.remove(xrx.mvc.Mvc[xrx.mvc.Mvc.VIEW], key);
};



xrx.mvc.Mvc.getComponents = function() {
  // TODO
};



xrx.mvc.Mvc.getModelComponents = function() {
  return xrx.mvc.Mvc[xrx.mvc.Mvc.MODEL]
};



xrx.mvc.Mvc.getViewComponents = function() {
  return xrx.mvc.Mvc[xrx.mvc.Mvc.VIEW]
};



xrx.mvc.Mvc.getInstanceDefault = function() {
  var instance;

  for(var i in xrx.mvc.Mvc[xrx.mvc.Mvc.MODEL]) {
    var component = xrx.mvc.Mvc[xrx.mvc.Mvc.MODEL][i];
    if (component instanceof xrx.mvc.Instance) {
      instance = component;
      break;
    }
  }

  return instance;
};
