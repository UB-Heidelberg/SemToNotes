<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xrx="http://www.monasterium.net/NS/xrx"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns="http://www.w3.org/1999/xhtml">
  <xsl:import href="../src/mvc/mvc.xsl"/>
  <xsl:output method="html" encoding="UTF-8" indent="no"/>



  <!-- ##################################################### -->
  <!-- #                                                   # -->
  <!-- # <xhtml:html/>                                     # -->
  <!-- #                                                   # -->
  <!-- ##################################################### -->
  <xsl:template match="/">
    <xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html&gt;</xsl:text>
    <xsl:apply-templates/>
  </xsl:template>



  <!-- ##################################################### -->
  <!-- #                                                   # -->
  <!-- # <xhtml:head/>                                     # -->
  <!-- #                                                   # -->
  <!-- ##################################################### -->
  <xsl:template match="xhtml:head">
    <head xmlns="http://www.w3.org/1999/xhtml">
      <xsl:copy-of select="@*"/>
      <xsl:call-template name="xrx.resources">
        <xsl:with-param name="relativepath" select="'/xpp/'"/>
      </xsl:call-template>
      <xsl:copy-of select="./*"/>
    </head>
  </xsl:template>

  <xsl:template name="xrx.resources">
    <xsl:param name="relativepath"/>
    <script>
      <xsl:attribute name="src">
        <xsl:value-of select="$relativepath"/>
        <xsl:text>lib/jssaxparser/SAXException.js</xsl:text>
      </xsl:attribute>
    </script>
    <script>
      <xsl:attribute name="src">
        <xsl:value-of select="$relativepath"/>
        <xsl:text>lib/jssaxparser/SAXScanner.js</xsl:text>
      </xsl:attribute>
    </script>
    <script>
      <xsl:attribute name="src">
        <xsl:value-of select="$relativepath"/>
        <xsl:text>lib/jssaxparser/XMLFilterImpls.js</xsl:text>
      </xsl:attribute>
    </script>
    <script>
      <xsl:attribute name="src">
        <xsl:value-of select="$relativepath"/>
        <xsl:text>lib/jssaxparser/ReaderWrapper.js</xsl:text>
      </xsl:attribute>
    </script>
    <script>
      <xsl:attribute name="src">
        <xsl:value-of select="$relativepath"/>
        <xsl:text>lib/jssaxparser/Reader.js</xsl:text>
      </xsl:attribute>
    </script>
    <script>
      <xsl:attribute name="src">
        <xsl:value-of select="$relativepath"/>
        <xsl:text>lib/jssaxparser/AttributesImpl.js</xsl:text>
      </xsl:attribute>
    </script>
    <script>
      <xsl:attribute name="src">
        <xsl:value-of select="$relativepath"/>
        <xsl:text>lib/jssaxparser/LocatorImpls.js</xsl:text>
      </xsl:attribute>
    </script>
    <script>
      <xsl:attribute name="src">
        <xsl:value-of select="$relativepath"/>
        <xsl:text>lib/jssaxparser/NamespaceSupport.js</xsl:text>
      </xsl:attribute>
    </script>
    <script>
      <xsl:attribute name="src">
        <xsl:value-of select="$relativepath"/>
        <xsl:text>lib/jssaxparser/sax.js</xsl:text>
      </xsl:attribute>
    </script>
    <script>
      <xsl:attribute name="src">
        <xsl:value-of select="$relativepath"/>
        <xsl:text>lib/jssaxparser/DefaultHandlers.js</xsl:text>
      </xsl:attribute>
    </script>
    <script>
      <xsl:attribute name="src">
        <xsl:value-of select="$relativepath"/>
        <xsl:text>lib/codemirror/lib/codemirror.js</xsl:text>
      </xsl:attribute>
    </script>
    <link rel="stylesheet" type="text/css">
      <xsl:attribute name="href">
        <xsl:value-of select="$relativepath"/>
        <xsl:text>lib/codemirror/lib/codemirror.css</xsl:text>
      </xsl:attribute>
    </link>
    <script>
      <xsl:attribute name="src">
        <xsl:value-of select="$relativepath"/>
        <xsl:text>lib/closure-library/closure/goog/base.js</xsl:text>
      </xsl:attribute>
    </script>
    <script>
      <xsl:attribute name="src">
        <xsl:value-of select="$relativepath"/>
        <xsl:text>src/deps.js</xsl:text>
      </xsl:attribute>
    </script>
    <script>
      goog.require('xrx');
    </script>
    <link rel="stylesheet" type="text/css">
      <xsl:attribute name="href">
        <xsl:value-of select="$relativepath"/>
        <xsl:text>src/ui/wysiwym/default.css</xsl:text>
      </xsl:attribute>
    </link>
  </xsl:template>



  <!-- ##################################################### -->
  <!-- #                                                   # -->
  <!-- # <xhtml:body/>                                     # -->
  <!-- #                                                   # -->
  <!-- ##################################################### -->
  <xsl:template match="xhtml:body">
    <body xmlns="http://www.w3.org/1999/xhtml">
      <xsl:copy-of select="@*"/>
      <xsl:apply-templates/>
      <script type="text/javascript">
        xrx.install();
      </script>
    </body>
  </xsl:template>



  <!-- ##################################################### -->
  <!-- #                                                   # -->
  <!-- # <xrx:input/>                                      # -->
  <!-- #                                                   # -->
  <!-- ##################################################### -->
  <xsl:template match="xrx:input">
    <textarea class="xrx-wysiwym-input">
      <xsl:call-template name="copy-attributes" select="./self::*"/>
    </textarea>
  </xsl:template>



  <!-- ##################################################### -->
  <!-- #                                                   # -->
  <!-- # <xrx:ouptput/>                                    # -->
  <!-- #                                                   # -->
  <!-- ##################################################### -->
  <xsl:template match="xrx:output">
    <span class="xrx-output">
      <xsl:call-template name="copy-attributes" select="./self::*"/>
    </span>
  </xsl:template>



  <!-- ##################################################### -->
  <!-- #                                                   # -->
  <!-- # <xrx:textarea/>                                   # -->
  <!-- #                                                   # -->
  <!-- ##################################################### -->
  <xsl:template match="xrx:textarea">
    <textarea class="xrx-wysiwym-textarea">
      <xsl:call-template name="copy-attributes" select="./self::*"/>
    </textarea>
  </xsl:template>



  <!-- ##################################################### -->
  <!-- #                                                   # -->
  <!-- # <xrx:textarea/>                                   # -->
  <!-- #                                                   # -->
  <!-- ##################################################### -->
  <xsl:template match="xrx:wysiwym">
    <textarea class="xrx-wysiwym-richxml">
      <xsl:call-template name="copy-attributes" select="./self::*"/>
    </textarea>
  </xsl:template>



  <!-- ##################################################### -->
  <!-- #                                                   # -->
  <!-- # shared                                            # -->
  <!-- #                                                   # -->
  <!-- ##################################################### -->
  <xsl:template name="copy-attributes">
    <xsl:for-each select="@*">
      <xsl:choose>
        <xsl:when test="name(.) = 'ref'">
          <xsl:attribute name="data-xrx-ref">
            <xsl:value-of select="."/>
          </xsl:attribute>
        </xsl:when>
        <xsl:when test="name(.) = 'bind'">
          <xsl:attribute name="data-xrx-bind">
            <xsl:value-of select="."/>
          </xsl:attribute>
        </xsl:when>
        <xsl:when test="name(.) = 'src'">
          <xsl:attribute name="data-xrx-src">
            <xsl:value-of select="."/>
          </xsl:attribute>
        </xsl:when>
        <xsl:otherwise>
          <xsl:copy-of select="."/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:template>

</xsl:stylesheet>
