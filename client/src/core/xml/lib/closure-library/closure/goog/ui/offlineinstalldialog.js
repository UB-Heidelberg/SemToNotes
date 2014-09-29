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
***REMOVED*** @fileoverview A dialog for presenting the offline (Gears) install flow. It
***REMOVED*** show information on how to install Gears if Gears is not already installed,
***REMOVED*** or will offer the option to enable the application for Gears support.
***REMOVED***
***REMOVED*** @see ../demos/offline.html
***REMOVED***

goog.provide('goog.ui.OfflineInstallDialog');
goog.provide('goog.ui.OfflineInstallDialog.ButtonKeyType');
goog.provide('goog.ui.OfflineInstallDialog.EnableScreen');
goog.provide('goog.ui.OfflineInstallDialog.InstallScreen');
goog.provide('goog.ui.OfflineInstallDialog.InstallingGearsScreen');
goog.provide('goog.ui.OfflineInstallDialog.ScreenType');
goog.provide('goog.ui.OfflineInstallDialog.UpgradeScreen');
goog.provide('goog.ui.OfflineInstallDialogScreen');

goog.require('goog.Disposable');
goog.require('goog.dom.classes');
goog.require('goog.gears');
goog.require('goog.string');
goog.require('goog.string.StringBuffer');
goog.require('goog.ui.Dialog');
goog.require('goog.ui.Dialog.ButtonSet');
goog.require('goog.ui.Dialog.EventType');
goog.require('goog.window');



