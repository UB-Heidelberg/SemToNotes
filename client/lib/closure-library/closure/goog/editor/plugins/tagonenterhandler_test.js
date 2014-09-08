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

goog.provide('goog.editor.plugins.TagOnEnterHandlerTest');
goog.setTestOnly('goog.editor.plugins.TagOnEnterHandlerTest');

goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.Range');
goog.require('goog.dom.TagName');
goog.require('goog.editor.BrowserFeature');
goog.require('goog.editor.Field');
goog.require('goog.editor.Plugin');
goog.require('goog.editor.plugins.TagOnEnterHandler');
goog.require('goog.events.KeyCodes');
goog.require('goog.string.Unicode');
goog.require('goog.testing.dom');
goog.require('goog.testing.editor.TestHelper');
goog.require('goog.testing.events');
goog.require('goog.testing.jsunit');
goog.require('goog.userAgent');

var savedHtml;

var editor;
var field1;

function setUp() {
  field1 = makeField('field1');
  field1.makeEditable();
}


***REMOVED***
***REMOVED*** Tests that deleting a BR that comes right before a block element works.
***REMOVED*** @bug 1471096
***REMOVED***
function testDeleteBrBeforeBlock() {
  // This test only works on Gecko, because it's testing for manual deletion of
  // BR tags, which is done only for Gecko. For other browsers we fall through
  // and let the browser do the delete, which can only be tested with a robot
  // test (see javascript/apps/editor/tests/delete_br_robot.html).
  if (goog.userAgent.GECKO) {

    field1.setHtml(false, 'one<br><br><div>two</div>');
    var helper = new goog.testing.editor.TestHelper(field1.getElement());
    helper.select(field1.getElement(), 2); // Between the two BR's.
    goog.testing.events.fireKeySequence(field1.getElement(),
                                        goog.events.KeyCodes.DELETE);
    assertEquals('Should have deleted exactly one <br>',
                 'one<br><div>two</div>',
                 field1.getElement().innerHTML);

  } // End if GECKO
}


***REMOVED***
***REMOVED*** Tests that deleting a BR is working normally (that the workaround for the
***REMOVED*** bug is not causing double deletes).
***REMOVED*** @bug 1471096
***REMOVED***
function testDeleteBrNormal() {
  // This test only works on Gecko, because it's testing for manual deletion of
  // BR tags, which is done only for Gecko. For other browsers we fall through
  // and let the browser do the delete, which can only be tested with a robot
  // test (see javascript/apps/editor/tests/delete_br_robot.html).
  if (goog.userAgent.GECKO) {

    field1.setHtml(false, 'one<br><br><br>two');
    var helper = new goog.testing.editor.TestHelper(field1.getElement());
    helper.select(field1.getElement(), 2); // Between the first and second BR's.
    field1.getElement().focus();
    goog.testing.events.fireKeySequence(field1.getElement(),
                                        goog.events.KeyCodes.DELETE);
    assertEquals('Should have deleted exactly one <br>',
                 'one<br><br>two',
                 field1.getElement().innerHTML);

  } // End if GECKO
}


***REMOVED***
***REMOVED*** Regression test for http://b/1991234 . Tests that when you hit enter and it
***REMOVED*** creates a blank line with whitespace and a BR, the cursor is placed in the
***REMOVED*** whitespace text node instead of the BR, otherwise continuing to type will
***REMOVED*** create adjacent text nodes, which causes browsers to mess up some
***REMOVED*** execcommands. Fix is in a Gecko-only codepath, thus test runs only for Gecko.
***REMOVED*** A full test for the entire sequence that reproed the bug is in
***REMOVED*** javascript/apps/editor/tests/ponenter_robot.html .
***REMOVED***
function testEnterCreatesBlankLine() {
  if (goog.userAgent.GECKO) {
    field1.setHtml(false, '<p>one <br></p>');
    var helper = new goog.testing.editor.TestHelper(field1.getElement());
    // Place caret after 'one' but keeping a space and a BR as FF does.
    helper.select('one ', 3);
    field1.getElement().focus();
    goog.testing.events.fireKeySequence(field1.getElement(),
                                        goog.events.KeyCodes.ENTER);
    var range = field1.getRange();
    assertFalse('Selection should not be in BR tag',
                range.getStartNode().nodeType == goog.dom.NodeType.ELEMENT &&
                range.getStartNode().tagName == goog.dom.TagName.BR);
    assertEquals('Selection should be in text node to avoid creating adjacent' +
                 ' text nodes',
        goog.dom.NodeType.TEXT, range.getStartNode().nodeType);
    var rangeStartNode =
        goog.dom.Range.createFromNodeContents(range.getStartNode());
    assertHTMLEquals('The value of selected text node should be replaced with' +
        '&nbsp;',
        '&nbsp;', rangeStartNode.getHtmlFragment());
  }
}


