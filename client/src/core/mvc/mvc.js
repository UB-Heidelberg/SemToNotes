***REMOVED***
***REMOVED*** @fileoverview The MVC main class.
***REMOVED***

goog.provide('xrx.mvc');



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
goog.require('xrx.mvc.Instance');
goog.require('xrx.widget.Widgets');
goog.require('xrx.xpath');



xrx.mvc.installComponents = function(obj) {
  var elements;
  goog.object.forEach(obj, function(component, key, o) {
    elements = goog.dom.getElementsByClass(key);
    for (var i = 0; i < elements.length; i++) {
      new obj[key](elements[i]);
    }
  });
***REMOVED***



xrx.mvc.installMvc = function() {
  xrx.mvc.installComponents(xrx.mvc.Components);
***REMOVED***



xrx.mvc.installWidgets = function() {
  xrx.mvc.installComponents(xrx.widget.Widgets);
***REMOVED***



xrx.mvc.installNamespaces = function() {
  var elements = goog.dom.getElementsByClass('xrx-mvc-namespaces');
  var prefix;
  var url;
  var attr;
  var json;
  goog.array.forEach(elements, function(e, i, a) {
    attr = goog.dom.dataset.get(e, 'xrxNamespaces');
    json = goog.json.parse(attr);
    for (var i in json) {
      xrx.xpath.declareNamespace(i, json[i]);
   ***REMOVED*****REMOVED***
  });
***REMOVED***



xrx.mvc.installInstances = function() {
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
      instance.recalculate();
    }
  });

  var instancesReady = goog.Promise.all(requests);

  instancesReady.then(function() {

    goog.array.forEach(requests, function(result, num) {
      instances[num].recalculate(new String(result.result_));
    });

    if (requests.length !== 0) {
      xrx.mvc.installMvc();
      xrx.mvc.installWidgets();
    }
  });

  if (requests.length === 0) {
    xrx.mvc.installMvc();
    xrx.mvc.installWidgets();
 ***REMOVED*****REMOVED***
***REMOVED***



xrx.mvc.install = function() {
  xrx.mvc.installNamespaces();
  xrx.mvc.installInstances();
***REMOVED***
