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
***REMOVED*** @fileoverview Utilities for element styles.
***REMOVED***
***REMOVED*** @see ../demos/inline_block_quirks.html
***REMOVED*** @see ../demos/inline_block_standards.html
***REMOVED*** @see ../demos/style_viewport.html
***REMOVED***

goog.provide('goog.style');


goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.vendor');
goog.require('goog.math.Box');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Rect');
goog.require('goog.math.Size');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Sets a style value on an element.
***REMOVED***
***REMOVED*** This function is not indended to patch issues in the browser's style
***REMOVED*** handling, but to allow easy programmatic access to setting dash-separated
***REMOVED*** style properties.  An example is setting a batch of properties from a data
***REMOVED*** object without overwriting old styles.  When possible, use native APIs:
***REMOVED*** elem.style.propertyKey = 'value' or (if obliterating old styles is fine)
***REMOVED*** elem.style.cssText = 'property1: value1; property2: value2'.
***REMOVED***
***REMOVED*** @param {Element} element The element to change.
***REMOVED*** @param {string|Object} style If a string, a style name. If an object, a hash
***REMOVED***     of style names to style values.
***REMOVED*** @param {string|number|boolean=} opt_value If style was a string, then this
***REMOVED***     should be the value.
***REMOVED***
goog.style.setStyle = function(element, style, opt_value) {
  if (goog.isString(style)) {
    goog.style.setStyle_(element, opt_value, style);
  } else {
    goog.object.forEach(style, goog.partial(goog.style.setStyle_, element));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets a style value on an element, with parameters swapped to work with
***REMOVED*** {@code goog.object.forEach()}. Prepends a vendor-specific prefix when
***REMOVED*** necessary.
***REMOVED*** @param {Element} element The element to change.
***REMOVED*** @param {string|number|boolean|undefined} value Style value.
***REMOVED*** @param {string} style Style name.
***REMOVED*** @private
***REMOVED***
goog.style.setStyle_ = function(element, value, style) {
  var propertyName = goog.style.getVendorJsStyleName_(element, style);

  if (propertyName) {
    element.style[propertyName] = value;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the style property name in camel-case. If it does not exist and a
***REMOVED*** vendor-specific version of the property does exist, then return the vendor-
***REMOVED*** specific property name instead.
***REMOVED*** @param {Element} element The element to change.
***REMOVED*** @param {string} style Style name.
***REMOVED*** @return {string} Vendor-specific style.
***REMOVED*** @private
***REMOVED***
goog.style.getVendorJsStyleName_ = function(element, style) {
  var camelStyle = goog.string.toCamelCase(style);

  if (element.style[camelStyle] === undefined) {
    var prefixedStyle = goog.dom.vendor.getVendorJsPrefix() +
        goog.string.toTitleCase(style);

    if (element.style[prefixedStyle] !== undefined) {
      return prefixedStyle;
    }
  }

  return camelStyle;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the style property name in CSS notation. If it does not exist and a
***REMOVED*** vendor-specific version of the property does exist, then return the vendor-
***REMOVED*** specific property name instead.
***REMOVED*** @param {Element} element The element to change.
***REMOVED*** @param {string} style Style name.
***REMOVED*** @return {string} Vendor-specific style.
***REMOVED*** @private
***REMOVED***
goog.style.getVendorStyleName_ = function(element, style) {
  var camelStyle = goog.string.toCamelCase(style);

  if (element.style[camelStyle] === undefined) {
    var prefixedStyle = goog.dom.vendor.getVendorJsPrefix() +
        goog.string.toTitleCase(style);

    if (element.style[prefixedStyle] !== undefined) {
      return goog.dom.vendor.getVendorPrefix() + '-' + style;
    }
  }

  return style;
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves an explicitly-set style value of a node. This returns '' if there
***REMOVED*** isn't a style attribute on the element or if this style property has not been
***REMOVED*** explicitly set in script.
***REMOVED***
***REMOVED*** @param {Element} element Element to get style of.
***REMOVED*** @param {string} property Property to get, css-style (if you have a camel-case
***REMOVED*** property, use element.style[style]).
***REMOVED*** @return {string} Style value.
***REMOVED***
goog.style.getStyle = function(element, property) {
  // element.style is '' for well-known properties which are unset.
  // For for browser specific styles as 'filter' is undefined
  // so we need to return '' explicitly to make it consistent across
  // browsers.
  var styleValue = element.style[goog.string.toCamelCase(property)];

  // Using typeof here because of a bug in Safari 5.1, where this value
  // was undefined, but === undefined returned false.
  if (typeof(styleValue) !== 'undefined') {
    return styleValue;
  }

  return element.style[goog.style.getVendorJsStyleName_(element, property)] ||
      '';
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves a computed style value of a node. It returns empty string if the
***REMOVED*** value cannot be computed (which will be the case in Internet Explorer) or
***REMOVED*** "none" if the property requested is an SVG one and it has not been
***REMOVED*** explicitly set (firefox and webkit).
***REMOVED***
***REMOVED*** @param {Element} element Element to get style of.
***REMOVED*** @param {string} property Property to get (camel-case).
***REMOVED*** @return {string} Style value.
***REMOVED***
goog.style.getComputedStyle = function(element, property) {
  var doc = goog.dom.getOwnerDocument(element);
  if (doc.defaultView && doc.defaultView.getComputedStyle) {
    var styles = doc.defaultView.getComputedStyle(element, null);
    if (styles) {
      // element.style[..] is undefined for browser specific styles
      // as 'filter'.
      return styles[property] || styles.getPropertyValue(property) || '';
    }
  }

  return '';
***REMOVED***


***REMOVED***
***REMOVED*** Gets the cascaded style value of a node, or null if the value cannot be
***REMOVED*** computed (only Internet Explorer can do this).
***REMOVED***
***REMOVED*** @param {Element} element Element to get style of.
***REMOVED*** @param {string} style Property to get (camel-case).
***REMOVED*** @return {string} Style value.
***REMOVED***
goog.style.getCascadedStyle = function(element, style) {
  // TODO(nicksantos): This should be documented to return null. #fixTypes
  return element.currentStyle ? element.currentStyle[style] : null;
***REMOVED***


***REMOVED***
***REMOVED*** Cross-browser pseudo get computed style. It returns the computed style where
***REMOVED*** available. If not available it tries the cascaded style value (IE
***REMOVED*** currentStyle) and in worst case the inline style value.  It shouldn't be
***REMOVED*** called directly, see http://wiki/Main/ComputedStyleVsCascadedStyle for
***REMOVED*** discussion.
***REMOVED***
***REMOVED*** @param {Element} element Element to get style of.
***REMOVED*** @param {string} style Property to get (must be camelCase, not css-style.).
***REMOVED*** @return {string} Style value.
***REMOVED*** @private
***REMOVED***
goog.style.getStyle_ = function(element, style) {
  return goog.style.getComputedStyle(element, style) ||
         goog.style.getCascadedStyle(element, style) ||
         (element.style && element.style[style]);
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the computed value of the position CSS attribute.
***REMOVED*** @param {Element} element The element to get the position of.
***REMOVED*** @return {string} Position value.
***REMOVED***
goog.style.getComputedPosition = function(element) {
  return goog.style.getStyle_(element, 'position');
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the computed background color string for a given element. The
***REMOVED*** string returned is suitable for assigning to another element's
***REMOVED*** background-color, but is not guaranteed to be in any particular string
***REMOVED*** format. Accessing the color in a numeric form may not be possible in all
***REMOVED*** browsers or with all input.
***REMOVED***
***REMOVED*** If the background color for the element is defined as a hexadecimal value,
***REMOVED*** the resulting string can be parsed by goog.color.parse in all supported
***REMOVED*** browsers.
***REMOVED***
***REMOVED*** Whether named colors like "red" or "lightblue" get translated into a
***REMOVED*** format which can be parsed is browser dependent. Calling this function on
***REMOVED*** transparent elements will return "transparent" in most browsers or
***REMOVED*** "rgba(0, 0, 0, 0)" in WebKit.
***REMOVED*** @param {Element} element The element to get the background color of.
***REMOVED*** @return {string} The computed string value of the background color.
***REMOVED***
goog.style.getBackgroundColor = function(element) {
  return goog.style.getStyle_(element, 'backgroundColor');
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the computed value of the overflow-x CSS attribute.
***REMOVED*** @param {Element} element The element to get the overflow-x of.
***REMOVED*** @return {string} The computed string value of the overflow-x attribute.
***REMOVED***
goog.style.getComputedOverflowX = function(element) {
  return goog.style.getStyle_(element, 'overflowX');
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the computed value of the overflow-y CSS attribute.
***REMOVED*** @param {Element} element The element to get the overflow-y of.
***REMOVED*** @return {string} The computed string value of the overflow-y attribute.
***REMOVED***
goog.style.getComputedOverflowY = function(element) {
  return goog.style.getStyle_(element, 'overflowY');
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the computed value of the z-index CSS attribute.
***REMOVED*** @param {Element} element The element to get the z-index of.
***REMOVED*** @return {string|number} The computed value of the z-index attribute.
***REMOVED***
goog.style.getComputedZIndex = function(element) {
  return goog.style.getStyle_(element, 'zIndex');
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the computed value of the text-align CSS attribute.
***REMOVED*** @param {Element} element The element to get the text-align of.
***REMOVED*** @return {string} The computed string value of the text-align attribute.
***REMOVED***
goog.style.getComputedTextAlign = function(element) {
  return goog.style.getStyle_(element, 'textAlign');
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the computed value of the cursor CSS attribute.
***REMOVED*** @param {Element} element The element to get the cursor of.
***REMOVED*** @return {string} The computed string value of the cursor attribute.
***REMOVED***
goog.style.getComputedCursor = function(element) {
  return goog.style.getStyle_(element, 'cursor');
***REMOVED***


***REMOVED***
***REMOVED*** Sets the top/left values of an element.  If no unit is specified in the
***REMOVED*** argument then it will add px. The second argument is required if the first
***REMOVED*** argument is a string or number and is ignored if the first argument
***REMOVED*** is a coordinate.
***REMOVED*** @param {Element} el Element to move.
***REMOVED*** @param {string|number|goog.math.Coordinate} arg1 Left position or coordinate.
***REMOVED*** @param {string|number=} opt_arg2 Top position.
***REMOVED***
goog.style.setPosition = function(el, arg1, opt_arg2) {
  var x, y;
  var buggyGeckoSubPixelPos = goog.userAgent.GECKO &&
      (goog.userAgent.MAC || goog.userAgent.X11) &&
      goog.userAgent.isVersion('1.9');

  if (arg1 instanceof goog.math.Coordinate) {
    x = arg1.x;
    y = arg1.y;
  } else {
    x = arg1;
    y = opt_arg2;
  }

  // Round to the nearest pixel for buggy sub-pixel support.
  el.style.left = goog.style.getPixelStyleValue_(
     ***REMOVED*****REMOVED*** @type {number|string}***REMOVED*** (x), buggyGeckoSubPixelPos);
  el.style.top = goog.style.getPixelStyleValue_(
     ***REMOVED*****REMOVED*** @type {number|string}***REMOVED*** (y), buggyGeckoSubPixelPos);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the offsetLeft and offsetTop properties of an element and returns them
***REMOVED*** in a Coordinate object
***REMOVED*** @param {Element} element Element.
***REMOVED*** @return {!goog.math.Coordinate} The position.
***REMOVED***
goog.style.getPosition = function(element) {
  return new goog.math.Coordinate(element.offsetLeft, element.offsetTop);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the viewport element for a particular document
***REMOVED*** @param {Node=} opt_node DOM node (Document is OK) to get the viewport element
***REMOVED***     of.
***REMOVED*** @return {Element} document.documentElement or document.body.
***REMOVED***
goog.style.getClientViewportElement = function(opt_node) {
  var doc;
  if (opt_node) {
    doc = goog.dom.getOwnerDocument(opt_node);
  } else {
    doc = goog.dom.getDocument();
  }

  // In old IE versions the document.body represented the viewport
  if (goog.userAgent.IE && !goog.userAgent.isDocumentMode(9) &&
      !goog.dom.getDomHelper(doc).isCss1CompatMode()) {
    return doc.body;
  }
  return doc.documentElement;
***REMOVED***


***REMOVED***
***REMOVED*** Calculates the viewport coordinates relative to the page/document
***REMOVED*** containing the node. The viewport may be the browser viewport for
***REMOVED*** non-iframe document, or the iframe container for iframe'd document.
***REMOVED*** @param {!Document} doc The document to use as the reference point.
***REMOVED*** @return {!goog.math.Coordinate} The page offset of the viewport.
***REMOVED***
goog.style.getViewportPageOffset = function(doc) {
  var body = doc.body;
  var documentElement = doc.documentElement;
  var scrollLeft = body.scrollLeft || documentElement.scrollLeft;
  var scrollTop = body.scrollTop || documentElement.scrollTop;
  return new goog.math.Coordinate(scrollLeft, scrollTop);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the client rectangle of the DOM element.
***REMOVED***
***REMOVED*** getBoundingClientRect is part of a new CSS object model draft (with a
***REMOVED*** long-time presence in IE), replacing the error-prone parent offset
***REMOVED*** computation and the now-deprecated Gecko getBoxObjectFor.
***REMOVED***
***REMOVED*** This utility patches common browser bugs in getBoundingClientRect. It
***REMOVED*** will fail if getBoundingClientRect is unsupported.
***REMOVED***
***REMOVED*** If the element is not in the DOM, the result is undefined, and an error may
***REMOVED*** be thrown depending on user agent.
***REMOVED***
***REMOVED*** @param {!Element} el The element whose bounding rectangle is being queried.
***REMOVED*** @return {Object} A native bounding rectangle with numerical left, top,
***REMOVED***     right, and bottom.  Reported by Firefox to be of object type ClientRect.
***REMOVED*** @private
***REMOVED***
goog.style.getBoundingClientRect_ = function(el) {
  var rect = el.getBoundingClientRect();
  // Patch the result in IE only, so that this function can be inlined if
  // compiled for non-IE.
  if (goog.userAgent.IE) {

    // In IE, most of the time, 2 extra pixels are added to the top and left
    // due to the implicit 2-pixel inset border.  In IE6/7 quirks mode and
    // IE6 standards mode, this border can be overridden by setting the
    // document element's border to zero -- thus, we cannot rely on the
    // offset always being 2 pixels.

    // In quirks mode, the offset can be determined by querying the body's
    // clientLeft/clientTop, but in standards mode, it is found by querying
    // the document element's clientLeft/clientTop.  Since we already called
    // getBoundingClientRect we have already forced a reflow, so it is not
    // too expensive just to query them all.

    // See: http://msdn.microsoft.com/en-us/library/ms536433(VS.85).aspx
    var doc = el.ownerDocument;
    rect.left -= doc.documentElement.clientLeft + doc.body.clientLeft;
    rect.top -= doc.documentElement.clientTop + doc.body.clientTop;
  }
  return***REMOVED*****REMOVED*** @type {Object}***REMOVED*** (rect);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the first parent that could affect the position of a given element.
***REMOVED*** @param {Element} element The element to get the offset parent for.
***REMOVED*** @return {Element} The first offset parent or null if one cannot be found.
***REMOVED***
goog.style.getOffsetParent = function(element) {
  // element.offsetParent does the right thing in IE7 and below.  In other
  // browsers it only includes elements with position absolute, relative or
  // fixed, not elements with overflow set to auto or scroll.
  if (goog.userAgent.IE && !goog.userAgent.isDocumentMode(8)) {
    return element.offsetParent;
  }

  var doc = goog.dom.getOwnerDocument(element);
  var positionStyle = goog.style.getStyle_(element, 'position');
  var skipStatic = positionStyle == 'fixed' || positionStyle == 'absolute';
  for (var parent = element.parentNode; parent && parent != doc;
       parent = parent.parentNode) {
    positionStyle =
        goog.style.getStyle_(***REMOVED*** @type {!Element}***REMOVED*** (parent), 'position');
    skipStatic = skipStatic && positionStyle == 'static' &&
                 parent != doc.documentElement && parent != doc.body;
    if (!skipStatic && (parent.scrollWidth > parent.clientWidth ||
                        parent.scrollHeight > parent.clientHeight ||
                        positionStyle == 'fixed' ||
                        positionStyle == 'absolute' ||
                        positionStyle == 'relative')) {
      return***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (parent);
    }
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Calculates and returns the visible rectangle for a given element. Returns a
***REMOVED*** box describing the visible portion of the nearest scrollable offset ancestor.
***REMOVED*** Coordinates are given relative to the document.
***REMOVED***
***REMOVED*** @param {Element} element Element to get the visible rect for.
***REMOVED*** @return {goog.math.Box} Bounding elementBox describing the visible rect or
***REMOVED***     null if scrollable ancestor isn't inside the visible viewport.
***REMOVED***
goog.style.getVisibleRectForElement = function(element) {
  var visibleRect = new goog.math.Box(0, Infinity, Infinity, 0);
  var dom = goog.dom.getDomHelper(element);
  var body = dom.getDocument().body;
  var documentElement = dom.getDocument().documentElement;
  var scrollEl = dom.getDocumentScrollElement();

  // Determine the size of the visible rect by climbing the dom accounting for
  // all scrollable containers.
  for (var el = element; el = goog.style.getOffsetParent(el); ) {
    // clientWidth is zero for inline block elements in IE.
    // on WEBKIT, body element can have clientHeight = 0 and scrollHeight > 0
    if ((!goog.userAgent.IE || el.clientWidth != 0) &&
        (!goog.userAgent.WEBKIT || el.clientHeight != 0 || el != body) &&
        // body may have overflow set on it, yet we still get the entire
        // viewport. In some browsers, el.offsetParent may be
        // document.documentElement, so check for that too.
        (el != body && el != documentElement &&
            goog.style.getStyle_(el, 'overflow') != 'visible')) {
      var pos = goog.style.getPageOffset(el);
      var client = goog.style.getClientLeftTop(el);
      pos.x += client.x;
      pos.y += client.y;

      visibleRect.top = Math.max(visibleRect.top, pos.y);
      visibleRect.right = Math.min(visibleRect.right,
                                   pos.x + el.clientWidth);
      visibleRect.bottom = Math.min(visibleRect.bottom,
                                    pos.y + el.clientHeight);
      visibleRect.left = Math.max(visibleRect.left, pos.x);
    }
  }

  // Clip by window's viewport.
  var scrollX = scrollEl.scrollLeft, scrollY = scrollEl.scrollTop;
  visibleRect.left = Math.max(visibleRect.left, scrollX);
  visibleRect.top = Math.max(visibleRect.top, scrollY);
  var winSize = dom.getViewportSize();
  visibleRect.right = Math.min(visibleRect.right, scrollX + winSize.width);
  visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + winSize.height);
  return visibleRect.top >= 0 && visibleRect.left >= 0 &&
         visibleRect.bottom > visibleRect.top &&
         visibleRect.right > visibleRect.left ?
         visibleRect : null;
***REMOVED***


***REMOVED***
***REMOVED*** Calculate the scroll position of {@code container} with the minimum amount so
***REMOVED*** that the content and the borders of the given {@code element} become visible.
***REMOVED*** If the element is bigger than the container, its top left corner will be
***REMOVED*** aligned as close to the container's top left corner as possible.
***REMOVED***
***REMOVED*** @param {Element} element The element to make visible.
***REMOVED*** @param {Element} container The container to scroll.
***REMOVED*** @param {boolean=} opt_center Whether to center the element in the container.
***REMOVED***     Defaults to false.
***REMOVED*** @return {!goog.math.Coordinate} The new scroll position of the container,
***REMOVED***     in form of goog.math.Coordinate(scrollLeft, scrollTop).
***REMOVED***
goog.style.getContainerOffsetToScrollInto =
    function(element, container, opt_center) {
  // Absolute position of the element's border's top left corner.
  var elementPos = goog.style.getPageOffset(element);
  // Absolute position of the container's border's top left corner.
  var containerPos = goog.style.getPageOffset(container);
  var containerBorder = goog.style.getBorderBox(container);
  // Relative pos. of the element's border box to the container's content box.
  var relX = elementPos.x - containerPos.x - containerBorder.left;
  var relY = elementPos.y - containerPos.y - containerBorder.top;
  // How much the element can move in the container, i.e. the difference between
  // the element's bottom-right-most and top-left-most position where it's
  // fully visible.
  var spaceX = container.clientWidth - element.offsetWidth;
  var spaceY = container.clientHeight - element.offsetHeight;

  var scrollLeft = container.scrollLeft;
  var scrollTop = container.scrollTop;
  if (opt_center) {
    // All browsers round non-integer scroll positions down.
    scrollLeft += relX - spaceX / 2;
    scrollTop += relY - spaceY / 2;
  } else {
    // This formula was designed to give the correct scroll values in the
    // following cases:
    // - element is higher than container (spaceY < 0) => scroll down by relY
    // - element is not higher that container (spaceY >= 0):
    //   - it is above container (relY < 0) => scroll up by abs(relY)
    //   - it is below container (relY > spaceY) => scroll down by relY - spaceY
    //   - it is in the container => don't scroll
    scrollLeft += Math.min(relX, Math.max(relX - spaceX, 0));
    scrollTop += Math.min(relY, Math.max(relY - spaceY, 0));
  }
  return new goog.math.Coordinate(scrollLeft, scrollTop);
***REMOVED***


***REMOVED***
***REMOVED*** Changes the scroll position of {@code container} with the minimum amount so
***REMOVED*** that the content and the borders of the given {@code element} become visible.
***REMOVED*** If the element is bigger than the container, its top left corner will be
***REMOVED*** aligned as close to the container's top left corner as possible.
***REMOVED***
***REMOVED*** @param {Element} element The element to make visible.
***REMOVED*** @param {Element} container The container to scroll.
***REMOVED*** @param {boolean=} opt_center Whether to center the element in the container.
***REMOVED***     Defaults to false.
***REMOVED***
goog.style.scrollIntoContainerView = function(element, container, opt_center) {
  var offset =
      goog.style.getContainerOffsetToScrollInto(element, container, opt_center);
  container.scrollLeft = offset.x;
  container.scrollTop = offset.y;
***REMOVED***


***REMOVED***
***REMOVED*** Returns clientLeft (width of the left border and, if the directionality is
***REMOVED*** right to left, the vertical scrollbar) and clientTop as a coordinate object.
***REMOVED***
***REMOVED*** @param {Element} el Element to get clientLeft for.
***REMOVED*** @return {!goog.math.Coordinate} Client left and top.
***REMOVED***
goog.style.getClientLeftTop = function(el) {
  // NOTE(eae): Gecko prior to 1.9 doesn't support clientTop/Left, see
  // https://bugzilla.mozilla.org/show_bug.cgi?id=111207
  if (goog.userAgent.GECKO && !goog.userAgent.isVersion('1.9')) {
    var left = parseFloat(goog.style.getComputedStyle(el, 'borderLeftWidth'));
    if (goog.style.isRightToLeft(el)) {
      var scrollbarWidth = el.offsetWidth - el.clientWidth - left -
          parseFloat(goog.style.getComputedStyle(el, 'borderRightWidth'));
      left += scrollbarWidth;
    }
    return new goog.math.Coordinate(left,
        parseFloat(goog.style.getComputedStyle(el, 'borderTopWidth')));
  }

  return new goog.math.Coordinate(el.clientLeft, el.clientTop);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a Coordinate object relative to the top-left of the HTML document.
***REMOVED*** Implemented as a single function to save having to do two recursive loops in
***REMOVED*** opera and safari just to get both coordinates.  If you just want one value do
***REMOVED*** use goog.style.getPageOffsetLeft() and goog.style.getPageOffsetTop(), but
***REMOVED*** note if you call both those methods the tree will be analysed twice.
***REMOVED***
***REMOVED*** @param {Element} el Element to get the page offset for.
***REMOVED*** @return {!goog.math.Coordinate} The page offset.
***REMOVED***
goog.style.getPageOffset = function(el) {
  var box, doc = goog.dom.getOwnerDocument(el);
  var positionStyle = goog.style.getStyle_(el, 'position');
  // TODO(gboyer): Update the jsdoc in a way that doesn't break the universe.
  goog.asserts.assertObject(el, 'Parameter is required');

  // NOTE(eae): Gecko pre 1.9 normally use getBoxObjectFor to calculate the
  // position. When invoked for an element with position absolute and a negative
  // position though it can be off by one. Therefor the recursive implementation
  // is used in those (relatively rare) cases.
  var BUGGY_GECKO_BOX_OBJECT = goog.userAgent.GECKO && doc.getBoxObjectFor &&
      !el.getBoundingClientRect && positionStyle == 'absolute' &&
      (box = doc.getBoxObjectFor(el)) && (box.screenX < 0 || box.screenY < 0);

  // NOTE(arv): If element is hidden (display none or disconnected or any the
  // ancestors are hidden) we get (0,0) by default but we still do the
  // accumulation of scroll position.

  // TODO(arv): Should we check if the node is disconnected and in that case
  //            return (0,0)?

  var pos = new goog.math.Coordinate(0, 0);
  var viewportElement = goog.style.getClientViewportElement(doc);
  if (el == viewportElement) {
    // viewport is always at 0,0 as that defined the coordinate system for this
    // function - this avoids special case checks in the code below
    return pos;
  }

  // IE, Gecko 1.9+, and most modern WebKit.
  if (el.getBoundingClientRect) {
    box = goog.style.getBoundingClientRect_(el);
    // Must add the scroll coordinates in to get the absolute page offset
    // of element since getBoundingClientRect returns relative coordinates to
    // the viewport.
    var scrollCoord = goog.dom.getDomHelper(doc).getDocumentScroll();
    pos.x = box.left + scrollCoord.x;
    pos.y = box.top + scrollCoord.y;

  // Gecko prior to 1.9.
  } else if (doc.getBoxObjectFor && !BUGGY_GECKO_BOX_OBJECT) {
    // Gecko ignores the scroll values for ancestors, up to 1.9.  See:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=328881 and
    // https://bugzilla.mozilla.org/show_bug.cgi?id=330619

    box = doc.getBoxObjectFor(el);
    // TODO(user): Fix the off-by-one error when window is scrolled down
    // or right more than 1 pixel. The viewport offset does not move in lock
    // step with the window scroll; it moves in increments of 2px and at
    // somewhat random intervals.
    var vpBox = doc.getBoxObjectFor(viewportElement);
    pos.x = box.screenX - vpBox.screenX;
    pos.y = box.screenY - vpBox.screenY;

  // Safari, Opera and Camino up to 1.0.4.
  } else {
    var parent = el;
    do {
      pos.x += parent.offsetLeft;
      pos.y += parent.offsetTop;
      // For safari/chrome, we need to add parent's clientLeft/Top as well.
      if (parent != el) {
        pos.x += parent.clientLeft || 0;
        pos.y += parent.clientTop || 0;
      }
      // In Safari when hit a position fixed element the rest of the offsets
      // are not correct.
      if (goog.userAgent.WEBKIT &&
          goog.style.getComputedPosition(parent) == 'fixed') {
        pos.x += doc.body.scrollLeft;
        pos.y += doc.body.scrollTop;
        break;
      }
      parent = parent.offsetParent;
    } while (parent && parent != el);

    // Opera & (safari absolute) incorrectly account for body offsetTop.
    if (goog.userAgent.OPERA || (goog.userAgent.WEBKIT &&
        positionStyle == 'absolute')) {
      pos.y -= doc.body.offsetTop;
    }

    for (parent = el; (parent = goog.style.getOffsetParent(parent)) &&
        parent != doc.body && parent != viewportElement; ) {
      pos.x -= parent.scrollLeft;
      // Workaround for a bug in Opera 9.2 (and earlier) where table rows may
      // report an invalid scroll top value. The bug was fixed in Opera 9.5
      // however as that version supports getBoundingClientRect it won't
      // trigger this code path. https://bugs.opera.com/show_bug.cgi?id=249965
      if (!goog.userAgent.OPERA || parent.tagName != 'TR') {
        pos.y -= parent.scrollTop;
      }
    }
  }

  return pos;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the left coordinate of an element relative to the HTML document
***REMOVED*** @param {Element} el Elements.
***REMOVED*** @return {number} The left coordinate.
***REMOVED***
goog.style.getPageOffsetLeft = function(el) {
  return goog.style.getPageOffset(el).x;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the top coordinate of an element relative to the HTML document
***REMOVED*** @param {Element} el Elements.
***REMOVED*** @return {number} The top coordinate.
***REMOVED***
goog.style.getPageOffsetTop = function(el) {
  return goog.style.getPageOffset(el).y;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a Coordinate object relative to the top-left of an HTML document
***REMOVED*** in an ancestor frame of this element. Used for measuring the position of
***REMOVED*** an element inside a frame relative to a containing frame.
***REMOVED***
***REMOVED*** @param {Element} el Element to get the page offset for.
***REMOVED*** @param {Window} relativeWin The window to measure relative to. If relativeWin
***REMOVED***     is not in the ancestor frame chain of the element, we measure relative to
***REMOVED***     the top-most window.
***REMOVED*** @return {!goog.math.Coordinate} The page offset.
***REMOVED***
goog.style.getFramedPageOffset = function(el, relativeWin) {
  var position = new goog.math.Coordinate(0, 0);

  // Iterate up the ancestor frame chain, keeping track of the current window
  // and the current element in that window.
  var currentWin = goog.dom.getWindow(goog.dom.getOwnerDocument(el));
  var currentEl = el;
  do {
    // if we're at the top window, we want to get the page offset.
    // if we're at an inner frame, we only want to get the window position
    // so that we can determine the actual page offset in the context of
    // the outer window.
    var offset = currentWin == relativeWin ?
        goog.style.getPageOffset(currentEl) :
        goog.style.getClientPosition(currentEl);

    position.x += offset.x;
    position.y += offset.y;
  } while (currentWin && currentWin != relativeWin &&
      (currentEl = currentWin.frameElement) &&
      (currentWin = currentWin.parent));

  return position;
***REMOVED***


***REMOVED***
***REMOVED*** Translates the specified rect relative to origBase page, for newBase page.
***REMOVED*** If origBase and newBase are the same, this function does nothing.
***REMOVED***
***REMOVED*** @param {goog.math.Rect} rect The source rectangle relative to origBase page,
***REMOVED***     and it will have the translated result.
***REMOVED*** @param {goog.dom.DomHelper} origBase The DomHelper for the input rectangle.
***REMOVED*** @param {goog.dom.DomHelper} newBase The DomHelper for the resultant
***REMOVED***     coordinate.  This must be a DOM for an ancestor frame of origBase
***REMOVED***     or the same as origBase.
***REMOVED***
goog.style.translateRectForAnotherFrame = function(rect, origBase, newBase) {
  if (origBase.getDocument() != newBase.getDocument()) {
    var body = origBase.getDocument().body;
    var pos = goog.style.getFramedPageOffset(body, newBase.getWindow());

    // Adjust Body's margin.
    pos = goog.math.Coordinate.difference(pos, goog.style.getPageOffset(body));

    if (goog.userAgent.IE && !origBase.isCss1CompatMode()) {
      pos = goog.math.Coordinate.difference(pos, origBase.getDocumentScroll());
    }

    rect.left += pos.x;
    rect.top += pos.y;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the position of an element relative to another element in the
***REMOVED*** document.  A relative to B
***REMOVED*** @param {Element|Event|goog.events.Event} a Element or mouse event whose
***REMOVED***     position we're calculating.
***REMOVED*** @param {Element|Event|goog.events.Event} b Element or mouse event position
***REMOVED***     is relative to.
***REMOVED*** @return {!goog.math.Coordinate} The relative position.
***REMOVED***
goog.style.getRelativePosition = function(a, b) {
  var ap = goog.style.getClientPosition(a);
  var bp = goog.style.getClientPosition(b);
  return new goog.math.Coordinate(ap.x - bp.x, ap.y - bp.y);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the position of the event or the element's border box relative to
***REMOVED*** the client viewport.
***REMOVED*** @param {Element|Event|goog.events.Event} el Element or a mouse / touch event.
***REMOVED*** @return {!goog.math.Coordinate} The position.
***REMOVED***
goog.style.getClientPosition = function(el) {
  var pos = new goog.math.Coordinate;
  if (el.nodeType == goog.dom.NodeType.ELEMENT) {
    el =***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (el);
    if (el.getBoundingClientRect) {
      // IE, Gecko 1.9+, and most modern WebKit
      var box = goog.style.getBoundingClientRect_(el);
      pos.x = box.left;
      pos.y = box.top;
    } else {
      var scrollCoord = goog.dom.getDomHelper(el).getDocumentScroll();
      var pageCoord = goog.style.getPageOffset(el);
      pos.x = pageCoord.x - scrollCoord.x;
      pos.y = pageCoord.y - scrollCoord.y;
    }
    if (goog.userAgent.GECKO && !goog.userAgent.isVersion(12)) {
      pos = goog.math.Coordinate.sum(pos, goog.style.getCssTranslation(el));
    }
  } else {
    var isAbstractedEvent = goog.isFunction(el.getBrowserEvent);
    var targetEvent = el;

    if (el.targetTouches) {
      targetEvent = el.targetTouches[0];
    } else if (isAbstractedEvent && el.getBrowserEvent().targetTouches) {
      targetEvent = el.getBrowserEvent().targetTouches[0];
    }

    pos.x = targetEvent.clientX;
    pos.y = targetEvent.clientY;
  }

  return pos;
***REMOVED***


***REMOVED***
***REMOVED*** Moves an element to the given coordinates relative to the client viewport.
***REMOVED*** @param {Element} el Absolutely positioned element to set page offset for.
***REMOVED***     It must be in the document.
***REMOVED*** @param {number|goog.math.Coordinate} x Left position of the element's margin
***REMOVED***     box or a coordinate object.
***REMOVED*** @param {number=} opt_y Top position of the element's margin box.
***REMOVED***
goog.style.setPageOffset = function(el, x, opt_y) {
  // Get current pageoffset
  var cur = goog.style.getPageOffset(el);

  if (x instanceof goog.math.Coordinate) {
    opt_y = x.y;
    x = x.x;
  }

  // NOTE(arv): We cannot allow strings for x and y. We could but that would
  // require us to manually transform between different units

  // Work out deltas
  var dx = x - cur.x;
  var dy = opt_y - cur.y;

  // Set position to current left/top + delta
  goog.style.setPosition(el, el.offsetLeft + dx, el.offsetTop + dy);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the width/height values of an element.  If an argument is numeric,
***REMOVED*** or a goog.math.Size is passed, it is assumed to be pixels and will add
***REMOVED*** 'px' after converting it to an integer in string form. (This just sets the
***REMOVED*** CSS width and height properties so it might set content-box or border-box
***REMOVED*** size depending on the box model the browser is using.)
***REMOVED***
***REMOVED*** @param {Element} element Element to set the size of.
***REMOVED*** @param {string|number|goog.math.Size} w Width of the element, or a
***REMOVED***     size object.
***REMOVED*** @param {string|number=} opt_h Height of the element. Required if w is not a
***REMOVED***     size object.
***REMOVED***
goog.style.setSize = function(element, w, opt_h) {
  var h;
  if (w instanceof goog.math.Size) {
    h = w.height;
    w = w.width;
  } else {
    if (opt_h == undefined) {
      throw Error('missing height argument');
    }
    h = opt_h;
  }

  goog.style.setWidth(element,***REMOVED*****REMOVED*** @type {string|number}***REMOVED*** (w));
  goog.style.setHeight(element,***REMOVED*****REMOVED*** @type {string|number}***REMOVED*** (h));
***REMOVED***


***REMOVED***
***REMOVED*** Helper function to create a string to be set into a pixel-value style
***REMOVED*** property of an element. Can round to the nearest integer value.
***REMOVED***
***REMOVED*** @param {string|number} value The style value to be used. If a number,
***REMOVED***     'px' will be appended, otherwise the value will be applied directly.
***REMOVED*** @param {boolean} round Whether to round the nearest integer (if property
***REMOVED***     is a number).
***REMOVED*** @return {string} The string value for the property.
***REMOVED*** @private
***REMOVED***
goog.style.getPixelStyleValue_ = function(value, round) {
  if (typeof value == 'number') {
    value = (round ? Math.round(value) : value) + 'px';
  }

  return value;
***REMOVED***


***REMOVED***
***REMOVED*** Set the height of an element.  Sets the element's style property.
***REMOVED*** @param {Element} element Element to set the height of.
***REMOVED*** @param {string|number} height The height value to set.  If a number, 'px'
***REMOVED***     will be appended, otherwise the value will be applied directly.
***REMOVED***
goog.style.setHeight = function(element, height) {
  element.style.height = goog.style.getPixelStyleValue_(height, true);
***REMOVED***


***REMOVED***
***REMOVED*** Set the width of an element.  Sets the element's style property.
***REMOVED*** @param {Element} element Element to set the width of.
***REMOVED*** @param {string|number} width The width value to set.  If a number, 'px'
***REMOVED***     will be appended, otherwise the value will be applied directly.
***REMOVED***
goog.style.setWidth = function(element, width) {
  element.style.width = goog.style.getPixelStyleValue_(width, true);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the height and width of an element, even if its display is none.
***REMOVED*** Specifically, this returns the height and width of the border box,
***REMOVED*** irrespective of the box model in effect.
***REMOVED*** @param {Element} element Element to get size of.
***REMOVED*** @return {!goog.math.Size} Object with width/height properties.
***REMOVED***
goog.style.getSize = function(element) {
  if (goog.style.getStyle_(element, 'display') != 'none') {
    return goog.style.getSizeWithDisplay_(element);
  }

  var style = element.style;
  var originalDisplay = style.display;
  var originalVisibility = style.visibility;
  var originalPosition = style.position;

  style.visibility = 'hidden';
  style.position = 'absolute';
  style.display = 'inline';

  var size = goog.style.getSizeWithDisplay_(element);

  style.display = originalDisplay;
  style.position = originalPosition;
  style.visibility = originalVisibility;

  return size;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the height and with of an element when the display is not none.
***REMOVED*** @param {Element} element Element to get size of.
***REMOVED*** @return {!goog.math.Size} Object with width/height properties.
***REMOVED*** @private
***REMOVED***
goog.style.getSizeWithDisplay_ = function(element) {
  var offsetWidth = element.offsetWidth;
  var offsetHeight = element.offsetHeight;
  var webkitOffsetsZero =
      goog.userAgent.WEBKIT && !offsetWidth && !offsetHeight;
  if ((!goog.isDef(offsetWidth) || webkitOffsetsZero) &&
      element.getBoundingClientRect) {
    // Fall back to calling getBoundingClientRect when offsetWidth or
    // offsetHeight are not defined, or when they are zero in WebKit browsers.
    // This makes sure that we return for the correct size for SVG elements, but
    // will still return 0 on Webkit prior to 534.8, see
    // http://trac.webkit.org/changeset/67252.
    var clientRect = goog.style.getBoundingClientRect_(element);
    return new goog.math.Size(clientRect.right - clientRect.left,
        clientRect.bottom - clientRect.top);
  }
  return new goog.math.Size(offsetWidth, offsetHeight);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a bounding rectangle for a given element in page space.
***REMOVED*** @param {Element} element Element to get bounds of. Must not be display none.
***REMOVED*** @return {!goog.math.Rect} Bounding rectangle for the element.
***REMOVED***
goog.style.getBounds = function(element) {
  var o = goog.style.getPageOffset(element);
  var s = goog.style.getSize(element);
  return new goog.math.Rect(o.x, o.y, s.width, s.height);
***REMOVED***


***REMOVED***
***REMOVED*** Converts a CSS selector in the form style-property to styleProperty.
***REMOVED*** @param {*} selector CSS Selector.
***REMOVED*** @return {string} Camel case selector.
***REMOVED*** @deprecated Use goog.string.toCamelCase instead.
***REMOVED***
goog.style.toCamelCase = function(selector) {
  return goog.string.toCamelCase(String(selector));
***REMOVED***


***REMOVED***
***REMOVED*** Converts a CSS selector in the form styleProperty to style-property.
***REMOVED*** @param {string} selector Camel case selector.
***REMOVED*** @return {string} Selector cased.
***REMOVED*** @deprecated Use goog.string.toSelectorCase instead.
***REMOVED***
goog.style.toSelectorCase = function(selector) {
  return goog.string.toSelectorCase(selector);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the opacity of a node (x-browser). This gets the inline style opacity
***REMOVED*** of the node, and does not take into account the cascaded or the computed
***REMOVED*** style for this node.
***REMOVED*** @param {Element} el Element whose opacity has to be found.
***REMOVED*** @return {number|string} Opacity between 0 and 1 or an empty string {@code ''}
***REMOVED***     if the opacity is not set.
***REMOVED***
goog.style.getOpacity = function(el) {
  var style = el.style;
  var result = '';
  if ('opacity' in style) {
    result = style.opacity;
  } else if ('MozOpacity' in style) {
    result = style.MozOpacity;
  } else if ('filter' in style) {
    var match = style.filter.match(/alpha\(opacity=([\d.]+)\)/);
    if (match) {
      result = String(match[1] / 100);
    }
  }
  return result == '' ? result : Number(result);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the opacity of a node (x-browser).
***REMOVED*** @param {Element} el Elements whose opacity has to be set.
***REMOVED*** @param {number|string} alpha Opacity between 0 and 1 or an empty string
***REMOVED***     {@code ''} to clear the opacity.
***REMOVED***
goog.style.setOpacity = function(el, alpha) {
  var style = el.style;
  if ('opacity' in style) {
    style.opacity = alpha;
  } else if ('MozOpacity' in style) {
    style.MozOpacity = alpha;
  } else if ('filter' in style) {
    // TODO(arv): Overwriting the filter might have undesired side effects.
    if (alpha === '') {
      style.filter = '';
    } else {
      style.filter = 'alpha(opacity=' + alpha***REMOVED*** 100 + ')';
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the background of an element to a transparent image in a browser-
***REMOVED*** independent manner.
***REMOVED***
***REMOVED*** This function does not support repeating backgrounds or alternate background
***REMOVED*** positions to match the behavior of Internet Explorer. It also does not
***REMOVED*** support sizingMethods other than crop since they cannot be replicated in
***REMOVED*** browsers other than Internet Explorer.
***REMOVED***
***REMOVED*** @param {Element} el The element to set background on.
***REMOVED*** @param {string} src The image source URL.
***REMOVED***
goog.style.setTransparentBackgroundImage = function(el, src) {
  var style = el.style;
  // It is safe to use the style.filter in IE only. In Safari 'filter' is in
  // style object but access to style.filter causes it to throw an exception.
  // Note: IE8 supports images with an alpha channel.
  if (goog.userAgent.IE && !goog.userAgent.isVersion('8')) {
    // See TODO in setOpacity.
    style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(' +
        'src="' + src + '", sizingMethod="crop")';
  } else {
    // Set style properties individually instead of using background shorthand
    // to prevent overwriting a pre-existing background color.
    style.backgroundImage = 'url(' + src + ')';
    style.backgroundPosition = 'top left';
    style.backgroundRepeat = 'no-repeat';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Clears the background image of an element in a browser independent manner.
***REMOVED*** @param {Element} el The element to clear background image for.
***REMOVED***
goog.style.clearTransparentBackgroundImage = function(el) {
  var style = el.style;
  if ('filter' in style) {
    // See TODO in setOpacity.
    style.filter = '';
  } else {
    // Set style properties individually instead of using background shorthand
    // to prevent overwriting a pre-existing background color.
    style.backgroundImage = 'none';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Shows or hides an element from the page. Hiding the element is done by
***REMOVED*** setting the display property to "none", removing the element from the
***REMOVED*** rendering hierarchy so it takes up no space. To show the element, the default
***REMOVED*** inherited display property is restored (defined either in stylesheets or by
***REMOVED*** the browser's default style rules.)
***REMOVED***
***REMOVED*** Caveat 1: if the inherited display property for the element is set to "none"
***REMOVED*** by the stylesheets, that is the property that will be restored by a call to
***REMOVED*** showElement(), effectively toggling the display between "none" and "none".
***REMOVED***
***REMOVED*** Caveat 2: if the element display style is set inline (by setting either
***REMOVED*** element.style.display or a style attribute in the HTML), a call to
***REMOVED*** showElement will clear that setting and defer to the inherited style in the
***REMOVED*** stylesheet.
***REMOVED*** @param {Element} el Element to show or hide.
***REMOVED*** @param {*} display True to render the element in its default style,
***REMOVED*** false to disable rendering the element.
***REMOVED***
goog.style.showElement = function(el, display) {
  el.style.display = display ? '' : 'none';
***REMOVED***


***REMOVED***
***REMOVED*** Test whether the given element has been shown or hidden via a call to
***REMOVED*** {@link #showElement}.
***REMOVED***
***REMOVED*** Note this is strictly a companion method for a call
***REMOVED*** to {@link #showElement} and the same caveats apply; in particular, this
***REMOVED*** method does not guarantee that the return value will be consistent with
***REMOVED*** whether or not the element is actually visible.
***REMOVED***
***REMOVED*** @param {Element} el The element to test.
***REMOVED*** @return {boolean} Whether the element has been shown.
***REMOVED*** @see #showElement
***REMOVED***
goog.style.isElementShown = function(el) {
  return el.style.display != 'none';
***REMOVED***


***REMOVED***
***REMOVED*** Installs the styles string into the window that contains opt_element.  If
***REMOVED*** opt_element is null, the main window is used.
***REMOVED*** @param {string} stylesString The style string to install.
***REMOVED*** @param {Node=} opt_node Node whose parent document should have the
***REMOVED***     styles installed.
***REMOVED*** @return {Element|StyleSheet} The style element created.
***REMOVED***
goog.style.installStyles = function(stylesString, opt_node) {
  var dh = goog.dom.getDomHelper(opt_node);
  var styleSheet = null;

  if (goog.userAgent.IE) {
    styleSheet = dh.getDocument().createStyleSheet();
    goog.style.setStyles(styleSheet, stylesString);
  } else {
    var head = dh.getElementsByTagNameAndClass('head')[0];

    // In opera documents are not guaranteed to have a head element, thus we
    // have to make sure one exists before using it.
    if (!head) {
      var body = dh.getElementsByTagNameAndClass('body')[0];
      head = dh.createDom('head');
      body.parentNode.insertBefore(head, body);
    }
    styleSheet = dh.createDom('style');
    // NOTE(user): Setting styles after the style element has been appended
    // to the head results in a nasty Webkit bug in certain scenarios. Please
    // refer to https://bugs.webkit.org/show_bug.cgi?id=26307 for additional
    // details.
    goog.style.setStyles(styleSheet, stylesString);
    dh.appendChild(head, styleSheet);
  }
  return styleSheet;
***REMOVED***


***REMOVED***
***REMOVED*** Removes the styles added by {@link #installStyles}.
***REMOVED*** @param {Element|StyleSheet} styleSheet The value returned by
***REMOVED***     {@link #installStyles}.
***REMOVED***
goog.style.uninstallStyles = function(styleSheet) {
  var node = styleSheet.ownerNode || styleSheet.owningElement ||
     ***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (styleSheet);
  goog.dom.removeNode(node);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the content of a style element.  The style element can be any valid
***REMOVED*** style element.  This element will have its content completely replaced by
***REMOVED*** the new stylesString.
***REMOVED*** @param {Element|StyleSheet} element A stylesheet element as returned by
***REMOVED***     installStyles.
***REMOVED*** @param {string} stylesString The new content of the stylesheet.
***REMOVED***
goog.style.setStyles = function(element, stylesString) {
  if (goog.userAgent.IE) {
    // Adding the selectors individually caused the browser to hang if the
    // selector was invalid or there were CSS comments.  Setting the cssText of
    // the style node works fine and ignores CSS that IE doesn't understand
    element.cssText = stylesString;
  } else {
    element.innerHTML = stylesString;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets 'white-space: pre-wrap' for a node (x-browser).
***REMOVED***
***REMOVED*** There are as many ways of specifying pre-wrap as there are browsers.
***REMOVED***
***REMOVED*** CSS3/IE8: white-space: pre-wrap;
***REMOVED*** Mozilla:  white-space: -moz-pre-wrap;
***REMOVED*** Opera:    white-space: -o-pre-wrap;
***REMOVED*** IE6/7:    white-space: pre; word-wrap: break-word;
***REMOVED***
***REMOVED*** @param {Element} el Element to enable pre-wrap for.
***REMOVED***
goog.style.setPreWrap = function(el) {
  var style = el.style;
  if (goog.userAgent.IE && !goog.userAgent.isVersion('8')) {
    style.whiteSpace = 'pre';
    style.wordWrap = 'break-word';
  } else if (goog.userAgent.GECKO) {
    style.whiteSpace = '-moz-pre-wrap';
  } else {
    style.whiteSpace = 'pre-wrap';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets 'display: inline-block' for an element (cross-browser).
***REMOVED*** @param {Element} el Element to which the inline-block display style is to be
***REMOVED***    applied.
***REMOVED*** @see ../demos/inline_block_quirks.html
***REMOVED*** @see ../demos/inline_block_standards.html
***REMOVED***
goog.style.setInlineBlock = function(el) {
  var style = el.style;
  // Without position:relative, weirdness ensues.  Just accept it and move on.
  style.position = 'relative';

  if (goog.userAgent.IE && !goog.userAgent.isVersion('8')) {
    // IE8 supports inline-block so fall through to the else
    // Zoom:1 forces hasLayout, display:inline gives inline behavior.
    style.zoom = '1';
    style.display = 'inline';
  } else if (goog.userAgent.GECKO) {
    // Pre-Firefox 3, Gecko doesn't support inline-block, but -moz-inline-box
    // is close enough.
    style.display = goog.userAgent.isVersion('1.9a') ? 'inline-block' :
        '-moz-inline-box';
  } else {
    // Opera, Webkit, and Safari seem to do OK with the standard inline-block
    // style.
    style.display = 'inline-block';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the element is using right to left (rtl) direction.
***REMOVED*** @param {Element} el  The element to test.
***REMOVED*** @return {boolean} True for right to left, false for left to right.
***REMOVED***
goog.style.isRightToLeft = function(el) {
  return 'rtl' == goog.style.getStyle_(el, 'direction');
***REMOVED***


***REMOVED***
***REMOVED*** The CSS style property corresponding to an element being
***REMOVED*** unselectable on the current browser platform (null if none).
***REMOVED*** Opera and IE instead use a DOM attribute 'unselectable'.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.style.unselectableStyle_ =
    goog.userAgent.GECKO ? 'MozUserSelect' :
    goog.userAgent.WEBKIT ? 'WebkitUserSelect' :
    null;


***REMOVED***
***REMOVED*** Returns true if the element is set to be unselectable, false otherwise.
***REMOVED*** Note that on some platforms (e.g. Mozilla), even if an element isn't set
***REMOVED*** to be unselectable, it will behave as such if any of its ancestors is
***REMOVED*** unselectable.
***REMOVED*** @param {Element} el  Element to check.
***REMOVED*** @return {boolean}  Whether the element is set to be unselectable.
***REMOVED***
goog.style.isUnselectable = function(el) {
  if (goog.style.unselectableStyle_) {
    return el.style[goog.style.unselectableStyle_].toLowerCase() == 'none';
  } else if (goog.userAgent.IE || goog.userAgent.OPERA) {
    return el.getAttribute('unselectable') == 'on';
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Makes the element and its descendants selectable or unselectable.  Note
***REMOVED*** that on some platforms (e.g. Mozilla), even if an element isn't set to
***REMOVED*** be unselectable, it will behave as such if any of its ancestors is
***REMOVED*** unselectable.
***REMOVED*** @param {Element} el  The element to alter.
***REMOVED*** @param {boolean} unselectable  Whether the element and its descendants
***REMOVED***     should be made unselectable.
***REMOVED*** @param {boolean=} opt_noRecurse  Whether to only alter the element's own
***REMOVED***     selectable state, and leave its descendants alone; defaults to false.
***REMOVED***
goog.style.setUnselectable = function(el, unselectable, opt_noRecurse) {
  // TODO(attila): Do we need all of TR_DomUtil.makeUnselectable() in Closure?
  var descendants = !opt_noRecurse ? el.getElementsByTagName('*') : null;
  var name = goog.style.unselectableStyle_;
  if (name) {
    // Add/remove the appropriate CSS style to/from the element and its
    // descendants.
    var value = unselectable ? 'none' : '';
    el.style[name] = value;
    if (descendants) {
      for (var i = 0, descendant; descendant = descendants[i]; i++) {
        descendant.style[name] = value;
      }
    }
  } else if (goog.userAgent.IE || goog.userAgent.OPERA) {
    // Toggle the 'unselectable' attribute on the element and its descendants.
    var value = unselectable ? 'on' : '';
    el.setAttribute('unselectable', value);
    if (descendants) {
      for (var i = 0, descendant; descendant = descendants[i]; i++) {
        descendant.setAttribute('unselectable', value);
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the border box size for an element.
***REMOVED*** @param {Element} element  The element to get the size for.
***REMOVED*** @return {!goog.math.Size} The border box size.
***REMOVED***
goog.style.getBorderBoxSize = function(element) {
  return new goog.math.Size(element.offsetWidth, element.offsetHeight);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the border box size of an element. This is potentially expensive in IE
***REMOVED*** if the document is CSS1Compat mode
***REMOVED*** @param {Element} element  The element to set the size on.
***REMOVED*** @param {goog.math.Size} size  The new size.
***REMOVED***
goog.style.setBorderBoxSize = function(element, size) {
  var doc = goog.dom.getOwnerDocument(element);
  var isCss1CompatMode = goog.dom.getDomHelper(doc).isCss1CompatMode();

  if (goog.userAgent.IE &&
      (!isCss1CompatMode || !goog.userAgent.isVersion('8'))) {
    var style = element.style;
    if (isCss1CompatMode) {
      var paddingBox = goog.style.getPaddingBox(element);
      var borderBox = goog.style.getBorderBox(element);
      style.pixelWidth = size.width - borderBox.left - paddingBox.left -
                         paddingBox.right - borderBox.right;
      style.pixelHeight = size.height - borderBox.top - paddingBox.top -
                          paddingBox.bottom - borderBox.bottom;
    } else {
      style.pixelWidth = size.width;
      style.pixelHeight = size.height;
    }
  } else {
    goog.style.setBoxSizingSize_(element, size, 'border-box');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the content box size for an element.  This is potentially expensive in
***REMOVED*** all browsers.
***REMOVED*** @param {Element} element  The element to get the size for.
***REMOVED*** @return {!goog.math.Size} The content box size.
***REMOVED***
goog.style.getContentBoxSize = function(element) {
  var doc = goog.dom.getOwnerDocument(element);
  var ieCurrentStyle = goog.userAgent.IE && element.currentStyle;
  if (ieCurrentStyle &&
      goog.dom.getDomHelper(doc).isCss1CompatMode() &&
      ieCurrentStyle.width != 'auto' && ieCurrentStyle.height != 'auto' &&
      !ieCurrentStyle.boxSizing) {
    // If IE in CSS1Compat mode than just use the width and height.
    // If we have a boxSizing then fall back on measuring the borders etc.
    var width = goog.style.getIePixelValue_(element, ieCurrentStyle.width,
                                            'width', 'pixelWidth');
    var height = goog.style.getIePixelValue_(element, ieCurrentStyle.height,
                                             'height', 'pixelHeight');
    return new goog.math.Size(width, height);
  } else {
    var borderBoxSize = goog.style.getBorderBoxSize(element);
    var paddingBox = goog.style.getPaddingBox(element);
    var borderBox = goog.style.getBorderBox(element);
    return new goog.math.Size(borderBoxSize.width -
                              borderBox.left - paddingBox.left -
                              paddingBox.right - borderBox.right,
                              borderBoxSize.height -
                              borderBox.top - paddingBox.top -
                              paddingBox.bottom - borderBox.bottom);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the content box size of an element. This is potentially expensive in IE
***REMOVED*** if the document is BackCompat mode.
***REMOVED*** @param {Element} element  The element to set the size on.
***REMOVED*** @param {goog.math.Size} size  The new size.
***REMOVED***
goog.style.setContentBoxSize = function(element, size) {
  var doc = goog.dom.getOwnerDocument(element);
  var isCss1CompatMode = goog.dom.getDomHelper(doc).isCss1CompatMode();
  if (goog.userAgent.IE &&
      (!isCss1CompatMode || !goog.userAgent.isVersion('8'))) {
    var style = element.style;
    if (isCss1CompatMode) {
      style.pixelWidth = size.width;
      style.pixelHeight = size.height;
    } else {
      var paddingBox = goog.style.getPaddingBox(element);
      var borderBox = goog.style.getBorderBox(element);
      style.pixelWidth = size.width + borderBox.left + paddingBox.left +
                         paddingBox.right + borderBox.right;
      style.pixelHeight = size.height + borderBox.top + paddingBox.top +
                          paddingBox.bottom + borderBox.bottom;
    }
  } else {
    goog.style.setBoxSizingSize_(element, size, 'content-box');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Helper function that sets the box sizing as well as the width and height
***REMOVED*** @param {Element} element  The element to set the size on.
***REMOVED*** @param {goog.math.Size} size  The new size to set.
***REMOVED*** @param {string} boxSizing  The box-sizing value.
***REMOVED*** @private
***REMOVED***
goog.style.setBoxSizingSize_ = function(element, size, boxSizing) {
  var style = element.style;
  if (goog.userAgent.GECKO) {
    style.MozBoxSizing = boxSizing;
  } else if (goog.userAgent.WEBKIT) {
    style.WebkitBoxSizing = boxSizing;
  } else {
    // Includes IE8 and Opera 9.50+
    style.boxSizing = boxSizing;
  }

  // Setting this to a negative value will throw an exception on IE
  // (and doesn't do anything different than setting it to 0).
  style.width = Math.max(size.width, 0) + 'px';
  style.height = Math.max(size.height, 0) + 'px';
***REMOVED***


***REMOVED***
***REMOVED*** IE specific function that converts a non pixel unit to pixels.
***REMOVED*** @param {Element} element  The element to convert the value for.
***REMOVED*** @param {string} value  The current value as a string. The value must not be
***REMOVED***     ''.
***REMOVED*** @param {string} name  The CSS property name to use for the converstion. This
***REMOVED***     should be 'left', 'top', 'width' or 'height'.
***REMOVED*** @param {string} pixelName  The CSS pixel property name to use to get the
***REMOVED***     value in pixels.
***REMOVED*** @return {number} The value in pixels.
***REMOVED*** @private
***REMOVED***
goog.style.getIePixelValue_ = function(element, value, name, pixelName) {
  // Try if we already have a pixel value. IE does not do half pixels so we
  // only check if it matches a number followed by 'px'.
  if (/^\d+px?$/.test(value)) {
    return parseInt(value, 10);
  } else {
    var oldStyleValue = element.style[name];
    var oldRuntimeValue = element.runtimeStyle[name];
    // set runtime style to prevent changes
    element.runtimeStyle[name] = element.currentStyle[name];
    element.style[name] = value;
    var pixelValue = element.style[pixelName];
    // restore
    element.style[name] = oldStyleValue;
    element.runtimeStyle[name] = oldRuntimeValue;
    return pixelValue;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Helper function for getting the pixel padding or margin for IE.
***REMOVED*** @param {Element} element  The element to get the padding for.
***REMOVED*** @param {string} propName  The property name.
***REMOVED*** @return {number} The pixel padding.
***REMOVED*** @private
***REMOVED***
goog.style.getIePixelDistance_ = function(element, propName) {
  var value = goog.style.getCascadedStyle(element, propName);
  return value ?
      goog.style.getIePixelValue_(element, value, 'left', 'pixelLeft') : 0;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the computed paddings or margins (on all sides) in pixels.
***REMOVED*** @param {Element} element  The element to get the padding for.
***REMOVED*** @param {string} stylePrefix  Pass 'padding' to retrieve the padding box,
***REMOVED***     or 'margin' to retrieve the margin box.
***REMOVED*** @return {!goog.math.Box} The computed paddings or margins.
***REMOVED*** @private
***REMOVED***
goog.style.getBox_ = function(element, stylePrefix) {
  if (goog.userAgent.IE) {
    var left = goog.style.getIePixelDistance_(element, stylePrefix + 'Left');
    var right = goog.style.getIePixelDistance_(element, stylePrefix + 'Right');
    var top = goog.style.getIePixelDistance_(element, stylePrefix + 'Top');
    var bottom = goog.style.getIePixelDistance_(
        element, stylePrefix + 'Bottom');
    return new goog.math.Box(top, right, bottom, left);
  } else {
    // On non-IE browsers, getComputedStyle is always non-null.
    var left =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (
        goog.style.getComputedStyle(element, stylePrefix + 'Left'));
    var right =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (
        goog.style.getComputedStyle(element, stylePrefix + 'Right'));
    var top =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (
        goog.style.getComputedStyle(element, stylePrefix + 'Top'));
    var bottom =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (
        goog.style.getComputedStyle(element, stylePrefix + 'Bottom'));

    // NOTE(arv): Gecko can return floating point numbers for the computed
    // style values.
    return new goog.math.Box(parseFloat(top),
                             parseFloat(right),
                             parseFloat(bottom),
                             parseFloat(left));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the computed paddings (on all sides) in pixels.
***REMOVED*** @param {Element} element  The element to get the padding for.
***REMOVED*** @return {!goog.math.Box} The computed paddings.
***REMOVED***
goog.style.getPaddingBox = function(element) {
  return goog.style.getBox_(element, 'padding');
***REMOVED***


***REMOVED***
***REMOVED*** Gets the computed margins (on all sides) in pixels.
***REMOVED*** @param {Element} element  The element to get the margins for.
***REMOVED*** @return {!goog.math.Box} The computed margins.
***REMOVED***
goog.style.getMarginBox = function(element) {
  return goog.style.getBox_(element, 'margin');
***REMOVED***


***REMOVED***
***REMOVED*** A map used to map the border width keywords to a pixel width.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.style.ieBorderWidthKeywords_ = {
  'thin': 2,
  'medium': 4,
  'thick': 6
***REMOVED***


***REMOVED***
***REMOVED*** Helper function for IE to get the pixel border.
***REMOVED*** @param {Element} element  The element to get the pixel border for.
***REMOVED*** @param {string} prop  The part of the property name.
***REMOVED*** @return {number} The value in pixels.
***REMOVED*** @private
***REMOVED***
goog.style.getIePixelBorder_ = function(element, prop) {
  if (goog.style.getCascadedStyle(element, prop + 'Style') == 'none') {
    return 0;
  }
  var width = goog.style.getCascadedStyle(element, prop + 'Width');
  if (width in goog.style.ieBorderWidthKeywords_) {
    return goog.style.ieBorderWidthKeywords_[width];
  }
  return goog.style.getIePixelValue_(element, width, 'left', 'pixelLeft');
***REMOVED***


***REMOVED***
***REMOVED*** Gets the computed border widths (on all sides) in pixels
***REMOVED*** @param {Element} element  The element to get the border widths for.
***REMOVED*** @return {!goog.math.Box} The computed border widths.
***REMOVED***
goog.style.getBorderBox = function(element) {
  if (goog.userAgent.IE) {
    var left = goog.style.getIePixelBorder_(element, 'borderLeft');
    var right = goog.style.getIePixelBorder_(element, 'borderRight');
    var top = goog.style.getIePixelBorder_(element, 'borderTop');
    var bottom = goog.style.getIePixelBorder_(element, 'borderBottom');
    return new goog.math.Box(top, right, bottom, left);
  } else {
    // On non-IE browsers, getComputedStyle is always non-null.
    var left =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (
        goog.style.getComputedStyle(element, 'borderLeftWidth'));
    var right =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (
        goog.style.getComputedStyle(element, 'borderRightWidth'));
    var top =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (
        goog.style.getComputedStyle(element, 'borderTopWidth'));
    var bottom =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (
        goog.style.getComputedStyle(element, 'borderBottomWidth'));

    return new goog.math.Box(parseFloat(top),
                             parseFloat(right),
                             parseFloat(bottom),
                             parseFloat(left));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the font face applied to a given node. Opera and IE should return
***REMOVED*** the font actually displayed. Firefox returns the author's most-preferred
***REMOVED*** font (whether the browser is capable of displaying it or not.)
***REMOVED*** @param {Element} el  The element whose font family is returned.
***REMOVED*** @return {string} The font family applied to el.
***REMOVED***
goog.style.getFontFamily = function(el) {
  var doc = goog.dom.getOwnerDocument(el);
  var font = '';
  if (doc.body.createTextRange) {
    var range = doc.body.createTextRange();
    range.moveToElementText(el);
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      font = range.queryCommandValue('FontName');
    } catch (e) {
      // This is a workaround for a awkward exception.
      // On some IE, there is an exception coming from it.
      // The error description from this exception is:
      // This window has already been registered as a drop target
      // This is bogus description, likely due to a bug in ie.
      font = '';
    }
  }
  if (!font) {
    // Note if for some reason IE can't derive FontName with a TextRange, we
    // fallback to using currentStyle
    font = goog.style.getStyle_(el, 'fontFamily');
  }

  // Firefox returns the applied font-family string (author's list of
  // preferred fonts.) We want to return the most-preferred font, in lieu of
  // the***REMOVED***actually* applied font.
  var fontsArray = font.split(',');
  if (fontsArray.length > 1) font = fontsArray[0];

  // Sanitize for x-browser consistency:
  // Strip quotes because browsers aren't consistent with how they're
  // applied; Opera always encloses, Firefox sometimes, and IE never.
  return goog.string.stripQuotes(font, '"\'');
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression used for getLengthUnits.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.style.lengthUnitRegex_ = /[^\d]+$/;


***REMOVED***
***REMOVED*** Returns the units used for a CSS length measurement.
***REMOVED*** @param {string} value  A CSS length quantity.
***REMOVED*** @return {?string} The units of measurement.
***REMOVED***
goog.style.getLengthUnits = function(value) {
  var units = value.match(goog.style.lengthUnitRegex_);
  return units && units[0] || null;
***REMOVED***


***REMOVED***
***REMOVED*** Map of absolute CSS length units
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {
  'cm' : 1,
  'in' : 1,
  'mm' : 1,
  'pc' : 1,
  'pt' : 1
***REMOVED***


***REMOVED***
***REMOVED*** Map of relative CSS length units that can be accurately converted to px
***REMOVED*** font-size values using getIePixelValue_. Only units that are defined in
***REMOVED*** relation to a font size are convertible (%, small, etc. are not).
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {
  'em' : 1,
  'ex' : 1
***REMOVED***


***REMOVED***
***REMOVED*** Returns the font size, in pixels, of text in an element.
***REMOVED*** @param {Element} el  The element whose font size is returned.
***REMOVED*** @return {number} The font size (in pixels).
***REMOVED***
goog.style.getFontSize = function(el) {
  var fontSize = goog.style.getStyle_(el, 'fontSize');
  var sizeUnits = goog.style.getLengthUnits(fontSize);
  if (fontSize && 'px' == sizeUnits) {
    // NOTE(user): This could be parseFloat instead, but IE doesn't return
    // decimal fractions in getStyle_ and Firefox reports the fractions, but
    // ignores them when rendering. Interestingly enough, when we force the
    // issue and size something to e.g., 50% of 25px, the browsers round in
    // opposite directions with Firefox reporting 12px and IE 13px. I punt.
    return parseInt(fontSize, 10);
  }

  // In IE, we can convert absolute length units to a px value using
  // goog.style.getIePixelValue_. Units defined in relation to a font size
  // (em, ex) are applied relative to the element's parentNode and can also
  // be converted.
  if (goog.userAgent.IE) {
    if (sizeUnits in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) {
      return goog.style.getIePixelValue_(el,
                                         fontSize,
                                         'left',
                                         'pixelLeft');
    } else if (el.parentNode &&
               el.parentNode.nodeType == goog.dom.NodeType.ELEMENT &&
               sizeUnits in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) {
      // Check the parent size - if it is the same it means the relative size
      // value is inherited and we therefore don't want to count it twice.  If
      // it is different, this element either has explicit style or has a CSS
      // rule applying to it.
      var parentElement =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (el.parentNode);
      var parentSize = goog.style.getStyle_(parentElement, 'fontSize');
      return goog.style.getIePixelValue_(parentElement,
                                         fontSize == parentSize ?
                                             '1em' : fontSize,
                                         'left',
                                         'pixelLeft');
    }
  }

  // Sometimes we can't cleanly find the font size (some units relative to a
  // node's parent's font size are difficult: %, smaller et al), so we create
  // an invisible, absolutely-positioned span sized to be the height of an 'M'
  // rendered in its parent's (i.e., our target element's) font size. This is
  // the definition of CSS's font size attribute.
  var sizeElement = goog.dom.createDom(
      'span',
      {'style': 'visibility:hidden;position:absolute;' +
            'line-height:0;padding:0;margin:0;border:0;height:1em;'});
  goog.dom.appendChild(el, sizeElement);
  fontSize = sizeElement.offsetHeight;
  goog.dom.removeNode(sizeElement);

  return fontSize;
***REMOVED***


***REMOVED***
***REMOVED*** Parses a style attribute value.  Converts CSS property names to camel case.
***REMOVED*** @param {string} value The style attribute value.
***REMOVED*** @return {!Object} Map of CSS properties to string values.
***REMOVED***
goog.style.parseStyleAttribute = function(value) {
  var result = {***REMOVED***
  goog.array.forEach(value.split(/\s*;\s*/), function(pair) {
    var keyValue = pair.split(/\s*:\s*/);
    if (keyValue.length == 2) {
      result[goog.string.toCamelCase(keyValue[0].toLowerCase())] = keyValue[1];
    }
  });
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Reverse of parseStyleAttribute; that is, takes a style object and returns the
***REMOVED*** corresponding attribute value.  Converts camel case property names to proper
***REMOVED*** CSS selector names.
***REMOVED*** @param {Object} obj Map of CSS properties to values.
***REMOVED*** @return {string} The style attribute value.
***REMOVED***
goog.style.toStyleAttribute = function(obj) {
  var buffer = [];
  goog.object.forEach(obj, function(value, key) {
    buffer.push(goog.string.toSelectorCase(key), ':', value, ';');
  });
  return buffer.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Sets CSS float property on an element.
***REMOVED*** @param {Element} el The element to set float property on.
***REMOVED*** @param {string} value The value of float CSS property to set on this element.
***REMOVED***
goog.style.setFloat = function(el, value) {
  el.style[goog.userAgent.IE ? 'styleFloat' : 'cssFloat'] = value;
***REMOVED***


***REMOVED***
***REMOVED*** Gets value of explicitly-set float CSS property on an element.
***REMOVED*** @param {Element} el The element to get float property of.
***REMOVED*** @return {string} The value of explicitly-set float CSS property on this
***REMOVED***     element.
***REMOVED***
goog.style.getFloat = function(el) {
  return el.style[goog.userAgent.IE ? 'styleFloat' : 'cssFloat'] || '';
***REMOVED***


***REMOVED***
***REMOVED*** Returns the scroll bar width (represents the width of both horizontal
***REMOVED*** and vertical scroll).
***REMOVED***
***REMOVED*** @param {string=} opt_className An optional class name (or names) to apply
***REMOVED***     to the invisible div created to measure the scrollbar. This is necessary
***REMOVED***     if some scrollbars are styled differently than others.
***REMOVED*** @return {number} The scroll bar width in px.
***REMOVED***
goog.style.getScrollbarWidth = function(opt_className) {
  // Add two hidden divs.  The child div is larger than the parent and
  // forces scrollbars to appear on it.
  // Using overflow:scroll does not work consistently with scrollbars that
  // are styled with ::-webkit-scrollbar.
  var outerDiv = goog.dom.createElement('div');
  if (opt_className) {
    outerDiv.className = opt_className;
  }
  outerDiv.style.cssText = 'overflow:auto;' +
      'position:absolute;top:0;width:100px;height:100px';
  var innerDiv = goog.dom.createElement('div');
  goog.style.setSize(innerDiv, '200px', '200px');
  outerDiv.appendChild(innerDiv);
  goog.dom.appendChild(goog.dom.getDocument().body, outerDiv);
  var width = outerDiv.offsetWidth - outerDiv.clientWidth;
  goog.dom.removeNode(outerDiv);
  return width;
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression to extract x and y translation components from a CSS
***REMOVED*** transform Matrix representation.
***REMOVED***
***REMOVED*** @type {!RegExp}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.style.MATRIX_TRANSLATION_REGEX_ =
    new RegExp('matrix\\([0-9\\.\\-]+, [0-9\\.\\-]+, ' +
               '[0-9\\.\\-]+, [0-9\\.\\-]+, ' +
               '([0-9\\.\\-]+)p?x?, ([0-9\\.\\-]+)p?x?\\)');


***REMOVED***
***REMOVED*** Returns the x,y translation component of any CSS transforms applied to the
***REMOVED*** element, in pixels.
***REMOVED***
***REMOVED*** @param {!Element} element The element to get the translation of.
***REMOVED*** @return {!goog.math.Coordinate} The CSS translation of the element in px.
***REMOVED***
goog.style.getCssTranslation = function(element) {
  var property;
  if (goog.userAgent.IE) {
    property = '-ms-transform';
  } else if (goog.userAgent.WEBKIT) {
    property = '-webkit-transform';
  } else if (goog.userAgent.OPERA) {
    property = '-o-transform';
  } else if (goog.userAgent.GECKO) {
    property = '-moz-transform';
  }
  var transform;
  if (property) {
    transform = goog.style.getStyle_(element, property);
  }
  if (!transform) {
    transform = goog.style.getStyle_(element, 'transform');
  }
  if (!transform) {
    return new goog.math.Coordinate(0, 0);
  }
  var matches = transform.match(goog.style.MATRIX_TRANSLATION_REGEX_);
  if (!matches) {
    return new goog.math.Coordinate(0, 0);
  }
  return new goog.math.Coordinate(parseFloat(matches[1]),
                                  parseFloat(matches[2]));
***REMOVED***