***REMOVED***
***REMOVED*** Regression test for http://b/3051179 . Tests that when you hit enter and it
***REMOVED*** creates a blank line with a BR and the cursor is placed in P.
***REMOVED*** Splitting DOM causes to make an empty text node. Then if the cursor is placed
***REMOVED*** at the text node the cursor is shown at wrong location.
***REMOVED*** Therefore this test checks that the cursor is not placed at an empty node.
***REMOVED*** Fix is in a Gecko-only codepath, thus test runs only for Gecko.
***REMOVED***
function testEnterNormalizeNodes() {
  if (goog.userAgent.GECKO) {
    field1.setHtml(false, '<p>one<br></p>');
    var helper = new goog.testing.editor.TestHelper(field1.getElement());
    // Place caret after 'one' but keeping a BR as FF does.
    helper.select('one', 3);
    field1.getElement().focus();
    goog.testing.events.fireKeySequence(field1.getElement(),
                                        goog.events.KeyCodes.ENTER);
    var range = field1.getRange();
    assertTrue('Selection should be in P tag',
        range.getStartNode().nodeType == goog.dom.NodeType.ELEMENT &&
        range.getStartNode().tagName == goog.dom.TagName.P);
    assertTrue('Selection should be at the head and collapsed',
        range.getStartOffset() == 0 && range.isCollapsed());
  }
}


***REMOVED***
***REMOVED*** Verifies
***REMOVED*** goog.editor.plugins.TagOnEnterHandler.prototype.handleRegularEnterGecko_
***REMOVED*** when we explicitly split anchor elements. This test runs only for Gecko
***REMOVED*** since this is a Gecko-only codepath.
***REMOVED***
function testEnterAtBeginningOfLink() {
  if (goog.userAgent.GECKO) {
    field1.setHtml(false, '<a href="/">b<br></a>');
    var helper = new goog.testing.editor.TestHelper(field1.getElement());
    field1.focusAndPlaceCursorAtStart();
    goog.testing.events.fireKeySequence(field1.getElement(),
                                        goog.events.KeyCodes.ENTER);
    helper.assertHtmlMatches(
        '<p>&nbsp;</p><p><a href="/">b<br></a></p>');
  }
}


***REMOVED***
***REMOVED*** Verifies correct handling of pressing enter in an empty list item.
***REMOVED***
function testEnterInEmptyListItemInEmptyList() {
  if (goog.userAgent.GECKO) {
    field1.setHtml(false, '<ul><li>&nbsp;</li></ul>');
    var helper = new goog.testing.editor.TestHelper(field1.getElement());
    var li = field1.getElement().getElementsByTagName(goog.dom.TagName.LI)[0];
    helper.select(li.firstChild, 0);
    goog.testing.events.fireKeySequence(field1.getElement(),
                                        goog.events.KeyCodes.ENTER);
    helper.assertHtmlMatches('<p>&nbsp;</p>');
  }
}


function testEnterInEmptyListItemAtBeginningOfList() {
  if (goog.userAgent.GECKO) {
    field1.setHtml(false,
        '<ul style="font-weight: bold">' +
            '<li>&nbsp;</li>' +
            '<li>1</li>' +
            '<li>2</li>' +
        '</ul>');
    var helper = new goog.testing.editor.TestHelper(field1.getElement());
    var li = field1.getElement().getElementsByTagName(goog.dom.TagName.LI)[0];
    helper.select(li.firstChild, 0);
    goog.testing.events.fireKeySequence(field1.getElement(),
                                        goog.events.KeyCodes.ENTER);
    helper.assertHtmlMatches(
        '<p>&nbsp;</p><ul style="font-weight: bold"><li>1</li><li>2</li></ul>');
  }
}


