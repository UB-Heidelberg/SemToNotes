// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Wrapper on a Flash object embedded in the HTML page.
***REMOVED*** This class contains routines for writing the HTML to create the Flash object
***REMOVED*** using a goog.ui.Component approach. Tested on Firefox 1.5, 2 and 3, IE6, 7,
***REMOVED*** Konqueror, Chrome and Safari.
***REMOVED***
***REMOVED*** Based on http://go/flashobject.js
***REMOVED***
***REMOVED*** Based on the following compatibility test suite:
***REMOVED*** http://www.bobbyvandersluis.com/flashembed/testsuite/
***REMOVED***
***REMOVED*** TODO(user): take a look at swfobject, and maybe use it instead of the current
***REMOVED*** flash embedding method.
***REMOVED***
***REMOVED*** Examples of usage:
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   var flash = new goog.ui.media.FlashObject('http://hostname/flash.swf');
***REMOVED***   flash.setFlashVar('myvar', 'foo');
***REMOVED***   flash.render(goog.dom.getElement('parent'));
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** TODO(user, jessan): create a goog.ui.media.BrowserInterfaceFlashObject that
***REMOVED*** subclasses goog.ui.media.FlashObject to provide all the goodness of
***REMOVED*** http://go/browserinterface.as
***REMOVED***
***REMOVED***

goog.provide('goog.ui.media.FlashObject');
goog.provide('goog.ui.media.FlashObject.ScriptAccessLevel');
goog.provide('goog.ui.media.FlashObject.Wmodes');

goog.require('goog.asserts');
goog.require('goog.debug.Logger');
goog.require('goog.events.EventHandler');
goog.require('goog.string');
goog.require('goog.structs.Map');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.Error');
goog.require('goog.userAgent');
goog.require('goog.userAgent.flash');



