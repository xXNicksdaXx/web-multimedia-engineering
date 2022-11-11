<?php
class WorldDataParser {

    private static $instance = null;
    private static $currentData = array();

    /**
     * @return WorldDataParser ~ retrieve singleton instance
     */
    public static function getInstance() {
        if(!self::$instance) self::$instance = new WorldDataParser();
        return self::$instance;
    }

    /**
     * @return array ~ most recent parsed csv data
     */
    public function getCurrentData()
    {
        return self::$currentData;
    }

    /**
     * @param $path ~ relative path to csv file
     * @return array ~ multidimensional array, each inner array representing a data row from csv file
     */
    public function parseCSV($path) {
        //opens read-stream of file
        $file = fopen($path, "r");
        $result = array();
        if ($file !== FALSE) {
            //gets first line = header
            $header = fgetcsv($file);
            $length = count($header);
            for($i = 0; $i < $length; $i++) $header[$i] = trim($header[$i]);
            while (($data = fgetcsv($file)) !== FALSE) {
                //foreach row create new array and add data
                $row = array();
                for($i = 0; $i < $length; $i++) {
                    $row[$header[$i]] = trim($data[$i]);
                }
                array_push($result, $row);
            }
            fclose($file);
        }
        self::$currentData = $result;
        return $result;
    }

    public function saveXML($data) {

    }

    public function printXML() {

    }
}