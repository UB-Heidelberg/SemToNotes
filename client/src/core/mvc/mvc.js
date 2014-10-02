***REMOVED***
***REMOVED*** @fileoverview The MVC main class.
***REMOVED***

goog.provide('xrx.mvc');



goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.dataset');
goog.require('goog.json');
goog.require('goog.labs.net.xhr');
goog.require('goog.Promise');
goog.require('goog.result');
goog.require('xrx.widget.Canvas');
goog.require('xrx');
goog.require('xrx.func');
goog.require('xrx.mvc.Bind');
goog.require('xrx.console');
goog.require('xrx.instance');
goog.require('xrx.model');
goog.require('xrx.output');
goog.require('xrx.repeat');
goog.require('xrx.view');
goog.require('xrx.xpath');



xrx.mvc.install_ = function(className) {
  var element = goog.dom.getElementsByClass(className);

  var classFromClassName_ = function(obj, arr) {
    var next = obj[arr.shift()];

    return arr.length > 0 ? classFromClassName_(next, arr) : next;
  }

  var classFromClassName = function(className) {
    var arr = className.split('-');

    return classFromClassName_(window, arr);
  }

  for(var i = 0, len = element.length; i < len; i++) {
    var e = element[i];
    var cmpClass = xrx.mvc.Bind;

    if (!cmpClass) throw Error('Implementation of class <' + 
        className + '> could not be found.');

    var cmp = new cmpClass(e);

    if (cmp instanceof xrx.model) {
      if (!cmp.getSrcUri()) xrx.model.addComponent(cmp.getId(), cmp);
    } else if (cmp instanceof xrx.view) {
      xrx.view.addComponent(cmp.getId(), cmp);
    } else {
      throw Error('Components must either inherit ' + 
          'class xrx.view or class xrx.model');
    }
  }
  
***REMOVED***


xrx.mvc.installModel = function() {

  for(var i = 0, len = xrx.model.classes.length; i < len; i++) {
    xrx.mvc.install_(xrx.model.classes[i]);
  }
***REMOVED***


xrx.mvc.installView = function() {

  for(var i = 0, len = xrx.view.classes.length; i < len; i++) {
    xrx.mvc.install_(xrx.view.classes[i]);
  }
***REMOVED***



xrx.mvc.installModels = function() {
  var elements = goog.dom.getElementsByClass('xrx-mvc-model');
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
    var instance = new xrx.instance(e);
    var srcUri = instance.getSrcUri();
    if (srcUri) {
      requests.push(goog.labs.net.xhr.get(srcUri));
      instances.push(instance);
    } else {
      instance.recalculate();
      xrx.model.addComponent(instance.getId(), instance);
    }
  });

  var instancesReady = goog.Promise.all(requests);

  instancesReady.then(function() {

    goog.array.forEach(requests, function(result, num) {
      instances[num].recalculate(new String(result.result_));
      xrx.model.addComponent(instances[num].getId(), instances[num]);
    });

    xrx.mvc.installModel();
    xrx.mvc.installView();
  });

  if (requests.length === 0) {
    xrx.mvc.installModel();
    xrx.mvc.installView();
 ***REMOVED*****REMOVED***
***REMOVED***


xrx.mvc.install = function() {
  xrx.mvc.installModels();
  xrx.mvc.installInstances();
***REMOVED***
