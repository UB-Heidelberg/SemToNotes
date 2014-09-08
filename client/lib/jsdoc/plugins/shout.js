***REMOVED***
    @overview This is just an example.
    @module plugins/shout
    @author Michael Mathews <micmath@gmail.com>
***REMOVED***
'use strict';

exports.handlers = {
   ***REMOVED*****REMOVED***
        Make your descriptions more shoutier.
   ***REMOVED*****REMOVED***
    newDoclet: function(e) {
        if (typeof e.doclet.description === 'string') {
            e.doclet.description = e.doclet.description.toUpperCase();
        }
    }
***REMOVED***