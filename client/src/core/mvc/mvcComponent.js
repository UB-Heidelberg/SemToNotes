/**
 * @fileoverview An abstract class representing
 *   a component of the model-view-controller.
 */

goog.provide('xrx.mvc.Component');



goog.require('goog.array');
goog.require('goog.dom.DomHelper');
goog.require('goog.dom.dataset');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.IdGenerator');
goog.require('xrx.mvc.Validate');
goog.require('xrx.mvc.Xpath');
goog.require('xrx.xpath');



/**
 * Constructs a new model-view-controller component.
 * @constructor
 */
xrx.mvc.Component = function(element, uidl) {

  this.element_ = element;

  /**
   * @type xrx.mvc.Xpath
   */
  this.xpath_;

  this.uidl = uidl;

  goog.base(this);

  this.validate();

  this.addComponent();

  this.compileXpath();

  this.createDom();
};
goog.inherits(xrx.mvc.Component, xrx.mvc.Validate);



xrx.mvc.Component.prototype.getXpath = function() {
  return this.xpath_;
};



xrx.mvc.Component.prototype.compileXpath = function() {
  var debug = false;
  var ref = this.getDataset('xrxRef');
  if (ref) this.xpath_ = new xrx.mvc.Xpath(ref, debug);
};



xrx.mvc.Component.prototype.addComponent = function() {
  xrx.mvc.addComponent(this.getId(), this);
};



/**
 * 
 */
xrx.mvc.Component.prototype.createDom = goog.abstractMethod;



/**
 * Unique ID of the component, lazily initialized in {@link
 * xrx.mvc.Component#getId}.
 * @type {?string}
 * @private
 */
xrx.mvc.Component.prototype.id_ = null;




/**
 * Returns the component's element.
 * @return {Element} The element for the component.
 */
xrx.mvc.Component.prototype.getElement = function() {
  return this.element_;
};



/**
 *
 */
xrx.mvc.Component.prototype.getDataset = function(key, opt_element) {
  var element = opt_element || this.element_;
  var shortened;
  var standard = goog.dom.dataset.get(element, key);
  if (!standard) {
    shortened = key.replace(/^xrx/, '');
    shortened = shortened.charAt(0).toLowerCase() + shortened.slice(1);
    return goog.dom.dataset.get(element, shortened);
  } else {
    return standard;
  }
};



/**
 * Returns the unique ID of this component. If the instance
 * doesn't already have an ID generate one on the fly.
 * @return {string} Unique ID.
 */
xrx.mvc.Component.prototype.getId = function() {
  if (!this.id_) {
    if (this.element_.id && this.element_.id !== '') {
      this.id_ = this.element_.id;
    } else {
      this.id_ = goog.ui.IdGenerator.getInstance().getNextUniqueId();
      this.element_.id = this.id_;
    }
  }
  return this.id_;
};



/**
 * Whether the component has its own context other than a
 * repeat context.
 * @return {boolean}
 */
xrx.mvc.Component.prototype.hasContext = function() {
  return !!this.getContext;
};



/**
 * Returns the parent repeat component of the component.
 * @return {xrx.mvc.Repeat} The repeat component.
 */
xrx.mvc.Component.prototype.getRepeat = function() {
  var element = goog.dom.getAncestorByClass(this.element_, 'xrx-repeat');
  return element ? xrx.mvc.getViewComponent(element.id) : undefined;
};



/**
 * Returns the index of a dynamically repeated component.
 * @return {number} The index.
 */
xrx.mvc.Component.prototype.getRepeatIndex = function(opt_element) {
  var value;
  var element = opt_element || this.element_;
  var repeatItem = goog.dom.getAncestorByClass(element,
      'xrx-repeat-item');
  if (goog.dom.classes.has(element, 'xrx-repeat-item')) {
    value = this.getDataset('xrxRepeatIndex');
  } else if (repeatItem) {
    value = this.getDataset('xrxRepeatIndex', repeatItem);
  } else {
    throw Error('Repeat item could not be found.');
  }
  return parseInt(value);
}; 



/**
 * Returns the XPath expression found in the component's data-xrx-ref attribute.
 * @return {string} The expression.
 */
xrx.mvc.Component.prototype.getRefExpression = function(opt_dataset) {
  var dataset = opt_dataset || 'xrxRef';
  return this.getDataset(dataset);
};



/**
 * Returns the bind ID found in the component's data-xrx-bind attribute.
 * @return {string} The bind ID.
 */
xrx.mvc.Component.prototype.getBindId = function(opt_dataset) {
  var dataset = opt_dataset || 'xrxBind';
  return this.getDataset(dataset);
};



/**
 * Returns the source URI found in the component's data-xrx-src attribute.
 * @return {?string} The source URI.
 */
xrx.mvc.Component.prototype.getSrcUri = function(opt_dataset) {
  var dataset = opt_dataset || 'xrxSrc';
  return this.getDataset(dataset);
};



/**
 * Returns the bind component referenced by the component.
 * @return {xrx.mvc.Bind} The bind component.
 */
xrx.mvc.Component.prototype.getBind = function(opt_dataset) {
  return xrx.mvc.getModelComponent(this.getBindId(opt_dataset));
};



/**
 * Returns the n'th node held by the component by means of a
 * bind expression.
 * @return {xrx.node.Node} The node.
 */
xrx.mvc.Component.prototype.getNodeWithBind = function(num, opt_dataset) {
  return this.getBind(opt_dataset).getNode(num);
};



/**
 * Returns the value held by the component by means of a bind expression.
 * @return {String} The string value.
 */
