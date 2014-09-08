***REMOVED***
    @overview Escape HTML tags in descriptions.
    @module plugins/escapeHtml
    @author Michael Mathews <micmath@gmail.com>
***REMOVED***
'use strict';

exports.handlers = {
   ***REMOVED*****REMOVED***
        Translate HTML tags in descriptions into safe entities.
        Replaces <, & and newlines
   ***REMOVED*****REMOVED***
    newDoclet: function(e) {
        if (e.doclet.description) {
            e.doclet.description = e.doclet.description
                                   .replace(/&/g,'&amp;')
                                   .replace(/</g,'&lt;')
                                   .replace(/\r\n|\n|\r/g, '<br>');
        }
    }
***REMOVED***
