---
layout: default
title: SemToNotes - A Topological Image Annotation and Image Retrieval System
---

# Welcome to SemToNotes
_Semantic Topological Notes_ (SemToNotes) is a topological image annotation and image retrieval system written in JavaScript. It allows the analysis of spatio-topological relations between semantically enriched image areas.

SemToNotes is currently developed at the [Institute of Humanities Computer Science](http://hki.uni-koeln.de) at the University of Cologne as part of the [DARIAH-DE Project](https://de.dariah.eu/) (Phase II, March 2014 - February 2016).

This page contains demo applications informing about the technical milestones reached so far.

# Technical Milestones

## 1. Graphical Editor
The graphical editor of SemToNotes combines the features of a pan-zoom-rotate image viewer with those of a drawing application.

### 1.1 User Interface
The graphical editor supports all common desktop and mobile browsers (optionally [Canvas](http://www.w3.org/TR/2014/CR-2dcontext-20140821/), [SVG](http://www.w3.org/TR/SVG/) or [VML](http://www.w3.org/TR/NOTE-VML) rendering). In supporting Internet Explorer before version 9 as well as modern mobile touchpad devices, SemToNotes is compatible with the stricter web accessibility guidelines of public institutions.

* [Canvas Rendering](./milestone/rendering-canvas.html)
* [SVG Rendering](./milestone/rendering-svg.html)
* [VML Rendering](./milestone/rendering-vml.html)

### 1.2 Data Model
The graphical editor supports arbitrary XML standards such as the [Text Encoding Initiative (TEI)](http://www.tei-c.org/index.xml) or the [Open Annotation Data Model](http://www.w3.org/ns/oa) as used in the [Shared Canvas](http://iiif.io/model/shared-canvas/1.0/index.html) standard.

* [TEI Example](./milestone/example-tei.html)
* Shared Canvas Example

### 1.3 User Interface Description Language (UIDL)
SemToNotes can be integrated into any web page in a descriptive way with HTML5 elements only.

* Loading XML Instances
* Declare Data Bindings
* Define a Background Image
* Render Graphics
* Styling Graphics
* Modify Existing Graphics
* Create New Graphics
* A Complete Example

## 2. Textual Editor

# Contact
jochen.graf(at)uni-koeln.de

manfred.thaller(at)uni-koeln.de
