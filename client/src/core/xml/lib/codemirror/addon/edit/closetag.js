***REMOVED***
***REMOVED*** Tag-closer extension for CodeMirror.
***REMOVED***
***REMOVED*** This extension adds an "autoCloseTags" option that can be set to
***REMOVED*** either true to get the default behavior, or an object to further
***REMOVED*** configure its behavior.
***REMOVED***
***REMOVED*** These are supported options:
***REMOVED***
***REMOVED*** `whenClosing` (default true)
***REMOVED***   Whether to autoclose when the '/' of a closing tag is typed.
***REMOVED*** `whenOpening` (default true)
***REMOVED***   Whether to autoclose the tag when the final '>' of an opening
***REMOVED***   tag is typed.
***REMOVED*** `dontCloseTags` (default is empty tags for HTML, none for XML)
***REMOVED***   An array of tag names that should not be autoclosed.
***REMOVED*** `indentTags` (default is block tags for HTML, none for XML)
***REMOVED***   An array of tag names that should, when opened, cause a
***REMOVED***   blank line to be added inside the tag, and the blank line and
***REMOVED***   closing line to be indented.
***REMOVED***
***REMOVED*** See demos/closetag.html for a usage example.
***REMOVED***

(function() {
  CodeMirror.defineOption("autoCloseTags", false, function(cm, val, old) {
    if (val && (old == CodeMirror.Init || !old)) {
      var map = {name: "autoCloseTags"***REMOVED***
      if (typeof val != "object" || val.whenClosing)
        map["'/'"] = function(cm) { return autoCloseSlash(cm);***REMOVED*****REMOVED***
      if (typeof val != "object" || val.whenOpening)
        map["'>'"] = function(cm) { return autoCloseGT(cm);***REMOVED*****REMOVED***
      cm.addKeyMap(map);
    } else if (!val && (old != CodeMirror.Init && old)) {
      cm.removeKeyMap("autoCloseTags");
    }
  });

  var htmlDontClose = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param",
                       "source", "track", "wbr"];
  var htmlIndent = ["applet", "blockquote", "body", "button", "div", "dl", "fieldset", "form", "frameset", "h1", "h2", "h3", "h4",
                    "h5", "h6", "head", "html", "iframe", "layer", "legend", "object", "ol", "p", "select", "table", "ul"];

  function autoCloseGT(cm) {
    var pos = cm.getCursor(), tok = cm.getTokenAt(pos);
    var inner = CodeMirror.innerMode(cm.getMode(), tok.state), state = inner.state;
    if (inner.mode.name != "xml" || !state.tagName) return CodeMirror.Pass;

    var opt = cm.getOption("autoCloseTags"), html = inner.mode.configuration == "html";
    var dontCloseTags = (typeof opt == "object" && opt.dontCloseTags) || (html && htmlDontClose);
    var indentTags = (typeof opt == "object" && opt.indentTags) || (html && htmlIndent);

    var tagName = state.tagName;
    if (tok.end > pos.ch) tagName = tagName.slice(0, tagName.length - tok.end + pos.ch);
    var lowerTagName = tagName.toLowerCase();
    // Don't process the '>' at the end of an end-tag or self-closing tag
    if (tok.type == "tag" && state.type == "closeTag" ||
        tok.string.indexOf("/") == (tok.string.length - 1) || // match something like <someTagName />
        dontCloseTags && indexOf(dontCloseTags, lowerTagName) > -1)
      return CodeMirror.Pass;

    var doIndent = indentTags && indexOf(indentTags, lowerTagName) > -1;
    var curPos = doIndent ? CodeMirror.Pos(pos.line + 1, 0) : CodeMirror.Pos(pos.line, pos.ch + 1);
    cm.replaceSelection(">" + (doIndent ? "\n\n" : "") + "</" + tagName + ">",
                        {head: curPos, anchor: curPos});
    if (doIndent) {
      cm.indentLine(pos.line + 1);
      cm.indentLine(pos.line + 2);
    }
  }

  function autoCloseSlash(cm) {
    var pos = cm.getCursor(), tok = cm.getTokenAt(pos);
    var inner = CodeMirror.innerMode(cm.getMode(), tok.state), state = inner.state;
    if (tok.string.charAt(0) != "<" || inner.mode.name != "xml") return CodeMirror.Pass;

    var tagName = state.context && state.context.tagName;
    if (tagName) cm.replaceSelection("/" + tagName + ">", "end");
  }

  function indexOf(collection, elt) {
    if (collection.indexOf) return collection.indexOf(elt);
    for (var i = 0, e = collection.length; i < e; ++i)
      if (collection[i] == elt) return i;
    return -1;
  }
})();
