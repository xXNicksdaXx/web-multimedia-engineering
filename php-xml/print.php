<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="Nick Ruider">
    <meta name="description" content="Aufgabe 1">
    <meta name="keywords" content="HTML, CSS, JavaScript, World, Data">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web-Multimedia-Engineering</title>

    <link rel="stylesheet" href="../style/reset.css">
    <link rel="stylesheet" href="../style/navbar.css">
    <link rel="stylesheet" href="../style/table.css">
    <link rel="stylesheet" href="../style/main.css">
</head>
<body>
<header>
    <nav>
        <div id="nav-spacer"></div>
        <div id="logo">
            <a href="">
                <img src="../assets/world_data-logo.svg" alt="World Data Logo">
            </a>
        </div>
        <div class="horizontal">
            <ul>
                <li>
                    <a href="../page.html">
                        <img class="icon" src="../assets/table.svg" alt="Table">
                        <span>A1-Table</span>
                    </a>
                </li>
                <li>
                    <a href="../php-xml/parse.php">
                        <img class="icon" src="../assets/settings.svg" alt="Parse">
                        A2-Parse
                    </a>
                </li>
                <li>
                    <a href="../php-xml/save.php">
                        <img class="icon" src="../assets/save.svg" alt="Save">
                        A2-Save
                    </a>
                </li>
                <li>
                    <a href="../php-xml/print.php">
                        <img class="icon" src="../assets/print.svg" alt="Print">
                        A2-Print
                    </a>
                </li>
                <li>
                    <a href="">
                        <img class="icon" src="../assets/node.svg" alt="REST">
                        A3-REST
                    </a>
                </li>
                <li>
                    <a href="">
                        <img class="icon" src="../assets/map.svg" alt="Vis">
                        A4-Vis
                    </a>
                </li>
                <li>
                    <a href="">
                        <img class="icon" src="../assets/cube.svg" alt="3D">
                        A5-3D
                    </a>
                </li>
            </ul>
        </div>
        <button id="dropdown-button" onclick="toggleMenu()">
            <img src="../assets/menu.svg" alt="Menu">
        </button>
    </nav>
    <div id="dropdown-content">
        <ul>
            <li>
                <a href="../page.html">
                    <img class="icon" src="../assets/table.svg" alt="Table">
                    <span>A1-Table</span>
                </a>
            </li>
            <li>
                <a href="../php-xml/parse.php">
                    <img class="icon" src="../assets/settings.svg" alt="Parse">
                    A2-Parse
                </a>
            </li>
            <li>
                <a href="../php-xml/save.php">
                    <img class="icon" src="../assets/save.svg" alt="Save">
                    A2-Save
                </a>
            </li>
            <li>
                <a href="../php-xml/print.php">
                    <img class="icon" src="../assets/print.svg" alt="Print">
                    A2-Print
                </a>
            </li>
            <li>
                <a href="">
                    <img class="icon" src="../assets/node.svg" alt="REST">
                    A3-REST
                </a>
            </li>
            <li>
                <a href="">
                    <img class="icon" src="../assets/map.svg" alt="Vis">
                    A4-Vis
                </a>
            </li>
            <li>
                <a href="">
                    <img class="icon" src="../assets/cube.svg" alt="3D">
                    A5-3D
                </a>
            </li>
        </ul>
    </div>
</header>
<main>
    <h1>World Data Overview ...</h1>
    <div class="container">
        <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            <a>www.loremipsum.de</a>
        </p>
    </div>
    <div>
        Show/Hide:
        <button class="filter" onclick="showHideColumn(3)">birth rate</button> |
        <button class="filter" onclick="showHideColumn(4)">cell phones</button> |
        <button class="filter" onclick="showHideColumn(5)">children</button> |
        <button class="filter" onclick="showHideColumn(6)">electricity</button> |
        <button class="filter" onclick="showHideColumn(7)">gdp</button> |
        <button class="filter" onclick="showHideColumn(8)">gdp growth</button> |
        <button class="filter" onclick="showHideColumn(9)">inflation</button> |
        <button class="filter" onclick="showHideColumn(10)">internet</button> |
        <button class="filter" onclick="showHideColumn(11)">life expectancy</button>
    </div>
    <table class="table">
        <thead>
        <tr>
            <th>id </th>
            <th>
                name
                <button class="sort" onclick="sortByName(false)"><img class="sort-icon" src="../assets/down.svg" alt="asc"></button>
                <button class="sort" onclick="sortByName(true)"><img class="sort-icon" src="../assets/up.svg" alt="desc"></button>
            </th>
            <th>birth rate / 1000</th>
            <th>cell phones / 100</th>
            <th>children / woman</th>
            <th>electricity / capita</th>
            <th>gdp / capita</th>
            <th>gdp growth / capita</th>
            <th>inflation annual</th>
            <th>internet user / 100</th>
            <th>life expectancy</th>
        </tr>
        </thead>
        <tbody>
        <!-- populated with PHP -->
        <?php
        require "world_data_parser.php";

        // setup, generate xml
        $wdp = new WorldDataParser();
        $data = $wdp->parseCSV("../assets/world_data_v3.csv");
        $wdp->saveXML($data);

        // return a <tr> for each data set
        echo $wdp->printXML("world_data.xml", "transform.xsl");
        ?>
        </tbody>
    </table>
    <div>
        Show/Hide:
        <button class="filter" onclick="showHideColumn(3)">birth rate</button> |
        <button class="filter" onclick="showHideColumn(4)">cell phones</button> |
        <button class="filter" onclick="showHideColumn(5)">children</button> |
        <button class="filter" onclick="showHideColumn(6)">electricity</button> |
        <button class="filter" onclick="showHideColumn(7)">gdp</button> |
        <button class="filter" onclick="showHideColumn(8)">gdp growth</button> |
        <button class="filter" onclick="showHideColumn(9)">inflation</button> |
        <button class="filter" onclick="showHideColumn(10)">internet</button> |
        <button class="filter" onclick="showHideColumn(11)">life expectancy</button>
    </div>
</main>
<footer>
    <div class="footer">
        <p style="float: left">course exercise - web-multimedia-engineering</p>
        <p style="float: right">solution created by Nick Ruider</p>
    </div>
</footer>
<script src="../script.js"></script>
</body>
</html>