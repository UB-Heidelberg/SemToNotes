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
***REMOVED*** @fileoverview Browser history stack management class.
***REMOVED***
***REMOVED*** The goog.History object allows a page to create history state without leaving
***REMOVED*** the current document. This allows users to, for example, hit the browser's
***REMOVED*** back button without leaving the current page.
***REMOVED***
***REMOVED*** The history object can be instantiated in one of two modes. In user visible
***REMOVED*** mode, the current history state is shown in the browser address bar as a
***REMOVED*** document location fragment (the portion of the URL after the '#'). These
***REMOVED*** addresses can be bookmarked, copied and pasted into another browser, and
***REMOVED*** modified directly by the user like any other URL.
***REMOVED***
***REMOVED*** If the history object is created in invisible mode, the user can still
***REMOVED*** affect the state using the browser forward and back buttons, but the current
***REMOVED*** state is not displayed in the browser address bar. These states are not
***REMOVED*** bookmarkable or editable.
***REMOVED***
***REMOVED*** It is possible to use both types of history object on the same page, but not
***REMOVED*** currently recommended due to browser deficiencies.
***REMOVED***
***REMOVED*** Tested to work in:
***REMOVED*** <ul>
***REMOVED***   <li>Firefox 1.0-4.0
***REMOVED***   <li>Internet Explorer 5.5-9.0
***REMOVED***   <li>Opera 9+
***REMOVED***   <li>Safari 4+
***REMOVED*** </ul>
***REMOVED***
***REMOVED*** @author brenneman@google.com (Shawn Brenneman)
***REMOVED*** @see ../demos/history1.html
***REMOVED*** @see ../demos/history2.html
***REMOVED***

