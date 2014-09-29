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
***REMOVED*** @fileoverview Error codes shared between goog.net.IframeIo and
***REMOVED*** goog.net.XhrIo.
***REMOVED***

goog.provide('goog.net.ErrorCode');


***REMOVED***
***REMOVED*** Error codes
***REMOVED*** @enum {number}
***REMOVED***
goog.net.ErrorCode = {

 ***REMOVED*****REMOVED***
  ***REMOVED*** There is no error condition.
 ***REMOVED*****REMOVED***
  NO_ERROR: 0,

 ***REMOVED*****REMOVED***
  ***REMOVED*** The most common error from iframeio, unfortunately, is that the browser
  ***REMOVED*** responded with an error page that is classed as a different domain. The
  ***REMOVED*** situations, are when a browser error page  is shown -- 404, access denied,
  ***REMOVED*** DNS failure, connection reset etc.)
  ***REMOVED***
 ***REMOVED*****REMOVED***
  ACCESS_DENIED: 1,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Currently the only case where file not found will be caused is when the
  ***REMOVED*** code is running on the local file system and a non-IE browser makes a
  ***REMOVED*** request to a file that doesn't exist.
 ***REMOVED*****REMOVED***
  FILE_NOT_FOUND: 2,

 ***REMOVED*****REMOVED***
  ***REMOVED*** If Firefox shows a browser error page, such as a connection reset by
  ***REMOVED*** server or access denied, then it will fail silently without the error or
  ***REMOVED*** load handlers firing.
 ***REMOVED*****REMOVED***
  FF_SILENT_ERROR: 3,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Custom error provided by the client through the error check hook.
 ***REMOVED*****REMOVED***
  CUSTOM_ERROR: 4,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Exception was thrown while processing the request.
 ***REMOVED*****REMOVED***
  EXCEPTION: 5,

 ***REMOVED*****REMOVED***
  ***REMOVED*** The Http response returned a non-successful http status code.
 ***REMOVED*****REMOVED***
  HTTP_ERROR: 6,

 ***REMOVED*****REMOVED***
  ***REMOVED*** The request was aborted.
 ***REMOVED*****REMOVED***
  ABORT: 7,

 ***REMOVED*****REMOVED***
  ***REMOVED*** The request timed out.
 ***REMOVED*****REMOVED***
  TIMEOUT: 8,

 ***REMOVED*****REMOVED***
  ***REMOVED*** The resource is not available offline.
 ***REMOVED*****REMOVED***
  OFFLINE: 9
***REMOVED***


***REMOVED***
***REMOVED*** Returns a friendly error message for an error code. These messages are for
***REMOVED*** debugging and are not localized.
***REMOVED*** @param {goog.net.ErrorCode} errorCode An error code.
***REMOVED*** @return {string} A message for debugging.
***REMOVED***
goog.net.ErrorCode.getDebugMessage = function(errorCode) {
  switch (errorCode) {
    case goog.net.ErrorCode.NO_ERROR:
      return 'No Error';

    case goog.net.ErrorCode.ACCESS_DENIED:
      return 'Access denied to content document';

    case goog.net.ErrorCode.FILE_NOT_FOUND:
      return 'File not found';

    case goog.net.ErrorCode.FF_SILENT_ERROR:
      return 'Firefox silently errored';

    case goog.net.ErrorCode.CUSTOM_ERROR:
      return 'Application custom error';

    case goog.net.ErrorCode.EXCEPTION:
      return 'An exception occurred';

    case goog.net.ErrorCode.HTTP_ERROR:
      return 'Http response at 400 or 500 level';

    case goog.net.ErrorCode.ABORT:
      return 'Request was aborted';

    case goog.net.ErrorCode.TIMEOUT:
      return 'Request timed out';

    case goog.net.ErrorCode.OFFLINE:
      return 'The resource is not available offline';

    default:
      return 'Unrecognized error code';
  }
***REMOVED***
