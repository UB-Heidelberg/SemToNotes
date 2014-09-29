/**
 * @fileoverview Class implements a XML console to pretty
 * print XML instances in the browser.
 */

goog.provide('xrx.console');


goog.require('goog.dom');
goog.require('goog.string');
goog.require('xrx.model');
goog.require('xrx.serialize');
goog.require('xrx.token.StartTag');
goog.require('xrx.token.EndTag');
goog.require('xrx.view');



/**
 * @constructor
 */
xrx.console = function(element) {



  goog.base(this, element);
};
goog.inherits(xrx.console, xrx.view);



xrx.console.prototype.createDom = function() {};



xrx.console.prototype.eventBeforeChange = function() {};



xrx.console.prototype.eventFocus = function() {};



xrx.console.prototype.getValue = function() {};



xrx.console.prototype.setFocus = function() {};



xrx.console.prototype.setValue = function(xml) {
  var cursor = xrx.model.cursor.getNode(0);

  if (!cursor) {
    var text = xrx.serialize.indent.forward(xml, 4, undefined, 30);
    if (xml.length > text.length) text += ' ...';

    goog.dom.setTextContent(this.getElement(), text);

  } else {
    var pilot = cursor.getInstance().getPilot();
    var token = cursor.getToken();
    var text = '';
    text += goog.string.trimRight(xrx.serialize.indent.backward(xml, 4, token, 15));
    if (text.match('\n') && !text.match('\n').length < 15) text = '... ' + text;
    text += xrx.serialize.indent.forward(xml, 4, token, 15);
    text += ' ...';

    goog.dom.setTextContent(this.getElement(), text);
  }
};


xrx.console.prototype.refresh = function() {
  var xml = this.getNode().getXml();

  this.setValue(xml);
};
