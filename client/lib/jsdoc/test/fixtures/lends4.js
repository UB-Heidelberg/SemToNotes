define([], function () {
    var Person = makeClass(
       ***REMOVED*****REMOVED*** @lends Person.prototype***REMOVED***
        {
           ***REMOVED*****REMOVED*** @constructs***REMOVED***
            initialize: function(name) {
                this.name = name;
            },
           ***REMOVED*****REMOVED*** Speak a message.***REMOVED***
            say: function(message) {
                return this.name + " says: " + message;
            }
        }
  ***REMOVED***
    return Person;
});
