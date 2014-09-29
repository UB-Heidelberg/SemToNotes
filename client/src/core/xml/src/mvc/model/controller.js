/**
 * @fileoverview A class representing the controller of
 * the model-view-controller.
 */

goog.provide('xrx.controller');


goog.require('xrx.nodeB');
goog.require('xrx.rebuild');
goog.require('xrx.update');



xrx.controller = function() {};



/**
 * 
 */
xrx.controller.update = function(control, operation, token, update) {
  var node = control.getNode();
  var tok = token || node.getToken();

  var diff = xrx.update[operation](node.getInstance(), tok, update);

  if (node instanceof xrx.nodeB) xrx.rebuild[operation](node.getInstance().getIndex(),
      tok, diff);

  xrx.controller.refresh(control, diff, update);
};



xrx.controller.replaceNotTag = function(control, token, update) {
  var node = control.getNode();

  var diff = xrx.update.replaceNotTag(node.getInstance(), token, update);

  if (node instanceof xrx.nodeB) xrx.rebuild.replaceNotTag(node.getInstance().getIndex(),
      token, diff);

  xrx.controller.refresh(control);
};



xrx.controller.insertNotTag = function(control, token, offset, update) {
  var node = control.getNode();
  var tok = token || node.getToken();

  var diff = xrx.update.insertNotTag(node.getInstance(), tok, offset, update);

  if (node instanceof xrx.nodeB) xrx.rebuild.insertNotTag(node.getInstance().getIndex(),
      tok, diff);

  xrx.controller.refresh(control, diff, update);
};



xrx.controller.reduceNotTag = function(control, token, offset, length) {
  var node = control.getNode();
  var tok = token || node.getToken();

  var diff = xrx.update.reduceNotTag(node.getInstance(), tok, offset, length);

  //if (node instanceof xrx.nodeB) xrx.rebuild.reduceNotTag(node.getInstance().getIndex(),
  //    tok, diff);

  xrx.controller.refresh(control, diff, '');
};



xrx.controller.removeEmptyTag = function(control, token) {
  var node = control.getNode();

  var diff = xrx.update.removeEmptyTag(node.getInstance(), token);

  if (node instanceof xrx.nodeB) xrx.rebuild.removeEmptyTag(node.getInstance().getIndex(),
      token, diff);

  xrx.controller.refresh(control);
};



xrx.controller.removeStartEndTag = function(control, token1, token2) {
  var node = control.getNode();

  var diff = xrx.update.removeStartEndTag(node.getInstance(), token1, token2);

  //if (node instanceof xrx.nodeB) xrx.rebuild.removeStartEndTag(node.getInstance().getIndex(),
  //    token1, diff);

  xrx.controller.refresh(control);
};



/**
 * Refreshes all other controls which are affected by the update.
 */
xrx.controller.refresh = function(control) {
  var node = control.getNode();

  for (var c in xrx.view.getComponents()) {
    var contr = xrx.view.getComponent(c);
    var nIter = contr.getNode();
    if (nIter && node.getInstance() === nIter.getInstance()) {

      if (nIter.isSameAs(node) && c != control.getId()) {
        contr.refresh()
      } else if (node.getLabel().isDescendantOf(nIter.getLabel())
          && c != control.getId()) {
        contr.refresh();
      } else {}

    }
  }
};



