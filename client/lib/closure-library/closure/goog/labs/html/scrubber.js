// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview
***REMOVED*** HTML tag filtering, and balancing.
***REMOVED*** A more user-friendly API is exposed via {@code goog.labs.html.sanitizer}.
***REMOVED*** @visibility {//visibility:private}
***REMOVED***


goog.provide('goog.labs.html.scrubber');

goog.require('goog.array');
goog.require('goog.dom.tags');
goog.require('goog.labs.html.attributeRewriterPresubmitWorkaround');
goog.require('goog.string');


***REMOVED***
***REMOVED*** Replaces tags not on the white-list with empty text nodes, dropping all
***REMOVED*** attributes, and drops other non-text nodes such as comments.
***REMOVED***
***REMOVED*** @param {!Object.<string, boolean>} tagWhitelist a set of lower-case tag names
***REMOVED***    following the convention established by {@link goog.object.createSet}.
***REMOVED*** @param {!Object.<string, Object.<string, goog.labs.html.AttributeRewriter>>}
***REMOVED***        attrWhitelist
***REMOVED***    maps lower-case tag names and the special string {@code "*"} to functions
***REMOVED***    from decoded attribute values to sanitized values or {@code null} to
***REMOVED***    indicate that the attribute is not allowed with that value.
***REMOVED***
***REMOVED***    For example, if {@code attrWhitelist['a']['href']} is defined then it
***REMOVED***    is used to sanitize the value of the link's URL.
***REMOVED***
***REMOVED***    If {@code attrWhitelist['*']['id']} is defined, and
***REMOVED***    {@code attrWhitelist['div']['id']} is not, then the former is used to
***REMOVED***    sanitize any {@code id} attribute on a {@code <div>} element.
***REMOVED*** @param {string} html a string of HTML
***REMOVED*** @return {string} the input but with potentially dangerous tokens removed.
***REMOVED***
goog.labs.html.scrubber.scrub = function(tagWhitelist, attrWhitelist, html) {
  return goog.labs.html.scrubber.render_(
      goog.labs.html.scrubber.balance_(
          goog.labs.html.scrubber.filter_(
              tagWhitelist,
              attrWhitelist,
              goog.labs.html.scrubber.lex_(html))));
***REMOVED***


***REMOVED***
***REMOVED*** Balances tags in trusted HTML.
***REMOVED*** @param {string} html a string of HTML
***REMOVED*** @return {string} the input but with an end-tag for each non-void start tag
***REMOVED***     and only for non-void start tags, and with start and end tags nesting
***REMOVED***     properly.
***REMOVED***
goog.labs.html.scrubber.balance = function(html) {
  return goog.labs.html.scrubber.render_(
      goog.labs.html.scrubber.balance_(
          goog.labs.html.scrubber.lex_(html)));
***REMOVED***


***REMOVED*** Character code constant for {@code '<'}.  @private***REMOVED***
goog.labs.html.scrubber.CC_LT_ = '<'.charCodeAt(0);


***REMOVED*** Character code constant for {@code '!'}.  @private***REMOVED***
goog.labs.html.scrubber.CC_BANG_ = '!'.charCodeAt(0);


***REMOVED*** Character code constant for {@code '/'}.  @private***REMOVED***
goog.labs.html.scrubber.CC_SLASH_ = '/'.charCodeAt(0);


***REMOVED*** Character code constant for {@code '?'}.  @private***REMOVED***
goog.labs.html.scrubber.CC_QMARK_ = '?'.charCodeAt(0);


***REMOVED***
***REMOVED*** Matches content following a tag name or attribute value, and before the
***REMOVED*** beginning of the next attribute value.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.ATTR_VALUE_PRECEDER_ = '[^=>]+';


***REMOVED*** @private***REMOVED***
goog.labs.html.scrubber.UNQUOTED_ATTR_VALUE_ = '(?:[^"\'\\s>][^\\s>]*)';


***REMOVED*** @private***REMOVED***
goog.labs.html.scrubber.DOUBLE_QUOTED_ATTR_VALUE_ = '(?:"[^"]*"?)';


***REMOVED*** @private***REMOVED***
goog.labs.html.scrubber.SINGLE_QUOTED_ATTR_VALUE_ = "(?:'[^']*'?)";


***REMOVED***
***REMOVED*** Matches the equals-sign and any attribute value following it, but does not
***REMOVED*** capture any {@code >} that would close the tag.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.ATTR_VALUE_ = '=\\s*(?:' +
    goog.labs.html.scrubber.UNQUOTED_ATTR_VALUE_ +
    '|' + goog.labs.html.scrubber.DOUBLE_QUOTED_ATTR_VALUE_ +
    '|' + goog.labs.html.scrubber.SINGLE_QUOTED_ATTR_VALUE_ + ')?';


***REMOVED***
***REMOVED*** The body of a tag between the end of the name and the closing {@code >}
***REMOVED*** if any.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.ATTRS_ =
    '(?:' + goog.labs.html.scrubber.ATTR_VALUE_PRECEDER_ +
    '|' + goog.labs.html.scrubber.ATTR_VALUE_ + ')*';


***REMOVED***
***REMOVED*** A character that continues a tag name as defined at
***REMOVED*** http://www.w3.org/html/wg/drafts/html/master/syntax.html#tag-name-state
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.TAG_NAME_CHAR_ = '[^\t\f\n />]';


***REMOVED***
***REMOVED*** Matches when the next character cannot continue a tag name.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.BREAK_ =
    '(?!' + goog.labs.html.scrubber.TAG_NAME_CHAR_ + ')';


***REMOVED***
***REMOVED*** Matches the open tag and body of a special element :
***REMOVED*** one whose body cannot contain nested elements so uses special parsing rules.
***REMOVED*** It does not include the end tag.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.SPECIAL_ELEMENT_ = '<(?:' +
    // Special tag name.
    '(iframe|script|style|textarea|title|xmp)' +
    // End of tag name
    goog.labs.html.scrubber.BREAK_ +
    // Attributes
    goog.labs.html.scrubber.ATTRS_ + '>' +
    // Element content includes non '<' characters, and
    // '<' that don't start a matching end tag.
    // This uses a back-reference to the tag name to determine whether
    // the tag names match.
    // Since matching is case-insensitive, this can only be used in
    // a case-insensitive regular expression.
    // JavaScript does not treat Turkish dotted I's as equivalent to their
    // ASCII equivalents.
    '(?:[^<]|<(?!/\\1' + goog.labs.html.scrubber.BREAK_ + '))*' +
    ')';


***REMOVED***
***REMOVED*** Regexp pattern for an HTML tag.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.TAG_ =
    '<[/]?[a-z]' + goog.labs.html.scrubber.TAG_NAME_CHAR_ + '*' +
    goog.labs.html.scrubber.ATTRS_ + '>?';


***REMOVED***
***REMOVED*** Regexp pattern for an HTML text node.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.TEXT_NODE_ = '(?:[^<]|<(?![a-z]|[?!/]))+';


***REMOVED***
***REMOVED*** Matches HTML comments including HTML 5 "bogus comments" of the form
***REMOVED*** {@code <!...>} or {@code <?...>} or {@code </...>}.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.COMMENT_ =
    '<!--(?:[^\\-]|-+(?![\\->]))*(?:-(?:->?)?)?' +
    '|<[!?/][^>]*>?';


***REMOVED***
***REMOVED*** Regexp pattern for an HTML token after a doctype.
***REMOVED*** Special elements introduces a capturing group for use with a
***REMOVED*** back-reference.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.HTML_TOKENS_RE_ = new RegExp(
    '(?:' + goog.labs.html.scrubber.TEXT_NODE_ +
    '|' + goog.labs.html.scrubber.SPECIAL_ELEMENT_ +
    '|' + goog.labs.html.scrubber.TAG_ +
    '|' + goog.labs.html.scrubber.COMMENT_ + ')',
    'ig');


***REMOVED***
***REMOVED*** An HTML tag which captures the name in group 1,
***REMOVED*** and any attributes in group 2.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.TAG_RE_ = new RegExp(
    '<[/]?([a-z]' + goog.labs.html.scrubber.TAG_NAME_CHAR_ + '*)' +
    '(' + goog.labs.html.scrubber.ATTRS_ + ')>?',
    'i');


***REMOVED***
***REMOVED*** A global matcher that separates attributes out of the tag body cruft.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.ATTRS_RE_ = new RegExp(
    '[^=\\s]+\\s*(?:' + goog.labs.html.scrubber.ATTR_VALUE_ + ')?', 'ig');


***REMOVED***
***REMOVED*** Returns an array of HTML tokens including tags, text nodes and comments.
***REMOVED*** "Special" elements, like {@code <script>...</script>} whose bodies cannot
***REMOVED*** include nested elements, are returned as single tokens.
***REMOVED***
***REMOVED*** @param {string} html a string of HTML
***REMOVED*** @return {!Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.lex_ = function(html) {
  return ('' + html).match(goog.labs.html.scrubber.HTML_TOKENS_RE_) || [];
***REMOVED***


***REMOVED***
***REMOVED*** Replaces tags not on the white-list with empty text nodes, dropping all
***REMOVED*** attributes, and drops other non-text nodes such as comments.
***REMOVED***
***REMOVED*** @param {!Object.<string, boolean>} tagWhitelist a set of lower-case tag names
***REMOVED***    following the convention established by {@link goog.object.createSet}.
***REMOVED*** @param {!Object.<string, Object.<string, goog.labs.html.AttributeRewriter>>
***REMOVED***        } attrWhitelist
***REMOVED***    maps lower-case tag names and the special string {@code "*"} to functions
***REMOVED***    from decoded attribute values to sanitized values or {@code null} to
***REMOVED***    indicate that the attribute is not allowed with that value.
***REMOVED***
***REMOVED***    For example, if {@code attrWhitelist['a']['href']} is defined then it is
***REMOVED***    used to sanitize the value of the link's URL.
***REMOVED***
***REMOVED***    If {@code attrWhitelist['*']['id']} is defined, and
***REMOVED***    {@code attrWhitelist['div']['id']} is not, then the former is used to
***REMOVED***    sanitize any {@code id} attribute on a {@code <div>} element.
***REMOVED*** @param {!Array.<string>} htmlTokens an array of HTML tokens as returned by
***REMOVED***    {@link goog.labs.html.scrubber.lex_}.
***REMOVED*** @return {!Array.<string>} the input array modified in place to have some
***REMOVED***    tokens removed.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.filter_ = function(
    tagWhitelist, attrWhitelist, htmlTokens) {
  var genericAttrWhitelist = attrWhitelist['*'];
  for (var i = 0, n = htmlTokens.length; i < n; ++i) {
    var htmlToken = htmlTokens[i];
    if (htmlToken.charCodeAt(0) !== goog.labs.html.scrubber.CC_LT_) {
      // Definitely not a tag
      continue;
    }

    var tag = htmlToken.match(goog.labs.html.scrubber.TAG_RE_);
    if (tag) {
      var lowerCaseTagName = tag[1].toLowerCase();
      var isCloseTag =
          htmlToken.charCodeAt(1) === goog.labs.html.scrubber.CC_SLASH_;
      var attrs = '';
      if (!isCloseTag && tag[2]) {
        var tagSpecificAttrWhitelist =
           ***REMOVED*****REMOVED*** @type {Object.<string, goog.labs.html.AttributeRewriter>}***REMOVED*** (
            goog.labs.html.scrubber.readOwnProperty_(
                attrWhitelist, lowerCaseTagName));
        if (genericAttrWhitelist || tagSpecificAttrWhitelist) {
          attrs = goog.labs.html.scrubber.filterAttrs_(
              tag[2], genericAttrWhitelist, tagSpecificAttrWhitelist);
        }
      }
      var specialContent = htmlToken.substring(tag[0].length);
      htmlTokens[i] =
          (tagWhitelist[lowerCaseTagName] === true) ?
          (
              (isCloseTag ? '</' : '<') + lowerCaseTagName + attrs + '>' +
              specialContent
          ) :
          '';
    } else if (htmlToken.length > 1) {
      switch (htmlToken.charCodeAt(1)) {
        case goog.labs.html.scrubber.CC_BANG_:
        case goog.labs.html.scrubber.CC_SLASH_:
        case goog.labs.html.scrubber.CC_QMARK_:
          htmlTokens[i] = '';  // Elide comments.
          break;
        default:
          // Otherwise, token is just a text node that starts with '<'.
          // Speed up later passes by normalizing the text node.
          htmlTokens[i] = htmlTokens[i].replace(/</g, '&lt;');
      }
    }
  }
  return htmlTokens;
***REMOVED***


***REMOVED***
***REMOVED*** Parses attribute names and values out of a tag body and applies the attribute
***REMOVED*** white-list to produce a tag body containing only safe attributes.
***REMOVED***
***REMOVED*** @param {string} attrsText the text of a tag between the end of the tag name
***REMOVED***   and the beginning of the tag end marker, so {@code " foo bar='baz'"} for
***REMOVED***   the tag {@code <tag foo bar='baz'/>}.
***REMOVED*** @param {Object.<string, goog.labs.html.AttributeRewriter>}
***REMOVED***   genericAttrWhitelist
***REMOVED***   a whitelist of attribute transformations for attributes that are allowed
***REMOVED***   on any element.
***REMOVED*** @param {Object.<string, goog.labs.html.AttributeRewriter>}
***REMOVED***   tagSpecificAttrWhitelist
***REMOVED***   a whitelist of attribute transformations for attributes that are allowed
***REMOVED***   on the element started by the tag whose body is {@code tagBody}.
***REMOVED*** @return {string} a tag-body that consists only of safe attributes.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.filterAttrs_ =
    function(attrsText, genericAttrWhitelist, tagSpecificAttrWhitelist) {
  var attrs = attrsText.match(goog.labs.html.scrubber.ATTRS_RE_);
  var nAttrs = attrs ? attrs.length : 0;
  var safeAttrs = '';
  for (var i = 0; i < nAttrs; ++i) {
    var attr = attrs[i];
    var eq = attr.indexOf('=');
    var name, value;
    if (eq >= 0) {
      name = goog.string.trim(attr.substr(0, eq));
      value = goog.string.stripQuotes(
          goog.string.trim(attr.substr(eq + 1)), '"\'');
    } else {
      name = value = attr;
    }
    name = name.toLowerCase();
    var rewriter =***REMOVED*****REMOVED*** @type {?goog.labs.html.AttributeRewriter}***REMOVED*** (
        tagSpecificAttrWhitelist &&
        goog.labs.html.scrubber.readOwnProperty_(
            tagSpecificAttrWhitelist, name) ||
        genericAttrWhitelist &&
        goog.labs.html.scrubber.readOwnProperty_(genericAttrWhitelist, name));
    if (rewriter) {
      var safeValue = rewriter(goog.string.unescapeEntities(value));
      if (safeValue != null) {
        if (safeValue.implementsGoogStringTypedString) {
          safeValue =***REMOVED*****REMOVED*** @type {goog.string.TypedString}***REMOVED***
              (safeValue).getTypedStringValue();
        }
        safeValue = String(safeValue);
        if (safeValue.indexOf('`') >= 0) {
          safeValue += ' ';
        }
        safeAttrs +=
            ' ' + name + '="' + goog.string.htmlEscape(safeValue, false) +
            '"';
      }
    }
  }
  return safeAttrs;
***REMOVED***


***REMOVED***
***REMOVED*** @param {!Object} o the object
***REMOVED*** @param {!string} k a key into o
***REMOVED*** @return {*}
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.readOwnProperty_ = function(o, k) {
  return Object.prototype.hasOwnProperty.call(o, k) ? o[k] : undefined;
***REMOVED***


***REMOVED***
***REMOVED*** We limit the nesting limit of balanced HTML to a large but manageable number
***REMOVED*** so that built-in browser limits aren't likely to kick in and undo all our
***REMOVED*** matching of start and end tags.
***REMOVED*** <br>
***REMOVED*** This mitigates the HTML parsing equivalent of stack smashing attacks.
***REMOVED*** <br>
***REMOVED*** Otherwise, crafted inputs like
***REMOVED*** {@code <p><p><p><p>...Ad nauseam...</p></p></p></p>} could exploit
***REMOVED*** browser bugs, and/or undocumented nesting limit recovery code to misnest
***REMOVED*** tags.
***REMOVED*** @private
***REMOVED*** @const
***REMOVED***
goog.labs.html.scrubber.BALANCE_NESTING_LIMIT_ = 256;


***REMOVED***
***REMOVED*** Ensures that there are end-tags for all and only for non-void start tags.
***REMOVED*** @param {Array.<string>} htmlTokens an array of HTML tokens as returned by
***REMOVED***    {@link goog.labs.html.scrubber.lex}.
***REMOVED*** @return {!Array.<string>} the input array modified in place to have some
***REMOVED***    tokens removed.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.balance_ = function(htmlTokens) {
  var openElementStack = [];
  for (var i = 0, n = htmlTokens.length; i < n; ++i) {
    var htmlToken = htmlTokens[i];
    if (htmlToken.charCodeAt(0) !== goog.labs.html.scrubber.CC_LT_) {
      // Definitely not a tag
      continue;
    }
    var tag = htmlToken.match(goog.labs.html.scrubber.TAG_RE_);
    if (tag) {
      var lowerCaseTagName = tag[1].toLowerCase();
      var isCloseTag =
          htmlToken.charCodeAt(1) === goog.labs.html.scrubber.CC_SLASH_;
      // Special case: HTML5 mandates that </br> be treated as <br>.
      if (isCloseTag && lowerCaseTagName == 'br') {
        isCloseTag = false;
        htmlToken = '<br>';
      }
      var isVoidTag = goog.dom.tags.isVoidTag(lowerCaseTagName);
      if (isVoidTag && isCloseTag) {
        htmlTokens[i] = '';
        continue;
      }

      var prefix = '';

      // Insert implied open tags.
      var nOpenElements = openElementStack.length;
      if (nOpenElements && !isCloseTag) {
        var top = openElementStack[nOpenElements - 1];
        var groups = goog.labs.html.scrubber.ELEMENT_GROUPS_[lowerCaseTagName];
        if (groups === undefined) {
          groups = goog.labs.html.scrubber.Group_.INLINE_;
        }
        var canContain = goog.labs.html.scrubber.ELEMENT_CONTENTS_[top];
        if (!(groups & canContain)) {
          var blockContainer = goog.labs.html.scrubber.BLOCK_CONTAINERS_[top];
          if ('string' === typeof blockContainer) {
            var containerCanContain =
                goog.labs.html.scrubber.ELEMENT_CONTENTS_[blockContainer];
            if (containerCanContain & groups) {
              if (nOpenElements <
                  goog.labs.html.scrubber.BALANCE_NESTING_LIMIT_) {
                prefix = '<' + blockContainer + '>';
              }
              openElementStack[nOpenElements] = blockContainer;
              ++nOpenElements;
            }
          }
        }
      }

      // Insert any missing close tags we need.
      var newStackLen = goog.labs.html.scrubber.pickElementsToClose_(
          lowerCaseTagName, isCloseTag, openElementStack);

      var nClosed = nOpenElements - newStackLen;
      if (nClosed) {  // ["p", "a", "b"] -> "</b></a></p>"
        // First, dump anything past the nesting limit.
        if (nOpenElements > goog.labs.html.scrubber.BALANCE_NESTING_LIMIT_) {
          nClosed -= nOpenElements -
              goog.labs.html.scrubber.BALANCE_NESTING_LIMIT_;
          nOpenElements = goog.labs.html.scrubber.BALANCE_NESTING_LIMIT_;
        }
        // Truncate to the new limit, and produce end tags.
        var closeTags = openElementStack.splice(newStackLen, nClosed);
        if (closeTags.length) {
          closeTags.reverse();
          prefix += '</' + closeTags.join('></') + '>';
        }
      }

      // We could do resumption here to handle misnested tags like
      //    <b><i class="c">Foo</b>Bar</i>
      // which is equivalent to
      //    <b><i class="c">Foo</i></b><i class="c">Bar</i>
      // but that requires storing attributes on the open element stack
      // which complicates all the code using it for marginal added value.

      if (isCloseTag) {
        // If the close tag matched an open tag, then the closed section
        // included that tag name.
        htmlTokens[i] = prefix;
      } else {
        if (!isVoidTag) {
          openElementStack[openElementStack.length] = lowerCaseTagName;
        }
        if (openElementStack.length >
            goog.labs.html.scrubber.BALANCE_NESTING_LIMIT_) {
          htmlToken = '';
        }
        htmlTokens[i] = prefix + htmlToken;
      }
    }
  }
  if (openElementStack.length) {
    if (openElementStack.length >
        goog.labs.html.scrubber.BALANCE_NESTING_LIMIT_) {
      openElementStack.length = goog.labs.html.scrubber.BALANCE_NESTING_LIMIT_;
    }
    if (openElementStack.length) {
      openElementStack.reverse();
      htmlTokens[htmlTokens.length] = '</' + openElementStack.join('></') + '>';
    }
  }
  return htmlTokens;
***REMOVED***


***REMOVED***
***REMOVED*** Normalizes HTML tokens and concatenates them into a string.
***REMOVED*** @param {Array.<string>} htmlTokens an array of HTML tokens as returned by
***REMOVED***    {@link goog.labs.html.scrubber.lex}.
***REMOVED*** @return {string} a string of HTML.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.render_ = function(htmlTokens) {
  for (var i = 0, n = htmlTokens.length; i < n; ++i) {
    var htmlToken = htmlTokens[i];
    if (htmlToken.charCodeAt(0) === goog.labs.html.scrubber.CC_LT_ &&
        goog.labs.html.scrubber.TAG_RE_.test(htmlToken)) {
      // The well-formedness and quotedness of attributes must be ensured by
      // earlier passes.  filter does this.
    } else {
      if (htmlToken.indexOf('<') >= 0) {
        htmlToken = htmlToken.replace(/</g, '&lt;');
      }
      if (htmlToken.indexOf('>') >= 0) {
        htmlToken = htmlToken.replace(/>/g, '&gt;');
      }
      htmlTokens[i] = htmlToken;
    }
  }
  return htmlTokens.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Groups of elements used to specify containment relationships.
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.Group_ = {
  BLOCK_: (1 << 0),
  INLINE_: (1 << 1),
  INLINE_MINUS_A_: (1 << 2),
  MIXED_: (1 << 3),
  TABLE_CONTENT_: (1 << 4),
  HEAD_CONTENT_: (1 << 5),
  TOP_CONTENT_: (1 << 6),
  AREA_ELEMENT_: (1 << 7),
  FORM_ELEMENT_: (1 << 8),
  LEGEND_ELEMENT_: (1 << 9),
  LI_ELEMENT_: (1 << 10),
  DL_PART_: (1 << 11),
  P_ELEMENT_: (1 << 12),
  OPTIONS_ELEMENT_: (1 << 13),
  OPTION_ELEMENT_: (1 << 14),
  PARAM_ELEMENT_: (1 << 15),
  TABLE_ELEMENT_: (1 << 16),
  TR_ELEMENT_: (1 << 17),
  TD_ELEMENT_: (1 << 18),
  COL_ELEMENT_: (1 << 19),
  CHARACTER_DATA_: (1 << 20)
***REMOVED***


***REMOVED***
***REMOVED*** Element scopes limit where close tags can have effects.
***REMOVED*** For example, a table cannot be implicitly closed by a {@code </p>} even if
***REMOVED*** the table appears inside a {@code <p>} because the {@code <table>} element
***REMOVED*** introduces a scope.
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.Scope_ = {
  COMMON_: (1 << 0),
  BUTTON_: (1 << 1),
  LIST_ITEM_: (1 << 2),
  TABLE_: (1 << 3)
***REMOVED***


***REMOVED*** @const @private***REMOVED***
goog.labs.html.scrubber.ALL_SCOPES_ =
    goog.labs.html.scrubber.Scope_.COMMON_ |
    goog.labs.html.scrubber.Scope_.BUTTON_ |
    goog.labs.html.scrubber.Scope_.LIST_ITEM_ |
    goog.labs.html.scrubber.Scope_.TABLE_;


***REMOVED***
***REMOVED*** Picks which open HTML elements to close.
***REMOVED***
***REMOVED*** @param {string}         lowerCaseTagName The name of the tag.
***REMOVED*** @param {boolean}        isCloseTag       True for a {@code </tagname>} tag.
***REMOVED*** @param {Array.<string>} openElementStack The names of elements that have been
***REMOVED***                                          opened and not subsequently closed.
***REMOVED*** @return {number} the length of openElementStack after closing any tags that
***REMOVED***               need to be closed.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.pickElementsToClose_ =
    function(lowerCaseTagName, isCloseTag, openElementStack) {
  var nOpenElements = openElementStack.length;
  if (isCloseTag) {
    // Look for a matching close tag inside blocking scopes.
    var topMost;
    if (/^h[1-6]$/.test(lowerCaseTagName)) {
      // </h1> will close any header.
      topMost = -1;
      for (var i = nOpenElements; --i >= 0;) {
        if (/^h[1-6]$/.test(openElementStack[i])) {
          topMost = i;
        }
      }
    } else {
      topMost = goog.array.lastIndexOf(openElementStack, lowerCaseTagName);
    }
    if (topMost >= 0) {
      var blockers = goog.labs.html.scrubber.ALL_SCOPES_ &
          ~(goog.labs.html.scrubber.ELEMENT_SCOPES_[lowerCaseTagName] | 0);
      for (var i = nOpenElements; --i > topMost;) {
        var blocks =
            goog.labs.html.scrubber.ELEMENT_SCOPES_[openElementStack[i]] | 0;
        if (blockers & blocks) {
          return nOpenElements;
        }
      }
      return topMost;
    }
    return nOpenElements;
  } else {
    // Close anything that cannot contain the tag name.
    var groups = goog.labs.html.scrubber.ELEMENT_GROUPS_[lowerCaseTagName];
    if (groups === undefined) {
      groups = goog.labs.html.scrubber.Group_.INLINE_;
    }
    for (var i = nOpenElements; --i >= 0;) {
      var canContain =
          goog.labs.html.scrubber.ELEMENT_CONTENTS_[openElementStack[i]];
      if (canContain === undefined) {
        canContain = goog.labs.html.scrubber.Group_.INLINE_;
      }
      if (groups & canContain) {
        return i + 1;
      }
    }
    return 0;
  }
***REMOVED***


***REMOVED***
***REMOVED*** The groups into which the element falls.
***REMOVED*** The default is an inline element.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.ELEMENT_GROUPS_ = {
  'a': goog.labs.html.scrubber.Group_.INLINE_,
  'abbr': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'acronym': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'address': goog.labs.html.scrubber.Group_.BLOCK_,
  'applet': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'area': goog.labs.html.scrubber.Group_.AREA_ELEMENT_,
  'audio': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'b': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'base': goog.labs.html.scrubber.Group_.HEAD_CONTENT_,
  'basefont': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'bdi': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'bdo': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'big': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'blink': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'blockquote': goog.labs.html.scrubber.Group_.BLOCK_,
  'body': goog.labs.html.scrubber.Group_.TOP_CONTENT_,
  'br': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'button': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'canvas': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'caption': goog.labs.html.scrubber.Group_.TABLE_CONTENT_,
  'center': goog.labs.html.scrubber.Group_.BLOCK_,
  'cite': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'code': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'col': goog.labs.html.scrubber.Group_.TABLE_CONTENT_ |
      goog.labs.html.scrubber.Group_.COL_ELEMENT_,
  'colgroup': goog.labs.html.scrubber.Group_.TABLE_CONTENT_,
  'dd': goog.labs.html.scrubber.Group_.DL_PART_,
  'del': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.MIXED_,
  'dfn': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'dir': goog.labs.html.scrubber.Group_.BLOCK_,
  'div': goog.labs.html.scrubber.Group_.BLOCK_,
  'dl': goog.labs.html.scrubber.Group_.BLOCK_,
  'dt': goog.labs.html.scrubber.Group_.DL_PART_,
  'em': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'fieldset': goog.labs.html.scrubber.Group_.BLOCK_,
  'font': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'form': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.FORM_ELEMENT_,
  'h1': goog.labs.html.scrubber.Group_.BLOCK_,
  'h2': goog.labs.html.scrubber.Group_.BLOCK_,
  'h3': goog.labs.html.scrubber.Group_.BLOCK_,
  'h4': goog.labs.html.scrubber.Group_.BLOCK_,
  'h5': goog.labs.html.scrubber.Group_.BLOCK_,
  'h6': goog.labs.html.scrubber.Group_.BLOCK_,
  'head': goog.labs.html.scrubber.Group_.TOP_CONTENT_,
  'hr': goog.labs.html.scrubber.Group_.BLOCK_,
  'html': 0,
  'i': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'iframe': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'img': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'input': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'ins': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_,
  'isindex': goog.labs.html.scrubber.Group_.INLINE_,
  'kbd': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'label': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'legend': goog.labs.html.scrubber.Group_.LEGEND_ELEMENT_,
  'li': goog.labs.html.scrubber.Group_.LI_ELEMENT_,
  'link': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.HEAD_CONTENT_,
  'listing': goog.labs.html.scrubber.Group_.BLOCK_,
  'map': goog.labs.html.scrubber.Group_.INLINE_,
  'meta': goog.labs.html.scrubber.Group_.HEAD_CONTENT_,
  'nobr': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'noframes': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.TOP_CONTENT_,
  'noscript': goog.labs.html.scrubber.Group_.BLOCK_,
  'object': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_ |
      goog.labs.html.scrubber.Group_.HEAD_CONTENT_,
  'ol': goog.labs.html.scrubber.Group_.BLOCK_,
  'optgroup': goog.labs.html.scrubber.Group_.OPTIONS_ELEMENT_,
  'option': goog.labs.html.scrubber.Group_.OPTIONS_ELEMENT_ |
      goog.labs.html.scrubber.Group_.OPTION_ELEMENT_,
  'p': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.P_ELEMENT_,
  'param': goog.labs.html.scrubber.Group_.PARAM_ELEMENT_,
  'pre': goog.labs.html.scrubber.Group_.BLOCK_,
  'q': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  's': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'samp': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'script': (goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_ |
      goog.labs.html.scrubber.Group_.MIXED_ |
      goog.labs.html.scrubber.Group_.TABLE_CONTENT_ |
      goog.labs.html.scrubber.Group_.HEAD_CONTENT_ |
      goog.labs.html.scrubber.Group_.TOP_CONTENT_ |
      goog.labs.html.scrubber.Group_.AREA_ELEMENT_ |
      goog.labs.html.scrubber.Group_.FORM_ELEMENT_ |
      goog.labs.html.scrubber.Group_.LEGEND_ELEMENT_ |
      goog.labs.html.scrubber.Group_.LI_ELEMENT_ |
      goog.labs.html.scrubber.Group_.DL_PART_ |
      goog.labs.html.scrubber.Group_.P_ELEMENT_ |
      goog.labs.html.scrubber.Group_.OPTIONS_ELEMENT_ |
      goog.labs.html.scrubber.Group_.OPTION_ELEMENT_ |
      goog.labs.html.scrubber.Group_.PARAM_ELEMENT_ |
      goog.labs.html.scrubber.Group_.TABLE_ELEMENT_ |
      goog.labs.html.scrubber.Group_.TR_ELEMENT_ |
      goog.labs.html.scrubber.Group_.TD_ELEMENT_ |
      goog.labs.html.scrubber.Group_.COL_ELEMENT_),
  'select': goog.labs.html.scrubber.Group_.INLINE_,
  'small': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'span': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'strike': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'strong': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'style': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.HEAD_CONTENT_,
  'sub': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'sup': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'table': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.TABLE_ELEMENT_,
  'tbody': goog.labs.html.scrubber.Group_.TABLE_CONTENT_,
  'td': goog.labs.html.scrubber.Group_.TD_ELEMENT_,
  'textarea': goog.labs.html.scrubber.Group_.INLINE_,
  'tfoot': goog.labs.html.scrubber.Group_.TABLE_CONTENT_,
  'th': goog.labs.html.scrubber.Group_.TD_ELEMENT_,
  'thead': goog.labs.html.scrubber.Group_.TABLE_CONTENT_,
  'title': goog.labs.html.scrubber.Group_.HEAD_CONTENT_,
  'tr': goog.labs.html.scrubber.Group_.TABLE_CONTENT_ |
      goog.labs.html.scrubber.Group_.TR_ELEMENT_,
  'tt': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'u': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'ul': goog.labs.html.scrubber.Group_.BLOCK_,
  'var': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'video': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'wbr': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'xmp': goog.labs.html.scrubber.Group_.BLOCK_
***REMOVED***


***REMOVED***
***REMOVED*** The groups which the element can contain.
***REMOVED*** Defaults to 0.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.ELEMENT_CONTENTS_ = {
  'a': goog.labs.html.scrubber.Group_.INLINE_MINUS_A_,
  'abbr': goog.labs.html.scrubber.Group_.INLINE_,
  'acronym': goog.labs.html.scrubber.Group_.INLINE_,
  'address': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.P_ELEMENT_,
  'applet': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.PARAM_ELEMENT_,
  'b': goog.labs.html.scrubber.Group_.INLINE_,
  'bdi': goog.labs.html.scrubber.Group_.INLINE_,
  'bdo': goog.labs.html.scrubber.Group_.INLINE_,
  'big': goog.labs.html.scrubber.Group_.INLINE_,
  'blink': goog.labs.html.scrubber.Group_.INLINE_,
  'blockquote': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_,
  'body': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_,
  'button': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_,
  'canvas': goog.labs.html.scrubber.Group_.INLINE_,
  'caption': goog.labs.html.scrubber.Group_.INLINE_,
  'center': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_,
  'cite': goog.labs.html.scrubber.Group_.INLINE_,
  'code': goog.labs.html.scrubber.Group_.INLINE_,
  'colgroup': goog.labs.html.scrubber.Group_.COL_ELEMENT_,
  'dd': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_,
  'del': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_,
  'dfn': goog.labs.html.scrubber.Group_.INLINE_,
  'dir': goog.labs.html.scrubber.Group_.LI_ELEMENT_,
  'div': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_,
  'dl': goog.labs.html.scrubber.Group_.DL_PART_,
  'dt': goog.labs.html.scrubber.Group_.INLINE_,
  'em': goog.labs.html.scrubber.Group_.INLINE_,
  'fieldset': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.LEGEND_ELEMENT_,
  'font': goog.labs.html.scrubber.Group_.INLINE_,
  'form': (goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.INLINE_MINUS_A_ |
      goog.labs.html.scrubber.Group_.TR_ELEMENT_ |
      goog.labs.html.scrubber.Group_.TD_ELEMENT_),
  'h1': goog.labs.html.scrubber.Group_.INLINE_,
  'h2': goog.labs.html.scrubber.Group_.INLINE_,
  'h3': goog.labs.html.scrubber.Group_.INLINE_,
  'h4': goog.labs.html.scrubber.Group_.INLINE_,
  'h5': goog.labs.html.scrubber.Group_.INLINE_,
  'h6': goog.labs.html.scrubber.Group_.INLINE_,
  'head': goog.labs.html.scrubber.Group_.HEAD_CONTENT_,
  'html': goog.labs.html.scrubber.Group_.TOP_CONTENT_,
  'i': goog.labs.html.scrubber.Group_.INLINE_,
  'iframe': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_,
  'ins': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_,
  'kbd': goog.labs.html.scrubber.Group_.INLINE_,
  'label': goog.labs.html.scrubber.Group_.INLINE_,
  'legend': goog.labs.html.scrubber.Group_.INLINE_,
  'li': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_,
  'listing': goog.labs.html.scrubber.Group_.INLINE_,
  'map': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.AREA_ELEMENT_,
  'nobr': goog.labs.html.scrubber.Group_.INLINE_,
  'noframes': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.TOP_CONTENT_,
  'noscript': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_,
  'object': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.PARAM_ELEMENT_,
  'ol': goog.labs.html.scrubber.Group_.LI_ELEMENT_,
  'optgroup': goog.labs.html.scrubber.Group_.OPTIONS_ELEMENT_,
  'option': goog.labs.html.scrubber.Group_.CHARACTER_DATA_,
  'p': goog.labs.html.scrubber.Group_.INLINE_ |
      goog.labs.html.scrubber.Group_.TABLE_ELEMENT_,
  'pre': goog.labs.html.scrubber.Group_.INLINE_,
  'q': goog.labs.html.scrubber.Group_.INLINE_,
  's': goog.labs.html.scrubber.Group_.INLINE_,
  'samp': goog.labs.html.scrubber.Group_.INLINE_,
  'script': goog.labs.html.scrubber.Group_.CHARACTER_DATA_,
  'select': goog.labs.html.scrubber.Group_.OPTIONS_ELEMENT_,
  'small': goog.labs.html.scrubber.Group_.INLINE_,
  'span': goog.labs.html.scrubber.Group_.INLINE_,
  'strike': goog.labs.html.scrubber.Group_.INLINE_,
  'strong': goog.labs.html.scrubber.Group_.INLINE_,
  'style': goog.labs.html.scrubber.Group_.CHARACTER_DATA_,
  'sub': goog.labs.html.scrubber.Group_.INLINE_,
  'sup': goog.labs.html.scrubber.Group_.INLINE_,
  'table': goog.labs.html.scrubber.Group_.TABLE_CONTENT_ |
      goog.labs.html.scrubber.Group_.FORM_ELEMENT_,
  'tbody': goog.labs.html.scrubber.Group_.TR_ELEMENT_,
  'td': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_,
  'textarea': goog.labs.html.scrubber.Group_.CHARACTER_DATA_,
  'tfoot': goog.labs.html.scrubber.Group_.FORM_ELEMENT_ |
      goog.labs.html.scrubber.Group_.TR_ELEMENT_ |
      goog.labs.html.scrubber.Group_.TD_ELEMENT_,
  'th': goog.labs.html.scrubber.Group_.BLOCK_ |
      goog.labs.html.scrubber.Group_.INLINE_,
  'thead': goog.labs.html.scrubber.Group_.FORM_ELEMENT_ |
      goog.labs.html.scrubber.Group_.TR_ELEMENT_ |
      goog.labs.html.scrubber.Group_.TD_ELEMENT_,
  'title': goog.labs.html.scrubber.Group_.CHARACTER_DATA_,
  'tr': goog.labs.html.scrubber.Group_.FORM_ELEMENT_ |
      goog.labs.html.scrubber.Group_.TD_ELEMENT_,
  'tt': goog.labs.html.scrubber.Group_.INLINE_,
  'u': goog.labs.html.scrubber.Group_.INLINE_,
  'ul': goog.labs.html.scrubber.Group_.LI_ELEMENT_,
  'var': goog.labs.html.scrubber.Group_.INLINE_,
  'xmp': goog.labs.html.scrubber.Group_.INLINE_
***REMOVED***


***REMOVED***
***REMOVED*** The scopes in which an element falls.
***REMOVED*** No property defaults to 0.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.ELEMENT_SCOPES_ = {
  'applet': goog.labs.html.scrubber.Scope_.COMMON_ |
      goog.labs.html.scrubber.Scope_.BUTTON_ |
      goog.labs.html.scrubber.Scope_.LIST_ITEM_,
  'button': goog.labs.html.scrubber.Scope_.BUTTON_,
  'caption': goog.labs.html.scrubber.Scope_.COMMON_ |
      goog.labs.html.scrubber.Scope_.BUTTON_ |
      goog.labs.html.scrubber.Scope_.LIST_ITEM_,
  'html': goog.labs.html.scrubber.Scope_.COMMON_ |
      goog.labs.html.scrubber.Scope_.BUTTON_ |
      goog.labs.html.scrubber.Scope_.LIST_ITEM_ |
      goog.labs.html.scrubber.Scope_.TABLE_,
  'object': goog.labs.html.scrubber.Scope_.COMMON_ |
      goog.labs.html.scrubber.Scope_.BUTTON_ |
      goog.labs.html.scrubber.Scope_.LIST_ITEM_,
  'ol': goog.labs.html.scrubber.Scope_.LIST_ITEM_,
  'table': goog.labs.html.scrubber.Scope_.COMMON_ |
      goog.labs.html.scrubber.Scope_.BUTTON_ |
      goog.labs.html.scrubber.Scope_.LIST_ITEM_ |
      goog.labs.html.scrubber.Scope_.TABLE_,
  'td': goog.labs.html.scrubber.Scope_.COMMON_ |
      goog.labs.html.scrubber.Scope_.BUTTON_ |
      goog.labs.html.scrubber.Scope_.LIST_ITEM_,
  'th': goog.labs.html.scrubber.Scope_.COMMON_ |
      goog.labs.html.scrubber.Scope_.BUTTON_ |
      goog.labs.html.scrubber.Scope_.LIST_ITEM_,
  'ul': goog.labs.html.scrubber.Scope_.LIST_ITEM_
***REMOVED***


***REMOVED***
***REMOVED*** Per-element, a child that can contain block content.
***REMOVED*** @private
***REMOVED***
goog.labs.html.scrubber.BLOCK_CONTAINERS_ = {
  'dl': 'dd',
  'ol': 'li',
  'table': 'tr',
  'tr': 'td',
  'ul': 'li'
***REMOVED***


goog.labs.html.attributeRewriterPresubmitWorkaround();
