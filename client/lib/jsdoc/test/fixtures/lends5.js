(function() {
   ***REMOVED*****REMOVED***
    ***REMOVED*** @class Person
   ***REMOVED*****REMOVED***
    function Person(name) {}

    Person.prototype = Object.create(null,***REMOVED*****REMOVED*** @lends Person.prototype***REMOVED*** {
       ***REMOVED*****REMOVED*** Speak a message.***REMOVED***
        say: function(message) {
            return this.name + " says: " + message;
        }
    });

    this.Person = Person;
}).call(this);
