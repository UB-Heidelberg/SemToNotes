
goog.provide('xrx.demo.example');



goog.require('goog.dom.classes');
goog.require('goog.dom.DomHelper');
goog.require('goog.net.XhrIo');
goog.require('xrx.demo');
goog.require('xrx.drawing.Drawing');



xrx.demo.example = function() {};



xrx.demo.example.installBacklink_ = function(exampleId) {
  var content = goog.dom.getElement('content');
  var backlink = goog.dom.htmlToDocumentFragment(
      '<a class="glyphicon glyphicon-arrow-left" href="../examples.html#' +
      exampleId + '"><strong> back</strong></a>');
  goog.dom.insertChildAt(content, backlink, 0);
};



xrx.demo.example.installSource_ = function(exampleId) {
  var content = goog.dom.getElement('content');
  var wrapper = goog.dom.createElement('div');
  var heading = goog.dom.htmlToDocumentFragment('<h3>Usage</h3>');
  var pre = goog.dom.createElement('pre');
  var src = exampleId + '.js';
  var viewSource = goog.dom.htmlToDocumentFragment(
      '<a href="' + src + '">View Source &raquo;</a>');
  goog.dom.append(wrapper, [heading, pre, viewSource]);
  goog.dom.append(content, wrapper);
  goog.net.XhrIo.send(src, function(e) {
    var source = e.target.getResponseText();
    goog.dom.setTextContent(pre, source);
    goog.dom.classes.add(pre, 'lang-js');
    goog.dom.classes.add(pre, 'prettyprint');
    PR.prettyPrint();
  });
};



xrx.demo.example.install = function(exampleId) {
  xrx.demo.install('linkExample', '../../../');
  xrx.demo.example.installBacklink_(exampleId);
  xrx.demo.example.installSource_(exampleId);
};
