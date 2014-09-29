***REMOVED***
***REMOVED*** @fileoverview A utility class which provides common functions for 
***REMOVED*** all WYSIWYM controls that use CodeMirror.
***REMOVED***

goog.provide('xrx.wysiwym');



goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('xrx.controller');
goog.require('xrx.model');
goog.require('xrx.view');



***REMOVED***
***REMOVED*** Creates a new WYSIWYM control.
***REMOVED***
***REMOVED***
xrx.wysiwym = function(element) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** Call constructor of class xrx.view
  ***REMOVED*** @param {!xrx.codemirror}
  ***REMOVED*** @param {Element}
 ***REMOVED*****REMOVED***
***REMOVED***



  this.codemirror_;



  this.internalUpdate = false;



  this.setOptions();
***REMOVED***
goog.inherits(xrx.wysiwym, xrx.view);



***REMOVED***
***REMOVED*** Function sets control specific options for CodeMirror.
***REMOVED*** @private
***REMOVED***
xrx.wysiwym.prototype.setOptions = function() {

  for(var opt in this.options) {
    this.codemirror_.setOption(opt, this.options[opt]);
  }
***REMOVED***



***REMOVED***
***REMOVED*** Creates and initializes the CodeMirror instance.
***REMOVED*** @private
***REMOVED***
xrx.wysiwym.prototype.createDom = function() {
***REMOVED***

  var cm = this.codemirror_ = window.CodeMirror.fromTextArea(this.element_);

  cm.on('beforeChange', function(cm, change) { self.eventBeforeChange(cm, change); });
  cm.on('change', function(cm, change) { self.eventChange(cm, change); });
  cm.on('blur', function(cm, change) { self.eventBlur(); });
  cm.on('cursorActivity', function() { self.eventCursorActivity(); });
  cm.on('focus', function() { self.eventFocus(); });
***REMOVED***



***REMOVED***
***REMOVED*** Returns the string content of the WYSIWYM control.
***REMOVED*** @return {string}
***REMOVED***
xrx.wysiwym.prototype.getValue = function() {
  return this.codemirror_.getValue();
***REMOVED***



***REMOVED***
***REMOVED*** Sets the content of the WYSIWYM control, optionally as an internal
***REMOVED*** update where no content change related events are thrown.
***REMOVED*** @param {!string} string The content as string.
***REMOVED*** @param {boolean} opt_internal True for internal update otherwise false.
***REMOVED***
xrx.wysiwym.prototype.setValue = function(string, opt_internal) {
  this.internalUpdate = opt_internal || false;
  this.codemirror_.setValue(string);
  this.codemirror_.refresh();
  this.internalUpdate = false;
***REMOVED***



***REMOVED***
***REMOVED*** Marks the WYSIWYM control if the cursor selection is invalid.
***REMOVED*** @param {!boolean} invalid True if the selection is invalid, otherwise
***REMOVED*** false.
***REMOVED***
xrx.wysiwym.prototype.setStateInvalid = function(invalid) {
  var func = invalid ? 'add' : 'remove';

  goog.dom.classes[func](this.codemirror_.getWrapperElement(), 
      'richxml-selection-invalid');
***REMOVED***



***REMOVED***
***REMOVED*** Sets the WYSIWYM control readonly.
***REMOVED*** @param {!boolean} readonly True to set readonly, otherwise false.
***REMOVED***
xrx.wysiwym.prototype.setReadonly = function(readonly) {
  readonly ? this.codemirror_.setOption('readOnly', 'nocursor') : 
      this.codemirror_.setOption('readOnly', false);
***REMOVED***



***REMOVED***
***REMOVED*** Gives the WYSIWYM control focus.
***REMOVED***
xrx.wysiwym.prototype.setFocus = function() {
  this.codemirror_.focus();
***REMOVED***



***REMOVED***
***REMOVED*** Function to refresh the contents of the WYSIWYM control. Each WYSIWYM
***REMOVED*** control must implement this.
***REMOVED***
xrx.wysiwym.prototype.refresh = goog.abstractMethod;



***REMOVED***
***REMOVED*** Function is called if the WYSIWYM control gets focus. Each WYSIWYM
***REMOVED*** control must implement this.
***REMOVED***
xrx.wysiwym.prototype.eventFocus = goog.abstractMethod;



***REMOVED***
***REMOVED*** Function is called when the WYSIWYM control loses focus. Each
***REMOVED*** WYSIWYM control must implement this.
***REMOVED***
xrx.wysiwym.prototype.eventBlur = goog.abstractMethod;



***REMOVED***
***REMOVED*** Function is called whenever the cursor moves. Each WYSIWYM control must
***REMOVED*** implement this.
***REMOVED***
xrx.wysiwym.prototype.eventCursorActivity = goog.abstractMethod;



***REMOVED***
***REMOVED*** Function is called before the content of the WYSIWYM control changes as
***REMOVED*** a result of user interactions or as a result of a internal update by the
***REMOVED*** model-view-controller.
***REMOVED*** @param {!CodeMirror} cm The codemirror instance.
***REMOVED*** @param {!Object} change An object containing information about the changes.
***REMOVED***
xrx.wysiwym.prototype.eventBeforeChange = goog.abstractMethod;



***REMOVED***
***REMOVED*** Function is called after the content of the WYSIWYM control has changed as
***REMOVED*** a result of user interactions or as a result of a internal update by the
***REMOVED*** model-view-controller.
***REMOVED*** @param {!CodeMirror} cm The codemirror instance.
***REMOVED*** @param {!Object} change An object containing information about the changes.
***REMOVED***
xrx.wysiwym.prototype.eventBeforeChange = goog.abstractMethod;

