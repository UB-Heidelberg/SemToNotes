***REMOVED***
***REMOVED*** @fileoverview Utilities for XPath JSUnit tests.
***REMOVED***

goog.provide('xrx.xpath.Test');



***REMOVED***
goog.require('goog.testing.jsunit');
goog.require('xrx');
goog.require('xrx.mvc');
goog.require('xrx.mvc.Components');
goog.require('xrx.mvc.Instance');
goog.require('xrx.node');
***REMOVED***
goog.require('xrx.xpath');



xrx.xpath.Test = {***REMOVED***



xrx.xpath.Test.query_ = function(expression) {
  var element = goog.dom.createElement('div');
  goog.dom.setTextContent(element, '<dummy/>');
  var instance = new xrx.mvc.Instance(element);
  var node = new xrx.node.DocumentS(instance.getId());
  return xrx.xpath.evaluate(expression, node, null, xrx.xpath.XPathResultType.ANY_TYPE);
***REMOVED***



xrx.xpath.Test.assertEquals = function(expected, expression) {
  var result = xrx.xpath.Test.query_(expression);
  switch (result.resultType) {
  case xrx.xpath.XPathResultType.NUMBER_TYPE:
    assertEquals(expected, result.numberValue);
    break;
  case xrx.xpath.XPathResultType.STRING_TYPE:
    console.log(result.stringValue);
    assertEquals(expected, result.stringValue);
    break;
  case xrx.xpath.XPathResultType.BOOLEAN_TYPE:
    assertEquals(expected, result.booleanValue);
    break;
  default:
    assertEquals('Missing XPath Result Type', '');
    break;
  }
***REMOVED***



xrx.xpath.Test.assertTrue = function(test, expression) {
  var result = xrx.xpath.Test.query_(expression);
  switch (result.resultType) {
  case xrx.xpath.XPathResultType.NUMBER_TYPE:
    assertTrue(test(result.numberValue));
    break;
  case xrx.xpath.XPathResultType.STRING_TYPE:
    assertTrue(test(result.stringValue));
    break;
  case xrx.xpath.XPathResultType.BOOLEAN_TYPE:
    assertTrue(test(result.booleanValue));
    break;
  default:
    assertTrue('Missing XPath Result Type', '');
    break;
  }
***REMOVED***
