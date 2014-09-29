/**
 * @fileoverview A class which implements a multi-line 
 * text control.
 */

goog.provide('xrx.wysiwym.textarea');



goog.require('goog.string');
goog.require('xrx.node');
goog.require('xrx.token.NotTag');
goog.require('xrx.wysiwym');



/**
 * @constructor
 */
xrx.wysiwym.textarea = function(element) {

  /**
   * call constructor of class xrx.codemirror
   * @param {!xrx.textarea}
   * @param {Element}
   */
  goog.base(this, element);
};
goog.inherits(xrx.wysiwym.textarea, xrx.wysiwym);



/**
 *
 */
xrx.wysiwym.textarea.prototype.options = {
  'lineWrapping': true,
  'mode': 'text'
};



/**
 * 
 */
xrx.wysiwym.textarea.prototype.refresh = function() {

  if (!this.getNode()) {
    this.setReadonly(true);
    return;
  }

  if (this.getNode().getType() !== xrx.node.ELEMENT) {
    throw Error('WYSIWYM controls must be bound to element nodes.');
  }

  var xml = this.getNode().getStringValue();

  this.setValue(xml, true);
};



/**
 *
 */
xrx.wysiwym.textarea.prototype.clear = function() {

  this.setStateInvalid(false);
};



/**
 * 
 */
xrx.wysiwym.textarea.prototype.eventFocus = function()  {
  var arr = new Array(1);
  arr[0] = this.getNode();
  xrx.model.cursor.setNodes(arr);
};



/**
 * 
 */
xrx.wysiwym.textarea.prototype.eventBlur = function()  {
};



/**
 * 
 */
xrx.wysiwym.textarea.prototype.eventCursorActivity = function() {
  this.clear();
};



/**
 * Function is called before the content of the WYSIWYM control changes as
 * a result of user interactions or as a result of a internal update by the
 * model-view-controller.
 * @param {!CodeMirror} cm The codemirror instance.
 * @param {!Object} change An object containing information about the changes.
 */
xrx.wysiwym.textarea.prototype.eventBeforeChange = function(cm, change) {
  var text = change.text.join('');
  if (goog.string.contains(text, '<') || goog.string.contains(text, '>')) {
    this.setStateInvalid(true);
    change.cancel();
  }
};



/**
 * Function is called after the content of the WYSIWYM control has changed as
 * a result of a user interaction or as a result of a internal update by the
 * model-view-controller.
 * @param {!CodeMirror} cm The codemirror instance.
 * @param {!Object} change An object containing information about the changes.
 */
xrx.wysiwym.textarea.prototype.eventChange = function(cm, change) {

  if (this.internalUpdate === false) {
    var node = this.getNode();
    var label = node.getLabel().clone();
    label.push(0);
    var pilot = node.getInstance().getPilot();
    var notTag = new xrx.token.NotTag(label);
    notTag = pilot.location(node.getToken(), notTag);

    xrx.controller.replaceNotTag(this, notTag, this.getValue());
  }
};

