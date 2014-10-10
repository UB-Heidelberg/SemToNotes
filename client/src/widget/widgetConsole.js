/**
 * @fileoverview Class implements a XML console to pretty
 * print XML instances in the browser.
 */

goog.provide('xrx.widget.Console');


goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.style');
goog.require('xrx.mvc.Cursor');
goog.require('xrx.xml.Serialize');
goog.require('xrx.token.StartTag');
goog.require('xrx.token.EndTag');
goog.require('xrx.mvc.ComponentView');
goog.require('xrx.mvc.Mvc');



/**
 * @constructor
 */
xrx.widget.Console = function(element) {

  this.tabSize_ = 2;

  goog.base(this, element);
};
goog.inherits(xrx.widget.Console, xrx.mvc.ComponentView);



xrx.widget.Console.prototype.createDom = function() {
  goog.style.setStyle(this.element_, 'white-space', 'pre-wrap');
  goog.style.setStyle(this.element_, 'white-space', '-moz-pre-wrap');
  goog.style.setStyle(this.element_, 'white-space', '-o-pre-wrap');
  goog.style.setStyle(this.element_, 'word-wrap', 'break-word');
};



xrx.widget.Console.prototype.eventBeforeChange = function() {};



xrx.widget.Console.prototype.eventFocus = function() {};



xrx.widget.Console.prototype.getValue = function() {};



xrx.widget.Console.prototype.setFocus = function() {};



xrx.widget.Console.prototype.setValue = function(xml) {
  var cursor = xrx.mvc.Cursor.getNode(0);

  if (!cursor) {
    var text = xrx.xml.Serialize.indent.forward(xml, this.tabSize_, undefined, 30);
    goog.dom.setTextContent(this.getElement(), text);
  } else {
    var pilot = cursor.getInstance().getPilot();
    var token = cursor.getToken();
    var text = '';
    text += goog.string.trimRight(xrx.xml.Serialize.indent.backward(xml, this.tabSize_, token, 15));
    if (text.match('\n') && !text.match('\n').length < 15) text = '... ' + text;
    text += xrx.xml.Serialize.indent.forward(xml, this.tabSize_, token, 15);
    text += ' ...';

    goog.dom.setTextContent(this.element_, text);
  }
};


xrx.widget.Console.prototype.refresh = function() {
  var xml = this.getNode().getXml();
  this.setValue(xml);
};
