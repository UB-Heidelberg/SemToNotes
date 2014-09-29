***REMOVED***
***REMOVED*** @fileoverview A user interface component to visually edit 
***REMOVED*** XML Mixed Content like in a Rich Text Editor.
***REMOVED***

goog.provide('xrx.wysiwym.richxml');


goog.require('goog.dom');
goog.require('xrx.label');
goog.require('xrx.node');
goog.require('xrx.pilot');
goog.require('xrx.richxml.mode');
goog.require('xrx.stream');
goog.require('xrx.token');
goog.require('xrx.token.EndTag');
goog.require('xrx.token.StartTag');
goog.require('xrx.wysiwym');
goog.require('xrx.wysiwym.cursor');
goog.require('xrx.view');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.wysiwym.richxml = function(element, opt_tagname) {
***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tagname_ = opt_tagname;
***REMOVED***
goog.inherits(xrx.wysiwym.richxml, xrx.wysiwym);



***REMOVED***
***REMOVED***
***REMOVED***
xrx.wysiwym.richxml.placeholder = {
  startTag: unescape('%BB'),
  endTag: unescape('%AB'),
  emptyTag: unescape('%D7')
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.wysiwym.richxml.placeholder.matches = function(ch) {

  for(var p in xrx.wysiwym.richxml.placeholder) {
    if (xrx.wysiwym.richxml.placeholder[p] === ch) {
      return true;
    }
  }

  return false;
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.wysiwym.richxml.prototype.cursorIsNearTag = function() {
  return xrx.wysiwym.richxml.placeholder.matches(
      xrx.wysiwym.cursor.leftTokenOutside(this).string);
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.wysiwym.richxml.className = {
  startTag: 'richxml-start-tag',
  startTagActive: 'richxml-start-tag-active',
  endTag: 'richxml-end-tag',
  endTagActive: 'richxml-end-tag-active',
  emptyTag: 'richxml-empty-tag',
  emptyTagActive: 'richxml-empty-tag-active',
  notTag: 'richxml-not-tag',
  notTagActive: 'richxml-not-tag-active'
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.wysiwym.richxml.prototype.transformXml_ = function(xml) {
  var visualXml = '';
***REMOVED***
  var stream = new xrx.stream(xml);

  stream.rowStartTag = function(offset, length1, length2) {
    visualXml += xrx.wysiwym.richxml.placeholder.startTag;
    if(length1 !== length2) visualXml += xml.substr(offset + length1, length2 - length1);
 ***REMOVED*****REMOVED***

  stream.rowEndTag = function(offset, length1, length2) {
    visualXml += xrx.wysiwym.richxml.placeholder.endTag;
    if(length1 !== length2) visualXml += xml.substr(offset + length1, length2 - length1);
 ***REMOVED*****REMOVED***

  stream.rowEmptyTag = function(offset, length1, length2) {
    visualXml += xrx.wysiwym.richxml.placeholder.emptyTag;
    if(length1 !== length2) visualXml += xml.substr(offset + length1, length2 - length1);
 ***REMOVED*****REMOVED***

  stream.forward();

  return visualXml;
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.wysiwym.richxml.prototype.options = {
  'mode': 'richxml',
  'lineWrapping': true
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.wysiwym.richxml.prototype.refresh = function() {

  if (!this.getNode()) {
    this.setReadonly(true);
    return;
  }

  if (this.getNode().getType() !== xrx.node.ELEMENT) {
    throw Error('WYSIWYM controls must be bound to element nodes.');
  }

  var visualXml = this.transformXml_(this.getNode().getXml());
  this.setValue(visualXml, true);
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.wysiwym.richxml.prototype.clear = function() {
  this.unmarkActiveTags();
  this.setStateInvalid(false);
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.wysiwym.richxml.prototype.unmarkActiveTags = function() {
  this.markActiveTags(true);
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.wysiwym.richxml.prototype.getCorrespondingPosition = function(token) {
  var cm = this.codemirror_;
  var placeholder = xrx.wysiwym.richxml.placeholder;
  var text = cm.getValue();
  var index = cm.indexFromPos(cm.getCursor()) - 1;
  var ch;
  var stack = 0;

  if(token.string === placeholder.startTag) {

    for(var i = index; i < text.length; i++) {
      ch = text[i];
      if(ch === placeholder.endTag) stack -= 1;
      if(ch === placeholder.startTag) stack += 1;
      if(stack === 0) {
        index = i + 1;
        break;
      } 
    }
  } else if(token.string === placeholder.endTag) {
    console.log('test');
    for(var i = index; i >= 0; i--) {
      ch = text[i];
      if(ch === placeholder.startTag) stack += 1;
      if(ch === placeholder.endTag) stack -= 1;
      if(stack === 0) {
        index = i + 1;
        break;
      } 
    }
  } else {***REMOVED***

  return this.codemirror_.posFromIndex(index);
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.wysiwym.richxml.prototype.markActiveTags = function(unmarkflag) {
  var cm = this.codemirror_;
  var cursor = xrx.wysiwym.cursor;
  var placeholder = xrx.wysiwym.richxml.placeholder;
  var className = xrx.wysiwym.richxml.className;
***REMOVED***
  
  var markedElements = function() { 
    return self.markedElements_ || (self.markedElements_ = []); 
 ***REMOVED*****REMOVED***
  
  var mark = function(from, to, style) {
    var mark = cm.markText(from, to, style);

    markedElements().push(mark);
 ***REMOVED*****REMOVED***
  
  var unmark = function() {

    for(var i = 0; i < markedElements().length; ++i) {
      markedElements()[i].clear();
    }
    self.markedElements_ = [];
 ***REMOVED*****REMOVED***

  unmark();
  if (!this.cursorIsNearTag()) return;
  if (unmarkflag) return;

  var leftTokenOutside = cursor.leftTokenOutside(self);
  var leftPosition = cursor.leftPosition(self);
  var firstMark = leftTokenOutside.string === placeholder.startTag ? 
      className.startTagActive : className.endTagActive;
  var secondMark = leftTokenOutside.string === placeholder.startTag ? 
      className.endTagActive : className.startTagActive;

  // mark matched element
  mark(
      { line: leftPosition.line, ch: leftPosition.ch - 1 }, 
      { line: leftPosition.line, ch: leftPosition.ch }, 
      { className: firstMark }
***REMOVED***
  
  if (leftTokenOutside.string === placeholder.emptyTag) return;
  
  // mark corresponding element
  var corresponding = this.getCorrespondingPosition(leftTokenOutside);
  mark(
      { line: corresponding.line, ch: corresponding.ch - 1 },
      { line: corresponding.line, ch: corresponding.ch },
      { className: secondMark }
***REMOVED***
  
  // mark text
  var from = { line: leftPosition.line, ch: leftPosition.ch***REMOVED*****REMOVED***
  var to = { line: corresponding.line, ch: corresponding.ch - 1***REMOVED*****REMOVED***
  leftTokenOutside.string === placeholder.startTag ? 
      mark(from, to, { className: className.notTagActive }) : 
      mark(to, from, { className: className.notTagActive });
***REMOVED***



***REMOVED***
***REMOVED*** Does the necessary operations after the cursor caret has moved.
***REMOVED***
xrx.wysiwym.richxml.prototype.doCursorActivityCaret = function() {
  this.markActiveTags();
***REMOVED***



***REMOVED***
***REMOVED*** Does the necessary operations after the cursor selection has moved.
***REMOVED***
xrx.wysiwym.richxml.prototype.doCursorActivitySelection = function() {
  var cursor = xrx.wysiwym.cursor;

  // start-tag at the very beginning or end-tag at the very end selected?
  if (cursor.leftAtStartPosition(this) || cursor.rightAtEndPosition(this)) {
    this.setStateInvalid(true);
    return;
  }

  // end-tag inside the left cursor edge or start-tag inside the right cursor edge?
  var leftTokenInside = cursor.leftTokenInside(this).state.context.token;
  var rightTokenInside = cursor.rightTokenInside(this).state.context.token;

  if (leftTokenInside.type() === xrx.token.END_TAG ||
      rightTokenInside.type() === xrx.token.START_TAG) {
    this.setStateInvalid(true);
    return;
  }

  // left token inside and right token inside have the same parent token?
  var leftLabel = leftTokenInside.label().clone();
  var rightLabel = rightTokenInside.label().clone();
  leftLabel.parent();
  rightLabel.parent();

  if (!leftLabel.sameAs(rightLabel)) {
    this.setStateInvalid(true);
  }
***REMOVED***



***REMOVED***
***REMOVED*** Changes the UI state of the WYSIWYM control after a cursor move.
***REMOVED***
xrx.wysiwym.richxml.prototype.eventCursorActivity = function() {
  var cm = this.codemirror_;

  this.clear();

  if (cm.somethingSelected()) {
    this.doCursorActivitySelection();
  } else {
    this.doCursorActivityCaret();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Changes the UI state when focus is given to the WYSIWYM control.
***REMOVED***
xrx.wysiwym.richxml.prototype.eventFocus = function() {
  this.markActiveTags();
***REMOVED***



***REMOVED***
***REMOVED*** Changes the UI state when the WYSIWYM control loses focus.
***REMOVED***
xrx.wysiwym.richxml.prototype.eventBlur = function() {
  this.clear();
***REMOVED***



***REMOVED***
***REMOVED*** Checks whether the current content change is a remove or a insert
***REMOVED*** operation.
***REMOVED***
***REMOVED*** @param {Object} change An object containing information about the
***REMOVED*** content change.
***REMOVED*** @return {boolean} True if content is removed, otherwise false.
***REMOVED***
xrx.wysiwym.richxml.prototype.isSomethingRemoved = function(change) {
  return change.text[0] === '';
***REMOVED***



***REMOVED***
***REMOVED*** Performs the necessary model updates before something is inserted.
***REMOVED***
xrx.wysiwym.richxml.prototype.doSomethingInserted = function(change) {
  var pilot = this.getNode().getInstance().getPilot();
  var notTag = xrx.wysiwym.cursor.leftNotTag(this);

  // TODO: multi-line support
  if (!xrx.wysiwym.cursor.isSomethingSelected(this)) {  
    xrx.controller.insertNotTag(this, notTag, xrx.wysiwym.cursor.leftNotTagOffset(this),
        change.text.join('\n'));
  } else {
    change.cancel();
  }
***REMOVED***



***REMOVED***
***REMOVED*** Performs the necessary model updates and internal control updates
***REMOVED*** before something is removed.
***REMOVED***
xrx.wysiwym.richxml.prototype.doSomethingRemoved = function(change) {
  var cm = this.codemirror_;
  var placeholder = xrx.wysiwym.richxml.placeholder;
  var pilot = this.getNode().getInstance().getPilot();
  var removed = this.getValue().substring(change.from.ch, change.to.ch);

  // TODO: multi-line support

  // one character removed?
  if (!xrx.wysiwym.cursor.isSomethingSelected(this)) {

    // attempt to remove the very first character?
    if (change.from.line === 0 &&
        change.from.ch === 0) {
      change.cancel();
      return;
    }

    // attempt to remove the very last character?
    var lastLine = cm.lastLine();
    var lastChar = cm.getLine(lastLine).length - 1;
    if (change.from.line === lastLine &&
        change.from.ch === lastChar) {
      change.cancel();
      return;
    }

    // not-tag is removed?
    if (!placeholder.matches(removed)) {
      var notTag = xrx.wysiwym.cursor.leftNotTag(this);
      notTag = pilot.location(this.getNode().getToken(), notTag);
      var notTagOffset =
          xrx.wysiwym.cursor.leftNotTagOffset(this) - removed.length;

      xrx.controller.reduceNotTag(this, notTag, notTagOffset,
          change.to.ch - change.from.ch);
    }

    // tag is removed?
    else {
      var token = cm.getTokenAt({line: change.to.line, ch: change.to.ch});
      var tag = token.state.context.token;
      tag = pilot.location(this.getNode().getToken(), tag);

      // empty tag?
      if (tag.type() === xrx.token.EMPTY_TAG) {
        xrx.controller.removeEmptyTag(this, tag);
        return;
      }
      // start tag?
      else if (tag.type() === xrx.token.START_TAG) {
        var to = this.getCorrespondingPosition(token);
        var from = {line: to.line, ch: to.ch - 1***REMOVED***
        var endTag = pilot.location(tag,
            new xrx.token.EndTag(tag.label().clone()));

        xrx.controller.removeStartEndTag(this, tag, endTag);

        this.internalUpdate = true;
        cm.replaceRange('', from, to);
        cm.replaceRange('', change.from, change.to);
        this.internalUpdate = false;

        change.cancel();
      }
      // end tag?
      else {
        var to = this.getCorrespondingPosition(token);
        var from = {line: to.line, ch: to.ch - removed.length***REMOVED***
        var startTag = pilot.location(this.getNode().getToken(), // TODO: backward piloting
            new xrx.token.StartTag(tag.label().clone()));

        xrx.controller.removeStartEndTag(this, startTag, tag);

        this.internalUpdate = true;
        cm.replaceRange('', change.from, change.to);
        cm.replaceRange('', from, to);
        cm.setCursor({line: change.from.line, ch: change.from.ch - removed.length});
        this.internalUpdate = false;

        change.cancel();
      }
    }
  }

  // selection removed?
  else { 
    change.cancel();
  }
***REMOVED***



***REMOVED***
***REMOVED*** Function is called before the content of the WYSIWYM control changes.
***REMOVED***
***REMOVED*** @param {!CodeMirror} cm The CodeMirror instance.
***REMOVED*** @param {!Object} change An object containing information about the changes.
***REMOVED***
xrx.wysiwym.richxml.prototype.eventBeforeChange = function(cm, change) {

  if (this.internalUpdate === false) {

    if (xrx.wysiwym.cursor.leftAtStartPosition(this) ||
        xrx.wysiwym.cursor.leftAtEndPosition(this)) {
      change.cancel();
    } else {
      this.isSomethingRemoved(change) ? this.doSomethingRemoved(change) :
          this.doSomethingInserted(change);
    }
  }
***REMOVED***



***REMOVED***
***REMOVED*** Function is called after the content of the WYSIWYM control has changed.
***REMOVED***
***REMOVED*** @param {!CodeMirror} cm The CodeMirror instance.
***REMOVED*** @param {!Object} change An object containing information about the changes.
***REMOVED***
xrx.wysiwym.richxml.prototype.eventChange = function(cm, change) {***REMOVED***

