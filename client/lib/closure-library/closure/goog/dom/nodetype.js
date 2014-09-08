// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Definition of goog.dom.NodeType.
***REMOVED***

goog.provide('goog.dom.NodeType');


***REMOVED***
***REMOVED*** Constants for the nodeType attribute in the Node interface.
***REMOVED***
***REMOVED*** These constants match those specified in the Node interface. These are
***REMOVED*** usually present on the Node object in recent browsers, but not in older
***REMOVED*** browsers (specifically, early IEs) and thus are given here.
***REMOVED***
***REMOVED*** In some browsers (early IEs), these are not defined on the Node object,
***REMOVED*** so they are provided here.
***REMOVED***
***REMOVED*** See http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-1950641247
***REMOVED*** @enum {number}
***REMOVED***
goog.dom.NodeType = {
  ELEMENT: 1,
  ATTRIBUTE: 2,
  TEXT: 3,
  CDATA_SECTION: 4,
  ENTITY_REFERENCE: 5,
  ENTITY: 6,
  PROCESSING_INSTRUCTION: 7,
  COMMENT: 8,
  DOCUMENT: 9,
  DOCUMENT_TYPE: 10,
  DOCUMENT_FRAGMENT: 11,
  NOTATION: 12
***REMOVED***
