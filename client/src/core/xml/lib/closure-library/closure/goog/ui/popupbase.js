// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Definition of the PopupBase class.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.PopupBase');
goog.provide('goog.ui.PopupBase.EventType');
goog.provide('goog.ui.PopupBase.Type');

goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.fx.Transition');
goog.require('goog.fx.Transition.EventType');
goog.require('goog.style');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** The PopupBase class provides functionality for showing and hiding a generic
***REMOVED*** container element. It also provides the option for hiding the popup element
***REMOVED*** if the user clicks outside the popup or the popup loses focus.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED*** @param {Element=} opt_element A DOM element for the popup.
***REMOVED*** @param {goog.ui.PopupBase.Type=} opt_type Type of popup.
***REMOVED***
goog.ui.PopupBase = function(opt_element, opt_type) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** An event handler to manage the events easily
  ***REMOVED*** @type {goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.handler_ = new goog.events.EventHandler(this);

  this.setElement(opt_element || null);
  if (opt_type) {
    this.setType(opt_type);
  }
***REMOVED***
goog.inherits(goog.ui.PopupBase, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Constants for type of Popup
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.PopupBase.Type = {
  TOGGLE_DISPLAY: 'toggle_display',
  MOVE_OFFSCREEN: 'move_offscreen'
***REMOVED***


***REMOVED***
***REMOVED*** The popup dom element that this Popup wraps.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.element_ = null;


***REMOVED***
***REMOVED*** Whether the Popup dismisses itself it the user clicks outside of it or the
***REMOVED*** popup loses focus
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.autoHide_ = true;


***REMOVED***
***REMOVED*** Clicks outside the popup but inside this element will cause the popup to
***REMOVED*** hide if autoHide_ is true. If this is null, then the entire document is used.
***REMOVED*** For example, you can use a body-size div so that clicks on the browser
***REMOVED*** scrollbar do not dismiss the popup.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.autoHideRegion_ = null;


***REMOVED***
***REMOVED*** Whether the popup is currently being shown.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.isVisible_ = false;


***REMOVED***
***REMOVED*** Whether the popup should hide itself asynchrously. This was added because
***REMOVED*** there are cases where hiding the element in mouse down handler in IE can
***REMOVED*** cause textinputs to get into a bad state if the element that had focus is
***REMOVED*** hidden.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.shouldHideAsync_ = false;


***REMOVED***
***REMOVED*** The time when the popup was last shown.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.lastShowTime_ = -1;


***REMOVED***
***REMOVED*** The time when the popup was last hidden.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.lastHideTime_ = -1;


***REMOVED***
***REMOVED*** Whether to hide when the escape key is pressed.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.hideOnEscape_ = false;


***REMOVED***
***REMOVED*** Whether to enable cross-iframe dismissal.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.enableCrossIframeDismissal_ = true;


***REMOVED***
***REMOVED*** The type of popup
***REMOVED*** @type {goog.ui.PopupBase.Type}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.type_ = goog.ui.PopupBase.Type.TOGGLE_DISPLAY;


***REMOVED***
***REMOVED*** Transition to play on showing the popup.
***REMOVED*** @type {goog.fx.Transition|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.showTransition_;


***REMOVED***
***REMOVED*** Transition to play on hiding the popup.
***REMOVED*** @type {goog.fx.Transition|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.hideTransition_;


***REMOVED***
***REMOVED*** Constants for event type fired by Popup
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.PopupBase.EventType = {
  BEFORE_SHOW: 'beforeshow',
  SHOW: 'show',
  BEFORE_HIDE: 'beforehide',
  HIDE: 'hide'
***REMOVED***


***REMOVED***
***REMOVED*** A time in ms used to debounce events that happen right after each other.
***REMOVED***
***REMOVED*** A note about why this is necessary. There are two cases to consider.
***REMOVED*** First case, a popup will usually see a focus event right after it's launched
***REMOVED*** because it's typical for it to be launched in a mouse-down event which will
***REMOVED*** then move focus to the launching button. We don't want to think this is a
***REMOVED*** separate user action moving focus. Second case, a user clicks on the
***REMOVED*** launcher button to close the menu. In that case, we'll close the menu in the
***REMOVED*** focus event and then show it again because of the mouse down event, even
***REMOVED*** though the intention is to just close the menu. This workaround appears to
***REMOVED*** be the least intrusive fix.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED***
goog.ui.PopupBase.DEBOUNCE_DELAY_MS = 150;


***REMOVED***
***REMOVED*** @return {goog.ui.PopupBase.Type} The type of popup this is.
***REMOVED***
goog.ui.PopupBase.prototype.getType = function() {
  return this.type_;
***REMOVED***


***REMOVED***
***REMOVED*** Specifies the type of popup to use.
***REMOVED***
***REMOVED*** @param {goog.ui.PopupBase.Type} type Type of popup.
***REMOVED***
goog.ui.PopupBase.prototype.setType = function(type) {
  this.type_ = type;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the popup should hide itself asynchronously using a timeout
***REMOVED*** instead of synchronously.
***REMOVED*** @return {boolean} Whether to hide async.
***REMOVED***
goog.ui.PopupBase.prototype.shouldHideAsync = function() {
  return this.shouldHideAsync_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the popup should hide itself asynchronously using a timeout
***REMOVED*** instead of synchronously.
***REMOVED*** @param {boolean} b Whether to hide async.
***REMOVED***
goog.ui.PopupBase.prototype.setShouldHideAsync = function(b) {
  this.shouldHideAsync_ = b;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the dom element that should be used for the popup.
***REMOVED***
***REMOVED*** @return {Element} The popup element.
***REMOVED***
goog.ui.PopupBase.prototype.getElement = function() {
  return this.element_;
***REMOVED***


***REMOVED***
***REMOVED*** Specifies the dom element that should be used for the popup.
***REMOVED***
***REMOVED*** @param {Element} elt A DOM element for the popup.
***REMOVED***
goog.ui.PopupBase.prototype.setElement = function(elt) {
  this.ensureNotVisible_();
  this.element_ = elt;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the Popup dismisses itself when the user clicks outside of
***REMOVED*** it.
***REMOVED*** @return {boolean} Whether the Popup autohides on an external click.
***REMOVED***
goog.ui.PopupBase.prototype.getAutoHide = function() {
  return this.autoHide_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the Popup dismisses itself when the user clicks outside of it.
***REMOVED*** @param {boolean} autoHide Whether to autohide on an external click.
***REMOVED***
goog.ui.PopupBase.prototype.setAutoHide = function(autoHide) {
  this.ensureNotVisible_();
  this.autoHide_ = autoHide;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the Popup autohides on the escape key.
***REMOVED***
goog.ui.PopupBase.prototype.getHideOnEscape = function() {
  return this.hideOnEscape_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the Popup dismisses itself on the escape key.
***REMOVED*** @param {boolean} hideOnEscape Whether to autohide on the escape key.
***REMOVED***
goog.ui.PopupBase.prototype.setHideOnEscape = function(hideOnEscape) {
  this.ensureNotVisible_();
  this.hideOnEscape_ = hideOnEscape;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether cross iframe dismissal is enabled.
***REMOVED***
goog.ui.PopupBase.prototype.getEnableCrossIframeDismissal = function() {
  return this.enableCrossIframeDismissal_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether clicks in other iframes should dismiss this popup.  In some
***REMOVED*** cases it should be disabled, because it can cause spurious
***REMOVED*** @param {boolean} enable Whether to enable cross iframe dismissal.
***REMOVED***
goog.ui.PopupBase.prototype.setEnableCrossIframeDismissal = function(enable) {
  this.enableCrossIframeDismissal_ = enable;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the region inside which the Popup dismisses itself when the user
***REMOVED*** clicks, or null if it's the entire document.
***REMOVED*** @return {Element} The DOM element for autohide, or null if it hasn't been
***REMOVED***     set.
***REMOVED***
goog.ui.PopupBase.prototype.getAutoHideRegion = function() {
  return this.autoHideRegion_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the region inside which the Popup dismisses itself when the user
***REMOVED*** clicks.
***REMOVED*** @param {Element} element The DOM element for autohide.
***REMOVED***
goog.ui.PopupBase.prototype.setAutoHideRegion = function(element) {
  this.autoHideRegion_ = element;
***REMOVED***


***REMOVED***
***REMOVED*** Sets transition animation on showing and hiding the popup.
***REMOVED*** @param {goog.fx.Transition=} opt_showTransition Transition to play on
***REMOVED***     showing the popup.
***REMOVED*** @param {goog.fx.Transition=} opt_hideTransition Transition to play on
***REMOVED***     hiding the popup.
***REMOVED***
goog.ui.PopupBase.prototype.setTransition = function(
    opt_showTransition, opt_hideTransition) {
  this.showTransition_ = opt_showTransition;
  this.hideTransition_ = opt_hideTransition;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the time when the popup was last shown.
***REMOVED***
***REMOVED*** @return {number} time in ms since epoch when the popup was last shown, or
***REMOVED*** -1 if the popup was never shown.
***REMOVED***
goog.ui.PopupBase.prototype.getLastShowTime = function() {
  return this.lastShowTime_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the time when the popup was last hidden.
***REMOVED***
***REMOVED*** @return {number} time in ms since epoch when the popup was last hidden, or
***REMOVED*** -1 if the popup was never hidden or is currently showing.
***REMOVED***
goog.ui.PopupBase.prototype.getLastHideTime = function() {
  return this.lastHideTime_;
***REMOVED***


***REMOVED***
***REMOVED*** Helper to throw exception if the popup is showing.
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.ensureNotVisible_ = function() {
  if (this.isVisible_) {
    throw Error('Can not change this state of the popup while showing.');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the popup is currently visible.
***REMOVED***
***REMOVED*** @return {boolean} whether the popup is currently visible.
***REMOVED***
goog.ui.PopupBase.prototype.isVisible = function() {
  return this.isVisible_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the popup is currently visible or was visible within about
***REMOVED*** 150 ms ago. This is used by clients to handle a very specific, but common,
***REMOVED*** popup scenario. The button that launches the popup should close the popup
***REMOVED*** on mouse down if the popup is alrady open. The problem is that the popup
***REMOVED*** closes itself during the capture phase of the mouse down and thus the button
***REMOVED*** thinks it's hidden and this should show it again. This method provides a
***REMOVED*** good heuristic for clients. Typically in their event handler they will have
***REMOVED*** code that is:
***REMOVED***
***REMOVED*** if (menu.isOrWasRecentlyVisible()) {
***REMOVED***   menu.setVisible(false);
***REMOVED*** } else {
***REMOVED***   ... // code to position menu and initialize other state
***REMOVED***   menu.setVisible(true);
***REMOVED*** }
***REMOVED*** @return {boolean} Whether the popup is currently visible or was visible
***REMOVED***     within about 150 ms ago.
***REMOVED***
goog.ui.PopupBase.prototype.isOrWasRecentlyVisible = function() {
  return this.isVisible_ ||
         (goog.now() - this.lastHideTime_ <
          goog.ui.PopupBase.DEBOUNCE_DELAY_MS);
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the popup should be visible. After this method
***REMOVED*** returns, isVisible() will always return the new state, even if
***REMOVED*** there is a transition.
***REMOVED***
***REMOVED*** @param {boolean} visible Desired visibility state.
***REMOVED***
goog.ui.PopupBase.prototype.setVisible = function(visible) {
  // Make sure that any currently running transition is stopped.
  if (this.showTransition_) this.showTransition_.stop();
  if (this.hideTransition_) this.hideTransition_.stop();

  if (visible) {
    this.show_();
  } else {
    this.hide_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Repositions the popup according to the current state.
***REMOVED*** Should be overriden by subclases.
***REMOVED***
goog.ui.PopupBase.prototype.reposition = goog.nullFunction;


***REMOVED***
***REMOVED*** Does the work to show the popup.
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.show_ = function() {
  // Ignore call if we are already showing.
  if (this.isVisible_) {
    return;
  }

  // Give derived classes and handlers a chance to customize popup.
  if (!this.onBeforeShow()) {
    return;
  }

  // Allow callers to set the element in the BEFORE_SHOW event.
  if (!this.element_) {
    throw Error('Caller must call setElement before trying to show the popup');
  }

  // Call reposition after onBeforeShow, as it may change the style and/or
  // content of the popup and thereby affecting the size which is used for the
  // viewport calculation.
  this.reposition();

  var doc = goog.dom.getOwnerDocument(this.element_);

  if (this.hideOnEscape_) {

    // Handle the escape keys.  Listen in the capture phase so that we can
    // stop the escape key from propagating to other elements.  For example,
    // if there is a popup within a dialog box, we want the popup to be
    // dismissed first, rather than the dialog.
    this.handler_.listen(doc, goog.events.EventType.KEYDOWN,
        this.onDocumentKeyDown_, true);
  }

  // Set up event handlers.
  if (this.autoHide_) {

    // Even if the popup is not in the focused document, we want to
    // close it on mousedowns in the document it's in.
    this.handler_.listen(doc, goog.events.EventType.MOUSEDOWN,
        this.onDocumentMouseDown_, true);

    if (goog.userAgent.IE) {
      // We want to know about deactivates/mousedowns on the document with focus
      // The top-level document won't get a deactivate event if the focus is
      // in an iframe and the deactivate fires within that iframe.
      // The active element in the top-level document will remain the iframe
      // itself.
      var activeElement;
     ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
      try {
        activeElement = doc.activeElement;
      } catch (e) {
        // There is an IE browser bug which can cause just the reading of
        // document.activeElement to throw an Unspecified Error.  This
        // may have to do with loading a popup within a hidden iframe.
      }
      while (activeElement && activeElement.nodeName == 'IFRAME') {
       ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
        try {
          var tempDoc = goog.dom.getFrameContentDocument(activeElement);
        } catch (e) {
          // The frame is on a different domain that its parent document
          // This way, we grab the lowest-level document object we can get
          // a handle on given cross-domain security.
          break;
        }
        doc = tempDoc;
        activeElement = doc.activeElement;
      }

      // Handle mousedowns in the focused document in case the user clicks
      // on the activeElement (in which case the popup should hide).
      this.handler_.listen(doc, goog.events.EventType.MOUSEDOWN,
          this.onDocumentMouseDown_, true);

      // If the active element inside the focused document changes, then
      // we probably need to hide the popup.
      this.handler_.listen(doc, goog.events.EventType.DEACTIVATE,
          this.onDocumentBlur_);

    } else {
      this.handler_.listen(doc, goog.events.EventType.BLUR,
          this.onDocumentBlur_);
    }
  }

  // Make the popup visible.
  if (this.type_ == goog.ui.PopupBase.Type.TOGGLE_DISPLAY) {
    this.showPopupElement();
  } else if (this.type_ == goog.ui.PopupBase.Type.MOVE_OFFSCREEN) {
    this.reposition();
  }
  this.isVisible_ = true;

  // If there is transition to play, we play it and fire SHOW event after
  // the transition is over.
  if (this.showTransition_) {
    goog.events.listenOnce(
       ***REMOVED*****REMOVED*** @type {goog.events.EventTarget}***REMOVED*** (this.showTransition_),
        goog.fx.Transition.EventType.END, this.onShow_, false, this);
    this.showTransition_.play();
  } else {
    // Notify derived classes and handlers.
    this.onShow_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Hides the popup. This call is idempotent.
***REMOVED***
***REMOVED*** @param {Object=} opt_target Target of the event causing the hide.
***REMOVED*** @return {boolean} Whether the popup was hidden and not cancelled.
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.hide_ = function(opt_target) {
  // Give derived classes and handlers a chance to cancel hiding.
  if (!this.isVisible_ || !this.onBeforeHide_(opt_target)) {
    return false;
  }

  // Remove any listeners we attached when showing the popup.
  if (this.handler_) {
    this.handler_.removeAll();
  }

  // Set visibility to hidden even if there is a transition.
  this.isVisible_ = false;
  this.lastHideTime_ = goog.now();

  // If there is transition to play, we play it and only hide the element
  // (and fire HIDE event) after the transition is over.
  if (this.hideTransition_) {
    goog.events.listenOnce(
       ***REMOVED*****REMOVED*** @type {goog.events.EventTarget}***REMOVED*** (this.hideTransition_),
        goog.fx.Transition.EventType.END,
        goog.partial(this.continueHidingPopup_, opt_target), false, this);
    this.hideTransition_.play();
  } else {
    this.continueHidingPopup_(opt_target);
  }

  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Continues hiding the popup. This is a continuation from hide_. It is
***REMOVED*** a separate method so that we can add a transition before hiding.
***REMOVED*** @param {Object=} opt_target Target of the event causing the hide.
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.continueHidingPopup_ = function(opt_target) {
  // Hide the popup.
  if (this.type_ == goog.ui.PopupBase.Type.TOGGLE_DISPLAY) {
    if (this.shouldHideAsync_) {
      goog.Timer.callOnce(this.hidePopupElement_, 0, this);
    } else {
      this.hidePopupElement_();
    }
  } else if (this.type_ == goog.ui.PopupBase.Type.MOVE_OFFSCREEN) {
    this.moveOffscreen_();
  }

  // Notify derived classes and handlers.
  this.onHide_(opt_target);
***REMOVED***


***REMOVED***
***REMOVED*** Shows the popup element.
***REMOVED*** @protected
***REMOVED***
goog.ui.PopupBase.prototype.showPopupElement = function() {
  this.element_.style.visibility = 'visible';
  goog.style.showElement(this.element_, true);
***REMOVED***


***REMOVED***
***REMOVED*** Hides the popup element.
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.hidePopupElement_ = function() {
  this.element_.style.visibility = 'hidden';
  goog.style.showElement(this.element_, false);
***REMOVED***


***REMOVED***
***REMOVED*** Hides the popup by moving it offscreen.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.moveOffscreen_ = function() {
  this.element_.style.top = '-10000px';
***REMOVED***


***REMOVED***
***REMOVED*** Called before the popup is shown. Derived classes can override to hook this
***REMOVED*** event but should make sure to call the parent class method.
***REMOVED***
***REMOVED*** @return {boolean} If anyone called preventDefault on the event object (or
***REMOVED***     if any of the handlers returns false this will also return false.
***REMOVED*** @protected
***REMOVED***
goog.ui.PopupBase.prototype.onBeforeShow = function() {
  return this.dispatchEvent(goog.ui.PopupBase.EventType.BEFORE_SHOW);
***REMOVED***


***REMOVED***
***REMOVED*** Called after the popup is shown. Derived classes can override to hook this
***REMOVED*** event but should make sure to call the parent class method.
***REMOVED*** @protected
***REMOVED*** @suppress {underscore}
***REMOVED***
goog.ui.PopupBase.prototype.onShow_ = function() {
  this.lastShowTime_ = goog.now();
  this.lastHideTime_ = -1;
  this.dispatchEvent(goog.ui.PopupBase.EventType.SHOW);
***REMOVED***


***REMOVED***
***REMOVED*** Called before the popup is hidden. Derived classes can override to hook this
***REMOVED*** event but should make sure to call the parent class method.
***REMOVED***
***REMOVED*** @param {Object=} opt_target Target of the event causing the hide.
***REMOVED*** @return {boolean} If anyone called preventDefault on the event object (or
***REMOVED***     if any of the handlers returns false this will also return false.
***REMOVED*** @protected
***REMOVED*** @suppress {underscore}
***REMOVED***
goog.ui.PopupBase.prototype.onBeforeHide_ = function(opt_target) {
  return this.dispatchEvent({
    type: goog.ui.PopupBase.EventType.BEFORE_HIDE,
    target: opt_target
  });
***REMOVED***


***REMOVED***
***REMOVED*** Called after the popup is hidden. Derived classes can override to hook this
***REMOVED*** event but should make sure to call the parent class method.
***REMOVED*** @param {Object=} opt_target Target of the event causing the hide.
***REMOVED*** @protected
***REMOVED*** @suppress {underscore}
***REMOVED***
goog.ui.PopupBase.prototype.onHide_ = function(opt_target) {
  this.dispatchEvent({
    type: goog.ui.PopupBase.EventType.HIDE,
    target: opt_target
  });
***REMOVED***


***REMOVED***
***REMOVED*** Mouse down handler for the document on capture phase. Used to hide the
***REMOVED*** popup for auto-hide mode.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} e The event object.
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.onDocumentMouseDown_ = function(e) {
  var target =***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (e.target);
  if (!goog.dom.contains(this.element_, target) &&
      (!this.autoHideRegion_ || goog.dom.contains(
      this.autoHideRegion_, target)) &&
      !this.shouldDebounce_()) {
    // Mouse click was outside popup, so hide.
    this.hide_(target);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles key-downs on the document to handle the escape key.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} e The event object.
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.onDocumentKeyDown_ = function(e) {
  if (e.keyCode == goog.events.KeyCodes.ESC) {
    if (this.hide_(e.target)) {
      // Eat the escape key, but only if this popup was actually closed.
      e.preventDefault();
      e.stopPropagation();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Deactivate handler(IE) and blur handler (other browsers) for document.
***REMOVED*** Used to hide the popup for auto-hide mode.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} e The event object.
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.onDocumentBlur_ = function(e) {
  if (!this.enableCrossIframeDismissal_) {
    return;
  }

  var doc = goog.dom.getOwnerDocument(this.element_);

  // Ignore blur events if the active element is still inside the popup or if
  // there is no longer an active element.  For example, a widget like a
  // goog.ui.Button might programatically blur itself before losing tabIndex.
  if (goog.userAgent.IE || goog.userAgent.OPERA) {
    var activeElement = doc.activeElement;
    if (!activeElement || goog.dom.contains(this.element_,
        activeElement) || activeElement.tagName == 'BODY') {
      return;
    }

  // Ignore blur events not for the document itself in non-IE browsers.
  } else if (e.target != doc) {
    return;
  }

  // Debounce the initial focus move.
  if (this.shouldDebounce_()) {
    return;
  }

  this.hide_();
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the time since last show is less than the debounce
***REMOVED***     delay.
***REMOVED*** @private
***REMOVED***
goog.ui.PopupBase.prototype.shouldDebounce_ = function() {
  return goog.now() - this.lastShowTime_ < goog.ui.PopupBase.DEBOUNCE_DELAY_MS;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.PopupBase.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.handler_.dispose();
  goog.dispose(this.showTransition_);
  goog.dispose(this.hideTransition_);
  delete this.element_;
  delete this.handler_;
***REMOVED***
