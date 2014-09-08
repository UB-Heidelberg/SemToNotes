
***REMOVED*** @constructor
*/
function Data() {

   ***REMOVED*****REMOVED***
        The current position.
        @type {object}
        @property {boolean} needsRevalidate Does this point need to be revalidated?
   ***REMOVED*****REMOVED***
    this.point = {
       ***REMOVED*****REMOVED***
            The x coordinate of the point.
            @type {number}
            @name point.x
            @memberof! Data#
       ***REMOVED*****REMOVED***
        x: 0,

       ***REMOVED*****REMOVED***
            The y coordinate of the point.
            @type {number}
            @name point.y
            @memberof! Data#
            @see {@link Data#point.x}
       ***REMOVED*****REMOVED***
        y: 0,

        needsRevalidate: false
   ***REMOVED*****REMOVED***
}

var map = {
   ***REMOVED*****REMOVED***
        @type {Array}
        @name map.routes
        @memberof! <global>
        @property {Data#point} point
   ***REMOVED*****REMOVED***
    routes: []
}

***REMOVED*** The current cursor.***REMOVED***
var cursor = {***REMOVED***
