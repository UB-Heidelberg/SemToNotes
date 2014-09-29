/**
 * @fileoverview A utility class which provides common functions for 
 * all WYSIWYM controls that use CodeMirror.
 */

goog.provide('xrx.wysiwym');



goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('xrx.controller');
goog.require('xrx.model');
goog.require('xrx.view');



/**
 * Creates a new WYSIWYM control.
 * @constructor
 */
xrx.wysiwym = function(element) {

  /**
   * Call constructor of class xrx.view
   * @param {!xrx.codemirror}
   * @param {Element}
   */
  goog.base(this, element);



  this.codemirror_;



  this.internalUpdate = false;



  this.setOptions();
};
goog.inherits(xrx.wysiwym, xrx.view);



/**
 * Function sets control specific options for CodeMirror.
 * @private
 */
xrx.wysiwym.prototype.setOptions = function() {

  for(var opt in this.options) {
    this.codemirror_.setOption(opt, this.options[opt]);
  }
};



/**
 * Creates and initializes the CodeMirror instance.
 * @private
 */
xrx.wysiwym.prototype.createDom = function() {
  var self = this;

  var cm = this.codemirror_ = window.CodeMirror.fromTextArea(this.element_);

  cm.on('beforeChange', function(cm, change) { self.eventBeforeChange(cm, change); });
  cm.on('change', function(cm, change) { self.eventChange(cm, change); });
  cm.on('blur', function(cm, change) { self.eventBlur(); });
  cm.on('cursorActivity', function() { self.eventCursorActivity(); });
  cm.on('focus', function() { self.eventFocus(); });
};



/**
 * Returns the string content of the WYSIWYM control.
 * @return {string}
 */
xrx.wysiwym.prototype.getValue = function() {
  return this.codemirror_.getValue();
};



/**
 * Sets the content of the WYSIWYM control, optionally as an internal
 * update where no content change related events are thrown.
 * @param {!string} string The content as string.
 * @param {boolean} opt_internal True for internal update otherwise false.
 */
xrx.wysiwym.prototype.setValue = function(string, opt_internal) {
  this.internalUpdate = opt_internal || false;
  this.codemirror_.setValue(string);
  this.codemirror_.refresh();
  this.internalUpdate = false;
};



/**
 * Marks the WYSIWYM control if the cursor selection is invalid.
 * @param {!boolean} invalid True if the selection is invalid, otherwise
 * false.
 */
xrx.wysiwym.prototype.setStateInvalid = function(invalid) {
  var func = invalid ? 'add' : 'remove';

  goog.dom.classes[func](this.codemirror_.getWrapperElement(), 
      'richxml-selection-invalid');
};



/**
 * Sets the WYSIWYM control readonly.
 * @param {!boolean} readonly True to set readonly, otherwise false.
 */
xrx.wysiwym.prototype.setReadonly = function(readonly) {
  readonly ? this.codemirror_.setOption('readOnly', 'nocursor') : 
      this.codemirror_.setOption('readOnly', false);
};



/**
 * Gives the WYSIWYM control focus.
 */
xrx.wysiwym.prototype.setFocus = function() {
  this.codemirror_.focus();
};



/**
 * Function to refresh the contents of the WYSIWYM control. Each WYSIWYM
 * control must implement this.
 */
xrx.wysiwym.prototype.refresh = goog.abstractMethod;



/**
 * Function is called if the WYSIWYM control gets focus. Each WYSIWYM
 * control must implement this.
 */
xrx.wysiwym.prototype.eventFocus = goog.abstractMethod;



/**
 * Function is called when the WYSIWYM control loses focus. Each
 * WYSIWYM control must implement this.
 */
xrx.wysiwym.prototype.eventBlur = goog.abstractMethod;



/**
 * Function is called whenever the cursor moves. Each WYSIWYM control must
 * implement this.
 */
xrx.wysiwym.prototype.eventCursorActivity = goog.abstractMethod;



/**
 * Function is called before the content of the WYSIWYM control changes as
 * a result of user interactions or as a result of a internal update by the
 * model-view-controller.
 * @param {!CodeMirror} cm The codemirror instance.
 * @param {!Object} change An object containing information about the changes.
 */
xrx.wysiwym.prototype.eventBeforeChange = goog.abstractMethod;



/**
 * Function is called after the content of the WYSIWYM control has changed as
 * a result of user interactions or as a result of a internal update by the
 * model-view-controller.
 * @param {!CodeMirror} cm The codemirror instance.
 * @param {!Object} change An object containing information about the changes.
 */
xrx.wysiwym.prototype.eventBeforeChange = goog.abstractMethod;

