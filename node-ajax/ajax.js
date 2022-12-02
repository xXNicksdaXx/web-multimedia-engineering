const uri = "http://localhost:3000/";
const standardHeader = '<tr><th>id</th><th>name<button class="sort" onClick="sortByName(false)"><img class="sort-icon" src="../assets/down.svg" alt="asc"></button><button class="sort" onClick="sortByName(true)"><img class="sort-icon" src="../assets/up.svg" alt="desc"></button></th><th>birth rate / 1000</th><th>cell phones / 100</th><th>children / woman</th><th>electricity / capita</th><th>gdp / capita</th><th>gdp growth / capita</th><th>inflation annual</th><th>internet user / 100</th><th>life expectancy</th></tr>';
const requiredCells = '<th>id</th><th>name<button class="sort" onClick="sortByName(false)"><img class="sort-icon" src="../assets/down.svg" alt="asc"></button><button class="sort" onClick="sortByName(true)"><img class="sort-icon" src="../assets/up.svg" alt="desc"></button></th>';


/**
 *  GET default table
 */
$(document).ready(() => {
    $.ajax({
        type: "GET",
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

    $(document).ajaxStop(() => {
        const message = sessionStorage.getItem("message");
        if (message) {
            console.log(message);
            alert(message);
            sessionStorage.removeItem("message");
        }
    });
});


/**
 *  GET id / range of countries from REST-API
 */
$("#country_filter").on("submit", function () {
    let id = $("#country_filter_id").val();
    let range = $("#country_filter_range").val();

    if(id.trim().length !== 0) {
        $.ajax({
            method: "GET",
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
        const numbers = range.split("-");
        if(numbers.length !== 2)
            return;

        for(let i=0; i<2; i++) {
            if(numbers[i].length === 0)
                return;
            numbers[i] = Number(numbers[i]);
        }

        $.ajax({
            method: "GET",
            url: uri + "items/" + numbers[0] + "/" + numbers[1],
            contentType: "application/json",
            dataType: "json",
            success: (result) => {
                emptyHeadAndBody();
                $("thead").append(standardHeader);
                const tBody = jsonToTableBody(result);
                $("tbody").append(tBody);
            }
        });
    } else {
        $.ajax({
            method: "GET",
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


/**
 *  POST new country to REST-API
 */
$("#country_add").on("submit", function () {
    const name = $("#country_name").val().trim();
    const birth = $("#country_birth").val().trim();
    const cellphone = $("#country_cellphone").val().trim();

    if((name + birth + cellphone).length === 0) {
        return;
    }

    $.ajax({
        method: "POST",
        url: uri + "items",
        data: JSON.stringify({
            "name": name,
            "birth": birth,
            "cellphone": cellphone,
        }),
        contentType: "application/json; charset=utf-8",
        success: (response) => {
            sessionStorage.setItem("message", response);
            location.reload();
        },
    })
});


/**
 * @param data ~ array containing json data
 * @return string ~ represents html string of table body
 */
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

/**
 * @return void ~ empties table head and table body via jquery
 */
function emptyHeadAndBody() {
    $("thead").empty();
    $("tbody").empty();
}