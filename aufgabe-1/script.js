function populateTable(items) {
    const table = document.getElementById("tableBody");
    items.forEach( item => {
        let row = table.insertRow();
        let id = row.insertCell(0);
        id.innerHTML = item.id;
        let name = row.insertCell(1);
        name.innerHTML = item.name;
        let birthRate = row.insertCell(2);
        birthRate.innerHTML = item.birthRate;
        let cellPhoneRate = row.insertCell(3);
        cellPhoneRate.innerHTML = item.cellPhoneRate;
        let childrenPerWoman = row.insertCell(4);
        childrenPerWoman.innerHTML = item.childrenPerWoman;
        let electricity = row.insertCell(5);
        electricity.innerHTML = item.electricity;
        let gdp = row.insertCell(2);
        gdp.innerHTML = item.gdp;

    });
}