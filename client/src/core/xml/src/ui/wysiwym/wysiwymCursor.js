***REMOVED***
***REMOVED*** @fileoverview Cursor functions for a WYSIWYM control.
***REMOVED***

goog.provide('xrx.wysiwym.cursor');



goog.require('xrx.token');
goog.require('xrx.token.NotTag');
goog.require('xrx.wysiwym.richxml');



***REMOVED***
***REMOVED*** WYSIWYM cursor object.
***REMOVED***
xrx.wysiwym.cursor = {***REMOVED***



***REMOVED***
***REMOVED*** Returns whether the current cursor is a selection or a caret.
***REMOVED***
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {boolean} True if something is selected.
***REMOVED***
xrx.wysiwym.cursor.isSomethingSelected = function(wysiwym) {
  return wysiwym.codemirror_.somethingSelected();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the position of the cursor caret if nothing is selected
***REMOVED*** or the position of the left edge of a cursor selection if something
***REMOVED*** is selected as integer.
***REMOVED***
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {integer} The position of the cursor caret or the left
***REMOVED*** edge of the selection.
***REMOVED***
xrx.wysiwym.cursor.leftIndex = function(wysiwym) {
  return wysiwym.codemirror_.indexFromPos(
      xrx.wysiwym.cursor.leftPosition(wysiwym));
***REMOVED***



***REMOVED***
***REMOVED*** Returns the position of the cursor caret if nothing is selected
***REMOVED*** or the position of the left edge of a cursor selection if something
***REMOVED*** is selected as a position object.
***REMOVED***
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {Object.<number, number>} The position of the cursor caret 
***REMOVED*** or the left edge of the selection.
***REMOVED***
xrx.wysiwym.cursor.leftPosition = function(wysiwym) {
  return wysiwym.codemirror_.getCursor(true);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the token left of the cursor caret or left of the left edge
***REMOVED*** of a cursor selection. Token here is not a XML token, but a visual HTML
***REMOVED*** token.
***REMOVED***
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {Object} The HTML token.
***REMOVED***
xrx.wysiwym.cursor.leftTokenInside = function(wysiwym) {
  var cm = wysiwym.codemirror_;

  return cm.getTokenAt(cm.posFromIndex(xrx.wysiwym.cursor.leftIndex(wysiwym) + 1));
***REMOVED***



***REMOVED***
***REMOVED*** Returns the token right of the cursor caret or right of the left edge
***REMOVED*** of a cursor selection. Token here is not a XML token, but a visual HTML
***REMOVED*** token.
***REMOVED***
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {Object} The HTML token.
***REMOVED***
xrx.wysiwym.cursor.leftTokenOutside = function(wysiwym) {
  return wysiwym.codemirror_.getTokenAt(xrx.wysiwym.cursor.leftPosition(wysiwym));
***REMOVED***



***REMOVED***
***REMOVED*** Returns the current not-tag token which belongs to the left cursor edge.
***REMOVED***
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {xrx.token.NotTag} The not-tag token.
***REMOVED***
xrx.wysiwym.cursor.leftNotTag = function(wysiwym) {
  var tok;
  var cursor = xrx.wysiwym.cursor;
  var pilot = wysiwym.getNode().getInstance().getPilot();
  var leftTokenOutside = cursor.leftTokenOutside(wysiwym).state.context.token;
  var leftTokenInside = cursor.leftTokenInside(wysiwym).state.context.token;

  if (leftTokenOutside.type() === xrx.token.NOT_TAG) {
    tok = leftTokenOutside;
  } else if (leftTokenInside.type() === xrx.token.NOT_TAG) {
    tok = leftTokenInside;
  } else {
    var label = leftTokenOutside.label().clone();
    if (leftTokenOutside.type() === xrx.token.START_TAG) {
      label.push(0);
   ***REMOVED*****REMOVED***
    tok = new xrx.token.NotTag(label);
  }

  // TODO: this.getNodeElement().getToken()
  return pilot.location(wysiwym.getNode().getToken(), tok);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the offset relative to the current not-tag for the
***REMOVED*** cursor caret or for the left edge of the cursor selection if
***REMOVED*** something is selected.
***REMOVED*** 
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {integer} The offset.
***REMOVED***
xrx.wysiwym.cursor.leftNotTagOffset = function(wysiwym) {
  var placeholder = xrx.wysiwym.richxml.placeholder;
  var index = xrx.wysiwym.cursor.leftIndex(wysiwym) - 1;
  var text = wysiwym.getValue();
  var offset = 0;

  for(var i = index; i >= 0; i--) {
    if (text[i] === placeholder.startTag) break;
    if (text[i] === placeholder.endTag) break;
    if (text[i] === placeholder.emptyTag) break;
    offset++;
 ***REMOVED*****REMOVED***

  return offset;
***REMOVED***



***REMOVED***
***REMOVED*** Returns whether the cursor caret or the left edge of a cursor
***REMOVED*** selection is placed at the very beginning of a WYSIWYM control.
***REMOVED***
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {boolean} True if the cursor is placed at the beginning
***REMOVED*** otherwise false.
***REMOVED***
xrx.wysiwym.cursor.leftAtStartPosition = function(wysiwym) {
  var pos = xrx.wysiwym.cursor.leftPosition(wysiwym);

  return pos.line === 0 && pos.ch === 0;
***REMOVED***



***REMOVED***
***REMOVED*** Returns whether the cursor caret or the left edge of a cursor
***REMOVED*** selection is placed at the very end of a WYSIWYM control.
***REMOVED***
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {boolean} True if the cursor is placed at the end
***REMOVED*** otherwise false.
***REMOVED***
xrx.wysiwym.cursor.leftAtEndPosition = function(wysiwym) {
  var pos = xrx.wysiwym.cursor.leftPosition(wysiwym);
  var cm = wysiwym.codemirror_;
  var last = cm.lineCount() - 1;
  var line = cm.getLine(last);

  return pos.line === last && pos.ch === line.length;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the right edge of a cursor selection as integer.
***REMOVED***
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {integer|null} The right edge of the selection or null if
***REMOVED*** nothing is selected.
***REMOVED***
xrx.wysiwym.cursor.rightIndex = function(wysiwym) {
  var cursor = xrx.wysiwym.cursor;

  return cursor.isSomethingSelected(wysiwym) ? wysiwym.codemirror_.indexFromPos(
      cursor.rightPosition(wysiwym)) : null;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the right edge of a cursor selection as a position object.
***REMOVED***
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {Object.<number, number>|null} The right edge of the selection
***REMOVED*** or null if nothing is selected.
***REMOVED***
xrx.wysiwym.cursor.rightPosition = function(wysiwym) {
  return xrx.wysiwym.cursor.isSomethingSelected(wysiwym) ? 
      wysiwym.codemirror_.getCursor(false) : null;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the token left of the right edge of a cursor selection. Token
***REMOVED*** here is not a XML token, but a visual HTML token.
***REMOVED***
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {Object} The HTML token.
***REMOVED***
xrx.wysiwym.cursor.rightTokenInside = function(wysiwym) {
  return xrx.wysiwym.cursor.isSomethingSelected(wysiwym) ?
      wysiwym.codemirror_.getTokenAt(xrx.wysiwym.cursor.rightPosition(wysiwym)) :
          null;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the token right of the right edge of a cursor selection. Token
***REMOVED*** here is not a XML token, but a visual HTML token.
***REMOVED***
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {Object} The HTML token.
***REMOVED***
xrx.wysiwym.cursor.rightTokenOutside = function(wysiwym) {
  var cm = wysiwym.codemirror_;

  return xrx.wysiwym.cursor.isSomethingSelected(wysiwym) ? 
      cm.getTokenAt(cm.posFromIndex(xrx.wysiwym.cursor.rightIndex(wysiwym) + 1)) :
          null;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the current not-tag token which belongs to the right cursor edge.
***REMOVED***
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {xrx.token.NotTag} The not-tag token.
***REMOVED***
xrx.wysiwym.cursor.rightNotTag = function(wysiwym) {
  if (!xrx.wysiwym.cursor.isSomethingSelected(wysiwym)) return null;

  var tok;
  var cursor = xrx.wysiwym.cursor;
  var pilot = wysiwym.getNode().getInstance().getPilot();
  var rightTokenOutside = cursor.rightTokenOutside(wysiwym).state.context.token;
  var rightTokenInside = cursor.rightTokenInside(wysiwym).state.context.token;

  if (rightTokenOutside.type() === xrx.token.NOT_TAG) {
    tok = rightTokenOutside;
  } else if (rightTokenInside.type() === xrx.token.NOT_TAG) {
    tok = rightTokenInside;
  } else {
    var label = rightTokenInside.label().clone();
    if (rightTokenInside.type() === xrx.token.START_TAG) {
      label.push(0);
   ***REMOVED*****REMOVED***
    tok = new xrx.token.NotTag(label);
  }

  // TODO: this.getNodeElement().getToken()
  return pilot.location(wysiwym.getNode().getToken(), tok);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the offset relative to the right edge of the cursor selection.
***REMOVED*** 
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {integer} The offset.
***REMOVED***
xrx.wysiwym.cursor.rightNotTagOffset = function(wysiwym) {
  var placeholder = xrx.wysiwym.richxml.placeholder;
  var index = xrx.wysiwym.cursor.rightIndex(wysiwym) - 1;
  var text = wysiwym.getValue();
  var offset = 0;

  for(var i = index; i >= 0; i--) {
    if (text[i] === placeholder.startTag) break;
    if (text[i] === placeholder.endTag) break;
    if (text[i] === placeholder.emptyTag) break;
    offset++;
 ***REMOVED*****REMOVED***

  return offset;
***REMOVED***




***REMOVED***
***REMOVED*** Returns whether the right edge of a cursor selection is placed at 
***REMOVED*** the very beginning of a WYSIWYM control.
***REMOVED***
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {false|null} Null if nothing is selected, false if something
***REMOVED*** is selected.
***REMOVED***
xrx.wysiwym.cursor.rightAtStartPosition = function(wysiwym) {
  var pos = xrx.wysiwym.cursor.rightPosition(wysiwym);

  return xrx.wysiwym.cursor.isSomethingSelected(wysiwym) ? false : null;
***REMOVED***



***REMOVED***
***REMOVED*** Returns whether the right edge of a cursor selection is placed at 
***REMOVED*** the very end of a WYSIWYM control.
***REMOVED***
***REMOVED*** @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
***REMOVED*** @return {boolean|null} Null if nothing is selected, true if the
***REMOVED*** right edge is placed at the very end, otherwise false.
***REMOVED***
xrx.wysiwym.cursor.rightAtEndPosition = function(wysiwym) {
  var cursor = xrx.wysiwym.cursor;
  var pos = cursor.rightPosition(wysiwym);
  var cm = wysiwym.codemirror_;
  var last = cm.lineCount() - 1;
  var line = cm.getLine(last);

  return cursor.isSomethingSelected(wysiwym) ? 
      pos.line === last && pos.ch === line.length : null;
***REMOVED***