function testEnterInEmptyListItemAtEndOfList() {
  if (goog.userAgent.GECKO) {
    field1.setHtml(false,
        '<ul style="font-weight: bold">' +
            '<li>1</li>' +
            '<li>2</li>' +
            '<li>&nbsp;</li>' +
        '</ul>');
    var helper = new goog.testing.editor.TestHelper(field1.getElement());
    var li = field1.getElement().getElementsByTagName(goog.dom.TagName.LI)[2];
    helper.select(li.firstChild, 0);
    goog.testing.events.fireKeySequence(field1.getElement(),
                                        goog.events.KeyCodes.ENTER);
    helper.assertHtmlMatches(
        '<ul style="font-weight: bold"><li>1</li><li>2</li></ul><p>&nbsp;</p>');
  }
}


function testEnterInEmptyListItemInMiddleOfList() {
  if (goog.userAgent.GECKO) {
    field1.setHtml(false,
        '<ul style="font-weight: bold">' +
            '<li>1</li>' +
            '<li>&nbsp;</li>' +
            '<li>2</li>' +
        '</ul>');
    var helper = new goog.testing.editor.TestHelper(field1.getElement());
    var li = field1.getElement().getElementsByTagName(goog.dom.TagName.LI)[1];
    helper.select(li.firstChild, 0);
    goog.testing.events.fireKeySequence(field1.getElement(),
                                        goog.events.KeyCodes.ENTER);
    helper.assertHtmlMatches(
        '<ul style="font-weight: bold"><li>1</li></ul>' +
        '<p>&nbsp;</p>' +
        '<ul style="font-weight: bold"><li>2</li></ul>');
  }
}


function testEnterInEmptyListItemInSublist() {
  if (goog.userAgent.GECKO) {
    field1.setHtml(false,
        '<ul>' +
        '<li>A</li>' +
        '<ul style="font-weight: bold">' +
        '<li>1</li>' +
        '<li>&nbsp;</li>' +
        '<li>2</li>' +
        '</ul>' +
        '<li>B</li>' +
        '</ul>');
    var helper = new goog.testing.editor.TestHelper(field1.getElement());
    var li = field1.getElement().getElementsByTagName(goog.dom.TagName.LI)[2];
    helper.select(li.firstChild, 0);
    goog.testing.events.fireKeySequence(field1.getElement(),
                                        goog.events.KeyCodes.ENTER);
    helper.assertHtmlMatches(
        '<ul>' +
        '<li>A</li>' +
        '<ul style="font-weight: bold"><li>1</li></ul>' +
        '<li>&nbsp;</li>' +
        '<ul style="font-weight: bold"><li>2</li></ul>' +
        '<li>B</li>' +
        '</ul>');
  }
}


function testEnterInEmptyListItemAtBeginningOfSublist() {
  if (goog.userAgent.GECKO) {
    field1.setHtml(false,
        '<ul>' +
        '<li>A</li>' +
        '<ul style="font-weight: bold">' +
        '<li>&nbsp;</li>' +
        '<li>1</li>' +
        '<li>2</li>' +
        '</ul>' +
        '<li>B</li>' +
        '</ul>');
    var helper = new goog.testing.editor.TestHelper(field1.getElement());
    var li = field1.getElement().getElementsByTagName(goog.dom.TagName.LI)[1];
    helper.select(li.firstChild, 0);
    goog.testing.events.fireKeySequence(field1.getElement(),
                                        goog.events.KeyCodes.ENTER);
    helper.assertHtmlMatches(
        '<ul>' +
        '<li>A</li>' +
        '<li>&nbsp;</li>' +
        '<ul style="font-weight: bold"><li>1</li><li>2</li></ul>' +
        '<li>B</li>' +
        '</ul>');
  }
}


function testEnterInEmptyListItemAtEndOfSublist() {
  if (goog.userAgent.GECKO) {
    field1.setHtml(false,
        '<ul>' +
        '<li>A</li>' +
        '<ul style="font-weight: bold">' +
        '<li>1</li>' +
        '<li>2</li>' +
        '<li>&nbsp;</li>' +
        '</ul>' +
        '<li>B</li>' +
        '</ul>');
    var helper = new goog.testing.editor.TestHelper(field1.getElement());
    var li = field1.getElement().getElementsByTagName(goog.dom.TagName.LI)[3];
    helper.select(li.firstChild, 0);
    goog.testing.events.fireKeySequence(field1.getElement(),
                                        goog.events.KeyCodes.ENTER);
    helper.assertHtmlMatches(
        '<ul>' +
        '<li>A</li>' +
        '<ul style="font-weight: bold"><li>1</li><li>2</li></ul>' +
        '<li>&nbsp;</li>' +
        '<li>B</li>' +
        '</ul>');
  }
}


