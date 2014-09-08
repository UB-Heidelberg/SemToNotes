***REMOVED*** @module myModule***REMOVED***

***REMOVED*** An event (has listeners).
***REMOVED*** @event MyEvent
***REMOVED*** @memberof module:myModule
***REMOVED*** @param {number} foo - asdf.***REMOVED***

***REMOVED*** A handler.
***REMOVED*** @listens module:myModule.MyEvent
***REMOVED*** @listens module:myModule~Events.event:Event2
***REMOVED*** @listens fakeEvent
***REMOVED***
function MyHandler() {
}

***REMOVED*** Another handler.
***REMOVED*** @listens module:myModule.MyEvent
***REMOVED***
function AnotherHandler() {
}

***REMOVED*** a namespace.
***REMOVED*** @namespace***REMOVED***
var Events = {
***REMOVED***

***REMOVED*** Another event (has listeners).
***REMOVED*** @event Event2
***REMOVED*** @memberof module:myModule~Events
***REMOVED***

***REMOVED*** An event with no listeners.
***REMOVED*** @event module:myModule#Event3***REMOVED***
