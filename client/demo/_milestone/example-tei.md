---
layout: milestone
title: TEI Example | SemToNotes
tagline: A TEI Facsimile Image Annotation Tool.
---

<div class="xrx-mvc-namespace" data-xrx-prefix="xmlns:tei" data-xrx-uri="http://www.tei-c.org/ns/1.0"></div>
<div id="i1" class="xrx-instance" data-xrx-src="./example-tei.1.xml.txt"></div>
<div id="i2" class="xrx-instance" data-xrx-src="./example-tei.2.xml.txt"></div>
<div id="b1" class="xrx-mvc-bind" data-xrx-ref="xrx:instance('i1')//tei:graphic/@url"></div>
<div id="b0" class="xrx-mvc-bind" data-xrx-ref="xrx:instance('i1')//tei:graphic"></div>
<div id="b2" class="xrx-mvc-bind" data-xrx-ref="xrx:instance('i1')//tei:zone[@points]"></div>
<div id="b5" class="xrx-mvc-bind" data-xrx-ref="xrx:instance('i1')"></div>
<div id="b6" class="xrx-mvc-bind" data-xrx-ref="xrx:instance('i2')//tei:zone[1]"></div>
<div id="d1" class="xrx-widget-canvas">
  <div class="xrx-widget-canvas-background-image" data-xrx-bind="b1"></div>
  <div class="xrx-widget-canvas-toolbar">
    <span class="xrx-widget-canvas-toolbar-item-view xrx-icon-openhand32"></span>
    <span class="xrx-widget-canvas-toolbar-item-zoom-in xrx-icon-zoomIn32"></span>
    <span class="xrx-widget-canvas-toolbar-item-zoom-out xrx-icon-zoomOut32"></span>
    <span class="xrx-widget-canvas-toolbar-item-rotate-left xrx-icon-rotateLeft32"></span>
    <span class="xrx-widget-canvas-toolbar-item-rotate-right xrx-icon-rotateRight32"></span>
    <span class="xrx-widget-canvas-toolbar-item-create xrx-icon-shapePolygon32"
        title="Draw a black polygon." data-xrx-graphics-name="my-black-polygons"></span>
    <span class="xrx-widget-canvas-toolbar-item-modify xrx-icon-move32"></span>
    <span class="xrx-widget-canvas-toolbar-item-delete xrx-icon-delete32"></span>
  </div>
  <div class="xrx-widget-canvas-graphics">
    <div class="xrx-widget-canvas-group" data-xrx-graphics-name="my-black-polygons">
      <div id="r1" class="xrx-mvc-repeat" data-xrx-bind="b2">
        <div class="xrx-widget-shape-polygon" data-xrx-ref="./self::*"
            data-xrx-ref-coords="./@points"></div>
      </div>
      <div class="xrx-widget-shape-polygon-create" data-xrx-bind="b6" data-xrx-ref-coords="./@points"></div>
      <div class="xrx-mvc-action" data-xrx-event="xrx-event-graphic-created">
        <div class="xrx-mvc-insert" data-xrx-origin="b6" data-xrx-target="b0"></div>
      </div>
    </div>
  </div>
</div>
<pre id="c-example-console" class="xrx-widget-console" data-xrx-bind="b5"></pre>
