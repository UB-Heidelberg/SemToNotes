// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Image loader utility class.  Useful when an application needs
***REMOVED*** to preload multiple images, for example so they can be sized.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @author zachlloyd@google.com (Zachary Lloyd)
***REMOVED*** @author jonemerson@google.com (Jon Emerson)
***REMOVED***

goog.provide('goog.net.ImageLoader');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.net.EventType');
goog.require('goog.object');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Image loader utility class.  Raises a {@link goog.events.EventType.LOAD}
***REMOVED*** event for each image loaded, with an {@link Image} object as the target of
***REMOVED*** the event, normalized to have {@code naturalHeight} and {@code naturalWidth}
***REMOVED*** attributes.
***REMOVED***
***REMOVED*** To use this class, run:
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   var imageLoader = new goog.net.ImageLoader();
***REMOVED*** ***REMOVED***imageLoader, goog.net.EventType.COMPLETE,
***REMOVED***       function(e) { ... });
***REMOVED***   imageLoader.addImage("image_id", "http://path/to/image.gif");
***REMOVED***   imageLoader.start();
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** The start() method must be called to start image loading.  Images can be
***REMOVED*** added and removed after loading has started, but only those images added
***REMOVED*** before start() was called will be loaded until start() is called again.
***REMOVED*** A goog.net.EventType.COMPLETE event will be dispatched only once all
***REMOVED*** outstanding images have completed uploading.
***REMOVED***
***REMOVED*** @param {Element=} opt_parent An optional parent element whose document object
***REMOVED***     should be used to load images.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.net.ImageLoader = function(opt_parent) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map of image IDs to their image src, used to keep track of the images to
  ***REMOVED*** load.  Once images have started loading, they're removed from this map.
  ***REMOVED*** @type {!Object.<string, string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.imageIdToUrlMap_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map of image IDs to their image element, used only for images that are in
  ***REMOVED*** the process of loading.  Used to clean-up event listeners and to know
  ***REMOVED*** when we've completed loading images.
  ***REMOVED*** @type {!Object.<string, !Element>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.imageIdToImageMap_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event handler object, used to keep track of onload and onreadystatechange
  ***REMOVED*** listeners.
  ***REMOVED*** @type {!goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.handler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The parent element whose document object will be used to load images.
  ***REMOVED*** Useful if you want to load the images from a window other than the current
  ***REMOVED*** window in order to control the Referer header sent when the image is
  ***REMOVED*** loaded.
  ***REMOVED*** @type {Element|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.parent_ = opt_parent;
***REMOVED***
goog.inherits(goog.net.ImageLoader, goog.events.EventTarget);


***REMOVED***
***REMOVED*** An array of event types to listen to on images.  This is browser dependent.
***REMOVED*** Internet Explorer doesn't reliably raise LOAD events on images, so we must
***REMOVED*** use READY_STATE_CHANGE.  If the image is cached locally, IE won't fire the
***REMOVED*** LOAD event while the onreadystate event is fired always.  On the other hand,
***REMOVED*** the ERROR event is always fired whenever the image is not loaded successfully
***REMOVED*** no matter whether it's cached or not.
***REMOVED*** @type {!Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.net.ImageLoader.IMAGE_LOAD_EVENTS_ = [
  goog.userAgent.IE ? goog.net.EventType.READY_STATE_CHANGE :
      goog.events.EventType.LOAD,
  goog.net.EventType.ABORT,
  goog.net.EventType.ERROR
];


***REMOVED***
***REMOVED*** Adds an image to the image loader, and associates it with the given ID
***REMOVED*** string.  If an image with that ID already exists, it is silently replaced.
***REMOVED*** When the image in question is loaded, the target of the LOAD event will be
***REMOVED*** an {@code Image} object with {@code id} and {@code src} attributes based on
***REMOVED*** these arguments.
***REMOVED*** @param {string} id The ID of the image to load.
***REMOVED*** @param {string|Image} image Either the source URL of the image or the HTML
***REMOVED***     image element itself (or any object with a {@code src} property, really).
***REMOVED***
goog.net.ImageLoader.prototype.addImage = function(id, image) {
  var src = goog.isString(image) ? image : image.src;
  if (src) {
    // For now, we just store the source URL for the image.
    this.imageIdToUrlMap_[id] = src;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the image associated with the given ID string from the image loader.
***REMOVED*** If the image was previously loading, removes any listeners for its events
***REMOVED*** and dispatches a COMPLETE event if all remaining images have now completed.
***REMOVED*** @param {string} id The ID of the image to remove.
***REMOVED***
goog.net.ImageLoader.prototype.removeImage = function(id) {
  delete this.imageIdToUrlMap_[id];

  var image = this.imageIdToImageMap_[id];
  if (image) {
    delete this.imageIdToImageMap_[id];

    // Stop listening for events on the image.
    this.handler_.unlisten(image, goog.net.ImageLoader.IMAGE_LOAD_EVENTS_,
        this.onNetworkEvent_);

    // If this was the last image, raise a COMPLETE event.
    if (goog.object.isEmpty(this.imageIdToImageMap_) &&
        goog.object.isEmpty(this.imageIdToUrlMap_)) {
      this.dispatchEvent(goog.net.EventType.COMPLETE);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Starts loading all images in the image loader in parallel.  Raises a LOAD
***REMOVED*** event each time an image finishes loading, and a COMPLETE event after all
***REMOVED*** images have finished loading.
***REMOVED***
goog.net.ImageLoader.prototype.start = function() {
  // Iterate over the keys, rather than the full object, to essentially clone
  // the initial queued images in case any event handlers decide to add more
  // images before this loop has finished executing.
  var imageIdToUrlMap = this.imageIdToUrlMap_;
  goog.array.forEach(goog.object.getKeys(imageIdToUrlMap),
      function(id) {
        var src = imageIdToUrlMap[id];
        if (src) {
          delete imageIdToUrlMap[id];
          this.loadImage_(src, id);
        }
      }, this);
***REMOVED***


***REMOVED***
***REMOVED*** Creates an {@code Image} object with the specified ID and source URL, and
***REMOVED*** listens for network events raised as the image is loaded.
***REMOVED*** @param {string} src The image source URL.
***REMOVED*** @param {string} id The unique ID of the image to load.
***REMOVED*** @private
***REMOVED***
goog.net.ImageLoader.prototype.loadImage_ = function(src, id) {
  if (this.isDisposed()) {
    // When loading an image in IE7 (and maybe IE8), the error handler
    // may fire before we yield JS control. If the error handler
    // dispose the ImageLoader, this method will throw exception.
    return;
  }

  var image;
  if (this.parent_) {
    var dom = goog.dom.getDomHelper(this.parent_);
    image = dom.createDom('img');
  } else {
    image = new Image();
  }

  this.handler_.listen(image, goog.net.ImageLoader.IMAGE_LOAD_EVENTS_,
      this.onNetworkEvent_);
  this.imageIdToImageMap_[id] = image;

  image.id = id;
  image.src = src;
***REMOVED***


***REMOVED***
***REMOVED*** Handles net events (READY_STATE_CHANGE, LOAD, ABORT, and ERROR).
***REMOVED*** @param {goog.events.Event} evt The network event to handle.
***REMOVED*** @private
***REMOVED***
goog.net.ImageLoader.prototype.onNetworkEvent_ = function(evt) {
  var image =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (evt.currentTarget);

  if (!image) {
    return;
  }

  if (evt.type == goog.net.EventType.READY_STATE_CHANGE) {
    // This implies that the user agent is IE; see loadImage_().
    // Noe that this block is used to check whether the image is ready to
    // dispatch the COMPLETE event.
    if (image.readyState == goog.net.EventType.COMPLETE) {
      // This is the IE equivalent of a LOAD event.
      evt.type = goog.events.EventType.LOAD;
    } else {
      // This may imply that the load failed.
      // Note that the image has only the following states:
      //  ***REMOVED*** uninitialized
      //  ***REMOVED*** loading
      //  ***REMOVED*** complete
      // When the ERROR or the ABORT event is fired, the readyState
      // will be either uninitialized or loading and we'd ignore those states
      // since they will be handled separately (eg: evt.type = 'ERROR').

      // Notes from MSDN : The states through which an object passes are
      // determined by that object. An object can skip certain states
      // (for example, interactive) if the state does not apply to that object.
      // see http://msdn.microsoft.com/en-us/library/ms534359(VS.85).aspx

      // The image is not loaded, ignore.
      return;
    }
  }

  // Add natural width/height properties for non-Gecko browsers.
  if (typeof image.naturalWidth == 'undefined') {
    if (evt.type == goog.events.EventType.LOAD) {
      image.naturalWidth = image.width;
      image.naturalHeight = image.height;
    } else {
      // This implies that the image fails to be loaded.
      image.naturalWidth = 0;
      image.naturalHeight = 0;
    }
  }

  // Redispatch the event on behalf of the image. Note that the external
  // listener may dispose this instance.
  this.dispatchEvent({type: evt.type, target: image});

  if (this.isDisposed()) {
    // If instance was disposed by listener, exit this function.
    return;
  }

  this.removeImage(image.id);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.net.ImageLoader.prototype.disposeInternal = function() {
  delete this.imageIdToUrlMap_;
  delete this.imageIdToImageMap_;
  goog.dispose(this.handler_);

  goog.net.ImageLoader.superClass_.disposeInternal.call(this);
***REMOVED***