***REMOVED***
***REMOVED*** A very simple flash wrapper, that allows you to create flash object
***REMOVED*** programmatically, instead of embedding your own HTML. It extends
***REMOVED*** {@link goog.ui.Component}, which makes it very easy to be embedded on the
***REMOVED*** page.
***REMOVED***
***REMOVED*** @param {string} flashUrl The flash SWF URL.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper An optional DomHelper.
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
***REMOVED***
goog.ui.media.FlashObject = function(flashUrl, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The URL of the flash movie to be embedded.
  ***REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.flashUrl_ = flashUrl;

 ***REMOVED*****REMOVED***
  ***REMOVED*** An event handler used to handle events consistently between browsers.
  ***REMOVED*** @type {goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** A map of variables to be passed to the flash movie.
  ***REMOVED***
  ***REMOVED*** @type {goog.structs.Map}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.flashVars_ = new goog.structs.Map();
***REMOVED***
goog.inherits(goog.ui.media.FlashObject, goog.ui.Component);


***REMOVED***
***REMOVED*** Different states of loaded-ness in which the SWF itself can be
***REMOVED***
***REMOVED*** Talked about at:
***REMOVED*** http://kb.adobe.com/selfservice/viewContent.do?externalId=tn_12059&sliceId=1
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.ui.media.FlashObject.SwfReadyStates_ = {
  LOADING: 0,
  UNINITIALIZED: 1,
  LOADED: 2,
  INTERACTIVE: 3,
  COMPLETE: 4
***REMOVED***


***REMOVED***
***REMOVED*** The different modes for displaying a SWF. Note that different wmodes
***REMOVED*** can result in different bugs in different browsers and also that
***REMOVED*** both OPAQUE and TRANSPARENT will result in a performance hit.
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.media.FlashObject.Wmodes = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Allows for z-ordering of the SWF.
 ***REMOVED*****REMOVED***
  OPAQUE: 'opaque',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Allows for z-ordering of the SWF and plays the SWF with a transparent BG.
 ***REMOVED*****REMOVED***
  TRANSPARENT: 'transparent',

 ***REMOVED*****REMOVED***
  ***REMOVED*** The default wmode. Does not allow for z-ordering of the SWF.
 ***REMOVED*****REMOVED***
  WINDOW: 'window'
***REMOVED***


***REMOVED***
***REMOVED*** The different levels of allowScriptAccess.
***REMOVED***
***REMOVED*** Talked about at:
***REMOVED*** http://kb2.adobe.com/cps/164/tn_16494.html
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.media.FlashObject.ScriptAccessLevel = {
  /*
  ***REMOVED*** The flash object can always communicate with its container page.
 ***REMOVED*****REMOVED***
  ALWAYS: 'always',

  /*
  ***REMOVED*** The flash object can only communicate with its container page if they are
  ***REMOVED*** hosted in the same domain.
 ***REMOVED*****REMOVED***
  SAME_DOMAIN: 'sameDomain',

  /*
  ***REMOVED*** The flash can not communicate with its container page.
 ***REMOVED*****REMOVED***
  NEVER: 'never'
***REMOVED***


***REMOVED***
***REMOVED*** The component CSS namespace.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED***
goog.ui.media.FlashObject.CSS_CLASS = goog.getCssName('goog-ui-media-flash');


***REMOVED***
***REMOVED*** The flash object CSS class.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED***
goog.ui.media.FlashObject.FLASH_CSS_CLASS =
    goog.getCssName('goog-ui-media-flash-object');


***REMOVED***
***REMOVED*** Template for the object tag for IE.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.media.FlashObject.IE_HTML_ =
    '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"' +
           ' id="%s"' +
           ' name="%s"' +
           ' class="%s"' +
           '>' +
      '<param name="movie" value="%s"/>' +
      '<param name="quality" value="high"/>' +
      '<param name="FlashVars" value="%s"/>' +
      '<param name="bgcolor" value="%s"/>' +
      '<param name="AllowScriptAccess" value="%s"/>' +
      '<param name="allowFullScreen" value="true"/>' +
      '<param name="SeamlessTabbing" value="false"/>' +
      '%s' +
    '</object>';


***REMOVED***
***REMOVED*** Template for the wmode param for IE.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.media.FlashObject.IE_WMODE_PARAMS_ = '<param name="wmode" value="%s"/>';


***REMOVED***
***REMOVED*** Template for the embed tag for FF.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.media.FlashObject.FF_HTML_ =
    '<embed quality="high"' +
          ' id="%s"' +
          ' name="%s"' +
          ' class="%s"' +
          ' src="%s"' +
          ' FlashVars="%s"' +
          ' bgcolor="%s"' +
          ' AllowScriptAccess="%s"' +
          ' allowFullScreen="true"' +
          ' SeamlessTabbing="false"' +
          ' type="application/x-shockwave-flash"' +
          ' pluginspage="http://www.macromedia.com/go/getflashplayer"' +
          ' %s>' +
    '</embed>';


***REMOVED***
***REMOVED*** Template for the wmode param for Firefox.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.media.FlashObject.FF_WMODE_PARAMS_ = 'wmode=%s';


***REMOVED***
***REMOVED*** A logger used for debugging.
***REMOVED***
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.ui.media.FlashObject.prototype.logger_ =
    goog.debug.Logger.getLogger('goog.ui.media.FlashObject');


***REMOVED***
***REMOVED*** The wmode for the SWF.
***REMOVED***
***REMOVED*** @type {goog.ui.media.FlashObject.Wmodes}
***REMOVED*** @private
***REMOVED***
goog.ui.media.FlashObject.prototype.wmode_ =
    goog.ui.media.FlashObject.Wmodes.WINDOW;


***REMOVED***
***REMOVED*** The minimum required flash version.
***REMOVED***
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.ui.media.FlashObject.prototype.requiredVersion_;


***REMOVED***
***REMOVED*** The flash movie width.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.media.FlashObject.prototype.width_;


***REMOVED***
***REMOVED*** The flash movie height.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.media.FlashObject.prototype.height_;


***REMOVED***
***REMOVED*** The flash movie background color.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.media.FlashObject.prototype.backgroundColor_ = '#000000';


***REMOVED***
***REMOVED*** The flash movie allowScriptAccess setting.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.media.FlashObject.prototype.allowScriptAccess_ =
    goog.ui.media.FlashObject.ScriptAccessLevel.SAME_DOMAIN;


***REMOVED***
***REMOVED*** Sets the flash movie Wmode.
***REMOVED***
***REMOVED*** @param {goog.ui.media.FlashObject.Wmodes} wmode the flash movie Wmode.
***REMOVED*** @return {goog.ui.media.FlashObject} The flash object instance for chaining.
***REMOVED***
goog.ui.media.FlashObject.prototype.setWmode = function(wmode) {
  this.wmode_ = wmode;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} Returns the flash movie wmode.
***REMOVED***
goog.ui.media.FlashObject.prototype.getWmode = function() {
  return this.wmode_;
***REMOVED***


***REMOVED***
***REMOVED*** Adds flash variables.
***REMOVED***
***REMOVED*** @param {goog.structs.Map|Object} map A key-value map of variables.
***REMOVED*** @return {goog.ui.media.FlashObject} The flash object instance for chaining.
***REMOVED***
goog.ui.media.FlashObject.prototype.addFlashVars = function(map) {
  this.flashVars_.addAll(map);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Sets a flash variable.
***REMOVED***
***REMOVED*** @param {string} key The name of the flash variable.
***REMOVED*** @param {string} value The value of the flash variable.
***REMOVED*** @return {goog.ui.media.FlashObject} The flash object instance for chaining.
***REMOVED***
goog.ui.media.FlashObject.prototype.setFlashVar = function(key, value) {
  this.flashVars_.set(key, value);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Sets flash variables. You can either pass a Map of key->value pairs or you
***REMOVED*** can pass a key, value pair to set a specific variable.
***REMOVED***
***REMOVED*** TODO(user, martino): Get rid of this method.
***REMOVED***
***REMOVED*** @deprecated Use {@link #addFlashVars} or {@link #setFlashVar} instead.
***REMOVED*** @param {goog.structs.Map|Object|string} flashVar A map of variables (given
***REMOVED***    as a goog.structs.Map or an Object literal) or a key to the optional
***REMOVED***    {@code opt_value}.
***REMOVED*** @param {string=} opt_value The optional value for the flashVar key.
***REMOVED*** @return {goog.ui.media.FlashObject} The flash object instance for chaining.
***REMOVED***
goog.ui.media.FlashObject.prototype.setFlashVars = function(flashVar,
                                                            opt_value) {
  if (flashVar instanceof goog.structs.Map ||
      goog.typeOf(flashVar) == 'object') {
    this.addFlashVars(***REMOVED***@type {!goog.structs.Map|!Object}*/(flashVar));
  } else {
    goog.asserts.assert(goog.isString(flashVar) && goog.isDef(opt_value),
        'Invalid argument(s)');
    this.setFlashVar(***REMOVED***@type {string}*/(flashVar),
                    ***REMOVED*****REMOVED***@type {string}*/(opt_value));
  }
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.structs.Map} The current flash variables.
***REMOVED***
goog.ui.media.FlashObject.prototype.getFlashVars = function() {
  return this.flashVars_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the background color of the movie.
***REMOVED***
***REMOVED*** @param {string} color The new color to be set.
***REMOVED*** @return {goog.ui.media.FlashObject} The flash object instance for chaining.
***REMOVED***
goog.ui.media.FlashObject.prototype.setBackgroundColor = function(color) {
  this.backgroundColor_ = color;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The background color of the movie.
***REMOVED***
goog.ui.media.FlashObject.prototype.getBackgroundColor = function() {
  return this.backgroundColor_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the allowScriptAccess setting of the movie.
***REMOVED***
***REMOVED*** @param {string} value The new value to be set.
***REMOVED*** @return {goog.ui.media.FlashObject} The flash object instance for chaining.
***REMOVED***
goog.ui.media.FlashObject.prototype.setAllowScriptAccess = function(value) {
  this.allowScriptAccess_ = value;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The allowScriptAccess setting color of the movie.
***REMOVED***
goog.ui.media.FlashObject.prototype.getAllowScriptAccess = function() {
  return this.allowScriptAccess_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the width and height of the movie.
***REMOVED***
***REMOVED*** @param {number|string} width The width of the movie.
***REMOVED*** @param {number|string} height The height of the movie.
***REMOVED*** @return {goog.ui.media.FlashObject} The flash object instance for chaining.
***REMOVED***
goog.ui.media.FlashObject.prototype.setSize = function(width, height) {
  this.width_ = goog.isString(width) ? width : Math.round(width) + 'px';
  this.height_ = goog.isString(height) ? height : Math.round(height) + 'px';
  if (this.getElement()) {
    goog.style.setSize(this.getFlashElement(), this.width_, this.height_);
  }
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** @return {?string} The flash required version.
***REMOVED***
goog.ui.media.FlashObject.prototype.getRequiredVersion = function() {
  return this.requiredVersion_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the minimum flash required version.
***REMOVED***
***REMOVED*** @param {?string} version The minimum required version for this movie to work,
***REMOVED***     or null if you want to unset it.
***REMOVED*** @return {goog.ui.media.FlashObject} The flash object instance for chaining.
***REMOVED***
goog.ui.media.FlashObject.prototype.setRequiredVersion = function(version) {
  this.requiredVersion_ = version;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether this SWF has a minimum required flash version.
***REMOVED***
***REMOVED*** @return {boolean} Whether a required version was set or not.
***REMOVED***
goog.ui.media.FlashObject.prototype.hasRequiredVersion = function() {
  return this.requiredVersion_ != null;
***REMOVED***


***REMOVED***
***REMOVED*** Writes the Flash embedding {@code HTMLObjectElement} to this components root
***REMOVED*** element and adds listeners for all events to handle them consistently.
***REMOVED*** @override
***REMOVED***
goog.ui.media.FlashObject.prototype.enterDocument = function() {
  goog.ui.media.FlashObject.superClass_.enterDocument.call(this);

  // The SWF tag must be written after this component's element is appended to
  // the DOM. Otherwise Flash's ExternalInterface is broken in IE.
  this.getElement().innerHTML = this.generateSwfTag_();
  if (this.width_ && this.height_) {
    this.setSize(this.width_, this.height_);
  }

  // Sinks all the events on the bubble phase.
  //
  // Flash plugins propagates events from/to the plugin to the browser
  // inconsistently:
  //
  // 1) FF2 + linux: the flash plugin will stop the propagation of all events
  // from the plugin to the browser.
  // 2) FF3 + mac: the flash plugin will propagate events on the <embed> object
  // but that will get propagated to its parents.
  // 3) Safari 3.1.1 + mac: the flash plugin will propagate the event to the
  // <object> tag that event will propagate to its parents.
  // 4) IE7 + windows: the flash plugin  will eat all events, not propagating
  // anything to the javascript.
  // 5) Chrome + windows: the flash plugin will eat all events, not propagating
  // anything to the javascript.
  //
  // To overcome this inconsistency, all events from/to the plugin are sinked,
  // since you can't assume that the events will be propagated.
  //
  // NOTE(user): we only sink events on the bubbling phase, since there are no
  // inexpensive/scalable way to stop events on the capturing phase unless we
  // added an event listener on the document for each flash object.
  this.eventHandler_.listen(
      this.getElement(),
      goog.object.getValues(goog.events.EventType),
      goog.events.Event.stopPropagation);
***REMOVED***


***REMOVED***
***REMOVED*** Creates the DOM structure.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.ui.media.FlashObject.prototype.createDom = function() {
  if (this.hasRequiredVersion() &&
      !goog.userAgent.flash.isVersion(
         ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.getRequiredVersion()))) {
    this.logger_.warning('Required flash version not found:' +
        this.getRequiredVersion());
    throw Error(goog.ui.Component.Error.NOT_SUPPORTED);
  }

  var element = this.getDomHelper().createElement('div');
  element.className = goog.ui.media.FlashObject.CSS_CLASS;
  this.setElementInternal(element);
***REMOVED***


***REMOVED***
***REMOVED*** Writes the HTML to embed the flash object.
***REMOVED***
***REMOVED*** @return {string} Browser appropriate HTML to add the SWF to the DOM.
***REMOVED*** @private
***REMOVED***
goog.ui.media.FlashObject.prototype.generateSwfTag_ = function() {
  var template = goog.userAgent.IE ? goog.ui.media.FlashObject.IE_HTML_ :
      goog.ui.media.FlashObject.FF_HTML_;

  var params = goog.userAgent.IE ? goog.ui.media.FlashObject.IE_WMODE_PARAMS_ :
      goog.ui.media.FlashObject.FF_WMODE_PARAMS_;

  params = goog.string.subs(params, this.wmode_);

  var keys = this.flashVars_.getKeys();
  var values = this.flashVars_.getValues();

  var flashVars = [];
  for (var i = 0; i < keys.length; i++) {
    var key = goog.string.urlEncode(keys[i]);
    var value = goog.string.urlEncode(values[i]);
    flashVars.push(key + '=' + value);
  }

  // TODO(user): find a more efficient way to build the HTML.
  return goog.string.subs(
      template,
      this.getId(),
      this.getId(),
      goog.ui.media.FlashObject.FLASH_CSS_CLASS,
      goog.string.htmlEscape(this.flashUrl_),
      goog.string.htmlEscape(flashVars.join('&')),
      this.backgroundColor_,
      this.allowScriptAccess_,
      params);
***REMOVED***


***REMOVED***
***REMOVED*** @return {HTMLObjectElement} The flash element or null if the element can't
***REMOVED***     be found.
***REMOVED***
goog.ui.media.FlashObject.prototype.getFlashElement = function() {
  return***REMOVED*****REMOVED*** @type {HTMLObjectElement}***REMOVED***(this.getElement() ?
      this.getElement().firstChild : null);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.media.FlashObject.prototype.disposeInternal = function() {
  goog.ui.media.FlashObject.superClass_.disposeInternal.call(this);
  this.flashVars_ = null;

  this.eventHandler_.dispose();
  this.eventHandler_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} whether the SWF has finished loading or not.
***REMOVED***
goog.ui.media.FlashObject.prototype.isLoaded = function() {
  if (!this.isInDocument() || !this.getElement()) {
    return false;
  }

  if (this.getFlashElement().readyState &&
      this.getFlashElement().readyState ==
          goog.ui.media.FlashObject.SwfReadyStates_.COMPLETE) {
    return true;
  }

  if (this.getFlashElement().PercentLoaded &&
      this.getFlashElement().PercentLoaded() == 100) {
    return true;
  }

  return false;
***REMOVED***