/* Some browser specific implementation notes:
***REMOVED***
***REMOVED*** Firefox (through version 2.0.0.1):
***REMOVED***
***REMOVED*** Ideally, navigating inside the hidden iframe could be done using
***REMOVED*** about:blank#state instead of a real page on the server. Setting the hash on
***REMOVED*** about:blank creates history entries, but the hash is not recorded and is lost
***REMOVED*** when the user hits the back button. This is true in Opera as well. A blank
***REMOVED*** HTML page must be provided for invisible states to be recorded in the iframe
***REMOVED*** hash.
***REMOVED***
***REMOVED*** After leaving the page with the History object and returning to it (by
***REMOVED*** hitting the back button from another site), the last state of the iframe is
***REMOVED*** overwritten. The most recent state is saved in a hidden input field so the
***REMOVED*** previous state can be restored.
***REMOVED***
***REMOVED*** Firefox does not store the previous value of dynamically generated input
***REMOVED*** elements. To save the state, the hidden element must be in the HTML document,
***REMOVED*** either in the original source or added with document.write. If a reference
***REMOVED*** to the input element is not provided as a constructor argument, then the
***REMOVED*** history object creates one using document.write, in which case the history
***REMOVED*** object must be created from a script in the body element of the page.
***REMOVED***
***REMOVED*** Manually editing the address field to a different hash link prevents further
***REMOVED*** updates to the address bar. The page continues to work as normal, but the
***REMOVED*** address shown will be incorrect until the page is reloaded.
***REMOVED***
***REMOVED*** NOTE(user): It should be noted that Firefox will URL encode any non-regular
***REMOVED*** ascii character, along with |space|, ", <, and >, when added to the fragment.
***REMOVED*** If you expect these characters in your tokens you should consider that
***REMOVED*** setToken('<b>') would result in the history fragment "%3Cb%3E", and
***REMOVED*** "esp&eacute;re" would show "esp%E8re".  (IE allows unicode characters in the
***REMOVED*** fragment)
***REMOVED***
***REMOVED*** TODO(user): Should we encapsulate this escaping into the API for visible
***REMOVED*** history and encode all characters that aren't supported by Firefox?  It also
***REMOVED*** needs to be optional so apps can elect to handle the escaping themselves.
***REMOVED***
***REMOVED***
***REMOVED*** Internet Explorer (through version 7.0):
***REMOVED***
***REMOVED*** IE does not modify the history stack when the document fragment is changed.
***REMOVED*** We create history entries instead by using document.open and document.write
***REMOVED*** into a hidden iframe.
***REMOVED***
***REMOVED*** IE destroys the history stack when navigating from /foo.html#someFragment to
***REMOVED*** /foo.html. The workaround is to always append the # to the URL. This is
***REMOVED*** somewhat unfortunate when loading the page without any # specified, because
***REMOVED*** a second "click" sound will play on load as the fragment is automatically
***REMOVED*** appended. If the hash is always present, this can be avoided.
***REMOVED***
***REMOVED*** Manually editing the hash in the address bar in IE6 and then hitting the back
***REMOVED*** button can replace the page with a blank page. This is a Bad User Experience,
***REMOVED*** but probably not preventable.
***REMOVED***
***REMOVED*** IE also has a bug when the page is loaded via a server redirect, setting
***REMOVED*** a new hash value on the window location will force a page reload. This will
***REMOVED*** happen the first time setToken is called with a new token. The only known
***REMOVED*** workaround is to force a client reload early, for example by setting
***REMOVED*** window.location.hash = window.location.hash, which will otherwise be a no-op.
***REMOVED***
***REMOVED*** Internet Explorer 8.0, Webkit 532.1 and Gecko 1.9.2:
***REMOVED***
***REMOVED*** IE8 has introduced the support to the HTML5 onhashchange event, which means
***REMOVED*** we don't have to do any polling to detect fragment changes. Chrome and
***REMOVED*** Firefox have added it on their newer builds, wekbit 532.1 and gecko 1.9.2.
***REMOVED*** http://www.w3.org/TR/html5/history.html
***REMOVED*** NOTE(goto): it is important to note that the document needs to have the
***REMOVED*** <!DOCTYPE html> tag to enable the IE8 HTML5 mode. If the tag is not present,
***REMOVED*** IE8 will enter IE7 compatibility mode (which can also be enabled manually).
***REMOVED***
***REMOVED*** Opera (through version 9.02):
***REMOVED***
***REMOVED*** Navigating through pages at a rate faster than some threshhold causes Opera
***REMOVED*** to cancel all outstanding timeouts and intervals, including the location
***REMOVED*** polling loop. Since this condition cannot be detected, common input events
***REMOVED*** are captured to cause the loop to restart.
***REMOVED***
***REMOVED*** location.replace is adding a history entry inside setHash_, despite
***REMOVED*** documentation that suggests it should not.
***REMOVED***
***REMOVED***
***REMOVED*** Safari (through version 2.0.4):
***REMOVED***
***REMOVED*** After hitting the back button, the location.hash property is no longer
***REMOVED*** readable from JavaScript. This is fixed in later WebKit builds, but not in
***REMOVED*** currently shipping Safari. For now, the only recourse is to disable history
***REMOVED*** states in Safari. Pages are still navigable via the History object, but the
***REMOVED*** back button cannot restore previous states.
***REMOVED***
***REMOVED*** Safari sets history states on navigation to a hashlink, but doesn't allow
***REMOVED*** polling of the hash, so following actual anchor links in the page will create
***REMOVED*** useless history entries. Using location.replace does not seem to prevent
***REMOVED*** this. Not a terribly good user experience, but fixed in later Webkits.
***REMOVED***
***REMOVED***
***REMOVED*** WebKit (nightly version 420+):
***REMOVED***
***REMOVED*** This almost works. Returning to a page with an invisible history object does
***REMOVED*** not restore the old state, however, and there is no pageshow event that fires
***REMOVED*** in this browser. Holding off on finding a solution for now.
***REMOVED***
***REMOVED***
***REMOVED*** HTML5 capable browsers (Firefox 4, Chrome, Safari 5)
***REMOVED***
***REMOVED*** No known issues. The goog.history.Html5History class provides a simpler
***REMOVED*** implementation more suitable for recent browsers. These implementations
***REMOVED*** should be merged so the history class automatically invokes the correct
***REMOVED*** implementation.
***REMOVED***


goog.provide('goog.History');
goog.provide('goog.History.Event');
goog.provide('goog.History.EventType');

goog.require('goog.Timer');
goog.require('goog.dom');
***REMOVED***
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.history.Event');
goog.require('goog.history.EventType');
goog.require('goog.string');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** A history management object. Can be instantiated in user-visible mode (uses
***REMOVED*** the address fragment to manage state) or in hidden mode. This object should
***REMOVED*** be created from a script in the document body before the document has
***REMOVED*** finished loading.
***REMOVED***
***REMOVED*** To store the hidden states in browsers other than IE, a hidden iframe is
***REMOVED*** used. It must point to a valid html page on the same domain (which can and
***REMOVED*** probably should be blank.)
***REMOVED***
***REMOVED*** Sample instantiation and usage:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** // Instantiate history to use the address bar for state.
***REMOVED*** var h = new goog.History();
***REMOVED*** goog.events.listen(h, goog.history.EventType.NAVIGATE, navCallback);
***REMOVED*** h.setEnabled(true);
***REMOVED***
***REMOVED*** // Any changes to the location hash will call the following function.
***REMOVED*** function navCallback(e) {
***REMOVED***   alert('Navigated to state "' + e.token + '"');
***REMOVED*** }
***REMOVED***
***REMOVED*** // The history token can also be set from code directly.
***REMOVED*** h.setToken('foo');
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {boolean=} opt_invisible True to use hidden history states instead of
***REMOVED***     the user-visible location hash.
***REMOVED*** @param {string=} opt_blankPageUrl A URL to a blank page on the same server.
***REMOVED***     Required if opt_invisible is true.  This URL is also used as the src
***REMOVED***     for the iframe used to track history state in IE (if not specified the
***REMOVED***     iframe is not given a src attribute).  Access is Denied error may
***REMOVED***     occur in IE7 if the window's URL's scheme is https, and this URL is
***REMOVED***     not specified.
***REMOVED*** @param {HTMLInputElement=} opt_input The hidden input element to be used to
***REMOVED***     store the history token.  If not provided, a hidden input element will
***REMOVED***     be created using document.write.
***REMOVED*** @param {HTMLIFrameElement=} opt_iframe The hidden iframe that will be used by
***REMOVED***     IE for pushing history state changes, or by all browsers if opt_invisible
***REMOVED***     is true. If not provided, a hidden iframe element will be created using
***REMOVED***     document.write.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.History = function(opt_invisible, opt_blankPageUrl, opt_input,
                        opt_iframe) {
  goog.events.EventTarget.call(this);

  if (opt_invisible && !opt_blankPageUrl) {
    throw Error('Can\'t use invisible history without providing a blank page.');
  }

  var input;
  if (opt_input) {
    input = opt_input;
  } else {
    var inputId = 'history_state' + goog.History.historyCount_;
    document.write(goog.string.subs(goog.History.INPUT_TEMPLATE_,
                                    inputId, inputId));
    input = goog.dom.getElement(inputId);
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** An input element that stores the current iframe state. Used to restore
  ***REMOVED*** the state when returning to the page on non-IE browsers.
  ***REMOVED*** @type {HTMLInputElement}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.hiddenInput_ =***REMOVED*****REMOVED*** @type {HTMLInputElement}***REMOVED*** (input);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The window whose location contains the history token fragment. This is
  ***REMOVED*** the window that contains the hidden input. It's typically the top window.
  ***REMOVED*** It is not necessarily the same window that the js code is loaded in.
  ***REMOVED*** @type {Window}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.window_ = opt_input ?
      goog.dom.getWindow(goog.dom.getOwnerDocument(opt_input)) : window;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The initial page location with an empty hash component. If the page uses
  ***REMOVED*** a BASE element, setting location.hash directly will navigate away from the
  ***REMOVED*** current document. To prevent this, the full path is always specified.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.baseUrl_ = this.window_.location.href.split('#')[0];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The base URL for the hidden iframe. Must refer to a document in the
  ***REMOVED*** same domain as the main page.
  ***REMOVED*** @type {string|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.iframeSrc_ = opt_blankPageUrl;

  if (goog.userAgent.IE && !opt_blankPageUrl) {
    this.iframeSrc_ = window.location.protocol == 'https' ? 'https:///' :
                                                            'javascript:""';
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** A timer for polling the current history state for changes.
  ***REMOVED*** @type {goog.Timer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.timer_ = new goog.Timer(goog.History.PollingType.NORMAL);
  this.registerDisposable(this.timer_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** True if the state tokens are displayed in the address bar, false for hidden
  ***REMOVED*** history states.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.userVisible_ = !opt_invisible;

 ***REMOVED*****REMOVED***
  ***REMOVED*** An object to keep track of the history event listeners.
  ***REMOVED*** @type {goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

  if (opt_invisible || goog.History.LEGACY_IE) {
    var iframe;
    if (opt_iframe) {
      iframe = opt_iframe;
    } else {
      var iframeId = 'history_iframe' + goog.History.historyCount_;
      var srcAttribute = this.iframeSrc_ ?
          'src="' + goog.string.htmlEscape(this.iframeSrc_) + '"' :
          '';
      document.write(goog.string.subs(goog.History.IFRAME_TEMPLATE_,
                                      iframeId,
                                      srcAttribute));
      iframe = goog.dom.getElement(iframeId);
    }

   ***REMOVED*****REMOVED***
    ***REMOVED*** Internet Explorer uses a hidden iframe for all history changes. Other
    ***REMOVED*** browsers use the iframe only for pushing invisible states.
    ***REMOVED*** @type {HTMLIFrameElement}
    ***REMOVED*** @private
   ***REMOVED*****REMOVED***
    this.iframe_ =***REMOVED*****REMOVED*** @type {HTMLIFrameElement}***REMOVED*** (iframe);

   ***REMOVED*****REMOVED***
    ***REMOVED*** Whether the hidden iframe has had a document written to it yet in this
    ***REMOVED*** session.
    ***REMOVED*** @type {boolean}
    ***REMOVED*** @private
   ***REMOVED*****REMOVED***
    this.unsetIframe_ = true;
  }

  if (goog.History.LEGACY_IE) {
    // IE relies on the hidden input to restore the history state from previous
    // sessions, but input values are only restored after window.onload. Set up
    // a callback to poll the value after the onload event.
    this.eventHandler_.listen(this.window_,
                              goog.events.EventType.LOAD,
                              this.onDocumentLoaded);

   ***REMOVED*****REMOVED***
    ***REMOVED*** IE-only variable for determining if the document has loaded.
    ***REMOVED*** @type {boolean}
    ***REMOVED*** @protected
   ***REMOVED*****REMOVED***
    this.documentLoaded = false;

   ***REMOVED*****REMOVED***
    ***REMOVED*** IE-only variable for storing whether the history object should be enabled
    ***REMOVED*** once the document finishes loading.
    ***REMOVED*** @type {boolean}
    ***REMOVED*** @private
   ***REMOVED*****REMOVED***
    this.shouldEnable_ = false;
  }

  // Set the initial history state.
  if (this.userVisible_) {
    this.setHash_(this.getToken(), true);
  } else {
    this.setIframeToken_(this.hiddenInput_.value);
  }

  goog.History.historyCount_++;
***REMOVED***
goog.inherits(goog.History, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Status of when the object is active and dispatching events.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.History.prototype.enabled_ = false;


***REMOVED***
***REMOVED*** Whether the object is performing polling with longer intervals. This can
***REMOVED*** occur for instance when setting the location of the iframe when in invisible
***REMOVED*** mode and the server that is hosting the blank html page is down. In FF, this
***REMOVED*** will cause the location of the iframe to no longer be accessible, with
***REMOVED*** permision denied exceptions being thrown on every access of the history
***REMOVED*** token. When this occurs, the polling interval is elongated. This causes
***REMOVED*** exceptions to be thrown at a lesser rate while allowing for the history
***REMOVED*** object to resurrect itself when the html page becomes accessible.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.History.prototype.longerPolling_ = false;


***REMOVED***
***REMOVED*** The last token set by the history object, used to poll for changes.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.History.prototype.lastToken_ = null;


***REMOVED***
***REMOVED*** Whether the browser supports HTML5 history management.
***REMOVED*** {@link http://www.w3.org/TR/html5/history.html}.
***REMOVED*** @type {boolean}
***REMOVED***
goog.History.HAS_ONHASHCHANGE =
    goog.userAgent.IE && goog.userAgent.isDocumentMode(8) ||
    goog.userAgent.GECKO && goog.userAgent.isVersion('1.9.2') ||
    goog.userAgent.WEBKIT && goog.userAgent.isVersion('532.1');


***REMOVED***
***REMOVED*** Whether the current browser is Internet Explorer prior to version 8. Many IE
***REMOVED*** specific workarounds developed before version 8 are unnecessary in more
***REMOVED*** current versions.
***REMOVED*** @type {boolean}
***REMOVED***
goog.History.LEGACY_IE = goog.userAgent.IE && !goog.userAgent.isDocumentMode(8);


***REMOVED***
***REMOVED*** Whether the browser always requires the hash to be present. Internet Explorer
***REMOVED*** before version 8 will reload the HTML page if the hash is omitted.
***REMOVED*** @type {boolean}
***REMOVED***
goog.History.HASH_ALWAYS_REQUIRED = goog.History.LEGACY_IE;


***REMOVED***
***REMOVED*** If not null, polling in the user invisible mode will be disabled until this
***REMOVED*** token is seen. This is used to prevent a race condition where the iframe
***REMOVED*** hangs temporarily while the location is changed.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.History.prototype.lockedToken_ = null;


***REMOVED*** @override***REMOVED***
goog.History.prototype.disposeInternal = function() {
  goog.History.superClass_.disposeInternal.call(this);
  this.eventHandler_.dispose();
  this.setEnabled(false);
***REMOVED***


***REMOVED***
***REMOVED*** Starts or stops the History polling loop. When enabled, the History object
***REMOVED*** will immediately fire an event for the current location. The caller can set
***REMOVED*** up event listeners between the call to the constructor and the call to
***REMOVED*** setEnabled.
***REMOVED***
***REMOVED*** On IE, actual startup may be delayed until the iframe and hidden input
***REMOVED*** element have been loaded and can be polled. This behavior is transparent to
***REMOVED*** the caller.
***REMOVED***
***REMOVED*** @param {boolean} enable Whether to enable the history polling loop.
***REMOVED***
goog.History.prototype.setEnabled = function(enable) {

  if (enable == this.enabled_) {
    return;
  }

  if (goog.History.LEGACY_IE && !this.documentLoaded) {
    // Wait until the document has actually loaded before enabling the
    // object or any saved state from a previous session will be lost.
    this.shouldEnable_ = enable;
    return;
  }

  if (enable) {
    if (goog.userAgent.OPERA) {
      // Capture events for common user input so we can restart the timer in
      // Opera if it fails. Yes, this is distasteful. See operaDefibrillator_.
      this.eventHandler_.listen(this.window_.document,
                                goog.History.INPUT_EVENTS_,
                                this.operaDefibrillator_);
    } else if (goog.userAgent.GECKO) {
      // Firefox will not restore the correct state after navigating away from
      // and then back to the page with the history object. This can be fixed
      // by restarting the history object on the pageshow event.
      this.eventHandler_.listen(this.window_, 'pageshow', this.onShow_);
    }

    // TODO(user): make HTML5 and invisible history work by listening to the
    // iframe # changes instead of the window.
    if (goog.History.HAS_ONHASHCHANGE && this.userVisible_) {
      this.eventHandler_.listen(
          this.window_, goog.events.EventType.HASHCHANGE, this.onHashChange_);
      this.enabled_ = true;
      this.dispatchEvent(new goog.history.Event(this.getToken(), false));
    } else if (!goog.userAgent.IE || this.documentLoaded) {
      // Start dispatching history events if all necessary loading has
      // completed (always true for browsers other than IE.)
      this.eventHandler_.listen(this.timer_, goog.Timer.TICK,
          goog.bind(this.check_, this, true));

      this.enabled_ = true;

      // Initialize last token at startup except on IE < 8, where the last token
      // must only be set in conjunction with IFRAME updates, or the IFRAME will
      // start out of sync and remove any pre-existing URI fragment.
      if (!goog.History.LEGACY_IE) {
        this.lastToken_ = this.getToken();
        this.dispatchEvent(new goog.history.Event(this.getToken(), false));
      }

      this.timer_.start();
    }

  } else {
    this.enabled_ = false;
    this.eventHandler_.removeAll();
    this.timer_.stop();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Callback for the window onload event in IE. This is necessary to read the
***REMOVED*** value of the hidden input after restoring a history session. The value of
***REMOVED*** input elements is not viewable until after window onload for some reason (the
***REMOVED*** iframe state is similarly unavailable during the loading phase.)  If
***REMOVED*** setEnabled is called before the iframe has completed loading, the history
***REMOVED*** object will actually be enabled at this point.
***REMOVED*** @protected
***REMOVED***
goog.History.prototype.onDocumentLoaded = function() {
  this.documentLoaded = true;

  if (this.hiddenInput_.value) {
    // Any saved value in the hidden input can only be read after the document
    // has been loaded due to an IE limitation. Restore the previous state if
    // it has been set.
    this.setIframeToken_(this.hiddenInput_.value, true);
  }

  this.setEnabled(this.shouldEnable_);
***REMOVED***


***REMOVED***
***REMOVED*** Handler for the Gecko pageshow event. Restarts the history object so that the
***REMOVED*** correct state can be restored in the hash or iframe.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.History.prototype.onShow_ = function(e) {
  // NOTE(user): persisted is a property passed in the pageshow event that
  // indicates whether the page is being persisted from the cache or is being
  // loaded for the first time.
  if (e.getBrowserEvent()['persisted']) {
    this.setEnabled(false);
    this.setEnabled(true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles HTML5 onhashchange events on browsers where it is supported.
***REMOVED*** This is very similar to {@link #check_}, except that it is not executed
***REMOVED*** continuously. It is only used when {@code goog.History.HAS_ONHASHCHANGE} is
***REMOVED*** true.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.History.prototype.onHashChange_ = function(e) {
  var hash = this.getLocationFragment_(this.window_);
  if (hash != this.lastToken_) {
    this.update_(hash, true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The current token.
***REMOVED***
goog.History.prototype.getToken = function() {
  if (this.lockedToken_ != null) {
    return this.lockedToken_;
  } else if (this.userVisible_) {
    return this.getLocationFragment_(this.window_);
  } else {
    return this.getIframeToken_() || '';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the history state. When user visible states are used, the URL fragment
***REMOVED*** will be set to the provided token.  Sometimes it is necessary to set the
***REMOVED*** history token before the document title has changed, in this case IE's
***REMOVED*** history drop down can be out of sync with the token.  To get around this
***REMOVED*** problem, the app can pass in a title to use with the hidden iframe.
***REMOVED*** @param {string} token The history state identifier.
***REMOVED*** @param {string=} opt_title Optional title used when setting the hidden iframe
***REMOVED***     title in IE.
***REMOVED***
goog.History.prototype.setToken = function(token, opt_title) {
  this.setHistoryState_(token, false, opt_title);
***REMOVED***


***REMOVED***
***REMOVED*** Replaces the current history state without affecting the rest of the history
***REMOVED*** stack.
***REMOVED*** @param {string} token The history state identifier.
***REMOVED*** @param {string=} opt_title Optional title used when setting the hidden iframe
***REMOVED***     title in IE.
***REMOVED***
goog.History.prototype.replaceToken = function(token, opt_title) {
  this.setHistoryState_(token, true, opt_title);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the location fragment for the current URL.  We don't use location.hash
***REMOVED*** directly as the browser helpfully urlDecodes the string for us which can
***REMOVED*** corrupt the tokens.  For example, if we want to store: label/%2Froot it would
***REMOVED*** be returned as label//root.
***REMOVED*** @param {Window} win The window object to use.
***REMOVED*** @return {string} The fragment.
***REMOVED*** @private
***REMOVED***
goog.History.prototype.getLocationFragment_ = function(win) {
  var href = win.location.href;
  var index = href.indexOf('#');
  return index < 0 ? '' : href.substring(index + 1);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the history state. When user visible states are used, the URL fragment
***REMOVED*** will be set to the provided token. Setting opt_replace to true will cause the
***REMOVED*** navigation to occur, but will replace the current history entry without
***REMOVED*** affecting the length of the stack.
***REMOVED***
***REMOVED*** @param {string} token The history state identifier.
***REMOVED*** @param {boolean} replace Set to replace the current history entry instead of
***REMOVED***    appending a new history state.
***REMOVED*** @param {string=} opt_title Optional title used when setting the hidden iframe
***REMOVED***     title in IE.
***REMOVED*** @private
***REMOVED***
goog.History.prototype.setHistoryState_ = function(token, replace, opt_title) {
  if (this.getToken() != token) {
    if (this.userVisible_) {
      this.setHash_(token, replace);

      if (!goog.History.HAS_ONHASHCHANGE) {
        if (goog.userAgent.IE) {
          // IE must save state using the iframe.
          this.setIframeToken_(token, replace, opt_title);
        }
      }

      // This condition needs to be called even if
      // goog.History.HAS_ONHASHCHANGE is true so the NAVIGATE event fires
      // sychronously.
      if (this.enabled_) {
        this.check_(false);
      }
    } else {
      // Fire the event immediately so that setting history is synchronous, but
      // set a suspendToken so that polling doesn't trigger a 'back'.
      this.setIframeToken_(token, replace);
      this.lockedToken_ = this.lastToken_ = this.hiddenInput_.value = token;
      this.dispatchEvent(new goog.history.Event(token, false));
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets or replaces the URL fragment. The token does not need to be URL encoded
***REMOVED*** according to the URL specification, though certain characters (like newline)
***REMOVED*** are automatically stripped.
***REMOVED***
***REMOVED*** If opt_replace is not set, non-IE browsers will append a new entry to the
***REMOVED*** history list. Setting the hash does not affect the history stack in IE
***REMOVED*** (unless there is a pre-existing named anchor for that hash.)
***REMOVED***
***REMOVED*** Older versions of Webkit cannot query the location hash, but it still can be
***REMOVED*** set. If we detect one of these versions, always replace instead of creating
***REMOVED*** new history entries.
***REMOVED***
***REMOVED*** window.location.replace replaces the current state from the history stack.
***REMOVED*** http://www.whatwg.org/specs/web-apps/current-work/#dom-location-replace
***REMOVED*** http://www.whatwg.org/specs/web-apps/current-work/#replacement-enabled
***REMOVED***
***REMOVED*** @param {string} token The new string to set.
***REMOVED*** @param {boolean=} opt_replace Set to true to replace the current token
***REMOVED***    without appending a history entry.
***REMOVED*** @private
***REMOVED***
goog.History.prototype.setHash_ = function(token, opt_replace) {
  var loc = this.window_.location;
  var url = this.baseUrl_;

  // If a hash has already been set, then removing it programmatically will
  // reload the page. Once there is a hash, we won't remove it.
  var hasHash = goog.string.contains(loc.href, '#');

  if (goog.History.HASH_ALWAYS_REQUIRED || hasHash || token) {
    url += '#' + token;
  }

  if (url != loc.href) {
    if (opt_replace) {
      loc.replace(url);
    } else {
      loc.href = url;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the hidden iframe state. On IE, this is accomplished by writing a new
***REMOVED*** document into the iframe. In Firefox, the iframe's URL fragment stores the
***REMOVED*** state instead.
***REMOVED***
***REMOVED*** Older versions of webkit cannot set the iframe, so ignore those browsers.
***REMOVED***
***REMOVED*** @param {string} token The new string to set.
***REMOVED*** @param {boolean=} opt_replace Set to true to replace the current iframe state
***REMOVED***     without appending a new history entry.
***REMOVED*** @param {string=} opt_title Optional title used when setting the hidden iframe
***REMOVED***     title in IE.
***REMOVED*** @private
***REMOVED***
goog.History.prototype.setIframeToken_ = function(token,
                                                  opt_replace,
                                                  opt_title) {
  if (this.unsetIframe_ || token != this.getIframeToken_()) {

    this.unsetIframe_ = false;
    token = goog.string.urlEncode(token);

    if (goog.userAgent.IE) {
      // Caching the iframe document results in document permission errors after
      // leaving the page and returning. Access it anew each time instead.
      var doc = goog.dom.getFrameContentDocument(this.iframe_);

      doc.open('text/html', opt_replace ? 'replace' : undefined);
      doc.write(goog.string.subs(
          goog.History.IFRAME_SOURCE_TEMPLATE_,
          goog.string.htmlEscape(
             ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (opt_title || this.window_.document.title)),
          token));
      doc.close();
    } else {
      var url = this.iframeSrc_ + '#' + token;

      // In Safari, it is possible for the contentWindow of the iframe to not
      // be present when the page is loading after a reload.
      var contentWindow = this.iframe_.contentWindow;
      if (contentWindow) {
        if (opt_replace) {
          contentWindow.location.replace(url);
        } else {
          contentWindow.location.href = url;
        }
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Return the current state string from the hidden iframe. On internet explorer,
***REMOVED*** this is stored as a string in the document body. Other browsers use the
***REMOVED*** location hash of the hidden iframe.
***REMOVED***
***REMOVED*** Older versions of webkit cannot access the iframe location, so always return
***REMOVED*** null in that case.
***REMOVED***
***REMOVED*** @return {?string} The state token saved in the iframe (possibly null if the
***REMOVED***     iframe has never loaded.).
***REMOVED*** @private
***REMOVED***
goog.History.prototype.getIframeToken_ = function() {
  if (goog.userAgent.IE) {
    var doc = goog.dom.getFrameContentDocument(this.iframe_);
    return doc.body ? goog.string.urlDecode(doc.body.innerHTML) : null;
  } else {
    // In Safari, it is possible for the contentWindow of the iframe to not
    // be present when the page is loading after a reload.
    var contentWindow = this.iframe_.contentWindow;
    if (contentWindow) {
      var hash;
     ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
      try {
        // Iframe tokens are urlEncoded
        hash = goog.string.urlDecode(this.getLocationFragment_(contentWindow));
      } catch (e) {
        // An exception will be thrown if the location of the iframe can not be
        // accessed (permission denied). This can occur in FF if the the server
        // that is hosting the blank html page goes down and then a new history
        // token is set. The iframe will navigate to an error page, and the
        // location of the iframe can no longer be accessed. Due to the polling,
        // this will cause constant exceptions to be thrown. In this case,
        // we enable longer polling. We do not have to attempt to reset the
        // iframe token because (a) we already fired the NAVIGATE event when
        // setting the token, (b) we can rely on the locked token for current
        // state, and (c) the token is still in the history and
        // accesible on forward/back.
        if (!this.longerPolling_) {
          this.setLongerPolling_(true);
        }

        return null;
      }

      // There was no exception when getting the hash so turn off longer polling
      // if it is on.
      if (this.longerPolling_) {
        this.setLongerPolling_(false);
      }

      return hash || null;
    } else {
      return null;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Checks the state of the document fragment and the iframe title to detect
***REMOVED*** navigation changes. If {@code goog.History.HAS_ONHASHCHANGE} is
***REMOVED*** {@code false}, then this runs approximately twenty times per second.
***REMOVED*** @param {boolean} isNavigation True if the event was initiated by a browser
***REMOVED***     action, false if it was caused by a setToken call. See
***REMOVED***     {@link goog.history.Event}.
***REMOVED*** @private
***REMOVED***
goog.History.prototype.check_ = function(isNavigation) {
  if (this.userVisible_) {
    var hash = this.getLocationFragment_(this.window_);
    if (hash != this.lastToken_) {
      this.update_(hash, isNavigation);
    }
  }

  // Old IE uses the iframe for both visible and non-visible versions.
  if (!this.userVisible_ || goog.History.LEGACY_IE) {
    var token = this.getIframeToken_() || '';
    if (this.lockedToken_ == null || token == this.lockedToken_) {
      this.lockedToken_ = null;
      if (token != this.lastToken_) {
        this.update_(token, isNavigation);
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the current history state with a given token. Called after a change
***REMOVED*** to the location or the iframe state is detected by poll_.
***REMOVED***
***REMOVED*** @param {string} token The new history state.
***REMOVED*** @param {boolean} isNavigation True if the event was initiated by a browser
***REMOVED***     action, false if it was caused by a setToken call. See
***REMOVED***     {@link goog.history.Event}.
***REMOVED*** @private
***REMOVED***
goog.History.prototype.update_ = function(token, isNavigation) {
  this.lastToken_ = this.hiddenInput_.value = token;

  if (this.userVisible_) {
    if (goog.History.LEGACY_IE) {
      this.setIframeToken_(token);
    }

    this.setHash_(token);
  } else {
    this.setIframeToken_(token);
  }

  this.dispatchEvent(new goog.history.Event(this.getToken(), isNavigation));
***REMOVED***


***REMOVED***
***REMOVED*** Sets if the history oject should use longer intervals when polling.
***REMOVED***
***REMOVED*** @param {boolean} longerPolling Whether to enable longer polling.
***REMOVED*** @private
***REMOVED***
goog.History.prototype.setLongerPolling_ = function(longerPolling) {
  if (this.longerPolling_ != longerPolling) {
    this.timer_.setInterval(longerPolling ?
        goog.History.PollingType.LONG : goog.History.PollingType.NORMAL);
  }
  this.longerPolling_ = longerPolling;
***REMOVED***


***REMOVED***
***REMOVED*** Opera cancels all outstanding timeouts and intervals after any rapid
***REMOVED*** succession of navigation events, including the interval used to detect
***REMOVED*** navigation events. This function restarts the interval so that navigation can
***REMOVED*** continue. Ideally, only events which would be likely to cause a navigation
***REMOVED*** change (mousedown and keydown) would be bound to this function. Since Opera
***REMOVED*** seems to ignore keydown events while the alt key is pressed (such as
***REMOVED*** alt-left or right arrow), this function is also bound to the much more
***REMOVED*** frequent mousemove event. This way, when the update loop freezes, it will
***REMOVED*** unstick itself as the user wiggles the mouse in frustration.
***REMOVED*** @private
***REMOVED***
goog.History.prototype.operaDefibrillator_ = function() {
  this.timer_.stop();
  this.timer_.start();
***REMOVED***


***REMOVED***
***REMOVED*** List of user input event types registered in Opera to restart the history
***REMOVED*** timer (@see goog.History#operaDefibrillator_).
***REMOVED*** @type {Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.History.INPUT_EVENTS_ = [
  goog.events.EventType.MOUSEDOWN,
  goog.events.EventType.KEYDOWN,
  goog.events.EventType.MOUSEMOVE
];


***REMOVED***
***REMOVED*** Minimal HTML page used to populate the iframe in Internet Explorer. The title
***REMOVED*** is visible in the history dropdown menu, the iframe state is stored as the
***REMOVED*** body innerHTML.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.History.IFRAME_SOURCE_TEMPLATE_ = '<title>%s</title><body>%s</body>';


***REMOVED***
***REMOVED*** HTML template for an invisible iframe.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.History.IFRAME_TEMPLATE_ =
    '<iframe id="%s" style="display:none" %s></iframe>';


***REMOVED***
***REMOVED*** HTML template for an invisible named input element.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.History.INPUT_TEMPLATE_ =
    '<input type="text" name="%s" id="%s" style="display:none">';


***REMOVED***
***REMOVED*** Counter for the number of goog.History objects that have been instantiated.
***REMOVED*** Used to create unique IDs.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.History.historyCount_ = 0;


***REMOVED***
***REMOVED*** Types of polling. The values are in ms of the polling interval.
***REMOVED*** @enum {number}
***REMOVED***
goog.History.PollingType = {
  NORMAL: 150,
  LONG: 10000
***REMOVED***


***REMOVED***
***REMOVED*** Constant for the history change event type.
***REMOVED*** @enum {string}
***REMOVED*** @deprecated Use goog.history.EventType.
***REMOVED***
goog.History.EventType = goog.history.EventType;



***REMOVED***
***REMOVED*** Constant for the history change event type.
***REMOVED*** @param {string} token The string identifying the new history state.
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
***REMOVED*** @deprecated Use goog.history.Event.
***REMOVED***
goog.History.Event = goog.history.Event;
