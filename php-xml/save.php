<pre>
<?php
require "world_data_parser.php";

// get status from saving xml
$wdp = new WorldDataParser();
$data = $wdp->parseCSV("../assets/world_data_v3.csv");
$result = $wdp->saveXML($data);

if($result) print "XML-Savestatus: erfolgreich (1)";
else print "XML-Savestatus: fehlgeschlagen (0)";
?>
</pre>