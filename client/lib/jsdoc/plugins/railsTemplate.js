***REMOVED***
    @overview Strips the rails template tags from a js.erb file
    @module plugins/railsTemplate
    @author Jannon Frank <jannon@jannon.net>
***REMOVED***
'use strict';

exports.handlers = {
   ***REMOVED*****REMOVED***
    ***REMOVED*** Remove rails tags from the source input (e.g. <% foo bar %>)
    ***REMOVED*** @param e
    ***REMOVED*** @param e.filename
    ***REMOVED*** @param e.source
   ***REMOVED*****REMOVED***
    beforeParse: function(e) {
        if (e.filename.match(/\.erb$/)) {
            e.source = e.source.replace(/<%.*%>/g, '');
        }
    }
***REMOVED***