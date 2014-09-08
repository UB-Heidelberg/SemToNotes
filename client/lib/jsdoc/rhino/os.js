***REMOVED***
***REMOVED*** Partial Rhino implementation of Node.js' `os` module.
***REMOVED*** @module os
***REMOVED*** @author Jeff Williams <jeffrey.l.williams@gmail.com>
***REMOVED*** @see http://nodejs.org/api/os.html
***REMOVED***
'use strict';

exports.EOL = String( java.lang.System.getProperty('line.separator') );

// clearly not accurate, but probably good enough
exports.platform = function() {
    if ( String(java.lang.System.getProperty('os.name')).match(/^[Ww]in/) ) {
        return 'win32';
    }
    else {
        return 'linux';
    }
***REMOVED***