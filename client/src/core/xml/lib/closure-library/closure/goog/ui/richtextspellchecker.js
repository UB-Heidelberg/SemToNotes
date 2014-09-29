// Copyright 2007 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

***REMOVED***
***REMOVED*** @fileoverview Rich text spell checker implementation.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED*** @author sergeys@google.com (Sergey Solyanik)
***REMOVED*** @see ../demos/richtextspellchecker.html
***REMOVED***

goog.provide('goog.ui.RichTextSpellChecker');

goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.dom.NodeType');
***REMOVED***
***REMOVED***
goog.require('goog.string.StringBuffer');
goog.require('goog.ui.AbstractSpellChecker');
goog.require('goog.ui.AbstractSpellChecker.AsyncResult');



***REMOVED***
***REMOVED*** Rich text spell checker implementation.
***REMOVED***
***REMOVED*** @param {goog.spell.SpellCheck} handler Instance of the SpellCheckHandler
***REMOVED***     support object to use. A single instance can be shared by multiple editor
***REMOVED***     components.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.AbstractSpellChecker}
***REMOVED***
goog.ui.RichTextSpellChecker = function(handler, opt_domHelper) {
  goog.ui.AbstractSpellChecker.call(this, handler, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** String buffer for use in reassembly of the original text.
  ***REMOVED*** @type {goog.string.StringBuffer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.workBuffer_ = new goog.string.StringBuffer();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Bound async function (to avoid rebinding it on every call).
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.boundContinueAsyncFn_ = goog.bind(this.continueAsync_, this);
***REMOVED***
goog.inherits(goog.ui.RichTextSpellChecker, goog.ui.AbstractSpellChecker);


***REMOVED***
***REMOVED*** Root node for rich editor.
***REMOVED*** @type {Node}
***REMOVED*** @private
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.rootNode_;


***REMOVED***
***REMOVED*** Current node where spell checker has interrupted to go to the next stack
***REMOVED*** frame.
***REMOVED*** @type {Node}
***REMOVED*** @private
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.currentNode_;


***REMOVED***
***REMOVED*** Counter of inserted elements. Used in processing loop to attempt to preserve
***REMOVED*** existing nodes if they contain no misspellings.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.elementsInserted_ = 0;


***REMOVED***
***REMOVED*** Number of words to scan to precharge the dictionary.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.dictionaryPreScanSize_ = 1000;


***REMOVED***
***REMOVED*** Class name for word spans.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.wordClassName =
    goog.getCssName('goog-spellcheck-word');


***REMOVED***
***REMOVED*** DomHelper to be used for interacting with the editable document/element.
***REMOVED***
***REMOVED*** @type {goog.dom.DomHelper|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.editorDom_;


***REMOVED***
***REMOVED*** Tag name porition of the marker for the text that does not need to be checked
***REMOVED*** for spelling.
***REMOVED***
***REMOVED*** @type {Array.<string|undefined>}
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.excludeTags;


***REMOVED***
***REMOVED*** CSS Style text for invalid words. As it's set inside the rich edit iframe
***REMOVED*** classes defined in the parent document are not availble, thus the style is
***REMOVED*** set inline.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.invalidWordCssText =
    'background: yellow;';


***REMOVED***
***REMOVED*** Creates the initial DOM representation for the component.
***REMOVED***
***REMOVED*** @throws {Error} Not supported. Use decorate.
***REMOVED*** @see #decorate
***REMOVED*** @override
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.createDom = function() {
  throw Error('Render not supported for goog.ui.RichTextSpellChecker.');
***REMOVED***


***REMOVED***
***REMOVED*** Decorates the element for the UI component.
***REMOVED***
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @override
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.decorateInternal = function(element) {
  this.setElementInternal(element);
  if (element.contentDocument || element.contentWindow) {
    var doc = element.contentDocument || element.contentWindow.document;
    this.rootNode_ = doc.body;
    this.editorDom_ = goog.dom.getDomHelper(doc);
  } else {
    this.rootNode_ = element;
    this.editorDom_ = goog.dom.getDomHelper(element);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.RichTextSpellChecker.prototype.enterDocument = function() {
  goog.ui.RichTextSpellChecker.superClass_.enterDocument.call(this);
  this.initSuggestionsMenu();
***REMOVED***


***REMOVED***
***REMOVED*** Checks spelling for all text and displays correction UI.
***REMOVED*** @override
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.check = function() {
  this.blockReadyEvents();
  this.preChargeDictionary_(this.rootNode_, this.dictionaryPreScanSize_);
  this.unblockReadyEvents();

***REMOVED***this.handler_, goog.spell.SpellCheck.EventType.READY,
                     this.onDictionaryCharged_, true, this);
  this.handler_.processPending();
***REMOVED***


***REMOVED***
***REMOVED*** Processes nodes recursively.
***REMOVED***
***REMOVED*** @param {Node} node Node to start with.
***REMOVED*** @param {number} words Max number of words to process.
***REMOVED*** @private
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.preChargeDictionary_ = function(node,
                                                                       words) {
  while (node) {
    var next = this.nextNode_(node);
    if (this.isExcluded_(node)) {
      node = next;
      continue;
    }
    if (node.nodeType == goog.dom.NodeType.TEXT) {
      if (node.nodeValue) {
        words -= this.populateDictionary(node.nodeValue, words);
        if (words <= 0) {
          return;
        }
      }
    } else if (node.nodeType == goog.dom.NodeType.ELEMENT) {
      if (node.firstChild) {
        next = node.firstChild;
      }
    }
    node = next;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Starts actual processing after the dictionary is charged.
***REMOVED*** @param {goog.events.Event} e goog.spell.SpellCheck.EventType.READY event.
***REMOVED*** @private
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.onDictionaryCharged_ = function(e) {
  e.stopPropagation();
  goog.events.unlisten(this.handler_, goog.spell.SpellCheck.EventType.READY,
                       this.onDictionaryCharged_, true, this);

  // Now actually do the spell checking.
  this.clearWordElements();
  this.initializeAsyncMode();
  this.elementsInserted_ = 0;
  var result = this.processNode_(this.rootNode_);
  if (result == goog.ui.AbstractSpellChecker.AsyncResult.PENDING) {
    goog.Timer.callOnce(this.boundContinueAsyncFn_);
    return;
  }
  this.finishAsyncProcessing();
  this.finishCheck_();
***REMOVED***


***REMOVED***
***REMOVED*** Continues asynchrnonous spell checking.
***REMOVED*** @private
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.continueAsync_ = function() {
  var result = this.continueAsyncProcessing();
  if (result == goog.ui.AbstractSpellChecker.AsyncResult.PENDING) {
    goog.Timer.callOnce(this.boundContinueAsyncFn_);
    return;
  }
  result = this.processNode_(this.currentNode_);
  if (result == goog.ui.AbstractSpellChecker.AsyncResult.PENDING) {
    goog.Timer.callOnce(this.boundContinueAsyncFn_);
    return;
  }
  this.finishAsyncProcessing();
  this.finishCheck_();
***REMOVED***


***REMOVED***
***REMOVED*** Finalizes spelling check.
***REMOVED*** @private
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.finishCheck_ = function() {
  delete this.currentNode_;
  this.handler_.processPending();

  if (!this.isVisible()) {
  ***REMOVED***this.rootNode_, goog.events.EventType.CLICK,
                       this.onWordClick_, false, this);
  }
  goog.ui.RichTextSpellChecker.superClass_.check.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** Finds next node in our enumeration of the tree.
***REMOVED***
***REMOVED*** @param {Node} node The node to which we're computing the next node for.
***REMOVED*** @return {Node} The next node or null if none was found.
***REMOVED*** @private
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.nextNode_ = function(node) {
  while (node != this.rootNode_) {
    if (node.nextSibling) {
      return node.nextSibling;
    }
    node = node.parentNode;
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the node is text node without any children.
***REMOVED***
***REMOVED*** @param {Node} node The node to check.
***REMOVED*** @return {boolean} Whether the node is a text leaf node.
***REMOVED*** @private
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.isTextLeaf_ = function(node) {
  return node != null &&
         node.nodeType == goog.dom.NodeType.TEXT &&
         !node.firstChild;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.RichTextSpellChecker.prototype.setExcludeMarker = function(marker) {
  if (marker) {
    if (typeof marker == 'string') {
      marker = [marker];
    }

    this.excludeTags = [];
    this.excludeMarker = [];
    for (var i = 0; i < marker.length; i++) {
      var parts = marker[i].split('.');
      if (parts.length == 2) {
        this.excludeTags.push(parts[0]);
        this.excludeMarker.push(parts[1]);
      } else {
        this.excludeMarker.push(parts[0]);
        this.excludeTags.push(undefined);
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the node is excluded from checking.
***REMOVED***
***REMOVED*** @param {Node} node The node to check.
***REMOVED*** @return {boolean} Whether the node is excluded.
***REMOVED*** @private
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.isExcluded_ = function(node) {
  if (this.excludeMarker && node.className) {
    for (var i = 0; i < this.excludeMarker.length; i++) {
      var excludeTag = this.excludeTags[i];
      var excludeClass = this.excludeMarker[i];
      var isExcluded = !!(excludeClass &&
          node.className.indexOf(excludeClass) != -1 &&
          (!excludeTag || node.tagName == excludeTag));
      if (isExcluded) {
        return true;
      }
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Processes nodes recursively.
***REMOVED***
***REMOVED*** @param {Node} node Node where to start.
***REMOVED*** @return {goog.ui.AbstractSpellChecker.AsyncResult|undefined} Result code.
***REMOVED*** @private
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.processNode_ = function(node) {
  delete this.currentNode_;
  while (node) {
    var next = this.nextNode_(node);
    if (this.isExcluded_(node)) {
      node = next;
      continue;
    }
    if (node.nodeType == goog.dom.NodeType.TEXT) {
      var deleteNode = true;
      if (node.nodeValue) {
        var currentElements = this.elementsInserted_;
        var result = this.processTextAsync(node, node.nodeValue);
        if (result == goog.ui.AbstractSpellChecker.AsyncResult.PENDING) {
          // This markes node for deletion (empty nodes get deleted couple
          // of lines down this function). This is so our algorithm terminates.
          // In this case the node may be needlessly recreated, but it
          // happens rather infrequently and saves a lot of code.
          node.nodeValue = '';
          this.currentNode_ = node;
          return result;
        }
        // If we did not add nodes in processing, the current element is still
        // valid. Let's preserve it!
        if (currentElements == this.elementsInserted_) {
          deleteNode = false;
        }
      }
      if (deleteNode) {
        goog.dom.removeNode(node);
      }
    } else if (node.nodeType == goog.dom.NodeType.ELEMENT) {
      // If this is a spell checker element...
      if (node.className == this.wordClassName) {
        // First, reconsolidate the text nodes inside the element - editing
        // in IE splits them up.
        var runner = node.firstChild;
        while (runner) {
          if (this.isTextLeaf_(runner)) {
            while (this.isTextLeaf_(runner.nextSibling)) {
              // Yes, this is not super efficient in IE, but it will almost
              // never happen.
              runner.nodeValue += runner.nextSibling.nodeValue;
              goog.dom.removeNode(runner.nextSibling);
            }
          }
          runner = runner.nextSibling;
        }
        // Move its contents out and reprocess it on the next iteration.
        if (node.firstChild) {
          next = node.firstChild;
          while (node.firstChild) {
            node.parentNode.insertBefore(node.firstChild, node);
          }
        }
        // get rid of the empty shell.
        goog.dom.removeNode(node);
      } else {
        if (node.firstChild) {
          next = node.firstChild;
        }
      }
    }
    node = next;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Processes word.
***REMOVED***
***REMOVED*** @param {Node} node Node containing word.
***REMOVED*** @param {string} word Word to process.
***REMOVED*** @param {goog.spell.SpellCheck.WordStatus} status Status of the word.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.processWord = function(node, word,
                                                              status) {
  node.parentNode.insertBefore(this.createWordElement_(word, status), node);
  this.elementsInserted_++;
***REMOVED***


***REMOVED***
***REMOVED*** Processes recognized text and separators.
***REMOVED***
***REMOVED*** @param {Node} node Node containing separator.
***REMOVED*** @param {string} text Text to process.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.processRange = function(node, text) {
  // The text does not change, it only gets split, so if the lengths are the
  // same, the text is the same, so keep the existing node.
  if (node.nodeType == goog.dom.NodeType.TEXT && node.nodeValue.length ==
      text.length) {
    return;
  }

  node.parentNode.insertBefore(this.editorDom_.createTextNode(text), node);
  this.elementsInserted_++;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** @suppress {accessControls}
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.createWordElement_ = function(word,
                                                                     status) {
  var parameters = this.getElementProperties(status);
  var el =***REMOVED*****REMOVED*** @type {HTMLSpanElement}***REMOVED*** (this.editorDom_.createDom('span',
      parameters, word));
  this.registerWordElement_(word, el);
  return el;
***REMOVED***


***REMOVED***
***REMOVED*** Updates or replaces element based on word status.
***REMOVED*** @see goog.ui.AbstractSpellChecker.prototype.updateElement_
***REMOVED***
***REMOVED*** Overridden from AbstractSpellChecker because we need to be mindful of
***REMOVED*** deleting the currentNode_ - this can break our pending processing.
***REMOVED***
***REMOVED*** @param {Element} el Word element.
***REMOVED*** @param {string} word Word to update status for.
***REMOVED*** @param {goog.spell.SpellCheck.WordStatus} status Status of word.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.updateElement = function(el, word,
    status) {
  if (status == goog.spell.SpellCheck.WordStatus.VALID && el !=
      this.currentNode_ && el.nextSibling != this.currentNode_) {
    this.removeMarkup(el);
  } else {
    goog.dom.setProperties(el, this.getElementProperties(status));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Hides correction UI.
***REMOVED*** @override
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.resume = function() {
  goog.ui.RichTextSpellChecker.superClass_.resume.call(this);

  this.restoreNode_(this.rootNode_);

  goog.events.unlisten(this.rootNode_, goog.events.EventType.CLICK,
                       this.onWordClick_, false, this);
***REMOVED***


***REMOVED***
***REMOVED*** Processes nodes recursively, removes all spell checker markup, and
***REMOVED*** consolidates text nodes.
***REMOVED***
***REMOVED*** @param {Node} node node on which to recurse.
***REMOVED*** @private
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.restoreNode_ = function(node) {
  while (node) {
    if (this.isExcluded_(node)) {
      node = node.nextSibling;
      continue;
    }
    // Contents of the child of the element is usually 1 text element, but the
    // user can actually add multiple nodes in it during editing. So we move
    // all the children out, prepend, and reprocess (pointer is set back to
    // the first node that's been moved out, and the loop repeats).
    if (node.nodeType == goog.dom.NodeType.ELEMENT && node.className ==
        this.wordClassName) {
      var firstElement = node.firstChild;
      var next;
      for (var child = firstElement; child; child = next) {
        next = child.nextSibling;
        node.parentNode.insertBefore(child, node);
      }
      next = firstElement || node.nextSibling;
      goog.dom.removeNode(node);
      node = next;
      continue;
    }
    // If this is a chain of text elements, we're trying to consolidate it.
    var textLeaf = this.isTextLeaf_(node);
    if (textLeaf) {
      var textNodes = 1;
      var next = node.nextSibling;
      while (this.isTextLeaf_(node.previousSibling)) {
        node = node.previousSibling;
        ++textNodes;
      }
      while (this.isTextLeaf_(next)) {
        next = next.nextSibling;
        ++textNodes;
      }
      if (textNodes > 1) {
        this.workBuffer_.append(node.nodeValue);
        while (this.isTextLeaf_(node.nextSibling)) {
          this.workBuffer_.append(node.nextSibling.nodeValue);
          goog.dom.removeNode(node.nextSibling);
        }
        node.nodeValue = this.workBuffer_.toString();
        this.workBuffer_.clear();
      }
    }
    // Process child nodes, if any.
    if (node.firstChild) {
      this.restoreNode_(node.firstChild);
    }
    node = node.nextSibling;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns desired element properties for the specified status.
***REMOVED***
***REMOVED*** @param {goog.spell.SpellCheck.WordStatus} status Status of the word.
***REMOVED*** @return {Object} Properties to apply to word element.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.getElementProperties =
    function(status) {
  return {
    'class': this.wordClassName,
    'style': (status == goog.spell.SpellCheck.WordStatus.INVALID) ?
        this.invalidWordCssText : ''
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Handler for click events.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Event object.
***REMOVED*** @private
***REMOVED***
goog.ui.RichTextSpellChecker.prototype.onWordClick_ = function(event) {
  var target =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (event.target);
  if (event.target.className == this.wordClassName &&
      this.handler_.checkWord(goog.dom.getTextContent(target)) ==
      goog.spell.SpellCheck.WordStatus.INVALID) {

    this.showSuggestionsMenu(target, event);

    // Prevent document click handler from closing the menu.
    event.stopPropagation();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.RichTextSpellChecker.prototype.disposeInternal = function() {
  goog.ui.RichTextSpellChecker.superClass_.disposeInternal.call(this);
  this.rootNode_ = null;
  this.editorDom_ = null;
***REMOVED***
