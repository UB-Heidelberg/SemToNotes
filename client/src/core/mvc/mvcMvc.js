/**
 * @fileoverview The MVC main class.
 */

goog.provide('xrx.mvc.Mvc');



goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.dom');
goog.require('goog.dom.dataset');
goog.require('goog.json');
goog.require('goog.labs.net.xhr');
goog.require('goog.ui.IdGenerator');
goog.require('goog.Promise');
goog.require('xrx.func');
goog.require('xrx.mvc');
goog.require('xrx.node.Nodes');
goog.require('xrx.mvc.Components');
goog.require('xrx.widget.Widgets');
goog.require('xrx.xpath');



/**
 * @constructor
 */
xrx.mvc.Mvc = function() {

  this.install();
};
goog.addSingletonGetter(xrx.mvc.Mvc);



/**
 * @private
 */
xrx.mvc.Mvc.idGenerator = goog.ui.IdGenerator.getInstance();



/**
 * @private
 */
xrx.mvc.Mvc.prototype.installComponents_ = function(obj, opt_context) {
  var elements;
  var element;
  goog.object.forEach(obj, function(component, key, o) {
    elements = goog.dom.getElementsByClass(key, opt_context);
    for (var i = 0; i < elements.length; i++) {
      element = elements[i];
      if (!element.id || element.id === '') element.id =
          xrx.mvc.Mvc.idGenerator.getNextUniqueId();
      if (!xrx.mvc.hasComponent(element.id)) new obj[key](element);
    }
  });
};



/**
 * @private
 */
xrx.mvc.Mvc.prototype.installMvcComponents_ = function(opt_context) {
  this.installComponents_(xrx.mvc.Components, opt_context);
};



/**
 * @private
 */
xrx.mvc.Mvc.prototype.installWidgetComponents_ = function(opt_context) {
  this.installComponents_(xrx.widget.Widgets, opt_context);
};



/**
 * @private
 */
xrx.mvc.Mvc.prototype.installComponents__ = function(opt_context) {
  this.installMvcComponents_(opt_context);
  this.installWidgetComponents_(opt_context);
};



/**
 * @private
 */
xrx.mvc.Mvc.prototype.installInstances_ = function(opt_context) {
  var self = this;
  var elements = goog.dom.getElementsByClass('xrx-mvc-instance', opt_context);
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
      self.installComponents__(opt_context);
    }
  });

  if (requests.length === 0) {
    self.installComponents__(opt_context);
  };
};



/**
 * 
 */
xrx.mvc.Mvc.prototype.install = function(opt_context) {
  this.installInstances_(opt_context);
};
