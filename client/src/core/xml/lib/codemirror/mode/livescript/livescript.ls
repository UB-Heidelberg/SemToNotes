***REMOVED***
***REMOVED*** Link to the project's GitHub page:
***REMOVED*** https://github.com/duralog/CodeMirror
***REMOVED***
CodeMirror.defineMode 'livescript', (conf) ->
  tokenBase = (stream, state) ->
    #indent =
    if next_rule = state.next or \start
      state.next = state.next
      if Array.isArray nr = Rules[next_rule]
        for r in nr
          if r.regex and m = stream.match r.regex
            state.next = r.next
            return r.token
        stream.next!
        return \error
      if stream.match r = Rules[next_rule]
        if r.regex and stream.match r.regex
          state.next = r.next
          return r.token
        else
          stream.next!
          return \error
    stream.next!
    return 'error'
  external = {
    startState: (basecolumn) ->
      {
        next: \start
        lastToken: null
      }
    token: (stream, state) ->
      style = tokenBase stream, state #tokenLexer stream, state
      state.lastToken = {
        style: style
        indent: stream.indentation!
        content: stream.current!
      }
      style.replace /\./g, ' '
    indent: (state, textAfter) ->
      # XXX this won't work with backcalls
      indentation = state.lastToken.indent
      if state.lastToken.content.match indenter then indentation += 2
      return indentation
  }
  external

### Highlight Rules
# taken from mode-ls.ls

