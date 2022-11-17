//--- FUNCTIONS ---
// source: https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortByName(reverse) {
    let table = document.querySelector("table");
    let switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        let rows, i, x, y, shouldSwitch;
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("td")[1];
            y = rows[i + 1].getElementsByTagName("td")[1];
            // Check if the two rows should switch place:
            if(!reverse) {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }

        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

function toggleMenu() {
    let dropdownMenu = document.getElementById("dropdown-content");
    if(dropdownMenu.style.display === "block")
        dropdownMenu.style.display = "none";
    else
        dropdownMenu.style.display = "block";
}

function showHideColumn(i) {
    let cells = document.querySelectorAll(`tr th:nth-child(${i}),tr td:nth-child(${i})`);
    for(let cell of cells) {
        if(cell.style.display !== "none")
            cell.style.display = "none";
        else
            cell.style.display = "";
    }
}