<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <xsl:for-each select="countries/country">
            <tr>
                <td><xsl:value-of select="id"/></td>
                <td><xsl:value-of select="name"/></td>
                <td><xsl:value-of select="birth_rate_per_1000"/></td>
                <td><xsl:value-of select="cell_phones_per_100"/></td>
                <td><xsl:value-of select="children_per_woman"/></td>
                <td><xsl:value-of select="electricity_consumption_per_capita"/></td>
                <td><xsl:value-of select="gdp_per_capita"/></td>
                <td><xsl:value-of select="gdp_per_capita_growth"/></td>
                <td><xsl:value-of select="inflation_annual"/></td>
                <td><xsl:value-of select="internet_user_per_100"/></td>
                <td><xsl:value-of select="life_expectancy"/></td>
<!--                <td><xsl:value-of select="gps_lat"/></td>-->
<!--                <td><xsl:value-of select="gps_long"/></td>-->
            </tr>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>