function testPrepareContentForPOnEnter() {
  assertPreparedContents('hi', 'hi');
  assertPreparedContents(
      goog.editor.BrowserFeature.COLLAPSES_EMPTY_NODES ? '<p>&nbsp;</p>' : '',
      '   ');
}


function testPrepareContentForDivOnEnter() {
  assertPreparedContents('hi', 'hi', goog.dom.TagName.DIV);
  assertPreparedContents(
      goog.editor.BrowserFeature.COLLAPSES_EMPTY_NODES ? '<div><br></div>' : '',
      '   ',
      goog.dom.TagName.DIV);
}


***REMOVED***
***REMOVED*** Assert that the prepared contents matches the expected.
***REMOVED***
function assertPreparedContents(expected, original, opt_tag) {
  var field = makeField('field1', opt_tag);
  field.makeEditable();
  assertEquals(expected,
      field.reduceOp_(
          goog.editor.Plugin.Op.PREPARE_CONTENTS_HTML, original));
}


***REMOVED***
***REMOVED*** Selects the node at the given id, and simulates an ENTER keypress.
***REMOVED*** @param {googe.editor.Field} field The field with the node.
***REMOVED*** @param {string} id A DOM id.
***REMOVED*** @return {boolean} Whether preventDefault was called on the event.
***REMOVED***
function selectNodeAndHitEnter(field, id) {
  var cursor = field.getEditableDomHelper().getElement(id);
  goog.dom.Range.createFromNodeContents(cursor).select();
  return goog.testing.events.fireKeySequence(
      cursor, goog.events.KeyCodes.ENTER);
}


***REMOVED***
***REMOVED*** Creates a field with only the enter handler plugged in, for testing.
***REMOVED*** @param {string} id A DOM id.
***REMOVED*** @param {boolean=} opt_tag The block tag to use.  Defaults to P.
***REMOVED*** @return {goog.editor.Field} A field.
***REMOVED***
function makeField(id, opt_tag) {
  var field = new goog.editor.Field(id);
  field.registerPlugin(
      new goog.editor.plugins.TagOnEnterHandler(opt_tag || goog.dom.TagName.P));
  return field;
}


***REMOVED***
***REMOVED*** Runs a test for splitting the dom.
***REMOVED*** @param {number} offset Index into the text node to split.
***REMOVED*** @param {string} firstHalfString What the html of the first half of the DOM
***REMOVED***     should be.
***REMOVED*** @param {string} secondHalfString What the html of the 2nd half of the DOM
***REMOVED***     should be.
***REMOVED*** @param {boolean} isAppend True if the second half should be appended to the
***REMOVED***     DOM.
***REMOVED*** @param {boolean=} opt_goToRoot True if the root argument for splitDom should
***REMOVED***     be excluded.
***REMOVED***
function helpTestSplit_(offset, firstHalfString, secondHalfString, isAppend,
    opt_goToBody) {
  var node = document.createElement('div');
  node.innerHTML = '<b>begin bold<i>italic</i>end bold</b>';
  document.body.appendChild(node);

  var italic = node.getElementsByTagName('i')[0].firstChild;

  var splitFn = isAppend ?
      goog.editor.plugins.TagOnEnterHandler.splitDomAndAppend_ :
      goog.editor.plugins.TagOnEnterHandler.splitDom_;
  var secondHalf = splitFn(italic, offset, opt_goToBody ? undefined : node);

  if (opt_goToBody) {
    secondHalfString = '<div>' + secondHalfString + '</div>';
  }

  assertEquals('original node should have first half of the html',
               firstHalfString,
               node.innerHTML.toLowerCase().
      replace(goog.string.Unicode.NBSP, '&nbsp;'));
  assertEquals('new node should have second half of the html',
               secondHalfString,
               secondHalf.innerHTML.toLowerCase().
                   replace(goog.string.Unicode.NBSP, '&nbsp;'));

  if (isAppend) {
    assertTrue('second half of dom should be the original node\'s next' +
               'sibling', node.nextSibling == secondHalf);
    goog.dom.removeNode(secondHalf);
  }

  goog.dom.removeNode(node);
}


