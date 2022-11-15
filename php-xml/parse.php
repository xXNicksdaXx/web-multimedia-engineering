<pre>
<?php
require "world_data_parser.php";

// parse csv via function, then use built-in method print_r to echo the result
$wdp = new WorldDataParser();
$result = $wdp->parseCSV("../assets/world_data_v3.csv");
print_r ($result);
?>
</pre>