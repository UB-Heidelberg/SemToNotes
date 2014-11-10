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
goog.require('goog.style');
goog.require('goog.ui.IdGenerator');
goog.require('goog.userAgent');
goog.require('goog.Promise');
goog.require('xrx.mvc');
goog.require('xrx.mvc.Components');
goog.require('xrx.widget.Widgets');



/**
 * @constructor
 */
xrx.mvc.Mvc = function() {};



/**
 * @private
 */
xrx.mvc.Mvc.idGenerator = goog.ui.IdGenerator.getInstance();



/**
 * @private
 */
xrx.mvc.Mvc.installComponents = function(opt_context) {
  var elements;
  var element;
  goog.object.forEach(xrx.mvc.Components, function(component, key, o) {
    elements = goog.dom.getElementsByClass(key, opt_context);
    for (var i = 0; i < elements.length; i++) {
      goog.dom.isNodeList(elements) ? element = elements.item(i) : element = elements[i];
      if (!element.id || element.id === '') element.id =
          xrx.mvc.Mvc.idGenerator.getNextUniqueId();
      if (!xrx.mvc.hasComponent(element.id)) new xrx.mvc.Components[key](element);
    }
  });
};



/**
 * @private
 */
xrx.mvc.Mvc.installInstances_ = function(opt_context) {
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
      xrx.mvc.Mvc.installComponents(opt_context);
    }
  });

  if (requests.length === 0) {
    xrx.mvc.Mvc.installComponents(opt_context);
  };
};



/**
 * 
 */
xrx.mvc.Mvc.install = function(opt_context) {
  xrx.mvc.Mvc.installInstances_(opt_context);

  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher(9)) {
    // IE 7 and IE 8 fix
    var divs = goog.dom.getElementsByTagNameAndClass('div', undefined, opt_context);
    var zIndex = 1000;
    goog.array.forEach(divs, function(e, i, a) {
      goog.style.setStyle(e, 'z-index', zIndex);
      zIndex -= 10;
    })
  };
};
