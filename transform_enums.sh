echo "{" > enums40.json
xsltproc fix_enums2json.xsl FIX40.xml |tr -d ' '|uniq|tr -s '\n' >> enums40.json
echo "\"DUMMY\":\"DUMMY\"" >> enums40.json
echo "}" >> enums40.json

echo "{" > enums41.json
xsltproc fix_enums2json.xsl FIX41.xml |tr -d ' '|uniq|tr -s '\n' >> enums41.json
echo "\"DUMMY\":\"DUMMY\"" >> enums41.json
echo "}" >> enums41.json

echo "{" > enums42.json
xsltproc fix_enums2json.xsl FIX42.xml |tr -d ' '|uniq|tr -s '\n' >> enums42.json
echo "\"DUMMY\":\"DUMMY\"" >> enums42.json
echo "}" >> enums42.json

echo "{" > enums43.json
xsltproc fix_enums2json.xsl FIX43.xml |tr -d ' '|uniq|tr -s '\n' >> enums43.json
echo "\"DUMMY\":\"DUMMY\"" >> enums43.json
echo "}" >> enums43.json

echo "{" > enums44.json
xsltproc fix_enums2json.xsl FIX44.xml |tr -d ' '|uniq|tr -s '\n' >> enums44.json
echo "\"DUMMY\":\"DUMMY\"" >> enums44.json
echo "}" >> enums44.json
