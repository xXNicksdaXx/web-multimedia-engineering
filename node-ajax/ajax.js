const uri = "http://localhost:3000/";
const standardHeader = '<tr><th>id</th><th>name<button class="sort" onClick="sortByName(false)"><img class="sort-icon" src="../assets/down.svg" alt="asc"></button><button class="sort" onClick="sortByName(true)"><img class="sort-icon" src="../assets/up.svg" alt="desc"></button></th><th>birth rate / 1000</th><th>cell phones / 100</th><th>children / woman</th><th>electricity / capita</th><th>gdp / capita</th><th>gdp growth / capita</th><th>inflation annual</th><th>internet user / 100</th><th>life expectancy</th></tr>';
const requiredCells = '<th>id</th><th>name<button class="sort" onClick="sortByName(false)"><img class="sort-icon" src="../assets/down.svg" alt="asc"></button><button class="sort" onClick="sortByName(true)"><img class="sort-icon" src="../assets/up.svg" alt="desc"></button></th>';

$(document).ready(() => {
    $.ajax({
        url: uri + "items",
        contentType: "application/json",
        dataType: "json",
        success: (result) => {
            emptyHeadAndBody();
            $("thead").append(standardHeader);
            const tBody = jsonToTableBody(result);
            $("tbody").append(tBody);
        },
    });
});


$(".rest-country").on("submit", function () {
    let id = $("#country_filter_id").val();
    let range = $("#country_filter_range").val();

    if(id.trim().length !== 0) {
        $.ajax({
            url: uri + "items/" + id,
            contentType: "application/json",
            dataType: "json",
            success: (result) => {
                emptyHeadAndBody();
                $("thead").append(standardHeader);
                const tBody = jsonToTableBody(result);
                $("tbody").append(tBody);
            }
        });
    } else if(range.trim().length !== 0) {
        console.log("Bei RANGE drin");
        const numbers = range.split("-");
        const url = uri + "items/" + Number(numbers[0]) + "/" + Number(numbers[1]);
        console.log(url)
        $.ajax({
            url: url,
            contentType: "application/json",
            dataType: "json",
            success: (result) => {
                console.log(2);
                emptyHeadAndBody();
                $("thead").append(standardHeader);
                const tBody = jsonToTableBody(result);
                $("tbody").append(tBody);
            }
        });
    } else {
        $.ajax({
            url: uri + "items",
            contentType: "application/json",
            dataType: "json",
            success: (result) => {
                emptyHeadAndBody();
                $("thead").append(standardHeader);
                const tBody = jsonToTableBody(result);
                $("tbody").append(tBody);
            },
        });
    }
});

function jsonToTableBody(data) {
    let tBody = "";
    for(const element of data) {
        let tr = "<tr>";
        for(const key in element) {
            tr += "<td>"+ element[key]+"</td>";
        }
        tr += "</tr>";
        tBody += tr;
    }
    return tBody;
}

function emptyHeadAndBody() {
    $("thead").empty();
    $("tbody").empty();
}