echo "{" > msgs40.json
xsltproc fix_msgs2json.xsl FIX40.xml |tr -d ' '|sort|uniq >> msgs40.json
echo "\"DUMMY\":\"DUMMY\"" >> msgs40.json
echo "}" >> msgs40.json

echo "{" > msgs41.json
xsltproc fix_msgs2json.xsl FIX41.xml |tr -d ' '|sort|uniq >> msgs41.json
echo "\"DUMMY\":\"DUMMY\"" >> msgs41.json
echo "}" >> msgs41.json

echo "{" > msgs42.json
xsltproc fix_msgs2json.xsl FIX42.xml |tr -d ' '|sort|uniq >> msgs42.json
echo "\"DUMMY\":\"DUMMY\"" >> msgs42.json
echo "}" >> msgs42.json

echo "{" > msgs43.json
xsltproc fix_msgs2json.xsl FIX43.xml |tr -d ' '|sort|uniq >> msgs43.json
echo "\"DUMMY\":\"DUMMY\"" >> msgs43.json
echo "}" >> msgs43.json

echo "{" > msgs44.json
xsltproc fix_msgs2json.xsl FIX44.xml |tr -d ' '|sort|uniq >> msgs44.json
echo "\"DUMMY\":\"DUMMY\"" >> msgs44.json
echo "}" >> msgs44.json
