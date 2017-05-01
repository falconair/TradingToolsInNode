echo "{" > msgs_detail_40.json
xsltproc fix_msgs_detail2json.xsl FIX40.xml |tr -d ' '|uniq|tr -s '\n' >> msgs_detail_40.json
echo "\"DUMMY\":\"DUMMY\"" >> msgs_detail_40.json
echo "}" >> msgs_detail_40.json

echo "{" > msgs_detail_41.json
xsltproc fix_msgs_detail2json.xsl FIX41.xml |tr -d ' '|uniq|tr -s '\n' >> msgs_detail_41.json
echo "\"DUMMY\":\"DUMMY\"" >> msgs_detail_41.json
echo "}" >> msgs_detail_41.json

echo "{" > msgs_detail_42.json
xsltproc fix_msgs_detail2json.xsl FIX42.xml |tr -d ' '|uniq|tr -s '\n' >> msgs_detail_42.json
echo "\"DUMMY\":\"DUMMY\"" >> msgs_detail_42.json
echo "}" >> msgs_detail_42.json

echo "{" > msgs_detail_43.json
xsltproc fix_msgs_detail2json.xsl FIX43.xml |tr -d ' '|uniq|tr -s '\n' >> msgs_detail_43.json
echo "\"DUMMY\":\"DUMMY\"" >> msgs_detail_43.json
echo "}" >> msgs_detail_43.json

echo "{" > msgs_detail_44.json
xsltproc fix_msgs_detail2json.xsl FIX44.xml |tr -d ' '|uniq|tr -s '\n' >> msgs_detail_44.json
echo "\"DUMMY\":\"DUMMY\"" >> msgs_detail_44.json
echo "}" >> msgs_detail_44.json
