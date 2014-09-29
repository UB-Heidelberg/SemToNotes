#!/bin/bash

echo "###################################"
echo "#                                 #"
echo "# Build Demo Page                 #"
echo "#                                 #"
echo "###################################"

# sudo apt-get install xsltproc

xsltproc -o index.html demo/demo.xsl demo/index.xml
xsltproc -o demo/data-binding.html demo/demo.xsl demo/data-binding.xml
xsltproc -o demo/wysiwym-xml-authoring.html demo/demo.xsl demo/wysiwym-xml-authoring.xml
xsltproc -o demo/large-document-support.html demo/demo.xsl demo/large-document-support.xml
xsltproc -o demo/getting-started.html demo/demo.xsl demo/getting-started.xml
xsltproc -o demo/hello-xrx.html src/xrx2html.xsl demo/hello-xrx.xml
