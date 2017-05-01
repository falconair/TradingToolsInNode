<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text" omit-xml-declaration="yes" indent="no"/>

<xsl:template match="message">
  "<xsl:value-of select="@name"/>":"<xsl:value-of select="@msgtype"/>","<xsl:value-of select="@msgtype"/>":"<xsl:value-of select="@name"/>",
</xsl:template>

</xsl:stylesheet>
