***REMOVED*** @class***REMOVED***
var Person = makeClass(
   ***REMOVED*****REMOVED*** @lends Person#***REMOVED***
    {
       ***REMOVED*****REMOVED*** Set up initial values.***REMOVED***
        initialize: function(name) {
        },

       ***REMOVED*****REMOVED*** Speak a message.***REMOVED***
        say: function(message) {
            return this.name + " says: " + message;
        },

       ***REMOVED*****REMOVED***
        ***REMOVED*** The name of the person.
        ***REMOVED*** @type {string}
       ***REMOVED*****REMOVED***
        get name() {
            return this._name;
        },

       ***REMOVED*****REMOVED***
        ***REMOVED*** @type {string}
        ***REMOVED*** @param val
       ***REMOVED*****REMOVED***
        set name(val) {
            this._name = name;
        },

       ***REMOVED*****REMOVED***
        ***REMOVED*** @type {number}
       ***REMOVED*****REMOVED***
        get age() {
            return 25;
        }
    }
);