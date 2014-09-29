// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Component for generating chart PNGs using Google Chart Server.
***REMOVED***
***REMOVED*** @see ../demos/serverchart.html
***REMOVED***


***REMOVED***
***REMOVED*** Namespace for chart functions
***REMOVED***
goog.provide('goog.ui.ServerChart');
goog.provide('goog.ui.ServerChart.AxisDisplayType');
goog.provide('goog.ui.ServerChart.ChartType');
goog.provide('goog.ui.ServerChart.EncodingType');
goog.provide('goog.ui.ServerChart.Event');
goog.provide('goog.ui.ServerChart.LegendPosition');
goog.provide('goog.ui.ServerChart.MaximumValue');
goog.provide('goog.ui.ServerChart.MultiAxisAlignment');
goog.provide('goog.ui.ServerChart.MultiAxisType');
goog.provide('goog.ui.ServerChart.UriParam');
goog.provide('goog.ui.ServerChart.UriTooLongEvent');

***REMOVED***
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.events.Event');
goog.require('goog.string');
goog.require('goog.ui.Component');



***REMOVED***
***REMOVED*** Will construct a chart using Google's chartserver.
***REMOVED***
***REMOVED*** @param {goog.ui.ServerChart.ChartType} type The chart type.
***REMOVED*** @param {number=} opt_width The width of the chart.
***REMOVED*** @param {number=} opt_height The height of the chart.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM Helper.
***REMOVED*** @param {string=} opt_uri Optional uri used to connect to the chart server, if
***REMOVED***     different than goog.ui.ServerChart.CHART_SERVER_SCHEME_INDEPENDENT_URI.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.ServerChart = function(type, opt_width, opt_height, opt_domHelper,
    opt_uri) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Image URI.
  ***REMOVED*** @type {goog.Uri}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.uri_ = new goog.Uri(
      opt_uri || goog.ui.ServerChart.CHART_SERVER_SCHEME_INDEPENDENT_URI);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Encoding method for the URI data format.
  ***REMOVED*** @type {goog.ui.ServerChart.EncodingType}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.encodingType_ = goog.ui.ServerChart.EncodingType.AUTOMATIC;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Two-dimensional array of the data sets on the chart.
  ***REMOVED*** @type {Array.<Array.<number>>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.dataSets_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Colors for each data set.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.setColors_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Legend texts for each data set.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.setLegendTexts_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Labels on the X-axis.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.xLabels_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Labels on the left along the Y-axis.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.leftLabels_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Labels on the right along the Y-axis.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.rightLabels_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Axis type for each multi-axis in the chart. The indices into this array
  ***REMOVED*** also work as the reference index for all other multi-axis properties.
  ***REMOVED*** @type {Array.<goog.ui.ServerChart.MultiAxisType>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.multiAxisType_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Axis text for each multi-axis in the chart, indexed by the indices from
  ***REMOVED*** multiAxisType_ in a sparse array.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.multiAxisLabelText_ = {***REMOVED***


 ***REMOVED*****REMOVED***
  ***REMOVED*** Axis position for each multi-axis in the chart, indexed by the indices
  ***REMOVED*** from multiAxisType_ in a sparse array.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.multiAxisLabelPosition_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Axis range for each multi-axis in the chart, indexed by the indices from
  ***REMOVED*** multiAxisType_ in a sparse array.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.multiAxisRange_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Axis style for each multi-axis in the chart, indexed by the indices from
  ***REMOVED*** multiAxisType_ in a sparse array.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.multiAxisLabelStyle_ = {***REMOVED***

  this.setType(type);
  this.setSize(opt_width, opt_height);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Minimum value for the chart (used for normalization). By default,
  ***REMOVED*** this is set to infinity, and is eventually updated to the lowest given
  ***REMOVED*** value in the data. The minimum value is then subtracted from all other
  ***REMOVED*** values. For a pie chart, subtracting the minimum value does not make
  ***REMOVED*** sense, so minValue_ is set to zero because 0 is the additive identity.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.minValue_ = this.isPieChart() ? 0 : Infinity;
***REMOVED***
goog.inherits(goog.ui.ServerChart, goog.ui.Component);


***REMOVED***
***REMOVED*** Base scheme-independent URI for the chart renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.ServerChart.CHART_SERVER_SCHEME_INDEPENDENT_URI =
    '//chart.googleapis.com/chart';


***REMOVED***
***REMOVED*** Base HTTP URI for the chart renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.ServerChart.CHART_SERVER_HTTP_URI =
    'http://chart.googleapis.com/chart';


***REMOVED***
***REMOVED*** Base HTTPS URI for the chart renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.ServerChart.CHART_SERVER_HTTPS_URI =
    'https://chart.googleapis.com/chart';


***REMOVED***
***REMOVED*** Base URI for the chart renderer.
***REMOVED*** @type {string}
***REMOVED*** @deprecated Use
***REMOVED***     {@link goog.ui.ServerChart.CHART_SERVER_SCHEME_INDEPENDENT_URI},
***REMOVED***     {@link goog.ui.ServerChart.CHART_SERVER_HTTP_URI} or
***REMOVED***     {@link goog.ui.ServerChart.CHART_SERVER_HTTPS_URI} instead.
***REMOVED***
goog.ui.ServerChart.CHART_SERVER_URI =
    goog.ui.ServerChart.CHART_SERVER_HTTP_URI;


***REMOVED***
***REMOVED*** The 0 - 1.0 ("fraction of the range") value to use when getMinValue() ==
***REMOVED*** getMaxValue(). This determines, for example, the vertical position
***REMOVED*** of the line in a flat line-chart.
***REMOVED*** @type {number}
***REMOVED***
goog.ui.ServerChart.DEFAULT_NORMALIZATION = 0.5;


***REMOVED***
***REMOVED*** The upper limit on the length of the chart image URI, after encoding.
***REMOVED*** If the URI's length equals or exceeds it, goog.ui.ServerChart.UriTooLongEvent
***REMOVED*** is dispatched on the goog.ui.ServerChart object.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.ServerChart.prototype.uriLengthLimit_ = 2048;


***REMOVED***
***REMOVED*** Number of gridlines along the X-axis.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.ServerChart.prototype.gridX_ = 0;


***REMOVED***
***REMOVED*** Number of gridlines along the Y-axis.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.ServerChart.prototype.gridY_ = 0;


***REMOVED***
***REMOVED*** Maximum value for the chart (used for normalization). The minimum is
***REMOVED*** declared in the constructor.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.ServerChart.prototype.maxValue_ = -Infinity;


***REMOVED***
***REMOVED*** Chart title.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.ui.ServerChart.prototype.title_ = null;


***REMOVED***
***REMOVED*** Chart title size.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.ServerChart.prototype.titleSize_ = 13.5;


***REMOVED***
***REMOVED*** Chart title color.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.ServerChart.prototype.titleColor_ = '333333';


***REMOVED***
***REMOVED*** Chart legend.
***REMOVED*** @type {Array.<string>?}
***REMOVED*** @private
***REMOVED***
goog.ui.ServerChart.prototype.legend_ = null;


***REMOVED***
***REMOVED*** ChartServer supports using data sets to position markers. A data set
***REMOVED*** that is being used for positioning only can be made "invisible", in other
***REMOVED*** words, the caller can indicate to ChartServer that ordinary chart elements
***REMOVED*** (e.g. bars in a bar chart) should not be drawn on the data points of the
***REMOVED*** invisible data set. Such data sets must be provided at the end of the
***REMOVED*** chd parameter, and if invisible data sets are being used, the chd
***REMOVED*** parameter must indicate the number of visible data sets.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.ui.ServerChart.prototype.numVisibleDataSets_ = null;


***REMOVED***
***REMOVED*** Creates the DOM node (image) needed for the Chart
***REMOVED*** @override
***REMOVED***
goog.ui.ServerChart.prototype.createDom = function() {
  var size = this.getSize();
  this.setElementInternal(this.getDomHelper().createDom(
      'img', {'src': this.getUri(),
      'class': goog.getCssName('goog-serverchart-image'),
      'width': size[0], 'height': size[1]}));
***REMOVED***


***REMOVED***
***REMOVED*** Decorate an image already in the DOM.
***REMOVED*** Expects the following structure:
***REMOVED*** <pre>
***REMOVED***   - img
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {Element} img Image to decorate.
***REMOVED*** @override
***REMOVED***
goog.ui.ServerChart.prototype.decorateInternal = function(img) {
  img.src = this.getUri();
  this.setElementInternal(img);
***REMOVED***


***REMOVED***
***REMOVED*** Updates the image if any of the data or settings have changed.
***REMOVED***
goog.ui.ServerChart.prototype.updateChart = function() {
  if (this.getElement()) {
    this.getElement().src = this.getUri();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the URI of the chart.
***REMOVED***
***REMOVED*** @param {goog.Uri} uri The chart URI.
***REMOVED***
goog.ui.ServerChart.prototype.setUri = function(uri) {
  this.uri_ = uri;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the URI of the chart.
***REMOVED***
***REMOVED*** @return {goog.Uri} The chart URI.
***REMOVED***
goog.ui.ServerChart.prototype.getUri = function() {
  this.computeDataString_();
  return this.uri_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the upper limit on the length of the chart image URI, after encoding.
***REMOVED*** If the URI's length equals or exceeds it, goog.ui.ServerChart.UriTooLongEvent
***REMOVED*** is dispatched on the goog.ui.ServerChart object.
***REMOVED***
***REMOVED*** @return {number} The chart URI length limit.
***REMOVED***
goog.ui.ServerChart.prototype.getUriLengthLimit = function() {
  return this.uriLengthLimit_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the upper limit on the length of the chart image URI, after encoding.
***REMOVED*** If the URI's length equals or exceeds it, goog.ui.ServerChart.UriTooLongEvent
***REMOVED*** is dispatched on the goog.ui.ServerChart object.
***REMOVED***
***REMOVED*** @param {number} uriLengthLimit The chart URI length limit.
***REMOVED***
goog.ui.ServerChart.prototype.setUriLengthLimit = function(uriLengthLimit) {
  this.uriLengthLimit_ = uriLengthLimit;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the 'chg' parameter of the chart Uri.
***REMOVED*** This is used by various types of charts to specify Grids.
***REMOVED***
***REMOVED*** @param {string} value Value for the 'chg' parameter in the chart Uri.
***REMOVED***
goog.ui.ServerChart.prototype.setGridParameter = function(value) {
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.GRID, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the 'chg' parameter of the chart Uri.
***REMOVED*** This is used by various types of charts to specify Grids.
***REMOVED***
***REMOVED*** @return {string|undefined} The 'chg' parameter of the chart Uri.
***REMOVED***
goog.ui.ServerChart.prototype.getGridParameter = function() {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (
      this.uri_.getParameterValue(goog.ui.ServerChart.UriParam.GRID));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the 'chm' parameter of the chart Uri.
***REMOVED*** This is used by various types of charts to specify Markers.
***REMOVED***
***REMOVED*** @param {string} value Value for the 'chm' parameter in the chart Uri.
***REMOVED***
goog.ui.ServerChart.prototype.setMarkerParameter = function(value) {
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.MARKERS, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the 'chm' parameter of the chart Uri.
***REMOVED*** This is used by various types of charts to specify Markers.
***REMOVED***
***REMOVED*** @return {string|undefined} The 'chm' parameter of the chart Uri.
***REMOVED***
goog.ui.ServerChart.prototype.getMarkerParameter = function() {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (
      this.uri_.getParameterValue(goog.ui.ServerChart.UriParam.MARKERS));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the 'chp' parameter of the chart Uri.
***REMOVED*** This is used by various types of charts to specify certain options.
***REMOVED*** e.g., finance charts use this to designate which line is the 0 axis.
***REMOVED***
***REMOVED*** @param {string|number} value Value for the 'chp' parameter in the chart Uri.
***REMOVED***
goog.ui.ServerChart.prototype.setMiscParameter = function(value) {
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.MISC_PARAMS,
                              String(value));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the 'chp' parameter of the chart Uri.
***REMOVED*** This is used by various types of charts to specify certain options.
***REMOVED*** e.g., finance charts use this to designate which line is the 0 axis.
***REMOVED***
***REMOVED*** @return {string|undefined} The 'chp' parameter of the chart Uri.
***REMOVED***
goog.ui.ServerChart.prototype.getMiscParameter = function() {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (
      this.uri_.getParameterValue(goog.ui.ServerChart.UriParam.MISC_PARAMS));
***REMOVED***


***REMOVED***
***REMOVED*** Enum of chart data encoding types
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.ServerChart.EncodingType = {
  AUTOMATIC: '',
  EXTENDED: 'e',
  SIMPLE: 's',
  TEXT: 't'
***REMOVED***


***REMOVED***
***REMOVED*** Enum of chart types with their short names used by the chartserver.
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.ServerChart.ChartType = {
  BAR: 'br',
  CLOCK: 'cf',
  CONCENTRIC_PIE: 'pc',
  FILLEDLINE: 'lr',
  FINANCE: 'lfi',
  GOOGLEOMETER: 'gom',
  HORIZONTAL_GROUPED_BAR: 'bhg',
  HORIZONTAL_STACKED_BAR: 'bhs',
  LINE: 'lc',
  MAP: 't',
  MAPUSA: 'tuss',
  MAPWORLD: 'twoc',
  PIE: 'p',
  PIE3D: 'p3',
  RADAR: 'rs',
  SCATTER: 's',
  SPARKLINE: 'ls',
  VENN: 'v',
  VERTICAL_GROUPED_BAR: 'bvg',
  VERTICAL_STACKED_BAR: 'bvs',
  XYLINE: 'lxy'
***REMOVED***


***REMOVED***
***REMOVED*** Enum of multi-axis types.
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.ServerChart.MultiAxisType = {
  X_AXIS: 'x',
  LEFT_Y_AXIS: 'y',
  RIGHT_Y_AXIS: 'r',
  TOP_AXIS: 't'
***REMOVED***


***REMOVED***
***REMOVED*** Enum of multi-axis alignments.
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
goog.ui.ServerChart.MultiAxisAlignment = {
  ALIGN_LEFT: -1,
  ALIGN_CENTER: 0,
  ALIGN_RIGHT: 1
***REMOVED***


***REMOVED***
***REMOVED*** Enum of legend positions.
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.ServerChart.LegendPosition = {
  TOP: 't',
  BOTTOM: 'b',
  LEFT: 'l',
  RIGHT: 'r'
***REMOVED***


***REMOVED***
***REMOVED*** Enum of line and tick options for an axis.
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.ServerChart.AxisDisplayType = {
  LINE_AND_TICKS: 'lt',
  LINE: 'l',
  TICKS: 't'
***REMOVED***


***REMOVED***
***REMOVED*** Enum of chart maximum values in pixels, as listed at:
***REMOVED*** http://code.google.com/apis/chart/basics.html
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
goog.ui.ServerChart.MaximumValue = {
  WIDTH: 1000,
  HEIGHT: 1000,
  MAP_WIDTH: 440,
  MAP_HEIGHT: 220,
  TOTAL_AREA: 300000
***REMOVED***


***REMOVED***
***REMOVED*** Enum of ChartServer URI parameters.
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.ServerChart.UriParam = {
  BACKGROUND_FILL: 'chf',
  BAR_HEIGHT: 'chbh',
  DATA: 'chd',
  DATA_COLORS: 'chco',
  DATA_LABELS: 'chld',
  DATA_SCALING: 'chds',
  DIGITAL_SIGNATURE: 'sig',
  GEOGRAPHICAL_REGION: 'chtm',
  GRID: 'chg',
  LABEL_COLORS: 'chlc',
  LEFT_Y_LABELS: 'chly',
  LEGEND: 'chdl',
  LEGEND_POSITION: 'chdlp',
  LEGEND_TEXTS: 'chdl',
  LINE_STYLES: 'chls',
  MARGINS: 'chma',
  MARKERS: 'chm',
  MISC_PARAMS: 'chp',
  MULTI_AXIS_LABEL_POSITION: 'chxp',
  MULTI_AXIS_LABEL_TEXT: 'chxl',
  MULTI_AXIS_RANGE: 'chxr',
  MULTI_AXIS_STYLE: 'chxs',
  MULTI_AXIS_TYPES: 'chxt',
  RIGHT_LABELS: 'chlr',
  RIGHT_LABEL_POSITIONS: 'chlrp',
  SIZE: 'chs',
  TITLE: 'chtt',
  TITLE_FORMAT: 'chts',
  TYPE: 'cht',
  X_AXIS_STYLE: 'chx',
  X_LABELS: 'chl'
***REMOVED***


***REMOVED***
***REMOVED*** Sets the background fill.
***REMOVED***
***REMOVED*** @param {Array.<Object>} fill An array of background fill specification
***REMOVED***     objects. Each object may have the following properties:
***REMOVED***     {string} area The area to fill, either 'bg' for background or 'c' for
***REMOVED***         chart area.  The default is 'bg'.
***REMOVED***     {string} color (required) The color of the background fill.
***REMOVED***     // TODO(user): Add support for gradient/stripes, which requires
***REMOVED***     // a different object structure.
***REMOVED***
goog.ui.ServerChart.prototype.setBackgroundFill = function(fill) {
  var value = [];
  goog.array.forEach(fill, function(spec) {
    spec.area = spec.area || 'bg';
    spec.effect = spec.effect || 's';
    value.push([spec.area, spec.effect, spec.color].join(','));
  });
  value = value.join('|');
  this.setParameterValue(goog.ui.ServerChart.UriParam.BACKGROUND_FILL, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the background fill.
***REMOVED***
***REMOVED*** @return {Array.<Object>} An array of background fill specifications.
***REMOVED***     If the fill specification string is in an unsupported format, the method
***REMOVED***    returns an empty array.
***REMOVED***
goog.ui.ServerChart.prototype.getBackgroundFill = function() {
  var value =
      this.uri_.getParameterValue(goog.ui.ServerChart.UriParam.BACKGROUND_FILL);
  var result = [];
  if (goog.isDefAndNotNull(value)) {
    var fillSpecifications = value.split('|');
    var valid = true;
    goog.array.forEach(fillSpecifications, function(spec) {
      var parts = spec.split(',');
      if (valid && parts[1] == 's') {
        result.push({area: parts[0], effect: parts[1], color: parts[2]});
      } else {
        // If the format is unsupported, return an empty array.
        result = [];
        valid = false;
      }
    });
  }
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the encoding type.
***REMOVED***
***REMOVED*** @param {goog.ui.ServerChart.EncodingType} type Desired data encoding type.
***REMOVED***
goog.ui.ServerChart.prototype.setEncodingType = function(type) {
  this.encodingType_ = type;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the encoding type.
***REMOVED***
***REMOVED*** @return {goog.ui.ServerChart.EncodingType} The encoding type.
***REMOVED***
goog.ui.ServerChart.prototype.getEncodingType = function() {
  return this.encodingType_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the chart type.
***REMOVED***
***REMOVED*** @param {goog.ui.ServerChart.ChartType} type The desired chart type.
***REMOVED***
goog.ui.ServerChart.prototype.setType = function(type) {
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.TYPE, type);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the chart type.
***REMOVED***
***REMOVED*** @return {goog.ui.ServerChart.ChartType} The chart type.
***REMOVED***
goog.ui.ServerChart.prototype.getType = function() {
  return***REMOVED*****REMOVED*** @type {goog.ui.ServerChart.ChartType}***REMOVED*** (
      this.uri_.getParameterValue(goog.ui.ServerChart.UriParam.TYPE));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the chart size.
***REMOVED***
***REMOVED*** @param {number=} opt_width Optional chart width, defaults to 300.
***REMOVED*** @param {number=} opt_height Optional chart height, defaults to 150.
***REMOVED***
goog.ui.ServerChart.prototype.setSize = function(opt_width, opt_height) {
  var sizeString = [opt_width || 300, opt_height || 150].join('x');
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.SIZE, sizeString);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the chart size.
***REMOVED***
***REMOVED*** @return {Array.<string>} [Width, Height].
***REMOVED***
goog.ui.ServerChart.prototype.getSize = function() {
  var sizeStr = this.uri_.getParameterValue(goog.ui.ServerChart.UriParam.SIZE);
  return sizeStr.split('x');
***REMOVED***


***REMOVED***
***REMOVED*** Sets the minimum value of the chart.
***REMOVED***
***REMOVED*** @param {number} minValue The minimum value of the chart.
***REMOVED***
goog.ui.ServerChart.prototype.setMinValue = function(minValue) {
  this.minValue_ = minValue;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The minimum value of the chart.
***REMOVED***
goog.ui.ServerChart.prototype.getMinValue = function() {
  return this.minValue_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the maximum value of the chart.
***REMOVED***
***REMOVED*** @param {number} maxValue The maximum value of the chart.
***REMOVED***
goog.ui.ServerChart.prototype.setMaxValue = function(maxValue) {
  this.maxValue_ = maxValue;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The maximum value of the chart.
***REMOVED***
goog.ui.ServerChart.prototype.getMaxValue = function() {
  return this.maxValue_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the chart margins.
***REMOVED***
***REMOVED*** @param {number} leftMargin The size in pixels of the left margin.
***REMOVED*** @param {number} rightMargin The size in pixels of the right margin.
***REMOVED*** @param {number} topMargin The size in pixels of the top margin.
***REMOVED*** @param {number} bottomMargin The size in pixels of the bottom margin.
***REMOVED***
goog.ui.ServerChart.prototype.setMargins = function(leftMargin, rightMargin,
    topMargin, bottomMargin) {
  var margins = [leftMargin, rightMargin, topMargin, bottomMargin].join(',');
  var UriParam = goog.ui.ServerChart.UriParam;
  this.uri_.setParameterValue(UriParam.MARGINS, margins);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of grid lines along the X-axis.
***REMOVED***
***REMOVED*** @param {number} gridlines The number of X-axis grid lines.
***REMOVED***
goog.ui.ServerChart.prototype.setGridX = function(gridlines) {
  // Need data for this to work.
  this.gridX_ = gridlines;
  this.setGrids_(this.gridX_, this.gridY_);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of gridlines along the X-axis.
***REMOVED***
goog.ui.ServerChart.prototype.getGridX = function() {
  return this.gridX_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of grid lines along the Y-axis.
***REMOVED***
***REMOVED*** @param {number} gridlines The number of Y-axis grid lines.
***REMOVED***
goog.ui.ServerChart.prototype.setGridY = function(gridlines) {
  // Need data for this to work.
  this.gridY_ = gridlines;
  this.setGrids_(this.gridX_, this.gridY_);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of gridlines along the Y-axis.
***REMOVED***
goog.ui.ServerChart.prototype.getGridY = function() {
  return this.gridY_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the grids for the chart
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {number} x The number of grid lines along the x-axis.
***REMOVED*** @param {number} y The number of grid lines along the y-axis.
***REMOVED***
goog.ui.ServerChart.prototype.setGrids_ = function(x, y) {
  var gridArray = [x == 0 ? 0 : 100 / x,
                   y == 0 ? 0 : 100 / y];
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.GRID,
                              gridArray.join(','));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the X Labels for the chart.
***REMOVED***
***REMOVED*** @param {Array.<string>} labels The X Labels for the chart.
***REMOVED***
goog.ui.ServerChart.prototype.setXLabels = function(labels) {
  this.xLabels_ = labels;
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.X_LABELS,
                              this.xLabels_.join('|'));
***REMOVED***


***REMOVED***
***REMOVED*** @return {Array.<string>} The X Labels for the chart.
***REMOVED***
goog.ui.ServerChart.prototype.getXLabels = function() {
  return this.xLabels_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the chart is a bar chart.
***REMOVED***
goog.ui.ServerChart.prototype.isBarChart = function() {
  var type = this.getType();
  return type == goog.ui.ServerChart.ChartType.BAR ||
      type == goog.ui.ServerChart.ChartType.HORIZONTAL_GROUPED_BAR ||
      type == goog.ui.ServerChart.ChartType.HORIZONTAL_STACKED_BAR ||
      type == goog.ui.ServerChart.ChartType.VERTICAL_GROUPED_BAR ||
      type == goog.ui.ServerChart.ChartType.VERTICAL_STACKED_BAR;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the chart is a pie chart.
***REMOVED***
goog.ui.ServerChart.prototype.isPieChart = function() {
  var type = this.getType();
  return type == goog.ui.ServerChart.ChartType.PIE ||
      type == goog.ui.ServerChart.ChartType.PIE3D ||
      type == goog.ui.ServerChart.ChartType.CONCENTRIC_PIE;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the chart is a grouped bar chart.
***REMOVED***
goog.ui.ServerChart.prototype.isGroupedBarChart = function() {
  var type = this.getType();
  return type == goog.ui.ServerChart.ChartType.HORIZONTAL_GROUPED_BAR ||
      type == goog.ui.ServerChart.ChartType.VERTICAL_GROUPED_BAR;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the chart is a horizontal bar chart.
***REMOVED***
goog.ui.ServerChart.prototype.isHorizontalBarChart = function() {
  var type = this.getType();
  return type == goog.ui.ServerChart.ChartType.BAR ||
      type == goog.ui.ServerChart.ChartType.HORIZONTAL_GROUPED_BAR ||
      type == goog.ui.ServerChart.ChartType.HORIZONTAL_STACKED_BAR;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the chart is a line chart.
***REMOVED***
goog.ui.ServerChart.prototype.isLineChart = function() {
  var type = this.getType();
  return type == goog.ui.ServerChart.ChartType.FILLEDLINE ||
      type == goog.ui.ServerChart.ChartType.LINE ||
      type == goog.ui.ServerChart.ChartType.SPARKLINE ||
      type == goog.ui.ServerChart.ChartType.XYLINE;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the chart is a map.
***REMOVED***
goog.ui.ServerChart.prototype.isMap = function() {
  var type = this.getType();
  return type == goog.ui.ServerChart.ChartType.MAP ||
      type == goog.ui.ServerChart.ChartType.MAPUSA ||
      type == goog.ui.ServerChart.ChartType.MAPWORLD;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the chart is a stacked bar chart.
***REMOVED***
goog.ui.ServerChart.prototype.isStackedBarChart = function() {
  var type = this.getType();
  return type == goog.ui.ServerChart.ChartType.BAR ||
      type == goog.ui.ServerChart.ChartType.HORIZONTAL_STACKED_BAR ||
      type == goog.ui.ServerChart.ChartType.VERTICAL_STACKED_BAR;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the chart is a vertical bar chart.
***REMOVED***
goog.ui.ServerChart.prototype.isVerticalBarChart = function() {
  var type = this.getType();
  return type == goog.ui.ServerChart.ChartType.VERTICAL_GROUPED_BAR ||
      type == goog.ui.ServerChart.ChartType.VERTICAL_STACKED_BAR;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the Left Labels for the chart.
***REMOVED*** NOTE: The array should start with the lowest value, and then
***REMOVED***       move progessively up the axis. So if you want labels
***REMOVED***       from 0 to 100 with 0 at bottom of the graph, then you would
***REMOVED***       want to pass something like [0,25,50,75,100].
***REMOVED***
***REMOVED*** @param {Array.<string>} labels The Left Labels for the chart.
***REMOVED***
goog.ui.ServerChart.prototype.setLeftLabels = function(labels) {
  this.leftLabels_ = labels;
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.LEFT_Y_LABELS,
                              this.leftLabels_.reverse().join('|'));
***REMOVED***


***REMOVED***
***REMOVED*** @return {Array.<string>} The Left Labels for the chart.
***REMOVED***
goog.ui.ServerChart.prototype.getLeftLabels = function() {
  return this.leftLabels_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the given ChartServer parameter.
***REMOVED***
***REMOVED*** @param {goog.ui.ServerChart.UriParam} key The ChartServer parameter to set.
***REMOVED*** @param {string} value The value to set for the ChartServer parameter.
***REMOVED***
goog.ui.ServerChart.prototype.setParameterValue = function(key, value) {
  this.uri_.setParameterValue(key, value);
***REMOVED***


***REMOVED***
***REMOVED*** Removes the given ChartServer parameter.
***REMOVED***
***REMOVED*** @param {goog.ui.ServerChart.UriParam} key The ChartServer parameter to
***REMOVED***     remove.
***REMOVED***
goog.ui.ServerChart.prototype.removeParameter = function(key) {
  this.uri_.removeParameter(key);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the Right Labels for the chart.
***REMOVED*** NOTE: The array should start with the lowest value, and then
***REMOVED***       move progessively up the axis. So if you want labels
***REMOVED***       from 0 to 100 with 0 at bottom of the graph, then you would
***REMOVED***       want to pass something like [0,25,50,75,100].
***REMOVED***
***REMOVED*** @param {Array.<string>} labels The Right Labels for the chart.
***REMOVED***
goog.ui.ServerChart.prototype.setRightLabels = function(labels) {
  this.rightLabels_ = labels;
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.RIGHT_LABELS,
                              this.rightLabels_.reverse().join('|'));
***REMOVED***


***REMOVED***
***REMOVED*** @return {Array.<string>} The Right Labels for the chart.
***REMOVED***
goog.ui.ServerChart.prototype.getRightLabels = function() {
  return this.rightLabels_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the position relative to the chart where the legend is to be displayed.
***REMOVED***
***REMOVED*** @param {goog.ui.ServerChart.LegendPosition} value Legend position.
***REMOVED***
goog.ui.ServerChart.prototype.setLegendPosition = function(value) {
  this.uri_.setParameterValue(
      goog.ui.ServerChart.UriParam.LEGEND_POSITION, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the position relative to the chart where the legend is to be
***REMOVED*** displayed.
***REMOVED***
***REMOVED*** @return {goog.ui.ServerChart.LegendPosition} Legend position.
***REMOVED***
goog.ui.ServerChart.prototype.getLegendPosition = function() {
  return***REMOVED*****REMOVED*** @type {goog.ui.ServerChart.LegendPosition}***REMOVED*** (
      this.uri_.getParameterValue(
          goog.ui.ServerChart.UriParam.LEGEND_POSITION));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of "visible" data sets. All data sets that come after
***REMOVED*** the visible data set are not drawn as part of the chart. Instead, they
***REMOVED*** are available for positioning markers.

***REMOVED*** @param {?number} n The number of visible data sets, or null if all data
***REMOVED*** sets are to be visible.
***REMOVED***
goog.ui.ServerChart.prototype.setNumVisibleDataSets = function(n) {
  this.numVisibleDataSets_ = n;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of "visible" data sets. All data sets that come after
***REMOVED*** the visible data set are not drawn as part of the chart. Instead, they
***REMOVED*** are available for positioning markers.
***REMOVED***
***REMOVED*** @return {?number} The number of visible data sets, or null if all data
***REMOVED*** sets are visible.
***REMOVED***
goog.ui.ServerChart.prototype.getNumVisibleDataSets = function() {
  return this.numVisibleDataSets_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the weight function for a Venn Diagram along with the associated
***REMOVED***     colors and legend text. Weights are assigned as follows:
***REMOVED***     weights[0] is relative area of circle A.
***REMOVED***     weights[1] is relative area of circle B.
***REMOVED***     weights[2] is relative area of circle C.
***REMOVED***     weights[3] is relative area of overlap of circles A and B.
***REMOVED***     weights[4] is relative area of overlap of circles A and C.
***REMOVED***     weights[5] is relative area of overlap of circles B and C.
***REMOVED***     weights[6] is relative area of overlap of circles A, B and C.
***REMOVED*** For a two circle Venn Diagram the weights are assigned as follows:
***REMOVED***     weights[0] is relative area of circle A.
***REMOVED***     weights[1] is relative area of circle B.
***REMOVED***     weights[2] is relative area of overlap of circles A and B.
***REMOVED***
***REMOVED*** @param {Array.<number>} weights The relative weights of the circles.
***REMOVED*** @param {Array.<string>=} opt_legendText The legend labels for the circles.
***REMOVED*** @param {Array.<string>=} opt_colors The colors for the circles.
***REMOVED***
goog.ui.ServerChart.prototype.setVennSeries = function(
    weights, opt_legendText, opt_colors) {
  if (this.getType() != goog.ui.ServerChart.ChartType.VENN) {
    throw Error('Can only set a weight function for a Venn diagram.');
  }
  var dataMin = this.arrayMin_(weights);
  if (dataMin < this.minValue_) {
    this.minValue_ = dataMin;
  }
  var dataMax = this.arrayMax_(weights);
  if (dataMax > this.maxValue_) {
    this.maxValue_ = dataMax;
  }
  if (goog.isDef(opt_legendText)) {
    goog.array.forEach(
        opt_legendText,
        goog.bind(function(legend) {
          this.setLegendTexts_.push(legend);
        }, this));
    this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.LEGEND_TEXTS,
                                this.setLegendTexts_.join('|'));
  }
  // If the caller only gave three weights, then they wanted a two circle
  // Venn Diagram. Create a 3 circle weight function where circle C has
  // area zero.
  if (weights.length == 3) {
    weights[3] = weights[2];
    weights[2] = 0.0;
  }
  this.dataSets_.push(weights);
  if (goog.isDef(opt_colors)) {
    goog.array.forEach(opt_colors, goog.bind(function(color) {
      this.setColors_.push(color);
    }, this));
    this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.DATA_COLORS,
                                this.setColors_.join(','));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the title of the chart.
***REMOVED***
***REMOVED*** @param {string} title The chart title.
***REMOVED***
goog.ui.ServerChart.prototype.setTitle = function(title) {
  this.title_ = title;
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.TITLE,
                              this.title_.replace(/\n/g, '|'));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the size of the chart title.
***REMOVED***
***REMOVED*** @param {number} size The title size, in points.
***REMOVED***
goog.ui.ServerChart.prototype.setTitleSize = function(size) {
  this.titleSize_ = size;
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.TITLE_FORMAT,
                              this.titleColor_ + ',' + this.titleSize_);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} size The title size, in points.
***REMOVED***
goog.ui.ServerChart.prototype.getTitleSize = function() {
  return this.titleSize_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the color of the chart title.
***REMOVED***
***REMOVED*** NOTE: The color string should NOT have a '#' at the beginning of it.
***REMOVED***
***REMOVED*** @param {string} color The hex value for the title color.
***REMOVED***
goog.ui.ServerChart.prototype.setTitleColor = function(color) {
  this.titleColor_ = color;
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.TITLE_FORMAT,
                              this.titleColor_ + ',' + this.titleSize_);
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} color The hex value for the title color.
***REMOVED***
goog.ui.ServerChart.prototype.getTitleColor = function() {
  return this.titleColor_;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a legend to the chart.
***REMOVED***
***REMOVED*** @param {Array.<string>} legend The legend to add.
***REMOVED***
goog.ui.ServerChart.prototype.setLegend = function(legend) {
  this.legend_ = legend;
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.LEGEND,
                              this.legend_.join('|'));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the data scaling.
***REMOVED*** NOTE: This also changes the encoding type because data scaling will
***REMOVED***     only work with {@code goog.ui.ServerChart.EncodingType.TEXT}
***REMOVED***     encoding.
***REMOVED*** @param {number} minimum The lowest number to apply to the data.
***REMOVED*** @param {number} maximum The highest number to apply to the data.
***REMOVED***
goog.ui.ServerChart.prototype.setDataScaling = function(minimum, maximum) {
  this.encodingType_ = goog.ui.ServerChart.EncodingType.TEXT;
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.DATA_SCALING,
                              minimum + ',' + maximum);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the widths of the bars and the spaces between the bars in a bar
***REMOVED*** chart.
***REMOVED*** NOTE: If the space between groups is specified but the space between
***REMOVED***     bars is left undefined, the space between groups will be interpreted
***REMOVED***     as the space between bars because this is the behavior exposed
***REMOVED***     in the external developers guide.
***REMOVED*** @param {number} barWidth The width of a bar in pixels.
***REMOVED*** @param {number=} opt_spaceBars The width of the space between
***REMOVED***     bars in a group in pixels.
***REMOVED*** @param {number=} opt_spaceGroups The width of the space between
***REMOVED***     groups.
***REMOVED***
goog.ui.ServerChart.prototype.setBarSpaceWidths = function(barWidth,
                                                           opt_spaceBars,
                                                           opt_spaceGroups) {
  var widths = [barWidth];
  if (goog.isDef(opt_spaceBars)) {
    widths.push(opt_spaceBars);
  }
  if (goog.isDef(opt_spaceGroups)) {
    widths.push(opt_spaceGroups);
  }
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.BAR_HEIGHT,
                              widths.join(','));
***REMOVED***


***REMOVED***
***REMOVED*** Specifies that the bar width in a bar chart should be calculated
***REMOVED*** automatically given the space available in the chart, while optionally
***REMOVED*** setting the spaces between the bars.
***REMOVED*** NOTE: If the space between groups is specified but the space between
***REMOVED***     bars is left undefined, the space between groups will be interpreted
***REMOVED***     as the space between bars because this is the behavior exposed
***REMOVED***     in the external developers guide.
***REMOVED*** @param {number=} opt_spaceBars The width of the space between
***REMOVED***     bars in a group in pixels.
***REMOVED*** @param {number=} opt_spaceGroups The width of the space between
***REMOVED***     groups.
***REMOVED***
goog.ui.ServerChart.prototype.setAutomaticBarWidth = function(opt_spaceBars,
                                                              opt_spaceGroups) {
  var widths = ['a'];
  if (goog.isDef(opt_spaceBars)) {
    widths.push(opt_spaceBars);
  }
  if (goog.isDef(opt_spaceGroups)) {
    widths.push(opt_spaceGroups);
  }
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.BAR_HEIGHT,
                              widths.join(','));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a multi-axis to the chart, and sets its type. Multiple axes of the same
***REMOVED*** type can be added.
***REMOVED***
***REMOVED*** @param {goog.ui.ServerChart.MultiAxisType} axisType The desired axis type.
***REMOVED*** @return {number} The index of the newly inserted axis, suitable for feeding
***REMOVED***     to the setMultiAxis*() functions.
***REMOVED***
goog.ui.ServerChart.prototype.addMultiAxis = function(axisType) {
  this.multiAxisType_.push(axisType);
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.MULTI_AXIS_TYPES,
                              this.multiAxisType_.join(','));
  return this.multiAxisType_.length - 1;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the axis type for the given axis, or all of them in an array if the
***REMOVED*** axis number is not given.
***REMOVED***
***REMOVED*** @param {number=} opt_axisNumber The axis index, as returned by addMultiAxis.
***REMOVED*** @return {goog.ui.ServerChart.MultiAxisType|
***REMOVED***     Array.<goog.ui.ServerChart.MultiAxisType>}
***REMOVED***     The axis type for the given axis, or all of them in an array if the
***REMOVED***     axis number is not given.
***REMOVED***
goog.ui.ServerChart.prototype.getMultiAxisType = function(opt_axisNumber) {
  if (goog.isDef(opt_axisNumber)) {
    return this.multiAxisType_[opt_axisNumber];
  }
  return this.multiAxisType_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the label text (usually multiple values) for a given axis, overwriting
***REMOVED*** any existing values.
***REMOVED***
***REMOVED*** @param {number} axisNumber The axis index, as returned by addMultiAxis.
***REMOVED*** @param {Array.<string>} labelText The actual label text to be added.
***REMOVED***
goog.ui.ServerChart.prototype.setMultiAxisLabelText = function(axisNumber,
                                                               labelText) {
  this.multiAxisLabelText_[axisNumber] = labelText;

  var axisString = this.computeMultiAxisDataString_(this.multiAxisLabelText_,
                                                    ':|',
                                                    '|',
                                                    '|');
  this.uri_.setParameterValue(
      goog.ui.ServerChart.UriParam.MULTI_AXIS_LABEL_TEXT,
      axisString);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the label text, or all of them in a two-dimensional array if the
***REMOVED*** axis number is not given.
***REMOVED***
***REMOVED*** @param {number=} opt_axisNumber The axis index, as returned by addMultiAxis.
***REMOVED*** @return {Object|Array.<string>} The label text, or all of them in a
***REMOVED***     two-dimensional array if the axis number is not given.
***REMOVED***
goog.ui.ServerChart.prototype.getMultiAxisLabelText = function(opt_axisNumber) {
  if (goog.isDef(opt_axisNumber)) {
    return this.multiAxisLabelText_[opt_axisNumber];
  }
  return this.multiAxisLabelText_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the label positions for a given axis, overwriting any existing values.
***REMOVED*** The label positions are assumed to be floating-point numbers within the
***REMOVED*** range of the axis.
***REMOVED***
***REMOVED*** @param {number} axisNumber The axis index, as returned by addMultiAxis.
***REMOVED*** @param {Array.<number>} labelPosition The actual label positions to be added.
***REMOVED***
goog.ui.ServerChart.prototype.setMultiAxisLabelPosition = function(
    axisNumber, labelPosition) {
  this.multiAxisLabelPosition_[axisNumber] = labelPosition;

  var positionString = this.computeMultiAxisDataString_(
      this.multiAxisLabelPosition_,
      ',',
      ',',
      '|');
  this.uri_.setParameterValue(
      goog.ui.ServerChart.UriParam.MULTI_AXIS_LABEL_POSITION,
      positionString);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the label positions for a given axis number, or all of them in a
***REMOVED*** two-dimensional array if the axis number is not given.
***REMOVED***
***REMOVED*** @param {number=} opt_axisNumber The axis index, as returned by addMultiAxis.
***REMOVED*** @return {Object|Array.<number>} The label positions for a given axis number,
***REMOVED***     or all of them in a two-dimensional array if the axis number is not
***REMOVED***     given.
***REMOVED***
goog.ui.ServerChart.prototype.getMultiAxisLabelPosition =
    function(opt_axisNumber) {
  if (goog.isDef(opt_axisNumber)) {
    return this.multiAxisLabelPosition_[opt_axisNumber];
  }
  return this.multiAxisLabelPosition_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the label range for a given axis, overwriting any existing range.
***REMOVED*** The default range is from 0 to 100. If the start value is larger than the
***REMOVED*** end value, the axis direction is reversed.  rangeStart and rangeEnd must
***REMOVED*** be two different finite numbers.
***REMOVED***
***REMOVED*** @param {number} axisNumber The axis index, as returned by addMultiAxis.
***REMOVED*** @param {number} rangeStart The new start of the range.
***REMOVED*** @param {number} rangeEnd The new end of the range.
***REMOVED*** @param {number=} opt_interval The interval between axis labels.
***REMOVED***
goog.ui.ServerChart.prototype.setMultiAxisRange = function(axisNumber,
                                                           rangeStart,
                                                           rangeEnd,
                                                           opt_interval) {
  goog.asserts.assert(rangeStart != rangeEnd,
      'Range start and end cannot be the same value.');
  goog.asserts.assert(isFinite(rangeStart) && isFinite(rangeEnd),
      'Range start and end must be finite numbers.');
  this.multiAxisRange_[axisNumber] = [rangeStart, rangeEnd];
  if (goog.isDef(opt_interval)) {
    this.multiAxisRange_[axisNumber].push(opt_interval);
  }
  var rangeString = this.computeMultiAxisDataString_(this.multiAxisRange_,
      ',', ',', '|');
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.MULTI_AXIS_RANGE,
      rangeString);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the label range for a given axis number as a two-element array of
***REMOVED*** (range start, range end), or all of them in a two-dimensional array if the
***REMOVED*** axis number is not given.
***REMOVED***
***REMOVED*** @param {number=} opt_axisNumber The axis index, as returned by addMultiAxis.
***REMOVED*** @return {Object|Array.<number>} The label range for a given axis number as a
***REMOVED***     two-element array of (range start, range end), or all of them in a
***REMOVED***     two-dimensional array if the axis number is not given.
***REMOVED***
goog.ui.ServerChart.prototype.getMultiAxisRange = function(opt_axisNumber) {
  if (goog.isDef(opt_axisNumber)) {
    return this.multiAxisRange_[opt_axisNumber];
  }
  return this.multiAxisRange_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the label style for a given axis, overwriting any existing style.
***REMOVED*** The default style is as follows: Default is x-axis labels are centered, left
***REMOVED*** hand y-axis labels are right aligned, right hand y-axis labels are left
***REMOVED*** aligned. The font size and alignment are optional parameters.
***REMOVED***
***REMOVED*** NOTE: The color string should NOT have a '#' at the beginning of it.
***REMOVED***
***REMOVED*** @param {number} axisNumber The axis index, as returned by addMultiAxis.
***REMOVED*** @param {string} color The hex value for this label's color.
***REMOVED*** @param {number=} opt_fontSize The label font size, in pixels.
***REMOVED*** @param {goog.ui.ServerChart.MultiAxisAlignment=} opt_alignment The label
***REMOVED***     alignment.
***REMOVED*** @param {goog.ui.ServerChart.AxisDisplayType=} opt_axisDisplay The axis
***REMOVED***     line and ticks.
***REMOVED***
goog.ui.ServerChart.prototype.setMultiAxisLabelStyle = function(axisNumber,
                                                                color,
                                                                opt_fontSize,
                                                                opt_alignment,
                                                             opt_axisDisplay) {
  var style = [color];
  if (goog.isDef(opt_fontSize) || goog.isDef(opt_alignment)) {
    style.push(opt_fontSize || '');
  }
  if (goog.isDef(opt_alignment)) {
    style.push(opt_alignment);
  }
  if (opt_axisDisplay) {
    style.push(opt_axisDisplay);
  }
  this.multiAxisLabelStyle_[axisNumber] = style;
  var styleString = this.computeMultiAxisDataString_(this.multiAxisLabelStyle_,
                                                     ',',
                                                     ',',
                                                     '|');
  this.uri_.setParameterValue(
      goog.ui.ServerChart.UriParam.MULTI_AXIS_STYLE,
      styleString);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the label style for a given axis number as a one- to three-element
***REMOVED*** array, or all of them in a two-dimensional array if the axis number is not
***REMOVED*** given.
***REMOVED***
***REMOVED*** @param {number=} opt_axisNumber The axis index, as returned by addMultiAxis.
***REMOVED*** @return {Object|Array.<number>} The label style for a given axis number as a
***REMOVED***     one- to three-element array, or all of them in a two-dimensional array if
***REMOVED***     the axis number is not given.
***REMOVED***
goog.ui.ServerChart.prototype.getMultiAxisLabelStyle =
    function(opt_axisNumber) {
  if (goog.isDef(opt_axisNumber)) {
    return this.multiAxisLabelStyle_[opt_axisNumber];
  }
  return this.multiAxisLabelStyle_;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a data set.
***REMOVED*** NOTE: The color string should NOT have a '#' at the beginning of it.
***REMOVED***
***REMOVED*** @param {Array.<number|null>} data An array of numbers (values can be
***REMOVED***     NaN or null).
***REMOVED*** @param {string} color The hex value for this data set's color.
***REMOVED*** @param {string=} opt_legendText The legend text, if any, for this data
***REMOVED***     series. NOTE: If specified, all previously added data sets must also
***REMOVED***     have a legend text.
***REMOVED***
goog.ui.ServerChart.prototype.addDataSet = function(data,
                                                    color,
                                                    opt_legendText) {
  var dataMin = this.arrayMin_(data);
  if (dataMin < this.minValue_) {
    this.minValue_ = dataMin;
  }

  var dataMax = this.arrayMax_(data);
  if (dataMax > this.maxValue_) {
    this.maxValue_ = dataMax;
  }

  if (goog.isDef(opt_legendText)) {
    if (this.setLegendTexts_.length < this.dataSets_.length) {
      throw Error('Cannot start adding legends text after first element.');
    }
    this.setLegendTexts_.push(opt_legendText);
    this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.LEGEND_TEXTS,
                                this.setLegendTexts_.join('|'));
  }

  this.dataSets_.push(data);
  this.setColors_.push(color);

  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.DATA_COLORS,
                              this.setColors_.join(','));
***REMOVED***


***REMOVED***
***REMOVED*** Clears the data sets from the graph. All data, including the colors and
***REMOVED*** legend text, is cleared.
***REMOVED***
goog.ui.ServerChart.prototype.clearDataSets = function() {
  var queryData = this.uri_.getQueryData();
  queryData.remove(goog.ui.ServerChart.UriParam.LEGEND_TEXTS);
  queryData.remove(goog.ui.ServerChart.UriParam.DATA_COLORS);
  queryData.remove(goog.ui.ServerChart.UriParam.DATA);
  this.setLegendTexts_.length = 0;
  this.setColors_.length = 0;
  this.dataSets_.length = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the given data set or all of them in a two-dimensional array if
***REMOVED*** the set number is not given.
***REMOVED***
***REMOVED*** @param {number=} opt_setNumber Optional data set number to get.
***REMOVED*** @return {Array} The given data set or all of them in a two-dimensional array
***REMOVED***     if the set number is not given.
***REMOVED***
goog.ui.ServerChart.prototype.getData = function(opt_setNumber) {
  if (goog.isDef(opt_setNumber)) {
    return this.dataSets_[opt_setNumber];
  }
  return this.dataSets_;
***REMOVED***


***REMOVED***
***REMOVED*** Computes the data string using the data in this.dataSets_ and sets
***REMOVED*** the object's URI accordingly. If the URI's length equals or exceeds the
***REMOVED*** limit, goog.ui.ServerChart.UriTooLongEvent is dispatched on the
***REMOVED*** goog.ui.ServerChart object.
***REMOVED*** @private
***REMOVED***
goog.ui.ServerChart.prototype.computeDataString_ = function() {
  var ok;
  if (this.encodingType_ != goog.ui.ServerChart.EncodingType.AUTOMATIC) {
    ok = this.computeDataStringForEncoding_(this.encodingType_);
  } else {
    ok = this.computeDataStringForEncoding_(
        goog.ui.ServerChart.EncodingType.EXTENDED);
    if (!ok) {
        ok = this.computeDataStringForEncoding_(
            goog.ui.ServerChart.EncodingType.SIMPLE);
    }
  }
  if (!ok) {
    this.dispatchEvent(
        new goog.ui.ServerChart.UriTooLongEvent(this.uri_.toString()));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Computes the data string using the data in this.dataSets_ and the encoding
***REMOVED*** specified by the encoding parameter, which must not be AUTOMATIC, and sets
***REMOVED*** the object's URI accordingly.
***REMOVED*** @param {goog.ui.ServerChart.EncodingType} encoding The data encoding to use;
***REMOVED***     must not be AUTOMATIC.
***REMOVED*** @return {boolean} False if the resulting URI is too long.
***REMOVED*** @private
***REMOVED***
goog.ui.ServerChart.prototype.computeDataStringForEncoding_ = function(
    encoding) {
  var dataStrings = [];
  for (var i = 0, setLen = this.dataSets_.length; i < setLen; ++i) {
    dataStrings[i] = this.getChartServerValues_(this.dataSets_[i],
                                                this.minValue_,
                                                this.maxValue_,
                                                encoding);
  }
  var delimiter = encoding == goog.ui.ServerChart.EncodingType.TEXT ? '|' : ',';
  dataStrings = dataStrings.join(delimiter);
  var data;
  if (this.numVisibleDataSets_ == null) {
    data = goog.string.buildString(encoding, ':', dataStrings);
  } else {
    data = goog.string.buildString(encoding, this.numVisibleDataSets_, ':',
        dataStrings);
  }
  this.uri_.setParameterValue(goog.ui.ServerChart.UriParam.DATA, data);
  return this.uri_.toString().length < this.uriLengthLimit_;
***REMOVED***


***REMOVED***
***REMOVED*** Computes a multi-axis data string from the given data and separators. The
***REMOVED*** general data format for each index/element in the array will be
***REMOVED*** "<arrayIndex><indexSeparator><arrayElement.join(elementSeparator)>", with
***REMOVED*** axisSeparator used between multiple elements.
***REMOVED*** @param {Object} data The data to compute the data string for, as a
***REMOVED***     sparse array of arrays. NOTE: The function uses the length of
***REMOVED***     multiAxisType_ to determine the upper bound for the outer array.
***REMOVED*** @param {string} indexSeparator The separator string inserted between each
***REMOVED***     index and the data itself, commonly a comma (,).
***REMOVED*** @param {string} elementSeparator The separator string inserted between each
***REMOVED***     element inside each sub-array in the data, if there are more than one;
***REMOVED***     commonly a comma (,).
***REMOVED*** @param {string} axisSeparator The separator string inserted between each
***REMOVED***     axis specification, if there are more than one; usually a pipe sign (|).
***REMOVED*** @return {string} The multi-axis data string.
***REMOVED*** @private
***REMOVED***
goog.ui.ServerChart.prototype.computeMultiAxisDataString_ = function(
    data,
    indexSeparator,
    elementSeparator,
    axisSeparator) {
  var elementStrings = [];
  for (var i = 0, setLen = this.multiAxisType_.length; i < setLen; ++i) {
    if (data[i]) {
      elementStrings.push(i + indexSeparator + data[i].join(elementSeparator));
    }
  }
  return elementStrings.join(axisSeparator);
***REMOVED***


***REMOVED***
***REMOVED*** Array of possible ChartServer data values
***REMOVED*** @type {string}
***REMOVED***
goog.ui.ServerChart.CHART_VALUES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
                                   'abcdefghijklmnopqrstuvwxyz' +
                                   '0123456789';


***REMOVED***
***REMOVED*** Array of extended ChartServer data values
***REMOVED*** @type {string}
***REMOVED***
goog.ui.ServerChart.CHART_VALUES_EXTENDED = goog.ui.ServerChart.CHART_VALUES +
                                            '-.';


***REMOVED***
***REMOVED*** Upper bound for extended values
***REMOVED***
goog.ui.ServerChart.EXTENDED_UPPER_BOUND =
    Math.pow(goog.ui.ServerChart.CHART_VALUES_EXTENDED.length, 2) - 1;


***REMOVED***
***REMOVED*** Converts a single number to an encoded data value suitable for ChartServer.
***REMOVED*** The TEXT encoding is the number in decimal; the SIMPLE encoding is a single
***REMOVED*** character, and the EXTENDED encoding is two characters.  See
***REMOVED*** http://code.google.com/apis/chart/docs/data_formats.html for the detailed
***REMOVED*** specification of these encoding formats.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {?number} value The value to convert (null for a missing data point).
***REMOVED*** @param {number} minValue The minimum value (used for normalization).
***REMOVED*** @param {number} maxValue The maximum value (used for normalization).
***REMOVED*** @param {goog.ui.ServerChart.EncodingType} encoding The data encoding to use;
***REMOVED***     must not be AUTOMATIC.
***REMOVED*** @return {string} The encoded data value.
***REMOVED***
goog.ui.ServerChart.prototype.getConvertedValue_ = function(value,
                                                            minValue,
                                                            maxValue,
                                                            encoding) {
  goog.asserts.assert(minValue <= maxValue,
      'minValue should be less than or equal to maxValue');
  var isExtended = (encoding == goog.ui.ServerChart.EncodingType.EXTENDED);

  if (goog.isNull(value) || !goog.isDef(value) || isNaN(value) ||
      value < minValue || value > maxValue) {
    return isExtended ? '__' : '_';
  }

  if (encoding == goog.ui.ServerChart.EncodingType.TEXT) {
    return String(value);
  }

  var frac = goog.ui.ServerChart.DEFAULT_NORMALIZATION;
  if (maxValue > minValue) {
    frac = (value - minValue) / (maxValue - minValue);
    // Previous checks of value ensure that 0 <= frac <= 1 at this point.
  }

  if (isExtended) {
    var maxIndex = goog.ui.ServerChart.CHART_VALUES_EXTENDED.length;
    var upperBound = goog.ui.ServerChart.EXTENDED_UPPER_BOUND;
    var index1 = Math.floor(frac***REMOVED*** upperBound / maxIndex);
    var index2 = Math.floor((frac***REMOVED*** upperBound) % maxIndex);
    var extendedVals = goog.ui.ServerChart.CHART_VALUES_EXTENDED;
    return extendedVals.charAt(index1) + extendedVals.charAt(index2);
  }

  var index = Math.round(frac***REMOVED*** (goog.ui.ServerChart.CHART_VALUES.length - 1));
  return goog.ui.ServerChart.CHART_VALUES.charAt(index);
***REMOVED***


***REMOVED***
***REMOVED*** Creates the chd string for chartserver.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {Array.<number>} values An array of numbers to graph.
***REMOVED*** @param {number} minValue The minimum value (used for normalization).
***REMOVED*** @param {number} maxValue The maximum value (used for normalization).
***REMOVED*** @param {goog.ui.ServerChart.EncodingType} encoding The data encoding to use;
***REMOVED***     must not be AUTOMATIC.
***REMOVED*** @return {string} The chd string for chartserver.
***REMOVED***
goog.ui.ServerChart.prototype.getChartServerValues_ = function(values,
                                                               minValue,
                                                               maxValue,
                                                               encoding) {
  var s = [];
  for (var i = 0, valuesLen = values.length; i < valuesLen; ++i) {
    s.push(this.getConvertedValue_(values[i], minValue,
                                   maxValue, encoding));
  }
  return s.join(
      this.encodingType_ == goog.ui.ServerChart.EncodingType.TEXT ? ',' : '');
***REMOVED***


***REMOVED***
***REMOVED*** Finds the minimum value in an array and returns it.
***REMOVED*** Needed because Math.min does not handle sparse arrays the way we want.
***REMOVED***
***REMOVED*** @param {Array.<number?>} ary An array of values.
***REMOVED*** @return {number} The minimum value.
***REMOVED*** @private
***REMOVED***
goog.ui.ServerChart.prototype.arrayMin_ = function(ary) {
  var min = Infinity;
  for (var i = 0, aryLen = ary.length; i < aryLen; ++i) {
    var value = ary[i];
    if (value != null && value < min) {
      min = value;
    }
  }
  return min;
***REMOVED***


***REMOVED***
***REMOVED*** Finds the maximum value in an array and returns it.
***REMOVED*** Needed because Math.max does not handle sparse arrays the way we want.
***REMOVED***
***REMOVED*** @param {Array.<number?>} ary An array of values.
***REMOVED*** @return {number} The maximum value.
***REMOVED*** @private
***REMOVED***
goog.ui.ServerChart.prototype.arrayMax_ = function(ary) {
  var max = -Infinity;
  for (var i = 0, aryLen = ary.length; i < aryLen; ++i) {
    var value = ary[i];
    if (value != null && value > max) {
      max = value;
    }
  }
  return max;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ServerChart.prototype.disposeInternal = function() {
  goog.ui.ServerChart.superClass_.disposeInternal.call(this);
  delete this.xLabels_;
  delete this.leftLabels_;
  delete this.rightLabels_;
  delete this.gridX_;
  delete this.gridY_;
  delete this.setColors_;
  delete this.setLegendTexts_;
  delete this.dataSets_;
  this.uri_ = null;
  delete this.minValue_;
  delete this.maxValue_;
  this.title_ = null;
  delete this.multiAxisType_;
  delete this.multiAxisLabelText_;
  delete this.multiAxisLabelPosition_;
  delete this.multiAxisRange_;
  delete this.multiAxisLabelStyle_;
  this.legend_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Event types dispatched by the ServerChart object
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.ServerChart.Event = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched when the resulting URI reaches or exceeds the URI length limit.
 ***REMOVED*****REMOVED***
  URI_TOO_LONG: 'uritoolong'
***REMOVED***



***REMOVED***
***REMOVED*** Class for the event dispatched on the ServerChart when the resulting URI
***REMOVED*** exceeds the URI length limit.
***REMOVED***
***REMOVED*** @param {string} uri The overly-long URI string.
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.ui.ServerChart.UriTooLongEvent = function(uri) {
  goog.events.Event.call(this, goog.ui.ServerChart.Event.URI_TOO_LONG);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The overly-long URI string.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.uri = uri;
***REMOVED***
goog.inherits(goog.ui.ServerChart.UriTooLongEvent, goog.events.Event);
