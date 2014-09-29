***REMOVED***
***REMOVED*** @fileoverview A class which implements a single-line 
***REMOVED*** WYSIWYM control.
***REMOVED***

goog.provide('xrx.wysiwym.input');



goog.require('xrx.wysiwym');
goog.require('xrx.wysiwym.textarea');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.wysiwym.input = function(element) {



 ***REMOVED*****REMOVED***
  ***REMOVED*** call constructor of class xrx.codemirror
  ***REMOVED*** @param {!xrx.input}
  ***REMOVED*** @param {Element}
 ***REMOVED*****REMOVED***
***REMOVED***
***REMOVED***
goog.inherits(xrx.wysiwym.input, xrx.wysiwym);




***REMOVED***
***REMOVED***
***REMOVED***
xrx.wysiwym.input.prototype.options = {
  'extraKeys': { Enter: function(cm) {} },
  'fixedGutter': false,
  'mode': 'text'
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.wysiwym.input.prototype.refresh = xrx.wysiwym.textarea.prototype.refresh;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.wysiwym.input.prototype.clear = xrx.wysiwym.textarea.prototype.clear;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.wysiwym.input.prototype.eventFocus = xrx.wysiwym.textarea.prototype.eventFocus;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.wysiwym.input.prototype.eventBlur = xrx.wysiwym.textarea.prototype.eventBlur;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.wysiwym.input.prototype.eventCursorActivity =
    xrx.wysiwym.textarea.prototype.eventCursorActivity;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.wysiwym.input.prototype.eventBeforeChange = xrx.wysiwym.textarea.prototype.eventBeforeChange;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.wysiwym.input.prototype.eventChange = xrx.wysiwym.textarea.prototype.eventChange;

