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
***REMOVED*** @fileoverview Detects images dragged and dropped on to the window.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @author wcrosby@google.com (Wayne Crosby)
***REMOVED***

goog.provide('goog.ui.DragDropDetector');
goog.provide('goog.ui.DragDropDetector.EventType');
goog.provide('goog.ui.DragDropDetector.ImageDropEvent');
goog.provide('goog.ui.DragDropDetector.LinkDropEvent');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.math.Coordinate');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Creates a new drag and drop detector.
***REMOVED*** @param {string=} opt_filePath The URL of the page to use for the detector.
***REMOVED***     It should contain the same contents as dragdropdetector_target.html in
***REMOVED***     the demos directory.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.ui.DragDropDetector = function(opt_filePath) {
  goog.base(this);

  var iframe = goog.dom.createDom(goog.dom.TagName.IFRAME, {
    'frameborder': 0
  });
  // In Firefox, we do all drop detection with an IFRAME.  In IE, we only use
  // the IFRAME to capture copied, non-linked images.  (When we don't need it,
  // we put a text INPUT before it and push it off screen.)
  iframe.className = goog.userAgent.IE ?
      goog.getCssName(
          goog.ui.DragDropDetector.BASE_CSS_NAME_, 'ie-editable-iframe') :
      goog.getCssName(
          goog.ui.DragDropDetector.BASE_CSS_NAME_, 'w3c-editable-iframe');
  iframe.src = opt_filePath || goog.ui.DragDropDetector.DEFAULT_FILE_PATH_;

  this.element_ =***REMOVED*****REMOVED*** @type {HTMLIFrameElement}***REMOVED*** (iframe);

  this.handler_ = new goog.events.EventHandler(this);
  this.handler_.listen(iframe, goog.events.EventType.LOAD, this.initIframe_);

  if (goog.userAgent.IE) {
    // In IE, we have to bounce between an INPUT for catching links and an
    // IFRAME for catching images.
    this.textInput_ = goog.dom.createDom(goog.dom.TagName.INPUT, {
      'type': 'text',
      'className': goog.getCssName(
          goog.ui.DragDropDetector.BASE_CSS_NAME_, 'ie-input')
    });

    this.root_ = goog.dom.createDom(goog.dom.TagName.DIV,
        goog.getCssName(goog.ui.DragDropDetector.BASE_CSS_NAME_, 'ie-div'),
        this.textInput_, iframe);
  } else {
    this.root_ = iframe;
  }

  document.body.appendChild(this.root_);
***REMOVED***
goog.inherits(goog.ui.DragDropDetector, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Drag and drop event types.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.DragDropDetector.EventType = {
  IMAGE_DROPPED: 'onimagedrop',
  LINK_DROPPED: 'onlinkdrop'
***REMOVED***


***REMOVED***
***REMOVED*** Browser specific drop event type.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.DROP_EVENT_TYPE_ = goog.userAgent.IE ?
    goog.events.EventType.DROP : 'dragdrop';


***REMOVED***
***REMOVED*** Initial value for clientX and clientY indicating that the location has
***REMOVED*** never been updated.
***REMOVED***
goog.ui.DragDropDetector.INIT_POSITION = -10000;


***REMOVED***
***REMOVED*** Prefix for all CSS names.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.BASE_CSS_NAME_ = goog.getCssName('goog-dragdrop');


***REMOVED***
***REMOVED*** @desc Message shown to users to inform them that they can't drag and drop
***REMOVED***     local files.
***REMOVED***
var MSG_DRAG_DROP_LOCAL_FILE_ERROR = goog.getMsg('It is not possible to drag ' +
    'and drop image files at this time.\nPlease drag an image from your web ' +
    'browser.');


***REMOVED***
***REMOVED*** @desc Message shown to users trying to drag and drop protected images from
***REMOVED***     Flickr, etc.
***REMOVED***
var MSG_DRAG_DROP_PROTECTED_FILE_ERROR = goog.getMsg('The image you are ' +
    'trying to drag has been blocked by the hosting site.');


***REMOVED***
***REMOVED*** A map of special case information for URLs that cannot be dropped.  Each
***REMOVED*** entry is of the form:
***REMOVED***     regex: url regex
***REMOVED***     message: user visible message about this special case
***REMOVED*** @type {Array.<{regex: RegExp, message: string}>}
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.SPECIAL_CASE_URLS_ = [
  {
    regex: /^file:\/\/\//,
    message: MSG_DRAG_DROP_LOCAL_FILE_ERROR
  },
  {
    regex: /flickr(.*)spaceball.gif$/,
    message: MSG_DRAG_DROP_PROTECTED_FILE_ERROR
  }
];


***REMOVED***
***REMOVED*** Regex that matches anything that looks kind of like a URL.  It matches
***REMOVED*** nonspacechars://nonspacechars
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.URL_LIKE_REGEX_ = /^\S+:\/\/\S*$/;


***REMOVED***
***REMOVED*** Path to the dragdrop.html file.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.DEFAULT_FILE_PATH_ = 'dragdropdetector_target.html';


***REMOVED***
***REMOVED*** Our event handler object.
***REMOVED*** @type {goog.events.EventHandler}
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.handler_;


***REMOVED***
***REMOVED*** The root element (the IFRAME on most browsers, the DIV on IE).
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.root_;


***REMOVED***
***REMOVED*** The text INPUT element used to detect link drops on IE.  null on Firefox.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.textInput_;


***REMOVED***
***REMOVED*** The iframe element.
***REMOVED*** @type {HTMLIFrameElement}
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.element_;


***REMOVED***
***REMOVED*** The iframe's window, null if the iframe hasn't loaded yet.
***REMOVED*** @type {Window}
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.window_ = null;


***REMOVED***
***REMOVED*** The iframe's document, null if the iframe hasn't loaded yet.
***REMOVED*** @type {HTMLDocument}
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.document_ = null;


***REMOVED***
***REMOVED*** The iframe's body, null if the iframe hasn't loaded yet.
***REMOVED*** @type {HTMLBodyElement}
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.body_ = null;


***REMOVED***
***REMOVED*** Whether we are in "screen cover" mode in which the iframe or div is
***REMOVED*** covering the entire screen.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.isCoveringScreen_ = false;


***REMOVED***
***REMOVED*** The last position of the mouse while dragging.
***REMOVED*** @type {goog.math.Coordinate}
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.mousePosition_ = null;


***REMOVED***
***REMOVED*** Initialize the iframe after it has loaded.
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.initIframe_ = function() {
  // Set up a holder for position data.
  this.mousePosition_ = new goog.math.Coordinate(
      goog.ui.DragDropDetector.INIT_POSITION,
      goog.ui.DragDropDetector.INIT_POSITION);

  // Set up pointers to the important parts of the IFrame.
  this.window_ = this.element_.contentWindow;
  this.document_ = this.window_.document;
  this.body_ = this.document_.body;

  if (goog.userAgent.GECKO) {
    this.document_.designMode = 'on';
  } else if (!goog.userAgent.IE) {
    // Bug 1667110
    // In IE, we only set the IFrame body as content-editable when we bring it
    // into view at the top of the page.  Otherwise it may take focus when the
    // page is loaded, scrolling the user far offscreen.
    // Note that this isn't easily unit-testable, since it depends on a
    // browser-specific behavior with content-editable areas.
    this.body_.contentEditable = true;
  }

  this.handler_.listen(document.body, goog.events.EventType.DRAGENTER,
      this.coverScreen_);

  if (goog.userAgent.IE) {
    // IE only events.
    // Set up events on the IFrame.
    this.handler_.
        listen(this.body_,
            [goog.events.EventType.DRAGENTER, goog.events.EventType.DRAGOVER],
            goog.ui.DragDropDetector.enforceCopyEffect_).
        listen(this.body_, goog.events.EventType.MOUSEOUT,
            this.switchToInput_).
        listen(this.body_, goog.events.EventType.DRAGLEAVE,
            this.uncoverScreen_).
        listen(this.body_, goog.ui.DragDropDetector.DROP_EVENT_TYPE_,
            function(e) {
              this.trackMouse_(e);

              // The drop event occurs before the content is added to the
              // iframe.  We setTimeout so that handleNodeInserted_ is called
              //  after the content is in the document.
              goog.global.setTimeout(
                  goog.bind(this.handleNodeInserted_, this, e), 0);
              return true;
            }).

        // Set up events on the DIV.
        listen(this.root_,
            [goog.events.EventType.DRAGENTER, goog.events.EventType.DRAGOVER],
            this.handleNewDrag_).
        listen(this.root_,
            [
              goog.events.EventType.MOUSEMOVE,
              goog.events.EventType.KEYPRESS
            ], this.uncoverScreen_).

        // Set up events on the text INPUT.
        listen(this.textInput_, goog.events.EventType.DRAGOVER,
            goog.events.Event.preventDefault).
        listen(this.textInput_, goog.ui.DragDropDetector.DROP_EVENT_TYPE_,
            this.handleInputDrop_);
  } else {
    // W3C events.
    this.handler_.
        listen(this.body_, goog.ui.DragDropDetector.DROP_EVENT_TYPE_,
            function(e) {
              this.trackMouse_(e);
              this.uncoverScreen_();
            }).
        listen(this.body_,
            [goog.events.EventType.MOUSEMOVE, goog.events.EventType.KEYPRESS],
            this.uncoverScreen_).

        // Detect content insertion.
        listen(this.document_, 'DOMNodeInserted',
            this.handleNodeInserted_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Enforce that anything dragged over the IFRAME is copied in to it, rather
***REMOVED*** than making it navigate to a different URL.
***REMOVED*** @param {goog.events.BrowserEvent} e The event to enforce copying on.
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.enforceCopyEffect_ = function(e) {
  var event = e.getBrowserEvent();
  // This function is only called on IE.
  if (event.dataTransfer.dropEffect.toLowerCase() != 'copy') {
    event.dataTransfer.dropEffect = 'copy';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Cover the screen with the iframe.
***REMOVED*** @param {goog.events.BrowserEvent} e The event that caused this function call.
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.coverScreen_ = function(e) {
  // Don't do anything if the drop effect is 'none' and we are in IE.
  // It is set to 'none' in cases like dragging text inside a text area.
  if (goog.userAgent.IE &&
      e.getBrowserEvent().dataTransfer.dropEffect == 'none') {
    return;
  }

  if (!this.isCoveringScreen_) {
    this.isCoveringScreen_ = true;
    if (goog.userAgent.IE) {
      goog.style.setStyle(this.root_, 'top', '0');
      this.body_.contentEditable = true;
      this.switchToInput_(e);
    } else {
      goog.style.setStyle(this.root_, 'height', '5000px');
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Uncover the screen.
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.uncoverScreen_ = function() {
  if (this.isCoveringScreen_) {
    this.isCoveringScreen_ = false;
    if (goog.userAgent.IE) {
      this.body_.contentEditable = false;
      goog.style.setStyle(this.root_, 'top', '-5000px');
    } else {
      goog.style.setStyle(this.root_, 'height', '10px');
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Re-insert the INPUT into the DIV.  Does nothing when the DIV is off screen.
***REMOVED*** @param {goog.events.BrowserEvent} e The event that caused this function call.
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.switchToInput_ = function(e) {
  // This is only called on IE.
  if (this.isCoveringScreen_) {
    goog.style.showElement(this.textInput_, true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Remove the text INPUT so the IFRAME is showing.  Does nothing when the DIV is
***REMOVED*** off screen.
***REMOVED*** @param {goog.events.BrowserEvent} e The event that caused this function call.
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.switchToIframe_ = function(e) {
  // This is only called on IE.
  if (this.isCoveringScreen_) {
    goog.style.showElement(this.textInput_, false);
    this.isShowingInput_ = false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handle a new drag event.
***REMOVED*** @param {goog.events.BrowserEvent} e The event object.
***REMOVED*** @return {boolean|undefined} Returns false in IE to cancel the event.
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.handleNewDrag_ = function(e) {
  var event = e.getBrowserEvent();

  // This is only called on IE.
  if (event.dataTransfer.dropEffect == 'link') {
    this.switchToInput_(e);
    e.preventDefault();
    return false;
  }

  // Things that aren't links can be placed in the contentEditable iframe.
  this.switchToIframe_(e);

  // No need to return true since for events return true is the same as no
  // return.
***REMOVED***


***REMOVED***
***REMOVED*** Handle mouse tracking.
***REMOVED*** @param {goog.events.BrowserEvent} e The event object.
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.trackMouse_ = function(e) {
  this.mousePosition_.x = e.clientX;
  this.mousePosition_.y = e.clientY;

  // Check if the event is coming from within the iframe.
  if (goog.dom.getOwnerDocument(***REMOVED*** @type {Node}***REMOVED*** (e.target)) != document) {
    var iframePosition = goog.style.getClientPosition(this.element_);
    this.mousePosition_.x += iframePosition.x;
    this.mousePosition_.y += iframePosition.y;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handle a drop on the IE text INPUT.
***REMOVED*** @param {goog.events.BrowserEvent} e The event object.
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.handleInputDrop_ = function(e) {
  this.dispatchEvent(
      new goog.ui.DragDropDetector.LinkDropEvent(
          e.getBrowserEvent().dataTransfer.getData('Text')));
  this.uncoverScreen_();
  e.preventDefault();
***REMOVED***


***REMOVED***
***REMOVED*** Clear the contents of the iframe.
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.clearContents_ = function() {
  if (goog.userAgent.WEBKIT) {
    // Since this is called on a mutation event for the nodes we are going to
    // clear, calling this right away crashes some versions of WebKit.  Wait
    // until the events are finished.
    goog.global.setTimeout(goog.bind(function() {
      this.innerHTML = '';
    }, this.body_), 0);
  } else {
    this.document_.execCommand('selectAll', false, null);
    this.document_.execCommand('delete', false, null);
    this.document_.execCommand('selectAll', false, null);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Event handler called when the content of the iframe changes.
***REMOVED*** @param {goog.events.BrowserEvent} e The event that caused this function call.
***REMOVED*** @private
***REMOVED***
goog.ui.DragDropDetector.prototype.handleNodeInserted_ = function(e) {
  var uri;

  if (this.body_.innerHTML.indexOf('<') == -1) {
    // If the document contains no tags (i.e. is just text), try it out.
    uri = goog.string.trim(goog.dom.getTextContent(this.body_));

    // See if it looks kind of like a url.
    if (!uri.match(goog.ui.DragDropDetector.URL_LIKE_REGEX_)) {
      uri = null;
    }
  }

  if (!uri) {
    var imgs = this.body_.getElementsByTagName(goog.dom.TagName.IMG);
    if (imgs && imgs.length) {
      // TODO(robbyw): Grab all the images, instead of just the first.
      var img = imgs[0];
      uri = img.src;
    }
  }

  if (uri) {
    var specialCases = goog.ui.DragDropDetector.SPECIAL_CASE_URLS_;
    var len = specialCases.length;
    for (var i = 0; i < len; i++) {
      var specialCase = specialCases[i];
      if (uri.match(specialCase.regex)) {
        alert(specialCase.message);
        break;
      }
    }

    // If no special cases matched, add the image.
    if (i == len) {
      this.dispatchEvent(
          new goog.ui.DragDropDetector.ImageDropEvent(
              uri, this.mousePosition_));
      return;
    }
  }

  var links = this.body_.getElementsByTagName(goog.dom.TagName.A);
  if (links) {
    for (i = 0, len = links.length; i < len; i++) {
      this.dispatchEvent(
          new goog.ui.DragDropDetector.LinkDropEvent(links[i].href));
    }
  }

  this.clearContents_();
  this.uncoverScreen_();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.DragDropDetector.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.handler_.dispose();
  this.handler_ = null;
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new image drop event object.
***REMOVED*** @param {string} url The url of the dropped image.
***REMOVED*** @param {goog.math.Coordinate} position The screen position where the drop
***REMOVED***     occurred.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.ui.DragDropDetector.ImageDropEvent = function(url, position) {
  goog.base(this, goog.ui.DragDropDetector.EventType.IMAGE_DROPPED);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The url of the image that was dropped.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.url_ = url;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The screen position where the drop occurred.
  ***REMOVED*** @type {goog.math.Coordinate}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.position_ = position;
***REMOVED***
goog.inherits(goog.ui.DragDropDetector.ImageDropEvent,
    goog.events.Event);


***REMOVED***
***REMOVED*** @return {string} The url of the image that was dropped.
***REMOVED***
goog.ui.DragDropDetector.ImageDropEvent.prototype.getUrl = function() {
  return this.url_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.math.Coordinate} The screen position where the drop occurred.
***REMOVED***     This may be have x and y of goog.ui.DragDropDetector.INIT_POSITION,
***REMOVED***     indicating the drop position is unknown.
***REMOVED***
goog.ui.DragDropDetector.ImageDropEvent.prototype.getPosition = function() {
  return this.position_;
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new link drop event object.
***REMOVED*** @param {string} url The url of the dropped link.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.ui.DragDropDetector.LinkDropEvent = function(url) {
  goog.base(this, goog.ui.DragDropDetector.EventType.LINK_DROPPED);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The url of the link that was dropped.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.url_ = url;
***REMOVED***
goog.inherits(goog.ui.DragDropDetector.LinkDropEvent,
    goog.events.Event);


***REMOVED***
***REMOVED*** @return {string} The url of the link that was dropped.
***REMOVED***
goog.ui.DragDropDetector.LinkDropEvent.prototype.getUrl = function() {
  return this.url_;
***REMOVED***
