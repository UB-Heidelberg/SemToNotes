***REMOVED***
***REMOVED*** @fileoverview A collection of custom XRX++ XPath functions.
***REMOVED***

goog.provide('xrx.func');


goog.require('xrx.mvc');
goog.require('xrx.Util');
goog.require('xrx.xpath');
goog.require('xrx.xpath.DataType');
goog.require('xrx.xpath.FunctionCall');
goog.require('xrx.xpath.NodeSet');



xrx.xpath.declareNamespace('xrx', 'http://www.monasterium.net/NS/xrx');



xrx.func = {
  INSTANCE: xrx.xpath.FunctionCall.createFunc('xrx:instance',
      xrx.xpath.DataType.NODESET, true, true, true,
      function(ctx, expr) {
        var nodeset = new xrx.xpath.NodeSet();
        var instance = expr.evaluate(ctx);
        nodeset.add(xrx.mvc.getModelComponent(instance).getDocument());
        return nodeset;
      }, 1, 1),
  UUID: xrx.xpath.FunctionCall.createFunc('xrx:uuid',
      xrx.xpath.DataType.STRING, true, true, true,
      function(ctx, expr) {
        return xrx.Util.createUUID();
      }, 0, 0)
***REMOVED***
