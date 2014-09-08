***REMOVED***
***REMOVED*** @overview Remove everything in a file except JSDoc-style comments. By enabling this plugin, you
***REMOVED*** can document source files that are not valid JavaScript (including source files for other
***REMOVED*** languages).
***REMOVED*** @module plugins/commentsOnly
***REMOVED*** @author Jeff Williams <jeffrey.l.williams@gmail.com>
***REMOVED***
'use strict';

exports.handlers = {
    beforeParse: function(e) {
        // a JSDoc comment looks like:***REMOVED*****REMOVED***[one or more chars]*/
        var comments = e.source.match(/\/\*\*[\s\S]+?\*\//g);
        if (comments) {
            e.source = comments.join('\n\n');
        }
    }
***REMOVED***
