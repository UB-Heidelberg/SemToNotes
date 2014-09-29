// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A UI for editing tweak settings / clicking tweak actions.
***REMOVED***
***REMOVED*** @author agrieve@google.com (Andrew Grieve)
***REMOVED***

goog.provide('goog.tweak.EntriesPanel');
goog.provide('goog.tweak.TweakUi');

goog.require('goog.array');
goog.require('goog.asserts');
***REMOVED***
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.tweak');
goog.require('goog.ui.Zippy');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** A UI for editing tweak settings / clicking tweak actions.
***REMOVED*** @param {!goog.tweak.Registry} registry The registry to render.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DomHelper to render with.
***REMOVED***
***REMOVED***
goog.tweak.TweakUi = function(registry, opt_domHelper) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The registry to create a UI from.
  ***REMOVED*** @type {!goog.tweak.Registry}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.registry_ = registry;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The element to display when the UI is visible.
  ***REMOVED*** @type {goog.tweak.EntriesPanel|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.entriesPanel_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The DomHelper to render with.
  ***REMOVED*** @type {!goog.dom.DomHelper}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();

  // Listen for newly registered entries (happens with lazy-loaded modules).
  registry.addOnRegisterListener(goog.bind(this.onNewRegisteredEntry_, this));
***REMOVED***


***REMOVED***
***REMOVED*** The CSS class name unique to the root tweak panel div.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.tweak.TweakUi.ROOT_PANEL_CLASS_ = goog.getCssName('goog-tweak-root');


***REMOVED***
***REMOVED*** The CSS class name unique to the tweak entry div.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.tweak.TweakUi.ENTRY_CSS_CLASS_ = goog.getCssName('goog-tweak-entry');


***REMOVED***
***REMOVED*** The CSS classes for each tweak entry div.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.tweak.TweakUi.ENTRY_CSS_CLASSES_ = goog.tweak.TweakUi.ENTRY_CSS_CLASS_ +
    ' ' + goog.getCssName('goog-inline-block');


***REMOVED***
***REMOVED*** The CSS classes for each namespace tweak entry div.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.tweak.TweakUi.ENTRY_GROUP_CSS_CLASSES_ =
    goog.tweak.TweakUi.ENTRY_CSS_CLASS_;


***REMOVED***
***REMOVED*** Marker that the style sheet has already been installed.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.tweak.TweakUi.STYLE_SHEET_INSTALLED_MARKER_ =
    '__closure_tweak_installed_';


***REMOVED***
***REMOVED*** CSS used by TweakUI.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.tweak.TweakUi.CSS_STYLES_ = (function() {
  var MOBILE = goog.userAgent.MOBILE;
  var IE = goog.userAgent.IE;
  var ENTRY_CLASS = '.' + goog.tweak.TweakUi.ENTRY_CSS_CLASS_;
  var ROOT_PANEL_CLASS = '.' + goog.tweak.TweakUi.ROOT_PANEL_CLASS_;
  var GOOG_INLINE_BLOCK_CLASS = '.' + goog.getCssName('goog-inline-block');
  var ret = ROOT_PANEL_CLASS + '{background:#ffc; padding:0 4px}';
  // Make this work even if the user hasn't included common.css.
  if (!IE) {
    ret += GOOG_INLINE_BLOCK_CLASS + '{display:inline-block}';
  }
  // Space things out vertically for touch UIs.
  if (MOBILE) {
    ret += ROOT_PANEL_CLASS + ',' + ROOT_PANEL_CLASS + ' fieldset{' +
        'line-height:2em;' + '}';
  }
  return ret;
})();


***REMOVED***
***REMOVED*** Creates a TweakUi if tweaks are enabled.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DomHelper to render with.
***REMOVED*** @return {Element|undefined} The root UI element or undefined if tweaks are
***REMOVED***     not enabled.
***REMOVED***
goog.tweak.TweakUi.create = function(opt_domHelper) {
  var registry = goog.tweak.getRegistry();
  if (registry) {
    var ui = new goog.tweak.TweakUi(registry, opt_domHelper);
    ui.render();
    return ui.getRootElement();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a TweakUi inside of a show/hide link.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DomHelper to render with.
***REMOVED*** @return {Element|undefined} The root UI element or undefined if tweaks are
***REMOVED***     not enabled.
***REMOVED***
goog.tweak.TweakUi.createCollapsible = function(opt_domHelper) {
  var registry = goog.tweak.getRegistry();
  if (registry) {
    var dh = opt_domHelper || goog.dom.getDomHelper();

    // The following strings are for internal debugging only.  No translation
    // necessary.  Do NOT wrap goog.getMsg() around these strings.
    var showLink = dh.createDom('a', {href: 'javascript:;'}, 'Show Tweaks');
    var hideLink = dh.createDom('a', {href: 'javascript:;'}, 'Hide Tweaks');
    var ret = dh.createDom('div', null, showLink);

    var lazyCreate = function() {
      // Lazily render the UI.
      var ui = new goog.tweak.TweakUi(
         ***REMOVED*****REMOVED*** @type {!goog.tweak.Registry}***REMOVED*** (registry), dh);
      ui.render();
      // Put the hide link on the same line as the "Show Descriptions" link.
      // Set the style lazily because we can.
      hideLink.style.marginRight = '10px';
      var tweakElem = ui.getRootElement();
      tweakElem.insertBefore(hideLink, tweakElem.firstChild);
      ret.appendChild(tweakElem);
      return tweakElem;
   ***REMOVED*****REMOVED***
    new goog.ui.Zippy(showLink, lazyCreate, false /* expanded***REMOVED***, hideLink);
    return ret;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Compares the given entries. Orders alphabetically and groups buttons and
***REMOVED*** expandable groups.
***REMOVED*** @param {goog.tweak.BaseEntry} a The first entry to compare.
***REMOVED*** @param {goog.tweak.BaseEntry} b The second entry to compare.
***REMOVED*** @return {number} Refer to goog.array.defaultCompare.
***REMOVED*** @private
***REMOVED***
goog.tweak.TweakUi.entryCompare_ = function(a, b) {
  return (
      goog.array.defaultCompare(a instanceof goog.tweak.NamespaceEntry_,
          b instanceof goog.tweak.NamespaceEntry_) ||
      goog.array.defaultCompare(a instanceof goog.tweak.BooleanGroup,
          b instanceof goog.tweak.BooleanGroup) ||
      goog.array.defaultCompare(a instanceof goog.tweak.ButtonAction,
          b instanceof goog.tweak.ButtonAction) ||
      goog.array.defaultCompare(a.label, b.label) ||
      goog.array.defaultCompare(a.getId(), b.getId()));
***REMOVED***


***REMOVED***
***REMOVED*** @param {!goog.tweak.BaseEntry} entry The entry.
***REMOVED*** @return {boolean} Returns whether the given entry contains sub-entries.
***REMOVED*** @private
***REMOVED***
goog.tweak.TweakUi.isGroupEntry_ = function(entry) {
  return entry instanceof goog.tweak.NamespaceEntry_ ||
      entry instanceof goog.tweak.BooleanGroup;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the list of entries from the given boolean group.
***REMOVED*** @param {!goog.tweak.BooleanGroup} group The group to get the entries from.
***REMOVED*** @return {!Array.<!goog.tweak.BaseEntry>} The sorted entries.
***REMOVED*** @private
***REMOVED***
goog.tweak.TweakUi.extractBooleanGroupEntries_ = function(group) {
  var ret = goog.object.getValues(group.getChildEntries());
  ret.sort(goog.tweak.TweakUi.entryCompare_);
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** @param {!goog.tweak.BaseEntry} entry The entry.
***REMOVED*** @return {string} Returns the namespace for the entry, or '' if it is not
***REMOVED***     namespaced.
***REMOVED*** @private
***REMOVED***
goog.tweak.TweakUi.extractNamespace_ = function(entry) {
  var namespaceMatch = /.+(?=\.)/.exec(entry.getId());
  return namespaceMatch ? namespaceMatch[0] : '';
***REMOVED***


***REMOVED***
***REMOVED*** @param {!goog.tweak.BaseEntry} entry The entry.
***REMOVED*** @return {string} Returns the part of the label after the last period, unless
***REMOVED***     the label has been explicly set (it is different from the ID).
***REMOVED*** @private
***REMOVED***
goog.tweak.TweakUi.getNamespacedLabel_ = function(entry) {
  var label = entry.label;
  if (label == entry.getId()) {
    label = label.substr(label.lastIndexOf('.') + 1);
  }
  return label;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Element} The root element. Must not be called before render().
***REMOVED***
goog.tweak.TweakUi.prototype.getRootElement = function() {
  goog.asserts.assert(this.entriesPanel_,
      'TweakUi.getRootElement called before render().');
  return this.entriesPanel_.getRootElement();
***REMOVED***


***REMOVED***
***REMOVED*** Reloads the page with query parameters set by the UI.
***REMOVED*** @private
***REMOVED***
goog.tweak.TweakUi.prototype.restartWithAppliedTweaks_ = function() {
  var queryString = this.registry_.makeUrlQuery();
  var wnd = this.domHelper_.getWindow();
  if (queryString != wnd.location.search) {
    wnd.location.search = queryString;
  } else {
    wnd.location.reload();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Installs the required CSS styles.
***REMOVED*** @private
***REMOVED***
goog.tweak.TweakUi.prototype.installStyles_ = function() {
  // Use an marker to install the styles only once per document.
  // Styles are injected via JS instead of in a separate style sheet so that
  // they are automatically excluded when tweaks are stripped out.
  var doc = this.domHelper_.getDocument();
  if (!(goog.tweak.TweakUi.STYLE_SHEET_INSTALLED_MARKER_ in doc)) {
    goog.style.installStyles(
        goog.tweak.TweakUi.CSS_STYLES_, doc);
    doc[goog.tweak.TweakUi.STYLE_SHEET_INSTALLED_MARKER_] = true;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates the element to display when the UI is visible.
***REMOVED*** @return {!Element} The root element.
***REMOVED***
goog.tweak.TweakUi.prototype.render = function() {
  this.installStyles_();
  var dh = this.domHelper_;
  // The submit button
  var submitButton = dh.createDom('button', {style: 'font-weight:bold'},
      'Apply Tweaks');
  submitButton.onclick = goog.bind(this.restartWithAppliedTweaks_, this);

  var rootPanel = new goog.tweak.EntriesPanel([], dh);
  var rootPanelDiv = rootPanel.render(submitButton);
  rootPanelDiv.className += ' ' + goog.tweak.TweakUi.ROOT_PANEL_CLASS_;
  this.entriesPanel_ = rootPanel;

  var entries = this.registry_.extractEntries(true /* excludeChildEntries***REMOVED***,
      false /* excludeNonSettings***REMOVED***);
  for (var i = 0, entry; entry = entries[i]; i++) {
    this.insertEntry_(entry);
  }

  return rootPanelDiv;
***REMOVED***


***REMOVED***
***REMOVED*** Updates the UI with the given entry.
***REMOVED*** @param {!goog.tweak.BaseEntry} entry The newly registered entry.
***REMOVED*** @private
***REMOVED***
goog.tweak.TweakUi.prototype.onNewRegisteredEntry_ = function(entry) {
  if (this.entriesPanel_) {
    this.insertEntry_(entry);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the UI with the given entry.
***REMOVED*** @param {!goog.tweak.BaseEntry} entry The newly registered entry.
***REMOVED*** @private
***REMOVED***
goog.tweak.TweakUi.prototype.insertEntry_ = function(entry) {
  var panel = this.entriesPanel_;
  var namespace = goog.tweak.TweakUi.extractNamespace_(entry);

  if (namespace) {
    // Find the NamespaceEntry that the entry belongs to.
    var namespaceEntryId = goog.tweak.NamespaceEntry_.ID_PREFIX + namespace;
    var nsPanel = panel.childPanels[namespaceEntryId];
    if (nsPanel) {
      panel = nsPanel;
    } else {
      entry = new goog.tweak.NamespaceEntry_(namespace, [entry]);
    }
  }
  if (entry instanceof goog.tweak.BooleanInGroupSetting) {
    var group = entry.getGroup();
    // BooleanGroup entries are always registered before their
    // BooleanInGroupSettings.
    panel = panel.childPanels[group.getId()];
  }
  goog.asserts.assert(panel, 'Missing panel for entry %s', entry.getId());
  panel.insertEntry(entry);
***REMOVED***



***REMOVED***
***REMOVED*** The body of the tweaks UI and also used for BooleanGroup.
***REMOVED*** @param {!Array.<!goog.tweak.BaseEntry>} entries The entries to show in the
***REMOVED***     panel.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DomHelper to render with.
***REMOVED***
***REMOVED***
goog.tweak.EntriesPanel = function(entries, opt_domHelper) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The entries to show in the panel.
  ***REMOVED*** @type {!Array.<!goog.tweak.BaseEntry>} entries
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.entries_ = entries;

***REMOVED***
 ***REMOVED*****REMOVED***
  ***REMOVED*** The bound onclick handler for the help question marks.
  ***REMOVED*** @this {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.boundHelpOnClickHandler_ = function() {
    self.onHelpClick_(this.parentNode);
 ***REMOVED*****REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The element that contains the UI.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.rootElem_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The element that contains all of the settings and the endElement.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.mainPanel_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Flips between true/false each time the "Toggle Descriptions" link is
  ***REMOVED*** clicked.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.showAllDescriptionsState_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The DomHelper to render with.
  ***REMOVED*** @type {!goog.dom.DomHelper}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map of tweak ID -> EntriesPanel for child panels (BooleanGroups).
  ***REMOVED*** @type {!Object.<!goog.tweak.EntriesPanel>}
 ***REMOVED*****REMOVED***
  this.childPanels = {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Element} Returns the expanded element. Must not be called before
***REMOVED***     render().
***REMOVED***
goog.tweak.EntriesPanel.prototype.getRootElement = function() {
  goog.asserts.assert(this.rootElem_,
      'EntriesPanel.getRootElement called before render().');
  return***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (this.rootElem_);
***REMOVED***


***REMOVED***
***REMOVED*** Creates and returns the expanded element.
***REMOVED*** The markup looks like:
***REMOVED*** <div>
***REMOVED***   <a>Show Descriptions</a>
***REMOVED***   <div>
***REMOVED***      ...
***REMOVED***      {endElement}
***REMOVED***   </div>
***REMOVED*** </div>
***REMOVED*** @param {Element|DocumentFragment=} opt_endElement Element to insert after all
***REMOVED***     tweak entries.
***REMOVED*** @return {!Element} The root element for the panel.
***REMOVED***
goog.tweak.EntriesPanel.prototype.render = function(opt_endElement) {
  var dh = this.domHelper_;
  var entries = this.entries_;
  var ret = dh.createDom('div');

  var showAllDescriptionsLink = dh.createDom('a', {
    href: 'javascript:;',
    onclick: goog.bind(this.toggleAllDescriptions, this)
  }, 'Toggle all Descriptions');
  ret.appendChild(showAllDescriptionsLink);

  // Add all of the entries.
  var mainPanel = dh.createElement('div');
  this.mainPanel_ = mainPanel;
  for (var i = 0, entry; entry = entries[i]; i++) {
    mainPanel.appendChild(this.createEntryElem_(entry));
  }

  if (opt_endElement) {
    mainPanel.appendChild(opt_endElement);
  }
  ret.appendChild(mainPanel);
  this.rootElem_ = ret;
  return***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (ret);
***REMOVED***


***REMOVED***
***REMOVED*** Inserts the given entry into the panel.
***REMOVED*** @param {!goog.tweak.BaseEntry} entry The entry to insert.
***REMOVED***
goog.tweak.EntriesPanel.prototype.insertEntry = function(entry) {
  var insertIndex = -goog.array.binarySearch(this.entries_, entry,
      goog.tweak.TweakUi.entryCompare_) - 1;
  goog.asserts.assert(insertIndex >= 0, 'insertEntry failed for %s',
      entry.getId());
  goog.array.insertAt(this.entries_, entry, insertIndex);
  this.mainPanel_.insertBefore(
      this.createEntryElem_(entry),
      // IE doesn't like 'undefined' here.
      this.mainPanel_.childNodes[insertIndex] || null);
***REMOVED***


***REMOVED***
***REMOVED*** Creates and returns a form element for the given entry.
***REMOVED*** @param {!goog.tweak.BaseEntry} entry The entry.
***REMOVED*** @return {!Element} The root DOM element for the entry.
***REMOVED*** @private
***REMOVED***
goog.tweak.EntriesPanel.prototype.createEntryElem_ = function(entry) {
  var dh = this.domHelper_;
  var isGroupEntry = goog.tweak.TweakUi.isGroupEntry_(entry);
  var classes = isGroupEntry ? goog.tweak.TweakUi.ENTRY_GROUP_CSS_CLASSES_ :
      goog.tweak.TweakUi.ENTRY_CSS_CLASSES_;
  // Containers should not use label tags or else all descendent inputs will be
  // connected on desktop browsers.
  var containerNodeName = isGroupEntry ? 'span' : 'label';
  var ret = dh.createDom('div', classes,
      dh.createDom(containerNodeName, {
        // Make the hover text the description.
        title: entry.description,
        style: 'color:' + (entry.isRestartRequired() ? '' : 'blue')
      }, this.createTweakEntryDom_(entry)),
      // Add the expandable help question mark.
      this.createHelpElem_(entry));
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Click handler for the help link.
***REMOVED*** @param {Node} entryDiv The div that contains the tweak.
***REMOVED*** @private
***REMOVED***
goog.tweak.EntriesPanel.prototype.onHelpClick_ = function(entryDiv) {
  this.showDescription_(entryDiv, !entryDiv.style.display);
***REMOVED***


***REMOVED***
***REMOVED*** Twiddle the DOM so that the entry within the given span is shown/hidden.
***REMOVED*** @param {Node} entryDiv The div that contains the tweak.
***REMOVED*** @param {boolean} show True to show, false to hide.
***REMOVED*** @private
***REMOVED***
goog.tweak.EntriesPanel.prototype.showDescription_ =
    function(entryDiv, show) {
  var descriptionElem = entryDiv.lastChild.lastChild;
  goog.style.showElement(***REMOVED*** @type {Element}***REMOVED*** (descriptionElem), show);
  entryDiv.style.display = show ? 'block' : '';
***REMOVED***


***REMOVED***
***REMOVED*** Creates and returns a help element for the given entry.
***REMOVED*** @param {goog.tweak.BaseEntry} entry The entry.
***REMOVED*** @return {!Element} The root element of the created DOM.
***REMOVED*** @private
***REMOVED***
goog.tweak.EntriesPanel.prototype.createHelpElem_ = function(entry) {
  // The markup looks like:
  // <span onclick=...><b>?</b><span>{description}</span></span>
  var ret = this.domHelper_.createElement('span');
  ret.innerHTML = '<b style="padding:0 1em 0 .5em">?</b>' +
      '<span style="display:none;color:#666"></span>';
  ret.onclick = this.boundHelpOnClickHandler_;
  var descriptionElem = ret.lastChild;
  goog.dom.setTextContent(***REMOVED*** @type {Element}***REMOVED*** (descriptionElem),
      entry.description);
  if (!entry.isRestartRequired()) {
    descriptionElem.innerHTML +=
        ' <span style="color:blue">(no restart required)</span>';
  }
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Show all entry descriptions (has the same effect as clicking on all ?'s).
***REMOVED***
goog.tweak.EntriesPanel.prototype.toggleAllDescriptions = function() {
  var show = !this.showAllDescriptionsState_;
  this.showAllDescriptionsState_ = show;
  var entryDivs = this.domHelper_.getElementsByTagNameAndClass('div',
      goog.tweak.TweakUi.ENTRY_CSS_CLASS_, this.rootElem_);
  for (var i = 0, div; div = entryDivs[i]; i++) {
    this.showDescription_(div, show);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates the DOM element to control the given enum setting.
***REMOVED*** @param {!goog.tweak.StringSetting|!goog.tweak.NumericSetting} tweak The
***REMOVED***     setting.
***REMOVED*** @param {string} label The label for the entry.
***REMOVED*** @param {!Function} onchangeFunc onchange event handler.
***REMOVED*** @return {!DocumentFragment} The DOM element.
***REMOVED*** @private
***REMOVED***
goog.tweak.EntriesPanel.prototype.createComboBoxDom_ =
    function(tweak, label, onchangeFunc) {
  // The markup looks like:
  // Label: <select><option></option></select>
  var dh = this.domHelper_;
  var ret = dh.getDocument().createDocumentFragment();
  ret.appendChild(dh.createTextNode(label + ': '));
  var selectElem = dh.createElement('select');
  var values = tweak.getValidValues();
  for (var i = 0, il = values.length; i < il; ++i) {
    var optionElem = dh.createElement('option');
    optionElem.text = String(values[i]);
    // Setting the option tag's value is required for selectElem.value to work
    // properly.
    optionElem.value = String(values[i]);
    selectElem.appendChild(optionElem);
  }
  ret.appendChild(selectElem);

  // Set the value and add a callback.
  selectElem.value = tweak.getNewValue();
  selectElem.onchange = onchangeFunc;
  tweak.addCallback(function() {
    selectElem.value = tweak.getNewValue();
  });
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the DOM element to control the given boolean setting.
***REMOVED*** @param {!goog.tweak.BooleanSetting} tweak The setting.
***REMOVED*** @param {string} label The label for the entry.
***REMOVED*** @return {!DocumentFragment} The DOM elements.
***REMOVED*** @private
***REMOVED***
goog.tweak.EntriesPanel.prototype.createBooleanSettingDom_ =
    function(tweak, label) {
  var dh = this.domHelper_;
  var ret = dh.getDocument().createDocumentFragment();
  var checkbox = dh.createDom('input', {type: 'checkbox'});
  ret.appendChild(checkbox);
  ret.appendChild(dh.createTextNode(label));

  // Needed on IE6 to ensure the textbox doesn't get cleared
  // when added to the DOM.
  checkbox.defaultChecked = tweak.getNewValue();

  checkbox.checked = tweak.getNewValue();
  checkbox.onchange = function() {
    tweak.setValue(checkbox.checked);
 ***REMOVED*****REMOVED***
  tweak.addCallback(function() {
    checkbox.checked = tweak.getNewValue();
  });
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the DOM for a BooleanGroup or NamespaceEntry.
***REMOVED*** @param {!goog.tweak.BooleanGroup|!goog.tweak.NamespaceEntry_} entry The
***REMOVED***     entry.
***REMOVED*** @param {string} label The label for the entry.
***REMOVED*** @param {!Array.<goog.tweak.BaseEntry>} childEntries The child entries.
***REMOVED*** @return {!DocumentFragment} The DOM element.
***REMOVED*** @private
***REMOVED***
goog.tweak.EntriesPanel.prototype.createSubPanelDom_ = function(entry, label,
    childEntries) {
  var dh = this.domHelper_;
  var toggleLink = dh.createDom('a', {href: 'javascript:;'},
      label + ' \xBB');
  var toggleLink2 = dh.createDom('a', {href: 'javascript:;'},
      '\xAB ' + label);
  toggleLink2.style.marginRight = '10px';

  var innerUi = new goog.tweak.EntriesPanel(childEntries, dh);
  this.childPanels[entry.getId()] = innerUi;

  var elem = innerUi.render();
  // Move the toggle descriptions link into the legend.
  var descriptionsLink = elem.firstChild;
  var childrenElem = dh.createDom('fieldset',
      goog.getCssName('goog-inline-block'),
      dh.createDom('legend', null, toggleLink2, descriptionsLink),
      elem);

  new goog.ui.Zippy(toggleLink, childrenElem, false /* expanded***REMOVED***,
      toggleLink2);

  var ret = dh.getDocument().createDocumentFragment();
  ret.appendChild(toggleLink);
  ret.appendChild(childrenElem);
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the DOM element to control the given string setting.
***REMOVED*** @param {!goog.tweak.StringSetting|!goog.tweak.NumericSetting} tweak The
***REMOVED***     setting.
***REMOVED*** @param {string} label The label for the entry.
***REMOVED*** @param {!Function} onchangeFunc onchange event handler.
***REMOVED*** @return {!DocumentFragment} The DOM element.
***REMOVED*** @private
***REMOVED***
goog.tweak.EntriesPanel.prototype.createTextBoxDom_ =
    function(tweak, label, onchangeFunc) {
  var dh = this.domHelper_;
  var ret = dh.getDocument().createDocumentFragment();
  ret.appendChild(dh.createTextNode(label + ': '));
  var textBox = dh.createDom('input', {
    value: tweak.getNewValue(),
    // TODO(agrieve): Make size configurable or autogrow.
    size: 5,
    onblur: onchangeFunc
  });
  ret.appendChild(textBox);
  tweak.addCallback(function() {
    textBox.value = tweak.getNewValue();
  });
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the DOM element to control the given button action.
***REMOVED*** @param {!goog.tweak.ButtonAction} tweak The action.
***REMOVED*** @param {string} label The label for the entry.
***REMOVED*** @return {!Element} The DOM element.
***REMOVED*** @private
***REMOVED***
goog.tweak.EntriesPanel.prototype.createButtonActionDom_ =
    function(tweak, label) {
  return this.domHelper_.createDom('button', {
    onclick: goog.bind(tweak.fireCallbacks, tweak)
  }, label);
***REMOVED***


***REMOVED***
***REMOVED*** Creates the DOM element to control the given entry.
***REMOVED*** @param {!goog.tweak.BaseEntry} entry The entry.
***REMOVED*** @return {!Element|!DocumentFragment} The DOM element.
***REMOVED*** @private
***REMOVED***
goog.tweak.EntriesPanel.prototype.createTweakEntryDom_ = function(entry) {
  var label = goog.tweak.TweakUi.getNamespacedLabel_(entry);
  if (entry instanceof goog.tweak.BooleanSetting) {
    return this.createBooleanSettingDom_(entry, label);
  } else if (entry instanceof goog.tweak.BooleanGroup) {
    var childEntries = goog.tweak.TweakUi.extractBooleanGroupEntries_(entry);
    return this.createSubPanelDom_(entry, label, childEntries);
  } else if (entry instanceof goog.tweak.StringSetting) {
   ***REMOVED*****REMOVED*** @this {Element}***REMOVED***
    var setValueFunc = function() {
      entry.setValue(this.value);
   ***REMOVED*****REMOVED***
    return entry.getValidValues() ?
        this.createComboBoxDom_(entry, label, setValueFunc) :
        this.createTextBoxDom_(entry, label, setValueFunc);
  } else if (entry instanceof goog.tweak.NumericSetting) {
    setValueFunc = function() {
      // Reset the value if it's not a number.
      if (isNaN(this.value)) {
        this.value = entry.getNewValue();
      } else {
        entry.setValue(+this.value);
      }
   ***REMOVED*****REMOVED***
    return entry.getValidValues() ?
        this.createComboBoxDom_(entry, label, setValueFunc) :
        this.createTextBoxDom_(entry, label, setValueFunc);
  } else if (entry instanceof goog.tweak.NamespaceEntry_) {
    return this.createSubPanelDom_(entry, entry.label, entry.entries);
  }
  goog.asserts.assertInstanceof(entry, goog.tweak.ButtonAction,
      'invalid entry: %s', entry);
  return this.createButtonActionDom_(
     ***REMOVED*****REMOVED*** @type {!goog.tweak.ButtonAction}***REMOVED*** (entry), label);
***REMOVED***



***REMOVED***
***REMOVED*** Entries used to represent the collapsible namespace links. These entries are
***REMOVED*** never registered with the TweakRegistry, but are contained within the
***REMOVED*** collection of entries within TweakPanels.
***REMOVED*** @param {string} namespace The namespace for the entry.
***REMOVED*** @param {!Array.<!goog.tweak.BaseEntry>} entries Entries within the namespace.
***REMOVED***
***REMOVED*** @extends {goog.tweak.BaseEntry}
***REMOVED*** @private
***REMOVED***
goog.tweak.NamespaceEntry_ = function(namespace, entries) {
  goog.tweak.BaseEntry.call(this,
      goog.tweak.NamespaceEntry_.ID_PREFIX + namespace,
      'Tweaks within the ' + namespace + ' namespace.');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Entries within this namespace.
  ***REMOVED*** @type {!Array.<!goog.tweak.BaseEntry>}
 ***REMOVED*****REMOVED***
  this.entries = entries;

  this.label = namespace;
***REMOVED***
goog.inherits(goog.tweak.NamespaceEntry_, goog.tweak.BaseEntry);


***REMOVED***
***REMOVED*** Prefix for the IDs of namespace entries used to ensure that they do not
***REMOVED*** conflict with regular entries.
***REMOVED*** @type {string}
***REMOVED***
goog.tweak.NamespaceEntry_.ID_PREFIX = '!';

