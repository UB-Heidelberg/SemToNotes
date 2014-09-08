// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Simple image loader, used for preloading.
***REMOVED*** @author nnaze@google.com (Nathan Naze)
***REMOVED***

goog.provide('goog.labs.net.image');

goog.require('goog.Promise');
goog.require('goog.events.EventHandler');
***REMOVED***
goog.require('goog.net.EventType');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Loads a single image.  Useful for preloading images.
***REMOVED***
***REMOVED*** @param {string} uri URI of the image.
***REMOVED*** @param {(!Image|function(): !Image)=} opt_image If present, instead of
***REMOVED***     creating a new Image instance the function will use the passed Image
***REMOVED***     instance or the result of calling the Image factory respectively. This
***REMOVED***     can be used to control exactly how Image instances are created, for
***REMOVED***     example if they should be created in a particular document element, or
***REMOVED***     have fields that will trigger CORS image fetches.
***REMOVED*** @return {!goog.Promise.<!Image>} A Promise that will be resolved with the
***REMOVED***     given image if the image successfully loads.
***REMOVED***
goog.labs.net.image.load = function(uri, opt_image) {
  return new goog.Promise(function(resolve, reject) {
    var image;
    if (!goog.isDef(opt_image)) {
      image = new Image();
    } else if (goog.isFunction(opt_image)) {
      image = opt_image();
    } else {
      image = opt_image;
    }

    // IE's load event on images can be buggy.  For older browsers, wait for
    // readystatechange events and check if readyState is 'complete'.
    // See:
    // http://msdn.microsoft.com/en-us/library/ie/ms536957(v=vs.85).aspx
    // http://msdn.microsoft.com/en-us/library/ie/ms534359(v=vs.85).aspx
    //
    // Starting with IE11, start using standard 'load' events.
    // See:
    // http://msdn.microsoft.com/en-us/library/ie/dn467845(v=vs.85).aspx
    var loadEvent = (goog.userAgent.IE && goog.userAgent.VERSION < 11) ?
        goog.net.EventType.READY_STATE_CHANGE : goog.events.EventType.LOAD;

    var handler = new goog.events.EventHandler();
    handler.listen(
        image,
        [loadEvent, goog.net.EventType.ABORT, goog.net.EventType.ERROR],
        function(e) {

          // We only registered listeners for READY_STATE_CHANGE for IE.
          // If readyState is now COMPLETE, the image has loaded.
          // See related comment above.
          if (e.type == goog.net.EventType.READY_STATE_CHANGE &&
              image.readyState != goog.net.EventType.COMPLETE) {
            return;
          }

          // At this point, we know whether the image load was successful
          // and no longer care about image events.
          goog.dispose(handler);

          // Whether the image successfully loaded.
          if (e.type == loadEvent) {
            resolve(image);
          } else {
            reject(null);
          }
        });

    // Initiate the image request.
    image.src = uri;
  });
***REMOVED***
