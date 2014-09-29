/**
 * @fileoverview Cursor functions for a WYSIWYM control.
 */

goog.provide('xrx.wysiwym.cursor');



goog.require('xrx.token');
goog.require('xrx.token.NotTag');
goog.require('xrx.wysiwym.richxml');



/**
 * WYSIWYM cursor object.
 */
xrx.wysiwym.cursor = {};



/**
 * Returns whether the current cursor is a selection or a caret.
 *
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {boolean} True if something is selected.
 */
xrx.wysiwym.cursor.isSomethingSelected = function(wysiwym) {
  return wysiwym.codemirror_.somethingSelected();
};



/**
 * Returns the position of the cursor caret if nothing is selected
 * or the position of the left edge of a cursor selection if something
 * is selected as integer.
 *
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {integer} The position of the cursor caret or the left
 * edge of the selection.
 */
xrx.wysiwym.cursor.leftIndex = function(wysiwym) {
  return wysiwym.codemirror_.indexFromPos(
      xrx.wysiwym.cursor.leftPosition(wysiwym));
};



/**
 * Returns the position of the cursor caret if nothing is selected
 * or the position of the left edge of a cursor selection if something
 * is selected as a position object.
 *
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {Object.<number, number>} The position of the cursor caret 
 * or the left edge of the selection.
 */
xrx.wysiwym.cursor.leftPosition = function(wysiwym) {
  return wysiwym.codemirror_.getCursor(true);
};



/**
 * Returns the token left of the cursor caret or left of the left edge
 * of a cursor selection. Token here is not a XML token, but a visual HTML
 * token.
 *
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {Object} The HTML token.
 */
xrx.wysiwym.cursor.leftTokenInside = function(wysiwym) {
  var cm = wysiwym.codemirror_;

  return cm.getTokenAt(cm.posFromIndex(xrx.wysiwym.cursor.leftIndex(wysiwym) + 1));
};



/**
 * Returns the token right of the cursor caret or right of the left edge
 * of a cursor selection. Token here is not a XML token, but a visual HTML
 * token.
 *
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {Object} The HTML token.
 */
xrx.wysiwym.cursor.leftTokenOutside = function(wysiwym) {
  return wysiwym.codemirror_.getTokenAt(xrx.wysiwym.cursor.leftPosition(wysiwym));
};



/**
 * Returns the current not-tag token which belongs to the left cursor edge.
 *
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {xrx.token.NotTag} The not-tag token.
 */
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
    };
    tok = new xrx.token.NotTag(label);
  }

  // TODO: this.getNodeElement().getToken()
  return pilot.location(wysiwym.getNode().getToken(), tok);
};



/**
 * Returns the offset relative to the current not-tag for the
 * cursor caret or for the left edge of the cursor selection if
 * something is selected.
 * 
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {integer} The offset.
 */
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
  };

  return offset;
};



/**
 * Returns whether the cursor caret or the left edge of a cursor
 * selection is placed at the very beginning of a WYSIWYM control.
 *
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {boolean} True if the cursor is placed at the beginning
 * otherwise false.
 */
xrx.wysiwym.cursor.leftAtStartPosition = function(wysiwym) {
  var pos = xrx.wysiwym.cursor.leftPosition(wysiwym);

  return pos.line === 0 && pos.ch === 0;
};



/**
 * Returns whether the cursor caret or the left edge of a cursor
 * selection is placed at the very end of a WYSIWYM control.
 *
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {boolean} True if the cursor is placed at the end
 * otherwise false.
 */
xrx.wysiwym.cursor.leftAtEndPosition = function(wysiwym) {
  var pos = xrx.wysiwym.cursor.leftPosition(wysiwym);
  var cm = wysiwym.codemirror_;
  var last = cm.lineCount() - 1;
  var line = cm.getLine(last);

  return pos.line === last && pos.ch === line.length;
};



/**
 * Returns the right edge of a cursor selection as integer.
 *
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {integer|null} The right edge of the selection or null if
 * nothing is selected.
 */
xrx.wysiwym.cursor.rightIndex = function(wysiwym) {
  var cursor = xrx.wysiwym.cursor;

  return cursor.isSomethingSelected(wysiwym) ? wysiwym.codemirror_.indexFromPos(
      cursor.rightPosition(wysiwym)) : null;
};



/**
 * Returns the right edge of a cursor selection as a position object.
 *
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {Object.<number, number>|null} The right edge of the selection
 * or null if nothing is selected.
 */
xrx.wysiwym.cursor.rightPosition = function(wysiwym) {
  return xrx.wysiwym.cursor.isSomethingSelected(wysiwym) ? 
      wysiwym.codemirror_.getCursor(false) : null;
};



/**
 * Returns the token left of the right edge of a cursor selection. Token
 * here is not a XML token, but a visual HTML token.
 *
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {Object} The HTML token.
 */
xrx.wysiwym.cursor.rightTokenInside = function(wysiwym) {
  return xrx.wysiwym.cursor.isSomethingSelected(wysiwym) ?
      wysiwym.codemirror_.getTokenAt(xrx.wysiwym.cursor.rightPosition(wysiwym)) :
          null;
};



/**
 * Returns the token right of the right edge of a cursor selection. Token
 * here is not a XML token, but a visual HTML token.
 *
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {Object} The HTML token.
 */
xrx.wysiwym.cursor.rightTokenOutside = function(wysiwym) {
  var cm = wysiwym.codemirror_;

  return xrx.wysiwym.cursor.isSomethingSelected(wysiwym) ? 
      cm.getTokenAt(cm.posFromIndex(xrx.wysiwym.cursor.rightIndex(wysiwym) + 1)) :
          null;
};



/**
 * Returns the current not-tag token which belongs to the right cursor edge.
 *
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {xrx.token.NotTag} The not-tag token.
 */
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
    };
    tok = new xrx.token.NotTag(label);
  }

  // TODO: this.getNodeElement().getToken()
  return pilot.location(wysiwym.getNode().getToken(), tok);
};



/**
 * Returns the offset relative to the right edge of the cursor selection.
 * 
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {integer} The offset.
 */
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
  };

  return offset;
};




/**
 * Returns whether the right edge of a cursor selection is placed at 
 * the very beginning of a WYSIWYM control.
 *
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {false|null} Null if nothing is selected, false if something
 * is selected.
 */
xrx.wysiwym.cursor.rightAtStartPosition = function(wysiwym) {
  var pos = xrx.wysiwym.cursor.rightPosition(wysiwym);

  return xrx.wysiwym.cursor.isSomethingSelected(wysiwym) ? false : null;
};



/**
 * Returns whether the right edge of a cursor selection is placed at 
 * the very end of a WYSIWYM control.
 *
 * @param {!xrx.wysiwym.richxml} wysiwym The WYSIWYM control.
 * @return {boolean|null} Null if nothing is selected, true if the
 * right edge is placed at the very end, otherwise false.
 */
xrx.wysiwym.cursor.rightAtEndPosition = function(wysiwym) {
  var cursor = xrx.wysiwym.cursor;
  var pos = cursor.rightPosition(wysiwym);
  var cm = wysiwym.codemirror_;
  var last = cm.lineCount() - 1;
  var line = cm.getLine(last);

  return cursor.isSomethingSelected(wysiwym) ? 
      pos.line === last && pos.ch === line.length : null;
};

