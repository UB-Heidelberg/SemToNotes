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
***REMOVED*** @fileoverview Class for showing simple modal dialog boxes.
***REMOVED***
***REMOVED*** TODO(user):
***REMOVED***  ***REMOVED*** Standardize CSS class names with other components
***REMOVED***  ***REMOVED*** Add functionality to "host" other components in content area
***REMOVED***  ***REMOVED*** Abstract out ButtonSet and make it more general
***REMOVED*** @see ../demos/dialog.html
***REMOVED***

goog.provide('goog.ui.Dialog');
goog.provide('goog.ui.Dialog.ButtonSet');
goog.provide('goog.ui.Dialog.ButtonSet.DefaultButtons');
goog.provide('goog.ui.Dialog.DefaultButtonCaptions');
goog.provide('goog.ui.Dialog.DefaultButtonKeys');
goog.provide('goog.ui.Dialog.Event');
goog.provide('goog.ui.Dialog.EventType');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.a11y.aria.State');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
***REMOVED***
goog.require('goog.events.Event');
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.fx.Dragger');
goog.require('goog.math.Rect');
goog.require('goog.structs');
goog.require('goog.structs.Map');
goog.require('goog.style');
goog.require('goog.ui.ModalPopup');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Class for showing simple dialog boxes.
***REMOVED*** The Html structure of the dialog box is:
***REMOVED*** <pre>
***REMOVED***  Element         Function                Class-name, modal-dialog = default
***REMOVED*** ----------------------------------------------------------------------------
***REMOVED*** - iframe         Iframe mask              modal-dialog-bg
***REMOVED*** - div            Background mask          modal-dialog-bg
***REMOVED*** - div            Dialog area              modal-dialog
***REMOVED***     - div        Title bar                modal-dialog-title
***REMOVED***        - span                             modal-dialog-title-text
***REMOVED***          - text  Title text               N/A
***REMOVED***        - span                             modal-dialog-title-close
***REMOVED***          - ??    Close box                N/A
***REMOVED***     - div        Content area             modal-dialog-content
***REMOVED***        - ??      User specified content   N/A
***REMOVED***     - div        Button area              modal-dialog-buttons
***REMOVED***        - button                           N/A
***REMOVED***        - button
***REMOVED***        - ...
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {string=} opt_class CSS class name for the dialog element, also used
***REMOVED***     as a class name prefix for related elements; defaults to modal-dialog.
***REMOVED*** @param {boolean=} opt_useIframeMask Work around windowed controls z-index
***REMOVED***     issue by using an iframe instead of a div for bg element.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link
***REMOVED***     goog.ui.Component} for semantics.
***REMOVED*** @extends {goog.ui.ModalPopup}
***REMOVED***
goog.ui.Dialog = function(opt_class, opt_useIframeMask, opt_domHelper) {
  goog.base(this, opt_useIframeMask, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** CSS class name for the dialog element, also used as a class name prefix for
  ***REMOVED*** related elements.  Defaults to goog.getCssName('modal-dialog').
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.class_ = opt_class || goog.getCssName('modal-dialog');

  this.buttons_ = goog.ui.Dialog.ButtonSet.createOkCancel();
***REMOVED***
goog.inherits(goog.ui.Dialog, goog.ui.ModalPopup);


***REMOVED***
***REMOVED*** Button set.  Default to Ok/Cancel.
***REMOVED*** @type {goog.ui.Dialog.ButtonSet}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.buttons_;


***REMOVED***
***REMOVED*** Whether the escape key closes this dialog.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.escapeToCancel_ = true;


***REMOVED***
***REMOVED*** Whether this dialog should include a title close button.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.hasTitleCloseButton_ = true;


***REMOVED***
***REMOVED*** Whether the dialog is modal. Defaults to true.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.modal_ = true;


***REMOVED***
***REMOVED*** Whether the dialog is draggable. Defaults to true.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.draggable_ = true;


***REMOVED***
***REMOVED*** Opacity for background mask.  Defaults to 50%.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.backgroundElementOpacity_ = 0.50;


***REMOVED***
***REMOVED*** Dialog's title.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.title_ = '';


***REMOVED***
***REMOVED*** Dialog's content (HTML).
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.content_ = '';


***REMOVED***
***REMOVED*** Dragger.
***REMOVED*** @type {goog.fx.Dragger}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.dragger_ = null;


***REMOVED***
***REMOVED*** Whether the dialog should be disposed when it is hidden.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.disposeOnHide_ = false;


***REMOVED***
***REMOVED*** Element for the title bar.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.titleEl_ = null;


***REMOVED***
***REMOVED*** Element for the text area of the title bar.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.titleTextEl_ = null;


***REMOVED***
***REMOVED*** Id of element for the text area of the title bar.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.titleId_ = null;


***REMOVED***
***REMOVED*** Element for the close box area of the title bar.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.titleCloseEl_ = null;


***REMOVED***
***REMOVED*** Element for the content area.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.contentEl_ = null;


***REMOVED***
***REMOVED*** Element for the button bar.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.buttonEl_ = null;


***REMOVED***
***REMOVED*** The dialog's preferred ARIA role.
***REMOVED*** @type {goog.a11y.aria.Role}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.preferredAriaRole_ = goog.a11y.aria.Role.DIALOG;


***REMOVED*** @override***REMOVED***
goog.ui.Dialog.prototype.getCssClass = function() {
  return this.class_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the title.
***REMOVED*** @param {string} title The title text.
***REMOVED***
goog.ui.Dialog.prototype.setTitle = function(title) {
  this.title_ = title;
  if (this.titleTextEl_) {
    goog.dom.setTextContent(this.titleTextEl_, title);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the title.
***REMOVED*** @return {string} The title.
***REMOVED***
goog.ui.Dialog.prototype.getTitle = function() {
  return this.title_;
***REMOVED***


***REMOVED***
***REMOVED*** Allows arbitrary HTML to be set in the content element.
***REMOVED*** @param {string} html Content HTML.
***REMOVED***
goog.ui.Dialog.prototype.setContent = function(html) {
  this.content_ = html;
  if (this.contentEl_) {
    this.contentEl_.innerHTML = html;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the content HTML of the content element.
***REMOVED*** @return {string} Content HTML.
***REMOVED***
goog.ui.Dialog.prototype.getContent = function() {
  return this.content_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the dialog's preferred ARIA role. This can be used to override the
***REMOVED*** default dialog role, e.g. with an ARIA role of ALERTDIALOG for a simple
***REMOVED*** warning or confirmation dialog.
***REMOVED*** @return {goog.a11y.aria.Role} This dialog's preferred ARIA role.
***REMOVED***
goog.ui.Dialog.prototype.getPreferredAriaRole = function() {
  return this.preferredAriaRole_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the dialog's preferred ARIA role. This can be used to override the
***REMOVED*** default dialog role, e.g. with an ARIA role of ALERTDIALOG for a simple
***REMOVED*** warning or confirmation dialog.
***REMOVED*** @param {goog.a11y.aria.Role} role This dialog's preferred ARIA role.
***REMOVED***
goog.ui.Dialog.prototype.setPreferredAriaRole = function(role) {
  this.preferredAriaRole_ = role;
***REMOVED***


***REMOVED***
***REMOVED*** Renders if the DOM is not created.
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.renderIfNoDom_ = function() {
  if (!this.getElement()) {
    // TODO(gboyer): Ideally we'd only create the DOM, but many applications
    // are requiring this behavior.  Eventually, it would be best if the
    // element getters could return null if the elements have not been
    // created.
    this.render();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the content element so that more complicated things can be done with
***REMOVED*** the content area.  Renders if the DOM is not yet created.  Overrides
***REMOVED*** {@link goog.ui.Component#getContentElement}.
***REMOVED*** @return {Element} The content element.
***REMOVED*** @override
***REMOVED***
goog.ui.Dialog.prototype.getContentElement = function() {
  this.renderIfNoDom_();
  return this.contentEl_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the title element so that more complicated things can be done with
***REMOVED*** the title.  Renders if the DOM is not yet created.
***REMOVED*** @return {Element} The title element.
***REMOVED***
goog.ui.Dialog.prototype.getTitleElement = function() {
  this.renderIfNoDom_();
  return this.titleEl_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the title text element so that more complicated things can be done
***REMOVED*** with the text of the title.  Renders if the DOM is not yet created.
***REMOVED*** @return {Element} The title text element.
***REMOVED***
goog.ui.Dialog.prototype.getTitleTextElement = function() {
  this.renderIfNoDom_();
  return this.titleTextEl_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the title close element so that more complicated things can be done
***REMOVED*** with the close area of the title.  Renders if the DOM is not yet created.
***REMOVED*** @return {Element} The close box.
***REMOVED***
goog.ui.Dialog.prototype.getTitleCloseElement = function() {
  this.renderIfNoDom_();
  return this.titleCloseEl_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the button element so that more complicated things can be done with
***REMOVED*** the button area.  Renders if the DOM is not yet created.
***REMOVED*** @return {Element} The button container element.
***REMOVED***
goog.ui.Dialog.prototype.getButtonElement = function() {
  this.renderIfNoDom_();
  return this.buttonEl_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the dialog element so that more complicated things can be done with
***REMOVED*** the dialog box.  Renders if the DOM is not yet created.
***REMOVED*** @return {Element} The dialog element.
***REMOVED***
goog.ui.Dialog.prototype.getDialogElement = function() {
  this.renderIfNoDom_();
  return this.getElement();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the background mask element so that more complicated things can be
***REMOVED*** done with the background region.  Renders if the DOM is not yet created.
***REMOVED*** @return {Element} The background mask element.
***REMOVED*** @override
***REMOVED***
goog.ui.Dialog.prototype.getBackgroundElement = function() {
  this.renderIfNoDom_();
  return goog.base(this, 'getBackgroundElement');
***REMOVED***


***REMOVED***
***REMOVED*** Gets the opacity of the background mask.
***REMOVED*** @return {number} Background mask opacity.
***REMOVED***
goog.ui.Dialog.prototype.getBackgroundElementOpacity = function() {
  return this.backgroundElementOpacity_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the opacity of the background mask.
***REMOVED*** @param {number} opacity Background mask opacity.
***REMOVED***
goog.ui.Dialog.prototype.setBackgroundElementOpacity = function(opacity) {
  this.backgroundElementOpacity_ = opacity;

  if (this.getElement()) {
    var bgEl = this.getBackgroundElement();
    if (bgEl) {
      goog.style.setOpacity(bgEl, this.backgroundElementOpacity_);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the modal property of the dialog. In case the dialog is already
***REMOVED*** inDocument, renders the modal background elements according to the specified
***REMOVED*** modal parameter.
***REMOVED***
***REMOVED*** Note that non-modal dialogs cannot use an iframe mask.
***REMOVED***
***REMOVED*** @param {boolean} modal Whether the dialog is modal.
***REMOVED***
goog.ui.Dialog.prototype.setModal = function(modal) {
  if (modal != this.modal_) {
    this.setModalInternal_(modal);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the modal property of the dialog.
***REMOVED*** @param {boolean} modal Whether the dialog is modal.
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.setModalInternal_ = function(modal) {
  this.modal_ = modal;
  if (this.isInDocument()) {
    var dom = this.getDomHelper();
    var bg = this.getBackgroundElement();
    var bgIframe = this.getBackgroundIframe();
    if (modal) {
      if (bgIframe) {
        dom.insertSiblingBefore(bgIframe, this.getElement());
      }
      dom.insertSiblingBefore(bg, this.getElement());
    } else {
      dom.removeNode(bgIframe);
      dom.removeNode(bg);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} modal Whether the dialog is modal.
***REMOVED***
goog.ui.Dialog.prototype.getModal = function() {
  return this.modal_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The CSS class name for the dialog element.
***REMOVED***
goog.ui.Dialog.prototype.getClass = function() {
  return this.getCssClass();
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the dialog can be dragged.
***REMOVED*** @param {boolean} draggable Whether the dialog can be dragged.
***REMOVED***
goog.ui.Dialog.prototype.setDraggable = function(draggable) {
  this.draggable_ = draggable;
  this.setDraggingEnabled_(draggable && this.isInDocument());
***REMOVED***


***REMOVED***
***REMOVED*** Returns a dragger for moving the dialog and adds a class for the move cursor.
***REMOVED*** Defaults to allow dragging of the title only, but can be overridden if
***REMOVED*** different drag targets or dragging behavior is desired.
***REMOVED*** @return {!goog.fx.Dragger} The created dragger instance.
***REMOVED*** @protected
***REMOVED***
goog.ui.Dialog.prototype.createDragger = function() {
  return new goog.fx.Dragger(this.getElement(), this.titleEl_);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the dialog is draggable.
***REMOVED***
goog.ui.Dialog.prototype.getDraggable = function() {
  return this.draggable_;
***REMOVED***


***REMOVED***
***REMOVED*** Enables or disables dragging.
***REMOVED*** @param {boolean} enabled Whether to enable it.
***REMOVED*** @private.
***REMOVED***
goog.ui.Dialog.prototype.setDraggingEnabled_ = function(enabled) {
  if (this.getElement()) {
    goog.dom.classes.enable(this.titleEl_,
        goog.getCssName(this.class_, 'title-draggable'), enabled);
  }

  if (enabled && !this.dragger_) {
    this.dragger_ = this.createDragger();
    goog.dom.classes.add(this.titleEl_,
        goog.getCssName(this.class_, 'title-draggable'));
  ***REMOVED***this.dragger_, goog.fx.Dragger.EventType.START,
        this.setDraggerLimits_, false, this);
  } else if (!enabled && this.dragger_) {
    this.dragger_.dispose();
    this.dragger_ = null;
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Dialog.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var element = this.getElement();
  goog.asserts.assert(element, 'getElement() returns null');

  var dom = this.getDomHelper();
  this.titleEl_ = dom.createDom('div',
      {'className': goog.getCssName(this.class_, 'title'), 'id': this.getId()},
      this.titleTextEl_ = dom.createDom(
          'span', goog.getCssName(this.class_, 'title-text'), this.title_),
      this.titleCloseEl_ = dom.createDom(
          'span', goog.getCssName(this.class_, 'title-close'))),
  goog.dom.append(element, this.titleEl_,
      this.contentEl_ = dom.createDom('div',
          goog.getCssName(this.class_, 'content')),
      this.buttonEl_ = dom.createDom('div',
          goog.getCssName(this.class_, 'buttons')));

  this.titleId_ = this.titleEl_.id;
  goog.a11y.aria.setRole(element, this.getPreferredAriaRole());
  goog.a11y.aria.setState(element, goog.a11y.aria.State.LABELLEDBY,
      this.titleId_ || '');
  // If setContent() was called before createDom(), make sure the inner HTML of
  // the content element is initialized.
  if (this.content_) {
    this.contentEl_.innerHTML = this.content_;
  }
  goog.style.showElement(this.titleCloseEl_, this.hasTitleCloseButton_);

  // Render the buttons.
  if (this.buttons_) {
    this.buttons_.attachToElement(this.buttonEl_);
  }
  goog.style.showElement(this.buttonEl_, !!this.buttons_);
  this.setBackgroundElementOpacity(this.backgroundElementOpacity_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Dialog.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);
  var dialogElement = this.getElement();
  goog.asserts.assert(dialogElement,
      'The DOM element for dialog cannot be null.');
  // Decorate or create the content element.
  var contentClass = goog.getCssName(this.class_, 'content');
  this.contentEl_ = goog.dom.getElementsByTagNameAndClass(
      null, contentClass, dialogElement)[0];
  if (this.contentEl_) {
    this.content_ = this.contentEl_.innerHTML;
  } else {
    this.contentEl_ = this.getDomHelper().createDom('div', contentClass);
    if (this.content_) {
      this.contentEl_.innerHTML = this.content_;
    }
    dialogElement.appendChild(this.contentEl_);
  }

  // Decorate or create the title bar element.
  var titleClass = goog.getCssName(this.class_, 'title');
  var titleTextClass = goog.getCssName(this.class_, 'title-text');
  var titleCloseClass = goog.getCssName(this.class_, 'title-close');
  this.titleEl_ = goog.dom.getElementsByTagNameAndClass(
      null, titleClass, dialogElement)[0];
  if (this.titleEl_) {
    // Only look for title text & title close elements if a title bar element
    // was found.  Otherwise assume that the entire title bar has to be
    // created from scratch.
    this.titleTextEl_ = goog.dom.getElementsByTagNameAndClass(
        null, titleTextClass, this.titleEl_)[0];
    this.titleCloseEl_ = goog.dom.getElementsByTagNameAndClass(
        null, titleCloseClass, this.titleEl_)[0];
    // Give the title an id if it doesn't already have one.
    if (!this.titleEl_.id) {
      this.titleEl_.id = this.getId();
    }
  } else {
    // Create the title bar element and insert it before the content area.
    // This is useful if the element to decorate only includes a content area.
    this.titleEl_ = this.getDomHelper().createDom('div',
        {'className': titleClass, 'id': this.getId()});
    dialogElement.insertBefore(this.titleEl_, this.contentEl_);
  }
  this.titleId_ = this.titleEl_.id;

  // Decorate or create the title text element.
  if (this.titleTextEl_) {
    this.title_ = goog.dom.getTextContent(this.titleTextEl_);
  } else {
    this.titleTextEl_ = this.getDomHelper().createDom('span', titleTextClass,
        this.title_);
    this.titleEl_.appendChild(this.titleTextEl_);
  }
  goog.a11y.aria.setState(dialogElement, goog.a11y.aria.State.LABELLEDBY,
      this.titleId_ || '');
  // Decorate or create the title close element.
  if (!this.titleCloseEl_) {
    this.titleCloseEl_ = this.getDomHelper().createDom('span', titleCloseClass);
    this.titleEl_.appendChild(this.titleCloseEl_);
  }
  goog.style.showElement(this.titleCloseEl_, this.hasTitleCloseButton_);

  // Decorate or create the button container element.
  var buttonsClass = goog.getCssName(this.class_, 'buttons');
  this.buttonEl_ = goog.dom.getElementsByTagNameAndClass(
      null, buttonsClass, dialogElement)[0];
  if (this.buttonEl_) {
    // Button container element found.  Create empty button set and use it to
    // decorate the button container.
    this.buttons_ = new goog.ui.Dialog.ButtonSet(this.getDomHelper());
    this.buttons_.decorate(this.buttonEl_);
  } else {
    // Create new button container element, and render a button set into it.
    this.buttonEl_ = this.getDomHelper().createDom('div', buttonsClass);
    dialogElement.appendChild(this.buttonEl_);
    if (this.buttons_) {
      this.buttons_.attachToElement(this.buttonEl_);
    }
    goog.style.showElement(this.buttonEl_, !!this.buttons_);
  }
  this.setBackgroundElementOpacity(this.backgroundElementOpacity_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Dialog.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  // Listen for keyboard events while the dialog is visible.
  this.getHandler().
      listen(this.getElement(), goog.events.EventType.KEYDOWN, this.onKey_).
      listen(this.getElement(), goog.events.EventType.KEYPRESS, this.onKey_);

  // NOTE: see bug 1163154 for an example of an edge case where making the
  // dialog visible in response to a KEYDOWN will result in a CLICK event
  // firing on the default button (immediately closing the dialog) if the key
  // that fired the KEYDOWN is also normally used to activate controls
  // (i.e. SPACE/ENTER).
  //
  // This could be worked around by attaching the onButtonClick_ handler in a
  // setTimeout, but that was deemed undesirable.
  this.getHandler().listen(this.buttonEl_, goog.events.EventType.CLICK,
      this.onButtonClick_);

  // Add drag support.
  this.setDraggingEnabled_(this.draggable_);

  // Add event listeners to the close box and the button container.
  this.getHandler().listen(
      this.titleCloseEl_, goog.events.EventType.CLICK,
      this.onTitleCloseClick_);

  var element = this.getElement();
  goog.asserts.assert(element, 'The DOM element for dialog cannot be null');
  goog.a11y.aria.setRole(element, this.getPreferredAriaRole());
  if (this.titleTextEl_.id !== '') {
    goog.a11y.aria.setState(element, goog.a11y.aria.State.LABELLEDBY,
        this.titleTextEl_.id);
  }

  if (!this.modal_) {
    this.setModalInternal_(false);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Dialog.prototype.exitDocument = function() {
  if (this.isVisible()) {
    this.setVisible(false);
  }

  // Remove drag support.
  this.setDraggingEnabled_(false);

  goog.base(this, 'exitDocument');
***REMOVED***


***REMOVED***
***REMOVED*** Sets the visibility of the dialog box and moves focus to the
***REMOVED*** default button. Lazily renders the component if needed. After this
***REMOVED*** method returns, isVisible() will always return the new state, even
***REMOVED*** if there is a transition.
***REMOVED*** @param {boolean} visible Whether the dialog should be visible.
***REMOVED*** @override
***REMOVED***
goog.ui.Dialog.prototype.setVisible = function(visible) {
  if (visible == this.isVisible()) {
    return;
  }

  // If the dialog hasn't been rendered yet, render it now.
  if (!this.isInDocument()) {
    this.render();
  }

  goog.base(this, 'setVisible', visible);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Dialog.prototype.onShow = function() {
  goog.base(this, 'onShow');
  this.dispatchEvent(goog.ui.Dialog.EventType.AFTER_SHOW);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Dialog.prototype.onHide = function() {
  goog.base(this, 'onHide');
  this.dispatchEvent(goog.ui.Dialog.EventType.AFTER_HIDE);
  if (this.disposeOnHide_) {
    this.dispose();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Focuses the dialog contents and the default dialog button if there is one.
***REMOVED*** @override
***REMOVED***
goog.ui.Dialog.prototype.focus = function() {
  goog.base(this, 'focus');

  // Move focus to the default button (if any).
  if (this.getButtonSet()) {
    var defaultButton = this.getButtonSet().getDefault();
    if (defaultButton) {
      var doc = this.getDomHelper().getDocument();
      var buttons = this.buttonEl_.getElementsByTagName('button');
      for (var i = 0, button; button = buttons[i]; i++) {
        if (button.name == defaultButton && !button.disabled) {
          try {
            // Reopening a dialog can cause focusing the button to fail in
            // WebKit and Opera. Shift the focus to a temporary <input>
            // element to make refocusing the button possible.
            if (goog.userAgent.WEBKIT || goog.userAgent.OPERA) {
              var temp = doc.createElement('input');
              temp.style.cssText =
                  'position:fixed;width:0;height:0;left:0;top:0;';
              this.getElement().appendChild(temp);
              temp.focus();
              this.getElement().removeChild(temp);
            }
            button.focus();
          } catch (e) {
            // Swallow this. Could be the button is disabled
            // and IE6 wishes to throw an error.
          }
          break;
        }
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets dragger limits when dragging is started.
***REMOVED*** @param {!goog.events.Event} e goog.fx.Dragger.EventType.START event.
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.setDraggerLimits_ = function(e) {
  var doc = this.getDomHelper().getDocument();
  var win = goog.dom.getWindow(doc) || window;

  // Take the max of scroll height and view height for cases in which document
  // does not fill screen.
  var viewSize = goog.dom.getViewportSize(win);
  var w = Math.max(doc.body.scrollWidth, viewSize.width);
  var h = Math.max(doc.body.scrollHeight, viewSize.height);

  var dialogSize = goog.style.getSize(this.getElement());
  if (goog.style.getComputedPosition(this.getElement()) == 'fixed') {
    // Ensure position:fixed dialogs can't be dragged beyond the viewport.
    this.dragger_.setLimits(new goog.math.Rect(0, 0,
        Math.max(0, viewSize.width - dialogSize.width),
        Math.max(0, viewSize.height - dialogSize.height)));
  } else {
    this.dragger_.setLimits(new goog.math.Rect(0, 0,
        w - dialogSize.width, h - dialogSize.height));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles a click on the title close area.
***REMOVED*** @param {goog.events.BrowserEvent} e Browser's event object.
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.onTitleCloseClick_ = function(e) {
  if (!this.hasTitleCloseButton_) {
    return;
  }

  var bs = this.getButtonSet();
  var key = bs && bs.getCancel();
  // Only if there is a valid cancel button is an event dispatched.
  if (key) {
    var caption =***REMOVED*****REMOVED*** @type {Element|string}***REMOVED***(bs.get(key));
    if (this.dispatchEvent(new goog.ui.Dialog.Event(key, caption))) {
      this.setVisible(false);
    }
  } else {
    this.setVisible(false);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether this dialog has a title close button.
***REMOVED***
goog.ui.Dialog.prototype.getHasTitleCloseButton = function() {
  return this.hasTitleCloseButton_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the dialog should have a close button in the title bar. There
***REMOVED*** will always be an element for the title close button, but setting this
***REMOVED*** parameter to false will cause it to be hidden and have no active listener.
***REMOVED*** @param {boolean} b Whether this dialog should have a title close button.
***REMOVED***
goog.ui.Dialog.prototype.setHasTitleCloseButton = function(b) {
  this.hasTitleCloseButton_ = b;
  if (this.titleCloseEl_) {
    goog.style.showElement(this.titleCloseEl_, this.hasTitleCloseButton_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the escape key should close this dialog.
***REMOVED***
goog.ui.Dialog.prototype.isEscapeToCancel = function() {
  return this.escapeToCancel_;
***REMOVED***


***REMOVED***
***REMOVED*** @param {boolean} b Whether the escape key should close this dialog.
***REMOVED***
goog.ui.Dialog.prototype.setEscapeToCancel = function(b) {
  this.escapeToCancel_ = b;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the dialog should be disposed when it is hidden.  By default
***REMOVED*** dialogs are not disposed when they are hidden.
***REMOVED*** @param {boolean} b Whether the dialog should get disposed when it gets
***REMOVED***     hidden.
***REMOVED***
goog.ui.Dialog.prototype.setDisposeOnHide = function(b) {
  this.disposeOnHide_ = b;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the dialog should be disposed when it is hidden.
***REMOVED***
goog.ui.Dialog.prototype.getDisposeOnHide = function() {
  return this.disposeOnHide_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Dialog.prototype.disposeInternal = function() {
  this.titleCloseEl_ = null;
  this.buttonEl_ = null;
  goog.base(this, 'disposeInternal');
***REMOVED***


***REMOVED***
***REMOVED*** Sets the button set to use.
***REMOVED*** Note: Passing in null will cause no button set to be rendered.
***REMOVED*** @param {goog.ui.Dialog.ButtonSet?} buttons The button set to use.
***REMOVED***
goog.ui.Dialog.prototype.setButtonSet = function(buttons) {
  this.buttons_ = buttons;
  if (this.buttonEl_) {
    if (this.buttons_) {
      this.buttons_.attachToElement(this.buttonEl_);
    } else {
      this.buttonEl_.innerHTML = '';
    }
    goog.style.showElement(this.buttonEl_, !!this.buttons_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the button set being used.
***REMOVED*** @return {goog.ui.Dialog.ButtonSet?} The button set being used.
***REMOVED***
goog.ui.Dialog.prototype.getButtonSet = function() {
  return this.buttons_;
***REMOVED***


***REMOVED***
***REMOVED*** Handles a click on the button container.
***REMOVED*** @param {goog.events.BrowserEvent} e Browser's event object.
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.onButtonClick_ = function(e) {
  var button = this.findParentButton_(***REMOVED*** @type {Element}***REMOVED*** (e.target));
  if (button && !button.disabled) {
    var key = button.name;
    var caption =***REMOVED*****REMOVED*** @type {Element|string}***REMOVED***(
        this.getButtonSet().get(key));
    if (this.dispatchEvent(new goog.ui.Dialog.Event(key, caption))) {
      this.setVisible(false);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Finds the parent button of an element (or null if there was no button
***REMOVED*** parent).
***REMOVED*** @param {Element} element The element that was clicked on.
***REMOVED*** @return {Element} Returns the parent button or null if not found.
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.findParentButton_ = function(element) {
  var el = element;
  while (el != null && el != this.buttonEl_) {
    if (el.tagName == 'BUTTON') {
      return***REMOVED*****REMOVED*** @type {Element}***REMOVED***(el);
    }
    el = el.parentNode;
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Handles keydown and keypress events, and dismisses the popup if cancel is
***REMOVED*** pressed.  If there is a cancel action in the ButtonSet, than that will be
***REMOVED*** fired.  Also prevents tabbing out of the dialog.
***REMOVED*** @param {goog.events.BrowserEvent} e Browser's event object.
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.prototype.onKey_ = function(e) {
  var close = false;
  var hasHandler = false;
  var buttonSet = this.getButtonSet();
  var target = e.target;

  if (e.type == goog.events.EventType.KEYDOWN) {
    // Escape and tab can only properly be handled in keydown handlers.
    if (this.escapeToCancel_ && e.keyCode == goog.events.KeyCodes.ESC) {
      // Only if there is a valid cancel button is an event dispatched.
      var cancel = buttonSet && buttonSet.getCancel();

      // Users may expect to hit escape on a SELECT element.
      var isSpecialFormElement =
          target.tagName == 'SELECT' && !target.disabled;

      if (cancel && !isSpecialFormElement) {
        hasHandler = true;

        var caption = buttonSet.get(cancel);
        close = this.dispatchEvent(
            new goog.ui.Dialog.Event(cancel,
               ***REMOVED*****REMOVED*** @type {Element|null|string}***REMOVED***(caption)));
      } else if (!isSpecialFormElement) {
        close = true;
      }
    } else if (e.keyCode == goog.events.KeyCodes.TAB && e.shiftKey &&
        target == this.getElement()) {
      // Prevent the user from shift-tabbing backwards out of the dialog box.
      // Instead, set up a wrap in focus backward to the end of the dialog.
      this.setupBackwardTabWrap();
    }
  } else if (e.keyCode == goog.events.KeyCodes.ENTER) {
    // Only handle ENTER in keypress events, in case the action opens a
    // popup window.
    var key;
    if (target.tagName == 'BUTTON') {
      // If focus was on a button, it must have been enabled, so we can fire
      // that button's handler.
      key = target.name;
    } else if (buttonSet) {
      // Try to fire the default button's handler (if one exists), but only if
      // the button is enabled.
      var defaultKey = buttonSet.getDefault();
      var defaultButton = defaultKey && buttonSet.getButton(defaultKey);

      // Users may expect to hit enter on a TEXTAREA, SELECT or an A element.
      var isSpecialFormElement =
          (target.tagName == 'TEXTAREA' || target.tagName == 'SELECT' ||
           target.tagName == 'A') && !target.disabled;

      if (defaultButton && !defaultButton.disabled && !isSpecialFormElement) {
        key = defaultKey;
      }
    }
    if (key && buttonSet) {
      hasHandler = true;
      close = this.dispatchEvent(
          new goog.ui.Dialog.Event(key, String(buttonSet.get(key))));
    }
  }

  if (close || hasHandler) {
    e.stopPropagation();
    e.preventDefault();
  }

  if (close) {
    this.setVisible(false);
  }
***REMOVED***



***REMOVED***
***REMOVED*** Dialog event class.
***REMOVED*** @param {string} key Key identifier for the button.
***REMOVED*** @param {string|Element} caption Caption on the button (might be i18nlized).
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.ui.Dialog.Event = function(key, caption) {
  this.type = goog.ui.Dialog.EventType.SELECT;
  this.key = key;
  this.caption = caption;
***REMOVED***
goog.inherits(goog.ui.Dialog.Event, goog.events.Event);


***REMOVED***
***REMOVED*** Event type constant for dialog events.
***REMOVED*** TODO(attila): Change this to goog.ui.Dialog.EventType.SELECT.
***REMOVED*** @type {string}
***REMOVED*** @deprecated Use goog.ui.Dialog.EventType.SELECT.
***REMOVED***
goog.ui.Dialog.SELECT_EVENT = 'dialogselect';


***REMOVED***
***REMOVED*** Events dispatched by dialogs.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.Dialog.EventType = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched when the user closes the dialog.
  ***REMOVED*** The dispatched event will always be of type {@link goog.ui.Dialog.Event}.
  ***REMOVED*** Canceling the event will prevent the dialog from closing.
 ***REMOVED*****REMOVED***
  SELECT: 'dialogselect',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched after the dialog is closed. Not cancelable.
  ***REMOVED*** @deprecated Use goog.ui.PopupBase.EventType.HIDE.
 ***REMOVED*****REMOVED***
  AFTER_HIDE: 'afterhide',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched after the dialog is shown. Not cancelable.
  ***REMOVED*** @deprecated Use goog.ui.PopupBase.EventType.SHOW.
 ***REMOVED*****REMOVED***
  AFTER_SHOW: 'aftershow'
***REMOVED***



***REMOVED***
***REMOVED*** A button set defines the behaviour of a set of buttons that the dialog can
***REMOVED*** show.  Uses the {@link goog.structs.Map} interface.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link
***REMOVED***    goog.ui.Component} for semantics.
***REMOVED***
***REMOVED*** @extends {goog.structs.Map}
***REMOVED***
goog.ui.Dialog.ButtonSet = function(opt_domHelper) {
  // TODO(attila):  Refactor ButtonSet to extend goog.ui.Component?
  this.dom_ = opt_domHelper || goog.dom.getDomHelper();
  goog.structs.Map.call(this);
***REMOVED***
goog.inherits(goog.ui.Dialog.ButtonSet, goog.structs.Map);


***REMOVED***
***REMOVED*** A CSS className for this component.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.class_ = goog.getCssName('goog-buttonset');


***REMOVED***
***REMOVED*** The button that has default focus (references key in buttons_ map).
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.defaultButton_ = null;


***REMOVED***
***REMOVED*** Optional container the button set should be rendered into.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.element_ = null;


***REMOVED***
***REMOVED*** The button whose action is associated with the escape key and the X button
***REMOVED*** on the dialog.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.cancelButton_ = null;


***REMOVED***
***REMOVED*** Adds a button to the button set.  Buttons will be displayed in the order they
***REMOVED*** are added.
***REMOVED***
***REMOVED*** @param {*} key Key used to identify the button in events.
***REMOVED*** @param {*} caption A string caption or a DOM node that can be
***REMOVED***     appended to a button element.
***REMOVED*** @param {boolean=} opt_isDefault Whether this button is the default button,
***REMOVED***     Dialog will dispatch for this button if enter is pressed.
***REMOVED*** @param {boolean=} opt_isCancel Whether this button has the same behaviour as
***REMOVED***    cancel.  If escape is pressed this button will fire.
***REMOVED*** @return {!goog.ui.Dialog.ButtonSet} The button set, to make it easy to chain
***REMOVED***    "set" calls and build new ButtonSets.
***REMOVED*** @override
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.set = function(key, caption,
    opt_isDefault, opt_isCancel) {
  goog.structs.Map.prototype.set.call(this, key, caption);

  if (opt_isDefault) {
    this.defaultButton_ =***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (key);
  }
  if (opt_isCancel) {
    this.cancelButton_ =***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (key);
  }

  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a button (an object with a key and caption) to this button set. Buttons
***REMOVED*** will be displayed in the order they are added.
***REMOVED*** @see goog.ui.Dialog.DefaultButtons
***REMOVED*** @param {!{key: string, caption: string}} button The button key and caption.
***REMOVED*** @param {boolean=} opt_isDefault Whether this button is the default button.
***REMOVED***     Dialog will dispatch for this button if enter is pressed.
***REMOVED*** @param {boolean=} opt_isCancel Whether this button has the same behavior as
***REMOVED***     cancel. If escape is pressed this button will fire.
***REMOVED*** @return {!goog.ui.Dialog.ButtonSet} The button set, to make it easy to chain
***REMOVED***     "addButton" calls and build new ButtonSets.
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.addButton = function(button, opt_isDefault,
    opt_isCancel) {
  return this.set(button.key, button.caption, opt_isDefault, opt_isCancel);
***REMOVED***


***REMOVED***
***REMOVED*** Attaches the button set to an element, rendering it inside.
***REMOVED*** @param {Element} el Container.
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.attachToElement = function(el) {
  this.element_ = el;
  this.render();
***REMOVED***


***REMOVED***
***REMOVED*** Renders the button set inside its container element.
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.render = function() {
  if (this.element_) {
    this.element_.innerHTML = '';
    var domHelper = goog.dom.getDomHelper(this.element_);
    goog.structs.forEach(this, function(caption, key) {
      var button = domHelper.createDom('button', {'name': key}, caption);
      if (key == this.defaultButton_) {
        button.className = goog.getCssName(this.class_, 'default');
      }
      this.element_.appendChild(button);
    }, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Decorates the given element by adding any {@code button} elements found
***REMOVED*** among its descendants to the button set.  The first button found is assumed
***REMOVED*** to be the default and will receive focus when the button set is rendered.
***REMOVED*** If a button with a name of {@link goog.ui.Dialog.DefaultButtonKeys.CANCEL}
***REMOVED*** is found, it is assumed to have "Cancel" semantics.
***REMOVED*** TODO(attila):  ButtonSet should be a goog.ui.Component.  Really.
***REMOVED*** @param {Element} element The element to decorate; should contain buttons.
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.decorate = function(element) {
  if (!element || element.nodeType != goog.dom.NodeType.ELEMENT) {
    return;
  }

  this.element_ = element;
  var buttons = this.element_.getElementsByTagName('button');
  for (var i = 0, button, key, caption; button = buttons[i]; i++) {
    // Buttons should have a "name" attribute and have their caption defined by
    // their innerHTML, but not everyone knows this, and we should play nice.
    key = button.name || button.id;
    caption = goog.dom.getTextContent(button) || button.value;
    if (key) {
      var isDefault = i == 0;
      var isCancel = button.name == goog.ui.Dialog.DefaultButtonKeys.CANCEL;
      this.set(key, caption, isDefault, isCancel);
      if (isDefault) {
        goog.dom.classes.add(button, goog.getCssName(this.class_,
            'default'));
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the component's element.
***REMOVED*** @return {Element} The element for the component.
***REMOVED*** TODO(user): Remove after refactoring to goog.ui.Component.
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.getElement = function() {
  return this.element_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the dom helper that is being used on this component.
***REMOVED*** @return {!goog.dom.DomHelper} The dom helper used on this component.
***REMOVED*** TODO(user): Remove after refactoring to goog.ui.Component.
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.getDomHelper = function() {
  return this.dom_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the default button.
***REMOVED*** @param {?string} key The default button.
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.setDefault = function(key) {
  this.defaultButton_ = key;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the default button.
***REMOVED*** @return {?string} The default button.
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.getDefault = function() {
  return this.defaultButton_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the cancel button.
***REMOVED*** @param {?string} key The cancel button.
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.setCancel = function(key) {
  this.cancelButton_ = key;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the cancel button.
***REMOVED*** @return {?string} The cancel button.
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.getCancel = function() {
  return this.cancelButton_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the HTML Button element.
***REMOVED*** @param {string} key The button to return.
***REMOVED*** @return {Element} The button, if found else null.
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.getButton = function(key) {
  var buttons = this.getAllButtons();
  for (var i = 0, nextButton; nextButton = buttons[i]; i++) {
    if (nextButton.name == key || nextButton.id == key) {
      return nextButton;
    }
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns all the HTML Button elements in the button set container.
***REMOVED*** @return {NodeList} A live NodeList of the buttons.
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.getAllButtons = function() {
  return this.element_.getElementsByTagName(goog.dom.TagName.BUTTON);
***REMOVED***


***REMOVED***
***REMOVED*** Enables or disables a button in this set by key. If the button is not found,
***REMOVED*** does nothing.
***REMOVED*** @param {string} key The button to enable or disable.
***REMOVED*** @param {boolean} enabled True to enable; false to disable.
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.setButtonEnabled = function(key, enabled) {
  var button = this.getButton(key);
  if (button) {
    button.disabled = !enabled;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Enables or disables all of the buttons in this set.
***REMOVED*** @param {boolean} enabled True to enable; false to disable.
***REMOVED***
goog.ui.Dialog.ButtonSet.prototype.setAllButtonsEnabled = function(enabled) {
  var allButtons = this.getAllButtons();
  for (var i = 0, button; button = allButtons[i]; i++) {
    button.disabled = !enabled;
  }
***REMOVED***


***REMOVED***
***REMOVED*** The keys used to identify standard buttons in events.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.Dialog.DefaultButtonKeys = {
  OK: 'ok',
  CANCEL: 'cancel',
  YES: 'yes',
  NO: 'no',
  SAVE: 'save',
  CONTINUE: 'continue'
***REMOVED***


***REMOVED***
***REMOVED*** @desc Standard caption for the dialog 'OK' button.
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.MSG_DIALOG_OK_ = goog.getMsg('OK');


***REMOVED***
***REMOVED*** @desc Standard caption for the dialog 'Cancel' button.
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.MSG_DIALOG_CANCEL_ = goog.getMsg('Cancel');


***REMOVED***
***REMOVED*** @desc Standard caption for the dialog 'Yes' button.
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.MSG_DIALOG_YES_ = goog.getMsg('Yes');


***REMOVED***
***REMOVED*** @desc Standard caption for the dialog 'No' button.
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.MSG_DIALOG_NO_ = goog.getMsg('No');


***REMOVED***
***REMOVED*** @desc Standard caption for the dialog 'Save' button.
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.MSG_DIALOG_SAVE_ = goog.getMsg('Save');


***REMOVED***
***REMOVED*** @desc Standard caption for the dialog 'Continue' button.
***REMOVED*** @private
***REMOVED***
goog.ui.Dialog.MSG_DIALOG_CONTINUE_ = goog.getMsg('Continue');


***REMOVED***
***REMOVED*** The default captions for the default buttons.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.Dialog.DefaultButtonCaptions = {
  OK: goog.ui.Dialog.MSG_DIALOG_OK_,
  CANCEL: goog.ui.Dialog.MSG_DIALOG_CANCEL_,
  YES: goog.ui.Dialog.MSG_DIALOG_YES_,
  NO: goog.ui.Dialog.MSG_DIALOG_NO_,
  SAVE: goog.ui.Dialog.MSG_DIALOG_SAVE_,
  CONTINUE: goog.ui.Dialog.MSG_DIALOG_CONTINUE_
***REMOVED***


***REMOVED***
***REMOVED*** The standard buttons (keys associated with captions).
***REMOVED*** @enum {!{key: string, caption: string}}
***REMOVED***
goog.ui.Dialog.ButtonSet.DefaultButtons = {
  OK: {
    key: goog.ui.Dialog.DefaultButtonKeys.OK,
    caption: goog.ui.Dialog.DefaultButtonCaptions.OK
  },
  CANCEL: {
    key: goog.ui.Dialog.DefaultButtonKeys.CANCEL,
    caption: goog.ui.Dialog.DefaultButtonCaptions.CANCEL
  },
  YES: {
    key: goog.ui.Dialog.DefaultButtonKeys.YES,
    caption: goog.ui.Dialog.DefaultButtonCaptions.YES
  },
  NO: {
    key: goog.ui.Dialog.DefaultButtonKeys.NO,
    caption: goog.ui.Dialog.DefaultButtonCaptions.NO
  },
  SAVE: {
    key: goog.ui.Dialog.DefaultButtonKeys.SAVE,
    caption: goog.ui.Dialog.DefaultButtonCaptions.SAVE
  },
  CONTINUE: {
    key: goog.ui.Dialog.DefaultButtonKeys.CONTINUE,
    caption: goog.ui.Dialog.DefaultButtonCaptions.CONTINUE
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new ButtonSet with a single 'OK' button, which is also set with
***REMOVED*** cancel button semantics so that pressing escape will close the dialog.
***REMOVED*** @return {!goog.ui.Dialog.ButtonSet} The created ButtonSet.
***REMOVED***
goog.ui.Dialog.ButtonSet.createOk = function() {
  return new goog.ui.Dialog.ButtonSet().
      addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.OK, true, true);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new ButtonSet with 'OK' (default) and 'Cancel' buttons.
***REMOVED*** @return {!goog.ui.Dialog.ButtonSet} The created ButtonSet.
***REMOVED***
goog.ui.Dialog.ButtonSet.createOkCancel = function() {
  return new goog.ui.Dialog.ButtonSet().
      addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.OK, true).
      addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, false, true);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new ButtonSet with 'Yes' (default) and 'No' buttons.
***REMOVED*** @return {!goog.ui.Dialog.ButtonSet} The created ButtonSet.
***REMOVED***
goog.ui.Dialog.ButtonSet.createYesNo = function() {
  return new goog.ui.Dialog.ButtonSet().
      addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.YES, true).
      addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.NO, false, true);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new ButtonSet with 'Yes', 'No' (default), and 'Cancel' buttons.
***REMOVED*** @return {!goog.ui.Dialog.ButtonSet} The created ButtonSet.
***REMOVED***
goog.ui.Dialog.ButtonSet.createYesNoCancel = function() {
  return new goog.ui.Dialog.ButtonSet().
      addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.YES).
      addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.NO, true).
      addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, false, true);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new ButtonSet with 'Continue', 'Save', and 'Cancel' (default)
***REMOVED*** buttons.
***REMOVED*** @return {!goog.ui.Dialog.ButtonSet} The created ButtonSet.
***REMOVED***
goog.ui.Dialog.ButtonSet.createContinueSaveCancel = function() {
  return new goog.ui.Dialog.ButtonSet().
      addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CONTINUE).
      addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.SAVE).
      addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, true, true);
***REMOVED***


// TODO(user): These shared instances should be phased out.
(function() {
  if (typeof document != 'undefined') {
   ***REMOVED*****REMOVED*** @deprecated Use goog.ui.Dialog.ButtonSet#createOk.***REMOVED***
    goog.ui.Dialog.ButtonSet.OK = goog.ui.Dialog.ButtonSet.createOk();

   ***REMOVED*****REMOVED*** @deprecated Use goog.ui.Dialog.ButtonSet#createOkCancel.***REMOVED***
    goog.ui.Dialog.ButtonSet.OK_CANCEL =
        goog.ui.Dialog.ButtonSet.createOkCancel();

   ***REMOVED*****REMOVED*** @deprecated Use goog.ui.Dialog.ButtonSet#createYesNo.***REMOVED***
    goog.ui.Dialog.ButtonSet.YES_NO = goog.ui.Dialog.ButtonSet.createYesNo();

   ***REMOVED*****REMOVED*** @deprecated Use goog.ui.Dialog.ButtonSet#createYesNoCancel.***REMOVED***
    goog.ui.Dialog.ButtonSet.YES_NO_CANCEL =
        goog.ui.Dialog.ButtonSet.createYesNoCancel();

   ***REMOVED*****REMOVED*** @deprecated Use goog.ui.Dialog.ButtonSet#createContinueSaveCancel.***REMOVED***
    goog.ui.Dialog.ButtonSet.CONTINUE_SAVE_CANCEL =
        goog.ui.Dialog.ButtonSet.createContinueSaveCancel();
  }
})();
