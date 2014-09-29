/**
 * @fileoverview A class which implements a single-line 
 * WYSIWYM control.
 */

goog.provide('xrx.wysiwym.input');



goog.require('xrx.wysiwym');
goog.require('xrx.wysiwym.textarea');



/**
 * @constructor
 */
xrx.wysiwym.input = function(element) {



  /**
   * call constructor of class xrx.codemirror
   * @param {!xrx.input}
   * @param {Element}
   */
  goog.base(this, element);
};
goog.inherits(xrx.wysiwym.input, xrx.wysiwym);




/**
 *
 */
xrx.wysiwym.input.prototype.options = {
  'extraKeys': { Enter: function(cm) {} },
  'fixedGutter': false,
  'mode': 'text'
};



/**
 * 
 */
xrx.wysiwym.input.prototype.refresh = xrx.wysiwym.textarea.prototype.refresh;



/**
 * 
 */
xrx.wysiwym.input.prototype.clear = xrx.wysiwym.textarea.prototype.clear;



/**
 * 
 */
xrx.wysiwym.input.prototype.eventFocus = xrx.wysiwym.textarea.prototype.eventFocus;



/**
 * 
 */
xrx.wysiwym.input.prototype.eventBlur = xrx.wysiwym.textarea.prototype.eventBlur;



/**
 * 
 */
xrx.wysiwym.input.prototype.eventCursorActivity =
    xrx.wysiwym.textarea.prototype.eventCursorActivity;



/**
 * 
 */
xrx.wysiwym.input.prototype.eventBeforeChange = xrx.wysiwym.textarea.prototype.eventBeforeChange;



/**
 * 
 */
xrx.wysiwym.input.prototype.eventChange = xrx.wysiwym.textarea.prototype.eventChange;

