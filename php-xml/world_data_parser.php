<?php
class WorldDataParser {

    /**
     * @param $path ~ relative path to csv file
     * @return array ~ multidimensional array, each inner array representing a data row from csv file
     */
    public function parseCSV($path) {
        //opens read-stream of file
        $file = fopen($path, "r");
        $result = array();
        if($file !== FALSE) {
            //gets first line = header
            $header = fgetcsv($file);
            $length = count($header);
            for($i = 0; $i < $length; $i++) $header[$i] = trim($header[$i]);
            while(($data = fgetcsv($file)) !== FALSE) {
                //foreach row create new array and add data
                $row = array();
                for($i = 0; $i < $length; $i++) {
                    $row[$header[$i]] = trim($data[$i]);
                }
                array_push($result, $row);
            }
            fclose($file);
        }
        return $result;
    }

    /**
     * @param $data
     * @return DOMDocument
     * @source:     https://stackoverflow.com/questions/1397036/how-to-convert-array-to-simplexml
     *              https://stackoverflow.com/questions/8615422/php-xml-how-to-output-nice-format
     */
    public function saveXML($data) {
        // use SimpleXML to create required structure
        $simpleXML = new SimpleXMLElement('<?xml version="1.0"?><countries></countries>');
        foreach($data as $country) {
            $countryNode = $simpleXML->addChild("country");
            foreach($country as $key => $value) {
                $countryNode->addChild(str_replace(" ","_", $key), htmlspecialchars("$value"));
            }
        }

        // use DOMDocument to set formatting parameters
        $xml = new DOMDocument('1.0');
        $xml->encoding = "UTF-8";
        $xml->preserveWhiteSpace = false;
        $xml->formatOutput = true;
        $xml->loadXML($simpleXML->asXML());
        $xml->save("world_data.xml");
        return $xml;
    }

    private function populateCountryInXML($data, &$xml_data) {

    }

    public function printXML() {

    }
}