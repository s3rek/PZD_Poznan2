<?php

//$xml =simplexml_load_string('http://192.168.20.15/cgi-bin/mapserv?map=/gis01/unimap.map&request=GetCapabilities&service=WMS', null, true);
$xml = new SimpleXmlIterator('http://192.168.20.15/cgi-bin/mapserv?map=/gis01/unimap.map&request=GetCapabilities&service=WMS', null, true);

//$xml = new simpleXMLIterator('http://192.168.20.15/cgi-bin/mapserv?map=/gis01/unimap.map&request=GetCapabilities&service=WMS', null, true);
print_r($xml);
//echo $xml->getChildren . "<br />";
//echo $xml->getChildren();
for($xml->rewind(); $xml->valid(); $xml->next()) {
	 $key = $xml->key();
foreach($xml->getChildren as $name => $data)
  {
 echo $data;

 // echo $child->getName();
  }
}
//$sxe = new SimpleXMLElement($xml);
//echo (string)$sxe;
//$xml2 =simplexml_load_string($xml);
?>