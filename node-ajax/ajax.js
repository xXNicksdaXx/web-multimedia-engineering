const uri = "http://localhost:3000/";


/**
 *  GET default table
 */
$(document).ready(() => {
    // fetch all items
    $.ajax({
        type: "GET",
        url: uri + "items",
        contentType: "application/json",
        success: (result) => $("tbody").empty().append(jsonToTableBody(result)),
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
            alert(message);
            sessionStorage.removeItem("message");
        }
    });
});


/**
 *  GET id / range of countries from REST-API
 */
$("#country_filter").on("submit", function () {
    // get input
    let id = $("#country_filter_id").val();
    let range = $("#country_filter_range").val();

    // if range is filled, make range call to rest api
    if(range.trim().length !== 0) {
        // retrieve numbers from input
        const numbers = range.split("-");
        if(numbers.length !== 2) {
            sessionStorage.setItem("message", "Range input is incorrect!");
            location.reload();
            return;
        }
        for(let i=0; i<2; i++) {
            if(numbers[i].length === 0) {
                sessionStorage.setItem("message", "Range input is incorrect!");
                location.reload();
                return;
            }
            numbers[i] = Number(numbers[i]);
        }

        // ajax call
        $.ajax({
            method: "GET",
            url: uri + "items/" + numbers[0] + "/" + numbers[1],
            contentType: "application/json",
            success: (result) => {
                if($.isEmptyObject(result)) {
                    // insert message to display on reload
                    sessionStorage.setItem("message", "Request error!");
                    location.reload();
                } else
                    $("tbody").empty().append(jsonToTableBody(result));
            },
        });
    } else if(id.trim().length !== 0) {
        // when range is empty, check for id input
        $.ajax({
            method: "GET",
            url: uri + "items/" + id,
            contentType: "application/json",
            success: (result) => {
                if($.isEmptyObject(result)) {
                    // insert message to display on reload
                    sessionStorage.setItem("message", `Did not find item with id ${id}!`);
                    location.reload();
                } else
                    $("tbody").empty().append(jsonToTableBody(result));
            }
        });
    }
});


/**
 *  POST new country to REST-API
 */
$("#country_add").on("submit", function () {
    // retrieve input
    const name = $("#country_name").val().trim();
    const birth = $("#country_birth").val().trim();
    const cellphone = $("#country_cellphone").val().trim();

    // if everything is empty, do nothing
    if((name + birth + cellphone).length === 0) {
        return;
    }

    // send post request to api
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
            // insert message to display on reload
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
        headers: { "visibility": 1 }, // add header for rest api
        contentType: "application/json",
        success: (result) => {
            // retrieve all needed cells and show them
            let cells = $(`tr th:nth-child(${result["index"]}),tr td:nth-child(${result["index"]})`);
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
        headers: { "visibility": 0 }, // add header for rest api
        contentType: "application/json",
        success: (result) => {
            // retrieve all needed cells and hide them
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

    // if no id is given, then do not add it to the url -> removes last element
    let url;
    if(deleteId.length === 0)
        url = uri + "items"
    else
        url = uri + "items/" + deleteId

    // delete call to rest api
    $.ajax({
        method: "DELETE",
        url: url,
        contentType: "application/json",
        success: (response) => {
            // insert message to display on reload
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