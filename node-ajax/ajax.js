const uri = "http://localhost:3000/";
const standardHeader = '<tr><th>id</th><th>name<button class="sort" onClick="sortByName(false)"><img class="sort-icon" src="../assets/down.svg" alt="asc"></button><button class="sort" onClick="sortByName(true)"><img class="sort-icon" src="../assets/up.svg" alt="desc"></button></th><th>birth rate / 1000</th><th>cell phones / 100</th><th>children / woman</th><th>electricity / capita</th><th>gdp / capita</th><th>gdp growth / capita</th><th>inflation annual</th><th>internet user / 100</th><th>life expectancy</th></tr>';


/**
 *  GET default table
 */
$(document).ready(() => {
    // fetch all items
    $.ajax({
        type: "GET",
        url: uri + "items",
        contentType: "application/json",
        success: (result) => {
            emptyHeadAndBody();
            $("thead").append(standardHeader);
            $("tbody").append(jsonToTableBody(result));
        },
    });

    // fill select field
    $.ajax({
        type: "GET",
        url: uri + "properties",
        contentType: "application/json",
        success: (result) => {
            $("#prop_selection").append(jsonToOptions(result));
        },
    });

    // show message if available
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

    if(range.trim().length !== 0) {
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
            success: (result) => {
                emptyHeadAndBody();
                $("thead").append(standardHeader);
                const tBody = jsonToTableBody(result);
                $("tbody").append(tBody);
            }
        });
    } else if(id.trim().length !== 0) {
        $.ajax({
            method: "GET",
            url: uri + "items/" + id,
            contentType: "application/json",
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
 *  SHOW/HIDE properties via REST-API
 */
$("#show_selected_prop").on("click", function () {
    const index = $("#prop_selection option:selected").val();
    $.ajax({
        method: "GET",
        url: uri + "properties/" + index,
        headers: { "visibility": 1 },
        contentType: "application/json",
        success: (result) => {
            let cells = document.querySelectorAll(
                `tr th:nth-child(${result["index"]}),tr td:nth-child(${result["index"]})`
            );
            for(let cell of cells) {
                cell.style.display = "";
            }
        },
    });
});

$("#hide_selected_prop").on("click", function () {
    const index = $("#prop_selection option:selected").val();
    $.ajax({
        method: "GET",
        url: uri + "properties/" + index,
        headers: { "visibility": 0 },
        contentType: "application/json",
        success: (result) => {
            let cells = document.querySelectorAll(
                `tr th:nth-child(${result["index"]}),tr td:nth-child(${result["index"]})`
            );
            for(let cell of cells) {
                cell.style.display = "none";
            }
        },
    });
});

/**
 *  DELETE a country from REST-API
 */
$("#country_delete").on("submit", function () {
    const deleteId = $("#country_delete_id").val().trim();

    let url;
    if(deleteId.length === 0)
        url = uri + "items"
    else
        url = uri + "items/" + deleteId

    $.ajax({
        method: "DELETE",
        url: url,
        contentType: "application/json",
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
 * @param data ~ array containing json data
 * @return string ~ represents html string of select options
 */
function jsonToOptions(data) {
    let select = "";
    for(const element of data) {
        let option = `<option value=${element["index"]}>${element["name"]}</option>`;
        select += option;
    }
    return select;
}

/**
 * @return void ~ empties table head and table body via jquery
 */
function emptyHeadAndBody() {
    $("thead").empty();
    $("tbody").empty();
}