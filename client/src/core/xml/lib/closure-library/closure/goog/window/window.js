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
***REMOVED*** @fileoverview Utilities for window manipulation.
***REMOVED***


goog.provide('goog.window');

goog.require('goog.string');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Default height for popup windows
***REMOVED*** @type {number}
***REMOVED***
goog.window.DEFAULT_POPUP_HEIGHT = 500;


***REMOVED***
***REMOVED*** Default width for popup windows
***REMOVED*** @type {number}
***REMOVED***
goog.window.DEFAULT_POPUP_WIDTH = 690;


***REMOVED***
***REMOVED*** Default target for popup windows
***REMOVED*** @type {string}
***REMOVED***
goog.window.DEFAULT_POPUP_TARGET = 'google_popup';


***REMOVED***
***REMOVED*** Opens a new window.
***REMOVED***
***REMOVED*** @param {string|Object} linkRef A string or an object that supports toString,
***REMOVED***     for example goog.Uri.  If this is an object with a 'href' attribute, such
***REMOVED***     as HTMLAnchorElement, it will be used instead.
***REMOVED***
***REMOVED*** @param {Object=} opt_options supports the following options:
***REMOVED***  'target': (string) target (window name). If null, linkRef.target will
***REMOVED***          be used.
***REMOVED***  'width': (number) window width.
***REMOVED***  'height': (number) window height.
***REMOVED***  'top': (number) distance from top of screen
***REMOVED***  'left': (number) distance from left of screen
***REMOVED***  'toolbar': (boolean) show toolbar
***REMOVED***  'scrollbars': (boolean) show scrollbars
***REMOVED***  'location': (boolean) show location
***REMOVED***  'statusbar': (boolean) show statusbar
***REMOVED***  'menubar': (boolean) show menubar
***REMOVED***  'resizable': (boolean) resizable
***REMOVED***  'noreferrer': (boolean) whether to attempt to remove the referrer header
***REMOVED***      from the request headers. Does this by opening a blank window that
***REMOVED***      then redirects to the target url, so users may see some flickering.
***REMOVED***
***REMOVED*** @param {Window=} opt_parentWin Parent window that should be used to open the
***REMOVED***                 new window.
***REMOVED***
***REMOVED*** @return {Window} Returns the window object that was opened. This returns
***REMOVED***                  null if a popup blocker prevented the window from being
***REMOVED***                  opened.
***REMOVED***
goog.window.open = function(linkRef, opt_options, opt_parentWin) {
  if (!opt_options) {
    opt_options = {***REMOVED***
  }
  var parentWin = opt_parentWin || window;

  // HTMLAnchorElement has a toString() method with the same behavior as
  // goog.Uri in all browsers except for Safari, which returns
  // '[object HTMLAnchorElement]'.  We check for the href first, then
  // assume that it's a goog.Uri or String otherwise.
  var href = typeof linkRef.href != 'undefined' ? linkRef.href :
      String(linkRef);
  var target = opt_options.target || linkRef.target;

  var sb = [];
  for (var option in opt_options) {
    switch (option) {
      case 'width':
      case 'height':
      case 'top':
      case 'left':
        sb.push(option + '=' + opt_options[option]);
        break;
      case 'target':
      case 'noreferrer':
        break;
      default:
        sb.push(option + '=' + (opt_options[option] ? 1 : 0));
    }
  }
  var optionString = sb.join(',');

  var newWin;
  if (opt_options['noreferrer']) {
    // Use a meta-refresh to stop the referrer from being included in the
    // request headers.
    newWin = parentWin.open('', target, optionString);
    if (newWin) {
      if (goog.userAgent.IE) {
        // IE has problems parsing the content attribute if the url contains
        // a semicolon. We can fix this by adding quotes around the url, but
        // then we can't parse quotes in the URL correctly. We take a
        // best-effort approach.
        //
        // If the URL has semicolons, wrap it in single quotes to protect
        // the semicolons.
        // If the URL has semicolons and single quotes, url-encode the single
        // quotes as well.
        //
        // This is imperfect. Notice that both ' and ; are reserved characters
        // in URIs, so this could do the wrong thing, but at least it will
        // do the wrong thing in only rare cases.
        // ugh.
        if (href.indexOf(';') != -1) {
          href = "'" + href.replace(/'/g, '%27') + "'";
        }
      }
      newWin.opener = null;
      if (goog.userAgent.WEBKIT) {
        // In some versions of Chrome (tested on 15), using meta refresh won't
        // put the new page in a new process, but setting location.href does. If
        // Chrome fixes that bug, we can get rid of this conditional.
        // http://code.google.com/p/chromium/issues/detail?id=93517
        newWin.location.href = href;
      } else {
        href = goog.string.htmlEscape(href);
        newWin.document.write('<META HTTP-EQUIV="refresh" content="0; url=' +
                              href + '">');
        newWin.document.close();
      }
    }
  } else {
    newWin = parentWin.open(href, target, optionString);
  }
  // newWin is null if a popup blocker prevented the window open.
  return newWin;
***REMOVED***


***REMOVED***
***REMOVED*** Opens a new window without any real content in it.
***REMOVED***
***REMOVED*** This can be used to get around popup blockers if you need to open a window
***REMOVED*** in response to a user event, but need to do asynchronous work to determine
***REMOVED*** the URL to open, and then set the URL later.
***REMOVED***
***REMOVED*** Example usage:
***REMOVED***
***REMOVED*** var newWin = goog.window.openBlank('Loading...');
***REMOVED*** setTimeout(
***REMOVED***     function() {
***REMOVED***       newWin.location.href = 'http://www.google.com';
***REMOVED***     }, 100);
***REMOVED***
***REMOVED*** @param {string=} opt_message String to show in the new window. This string
***REMOVED***     will be HTML-escaped to avoid XSS issues.
***REMOVED*** @param {Object=} opt_options Options to open window with.
***REMOVED***     {@see goog.window.open for exact option semantics}.
***REMOVED*** @param {Window=} opt_parentWin Parent window that should be used to open the
***REMOVED***                 new window.
***REMOVED*** @return {Window} Returns the window object that was opened. This returns
***REMOVED***                  null if a popup blocker prevented the window from being
***REMOVED***                  opened.
***REMOVED***
goog.window.openBlank = function(opt_message, opt_options, opt_parentWin) {

  // Open up a window with the loading message and nothing else.
  // This will be interpreted as HTML content type with a missing doctype
  // and html/body tags, but is otherwise acceptable.
  var loadingMessage = opt_message ? goog.string.htmlEscape(opt_message) : '';
  return***REMOVED*****REMOVED*** @type {Window}***REMOVED*** (goog.window.open(
      'javascript:"' + encodeURI(loadingMessage) + '"',
      opt_options, opt_parentWin));
***REMOVED***


***REMOVED***
***REMOVED*** Raise a help popup window, defaulting to "Google standard" size and name.
***REMOVED***
***REMOVED*** (If your project is using GXPs, consider using {@link PopUpLink.gxp}.)
***REMOVED***
***REMOVED*** @param {string|Object} linkRef if this is a string, it will be used as the
***REMOVED*** URL of the popped window; otherwise it's assumed to be an HTMLAnchorElement
***REMOVED*** (or some other object with "target" and "href" properties).
***REMOVED***
***REMOVED*** @param {Object=} opt_options Options to open window with.
***REMOVED***     {@see goog.window.open for exact option semantics}
***REMOVED***     Additional wrinkles to the options:
***REMOVED***     - if 'target' field is null, linkRef.target will be used. If***REMOVED***that's*
***REMOVED***     null, the default is "google_popup".
***REMOVED***     - if 'width' field is not specified, the default is 690.
***REMOVED***     - if 'height' field is not specified, the default is 500.
***REMOVED***
***REMOVED*** @return {boolean} true if the window was not popped up, false if it was.
***REMOVED***
goog.window.popup = function(linkRef, opt_options) {
  if (!opt_options) {
    opt_options = {***REMOVED***
  }

  // set default properties
  opt_options['target'] = opt_options['target'] ||
      linkRef['target'] || goog.window.DEFAULT_POPUP_TARGET;
  opt_options['width'] = opt_options['width'] ||
      goog.window.DEFAULT_POPUP_WIDTH;
  opt_options['height'] = opt_options['height'] ||
      goog.window.DEFAULT_POPUP_HEIGHT;

  var newWin = goog.window.open(linkRef, opt_options);
  if (!newWin) {
    return true;
  }
  newWin.focus();

  return false;
***REMOVED***
