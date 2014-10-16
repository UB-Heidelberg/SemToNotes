***REMOVED***
***REMOVED*** @fileoverview A class representing the controller of
***REMOVED*** the model-view-controller.
***REMOVED***

goog.provide('xrx.mvc.Controller');



goog.require('xrx.mvc.Components');
goog.require('xrx.mvc');
goog.require('xrx.node');
goog.require('xrx.node.Binary');
goog.require('xrx.rebuild');
goog.require('xrx.token');
goog.require('xrx.token.Tokens');
goog.require('xrx.xml.Update');



xrx.mvc.Controller = function() {***REMOVED***



xrx.mvc.Controller.INSERT = 'insert';



xrx.mvc.Controller.REMOVE = 'remove';



xrx.mvc.Controller.UPDATE = 'update';



xrx.mvc.Controller.currentOperation = '';



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.mvc.Controller.update = function(control, operation, token, update) {
  var node = control.getNode();
  var tok = token || node.getToken();

  var diff = xrx.xml.Update[operation](node.getInstance(), tok, update);

  if (node instanceof xrx.node.Binary) xrx.rebuild[operation](node.getInstance().getIndex(),
      tok, diff);

  xrx.mvc.Controller.mvcRefresh(control, diff, update);
***REMOVED***



xrx.mvc.Controller.removeTagLike = function(control) {
  var node = control.getNode();
  var token = node.getToken();
  xrx.mvc.Controller.currentOperation_ = xrx.mvc.Controller.REMOVE;
  switch(token.type()) {
  case xrx.token.EMPTY_TAG:
    xrx.mvc.Controller.removeEmptyTag(control, token);
    break;
  default:
    throw Error('Remove operation not supported for this token-type.');
    break;
  }
***REMOVED***



xrx.mvc.Controller.replaceValueLike = function(control, update) {
  var node = control.getNode();
  var token = node.getToken();
  var pilot = node.getInstance().getPilot();
  switch(node.getType()) {
  case xrx.node.ATTRIBUTE:
    var attrValue = new xrx.token.AttrValue(token.label().clone());
    attrValue = pilot.attrValue(node.parent_.getToken(), attrValue);
    xrx.mvc.Controller.replaceAttrValue(control, attrValue, update);
    break;
  default:
    throw Error('Value update not supported for this node-type.');
    break;
  }
***REMOVED***



xrx.mvc.Controller.replaceNotTag = function(control, token, update) {
  var node = control.getNode();
  var diff = xrx.xml.Update.replaceNotTag(node.getInstance(), token, update);
  if (node instanceof xrx.node.Binary) xrx.rebuild.replaceNotTag(node.getInstance().getIndex(),
      token, diff);
  xrx.mvc.Controller.mvcRefresh(control);
***REMOVED***



xrx.mvc.Controller.replaceAttrValue = function(control, token, update) {
  var node = control.getNode();
  var parent = node.getParent();
  var instance = node.getInstance();
  var diff = xrx.xml.Update.replaceAttrValue(instance, token, update);
  xrx.rebuild.replaceAttrValue(instance.getIndex(), token, diff);
  xrx.mvc.Controller.mvcRefresh(control, node);
  return diff;
***REMOVED***



xrx.mvc.Controller.insertNotTag = function(control, token, offset, update) {
  var node = control.getNode();
  var tok = token || node.getToken();

  var diff = xrx.xml.Update.insertNotTag(node.getInstance(), tok, offset, update);

  if (node instanceof xrx.node.Binary) xrx.rebuild.insertNotTag(node.getInstance().getIndex(),
      tok, diff);

  xrx.mvc.Controller.mvcRefresh(control, diff, update);
***REMOVED***



xrx.mvc.Controller.reduceNotTag = function(control, token, offset, length) {
  var node = control.getNode();
  var tok = token || node.getToken();

  var diff = xrx.xml.Update.reduceNotTag(node.getInstance(), tok, offset, length);

  //if (node instanceof xrx.node.Binary) xrx.rebuild.reduceNotTag(node.getInstance().getIndex(),
  //    tok, diff);

  xrx.mvc.Controller.mvcRefresh(control, diff, '');
***REMOVED***



xrx.mvc.Controller.insertEmptyTag = function(control, emptyTag) {
***REMOVED***



xrx.mvc.Controller.removeEmptyTag = function(control, token) {
  console.log(xrx.mvc.getComponent('i04').xml());
  var node = control.getNode();
  var diff = xrx.xml.Update.removeEmptyTag(node.getInstance(), token);
  console.log(xrx.mvc.getComponent('i04').xml());
  console.log(xrx.mvc.getComponent('i04') === node.getInstance());
  console.log(node.getInstance().getId());
  console.log(node.getInstance().xml());
  xrx.rebuild.removeEmptyTag(node.getInstance().getIndex(), token, diff);
  xrx.mvc.Controller.mvcRecalculate();
  xrx.mvc.Controller.mvcRefresh(control, node);
***REMOVED***



xrx.mvc.Controller.removeStartEndTag = function(control, token1, token2) {
  var node = control.getNode();

  var diff = xrx.xml.Update.removeStartEndTag(node.getInstance(), token1, token2);

  //if (node instanceof xrx.node.Binary) xrx.rebuild.removeStartEndTag(node.getInstance().getIndex(),
  //    token1, diff);

  xrx.mvc.Controller.mvcRefresh(control);
***REMOVED***



***REMOVED***
***REMOVED*** Recalculates all model components affected by the update.
***REMOVED***
xrx.mvc.Controller.mvcRecalculate = function() {
  var contr;
  for (var c in xrx.mvc.getModelComponents()) {
    contr = xrx.mvc.getModelComponent(c);
    if (contr.mvcRecalculate) contr.mvcRecalculate();
  }
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.mvc.Controller.mvcRefreshDynamicView_ = function(control) {
  var repeat = control.getRepeat();
  if (repeat) {
    if (xrx.mvc.Controller.currentOperation_ === xrx.mvc.Controller.REMOVE) {
      repeat.mvcRefresh();
    }
 ***REMOVED*****REMOVED***
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.mvc.Controller.mvcRefreshStaticView_ = function(control, node) {
  var contr;
  for (var c in xrx.mvc.getViewComponents()) {
    contr = xrx.mvc.getViewComponent(c);
    contr.mvcRefresh();
  }
***REMOVED***



***REMOVED***
***REMOVED*** Refreshes all view components affected by the update.
***REMOVED***
xrx.mvc.Controller.mvcRefresh = function(control, node) {
  xrx.mvc.Controller.mvcRefreshDynamicView_(control);
  xrx.mvc.Controller.mvcRefreshStaticView_(control, node);
***REMOVED***
