/**
 * @fileoverview A class representing the controller of
 * the model-view-controller.
 */

goog.provide('xrx.mvc.Controller');



goog.require('xrx.mvc.Components');
goog.require('xrx.mvc.Mvc');
goog.require('xrx.node');
goog.require('xrx.node.Binary');
goog.require('xrx.rebuild');
goog.require('xrx.token');
goog.require('xrx.token.Tokens');
goog.require('xrx.xml.Update');



xrx.mvc.Controller = function() {};



xrx.mvc.Controller.INSERT = 'insert';



xrx.mvc.Controller.REMOVE = 'remove';



xrx.mvc.Controller.UPDATE = 'update';



xrx.mvc.Controller.currentOperation = '';



/**
 * 
 */
xrx.mvc.Controller.update = function(control, operation, token, update) {
  var node = control.getNode();
  var tok = token || node.getToken();

  var diff = xrx.xml.Update[operation](node.getInstance(), tok, update);

  if (node instanceof xrx.node.Binary) xrx.rebuild[operation](node.getInstance().getIndex(),
      tok, diff);

  xrx.mvc.Controller.refresh(control, diff, update);
};



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
};



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
};



xrx.mvc.Controller.replaceNotTag = function(control, token, update) {
  var node = control.getNode();
  var diff = xrx.xml.Update.replaceNotTag(node.getInstance(), token, update);
  if (node instanceof xrx.node.Binary) xrx.rebuild.replaceNotTag(node.getInstance().getIndex(),
      token, diff);
  xrx.mvc.Controller.refresh(control);
};



xrx.mvc.Controller.replaceAttrValue = function(control, token, update) {
  var node = control.getNode();
  var parent = node.getParent();
  var instance = node.getInstance();
  var diff = xrx.xml.Update.replaceAttrValue(instance, token, update);
  xrx.rebuild.replaceAttrValue(instance.getIndex(), token, diff);
  xrx.mvc.Controller.refresh(control, node);
  return diff;
};



xrx.mvc.Controller.insertNotTag = function(control, token, offset, update) {
  var node = control.getNode();
  var tok = token || node.getToken();

  var diff = xrx.xml.Update.insertNotTag(node.getInstance(), tok, offset, update);

  if (node instanceof xrx.node.Binary) xrx.rebuild.insertNotTag(node.getInstance().getIndex(),
      tok, diff);

  xrx.mvc.Controller.refresh(control, diff, update);
};



xrx.mvc.Controller.reduceNotTag = function(control, token, offset, length) {
  var node = control.getNode();
  var tok = token || node.getToken();

  var diff = xrx.xml.Update.reduceNotTag(node.getInstance(), tok, offset, length);

  //if (node instanceof xrx.node.Binary) xrx.rebuild.reduceNotTag(node.getInstance().getIndex(),
  //    tok, diff);

  xrx.mvc.Controller.refresh(control, diff, '');
};



xrx.mvc.Controller.removeEmptyTag = function(control, token) {
  var node = control.getNode();
  var diff = xrx.xml.Update.removeEmptyTag(node.getInstance(), token);
  xrx.rebuild.removeEmptyTag(node.getInstance().getIndex(), token, diff);
  xrx.mvc.Controller.recalculate();
  xrx.mvc.Controller.refresh(control, node);
};



xrx.mvc.Controller.removeStartEndTag = function(control, token1, token2) {
  var node = control.getNode();

  var diff = xrx.xml.Update.removeStartEndTag(node.getInstance(), token1, token2);

  //if (node instanceof xrx.node.Binary) xrx.rebuild.removeStartEndTag(node.getInstance().getIndex(),
  //    token1, diff);

  xrx.mvc.Controller.refresh(control);
};



/**
 * Recalculates all model components affected by the update.
 */
xrx.mvc.Controller.recalculate = function() {
  var contr;
  for (var c in xrx.mvc.Mvc.getModelComponents()) {
    contr = xrx.mvc.Mvc.getModelComponent(c);
    if (contr instanceof xrx.mvc.Bind) {
      contr.recalculate();
    }
  }
};



/**
 * @private
 */
xrx.mvc.Controller.refreshDynamicView_ = function(control) {
  var repeat = control.getRepeat();
  if (repeat) {
    if (xrx.mvc.Controller.currentOperation_ === xrx.mvc.Controller.REMOVE) {
      xrx.mvc.Mvc.removeViewComponent(control.getId());
      repeat.refresh();
    }
  };
};



/**
 * @private
 */
xrx.mvc.Controller.refreshStaticView_ = function(control, node) {
  var nIter;
  var contr;
  for (var c in xrx.mvc.Mvc.getViewComponents()) {
    console.log(c);
    contr = xrx.mvc.Mvc.getViewComponent(c);
    contr && !(contr instanceof xrx.mvc.Repeat) ? nIter = contr.getNode() : nIter = undefined;
    if (contr && nIter && node && node.getInstance() === nIter.getInstance()) {
      if (nIter.isSameAs(node) && c != control.getId()) {
        contr.refresh();
      } else if (node.getLabel().isDescendantOf(nIter.getLabel())
          && c != control.getId()) {
        contr.refresh();
      } else {}
    }
  }
};



/**
 * Refreshes all view components affected by the update.
 */
xrx.mvc.Controller.refresh = function(control, node) {
  xrx.mvc.Controller.refreshDynamicView_(control);
  xrx.mvc.Controller.refreshStaticView_(control, node);
};
