echo "{" > fields40.json
xsltproc fix_fields2json.xsl FIX40.xml |tr -d ' '|sort|uniq >> fields40.json
echo "\"DUMMY\":\"DUMMY\"" >> fields40.json
echo "}" >> fields40.json

echo "{" > fields41.json
xsltproc fix_fields2json.xsl FIX41.xml |tr -d ' '|sort|uniq >> fields41.json
echo "\"DUMMY\":\"DUMMY\"" >> fields41.json
echo "}" >> fields41.json

echo "{" > fields42.json
xsltproc fix_fields2json.xsl FIX42.xml |tr -d ' '|sort|uniq >> fields42.json
echo "\"DUMMY\":\"DUMMY\"" >> fields42.json
echo "}" >> fields42.json

echo "{" > fields43.json
xsltproc fix_fields2json.xsl FIX43.xml |tr -d ' '|sort|uniq >> fields43.json
echo "\"DUMMY\":\"DUMMY\"" >> fields43.json
echo "}" >> fields43.json

echo "{" > fields44.json
xsltproc fix_fields2json.xsl FIX44.xml |tr -d ' '|sort|uniq >> fields44.json
echo "\"DUMMY\":\"DUMMY\"" >> fields44.json
echo "}" >> fields44.json