***REMOVED***
***REMOVED*** An offline install dialog.
***REMOVED*** @param {string=} opt_class CSS class name for the dialog element, also used
***REMOVED***    as a class name prefix for related elements; defaults to modal-dialog.
***REMOVED*** @param {boolean=} opt_useIframeMask Work around windowed controls z-index
***REMOVED***     issue by using an iframe instead of a div for bg element.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Dialog}
***REMOVED***
goog.ui.OfflineInstallDialog = function(
    opt_class, opt_useIframeMask, opt_domHelper) {
  goog.ui.Dialog.call(this, opt_class, opt_useIframeMask, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** This is used to allow more screens to be added programatically. It is a
  ***REMOVED*** map from screen type to a constructor that extends
  ***REMOVED*** goog.ui.OfflineInstallDialogScreen.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.screenConstructors_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** This is a map of constructed screens. It uses the constructors in the
  ***REMOVED*** screenConstructors_ map.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.screens_ = {***REMOVED***

  this.currentScreenType_ = goog.gears.hasFactory() ?
      goog.ui.OfflineInstallDialog.ScreenType.ENABLE :
      goog.ui.OfflineInstallDialog.ScreenType.INSTALL;

  this.registerScreenType(goog.ui.OfflineInstallDialog.EnableScreen.TYPE,
                          goog.ui.OfflineInstallDialog.EnableScreen);
  this.registerScreenType(goog.ui.OfflineInstallDialog.InstallScreen.TYPE,
                          goog.ui.OfflineInstallDialog.InstallScreen);
  this.registerScreenType(goog.ui.OfflineInstallDialog.UpgradeScreen.TYPE,
                          goog.ui.OfflineInstallDialog.UpgradeScreen);
  this.registerScreenType(
      goog.ui.OfflineInstallDialog.InstallingGearsScreen.TYPE,
      goog.ui.OfflineInstallDialog.InstallingGearsScreen);
***REMOVED***
goog.inherits(goog.ui.OfflineInstallDialog, goog.ui.Dialog);


***REMOVED***
***REMOVED*** Buttons keys of the dialog.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.OfflineInstallDialog.ButtonKeyType = {
  INSTALL: 'io',
  UPGRADE: 'u',
  ENABLE: 'eo',
  CANCEL: 'ca',
  CLOSE: 'cl',
  OK: 'ok'
***REMOVED***


***REMOVED***
***REMOVED*** The various types of screens the dialog can display.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.OfflineInstallDialog.ScreenType = {
  INSTALL: 'i',
  INSTALLING_GEARS: 'ig',
  ENABLE: 'e',
  UPGRADE: 'u'
***REMOVED***


***REMOVED***
***REMOVED*** Whether the dialog is dirty and requires an upate to its display.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.dirty_ = false;


***REMOVED***
***REMOVED*** The type of the current screen of the dialog.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.currentScreenType_;


***REMOVED***
***REMOVED*** The url of the application.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.appUrl_ = '';


***REMOVED***
***REMOVED*** The url of the page to download Gears from.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.gearsDownloadPageUrl_ = '';


***REMOVED***
***REMOVED*** Marks as dirty and calls update if needed.
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.invalidateAndUpdate_ = function() {
  this.dirty_ = true;
  if (this.getElement() && this.isVisible()) {
    this.update();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the URL of the appliction to show in the dialog.
***REMOVED*** @param {string} url The application URL.
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.setAppUrl = function(url) {
  this.appUrl_ = url;
  this.invalidateAndUpdate_();
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The application URL.
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.getAppUrl = function() {
  return this.appUrl_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the Gears download page URL.
***REMOVED*** @param {string} url The Gears download page URL.
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.setGearsDownloadPageUrl = function(url) {
  this.gearsDownloadPageUrl_ = url;
  this.invalidateAndUpdate_();
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The Gears download page URL.
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.getGearsDownloadPageUrl = function() {
  return this.gearsDownloadPageUrl_;
***REMOVED***


***REMOVED***
***REMOVED*** This allows you to provide a shorter and more user friendly URL to the Gears
***REMOVED*** download page since the Gears download URL can get quite ugly with all its
***REMOVED*** params.
***REMOVED*** @return {string} The Gears download page friendly URL.
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.getGearsDownloadPageFriendlyUrl =
    function() {
  return this.gearsDownloadPageFriendlyUrl_ || this.gearsDownloadPageUrl_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the Gears download page friendly URL.
***REMOVED*** @see #getGearsDownloadPageFriendlyUrl
***REMOVED*** @param {string} url The Gears download page friendly URL.
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.setGearsDownloadPageFriendlyUrl =
    function(url) {
  this.gearsDownloadPageFriendlyUrl_ = url;
  this.invalidateAndUpdate_();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the screen type.
***REMOVED*** @param {string} screenType The screen type.
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.setCurrentScreenType = function(
    screenType) {
  if (screenType != this.currentScreenType_) {
    // If we have a current screen object then call deactivate on it
    var currentScreen = this.getCurrentScreen();
    if (currentScreen && this.isInDocument()) {
      currentScreen.deactivate();
    }
    this.currentScreenType_ = screenType;
    this.invalidateAndUpdate_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The screen type.
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.getCurrentScreenType = function() {
  return this.currentScreenType_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.OfflineInstallDialogScreen?} The current screen object.
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.getCurrentScreen = function() {
  return this.getScreen(this.currentScreenType_);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the screen object for a given registered type or null if no such type
***REMOVED*** exists. This will create a screen object for a registered type as needed.
***REMOVED*** @param {string} type  The type of screen to get.
***REMOVED*** @return {goog.ui.OfflineInstallDialogScreen?} The screen object.
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.getScreen = function(type) {
  if (this.screens_[type]) {
    return this.screens_[type];
  }
  // Construct lazily as needed
  if (this.screenConstructors_[type]) {
    return this.screens_[type] = new this.screenConstructors_[type](this);
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Registers a screen constructor to be usable with the dialog.
***REMOVED*** @param {string} type  The type of this screen.
***REMOVED*** @param {Function} constr  A function that represents a constructor that
***REMOVED***     extends goog.ui.OfflineInstallDialogScreen.
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.registerScreenType = function(type,
                                                                     constr) {
  this.screenConstructors_[type] = constr;
  // Remove screen in case it already exists.
  if (this.screens_[type]) {
    var isCurrenScreenType = this.currentScreenType_ == type;
    this.screens_[type].dispose();
    delete this.screens_[type];
    if (isCurrenScreenType) {
      this.invalidateAndUpdate_();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Registers an instance of a screen to be usable with the dialog.
***REMOVED*** @param {goog.ui.OfflineInstallDialogScreen} screen The screen to register.
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.registerScreen = function(screen) {
  this.screens_[screen.getType()] = screen;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.OfflineInstallDialog.prototype.setVisible = function(visible) {
  if (this.isInDocument() && visible) {
    if (this.dirty_) {
      this.update();
    }
  }

  goog.ui.OfflineInstallDialog.superClass_.setVisible.call(this, visible);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.OfflineInstallDialog.prototype.createDom = function() {
  goog.ui.OfflineInstallDialog.superClass_.createDom.call(this);
  this.update();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.OfflineInstallDialog.prototype.enterDocument = function() {
  goog.ui.OfflineInstallDialog.superClass_.enterDocument.call(this);

  this.getHandler().listen(
      this, goog.ui.Dialog.EventType.SELECT, this.handleSelect_);

  if (this.dirty_) {
    this.update();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the dialog. This will ensure the correct screen is shown.
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.update = function() {
  if (this.getElement()) {
    var screen = this.getCurrentScreen();
    if (screen) {
      screen.activate();
    }

    // Clear the dirty state.
    this.dirty_ = false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles the SELECT_EVENT for the current dialog. Forward the event to the
***REMOVED*** correct screen object and let the screen decide where to go next.
***REMOVED*** @param {goog.ui.Dialog.Event} e The event.
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.handleSelect_ = function(e) {
  var screen = this.getCurrentScreen();
  if (screen) {
    screen.handleSelect(e);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Opens a new browser window with the Gears download page and changes
***REMOVED*** the screen to the installing gears page.
***REMOVED***
goog.ui.OfflineInstallDialog.prototype.goToGearsDownloadPage = function() {
  goog.window.open(this.gearsDownloadPageUrl_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.OfflineInstallDialog.prototype.disposeInternal = function() {
  goog.ui.OfflineInstallDialog.superClass_.disposeInternal.call(this);

  delete this.screenConstructors_;
  for (var type in this.screens_) {
    this.screens_[type].dispose();
  }
  delete this.screens_;
***REMOVED***



***REMOVED***
***REMOVED*** Represents a screen on the dialog. You can create new screens and add them
***REMOVED*** to the offline install dialog by calling registerScreenType and
***REMOVED*** setCurrentScreenType.
***REMOVED*** @param {goog.ui.OfflineInstallDialog} dialog  The dialog this screen should
***REMOVED***     work with.
***REMOVED*** @param {string} type  The screen type name.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.ui.OfflineInstallDialogScreen = function(dialog, type) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {goog.ui.OfflineInstallDialog}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore}
 ***REMOVED*****REMOVED***
  this.dialog_ = dialog;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.type_ = type;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {goog.dom.DomHelper}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.dom_ = dialog.getDomHelper();
***REMOVED***
goog.inherits(goog.ui.OfflineInstallDialogScreen, goog.Disposable);


***REMOVED***
***REMOVED*** The HTML content to show on the screen.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineInstallDialogScreen.prototype.content_ = '';


***REMOVED***
***REMOVED*** The title to show on the dialog.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineInstallDialogScreen.prototype.title_ = '';


***REMOVED***
***REMOVED*** The button set to use with this screen.
***REMOVED*** @type {goog.ui.Dialog.ButtonSet}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineInstallDialogScreen.prototype.buttonSet_;


***REMOVED***
***REMOVED*** @return {goog.ui.OfflineInstallDialog} The dialog the screen will be
***REMOVED***     displayed in.
***REMOVED***
goog.ui.OfflineInstallDialogScreen.prototype.getDialog = function() {
  return this.dialog_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the type of the screen. This is used to identify the screen type this
***REMOVED*** reflects.
***REMOVED*** @return {string} The type of the screen.
***REMOVED***
goog.ui.OfflineInstallDialogScreen.prototype.getType = function() {
  return this.type_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.Dialog.ButtonSet} The button set to use with this screen.
***REMOVED***
goog.ui.OfflineInstallDialogScreen.prototype.getButtonSet = function() {
  return this.buttonSet_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the button set to use with this screen.
***REMOVED*** @param {goog.ui.Dialog.ButtonSet} bs The button set to use.
***REMOVED***
goog.ui.OfflineInstallDialogScreen.prototype.setButtonSet = function(bs) {
  this.buttonSet_ = bs;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The HTML content to used for this screen.
***REMOVED***
goog.ui.OfflineInstallDialogScreen.prototype.getContent = function() {
  return this.content_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the HTML content to use for this screen.
***REMOVED*** @param {string} html  The HTML text to use as content for the screen.
***REMOVED***
goog.ui.OfflineInstallDialogScreen.prototype.setContent = function(html) {
  this.content_ = html;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The text title to used for the dialog when this screen is
***REMOVED***     shown.
***REMOVED***
goog.ui.OfflineInstallDialogScreen.prototype.getTitle = function() {
  return this.title_ || this.dialog_.getTitle();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the plain text title to use for this screen.
***REMOVED*** @param {string} title  The plain text to use as a title on the dialog.
***REMOVED***
goog.ui.OfflineInstallDialogScreen.prototype.setTitle = function(title) {
  this.title_ = title;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} A custom class name that should be added to the dialog when
***REMOVED***     this screen is active.
***REMOVED***
goog.ui.OfflineInstallDialogScreen.prototype.getCustomClassName = function() {
  return this.customClassName_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the custom class name that should be added to the dialog when this
***REMOVED*** screen is active.
***REMOVED*** @param {string} customClassName  The custom class name.
***REMOVED***
goog.ui.OfflineInstallDialogScreen.prototype.setCustomClassName = function(
    customClassName) {
  this.customClassName_ = customClassName;
***REMOVED***


***REMOVED***
***REMOVED*** Called when the screen is shown. At this point the dialog is in the document.
***REMOVED***
goog.ui.OfflineInstallDialogScreen.prototype.activate = function() {
  var d = this.dialog_;
  // Add custom class.
  var customClassName = this.getCustomClassName();
  if (customClassName) {
    goog.dom.classes.add(d.getElement(), customClassName);
  }

  d.setTitle(this.getTitle());
  d.setContent(this.getContent());
  d.setButtonSet(this.getButtonSet());
***REMOVED***


***REMOVED***
***REMOVED*** Called when the screen is hidden.  At this point the dialog is in the
***REMOVED*** document.
***REMOVED***
goog.ui.OfflineInstallDialogScreen.prototype.deactivate = function() {
  // Remove custom class name
  var customClassName = this.getCustomClassName();
  if (customClassName) {
    goog.dom.classes.remove(this.dialog_.getElement(), customClassName);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Called when the user clicks any of the buttons for this dialog screen.
***REMOVED*** @param {goog.ui.Dialog.Event} e The dialog event.
***REMOVED***
goog.ui.OfflineInstallDialogScreen.prototype.handleSelect = function(e) {

***REMOVED***



// Classes for some of the standard screens



***REMOVED***
***REMOVED*** This screen is shown to users that do have Gears installed but have
***REMOVED*** not enabled the current application for offline access.
***REMOVED*** @param {goog.ui.OfflineInstallDialog} dialog  The dialog this is a screen
***REMOVED***     for.
***REMOVED***
***REMOVED*** @extends {goog.ui.OfflineInstallDialogScreen}
***REMOVED***
goog.ui.OfflineInstallDialog.EnableScreen = function(dialog) {
  goog.ui.OfflineInstallDialogScreen.call(this, dialog,
      goog.ui.OfflineInstallDialog.EnableScreen.TYPE);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @desc Text of button that enables offline functionality for the app.
  ***REMOVED*** @hidden
 ***REMOVED*****REMOVED***
  var MSG_OFFLINE_DIALOG_ENABLE_GEARS = goog.getMsg('Enable offline access');

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore}
 ***REMOVED*****REMOVED***
  this.enableMsg_ = MSG_OFFLINE_DIALOG_ENABLE_GEARS;
***REMOVED***
goog.inherits(goog.ui.OfflineInstallDialog.EnableScreen,
              goog.ui.OfflineInstallDialogScreen);


***REMOVED***
***REMOVED*** The type of this screen.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.OfflineInstallDialog.EnableScreen.TYPE =
    goog.ui.OfflineInstallDialog.ScreenType.ENABLE;


***REMOVED***
***REMOVED*** Should enable button action be performed immediately when the user presses
***REMOVED*** the enter key anywhere on the dialog. This should be set to false if there
***REMOVED*** are other action handlers on the dialog that may stop propagation.
***REMOVED*** @type {boolean}
***REMOVED*** @protected
***REMOVED***
goog.ui.OfflineInstallDialog.EnableScreen.prototype.enableOnEnter = true;


***REMOVED***
***REMOVED*** @return {goog.ui.Dialog.ButtonSet} The button set for the enable screen.
***REMOVED*** @override
***REMOVED***
goog.ui.OfflineInstallDialog.EnableScreen.prototype.getButtonSet = function() {
  if (!this.buttonSet_) {

   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Text of button that cancels setting up Offline.
    ***REMOVED*** @hidden
   ***REMOVED*****REMOVED***
    var MSG_OFFLINE_DIALOG_CANCEL = goog.getMsg('Cancel');
    var buttonSet = this.buttonSet_ = new goog.ui.Dialog.ButtonSet(this.dom_);
    buttonSet.set(goog.ui.OfflineInstallDialog.ButtonKeyType.ENABLE,
        this.enableMsg_, this.enableOnEnter, false);
    buttonSet.set(goog.ui.OfflineInstallDialog.ButtonKeyType.CANCEL,
        MSG_OFFLINE_DIALOG_CANCEL, false, true);
  }

  return this.buttonSet_;
***REMOVED***



***REMOVED***
***REMOVED*** This screen is shown to users that do have Gears installed but have
***REMOVED*** not enabled the current application for offline access.
***REMOVED*** @param {goog.ui.OfflineInstallDialog} dialog  The dialog this is a screen
***REMOVED***     for.
***REMOVED*** @param {string=} opt_type An optional type, for specifying a more specific
***REMOVED***     type of dialog. Only for use by subclasses.
***REMOVED***
***REMOVED*** @extends {goog.ui.OfflineInstallDialogScreen}
***REMOVED***
goog.ui.OfflineInstallDialog.InstallScreen = function(dialog, opt_type) {
  goog.ui.OfflineInstallDialogScreen.call(this, dialog,
      opt_type || goog.ui.OfflineInstallDialog.InstallScreen.TYPE);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @desc The description of the the install step to perform in order to
  ***REMOVED***     enable offline access.
  ***REMOVED*** @hidden
 ***REMOVED*****REMOVED***
  var MSG_OFFLINE_DIALOG_INSTALL_GEARS = goog.getMsg('Install Gears');

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore}
 ***REMOVED*****REMOVED***
  this.installMsg_ = MSG_OFFLINE_DIALOG_INSTALL_GEARS;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @desc Text of button that opens the download page for Gears.
  ***REMOVED*** @hidden
 ***REMOVED*****REMOVED***
  var MSG_INSTALL_GEARS = goog.getMsg('Get Gears now');

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore}
 ***REMOVED*****REMOVED***
  this.enableMsg_ = MSG_INSTALL_GEARS;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @desc Text of button that cancels setting up Offline.
  ***REMOVED*** @hidden
 ***REMOVED*****REMOVED***
  var MSG_OFFLINE_DIALOG_CANCEL_2 = goog.getMsg('Cancel');

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.cancelMsg_ = MSG_OFFLINE_DIALOG_CANCEL_2;
***REMOVED***
goog.inherits(goog.ui.OfflineInstallDialog.InstallScreen,
              goog.ui.OfflineInstallDialogScreen);


***REMOVED***
***REMOVED*** The type of this screen.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.OfflineInstallDialog.InstallScreen.TYPE =
    goog.ui.OfflineInstallDialog.ScreenType.INSTALL;


***REMOVED***
***REMOVED*** The text to show before the installation steps.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineInstallDialog.InstallScreen.prototype.installDescription_ = '';


***REMOVED***
***REMOVED*** The CSS className to use when showing the app url.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineInstallDialog.InstallScreen.prototype.appUrlClassName_ =
    goog.getCssName('goog-offlinedialog-url');


***REMOVED***
***REMOVED*** The CSS className for the element that contains the install steps.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineInstallDialog.InstallScreen.prototype.stepsClassName_ =
    goog.getCssName('goog-offlinedialog-steps');


***REMOVED***
***REMOVED*** The CSS className for each step element.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineInstallDialog.InstallScreen.prototype.stepClassName_ =
    goog.getCssName('goog-offlinedialog-step');


***REMOVED***
***REMOVED*** The CSS className for the element that shows the step number.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineInstallDialog.InstallScreen.prototype.stepNumberClassName_ =
    goog.getCssName('goog-offlinedialog-step-number');


***REMOVED***
***REMOVED*** The CSS className for the element that shows the step desccription.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineInstallDialog.InstallScreen.prototype.stepDescriptionClassName_ =
    goog.getCssName('goog-offlinedialog-step-description');


***REMOVED***
***REMOVED*** Should install button action be performed immediately when the user presses
***REMOVED*** the enter key anywhere on the dialog. This should be set to false if there
***REMOVED*** are other action handlers on the dialog that may stop propagation.
***REMOVED*** @type {boolean}
***REMOVED*** @protected
***REMOVED***
goog.ui.OfflineInstallDialog.InstallScreen.prototype.isInstallButtonDefault =
    true;


***REMOVED***
***REMOVED*** @return {goog.ui.Dialog.ButtonSet} The button set for the install screen.
***REMOVED*** @override
***REMOVED***
goog.ui.OfflineInstallDialog.InstallScreen.prototype.getButtonSet = function() {
  if (!this.buttonSet_) {
    var buttonSet = this.buttonSet_ = new goog.ui.Dialog.ButtonSet(this.dom_);
    buttonSet.set(goog.ui.OfflineInstallDialog.ButtonKeyType.INSTALL,
        this.enableMsg_, this.isInstallButtonDefault, false);
    buttonSet.set(goog.ui.OfflineInstallDialog.ButtonKeyType.CANCEL,
        this.cancelMsg_, false, true);
  }

  return this.buttonSet_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the install description. This is the text before the installation steps.
***REMOVED*** @param {string} description  The install description.
***REMOVED***
goog.ui.OfflineInstallDialog.InstallScreen.prototype.setInstallDescription =
    function(description) {
  this.installDescription_ = description;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.OfflineInstallDialog.InstallScreen.prototype.getContent = function() {
  if (!this.content_) {
    var sb = new goog.string.StringBuffer(this.installDescription_);

   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Header for the section that states the steps for the user to
    ***REMOVED***     perform in order to enable offline access.
    ***REMOVED*** @hidden
   ***REMOVED*****REMOVED***
    var MSG_OFFLINE_DIALOG_NEED_TO = goog.getMsg('You\'ll need to:');
    sb.append('<div class="', this.stepsClassName_, '">',
        MSG_OFFLINE_DIALOG_NEED_TO);

    // Create and append the html for step #1.

    sb.append(this.getStepHtml_(1, this.installMsg_));

    // Create and append the html for step #2.
   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc One of the steps to perform in order to enable offline access.
    ***REMOVED*** @hidden
   ***REMOVED*****REMOVED***
    var MSG_OFFLINE_DIALOG_RESTART_BROWSER = goog.getMsg(
        'Restart your browser');
    sb.append(this.getStepHtml_(2, MSG_OFFLINE_DIALOG_RESTART_BROWSER));

    // Create and append the html for step #3.
   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc One of the steps to perform in order to enable offline access.
    ***REMOVED*** @hidden
   ***REMOVED*****REMOVED***
    var MSG_OFFLINE_DIALOG_COME_BACK = goog.getMsg('Come back to {$appUrl}!', {
      'appUrl': '<span class="' + this.appUrlClassName_ + '">' +
          this.dialog_.getAppUrl() + '</span>'
    });
    sb.append(this.getStepHtml_(3, MSG_OFFLINE_DIALOG_COME_BACK));

    // Close the enclosing element.
    sb.append('</div>');

    this.content_ = String(sb);
  }
  return this.content_;
***REMOVED***


***REMOVED***
***REMOVED*** Creats the html for a step.
***REMOVED*** @param {number} stepNumber The number of the step.
***REMOVED*** @param {string} description The description of the step.
***REMOVED*** @private
***REMOVED*** @return {string} The step HTML in string form.
***REMOVED***
goog.ui.OfflineInstallDialog.InstallScreen.prototype.getStepHtml_ = function(
    stepNumber, description) {
  return goog.string.buildString('<div class="', this.stepClassName_,
      '"><span class="', this.stepNumberClassName_, '">', stepNumber,
      '</span><span class="', this.stepDescriptionClassName_, '">',
      description, '</span></div>');
***REMOVED***


***REMOVED***
***REMOVED*** Overrides to go to Gears page.
***REMOVED*** @override
***REMOVED***
goog.ui.OfflineInstallDialog.InstallScreen.prototype.handleSelect =
    function(e) {
  switch (e.key) {
    case goog.ui.OfflineInstallDialog.ButtonKeyType.INSTALL:
    case goog.ui.OfflineInstallDialog.ButtonKeyType.UPGRADE:
      e.preventDefault();
      this.dialog_.goToGearsDownloadPage();
      this.dialog_.setCurrentScreenType(
          goog.ui.OfflineInstallDialog.ScreenType.INSTALLING_GEARS);
      break;
  }
***REMOVED***



***REMOVED***
***REMOVED*** This screen is shown to users that needs to update their version of Gears
***REMOVED*** before they can enabled the current application for offline access.
***REMOVED*** @param {goog.ui.OfflineInstallDialog} dialog  The dialog this is a screen
***REMOVED***     for.
***REMOVED***
***REMOVED*** @extends {goog.ui.OfflineInstallDialog.InstallScreen}
***REMOVED***
goog.ui.OfflineInstallDialog.UpgradeScreen = function(dialog) {
  goog.ui.OfflineInstallDialog.InstallScreen.call(this, dialog,
      goog.ui.OfflineInstallDialog.UpgradeScreen.TYPE);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @desc The description of the the upgrade step to perform in order to enable
  ***REMOVED***     offline access.
  ***REMOVED*** @hidden
 ***REMOVED*****REMOVED***
  var MSG_OFFLINE_DIALOG_INSTALL_NEW_GEARS = goog.getMsg(
      'Install a new version of Gears');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Override to say upgrade instead of install.
  ***REMOVED*** @type {string}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore}
 ***REMOVED*****REMOVED***
  this.installMsg_ = MSG_OFFLINE_DIALOG_INSTALL_NEW_GEARS;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @desc Text of button that opens the download page for Gears for an
  ***REMOVED***     upgrade.
  ***REMOVED*** @hidden
 ***REMOVED*****REMOVED***
  var MSG_OFFLINE_DIALOG_UPGRADE_GEARS =
      goog.getMsg('Upgrade Gears now');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Override the text on the button to show upgrade instead of install.
  ***REMOVED*** @type {string}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore}
 ***REMOVED*****REMOVED***
  this.enableMsg_ = MSG_OFFLINE_DIALOG_UPGRADE_GEARS;
***REMOVED***
goog.inherits(goog.ui.OfflineInstallDialog.UpgradeScreen,
              goog.ui.OfflineInstallDialog.InstallScreen);


***REMOVED***
***REMOVED*** The type of this screen.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.OfflineInstallDialog.UpgradeScreen.TYPE =
    goog.ui.OfflineInstallDialog.ScreenType.UPGRADE;


***REMOVED***
***REMOVED*** Should upgrade button action be performed immediately when the user presses
***REMOVED*** the enter key anywhere on the dialog. This should be set to false if there
***REMOVED*** are other action handlers on the dialog that may stop propagation.
***REMOVED*** @type {boolean}
***REMOVED*** @protected
***REMOVED***
goog.ui.OfflineInstallDialog.UpgradeScreen.prototype.isUpgradeButtonDefault =
    true;


***REMOVED***
***REMOVED*** @return {goog.ui.Dialog.ButtonSet} The button set for the upgrade screen.
***REMOVED*** @override
***REMOVED***
goog.ui.OfflineInstallDialog.UpgradeScreen.prototype.getButtonSet = function() {
  if (!this.buttonSet_) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Text of button that cancels setting up Offline.
    ***REMOVED*** @hidden
   ***REMOVED*****REMOVED***
    var MSG_OFFLINE_DIALOG_CANCEL_3 = goog.getMsg('Cancel');

    var buttonSet = this.buttonSet_ = new goog.ui.Dialog.ButtonSet(this.dom_);
    buttonSet.set(goog.ui.OfflineInstallDialog.ButtonKeyType.UPGRADE,
        this.enableMsg_, this.isUpgradeButtonDefault, false);
    buttonSet.set(goog.ui.OfflineInstallDialog.ButtonKeyType.CANCEL,
        MSG_OFFLINE_DIALOG_CANCEL_3, false, true);
  }

  return this.buttonSet_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the upgrade description. This is the text before the upgrade steps.
***REMOVED*** @param {string} description  The upgrade description.
***REMOVED***
goog.ui.OfflineInstallDialog.UpgradeScreen.prototype.setUpgradeDescription =
    function(description) {
  this.setInstallDescription(description);
***REMOVED***



***REMOVED***
***REMOVED*** This screen is shown to users after the window to the Gears download page has
***REMOVED*** been opened.
***REMOVED*** @param {goog.ui.OfflineInstallDialog} dialog  The dialog this is a screen
***REMOVED***     for.
***REMOVED***
***REMOVED*** @extends {goog.ui.OfflineInstallDialogScreen}
***REMOVED***
goog.ui.OfflineInstallDialog.InstallingGearsScreen = function(dialog) {
  goog.ui.OfflineInstallDialogScreen.call(this, dialog,
      goog.ui.OfflineInstallDialog.InstallingGearsScreen.TYPE);
***REMOVED***
goog.inherits(goog.ui.OfflineInstallDialog.InstallingGearsScreen,
              goog.ui.OfflineInstallDialogScreen);


***REMOVED***
***REMOVED*** The type of this screen.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.OfflineInstallDialog.InstallingGearsScreen.TYPE =
    goog.ui.OfflineInstallDialog.ScreenType.INSTALLING_GEARS;


***REMOVED***
***REMOVED*** The CSS className to use for bold text.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineInstallDialog.InstallingGearsScreen.prototype.boldClassName_ =
    goog.getCssName('goog-offlinedialog-bold');


***REMOVED***
***REMOVED*** Gets the button set for the dialog when the user is suposed to be installing
***REMOVED*** Gears.
***REMOVED*** @return {goog.ui.Dialog.ButtonSet} The button set.
***REMOVED*** @override
***REMOVED***
goog.ui.OfflineInstallDialog.InstallingGearsScreen.prototype.getButtonSet =
    function() {
  if (!this.buttonSet_) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Text of button that closes the dialog.
    ***REMOVED*** @hidden
   ***REMOVED*****REMOVED***
    var MSG_OFFLINE_DIALOG_CLOSE = goog.getMsg('Close');

    var buttonSet = this.buttonSet_ =
        new goog.ui.Dialog.ButtonSet(this.dom_);
    buttonSet.set(goog.ui.OfflineInstallDialog.ButtonKeyType.CLOSE,
        MSG_OFFLINE_DIALOG_CLOSE, false, true);
  }
  return this.buttonSet_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the content for the dialog when the user is suposed to be installing
***REMOVED*** Gears.
***REMOVED*** @return {string} The content of the dialog as html.
***REMOVED*** @override
***REMOVED***
goog.ui.OfflineInstallDialog.InstallingGearsScreen.prototype.getContent =
    function() {
  if (!this.content_) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Congratulate the user for trying to download Google gears,
    ***REMOVED***     and give them a push in the right direction.
   ***REMOVED*****REMOVED***
    var MSG_OFFLINE_DIALOG_GEARS_DOWNLOAD_OPEN = goog.getMsg(
        'Great! The Gears download page has been opened in a new ' +
        'window. If you accidentally closed it, you can {$aBegin}open the ' +
        'Gears download page again{$aEnd}.',
        {
          'aBegin': '<a ' + 'target="_blank" href="' +
              this.getDialog().getGearsDownloadPageUrl() + '">',
          'aEnd': '</a>'
        });

   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Informs the user to come back to the the given site after
    ***REMOVED***     installing Gears.
    ***REMOVED*** @hidden
   ***REMOVED*****REMOVED***
    var MSG_OFFLINE_DIALOG_GEARS_AFTER_INSTALL = goog.getMsg('After you\'ve ' +
        'downloaded and installed Gears, {$beginTag}restart your ' +
        'browser, and then come back to {$appUrl}!{$endTag}',
        {
          'beginTag': '<div class="' + this.boldClassName_ + '">',
          'endTag': '</div>', 'appUrl': this.getDialog().getAppUrl()
        });

    // Set the content.
    this.content_ = goog.string.buildString('<div>',
        MSG_OFFLINE_DIALOG_GEARS_DOWNLOAD_OPEN, '</div><br/><div>',
        MSG_OFFLINE_DIALOG_GEARS_AFTER_INSTALL, '</div>');
  }
  return this.content_;
***REMOVED***
