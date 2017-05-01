<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text" omit-xml-declaration="yes" indent="no"/>

<xsl:template match="fields/field">

  <xsl:if test="count(value) > 0">
    "<xsl:value-of select="@number"/>":
      {<xsl:for-each select="value">
        "<xsl:value-of select="@enum"/>": "<xsl:value-of select="@description"/>","<xsl:value-of select="@description"/>": "<xsl:value-of select="@enum"/>",
      </xsl:for-each>"":""
      },
  </xsl:if>

</xsl:template>

</xsl:stylesheet>
