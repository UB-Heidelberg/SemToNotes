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
***REMOVED*** @fileoverview Wrapper class for handling XmlHttpRequests.
***REMOVED***


goog.provide('goog.net.XhrLite');

***REMOVED***



***REMOVED***
***REMOVED*** Basic class for handling XmlHttpRequests.
***REMOVED*** @deprecated Use goog.net.XhrIo instead.
***REMOVED***
***REMOVED***
goog.net.XhrLite = goog.net.XhrIo;

// Statics are needed to avoid code removal.


***REMOVED***
***REMOVED*** Static send that creates a short lived instance of XhrIo to send the
***REMOVED*** request.
***REMOVED*** @see goog.net.XhrIo.cleanup
***REMOVED*** @param {string} url Uri to make request too.
***REMOVED*** @param {Function=} opt_callback Callback function for when request is
***REMOVED***     complete.
***REMOVED*** @param {string=} opt_method Send method, default: GET.
***REMOVED*** @param {string=} opt_content Post data.
***REMOVED*** @param {Object|goog.structs.Map=} opt_headers Map of headers to add to the
***REMOVED***     request.
***REMOVED*** @param {number=} opt_timeoutInterval Number of milliseconds after which an
***REMOVED***     incomplete request will be aborted; 0 means no timeout is set.
***REMOVED***
goog.net.XhrLite.send = goog.net.XhrIo.send;


***REMOVED***
***REMOVED*** Disposes all non-disposed instances of goog.net.XhrIo created by
***REMOVED*** {@link goog.net.XhrIo.send}.
***REMOVED*** {@link goog.net.XhrIo.send} cleans up the goog.net.XhrIo instance
***REMOVED*** it creates when the request completes or fails.  However, if
***REMOVED*** the request never completes, then the goog.net.XhrIo is not disposed.
***REMOVED*** This can occur if the window is unloaded before the request completes.
***REMOVED*** We could have {@link goog.net.XhrIo.send} return the goog.net.XhrIo
***REMOVED*** it creates and make the client of {@link goog.net.XhrIo.send} be
***REMOVED*** responsible for disposing it in this case.  However, this makes things
***REMOVED*** significantly more complicated for the client, and the whole point
***REMOVED*** of {@link goog.net.XhrIo.send} is that it's simple and easy to use.
***REMOVED*** Clients of {@link goog.net.XhrIo.send} should call
***REMOVED*** {@link goog.net.XhrIo.cleanup} when doing final
***REMOVED*** cleanup on window unload.
***REMOVED***
goog.net.XhrLite.cleanup = goog.net.XhrIo.cleanup;


***REMOVED***
***REMOVED*** Installs exception protection for all entry point introduced by
***REMOVED*** goog.net.XhrIo instances which are not protected by
***REMOVED*** {@link goog.debug.ErrorHandler#protectWindowSetTimeout},
***REMOVED*** {@link goog.debug.ErrorHandler#protectWindowSetInterval}, or
***REMOVED*** {@link goog.events.protectBrowserEventEntryPoint}.
***REMOVED***
***REMOVED*** @param {goog.debug.ErrorHandler} errorHandler Error handler with which to
***REMOVED***     protect the entry point(s).
***REMOVED*** @param {boolean=} opt_tracers Whether to install tracers around the entry
***REMOVED***     point.
***REMOVED***
goog.net.XhrLite.protectEntryPoints = goog.net.XhrIo.protectEntryPoints;


***REMOVED***
***REMOVED*** Disposes of the specified goog.net.XhrIo created by
***REMOVED*** {@link goog.net.XhrIo.send} and removes it from
***REMOVED*** {@link goog.net.XhrIo.pendingStaticSendInstances_}.
***REMOVED*** @param {goog.net.XhrIo} XhrIo An XhrIo created by
***REMOVED***     {@link goog.net.XhrIo.send}.
***REMOVED*** @private
***REMOVED***
goog.net.XhrLite.cleanupSend_ = goog.net.XhrIo.cleanupSend_;


***REMOVED***
***REMOVED*** The Content-Type HTTP header name
***REMOVED*** @type {string}
***REMOVED***
goog.net.XhrLite.CONTENT_TYPE_HEADER = goog.net.XhrIo.CONTENT_TYPE_HEADER;


***REMOVED***
***REMOVED*** The Content-Type HTTP header value for a url-encoded form
***REMOVED*** @type {string}
***REMOVED***
goog.net.XhrLite.FORM_CONTENT_TYPE = goog.net.XhrIo.FORM_CONTENT_TYPE;


***REMOVED***
***REMOVED*** All non-disposed instances of goog.net.XhrIo created
***REMOVED*** by {@link goog.net.XhrIo.send} are in this Array.
***REMOVED*** @see goog.net.XhrIo.cleanup
***REMOVED*** @type {Array.<goog.net.XhrIo>}
***REMOVED*** @private
***REMOVED***
goog.net.XhrLite.sendInstances_ = goog.net.XhrIo.sendInstances_;
