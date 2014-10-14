***REMOVED***
***REMOVED*** @fileoverview The MVC main class.
***REMOVED***

goog.provide('xrx.mvc.Mvc');



goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.dom');
goog.require('goog.dom.dataset');
goog.require('goog.json');
goog.require('goog.labs.net.xhr');
goog.require('goog.Promise');
goog.require('xrx.func');
***REMOVED***
goog.require('xrx.mvc.Components');
goog.require('xrx.widget.Widgets');
goog.require('xrx.xpath');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc.Mvc = function() {

  this.install_();
***REMOVED***
goog.addSingletonGetter(xrx.mvc.Mvc);



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.mvc.Mvc.prototype.installComponents_ = function(obj, opt_context) {
  var elements;
  goog.object.forEach(obj, function(component, key, o) {
    elements = goog.dom.getElementsByClass(key, opt_context);
    for (var i = 0; i < elements.length; i++) {
      new obj[key](elements[i]);
    }
  });
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.mvc.Mvc.prototype.installMvcComponents_ = function(opt_context) {
  this.installComponents_(xrx.mvc.Components, opt_context);
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.mvc.Mvc.prototype.installWidgetComponents_ = function(opt_context) {
  this.installComponents_(xrx.widget.Widgets, opt_context);
***REMOVED***



xrx.mvc.Mvc.prototype.installComponents = function(opt_context) {
  this.installMvcComponents_(opt_context);
  this.installWidgetComponents_(opt_context);
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.mvc.Mvc.prototype.installInstances_ = function() {
***REMOVED***
  var elements = goog.dom.getElementsByClass('xrx-mvc-instance');
  var requests = [];
  var instances = [];

  goog.array.forEach(elements, function(e, num) {
    var instance = new xrx.mvc.Instance(e);
    var srcUri = instance.getSrcUri();
    if (srcUri) {
      requests.push(goog.labs.net.xhr.get(srcUri));
      instances.push(instance);
    } else {
      instance.mvcRecalculate();
    }
  });

  var instancesReady = goog.Promise.all(requests);

  instancesReady.then(function() {
    goog.array.forEach(requests, function(result, num) {
      instances[num].setData(new String(result.result_));
    });
    if (requests.length !== 0) {
      self.installComponents();
  console.log(xrx.mvc.getViewComponents());
    }
  });

  if (requests.length === 0) {
    self.installComponents();
 ***REMOVED*****REMOVED***
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.mvc.Mvc.prototype.install_ = function() {
  this.installInstances_();
***REMOVED***
