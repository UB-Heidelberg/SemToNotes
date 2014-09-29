/**
 * @fileoverview The XRX++ main class.
 */

goog.provide('xrx');



goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.labs.net.xhr');
goog.require('xrx.func');
goog.require('xrx.bind');
goog.require('xrx.console');
goog.require('xrx.instance');
goog.require('xrx.model');
goog.require('xrx.output');
goog.require('xrx.repeat');
goog.require('xrx.view');
goog.require('xrx.wysiwym');
goog.require('xrx.wysiwym.input');
goog.require('xrx.wysiwym.richxml');
goog.require('xrx.wysiwym.textarea');



xrx.install_ = function(className) {
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
    var cmpClass = classFromClassName(className);

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
  
};


xrx.installModel = function() {

  for(var i = 0, len = xrx.model.classes.length; i < len; i++) {
    xrx.install_(xrx.model.classes[i]);
  }
};


xrx.installView = function() {

  for(var i = 0, len = xrx.view.classes.length; i < len; i++) {
    xrx.install_(xrx.view.classes[i]);
  }
};


xrx.installInstances = function() {
  var elements = goog.dom.getElementsByClass('xrx-instance');
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

  var instanceReady = goog.result.combine.apply(goog.global, requests);

  goog.result.waitOnSuccess(instanceReady, function(results) {

    goog.array.forEach(results, function(result, num) {
      instances[num].recalculate(new String(result.getValue()));
      xrx.model.addComponent(instances[num].getId(), instances[num]);
    });

    xrx.installModel();
    xrx.installView();
  });

  if (requests.length === 0) {
    xrx.installModel();
    xrx.installView();
  };
};


xrx.install = function() {
  xrx.installInstances();
};