xrx.mvc.Component.prototype.getStringValueWithBind = function(num, opt_dataset) {
  return this.getBind(opt_dataset).getStringValue();
};



/**
 * Returns the node held by the component by means of a repeat component
 * and a ref expression.
 * @return {xrx.node.Node} The node.
 */
xrx.mvc.Component.prototype.getResultWithRefAndRepeat = function(type, opt_dataset, opt_context) {
  var repeat = this.getRepeat();
  var context = repeat.getNode(this.getRepeatIndex());
  if (!context) return;
  // TODO: Node conversion function
  var nodeS = new xrx.node.ElementS(context.getDocument(), context.getToken());
  return this.xpath_.evaluate(nodeS, type);
};



/**
 * Returns the node held by the component by means of a context node
 * and a ref expression.
 * @return {xrx.node.Node} The node.
 */
xrx.mvc.Component.prototype.getResultWithRefAndContext = function(type, opt_dataset, opt_context) {
  var context = this.getContext();
  if (!context) return;
  // TODO: Node conversion function
  var nodeS = new xrx.node.ElementS(context.getDocument(), context.getToken());
  return this.xpath_.evaluate(nodeS, type);
};



/**
 * @private
 */
xrx.mvc.Component.prototype.getResult_ = function(num, type, opt_dataset) {
  var result;
  var n = num || 0;
  if (this.hasContext()) {
    result = this.getResultWithRefAndContext(type, opt_dataset, this.getContext());
  } else if (this.getRefExpression(opt_dataset)) {
    result = this.getResultWithRefAndRepeat(type, opt_dataset);
  } else {
    throw Error('A component must define a data-xrx-bind or a data-xrx-ref ' +
        'attribute.');
  }
  return result;
};



/**
 * Returns the node referenced by the component.
 * @return {xrx.node.Node} The node.
 */
xrx.mvc.Component.prototype.getNode = function(num, opt_dataset) {
  var n = num || 0;
  var result;
  if (this.getBind(opt_dataset)) {
    return this.getNodeWithBind(n, opt_dataset)
  } else {
    result = this.getResult_(n, xrx.xpath.XPathResultType.ANY_TYPE,
        opt_dataset);
    return result ? result.iterateNext() : undefined;
  }
};



/**
 * Returns the string-value referenced by the component.
 * @return {string} The string-value.
 */
xrx.mvc.Component.prototype.getValue = function(opt_dataset) {
  if (this.getBind(opt_dataset)) {
    return this.getStringValueWithBind(opt_dataset);
  } else {
    return this.getResult_(0, xrx.xpath.XPathResultType.STRING_TYPE,
        opt_dataset).stringValue;
  }
};



/**
 * @private
 */
xrx.mvc.Component.prototype.isVoidElement_ = function() {
  var voidElements = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr',
      'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr',
      /* not void but special */ 'select', 'textarea'];
  var tagName = this.element_.tagName.toLowerCase();
  return goog.array.contains(voidElements, tagName);
};



xrx.mvc.Component.prototype.getParentComponent = function(className) {
  var datasetFor = this.getDataset('xrxFor');
  var element;
  if (datasetFor) {
    element = goog.dom.getElement(datasetFor);
  } else {
    element = goog.dom.getAncestorByClass(this.element_, className);
  }
  return element ? xrx.mvc.getComponent(element.id) : undefined;
};



xrx.mvc.Component.prototype.getActionElements = function(eventName) {
  var self = this;
  if (this.isVoidElement_()) {
    var elmnt = this.element_;
    var elmnts = [];
    while (elmnt = goog.dom.getNextElementSibling(elmnt)) {
      if (goog.dom.classes.has(elmnt, 'xrx-action') &&
          self.getDataset('xrxEvent', elmnt) === eventName) {
          elmnts.push(elmnt);
      };
      if (!goog.dom.classes.has(elmnt, 'xrx-action')) {
        break;
      };
    };
    return elmnts;
  } else {
    return goog.dom.findNodes(this.element_, function(node) {
      return goog.dom.isElement(node) && goog.dom.classes.has(node, 'xrx-action') &&
          goog.dom.getParentElement(node) === self.element_ &&
          self.getDataset('xrxEvent', node) === eventName;
    });
  }
  return [];
};



xrx.mvc.Component.prototype.registerEvent = function(event) {
  var self = this;
  var listen = function(mvcEvent, opt_mvcInternal) {
    goog.events.listen(self.element_, event, function(e) {
      var repeat = self.getRepeat();
      if (repeat) repeat.setIndexElement(self.element_);
      e.preventDefault();
      if (self[opt_mvcInternal]) self[opt_mvcInternal]();
      self.dispatch(mvcEvent);
    });
  };
  switch(event) {
  case goog.events.EventType.CLICK:
    listen('xrx-event-click');
    break;
  case goog.events.EventType.INPUT:
    listen('xrx-event-input', 'mvcModelUpdateData');
    break;
  case goog.events.EventType.CHANGE:
    listen('xrx-event-change', 'mvcModelUpdateData');
    break;
  default:
    throw Error('Unknown event.');
    break;
  };
};



xrx.mvc.Component.prototype.dispatch = function(eventName) {
  goog.array.forEach(this.getActionElements(eventName), function(element) {
    xrx.mvc.getComponent(element.id).execute();
  });
};



xrx.mvc.Component.prototype.show = function(isShown) {
  var display = isShown ? 'block' : 'none';
  goog.style.setElementShown(this.element_, isShown);
  goog.style.setStyle(this.element_, 'display', display);
};
