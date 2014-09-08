***REMOVED***
***REMOVED***
***REMOVED***
function Foo() {
   ***REMOVED*****REMOVED*** First property***REMOVED***
    this.prop1 = true;
}

***REMOVED***
***REMOVED*** Second property
***REMOVED*** @type {String}
***REMOVED***
Foo.prototype.prop2 = "parent prop2";

***REMOVED***
***REMOVED*** First parent method.
***REMOVED***
Foo.prototype.method1 = function() {***REMOVED***

***REMOVED***
***REMOVED*** Second parent method.
***REMOVED***
Foo.prototype.method2 = function() {***REMOVED***

***REMOVED***
***REMOVED***
***REMOVED*** @extends Foo
***REMOVED***
function Bar() {
   ***REMOVED*****REMOVED*** Third prop***REMOVED****/
    this.prop3 = true;
}

***REMOVED***
***REMOVED*** Second child method.
***REMOVED***
Bar.prototype.method2 = function() {***REMOVED***

***REMOVED***
***REMOVED***
***REMOVED*** @extends {Bar}
***REMOVED***
function Baz() {
   ***REMOVED*****REMOVED*** Override prop1***REMOVED***
    this.prop1 = "new";
}

***REMOVED***
***REMOVED*** Third grandchild method.
***REMOVED***
Baz.prototype.method3 = function() {***REMOVED***
