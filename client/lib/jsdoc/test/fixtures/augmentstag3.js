// test to see that we can @augment multiple things (code allows for it)
***REMOVED*** @class***REMOVED***
function Foo() {
}
***REMOVED*** A method.***REMOVED***
Foo.prototype.method1 = function () {***REMOVED***

***REMOVED*** @class***REMOVED***
function Bar() {
}
***REMOVED*** Another method.***REMOVED***
Bar.prototype.method2 = function () {}

***REMOVED*** @class
***REMOVED*** @augments Foo
***REMOVED*** @augments Bar***REMOVED***
function FooBar() {
}
