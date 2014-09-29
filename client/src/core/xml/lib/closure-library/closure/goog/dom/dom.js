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
***REMOVED*** @fileoverview Utilities for manipulating the browser's Document Object Model
***REMOVED*** Inspiration taken***REMOVED***heavily* from mochikit (http://mochikit.com/).
***REMOVED***
***REMOVED*** You can use {@link goog.dom.DomHelper} to create new dom helpers that refer
***REMOVED*** to a different document object.  This is useful if you are working with
***REMOVED*** frames or multiple windows.
***REMOVED***
***REMOVED***


// TODO(arv): Rename/refactor getTextContent and getRawTextContent. The problem
// is that getTextContent should mimic the DOM3 textContent. We should add a
// getInnerText (or getText) which tries to return the visible text, innerText.


goog.provide('goog.dom');
goog.provide('goog.dom.DomHelper');
goog.provide('goog.dom.NodeType');

goog.require('goog.array');
goog.require('goog.dom.BrowserFeature');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** @define {boolean} Whether we know at compile time that the browser is in
***REMOVED*** quirks mode.
***REMOVED***
goog.dom.ASSUME_QUIRKS_MODE = false;


***REMOVED***
***REMOVED*** @define {boolean} Whether we know at compile time that the browser is in
***REMOVED*** standards compliance mode.
***REMOVED***
goog.dom.ASSUME_STANDARDS_MODE = false;


***REMOVED***
***REMOVED*** Whether we know the compatibility mode at compile time.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.dom.COMPAT_MODE_KNOWN_ =
    goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;


***REMOVED***
***REMOVED*** Enumeration for DOM node types (for reference)
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


***REMOVED***
***REMOVED*** Gets the DomHelper object for the document where the element resides.
***REMOVED*** @param {(Node|Window)=} opt_element If present, gets the DomHelper for this
***REMOVED***     element.
***REMOVED*** @return {!goog.dom.DomHelper} The DomHelper.
***REMOVED***
goog.dom.getDomHelper = function(opt_element) {
  return opt_element ?
      new goog.dom.DomHelper(goog.dom.getOwnerDocument(opt_element)) :
      (goog.dom.defaultDomHelper_ ||
          (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper()));
***REMOVED***


***REMOVED***
***REMOVED*** Cached default DOM helper.
***REMOVED*** @type {goog.dom.DomHelper}
***REMOVED*** @private
***REMOVED***
goog.dom.defaultDomHelper_;


***REMOVED***
***REMOVED*** Gets the document object being used by the dom library.
***REMOVED*** @return {!Document} Document object.
***REMOVED***
goog.dom.getDocument = function() {
  return document;
***REMOVED***


***REMOVED***
***REMOVED*** Alias for getElementById. If a DOM node is passed in then we just return
***REMOVED*** that.
***REMOVED*** @param {string|Element} element Element ID or a DOM node.
***REMOVED*** @return {Element} The element with the given ID, or the node passed in.
***REMOVED***
goog.dom.getElement = function(element) {
  return goog.isString(element) ?
      document.getElementById(element) : element;
***REMOVED***


***REMOVED***
***REMOVED*** Alias for getElement.
***REMOVED*** @param {string|Element} element Element ID or a DOM node.
***REMOVED*** @return {Element} The element with the given ID, or the node passed in.
***REMOVED*** @deprecated Use {@link goog.dom.getElement} instead.
***REMOVED***
goog.dom.$ = goog.dom.getElement;


***REMOVED***
***REMOVED*** Looks up elements by both tag and class name, using browser native functions
***REMOVED*** ({@code querySelectorAll}, {@code getElementsByTagName} or
***REMOVED*** {@code getElementsByClassName}) where possible. This function
***REMOVED*** is a useful, if limited, way of collecting a list of DOM elements
***REMOVED*** with certain characteristics.  {@code goog.dom.query} offers a
***REMOVED*** more powerful and general solution which allows matching on CSS3
***REMOVED*** selector expressions, but at increased cost in code size. If all you
***REMOVED*** need is particular tags belonging to a single class, this function
***REMOVED*** is fast and sleek.
***REMOVED***
***REMOVED*** @see {goog.dom.query}
***REMOVED***
***REMOVED*** @param {?string=} opt_tag Element tag name.
***REMOVED*** @param {?string=} opt_class Optional class name.
***REMOVED*** @param {(Document|Element)=} opt_el Optional element to look in.
***REMOVED*** @return { {length: number} } Array-like list of elements (only a length
***REMOVED***     property and numerical indices are guaranteed to exist).
***REMOVED***
goog.dom.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(document, opt_tag, opt_class,
                                                opt_el);
***REMOVED***


***REMOVED***
***REMOVED*** Returns an array of all the elements with the provided className.
***REMOVED*** @see {goog.dom.query}
***REMOVED*** @param {string} className the name of the class to look for.
***REMOVED*** @param {(Document|Element)=} opt_el Optional element to look in.
***REMOVED*** @return { {length: number} } The items found with the class name provided.
***REMOVED***
goog.dom.getElementsByClass = function(className, opt_el) {
  var parent = opt_el || document;
  if (goog.dom.canUseQuerySelector_(parent)) {
    return parent.querySelectorAll('.' + className);
  } else if (parent.getElementsByClassName) {
    return parent.getElementsByClassName(className);
  }
  return goog.dom.getElementsByTagNameAndClass_(
      document, '*', className, opt_el);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the first element with the provided className.
***REMOVED*** @see {goog.dom.query}
***REMOVED*** @param {string} className the name of the class to look for.
***REMOVED*** @param {Element|Document=} opt_el Optional element to look in.
***REMOVED*** @return {Element} The first item with the class name provided.
***REMOVED***
goog.dom.getElementByClass = function(className, opt_el) {
  var parent = opt_el || document;
  var retVal = null;
  if (goog.dom.canUseQuerySelector_(parent)) {
    retVal = parent.querySelector('.' + className);
  } else {
    retVal = goog.dom.getElementsByClass(className, opt_el)[0];
  }
  return retVal || null;
***REMOVED***


***REMOVED***
***REMOVED*** Prefer the standardized (http://www.w3.org/TR/selectors-api/), native and
***REMOVED*** fast W3C Selectors API.
***REMOVED*** @param {!(Element|Document)} parent The parent document object.
***REMOVED*** @return {boolean} whether or not we can use parent.querySelector* APIs.
***REMOVED*** @private
***REMOVED***
goog.dom.canUseQuerySelector_ = function(parent) {
  return !!(parent.querySelectorAll && parent.querySelector);
***REMOVED***


***REMOVED***
***REMOVED*** Helper for {@code getElementsByTagNameAndClass}.
***REMOVED*** @param {!Document} doc The document to get the elements in.
***REMOVED*** @param {?string=} opt_tag Element tag name.
***REMOVED*** @param {?string=} opt_class Optional class name.
***REMOVED*** @param {(Document|Element)=} opt_el Optional element to look in.
***REMOVED*** @return { {length: number} } Array-like list of elements (only a length
***REMOVED***     property and numerical indices are guaranteed to exist).
***REMOVED*** @private
***REMOVED***
goog.dom.getElementsByTagNameAndClass_ = function(doc, opt_tag, opt_class,
                                                  opt_el) {
  var parent = opt_el || doc;
  var tagName = (opt_tag && opt_tag != '*') ? opt_tag.toUpperCase() : '';

  if (goog.dom.canUseQuerySelector_(parent) &&
      (tagName || opt_class)) {
    var query = tagName + (opt_class ? '.' + opt_class : '');
    return parent.querySelectorAll(query);
  }

  // Use the native getElementsByClassName if available, under the assumption
  // that even when the tag name is specified, there will be fewer elements to
  // filter through when going by class than by tag name
  if (opt_class && parent.getElementsByClassName) {
    var els = parent.getElementsByClassName(opt_class);

    if (tagName) {
      var arrayLike = {***REMOVED***
      var len = 0;

      // Filter for specific tags if requested.
      for (var i = 0, el; el = els[i]; i++) {
        if (tagName == el.nodeName) {
          arrayLike[len++] = el;
        }
      }
      arrayLike.length = len;

      return arrayLike;
    } else {
      return els;
    }
  }

  var els = parent.getElementsByTagName(tagName || '*');

  if (opt_class) {
    var arrayLike = {***REMOVED***
    var len = 0;
    for (var i = 0, el; el = els[i]; i++) {
      var className = el.className;
      // Check if className has a split function since SVG className does not.
      if (typeof className.split == 'function' &&
          goog.array.contains(className.split(/\s+/), opt_class)) {
        arrayLike[len++] = el;
      }
    }
    arrayLike.length = len;
    return arrayLike;
  } else {
    return els;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Alias for {@code getElementsByTagNameAndClass}.
***REMOVED*** @param {?string=} opt_tag Element tag name.
***REMOVED*** @param {?string=} opt_class Optional class name.
***REMOVED*** @param {Element=} opt_el Optional element to look in.
***REMOVED*** @return { {length: number} } Array-like list of elements (only a length
***REMOVED***     property and numerical indices are guaranteed to exist).
***REMOVED*** @deprecated Use {@link goog.dom.getElementsByTagNameAndClass} instead.
***REMOVED***
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;


***REMOVED***
***REMOVED*** Sets multiple properties on a node.
***REMOVED*** @param {Element} element DOM node to set properties on.
***REMOVED*** @param {Object} properties Hash of property:value pairs.
***REMOVED***
goog.dom.setProperties = function(element, properties) {
  goog.object.forEach(properties, function(val, key) {
    if (key == 'style') {
      element.style.cssText = val;
    } else if (key == 'class') {
      element.className = val;
    } else if (key == 'for') {
      element.htmlFor = val;
    } else if (key in goog.dom.DIRECT_ATTRIBUTE_MAP_) {
      element.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[key], val);
    } else if (goog.string.startsWith(key, 'aria-') ||
        goog.string.startsWith(key, 'data-')) {
      element.setAttribute(key, val);
    } else {
      element[key] = val;
    }
  });
***REMOVED***


***REMOVED***
***REMOVED*** Map of attributes that should be set using
***REMOVED*** element.setAttribute(key, val) instead of element[key] = val.  Used
***REMOVED*** by goog.dom.setProperties.
***REMOVED***
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {
  'cellpadding': 'cellPadding',
  'cellspacing': 'cellSpacing',
  'colspan': 'colSpan',
  'frameborder': 'frameBorder',
  'height': 'height',
  'maxlength': 'maxLength',
  'role': 'role',
  'rowspan': 'rowSpan',
  'type': 'type',
  'usemap': 'useMap',
  'valign': 'vAlign',
  'width': 'width'
***REMOVED***


***REMOVED***
***REMOVED*** Gets the dimensions of the viewport.
***REMOVED***
***REMOVED*** Gecko Standards mode:
***REMOVED*** docEl.clientWidth  Width of viewport excluding scrollbar.
***REMOVED*** win.innerWidth     Width of viewport including scrollbar.
***REMOVED*** body.clientWidth   Width of body element.
***REMOVED***
***REMOVED*** docEl.clientHeight Height of viewport excluding scrollbar.
***REMOVED*** win.innerHeight    Height of viewport including scrollbar.
***REMOVED*** body.clientHeight  Height of document.
***REMOVED***
***REMOVED*** Gecko Backwards compatible mode:
***REMOVED*** docEl.clientWidth  Width of viewport excluding scrollbar.
***REMOVED*** win.innerWidth     Width of viewport including scrollbar.
***REMOVED*** body.clientWidth   Width of viewport excluding scrollbar.
***REMOVED***
***REMOVED*** docEl.clientHeight Height of document.
***REMOVED*** win.innerHeight    Height of viewport including scrollbar.
***REMOVED*** body.clientHeight  Height of viewport excluding scrollbar.
***REMOVED***
***REMOVED*** IE6/7 Standards mode:
***REMOVED*** docEl.clientWidth  Width of viewport excluding scrollbar.
***REMOVED*** win.innerWidth     Undefined.
***REMOVED*** body.clientWidth   Width of body element.
***REMOVED***
***REMOVED*** docEl.clientHeight Height of viewport excluding scrollbar.
***REMOVED*** win.innerHeight    Undefined.
***REMOVED*** body.clientHeight  Height of document element.
***REMOVED***
***REMOVED*** IE5 + IE6/7 Backwards compatible mode:
***REMOVED*** docEl.clientWidth  0.
***REMOVED*** win.innerWidth     Undefined.
***REMOVED*** body.clientWidth   Width of viewport excluding scrollbar.
***REMOVED***
***REMOVED*** docEl.clientHeight 0.
***REMOVED*** win.innerHeight    Undefined.
***REMOVED*** body.clientHeight  Height of viewport excluding scrollbar.
***REMOVED***
***REMOVED*** Opera 9 Standards and backwards compatible mode:
***REMOVED*** docEl.clientWidth  Width of viewport excluding scrollbar.
***REMOVED*** win.innerWidth     Width of viewport including scrollbar.
***REMOVED*** body.clientWidth   Width of viewport excluding scrollbar.
***REMOVED***
***REMOVED*** docEl.clientHeight Height of document.
***REMOVED*** win.innerHeight    Height of viewport including scrollbar.
***REMOVED*** body.clientHeight  Height of viewport excluding scrollbar.
***REMOVED***
***REMOVED*** WebKit:
***REMOVED*** Safari 2
***REMOVED*** docEl.clientHeight Same as scrollHeight.
***REMOVED*** docEl.clientWidth  Same as innerWidth.
***REMOVED*** win.innerWidth     Width of viewport excluding scrollbar.
***REMOVED*** win.innerHeight    Height of the viewport including scrollbar.
***REMOVED*** frame.innerHeight  Height of the viewport exluding scrollbar.
***REMOVED***
***REMOVED*** Safari 3 (tested in 522)
***REMOVED***
***REMOVED*** docEl.clientWidth  Width of viewport excluding scrollbar.
***REMOVED*** docEl.clientHeight Height of viewport excluding scrollbar in strict mode.
***REMOVED*** body.clientHeight  Height of viewport excluding scrollbar in quirks mode.
***REMOVED***
***REMOVED*** @param {Window=} opt_window Optional window element to test.
***REMOVED*** @return {!goog.math.Size} Object with values 'width' and 'height'.
***REMOVED***
goog.dom.getViewportSize = function(opt_window) {
  // TODO(arv): This should not take an argument
  return goog.dom.getViewportSize_(opt_window || window);
***REMOVED***


***REMOVED***
***REMOVED*** Helper for {@code getViewportSize}.
***REMOVED*** @param {Window} win The window to get the view port size for.
***REMOVED*** @return {!goog.math.Size} Object with values 'width' and 'height'.
***REMOVED*** @private
***REMOVED***
goog.dom.getViewportSize_ = function(win) {
  var doc = win.document;
  var el = goog.dom.isCss1CompatMode_(doc) ? doc.documentElement : doc.body;
  return new goog.math.Size(el.clientWidth, el.clientHeight);
***REMOVED***


***REMOVED***
***REMOVED*** Calculates the height of the document.
***REMOVED***
***REMOVED*** @return {number} The height of the current document.
***REMOVED***
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window);
***REMOVED***


***REMOVED***
***REMOVED*** Calculates the height of the document of the given window.
***REMOVED***
***REMOVED*** Function code copied from the opensocial gadget api:
***REMOVED***   gadgets.window.adjustHeight(opt_height)
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {Window} win The window whose document height to retrieve.
***REMOVED*** @return {number} The height of the document of the given window.
***REMOVED***
goog.dom.getDocumentHeight_ = function(win) {
  // NOTE(eae): This method will return the window size rather than the document
  // size in webkit quirks mode.
  var doc = win.document;
  var height = 0;

  if (doc) {
    // Calculating inner content height is hard and different between
    // browsers rendering in Strict vs. Quirks mode.  We use a combination of
    // three properties within document.body and document.documentElement:
    // - scrollHeight
    // - offsetHeight
    // - clientHeight
    // These values differ significantly between browsers and rendering modes.
    // But there are patterns.  It just takes a lot of time and persistence
    // to figure out.

    // Get the height of the viewport
    var vh = goog.dom.getViewportSize_(win).height;
    var body = doc.body;
    var docEl = doc.documentElement;
    if (goog.dom.isCss1CompatMode_(doc) && docEl.scrollHeight) {
      // In Strict mode:
      // The inner content height is contained in either:
      //    document.documentElement.scrollHeight
      //    document.documentElement.offsetHeight
      // Based on studying the values output by different browsers,
      // use the value that's NOT equal to the viewport height found above.
      height = docEl.scrollHeight != vh ?
          docEl.scrollHeight : docEl.offsetHeight;
    } else {
      // In Quirks mode:
      // documentElement.clientHeight is equal to documentElement.offsetHeight
      // except in IE.  In most browsers, document.documentElement can be used
      // to calculate the inner content height.
      // However, in other browsers (e.g. IE), document.body must be used
      // instead.  How do we know which one to use?
      // If document.documentElement.clientHeight does NOT equal
      // document.documentElement.offsetHeight, then use document.body.
      var sh = docEl.scrollHeight;
      var oh = docEl.offsetHeight;
      if (docEl.clientHeight != oh) {
        sh = body.scrollHeight;
        oh = body.offsetHeight;
      }

      // Detect whether the inner content height is bigger or smaller
      // than the bounding box (viewport).  If bigger, take the larger
      // value.  If smaller, take the smaller value.
      if (sh > vh) {
        // Content is larger
        height = sh > oh ? sh : oh;
      } else {
        // Content is smaller
        height = sh < oh ? sh : oh;
      }
    }
  }

  return height;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the page scroll distance as a coordinate object.
***REMOVED***
***REMOVED*** @param {Window=} opt_window Optional window element to test.
***REMOVED*** @return {!goog.math.Coordinate} Object with values 'x' and 'y'.
***REMOVED*** @deprecated Use {@link goog.dom.getDocumentScroll} instead.
***REMOVED***
goog.dom.getPageScroll = function(opt_window) {
  var win = opt_window || goog.global || window;
  return goog.dom.getDomHelper(win.document).getDocumentScroll();
***REMOVED***


***REMOVED***
***REMOVED*** Gets the document scroll distance as a coordinate object.
***REMOVED***
***REMOVED*** @return {!goog.math.Coordinate} Object with values 'x' and 'y'.
***REMOVED***
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document);
***REMOVED***


***REMOVED***
***REMOVED*** Helper for {@code getDocumentScroll}.
***REMOVED***
***REMOVED*** @param {!Document} doc The document to get the scroll for.
***REMOVED*** @return {!goog.math.Coordinate} Object with values 'x' and 'y'.
***REMOVED*** @private
***REMOVED***
goog.dom.getDocumentScroll_ = function(doc) {
  var el = goog.dom.getDocumentScrollElement_(doc);
  var win = goog.dom.getWindow_(doc);
  return new goog.math.Coordinate(win.pageXOffset || el.scrollLeft,
      win.pageYOffset || el.scrollTop);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the document scroll element.
***REMOVED*** @return {Element} Scrolling element.
***REMOVED***
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document);
***REMOVED***


***REMOVED***
***REMOVED*** Helper for {@code getDocumentScrollElement}.
***REMOVED*** @param {!Document} doc The document to get the scroll element for.
***REMOVED*** @return {Element} Scrolling element.
***REMOVED*** @private
***REMOVED***
goog.dom.getDocumentScrollElement_ = function(doc) {
  // Safari (2 and 3) needs body.scrollLeft in both quirks mode and strict mode.
  return !goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(doc) ?
      doc.documentElement : doc.body;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the window object associated with the given document.
***REMOVED***
***REMOVED*** @param {Document=} opt_doc  Document object to get window for.
***REMOVED*** @return {!Window} The window associated with the given document.
***REMOVED***
goog.dom.getWindow = function(opt_doc) {
  // TODO(arv): This should not take an argument.
  return opt_doc ? goog.dom.getWindow_(opt_doc) : window;
***REMOVED***


***REMOVED***
***REMOVED*** Helper for {@code getWindow}.
***REMOVED***
***REMOVED*** @param {!Document} doc  Document object to get window for.
***REMOVED*** @return {!Window} The window associated with the given document.
***REMOVED*** @private
***REMOVED***
goog.dom.getWindow_ = function(doc) {
  return doc.parentWindow || doc.defaultView;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a dom node with a set of attributes.  This function accepts varargs
***REMOVED*** for subsequent nodes to be added.  Subsequent nodes will be added to the
***REMOVED*** first node as childNodes.
***REMOVED***
***REMOVED*** So:
***REMOVED*** <code>createDom('div', null, createDom('p'), createDom('p'));</code>
***REMOVED*** would return a div with two child paragraphs
***REMOVED***
***REMOVED*** @param {string} tagName Tag to create.
***REMOVED*** @param {(Object|Array.<string>|string)=} opt_attributes If object, then a map
***REMOVED***     of name-value pairs for attributes. If a string, then this is the
***REMOVED***     className of the new element. If an array, the elements will be joined
***REMOVED***     together as the className of the new element.
***REMOVED*** @param {...(Object|string|Array|NodeList)} var_args Further DOM nodes or
***REMOVED***     strings for text nodes. If one of the var_args is an array or NodeList,i
***REMOVED***     its elements will be added as childNodes instead.
***REMOVED*** @return {!Element} Reference to a DOM node.
***REMOVED***
goog.dom.createDom = function(tagName, opt_attributes, var_args) {
  return goog.dom.createDom_(document, arguments);
***REMOVED***


***REMOVED***
***REMOVED*** Helper for {@code createDom}.
***REMOVED*** @param {!Document} doc The document to create the DOM in.
***REMOVED*** @param {!Arguments} args Argument object passed from the callers. See
***REMOVED***     {@code goog.dom.createDom} for details.
***REMOVED*** @return {!Element} Reference to a DOM node.
***REMOVED*** @private
***REMOVED***
goog.dom.createDom_ = function(doc, args) {
  var tagName = args[0];
  var attributes = args[1];

  // Internet Explorer is dumb: http://msdn.microsoft.com/workshop/author/
  //                            dhtml/reference/properties/name_2.asp
  // Also does not allow setting of 'type' attribute on 'input' or 'button'.
  if (!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && attributes &&
      (attributes.name || attributes.type)) {
    var tagNameArr = ['<', tagName];
    if (attributes.name) {
      tagNameArr.push(' name="', goog.string.htmlEscape(attributes.name),
                      '"');
    }
    if (attributes.type) {
      tagNameArr.push(' type="', goog.string.htmlEscape(attributes.type),
                      '"');

      // Clone attributes map to remove 'type' without mutating the input.
      var clone = {***REMOVED***
      goog.object.extend(clone, attributes);

      // JSCompiler can't see how goog.object.extend added this property,
      // because it was essentially added by reflection.
      // So it needs to be quoted.
      delete clone['type'];

      attributes = clone;
    }
    tagNameArr.push('>');
    tagName = tagNameArr.join('');
  }

  var element = doc.createElement(tagName);

  if (attributes) {
    if (goog.isString(attributes)) {
      element.className = attributes;
    } else if (goog.isArray(attributes)) {
      goog.dom.classes.add.apply(null, [element].concat(attributes));
    } else {
      goog.dom.setProperties(element, attributes);
    }
  }

  if (args.length > 2) {
    goog.dom.append_(doc, element, args, 2);
  }

  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Appends a node with text or other nodes.
***REMOVED*** @param {!Document} doc The document to create new nodes in.
***REMOVED*** @param {!Node} parent The node to append nodes to.
***REMOVED*** @param {!Arguments} args The values to add. See {@code goog.dom.append}.
***REMOVED*** @param {number} startIndex The index of the array to start from.
***REMOVED*** @private
***REMOVED***
goog.dom.append_ = function(doc, parent, args, startIndex) {
  function childHandler(child) {
    // TODO(user): More coercion, ala MochiKit?
    if (child) {
      parent.appendChild(goog.isString(child) ?
          doc.createTextNode(child) : child);
    }
  }

  for (var i = startIndex; i < args.length; i++) {
    var arg = args[i];
    // TODO(attila): Fix isArrayLike to return false for a text node.
    if (goog.isArrayLike(arg) && !goog.dom.isNodeLike(arg)) {
      // If the argument is a node list, not a real array, use a clone,
      // because forEach can't be used to mutate a NodeList.
      goog.array.forEach(goog.dom.isNodeList(arg) ?
          goog.array.toArray(arg) : arg,
          childHandler);
    } else {
      childHandler(arg);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Alias for {@code createDom}.
***REMOVED*** @param {string} tagName Tag to create.
***REMOVED*** @param {(string|Object)=} opt_attributes If object, then a map of name-value
***REMOVED***     pairs for attributes. If a string, then this is the className of the new
***REMOVED***     element.
***REMOVED*** @param {...(Object|string|Array|NodeList)} var_args Further DOM nodes or
***REMOVED***     strings for text nodes. If one of the var_args is an array, its
***REMOVED***     children will be added as childNodes instead.
***REMOVED*** @return {!Element} Reference to a DOM node.
***REMOVED*** @deprecated Use {@link goog.dom.createDom} instead.
***REMOVED***
goog.dom.$dom = goog.dom.createDom;


***REMOVED***
***REMOVED*** Creates a new element.
***REMOVED*** @param {string} name Tag name.
***REMOVED*** @return {!Element} The new element.
***REMOVED***
goog.dom.createElement = function(name) {
  return document.createElement(name);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new text node.
***REMOVED*** @param {number|string} content Content.
***REMOVED*** @return {!Text} The new text node.
***REMOVED***
goog.dom.createTextNode = function(content) {
  return document.createTextNode(String(content));
***REMOVED***


***REMOVED***
***REMOVED*** Create a table.
***REMOVED*** @param {number} rows The number of rows in the table.  Must be >= 1.
***REMOVED*** @param {number} columns The number of columns in the table.  Must be >= 1.
***REMOVED*** @param {boolean=} opt_fillWithNbsp If true, fills table entries with nsbps.
***REMOVED*** @return {!Element} The created table.
***REMOVED***
goog.dom.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(document, rows, columns, !!opt_fillWithNbsp);
***REMOVED***


***REMOVED***
***REMOVED*** Create a table.
***REMOVED*** @param {!Document} doc Document object to use to create the table.
***REMOVED*** @param {number} rows The number of rows in the table.  Must be >= 1.
***REMOVED*** @param {number} columns The number of columns in the table.  Must be >= 1.
***REMOVED*** @param {boolean} fillWithNbsp If true, fills table entries with nsbps.
***REMOVED*** @return {!Element} The created table.
***REMOVED*** @private
***REMOVED***
goog.dom.createTable_ = function(doc, rows, columns, fillWithNbsp) {
  var rowHtml = ['<tr>'];
  for (var i = 0; i < columns; i++) {
    rowHtml.push(fillWithNbsp ? '<td>&nbsp;</td>' : '<td></td>');
  }
  rowHtml.push('</tr>');
  rowHtml = rowHtml.join('');
  var totalHtml = ['<table>'];
  for (i = 0; i < rows; i++) {
    totalHtml.push(rowHtml);
  }
  totalHtml.push('</table>');

  var elem = doc.createElement(goog.dom.TagName.DIV);
  elem.innerHTML = totalHtml.join('');
  return***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (elem.removeChild(elem.firstChild));
***REMOVED***


***REMOVED***
***REMOVED*** Converts an HTML string into a document fragment. The string must be
***REMOVED*** sanitized in order to avoid cross-site scripting. For example
***REMOVED*** {@code goog.dom.htmlToDocumentFragment('&lt;img src=x onerror=alert(0)&gt;')}
***REMOVED*** triggers an alert in all browsers, even if the returned document fragment
***REMOVED*** is thrown away immediately.
***REMOVED***
***REMOVED*** @param {string} htmlString The HTML string to convert.
***REMOVED*** @return {!Node} The resulting document fragment.
***REMOVED***
goog.dom.htmlToDocumentFragment = function(htmlString) {
  return goog.dom.htmlToDocumentFragment_(document, htmlString);
***REMOVED***


***REMOVED***
***REMOVED*** Helper for {@code htmlToDocumentFragment}.
***REMOVED***
***REMOVED*** @param {!Document} doc The document.
***REMOVED*** @param {string} htmlString The HTML string to convert.
***REMOVED*** @return {!Node} The resulting document fragment.
***REMOVED*** @private
***REMOVED***
goog.dom.htmlToDocumentFragment_ = function(doc, htmlString) {
  var tempDiv = doc.createElement('div');
  if (goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT) {
    tempDiv.innerHTML = '<br>' + htmlString;
    tempDiv.removeChild(tempDiv.firstChild);
  } else {
    tempDiv.innerHTML = htmlString;
  }
  if (tempDiv.childNodes.length == 1) {
    return***REMOVED*****REMOVED*** @type {!Node}***REMOVED*** (tempDiv.removeChild(tempDiv.firstChild));
  } else {
    var fragment = doc.createDocumentFragment();
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
    return fragment;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the compatMode of the document.
***REMOVED*** @return {string} The result is either CSS1Compat or BackCompat.
***REMOVED*** @deprecated use goog.dom.isCss1CompatMode instead.
***REMOVED***
goog.dom.getCompatMode = function() {
  return goog.dom.isCss1CompatMode() ? 'CSS1Compat' : 'BackCompat';
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the browser is in "CSS1-compatible" (standards-compliant)
***REMOVED*** mode, false otherwise.
***REMOVED*** @return {boolean} True if in CSS1-compatible mode.
***REMOVED***
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document);
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the browser is in "CSS1-compatible" (standards-compliant)
***REMOVED*** mode, false otherwise.
***REMOVED*** @param {Document} doc The document to check.
***REMOVED*** @return {boolean} True if in CSS1-compatible mode.
***REMOVED*** @private
***REMOVED***
goog.dom.isCss1CompatMode_ = function(doc) {
  if (goog.dom.COMPAT_MODE_KNOWN_) {
    return goog.dom.ASSUME_STANDARDS_MODE;
  }

  return doc.compatMode == 'CSS1Compat';
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the given node can contain children, intended to be used for
***REMOVED*** HTML generation.
***REMOVED***
***REMOVED*** IE natively supports node.canHaveChildren but has inconsistent behavior.
***REMOVED*** Prior to IE8 the base tag allows children and in IE9 all nodes return true
***REMOVED*** for canHaveChildren.
***REMOVED***
***REMOVED*** In practice all non-IE browsers allow you to add children to any node, but
***REMOVED*** the behavior is inconsistent:
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   var a = document.createElement('br');
***REMOVED***   a.appendChild(document.createTextNode('foo'));
***REMOVED***   a.appendChild(document.createTextNode('bar'));
***REMOVED***   console.log(a.childNodes.length);  // 2
***REMOVED***   console.log(a.innerHTML);  // Chrome: "", IE9: "foobar", FF3.5: "foobar"
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** For more information, see:
***REMOVED*** http://dev.w3.org/html5/markup/syntax.html#syntax-elements
***REMOVED***
***REMOVED*** TODO(user): Rename shouldAllowChildren() ?
***REMOVED***
***REMOVED*** @param {Node} node The node to check.
***REMOVED*** @return {boolean} Whether the node can contain children.
***REMOVED***
goog.dom.canHaveChildren = function(node) {
  if (node.nodeType != goog.dom.NodeType.ELEMENT) {
    return false;
  }
  switch (node.tagName) {
    case goog.dom.TagName.APPLET:
    case goog.dom.TagName.AREA:
    case goog.dom.TagName.BASE:
    case goog.dom.TagName.BR:
    case goog.dom.TagName.COL:
    case goog.dom.TagName.COMMAND:
    case goog.dom.TagName.EMBED:
    case goog.dom.TagName.FRAME:
    case goog.dom.TagName.HR:
    case goog.dom.TagName.IMG:
    case goog.dom.TagName.INPUT:
    case goog.dom.TagName.IFRAME:
    case goog.dom.TagName.ISINDEX:
    case goog.dom.TagName.KEYGEN:
    case goog.dom.TagName.LINK:
    case goog.dom.TagName.NOFRAMES:
    case goog.dom.TagName.NOSCRIPT:
    case goog.dom.TagName.META:
    case goog.dom.TagName.OBJECT:
    case goog.dom.TagName.PARAM:
    case goog.dom.TagName.SCRIPT:
    case goog.dom.TagName.SOURCE:
    case goog.dom.TagName.STYLE:
    case goog.dom.TagName.TRACK:
    case goog.dom.TagName.WBR:
      return false;
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Appends a child to a node.
***REMOVED*** @param {Node} parent Parent.
***REMOVED*** @param {Node} child Child.
***REMOVED***
goog.dom.appendChild = function(parent, child) {
  parent.appendChild(child);
***REMOVED***


***REMOVED***
***REMOVED*** Appends a node with text or other nodes.
***REMOVED*** @param {!Node} parent The node to append nodes to.
***REMOVED*** @param {...goog.dom.Appendable} var_args The things to append to the node.
***REMOVED***     If this is a Node it is appended as is.
***REMOVED***     If this is a string then a text node is appended.
***REMOVED***     If this is an array like object then fields 0 to length - 1 are appended.
***REMOVED***
goog.dom.append = function(parent, var_args) {
  goog.dom.append_(goog.dom.getOwnerDocument(parent), parent, arguments, 1);
***REMOVED***


***REMOVED***
***REMOVED*** Removes all the child nodes on a DOM node.
***REMOVED*** @param {Node} node Node to remove children from.
***REMOVED***
goog.dom.removeChildren = function(node) {
  // Note: Iterations over live collections can be slow, this is the fastest
  // we could find. The double parenthesis are used to prevent JsCompiler and
  // strict warnings.
  var child;
  while ((child = node.firstChild)) {
    node.removeChild(child);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Inserts a new node before an existing reference node (i.e. as the previous
***REMOVED*** sibling). If the reference node has no parent, then does nothing.
***REMOVED*** @param {Node} newNode Node to insert.
***REMOVED*** @param {Node} refNode Reference node to insert before.
***REMOVED***
goog.dom.insertSiblingBefore = function(newNode, refNode) {
  if (refNode.parentNode) {
    refNode.parentNode.insertBefore(newNode, refNode);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Inserts a new node after an existing reference node (i.e. as the next
***REMOVED*** sibling). If the reference node has no parent, then does nothing.
***REMOVED*** @param {Node} newNode Node to insert.
***REMOVED*** @param {Node} refNode Reference node to insert after.
***REMOVED***
goog.dom.insertSiblingAfter = function(newNode, refNode) {
  if (refNode.parentNode) {
    refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Insert a child at a given index. If index is larger than the number of child
***REMOVED*** nodes that the parent currently has, the node is inserted as the last child
***REMOVED*** node.
***REMOVED*** @param {Element} parent The element into which to insert the child.
***REMOVED*** @param {Node} child The element to insert.
***REMOVED*** @param {number} index The index at which to insert the new child node. Must
***REMOVED***     not be negative.
***REMOVED***
goog.dom.insertChildAt = function(parent, child, index) {
  // Note that if the second argument is null, insertBefore
  // will append the child at the end of the list of children.
  parent.insertBefore(child, parent.childNodes[index] || null);
***REMOVED***


***REMOVED***
***REMOVED*** Removes a node from its parent.
***REMOVED*** @param {Node} node The node to remove.
***REMOVED*** @return {Node} The node removed if removed; else, null.
***REMOVED***
goog.dom.removeNode = function(node) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null;
***REMOVED***


***REMOVED***
***REMOVED*** Replaces a node in the DOM tree. Will do nothing if {@code oldNode} has no
***REMOVED*** parent.
***REMOVED*** @param {Node} newNode Node to insert.
***REMOVED*** @param {Node} oldNode Node to replace.
***REMOVED***
goog.dom.replaceNode = function(newNode, oldNode) {
  var parent = oldNode.parentNode;
  if (parent) {
    parent.replaceChild(newNode, oldNode);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Flattens an element. That is, removes it and replace it with its children.
***REMOVED*** Does nothing if the element is not in the document.
***REMOVED*** @param {Element} element The element to flatten.
***REMOVED*** @return {Element|undefined} The original element, detached from the document
***REMOVED***     tree, sans children; or undefined, if the element was not in the document
***REMOVED***     to begin with.
***REMOVED***
goog.dom.flattenElement = function(element) {
  var child, parent = element.parentNode;
  if (parent && parent.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    // Use IE DOM method (supported by Opera too) if available
    if (element.removeNode) {
      return***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (element.removeNode(false));
    } else {
      // Move all children of the original node up one level.
      while ((child = element.firstChild)) {
        parent.insertBefore(child, element);
      }

      // Detach the original element.
      return***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (goog.dom.removeNode(element));
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns an array containing just the element children of the given element.
***REMOVED*** @param {Element} element The element whose element children we want.
***REMOVED*** @return {!(Array|NodeList)} An array or array-like list of just the element
***REMOVED***     children of the given element.
***REMOVED***
goog.dom.getChildren = function(element) {
  // We check if the children attribute is supported for child elements
  // since IE8 misuses the attribute by also including comments.
  if (goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE &&
      element.children != undefined) {
    return element.children;
  }
  // Fall back to manually filtering the element's child nodes.
  return goog.array.filter(element.childNodes, function(node) {
    return node.nodeType == goog.dom.NodeType.ELEMENT;
  });
***REMOVED***


***REMOVED***
***REMOVED*** Returns the first child node that is an element.
***REMOVED*** @param {Node} node The node to get the first child element of.
***REMOVED*** @return {Element} The first child node of {@code node} that is an element.
***REMOVED***
goog.dom.getFirstElementChild = function(node) {
  if (node.firstElementChild != undefined) {
    return***REMOVED*****REMOVED*** @type {Element}***REMOVED***(node).firstElementChild;
  }
  return goog.dom.getNextElementNode_(node.firstChild, true);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the last child node that is an element.
***REMOVED*** @param {Node} node The node to get the last child element of.
***REMOVED*** @return {Element} The last child node of {@code node} that is an element.
***REMOVED***
goog.dom.getLastElementChild = function(node) {
  if (node.lastElementChild != undefined) {
    return***REMOVED*****REMOVED*** @type {Element}***REMOVED***(node).lastElementChild;
  }
  return goog.dom.getNextElementNode_(node.lastChild, false);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the first next sibling that is an element.
***REMOVED*** @param {Node} node The node to get the next sibling element of.
***REMOVED*** @return {Element} The next sibling of {@code node} that is an element.
***REMOVED***
goog.dom.getNextElementSibling = function(node) {
  if (node.nextElementSibling != undefined) {
    return***REMOVED*****REMOVED*** @type {Element}***REMOVED***(node).nextElementSibling;
  }
  return goog.dom.getNextElementNode_(node.nextSibling, true);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the first previous sibling that is an element.
***REMOVED*** @param {Node} node The node to get the previous sibling element of.
***REMOVED*** @return {Element} The first previous sibling of {@code node} that is
***REMOVED***     an element.
***REMOVED***
goog.dom.getPreviousElementSibling = function(node) {
  if (node.previousElementSibling != undefined) {
    return***REMOVED*****REMOVED*** @type {Element}***REMOVED***(node).previousElementSibling;
  }
  return goog.dom.getNextElementNode_(node.previousSibling, false);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the first node that is an element in the specified direction,
***REMOVED*** starting with {@code node}.
***REMOVED*** @param {Node} node The node to get the next element from.
***REMOVED*** @param {boolean} forward Whether to look forwards or backwards.
***REMOVED*** @return {Element} The first element.
***REMOVED*** @private
***REMOVED***
goog.dom.getNextElementNode_ = function(node, forward) {
  while (node && node.nodeType != goog.dom.NodeType.ELEMENT) {
    node = forward ? node.nextSibling : node.previousSibling;
  }

  return***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (node);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the next node in source order from the given node.
***REMOVED*** @param {Node} node The node.
***REMOVED*** @return {Node} The next node in the DOM tree, or null if this was the last
***REMOVED***     node.
***REMOVED***
goog.dom.getNextNode = function(node) {
  if (!node) {
    return null;
  }

  if (node.firstChild) {
    return node.firstChild;
  }

  while (node && !node.nextSibling) {
    node = node.parentNode;
  }

  return node ? node.nextSibling : null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the previous node in source order from the given node.
***REMOVED*** @param {Node} node The node.
***REMOVED*** @return {Node} The previous node in the DOM tree, or null if this was the
***REMOVED***     first node.
***REMOVED***
goog.dom.getPreviousNode = function(node) {
  if (!node) {
    return null;
  }

  if (!node.previousSibling) {
    return node.parentNode;
  }

  node = node.previousSibling;
  while (node && node.lastChild) {
    node = node.lastChild;
  }

  return node;
***REMOVED***


***REMOVED***
***REMOVED*** Whether the object looks like a DOM node.
***REMOVED*** @param {*} obj The object being tested for node likeness.
***REMOVED*** @return {boolean} Whether the object looks like a DOM node.
***REMOVED***
goog.dom.isNodeLike = function(obj) {
  return goog.isObject(obj) && obj.nodeType > 0;
***REMOVED***


***REMOVED***
***REMOVED*** Whether the object looks like an Element.
***REMOVED*** @param {*} obj The object being tested for Element likeness.
***REMOVED*** @return {boolean} Whether the object looks like an Element.
***REMOVED***
goog.dom.isElement = function(obj) {
  return goog.isObject(obj) && obj.nodeType == goog.dom.NodeType.ELEMENT;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the specified value is a Window object. This includes the
***REMOVED*** global window for HTML pages, and iframe windows.
***REMOVED*** @param {*} obj Variable to test.
***REMOVED*** @return {boolean} Whether the variable is a window.
***REMOVED***
goog.dom.isWindow = function(obj) {
  return goog.isObject(obj) && obj['window'] == obj;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an element's parent, if it's an Element.
***REMOVED*** @param {Element} element The DOM element.
***REMOVED*** @return {Element} The parent, or null if not an Element.
***REMOVED***
goog.dom.getParentElement = function(element) {
  if (goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY) {
    return element.parentElement;
  }
  var parent = element.parentNode;
  return goog.dom.isElement(parent) ?***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (parent) : null;
***REMOVED***


***REMOVED***
***REMOVED*** Whether a node contains another node.
***REMOVED*** @param {Node} parent The node that should contain the other node.
***REMOVED*** @param {Node} descendant The node to test presence of.
***REMOVED*** @return {boolean} Whether the parent node contains the descendent node.
***REMOVED***
goog.dom.contains = function(parent, descendant) {
  // We use browser specific methods for this if available since it is faster
  // that way.

  // IE DOM
  if (parent.contains && descendant.nodeType == goog.dom.NodeType.ELEMENT) {
    return parent == descendant || parent.contains(descendant);
  }

  // W3C DOM Level 3
  if (typeof parent.compareDocumentPosition != 'undefined') {
    return parent == descendant ||
        Boolean(parent.compareDocumentPosition(descendant) & 16);
  }

  // W3C DOM Level 1
  while (descendant && parent != descendant) {
    descendant = descendant.parentNode;
  }
  return descendant == parent;
***REMOVED***


***REMOVED***
***REMOVED*** Compares the document order of two nodes, returning 0 if they are the same
***REMOVED*** node, a negative number if node1 is before node2, and a positive number if
***REMOVED*** node2 is before node1.  Note that we compare the order the tags appear in the
***REMOVED*** document so in the tree <b><i>text</i></b> the B node is considered to be
***REMOVED*** before the I node.
***REMOVED***
***REMOVED*** @param {Node} node1 The first node to compare.
***REMOVED*** @param {Node} node2 The second node to compare.
***REMOVED*** @return {number} 0 if the nodes are the same node, a negative number if node1
***REMOVED***     is before node2, and a positive number if node2 is before node1.
***REMOVED***
goog.dom.compareNodeOrder = function(node1, node2) {
  // Fall out quickly for equality.
  if (node1 == node2) {
    return 0;
  }

  // Use compareDocumentPosition where available
  if (node1.compareDocumentPosition) {
    // 4 is the bitmask for FOLLOWS.
    return node1.compareDocumentPosition(node2) & 2 ? 1 : -1;
  }

  // Special case for document nodes on IE 7 and 8.
  if (goog.userAgent.IE && !goog.userAgent.isDocumentMode(9)) {
    if (node1.nodeType == goog.dom.NodeType.DOCUMENT) {
      return -1;
    }
    if (node2.nodeType == goog.dom.NodeType.DOCUMENT) {
      return 1;
    }
  }

  // Process in IE using sourceIndex - we check to see if the first node has
  // a source index or if its parent has one.
  if ('sourceIndex' in node1 ||
      (node1.parentNode && 'sourceIndex' in node1.parentNode)) {
    var isElement1 = node1.nodeType == goog.dom.NodeType.ELEMENT;
    var isElement2 = node2.nodeType == goog.dom.NodeType.ELEMENT;

    if (isElement1 && isElement2) {
      return node1.sourceIndex - node2.sourceIndex;
    } else {
      var parent1 = node1.parentNode;
      var parent2 = node2.parentNode;

      if (parent1 == parent2) {
        return goog.dom.compareSiblingOrder_(node1, node2);
      }

      if (!isElement1 && goog.dom.contains(parent1, node2)) {
        return -1***REMOVED*** goog.dom.compareParentsDescendantNodeIe_(node1, node2);
      }


      if (!isElement2 && goog.dom.contains(parent2, node1)) {
        return goog.dom.compareParentsDescendantNodeIe_(node2, node1);
      }

      return (isElement1 ? node1.sourceIndex : parent1.sourceIndex) -
             (isElement2 ? node2.sourceIndex : parent2.sourceIndex);
    }
  }

  // For Safari, we compare ranges.
  var doc = goog.dom.getOwnerDocument(node1);

  var range1, range2;
  range1 = doc.createRange();
  range1.selectNode(node1);
  range1.collapse(true);

  range2 = doc.createRange();
  range2.selectNode(node2);
  range2.collapse(true);

  return range1.compareBoundaryPoints(goog.global['Range'].START_TO_END,
      range2);
***REMOVED***


***REMOVED***
***REMOVED*** Utility function to compare the position of two nodes, when
***REMOVED*** {@code textNode}'s parent is an ancestor of {@code node}.  If this entry
***REMOVED*** condition is not met, this function will attempt to reference a null object.
***REMOVED*** @param {Node} textNode The textNode to compare.
***REMOVED*** @param {Node} node The node to compare.
***REMOVED*** @return {number} -1 if node is before textNode, +1 otherwise.
***REMOVED*** @private
***REMOVED***
goog.dom.compareParentsDescendantNodeIe_ = function(textNode, node) {
  var parent = textNode.parentNode;
  if (parent == node) {
    // If textNode is a child of node, then node comes first.
    return -1;
  }
  var sibling = node;
  while (sibling.parentNode != parent) {
    sibling = sibling.parentNode;
  }
  return goog.dom.compareSiblingOrder_(sibling, textNode);
***REMOVED***


***REMOVED***
***REMOVED*** Utility function to compare the position of two nodes known to be non-equal
***REMOVED*** siblings.
***REMOVED*** @param {Node} node1 The first node to compare.
***REMOVED*** @param {Node} node2 The second node to compare.
***REMOVED*** @return {number} -1 if node1 is before node2, +1 otherwise.
***REMOVED*** @private
***REMOVED***
goog.dom.compareSiblingOrder_ = function(node1, node2) {
  var s = node2;
  while ((s = s.previousSibling)) {
    if (s == node1) {
      // We just found node1 before node2.
      return -1;
    }
  }

  // Since we didn't find it, node1 must be after node2.
  return 1;
***REMOVED***


***REMOVED***
***REMOVED*** Find the deepest common ancestor of the given nodes.
***REMOVED*** @param {...Node} var_args The nodes to find a common ancestor of.
***REMOVED*** @return {Node} The common ancestor of the nodes, or null if there is none.
***REMOVED***     null will only be returned if two or more of the nodes are from different
***REMOVED***     documents.
***REMOVED***
goog.dom.findCommonAncestor = function(var_args) {
  var i, count = arguments.length;
  if (!count) {
    return null;
  } else if (count == 1) {
    return arguments[0];
  }

  var paths = [];
  var minLength = Infinity;
  for (i = 0; i < count; i++) {
    // Compute the list of ancestors.
    var ancestors = [];
    var node = arguments[i];
    while (node) {
      ancestors.unshift(node);
      node = node.parentNode;
    }

    // Save the list for comparison.
    paths.push(ancestors);
    minLength = Math.min(minLength, ancestors.length);
  }
  var output = null;
  for (i = 0; i < minLength; i++) {
    var first = paths[0][i];
    for (var j = 1; j < count; j++) {
      if (first != paths[j][i]) {
        return output;
      }
    }
    output = first;
  }
  return output;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the owner document for a node.
***REMOVED*** @param {Node|Window} node The node to get the document for.
***REMOVED*** @return {!Document} The document owning the node.
***REMOVED***
goog.dom.getOwnerDocument = function(node) {
  // TODO(arv): Remove IE5 code.
  // IE5 uses document instead of ownerDocument
  return***REMOVED*****REMOVED*** @type {!Document}***REMOVED*** (
      node.nodeType == goog.dom.NodeType.DOCUMENT ? node :
      node.ownerDocument || node.document);
***REMOVED***


***REMOVED***
***REMOVED*** Cross-browser function for getting the document element of a frame or iframe.
***REMOVED*** @param {Element} frame Frame element.
***REMOVED*** @return {!Document} The frame content document.
***REMOVED***
goog.dom.getFrameContentDocument = function(frame) {
  var doc = frame.contentDocument || frame.contentWindow.document;
  return doc;
***REMOVED***


***REMOVED***
***REMOVED*** Cross-browser function for getting the window of a frame or iframe.
***REMOVED*** @param {Element} frame Frame element.
***REMOVED*** @return {Window} The window associated with the given frame.
***REMOVED***
goog.dom.getFrameContentWindow = function(frame) {
  return frame.contentWindow ||
      goog.dom.getWindow_(goog.dom.getFrameContentDocument(frame));
***REMOVED***


***REMOVED***
***REMOVED*** Cross-browser function for setting the text content of an element.
***REMOVED*** @param {Element} element The element to change the text content of.
***REMOVED*** @param {string|number} text The string that should replace the current
***REMOVED***     element content.
***REMOVED***
goog.dom.setTextContent = function(element, text) {
  if ('textContent' in element) {
    element.textContent = text;
  } else if (element.firstChild &&
             element.firstChild.nodeType == goog.dom.NodeType.TEXT) {
    // If the first child is a text node we just change its data and remove the
    // rest of the children.
    while (element.lastChild != element.firstChild) {
      element.removeChild(element.lastChild);
    }
    element.firstChild.data = text;
  } else {
    goog.dom.removeChildren(element);
    var doc = goog.dom.getOwnerDocument(element);
    element.appendChild(doc.createTextNode(String(text)));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the outerHTML of a node, which islike innerHTML, except that it
***REMOVED*** actually contains the HTML of the node itself.
***REMOVED*** @param {Element} element The element to get the HTML of.
***REMOVED*** @return {string} The outerHTML of the given element.
***REMOVED***
goog.dom.getOuterHtml = function(element) {
  // IE, Opera and WebKit all have outerHTML.
  if ('outerHTML' in element) {
    return element.outerHTML;
  } else {
    var doc = goog.dom.getOwnerDocument(element);
    var div = doc.createElement('div');
    div.appendChild(element.cloneNode(true));
    return div.innerHTML;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Finds the first descendant node that matches the filter function, using
***REMOVED*** a depth first search. This function offers the most general purpose way
***REMOVED*** of finding a matching element. You may also wish to consider
***REMOVED*** {@code goog.dom.query} which can express many matching criteria using
***REMOVED*** CSS selector expressions. These expressions often result in a more
***REMOVED*** compact representation of the desired result.
***REMOVED*** @see goog.dom.query
***REMOVED***
***REMOVED*** @param {Node} root The root of the tree to search.
***REMOVED*** @param {function(Node) : boolean} p The filter function.
***REMOVED*** @return {Node|undefined} The found node or undefined if none is found.
***REMOVED***
goog.dom.findNode = function(root, p) {
  var rv = [];
  var found = goog.dom.findNodes_(root, p, rv, true);
  return found ? rv[0] : undefined;
***REMOVED***


***REMOVED***
***REMOVED*** Finds all the descendant nodes that match the filter function, using a
***REMOVED*** a depth first search. This function offers the most general-purpose way
***REMOVED*** of finding a set of matching elements. You may also wish to consider
***REMOVED*** {@code goog.dom.query} which can express many matching criteria using
***REMOVED*** CSS selector expressions. These expressions often result in a more
***REMOVED*** compact representation of the desired result.

***REMOVED*** @param {Node} root The root of the tree to search.
***REMOVED*** @param {function(Node) : boolean} p The filter function.
***REMOVED*** @return {!Array.<!Node>} The found nodes or an empty array if none are found.
***REMOVED***
goog.dom.findNodes = function(root, p) {
  var rv = [];
  goog.dom.findNodes_(root, p, rv, false);
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Finds the first or all the descendant nodes that match the filter function,
***REMOVED*** using a depth first search.
***REMOVED*** @param {Node} root The root of the tree to search.
***REMOVED*** @param {function(Node) : boolean} p The filter function.
***REMOVED*** @param {!Array.<!Node>} rv The found nodes are added to this array.
***REMOVED*** @param {boolean} findOne If true we exit after the first found node.
***REMOVED*** @return {boolean} Whether the search is complete or not. True in case findOne
***REMOVED***     is true and the node is found. False otherwise.
***REMOVED*** @private
***REMOVED***
goog.dom.findNodes_ = function(root, p, rv, findOne) {
  if (root != null) {
    var child = root.firstChild;
    while (child) {
      if (p(child)) {
        rv.push(child);
        if (findOne) {
          return true;
        }
      }
      if (goog.dom.findNodes_(child, p, rv, findOne)) {
        return true;
      }
      child = child.nextSibling;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Map of tags whose content to ignore when calculating text length.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.dom.TAGS_TO_IGNORE_ = {
  'SCRIPT': 1,
  'STYLE': 1,
  'HEAD': 1,
  'IFRAME': 1,
  'OBJECT': 1
***REMOVED***


***REMOVED***
***REMOVED*** Map of tags which have predefined values with regard to whitespace.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.dom.PREDEFINED_TAG_VALUES_ = {'IMG': ' ', 'BR': '\n'***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the element has a tab index that allows it to receive
***REMOVED*** keyboard focus (tabIndex >= 0), false otherwise.  Note that form elements
***REMOVED*** natively support keyboard focus, even if they have no tab index.
***REMOVED*** @param {Element} element Element to check.
***REMOVED*** @return {boolean} Whether the element has a tab index that allows keyboard
***REMOVED***     focus.
***REMOVED*** @see http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
***REMOVED***
goog.dom.isFocusableTabIndex = function(element) {
  // IE returns 0 for an unset tabIndex, so we must use getAttributeNode(),
  // which returns an object with a 'specified' property if tabIndex is
  // specified.  This works on other browsers, too.
  var attrNode = element.getAttributeNode('tabindex'); // Must be lowercase!
  if (attrNode && attrNode.specified) {
    var index = element.tabIndex;
    // NOTE: IE9 puts tabIndex in 16-bit int, e.g. -2 is 65534.
    return goog.isNumber(index) && index >= 0 && index < 32768;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Enables or disables keyboard focus support on the element via its tab index.
***REMOVED*** Only elements for which {@link goog.dom.isFocusableTabIndex} returns true
***REMOVED*** (or elements that natively support keyboard focus, like form elements) can
***REMOVED*** receive keyboard focus.  See http://go/tabindex for more info.
***REMOVED*** @param {Element} element Element whose tab index is to be changed.
***REMOVED*** @param {boolean} enable Whether to set or remove a tab index on the element
***REMOVED***     that supports keyboard focus.
***REMOVED***
goog.dom.setFocusableTabIndex = function(element, enable) {
  if (enable) {
    element.tabIndex = 0;
  } else {
    // Set tabIndex to -1 first, then remove it. This is a workaround for
    // Safari (confirmed in version 4 on Windows). When removing the attribute
    // without setting it to -1 first, the element remains keyboard focusable
    // despite not having a tabIndex attribute anymore.
    element.tabIndex = -1;
    element.removeAttribute('tabIndex'); // Must be camelCase!
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the text content of the current node, without markup and invisible
***REMOVED*** symbols. New lines are stripped and whitespace is collapsed,
***REMOVED*** such that each character would be visible.
***REMOVED***
***REMOVED*** In browsers that support it, innerText is used.  Other browsers attempt to
***REMOVED*** simulate it via node traversal.  Line breaks are canonicalized in IE.
***REMOVED***
***REMOVED*** @param {Node} node The node from which we are getting content.
***REMOVED*** @return {string} The text content.
***REMOVED***
goog.dom.getTextContent = function(node) {
  var textContent;
  // Note(arv): IE9, Opera, and Safari 3 support innerText but they include
  // text nodes in script tags. So we revert to use a user agent test here.
  if (goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && ('innerText' in node)) {
    textContent = goog.string.canonicalizeNewlines(node.innerText);
    // Unfortunately .innerText() returns text with &shy; symbols
    // We need to filter it out and then remove duplicate whitespaces
  } else {
    var buf = [];
    goog.dom.getTextContent_(node, buf, true);
    textContent = buf.join('');
  }

  // Strip &shy; entities. goog.format.insertWordBreaks inserts them in Opera.
  textContent = textContent.replace(/ \xAD /g, ' ').replace(/\xAD/g, '');
  // Strip &#8203; entities. goog.format.insertWordBreaks inserts them in IE8.
  textContent = textContent.replace(/\u200B/g, '');

  // Skip this replacement on old browsers with working innerText, which
  // automatically turns &nbsp; into ' ' and / +/ into ' ' when reading
  // innerText.
  if (!goog.dom.BrowserFeature.CAN_USE_INNER_TEXT) {
    textContent = textContent.replace(/ +/g, ' ');
  }
  if (textContent != ' ') {
    textContent = textContent.replace(/^\s*/, '');
  }

  return textContent;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the text content of the current node, without markup.
***REMOVED***
***REMOVED*** Unlike {@code getTextContent} this method does not collapse whitespaces
***REMOVED*** or normalize lines breaks.
***REMOVED***
***REMOVED*** @param {Node} node The node from which we are getting content.
***REMOVED*** @return {string} The raw text content.
***REMOVED***
goog.dom.getRawTextContent = function(node) {
  var buf = [];
  goog.dom.getTextContent_(node, buf, false);

  return buf.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Recursive support function for text content retrieval.
***REMOVED***
***REMOVED*** @param {Node} node The node from which we are getting content.
***REMOVED*** @param {Array} buf string buffer.
***REMOVED*** @param {boolean} normalizeWhitespace Whether to normalize whitespace.
***REMOVED*** @private
***REMOVED***
goog.dom.getTextContent_ = function(node, buf, normalizeWhitespace) {
  if (node.nodeName in goog.dom.TAGS_TO_IGNORE_) {
    // ignore certain tags
  } else if (node.nodeType == goog.dom.NodeType.TEXT) {
    if (normalizeWhitespace) {
      buf.push(String(node.nodeValue).replace(/(\r\n|\r|\n)/g, ''));
    } else {
      buf.push(node.nodeValue);
    }
  } else if (node.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
    buf.push(goog.dom.PREDEFINED_TAG_VALUES_[node.nodeName]);
  } else {
    var child = node.firstChild;
    while (child) {
      goog.dom.getTextContent_(child, buf, normalizeWhitespace);
      child = child.nextSibling;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the text length of the text contained in a node, without markup. This
***REMOVED*** is equivalent to the selection length if the node was selected, or the number
***REMOVED*** of cursor movements to traverse the node. Images & BRs take one space.  New
***REMOVED*** lines are ignored.
***REMOVED***
***REMOVED*** @param {Node} node The node whose text content length is being calculated.
***REMOVED*** @return {number} The length of {@code node}'s text content.
***REMOVED***
goog.dom.getNodeTextLength = function(node) {
  return goog.dom.getTextContent(node).length;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the text offset of a node relative to one of its ancestors. The text
***REMOVED*** length is the same as the length calculated by goog.dom.getNodeTextLength.
***REMOVED***
***REMOVED*** @param {Node} node The node whose offset is being calculated.
***REMOVED*** @param {Node=} opt_offsetParent The node relative to which the offset will
***REMOVED***     be calculated. Defaults to the node's owner document's body.
***REMOVED*** @return {number} The text offset.
***REMOVED***
goog.dom.getNodeTextOffset = function(node, opt_offsetParent) {
  var root = opt_offsetParent || goog.dom.getOwnerDocument(node).body;
  var buf = [];
  while (node && node != root) {
    var cur = node;
    while ((cur = cur.previousSibling)) {
      buf.unshift(goog.dom.getTextContent(cur));
    }
    node = node.parentNode;
  }
  // Trim left to deal with FF cases when there might be line breaks and empty
  // nodes at the front of the text
  return goog.string.trimLeft(buf.join('')).replace(/ +/g, ' ').length;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the node at a given offset in a parent node.  If an object is
***REMOVED*** provided for the optional third parameter, the node and the remainder of the
***REMOVED*** offset will stored as properties of this object.
***REMOVED*** @param {Node} parent The parent node.
***REMOVED*** @param {number} offset The offset into the parent node.
***REMOVED*** @param {Object=} opt_result Object to be used to store the return value. The
***REMOVED***     return value will be stored in the form {node: Node, remainder: number}
***REMOVED***     if this object is provided.
***REMOVED*** @return {Node} The node at the given offset.
***REMOVED***
goog.dom.getNodeAtOffset = function(parent, offset, opt_result) {
  var stack = [parent], pos = 0, cur = null;
  while (stack.length > 0 && pos < offset) {
    cur = stack.pop();
    if (cur.nodeName in goog.dom.TAGS_TO_IGNORE_) {
      // ignore certain tags
    } else if (cur.nodeType == goog.dom.NodeType.TEXT) {
      var text = cur.nodeValue.replace(/(\r\n|\r|\n)/g, '').replace(/ +/g, ' ');
      pos += text.length;
    } else if (cur.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
      pos += goog.dom.PREDEFINED_TAG_VALUES_[cur.nodeName].length;
    } else {
      for (var i = cur.childNodes.length - 1; i >= 0; i--) {
        stack.push(cur.childNodes[i]);
      }
    }
  }
  if (goog.isObject(opt_result)) {
    opt_result.remainder = cur ? cur.nodeValue.length + offset - pos - 1 : 0;
    opt_result.node = cur;
  }

  return cur;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the object is a {@code NodeList}.  To qualify as a NodeList,
***REMOVED*** the object must have a numeric length property and an item function (which
***REMOVED*** has type 'string' on IE for some reason).
***REMOVED*** @param {Object} val Object to test.
***REMOVED*** @return {boolean} Whether the object is a NodeList.
***REMOVED***
goog.dom.isNodeList = function(val) {
  // TODO(attila): Now the isNodeList is part of goog.dom we can use
  // goog.userAgent to make this simpler.
  // A NodeList must have a length property of type 'number' on all platforms.
  if (val && typeof val.length == 'number') {
    // A NodeList is an object everywhere except Safari, where it's a function.
    if (goog.isObject(val)) {
      // A NodeList must have an item function (on non-IE platforms) or an item
      // property of type 'string' (on IE).
      return typeof val.item == 'function' || typeof val.item == 'string';
    } else if (goog.isFunction(val)) {
      // On Safari, a NodeList is a function with an item property that is also
      // a function.
      return typeof val.item == 'function';
    }
  }

  // Not a NodeList.
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Walks up the DOM hierarchy returning the first ancestor that has the passed
***REMOVED*** tag name and/or class name. If the passed element matches the specified
***REMOVED*** criteria, the element itself is returned.
***REMOVED*** @param {Node} element The DOM node to start with.
***REMOVED*** @param {?(goog.dom.TagName|string)=} opt_tag The tag name to match (or
***REMOVED***     null/undefined to match only based on class name).
***REMOVED*** @param {?string=} opt_class The class name to match (or null/undefined to
***REMOVED***     match only based on tag name).
***REMOVED*** @return {Element} The first ancestor that matches the passed criteria, or
***REMOVED***     null if no match is found.
***REMOVED***
goog.dom.getAncestorByTagNameAndClass = function(element, opt_tag, opt_class) {
  if (!opt_tag && !opt_class) {
    return null;
  }
  var tagName = opt_tag ? opt_tag.toUpperCase() : null;
  return***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (goog.dom.getAncestor(element,
      function(node) {
        return (!tagName || node.nodeName == tagName) &&
               (!opt_class || goog.dom.classes.has(node, opt_class));
      }, true));
***REMOVED***


***REMOVED***
***REMOVED*** Walks up the DOM hierarchy returning the first ancestor that has the passed
***REMOVED*** class name. If the passed element matches the specified criteria, the
***REMOVED*** element itself is returned.
***REMOVED*** @param {Node} element The DOM node to start with.
***REMOVED*** @param {string} className The class name to match.
***REMOVED*** @return {Element} The first ancestor that matches the passed criteria, or
***REMOVED***     null if none match.
***REMOVED***
goog.dom.getAncestorByClass = function(element, className) {
  return goog.dom.getAncestorByTagNameAndClass(element, null, className);
***REMOVED***


***REMOVED***
***REMOVED*** Walks up the DOM hierarchy returning the first ancestor that passes the
***REMOVED*** matcher function.
***REMOVED*** @param {Node} element The DOM node to start with.
***REMOVED*** @param {function(Node) : boolean} matcher A function that returns true if the
***REMOVED***     passed node matches the desired criteria.
***REMOVED*** @param {boolean=} opt_includeNode If true, the node itself is included in
***REMOVED***     the search (the first call to the matcher will pass startElement as
***REMOVED***     the node to test).
***REMOVED*** @param {number=} opt_maxSearchSteps Maximum number of levels to search up the
***REMOVED***     dom.
***REMOVED*** @return {Node} DOM node that matched the matcher, or null if there was
***REMOVED***     no match.
***REMOVED***
goog.dom.getAncestor = function(
    element, matcher, opt_includeNode, opt_maxSearchSteps) {
  if (!opt_includeNode) {
    element = element.parentNode;
  }
  var ignoreSearchSteps = opt_maxSearchSteps == null;
  var steps = 0;
  while (element && (ignoreSearchSteps || steps <= opt_maxSearchSteps)) {
    if (matcher(element)) {
      return element;
    }
    element = element.parentNode;
    steps++;
  }
  // Reached the root of the DOM without a match
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Determines the active element in the given document.
***REMOVED*** @param {Document} doc The document to look in.
***REMOVED*** @return {Element} The active element.
***REMOVED***
goog.dom.getActiveElement = function(doc) {
  try {
    return doc && doc.activeElement;
  } catch (e) {
    // NOTE(nicksantos): Sometimes, evaluating document.activeElement in IE
    // throws an exception. I'm not 100% sure why, but I suspect it chokes
    // on document.activeElement if the activeElement has been recently
    // removed from the DOM by a JS operation.
    //
    // We assume that an exception here simply means
    // "there is no active element."
  }

  return null;
***REMOVED***



***REMOVED***
***REMOVED*** Create an instance of a DOM helper with a new document object.
***REMOVED*** @param {Document=} opt_document Document object to associate with this
***REMOVED***     DOM helper.
***REMOVED***
***REMOVED***
goog.dom.DomHelper = function(opt_document) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Reference to the document object to use
  ***REMOVED*** @type {!Document}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.document_ = opt_document || goog.global.document || document;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the dom helper object for the document where the element resides.
***REMOVED*** @param {Node=} opt_node If present, gets the DomHelper for this node.
***REMOVED*** @return {!goog.dom.DomHelper} The DomHelper.
***REMOVED***
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;


***REMOVED***
***REMOVED*** Sets the document object.
***REMOVED*** @param {!Document} document Document object.
***REMOVED***
goog.dom.DomHelper.prototype.setDocument = function(document) {
  this.document_ = document;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the document object being used by the dom library.
***REMOVED*** @return {!Document} Document object.
***REMOVED***
goog.dom.DomHelper.prototype.getDocument = function() {
***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Alias for {@code getElementById}. If a DOM node is passed in then we just
***REMOVED*** return that.
***REMOVED*** @param {string|Element} element Element ID or a DOM node.
***REMOVED*** @return {Element} The element with the given ID, or the node passed in.
***REMOVED***
goog.dom.DomHelper.prototype.getElement = function(element) {
  if (goog.isString(element)) {
    return this.document_.getElementById(element);
  } else {
    return element;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Alias for {@code getElement}.
***REMOVED*** @param {string|Element} element Element ID or a DOM node.
***REMOVED*** @return {Element} The element with the given ID, or the node passed in.
***REMOVED*** @deprecated Use {@link goog.dom.DomHelper.prototype.getElement} instead.
***REMOVED***
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;


***REMOVED***
***REMOVED*** Looks up elements by both tag and class name, using browser native functions
***REMOVED*** ({@code querySelectorAll}, {@code getElementsByTagName} or
***REMOVED*** {@code getElementsByClassName}) where possible. The returned array is a live
***REMOVED*** NodeList or a static list depending on the code path taken.
***REMOVED***
***REMOVED*** @see goog.dom.query
***REMOVED***
***REMOVED*** @param {?string=} opt_tag Element tag name or***REMOVED*** for all tags.
***REMOVED*** @param {?string=} opt_class Optional class name.
***REMOVED*** @param {(Document|Element)=} opt_el Optional element to look in.
***REMOVED*** @return { {length: number} } Array-like list of elements (only a length
***REMOVED***     property and numerical indices are guaranteed to exist).
***REMOVED***
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(opt_tag,
                                                                     opt_class,
                                                                     opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, opt_tag,
                                                opt_class, opt_el);
***REMOVED***


***REMOVED***
***REMOVED*** Returns an array of all the elements with the provided className.
***REMOVED*** @see {goog.dom.query}
***REMOVED*** @param {string} className the name of the class to look for.
***REMOVED*** @param {Element|Document=} opt_el Optional element to look in.
***REMOVED*** @return { {length: number} } The items found with the class name provided.
***REMOVED***
goog.dom.DomHelper.prototype.getElementsByClass = function(className, opt_el) {
  var doc = opt_el || this.document_;
  return goog.dom.getElementsByClass(className, doc);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the first element we find matching the provided class name.
***REMOVED*** @see {goog.dom.query}
***REMOVED*** @param {string} className the name of the class to look for.
***REMOVED*** @param {(Element|Document)=} opt_el Optional element to look in.
***REMOVED*** @return {Element} The first item found with the class name provided.
***REMOVED***
goog.dom.DomHelper.prototype.getElementByClass = function(className, opt_el) {
  var doc = opt_el || this.document_;
  return goog.dom.getElementByClass(className, doc);
***REMOVED***


***REMOVED***
***REMOVED*** Alias for {@code getElementsByTagNameAndClass}.
***REMOVED*** @deprecated Use DomHelper getElementsByTagNameAndClass.
***REMOVED*** @see goog.dom.query
***REMOVED***
***REMOVED*** @param {?string=} opt_tag Element tag name.
***REMOVED*** @param {?string=} opt_class Optional class name.
***REMOVED*** @param {Element=} opt_el Optional element to look in.
***REMOVED*** @return { {length: number} } Array-like list of elements (only a length
***REMOVED***     property and numerical indices are guaranteed to exist).
***REMOVED***
goog.dom.DomHelper.prototype.$$ =
    goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;


***REMOVED***
***REMOVED*** Sets a number of properties on a node.
***REMOVED*** @param {Element} element DOM node to set properties on.
***REMOVED*** @param {Object} properties Hash of property:value pairs.
***REMOVED***
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;


***REMOVED***
***REMOVED*** Gets the dimensions of the viewport.
***REMOVED*** @param {Window=} opt_window Optional window element to test. Defaults to
***REMOVED***     the window of the Dom Helper.
***REMOVED*** @return {!goog.math.Size} Object with values 'width' and 'height'.
***REMOVED***
goog.dom.DomHelper.prototype.getViewportSize = function(opt_window) {
  // TODO(arv): This should not take an argument. That breaks the rule of a
  // a DomHelper representing a single frame/window/document.
  return goog.dom.getViewportSize(opt_window || this.getWindow());
***REMOVED***


***REMOVED***
***REMOVED*** Calculates the height of the document.
***REMOVED***
***REMOVED*** @return {number} The height of the document.
***REMOVED***
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow());
***REMOVED***


***REMOVED***
***REMOVED*** Typedef for use with goog.dom.createDom and goog.dom.append.
***REMOVED*** @typedef {Object|string|Array|NodeList}
***REMOVED***
goog.dom.Appendable;


***REMOVED***
***REMOVED*** Returns a dom node with a set of attributes.  This function accepts varargs
***REMOVED*** for subsequent nodes to be added.  Subsequent nodes will be added to the
***REMOVED*** first node as childNodes.
***REMOVED***
***REMOVED*** So:
***REMOVED*** <code>createDom('div', null, createDom('p'), createDom('p'));</code>
***REMOVED*** would return a div with two child paragraphs
***REMOVED***
***REMOVED*** An easy way to move all child nodes of an existing element to a new parent
***REMOVED*** element is:
***REMOVED*** <code>createDom('div', null, oldElement.childNodes);</code>
***REMOVED*** which will remove all child nodes from the old element and add them as
***REMOVED*** child nodes of the new DIV.
***REMOVED***
***REMOVED*** @param {string} tagName Tag to create.
***REMOVED*** @param {Object|string=} opt_attributes If object, then a map of name-value
***REMOVED***     pairs for attributes. If a string, then this is the className of the new
***REMOVED***     element.
***REMOVED*** @param {...goog.dom.Appendable} var_args Further DOM nodes or
***REMOVED***     strings for text nodes. If one of the var_args is an array or
***REMOVED***     NodeList, its elements will be added as childNodes instead.
***REMOVED*** @return {!Element} Reference to a DOM node.
***REMOVED***
goog.dom.DomHelper.prototype.createDom = function(tagName,
                                                  opt_attributes,
                                                  var_args) {
  return goog.dom.createDom_(this.document_, arguments);
***REMOVED***


***REMOVED***
***REMOVED*** Alias for {@code createDom}.
***REMOVED*** @param {string} tagName Tag to create.
***REMOVED*** @param {(Object|string)=} opt_attributes If object, then a map of name-value
***REMOVED***     pairs for attributes. If a string, then this is the className of the new
***REMOVED***     element.
***REMOVED*** @param {...goog.dom.Appendable} var_args Further DOM nodes or strings for
***REMOVED***     text nodes.  If one of the var_args is an array, its children will be
***REMOVED***     added as childNodes instead.
***REMOVED*** @return {!Element} Reference to a DOM node.
***REMOVED*** @deprecated Use {@link goog.dom.DomHelper.prototype.createDom} instead.
***REMOVED***
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;


***REMOVED***
***REMOVED*** Creates a new element.
***REMOVED*** @param {string} name Tag name.
***REMOVED*** @return {!Element} The new element.
***REMOVED***
goog.dom.DomHelper.prototype.createElement = function(name) {
  return this.document_.createElement(name);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new text node.
***REMOVED*** @param {number|string} content Content.
***REMOVED*** @return {!Text} The new text node.
***REMOVED***
goog.dom.DomHelper.prototype.createTextNode = function(content) {
  return this.document_.createTextNode(String(content));
***REMOVED***


***REMOVED***
***REMOVED*** Create a table.
***REMOVED*** @param {number} rows The number of rows in the table.  Must be >= 1.
***REMOVED*** @param {number} columns The number of columns in the table.  Must be >= 1.
***REMOVED*** @param {boolean=} opt_fillWithNbsp If true, fills table entries with nsbps.
***REMOVED*** @return {!Element} The created table.
***REMOVED***
goog.dom.DomHelper.prototype.createTable = function(rows, columns,
    opt_fillWithNbsp) {
  return goog.dom.createTable_(this.document_, rows, columns,
      !!opt_fillWithNbsp);
***REMOVED***


***REMOVED***
***REMOVED*** Converts an HTML string into a node or a document fragment.  A single Node
***REMOVED*** is used if the {@code htmlString} only generates a single node.  If the
***REMOVED*** {@code htmlString} generates multiple nodes then these are put inside a
***REMOVED*** {@code DocumentFragment}.
***REMOVED***
***REMOVED*** @param {string} htmlString The HTML string to convert.
***REMOVED*** @return {!Node} The resulting node.
***REMOVED***
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(htmlString) {
  return goog.dom.htmlToDocumentFragment_(this.document_, htmlString);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the compatMode of the document.
***REMOVED*** @return {string} The result is either CSS1Compat or BackCompat.
***REMOVED*** @deprecated use goog.dom.DomHelper.prototype.isCss1CompatMode instead.
***REMOVED***
goog.dom.DomHelper.prototype.getCompatMode = function() {
  return this.isCss1CompatMode() ? 'CSS1Compat' : 'BackCompat';
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the browser is in "CSS1-compatible" (standards-compliant)
***REMOVED*** mode, false otherwise.
***REMOVED*** @return {boolean} True if in CSS1-compatible mode.
***REMOVED***
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the window object associated with the document.
***REMOVED*** @return {!Window} The window associated with the given document.
***REMOVED***
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the document scroll element.
***REMOVED*** @return {Element} Scrolling element.
***REMOVED***
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the document scroll distance as a coordinate object.
***REMOVED*** @return {!goog.math.Coordinate} Object with properties 'x' and 'y'.
***REMOVED***
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_);
***REMOVED***


***REMOVED***
***REMOVED*** Determines the active element in the given document.
***REMOVED*** @param {Document=} opt_doc The document to look in.
***REMOVED*** @return {Element} The active element.
***REMOVED***
goog.dom.DomHelper.prototype.getActiveElement = function(opt_doc) {
  return goog.dom.getActiveElement(opt_doc || this.document_);
***REMOVED***


***REMOVED***
***REMOVED*** Appends a child to a node.
***REMOVED*** @param {Node} parent Parent.
***REMOVED*** @param {Node} child Child.
***REMOVED***
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;


***REMOVED***
***REMOVED*** Appends a node with text or other nodes.
***REMOVED*** @param {!Node} parent The node to append nodes to.
***REMOVED*** @param {...goog.dom.Appendable} var_args The things to append to the node.
***REMOVED***     If this is a Node it is appended as is.
***REMOVED***     If this is a string then a text node is appended.
***REMOVED***     If this is an array like object then fields 0 to length - 1 are appended.
***REMOVED***
goog.dom.DomHelper.prototype.append = goog.dom.append;


***REMOVED***
***REMOVED*** Determines if the given node can contain children, intended to be used for
***REMOVED*** HTML generation.
***REMOVED***
***REMOVED*** @param {Node} node The node to check.
***REMOVED*** @return {boolean} Whether the node can contain children.
***REMOVED***
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;


***REMOVED***
***REMOVED*** Removes all the child nodes on a DOM node.
***REMOVED*** @param {Node} node Node to remove children from.
***REMOVED***
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;


***REMOVED***
***REMOVED*** Inserts a new node before an existing reference node (i.e., as the previous
***REMOVED*** sibling). If the reference node has no parent, then does nothing.
***REMOVED*** @param {Node} newNode Node to insert.
***REMOVED*** @param {Node} refNode Reference node to insert before.
***REMOVED***
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;


***REMOVED***
***REMOVED*** Inserts a new node after an existing reference node (i.e., as the next
***REMOVED*** sibling). If the reference node has no parent, then does nothing.
***REMOVED*** @param {Node} newNode Node to insert.
***REMOVED*** @param {Node} refNode Reference node to insert after.
***REMOVED***
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;


***REMOVED***
***REMOVED*** Insert a child at a given index. If index is larger than the number of child
***REMOVED*** nodes that the parent currently has, the node is inserted as the last child
***REMOVED*** node.
***REMOVED*** @param {Element} parent The element into which to insert the child.
***REMOVED*** @param {Node} child The element to insert.
***REMOVED*** @param {number} index The index at which to insert the new child node. Must
***REMOVED***     not be negative.
***REMOVED***
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;


***REMOVED***
***REMOVED*** Removes a node from its parent.
***REMOVED*** @param {Node} node The node to remove.
***REMOVED*** @return {Node} The node removed if removed; else, null.
***REMOVED***
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;


***REMOVED***
***REMOVED*** Replaces a node in the DOM tree. Will do nothing if {@code oldNode} has no
***REMOVED*** parent.
***REMOVED*** @param {Node} newNode Node to insert.
***REMOVED*** @param {Node} oldNode Node to replace.
***REMOVED***
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;


***REMOVED***
***REMOVED*** Flattens an element. That is, removes it and replace it with its children.
***REMOVED*** @param {Element} element The element to flatten.
***REMOVED*** @return {Element|undefined} The original element, detached from the document
***REMOVED***     tree, sans children, or undefined if the element was already not in the
***REMOVED***     document.
***REMOVED***
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;


***REMOVED***
***REMOVED*** Returns an array containing just the element children of the given element.
***REMOVED*** @param {Element} element The element whose element children we want.
***REMOVED*** @return {!(Array|NodeList)} An array or array-like list of just the element
***REMOVED***     children of the given element.
***REMOVED***
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;


***REMOVED***
***REMOVED*** Returns the first child node that is an element.
***REMOVED*** @param {Node} node The node to get the first child element of.
***REMOVED*** @return {Element} The first child node of {@code node} that is an element.
***REMOVED***
goog.dom.DomHelper.prototype.getFirstElementChild =
    goog.dom.getFirstElementChild;


***REMOVED***
***REMOVED*** Returns the last child node that is an element.
***REMOVED*** @param {Node} node The node to get the last child element of.
***REMOVED*** @return {Element} The last child node of {@code node} that is an element.
***REMOVED***
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;


***REMOVED***
***REMOVED*** Returns the first next sibling that is an element.
***REMOVED*** @param {Node} node The node to get the next sibling element of.
***REMOVED*** @return {Element} The next sibling of {@code node} that is an element.
***REMOVED***
goog.dom.DomHelper.prototype.getNextElementSibling =
    goog.dom.getNextElementSibling;


***REMOVED***
***REMOVED*** Returns the first previous sibling that is an element.
***REMOVED*** @param {Node} node The node to get the previous sibling element of.
***REMOVED*** @return {Element} The first previous sibling of {@code node} that is
***REMOVED***     an element.
***REMOVED***
goog.dom.DomHelper.prototype.getPreviousElementSibling =
    goog.dom.getPreviousElementSibling;


***REMOVED***
***REMOVED*** Returns the next node in source order from the given node.
***REMOVED*** @param {Node} node The node.
***REMOVED*** @return {Node} The next node in the DOM tree, or null if this was the last
***REMOVED***     node.
***REMOVED***
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;


***REMOVED***
***REMOVED*** Returns the previous node in source order from the given node.
***REMOVED*** @param {Node} node The node.
***REMOVED*** @return {Node} The previous node in the DOM tree, or null if this was the
***REMOVED***     first node.
***REMOVED***
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;


***REMOVED***
***REMOVED*** Whether the object looks like a DOM node.
***REMOVED*** @param {*} obj The object being tested for node likeness.
***REMOVED*** @return {boolean} Whether the object looks like a DOM node.
***REMOVED***
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;


***REMOVED***
***REMOVED*** Whether the object looks like an Element.
***REMOVED*** @param {*} obj The object being tested for Element likeness.
***REMOVED*** @return {boolean} Whether the object looks like an Element.
***REMOVED***
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;


***REMOVED***
***REMOVED*** Returns true if the specified value is a Window object. This includes the
***REMOVED*** global window for HTML pages, and iframe windows.
***REMOVED*** @param {*} obj Variable to test.
***REMOVED*** @return {boolean} Whether the variable is a window.
***REMOVED***
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;


***REMOVED***
***REMOVED*** Returns an element's parent, if it's an Element.
***REMOVED*** @param {Element} element The DOM element.
***REMOVED*** @return {Element} The parent, or null if not an Element.
***REMOVED***
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;


***REMOVED***
***REMOVED*** Whether a node contains another node.
***REMOVED*** @param {Node} parent The node that should contain the other node.
***REMOVED*** @param {Node} descendant The node to test presence of.
***REMOVED*** @return {boolean} Whether the parent node contains the descendent node.
***REMOVED***
goog.dom.DomHelper.prototype.contains = goog.dom.contains;


***REMOVED***
***REMOVED*** Compares the document order of two nodes, returning 0 if they are the same
***REMOVED*** node, a negative number if node1 is before node2, and a positive number if
***REMOVED*** node2 is before node1.  Note that we compare the order the tags appear in the
***REMOVED*** document so in the tree <b><i>text</i></b> the B node is considered to be
***REMOVED*** before the I node.
***REMOVED***
***REMOVED*** @param {Node} node1 The first node to compare.
***REMOVED*** @param {Node} node2 The second node to compare.
***REMOVED*** @return {number} 0 if the nodes are the same node, a negative number if node1
***REMOVED***     is before node2, and a positive number if node2 is before node1.
***REMOVED***
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;


***REMOVED***
***REMOVED*** Find the deepest common ancestor of the given nodes.
***REMOVED*** @param {...Node} var_args The nodes to find a common ancestor of.
***REMOVED*** @return {Node} The common ancestor of the nodes, or null if there is none.
***REMOVED***     null will only be returned if two or more of the nodes are from different
***REMOVED***     documents.
***REMOVED***
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;


***REMOVED***
***REMOVED*** Returns the owner document for a node.
***REMOVED*** @param {Node} node The node to get the document for.
***REMOVED*** @return {!Document} The document owning the node.
***REMOVED***
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;


***REMOVED***
***REMOVED*** Cross browser function for getting the document element of an iframe.
***REMOVED*** @param {Element} iframe Iframe element.
***REMOVED*** @return {!Document} The frame content document.
***REMOVED***
goog.dom.DomHelper.prototype.getFrameContentDocument =
    goog.dom.getFrameContentDocument;


***REMOVED***
***REMOVED*** Cross browser function for getting the window of a frame or iframe.
***REMOVED*** @param {Element} frame Frame element.
***REMOVED*** @return {Window} The window associated with the given frame.
***REMOVED***
goog.dom.DomHelper.prototype.getFrameContentWindow =
    goog.dom.getFrameContentWindow;


***REMOVED***
***REMOVED*** Cross browser function for setting the text content of an element.
***REMOVED*** @param {Element} element The element to change the text content of.
***REMOVED*** @param {string} text The string that should replace the current element
***REMOVED***     content with.
***REMOVED***
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;


***REMOVED***
***REMOVED*** Gets the outerHTML of a node, which islike innerHTML, except that it
***REMOVED*** actually contains the HTML of the node itself.
***REMOVED*** @param {Element} element The element to get the HTML of.
***REMOVED*** @return {string} The outerHTML of the given element.
***REMOVED***
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;


***REMOVED***
***REMOVED*** Finds the first descendant node that matches the filter function. This does
***REMOVED*** a depth first search.
***REMOVED*** @param {Node} root The root of the tree to search.
***REMOVED*** @param {function(Node) : boolean} p The filter function.
***REMOVED*** @return {Node|undefined} The found node or undefined if none is found.
***REMOVED***
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;


***REMOVED***
***REMOVED*** Finds all the descendant nodes that matches the filter function. This does a
***REMOVED*** depth first search.
***REMOVED*** @param {Node} root The root of the tree to search.
***REMOVED*** @param {function(Node) : boolean} p The filter function.
***REMOVED*** @return {Array.<Node>} The found nodes or an empty array if none are found.
***REMOVED***
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;


***REMOVED***
***REMOVED*** Returns true if the element has a tab index that allows it to receive
***REMOVED*** keyboard focus (tabIndex >= 0), false otherwise.  Note that form elements
***REMOVED*** natively support keyboard focus, even if they have no tab index.
***REMOVED*** @param {Element} element Element to check.
***REMOVED*** @return {boolean} Whether the element has a tab index that allows keyboard
***REMOVED***     focus.
***REMOVED***
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;


***REMOVED***
***REMOVED*** Enables or disables keyboard focus support on the element via its tab index.
***REMOVED*** Only elements for which {@link goog.dom.isFocusableTabIndex} returns true
***REMOVED*** (or elements that natively support keyboard focus, like form elements) can
***REMOVED*** receive keyboard focus.  See http://go/tabindex for more info.
***REMOVED*** @param {Element} element Element whose tab index is to be changed.
***REMOVED*** @param {boolean} enable Whether to set or remove a tab index on the element
***REMOVED***     that supports keyboard focus.
***REMOVED***
goog.dom.DomHelper.prototype.setFocusableTabIndex =
    goog.dom.setFocusableTabIndex;


***REMOVED***
***REMOVED*** Returns the text contents of the current node, without markup. New lines are
***REMOVED*** stripped and whitespace is collapsed, such that each character would be
***REMOVED*** visible.
***REMOVED***
***REMOVED*** In browsers that support it, innerText is used.  Other browsers attempt to
***REMOVED*** simulate it via node traversal.  Line breaks are canonicalized in IE.
***REMOVED***
***REMOVED*** @param {Node} node The node from which we are getting content.
***REMOVED*** @return {string} The text content.
***REMOVED***
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;


***REMOVED***
***REMOVED*** Returns the text length of the text contained in a node, without markup. This
***REMOVED*** is equivalent to the selection length if the node was selected, or the number
***REMOVED*** of cursor movements to traverse the node. Images & BRs take one space.  New
***REMOVED*** lines are ignored.
***REMOVED***
***REMOVED*** @param {Node} node The node whose text content length is being calculated.
***REMOVED*** @return {number} The length of {@code node}'s text content.
***REMOVED***
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;


***REMOVED***
***REMOVED*** Returns the text offset of a node relative to one of its ancestors. The text
***REMOVED*** length is the same as the length calculated by
***REMOVED*** {@code goog.dom.getNodeTextLength}.
***REMOVED***
***REMOVED*** @param {Node} node The node whose offset is being calculated.
***REMOVED*** @param {Node=} opt_offsetParent Defaults to the node's owner document's body.
***REMOVED*** @return {number} The text offset.
***REMOVED***
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;


***REMOVED***
***REMOVED*** Returns the node at a given offset in a parent node.  If an object is
***REMOVED*** provided for the optional third parameter, the node and the remainder of the
***REMOVED*** offset will stored as properties of this object.
***REMOVED*** @param {Node} parent The parent node.
***REMOVED*** @param {number} offset The offset into the parent node.
***REMOVED*** @param {Object=} opt_result Object to be used to store the return value. The
***REMOVED***     return value will be stored in the form {node: Node, remainder: number}
***REMOVED***     if this object is provided.
***REMOVED*** @return {Node} The node at the given offset.
***REMOVED***
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;


***REMOVED***
***REMOVED*** Returns true if the object is a {@code NodeList}.  To qualify as a NodeList,
***REMOVED*** the object must have a numeric length property and an item function (which
***REMOVED*** has type 'string' on IE for some reason).
***REMOVED*** @param {Object} val Object to test.
***REMOVED*** @return {boolean} Whether the object is a NodeList.
***REMOVED***
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;


***REMOVED***
***REMOVED*** Walks up the DOM hierarchy returning the first ancestor that has the passed
***REMOVED*** tag name and/or class name. If the passed element matches the specified
***REMOVED*** criteria, the element itself is returned.
***REMOVED*** @param {Node} element The DOM node to start with.
***REMOVED*** @param {?(goog.dom.TagName|string)=} opt_tag The tag name to match (or
***REMOVED***     null/undefined to match only based on class name).
***REMOVED*** @param {?string=} opt_class The class name to match (or null/undefined to
***REMOVED***     match only based on tag name).
***REMOVED*** @return {Element} The first ancestor that matches the passed criteria, or
***REMOVED***     null if no match is found.
***REMOVED***
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass =
    goog.dom.getAncestorByTagNameAndClass;


***REMOVED***
***REMOVED*** Walks up the DOM hierarchy returning the first ancestor that has the passed
***REMOVED*** class name. If the passed element matches the specified criteria, the
***REMOVED*** element itself is returned.
***REMOVED*** @param {Node} element The DOM node to start with.
***REMOVED*** @param {string} class The class name to match.
***REMOVED*** @return {Element} The first ancestor that matches the passed criteria, or
***REMOVED***     null if none match.
***REMOVED***
goog.dom.DomHelper.prototype.getAncestorByClass =
    goog.dom.getAncestorByClass;


***REMOVED***
***REMOVED*** Walks up the DOM hierarchy returning the first ancestor that passes the
***REMOVED*** matcher function.
***REMOVED*** @param {Node} element The DOM node to start with.
***REMOVED*** @param {function(Node) : boolean} matcher A function that returns true if the
***REMOVED***     passed node matches the desired criteria.
***REMOVED*** @param {boolean=} opt_includeNode If true, the node itself is included in
***REMOVED***     the search (the first call to the matcher will pass startElement as
***REMOVED***     the node to test).
***REMOVED*** @param {number=} opt_maxSearchSteps Maximum number of levels to search up the
***REMOVED***     dom.
***REMOVED*** @return {Node} DOM node that matched the matcher, or null if there was
***REMOVED***     no match.
***REMOVED***
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