indenter = // (?
    : [({[=:]
    | [-~]>
    | \b (?: e(?:lse|xport) | d(?:o|efault) | t(?:ry|hen) | finally |
             import (?:\s* all)? | const | var |
             let | new | catch (?:\s* #identifier)? )
  ) \s* $ //

identifier = /(?![\d\s])[$\w\xAA-\uFFDC](?:(?!\s)[$\w\xAA-\uFFDC]|-[A-Za-z])*/$
keywordend = /(?![$\w]|-[A-Za-z]|\s*:(?![:=]))/$
stringfill = token: \string, regex: '.+'

Rules =
  start:
   ***REMOVED*** token: \comment.doc
      regex: '/\\*'
      next : \comment

   ***REMOVED*** token: \comment
      regex: '#.*'

   ***REMOVED*** token: \keyword
      regex: //(?
        :t(?:h(?:is|row|en)|ry|ypeof!?)
        |c(?:on(?:tinue|st)|a(?:se|tch)|lass)
        |i(?:n(?:stanceof)?|mp(?:ort(?:\s+all)?|lements)|[fs])
        |d(?:e(?:fault|lete|bugger)|o)
        |f(?:or(?:\s+own)?|inally|unction)
        |s(?:uper|witch)
        |e(?:lse|x(?:tends|port)|val)
        |a(?:nd|rguments)
        |n(?:ew|ot)
        |un(?:less|til)
        |w(?:hile|ith)
        |o[fr]|return|break|let|var|loop
      )//$ + keywordend

   ***REMOVED*** token: \constant.language
      regex: '(?:true|false|yes|no|on|off|null|void|undefined)' + keywordend

   ***REMOVED*** token: \invalid.illegal
      regex: '(?
        :p(?:ackage|r(?:ivate|otected)|ublic)
        |i(?:mplements|nterface)
        |enum|static|yield
      )' + keywordend

   ***REMOVED*** token: \language.support.class
      regex: '(?
        :R(?:e(?:gExp|ferenceError)|angeError)
        |S(?:tring|yntaxError)
        |E(?:rror|valError)
        |Array|Boolean|Date|Function|Number|Object|TypeError|URIError
      )' + keywordend

   ***REMOVED*** token: \language.support.function
      regex: '(?
        :is(?:NaN|Finite)
        |parse(?:Int|Float)
        |Math|JSON
        |(?:en|de)codeURI(?:Component)?
      )' + keywordend

   ***REMOVED*** token: \variable.language
      regex: '(?:t(?:hat|il|o)|f(?:rom|allthrough)|it|by|e)' + keywordend

   ***REMOVED*** token: \identifier
      regex: identifier + /\s*:(?![:=])/$

   ***REMOVED*** token: \variable
      regex: identifier

   ***REMOVED*** token: \keyword.operator
      regex: /(?:\.{3}|\s+\?)/$

   ***REMOVED*** token: \keyword.variable
      regex: /(?:@+|::|\.\.)/$
      next : \key

   ***REMOVED*** token: \keyword.operator
      regex: /\.\s*/$
      next : \key

   ***REMOVED*** token: \string
      regex: /\\\S[^\s,;)}\]]*/$

   ***REMOVED*** token: \string.doc
      regex: \'''
      next : \qdoc

   ***REMOVED*** token: \string.doc
      regex: \"""
      next : \qqdoc

   ***REMOVED*** token: \string
      regex: \'
      next : \qstring

   ***REMOVED*** token: \string
      regex: \"
      next : \qqstring

   ***REMOVED*** token: \string
      regex: \`
      next : \js

   ***REMOVED*** token: \string
      regex: '<\\['
      next : \words

   ***REMOVED*** token: \string.regex
      regex: \//
      next : \heregex

   ***REMOVED*** token: \string.regex
      regex: //
        /(?: [^ [ / \n \\ ]*
          (?: (?: \\.
                | \[ [^\]\n\\]* (?:\\.[^\]\n\\]*)* \]
              ) [^ [ / \n \\ ]*
          )*
        )/ [gimy$]{0,4}
      //$
      next : \key

   ***REMOVED*** token: \constant.numeric
      regex: '(?:0x[\\da-fA-F][\\da-fA-F_]*
                |(?:[2-9]|[12]\\d|3[0-6])r[\\da-zA-Z][\\da-zA-Z_]*
                |(?:\\d[\\d_]*(?:\\.\\d[\\d_]*)?|\\.\\d[\\d_]*)
                 (?:e[+-]?\\d[\\d_]*)?[\\w$]*)'

   ***REMOVED*** token: \lparen
      regex: '[({[]'

   ***REMOVED*** token: \rparen
      regex: '[)}\\]]'
      next : \key

   ***REMOVED*** token: \keyword.operator
      regex: \\\S+

   ***REMOVED*** token: \text
      regex: \\\s+

  heregex:
   ***REMOVED*** token: \string.regex
      regex: '.*?//[gimy$?]{0,4}'
      next : \start
   ***REMOVED*** token: \string.regex
      regex: '\\s*#{'
   ***REMOVED*** token: \comment.regex
      regex: '\\s+(?:#.*)?'
   ***REMOVED*** token: \string.regex
      regex: '\\S+'

  key:
   ***REMOVED*** token: \keyword.operator
      regex: '[.?@!]+'
   ***REMOVED*** token: \identifier
      regex: identifier
      next : \start
   ***REMOVED*** token: \text
      regex: '.'
      next : \start

  comment:
   ***REMOVED*** token: \comment.doc
      regex: '.*?\\*/'
      next : \start
   ***REMOVED*** token: \comment.doc
      regex: '.+'

  qdoc:
    token: \string
    regex: ".*?'''"
    next : \key
    stringfill

  qqdoc:
    token: \string
    regex: '.*?"""'
    next : \key
    stringfill

  qstring:
    token: \string
    regex: /[^\\']*(?:\\.[^\\']*)*'/$
    next : \key
    stringfill

  qqstring:
    token: \string
    regex: /[^\\"]*(?:\\.[^\\"]*)*"/$
    next : \key
    stringfill

  js:
    token: \string
    regex: /[^\\`]*(?:\\.[^\\`]*)*`/$
    next : \key
    stringfill

  words:
    token: \string
    regex: '.*?\\]>'
    next : \key
    stringfill

# for optimization, precompile the regexps
for idx, r of Rules
  if Array.isArray r
    for rr, i in r
      if rr.regex then Rules[idx][i].regex = new RegExp '^'+rr.regex
  else if r.regex then Rules[idx].regex = new RegExp '^'+r.regex

CodeMirror.defineMIME 'text/x-livescript', 'livescript'
