***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.mvc.Mvc');



goog.require('xrx.mvc.Instance');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc.Mvc = function() {***REMOVED***



xrx.mvc.Mvc[xrx.mvc.Mvc.MODEL] = {***REMOVED***



xrx.mvc.Mvc[xrx.mvc.Mvc.VIEW] = {***REMOVED***



xrx.mvc.Mvc.addComponent = function(id, component, mv) {
  xrx.mvc.Mvc[mv][id] = component;
***REMOVED***



xrx.mvc.Mvc.addModelComponent = function(id, component) {
  xrx.mvc.Mvc.addComponent(id, component, xrx.mvc.Mvc.MODEL);
***REMOVED***



xrx.mvc.Mvc.addComponentView = function(id, component) {
  xrx.mvc.Mvc.addComponent(id, component, xrx.mvc.Mvc.VIEW);
***REMOVED***



xrx.mvc.Mvc.getComponent = function(id) {
  return xrx.mvc.Mvc[xrx.mvc.MODEL][id] ||
      xrx.mvc.Mvc[xrx.mvc.Mvc.VIEW][id];
***REMOVED***



xrx.mvc.Mvc.getModelComponent = function(id) {
  return xrx.mvc.Mvc[xrx.mvc.Mvc.MODEL][id];
***REMOVED***



xrx.mvc.Mvc.getComponentView = function(id) {
  return xrx.mvc.Mvc[xrx.mvc.Mvc.VIEW][id];
***REMOVED***



xrx.mvc.Mvc.getComponents = function() {
  // TODO
***REMOVED***



xrx.mvc.Mvc.getModelComponents = function() {
  return xrx.mvc.Mvc[xrx.mvc.Mvc.MODEL]
***REMOVED***



xrx.mvc.Mvc.getComponentViews = function() {
  return xrx.mvc.Mvc[xrx.mvc.Mvc.VIEW]
***REMOVED***



xrx.mvc.Mvc.getInstanceDefault = function() {
  var instance;

  for(var i in xrx.mvc.Mvc) {
    var component = xrx.mvc.Mvc[i];
    if (component instanceof xrx.mvc.Instance) {
      instance = component;
      break;
    }
  }

  return instance;
***REMOVED***
