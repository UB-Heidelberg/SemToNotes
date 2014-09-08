***REMOVED***
***REMOVED*** @class
***REMOVED***
var Hurl = function () {
***REMOVED***

***REMOVED***
***REMOVED*** Throw a snowball.
***REMOVED***
***REMOVED*** @fires Hurl#snowball
***REMOVED*** @fires Hurl#event:brick
***REMOVED***
Hurl.prototype.snowball = function () {
   ***REMOVED*****REMOVED***
    ***REMOVED*** @event Hurl#snowball
   ***REMOVED*****REMOVED***
    this.emit('snowball', {});
***REMOVED***

***REMOVED***
***REMOVED*** Throw a football match.
***REMOVED***
***REMOVED*** @emits Hurl#footballMatch
***REMOVED***
Hurl.prototype.footballMatch = function () {
   ***REMOVED*****REMOVED***
    ***REMOVED*** @event Hurl#footballMatch
   ***REMOVED*****REMOVED***
    this.emit('footballMatch', {});
***REMOVED***
