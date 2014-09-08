/*global env: true***REMOVED***
***REMOVED***
***REMOVED*** Helper functions for handling errors.
***REMOVED***
***REMOVED*** @deprecated As of JSDoc 3.3.0. This module may be removed in a future release. Use the module
***REMOVED*** {@link module:jsdoc/util/logger} to log warnings and errors.
***REMOVED*** @module jsdoc/util/error
***REMOVED***
'use strict';

***REMOVED***
***REMOVED*** Log an exception as an error.
***REMOVED***
***REMOVED*** Prior to JSDoc 3.3.0, this method would either log the exception (if lenient mode was enabled) or
***REMOVED*** re-throw the exception (default).
***REMOVED***
***REMOVED*** In JSDoc 3.3.0 and later, lenient mode has been replaced with strict mode, which is disabled by
***REMOVED*** default. If strict mode is enabled, calling the `handle` method causes JSDoc to exit immediately,
***REMOVED*** just as if the exception had been re-thrown.
***REMOVED***
***REMOVED*** @deprecated As of JSDoc 3.3.0. This module may be removed in a future release.
***REMOVED*** @param {Error} e - The exception to log.
***REMOVED*** @memberof module:jsdoc/util/error
***REMOVED***
exports.handle = function(e) {
    var logger = require('jsdoc/util/logger');
    var msg = e ? ( e.message || JSON.stringify(e) ) : '';

    // include the error type if it's an Error object
    if (e instanceof Error) {
        msg = e.name + ': ' + msg;
    }

    logger.error(msg);
***REMOVED***