***REMOVED***
***REMOVED*** Runs different cases of splitting the DOM.
***REMOVED*** @param {function(number, string, string)} testFn Function that takes an
***REMOVED***     offset, firstHalfString and secondHalfString as parameters.
***REMOVED***
function splitDomCases_(testFn) {
  testFn(3, '<b>begin bold<i>ita</i></b>', '<b><i>lic</i>end bold</b>');
  testFn(0, '<b>begin bold<i>&nbsp;</i></b>', '<b><i>italic</i>end bold</b>');
  testFn(6, '<b>begin bold<i>italic</i></b>', '<b><i>&nbsp;</i>end bold</b>');
}


function testSplitDom() {
  splitDomCases_(function(offset, firstHalfString, secondHalfString) {
    helpTestSplit_(offset, firstHalfString, secondHalfString, false, true);
    helpTestSplit_(offset, firstHalfString, secondHalfString, false, false);
  });
}


function testSplitDomAndAppend() {
  splitDomCases_(function(offset, firstHalfString, secondHalfString) {
    helpTestSplit_(offset, firstHalfString, secondHalfString, true, false);
  });
}


function testSplitDomAtElement() {
  var node = document.createElement('div');
  node.innerHTML = '<div>abc<br>def</div>';
  document.body.appendChild(node);

  goog.editor.plugins.TagOnEnterHandler.splitDomAndAppend_(node.firstChild, 1,
      node.firstChild);

  goog.testing.dom.assertHtmlContentsMatch('<div>abc</div><div><br>def</div>',
      node);

  goog.dom.removeNode(node);
}


function testSplitDomAtElementStart() {
  var node = document.createElement('div');
  node.innerHTML = '<div>abc<br>def</div>';
  document.body.appendChild(node);

  goog.editor.plugins.TagOnEnterHandler.splitDomAndAppend_(node.firstChild, 0,
      node.firstChild);

  goog.testing.dom.assertHtmlContentsMatch('<div></div><div>abc<br>def</div>',
      node);

  goog.dom.removeNode(node);
}


function testSplitDomAtChildlessElement() {
  var node = document.createElement('div');
  node.innerHTML = '<div>abc<br>def</div>';
  document.body.appendChild(node);

  var br = node.getElementsByTagName(goog.dom.TagName.BR)[0];
  goog.editor.plugins.TagOnEnterHandler.splitDomAndAppend_(
      br, 0, node.firstChild);

  goog.testing.dom.assertHtmlContentsMatch('<div>abc</div><div><br>def</div>',
      node);

  goog.dom.removeNode(node);
}

function testReplaceWhiteSpaceWithNbsp() {
  var node = document.createElement('div');
  var textNode = document.createTextNode('');
  node.appendChild(textNode);

  textNode.nodeValue = ' test ';
  goog.editor.plugins.TagOnEnterHandler.replaceWhiteSpaceWithNbsp_(
      node.firstChild, true, false);
  assertHTMLEquals('&nbsp;test ', node.innerHTML);

  textNode.nodeValue = '  test ';
  goog.editor.plugins.TagOnEnterHandler.replaceWhiteSpaceWithNbsp_(
      node.firstChild, true, false);
  assertHTMLEquals('&nbsp;test ', node.innerHTML);

  textNode.nodeValue = ' test ';
  goog.editor.plugins.TagOnEnterHandler.replaceWhiteSpaceWithNbsp_(
      node.firstChild, false, false);
  assertHTMLEquals(' test&nbsp;', node.innerHTML);

  textNode.nodeValue = ' test  ';
  goog.editor.plugins.TagOnEnterHandler.replaceWhiteSpaceWithNbsp_(
      node.firstChild, false, false);
  assertHTMLEquals(' test&nbsp;', node.innerHTML);

  textNode.nodeValue = '';
  goog.editor.plugins.TagOnEnterHandler.replaceWhiteSpaceWithNbsp_(
      node.firstChild, false, false);
  assertHTMLEquals('&nbsp;', node.innerHTML);

  textNode.nodeValue = '';
  goog.editor.plugins.TagOnEnterHandler.replaceWhiteSpaceWithNbsp_(
      node.firstChild, false, true);
  assertHTMLEquals('', node.innerHTML);
}
