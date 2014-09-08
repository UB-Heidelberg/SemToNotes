// Copyright 2008 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

***REMOVED***
***REMOVED*** @fileoverview Editor plugin to handle tab keys in lists to indent and
***REMOVED*** outdent.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @author ajp@google.com (Andy Perelson)
***REMOVED***

goog.provide('goog.editor.plugins.ListTabHandler');

goog.require('goog.dom.TagName');
goog.require('goog.editor.Command');
goog.require('goog.editor.plugins.AbstractTabHandler');



***REMOVED***
***REMOVED*** Plugin to handle tab keys in lists to indent and outdent.
***REMOVED***
***REMOVED*** @extends {goog.editor.plugins.AbstractTabHandler}
***REMOVED*** @final
***REMOVED***
goog.editor.plugins.ListTabHandler = function() {
  goog.editor.plugins.AbstractTabHandler.call(this);
***REMOVED***
goog.inherits(goog.editor.plugins.ListTabHandler,
    goog.editor.plugins.AbstractTabHandler);


***REMOVED*** @override***REMOVED***
goog.editor.plugins.ListTabHandler.prototype.getTrogClassId = function() {
  return 'ListTabHandler';
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.ListTabHandler.prototype.handleTabKey = function(e) {
  var range = this.getFieldObject().getRange();
  if (goog.dom.getAncestorByTagNameAndClass(range.getContainerElement(),
                                            goog.dom.TagName.LI) ||
      goog.iter.some(range, function(node) {
        return node.tagName == goog.dom.TagName.LI;
      })) {
    this.getFieldObject().execCommand(e.shiftKey ?
        goog.editor.Command.OUTDENT :
        goog.editor.Command.INDENT);
    e.preventDefault();
    return true;
  }

  return false;
***REMOVED***

