<?php
require "world_data_parser.php";

WorldDataParser::getInstance()->saveXML(WorldDataParser::getInstance()->getCurrentData());