/**
 * @fileoverview Class implements an XML console to pretty
 *     print XML instances in the browser.
 */

goog.provide('xrx.widget.Console');


goog.require('goog.dom.DomHelper');
goog.require('goog.string');
goog.require('goog.style');
goog.require('xrx.xml.Serialize');
goog.require('xrx.token.Tokens');
goog.require('xrx.mvc');
goog.require('xrx.mvc.ComponentView');
goog.require('xrx.mvc.Cursor');



/**
 * @constructor
 */
xrx.widget.Console = function(element) {

  this.tabSize_ = 2;

  this.maxLines_ = 50;

  goog.base(this, element);
};
goog.inherits(xrx.widget.Console, xrx.mvc.ComponentView);
xrx.mvc.registerComponent('xrx-widget-console', xrx.widget.Console);



xrx.widget.Console.prototype.createDom = function() {
  goog.style.setStyle(this.element_, 'white-space', 'pre-wrap');
  goog.style.setStyle(this.element_, 'white-space', '-moz-pre-wrap');
  goog.style.setStyle(this.element_, 'white-space', '-o-pre-wrap');
  goog.style.setStyle(this.element_, 'word-wrap', 'break-word');
};



xrx.widget.Console.prototype.getValue = function() {
  return goog.dom.getTextContent(this.element_);
};



xrx.widget.Console.prototype.setValue = function(xml) {
  var node = xrx.mvc.Cursor.getNode(0);
  if (!node) {
    var text = xrx.xml.Serialize.indent.forward(xml, this.tabSize_, undefined, this.maxLines_);
    goog.dom.setTextContent(this.element_, text);
  } else {
    var pilot = node.getInstance().getPilot();
    var token = node.getToken();
    var text = '';
    text += goog.string.trimRight(xrx.xml.Serialize.indent.backward(xml, this.tabSize_, token, this.maxLines_ / 2));
    text += xrx.xml.Serialize.indent.forward(xml, this.tabSize_, token, this.maxLines_ / 2);
    goog.dom.setTextContent(this.element_, text);
  }
};



/**
 *
 */
xrx.widget.Console.prototype.mvcRemove = function() {
  goog.dom.setTextContent(this.element_, '');
};



/**
 *
 */
xrx.widget.Console.prototype.mvcRefresh = function() {
  var node = this.getNode();
  var xml = node ? node.getXml() : '';
  this.setValue(xml);
};
