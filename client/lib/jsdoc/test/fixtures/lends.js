***REMOVED*** @class***REMOVED***
var Person = makeClass(
   ***REMOVED*****REMOVED*** @lends Person#***REMOVED***
    {
       ***REMOVED*****REMOVED*** Set up initial values.***REMOVED***
        initialize: function(name) {
           ***REMOVED*****REMOVED*** The name of the person.***REMOVED***
            this.name = name;
        },

       ***REMOVED*****REMOVED*** Speak a message.***REMOVED***
        say: function(message) {
            return this.name + " says: " + message;
        }
    }
);