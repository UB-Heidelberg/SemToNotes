var Person = Klass.extend(
***REMOVED*** @lends Person.prototype***REMOVED***
{
   ***REMOVED*****REMOVED*** @constructs Person***REMOVED***
    initialize: function(name) {
        this.name = name;
    },

   ***REMOVED*****REMOVED***
    ***REMOVED*** Callback for `say`.
    ***REMOVED***
    ***REMOVED*** @callback Person~sayCallback
    ***REMOVED*** @param {?string} err - Information about the error, if any.
    ***REMOVED*** @param {?string} message - The message.
   ***REMOVED*****REMOVED***
   ***REMOVED*****REMOVED***
    ***REMOVED*** Speak a message asynchronously.
    ***REMOVED***
    ***REMOVED*** @param {Person~sayCallback} cb
   ***REMOVED*****REMOVED***
    say: function(message, cb) {
        if (!message) {
            cb('You forgot the message!');
        }

        cb(null, this.name + ' says: ' + message);
    }
});
