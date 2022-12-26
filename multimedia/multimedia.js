// global variables
let data, map, markers = {};
const keys = ["birth rate per 1000", "cell phones per 100", "children per woman", "electricity consumption per capita", "gdp_per_capita", "gdp_per_capita_growth", "inflation annual", "internet user per 100", "life expectancy", "gps_lat", "gps_long", "military expenditure percent of gdp"];


/*
*** INIT SITE
 */

parseCSV().then(_ => {
    initMap();
    fillBarChart(3, 1);
    fillBarChart(4, 2);
});

async function parseCSV() {
    // parse csv via d3
    const csvData = await d3.csv("../assets/world_data_v3.csv");
    // format data objects
    data = csvData.map((item) => {
        let newItem = {};
        for(const key in item) {
            if(!isNaN(item[key]))
                // round number
                newItem[key.trim()] = Number(Number(item[key]).toFixed(3));
            else
                // trim strings
                newItem[key.trim()] = item[key].trim();
        }
        return newItem;
    });
}



/*
*** D3 - BAR CHART
 */

// set the dimensions and margins of the graph
const margin = {top: 32, right: 48, bottom: 128, left: 48},
    width = 600 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom,
    padding = 0.2;

// append the svg objects to the body of the page
const svg1 = d3.select("#bar-chart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`),
    svg2 = d3.select("#bar-chart2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

// init x-axis
const x1 = d3.scaleBand()
        .range([0, width])
        .padding(padding),
    x2 = d3.scaleBand()
        .range([0, width])
        .padding(padding),
    xAxis1 = svg1.append("g")
        .attr("transform", "translate(0," + height + ")"),
    xAxis2 = svg2.append("g")
        .attr("transform", "translate(0," + height + ")")

// init y-axis
const y1 = d3.scaleLinear()
        .range([height, 0]),
    y2 = d3.scaleLinear()
        .range([height, 0]),
    yAxis1 = svg1.append("g")
        .attr("class", "y-axis"),
    yAxis2 = svg2.append("g")
        .attr("class", "y-axis");

// init or update bar chart
function fillBarChart(index, chart) {
    // get key
    const key = keys[index-3];

    // get domain range
    let min = 0;
    let max = 0;
    for(const item of data) {
        if(item[key] < min)
            min = item[key];
        if(item[key] > max)
            max = item[key];
    }
    min = Math.floor(min * 1.15);
    max = Math.ceil(max * 1.15);

    // choose bar chart
    if(chart === 1) {
        // fill x axis
        x1.domain(data.map(item => { return item["name"]} ));
        xAxis1
            .call(d3.axisBottom(x1))
            .selectAll("text")
            .attr("transform", "translate(14,10)rotate(90)")
            .style("text-anchor", "start");

        // prepare y axis
        y1.domain([min, max]);
        yAxis1
            .transition()
            .duration(512)
            .call(d3.axisLeft(y1));

        let bars = svg1.selectAll("rect");
        // check if bars were already rendered
        if(bars["_groups"][0].length === 0) {
            // create bars for the first time
            bars.data(data)
                .enter()
                .append("rect")
                .attr("id", item => item["id"])
                .attr("x", item => x1(item["name"]))
                .attr("y", _ => y1(0))
                .attr("height", _ => height - y1(0)) // always equal to 0 for animation
                .attr("width", x1.bandwidth())
                .attr("fill", "#878787")
                .on("mouseover", (ev, data) => highlightCountry(data["id"]))
                .on("mouseout", (ev, data) => normaliseCountry(data["id"]))
                .on("click", (ev, data) => map.flyTo([data["gps_lat"], data["gps_long"]], 4));

            // animation to correct value
            svg1.selectAll("rect")
                .transition()
                .duration(200)
                .attr("y", item => y1(item[key]))
                .attr("height", item => height - y1(item[key]))
                .delay((item, i) => (i * 50));
        } else {
            // change value of each bar
            bars.data(data)
                .enter()
                .append("rect")
                .merge(bars)
                .transition()
                .duration(1000)
                .attr("y", item => y1(item[key]))
                .attr("height", item => height - y1(item[key]));
        }

    } else if (chart === 2) {
        // fill x axis
        x2.domain(data.map(item => { return item["name"]} ));
        xAxis2
            .call(d3.axisBottom(x2))
            .selectAll("text")
            .attr("transform", "translate(14,10)rotate(90)")
            .style("text-anchor", "start");

        // prepare y axis
        y2.domain([min, max]);
        yAxis2
            .transition()
            .duration(512)
            .call(d3.axisLeft(y2));

        let bars = svg2.selectAll("rect");
        // check if bars were already rendered
        if(bars["_groups"][0].length === 0) {
            // create empty bars
            bars.data(data)
                .enter()
                .append("rect")
                .attr("x", item => x2(item["name"]))
                .attr("y", _ => y2(0))
                .attr("height", _ => height - y2(0)) // always equal to 0 for animation
                .attr("width", x2.bandwidth())
                .attr("fill", "#878787")
                .on("mouseover", (ev, data) => highlightCountry(data["id"]))
                .on("mouseout", (ev, data) => normaliseCountry(data["id"]))
                .on("click", (ev, data) => map.flyTo([data["gps_lat"], data["gps_long"]], 4));

            // animation to correct height
            svg2.selectAll("rect")
                .transition()
                .duration(200)
                .attr("y", item => y2(item[key]))
                .attr("height", item => height - y2(item[key]))
                .delay((item, i) => (i * 50));
        } else {
            // change value of each bar
            bars.data(data)
                .enter()
                .append("rect")
                .merge(bars)
                .transition()
                .duration(1000)
                .attr("y", item => y2(item[key]))
                .attr("height", item => height - y2(item[key]));
        }
    }
}



/*
*** LEAFLET - MAP
 */

// class for custom markers
const MarkerIcon = L.Icon.extend({
    options: {
        iconSize: [32, 32],
        iconAnchor: [16, 24],
    }
});

// custom icon for default marker
const defaultMarkerIcon = new MarkerIcon({
        iconUrl: "../assets/marker.svg",
}), // custom icon for highlighted marker
    selectedMarkerIcon = new MarkerIcon({
        iconUrl: "../assets/marker_selected.svg",
});

function initMap() {
    // init map
    map = L.map("map", {
        center: [45,17],
        zoom: 3,
        minZoom: 2,
        maxZoom: 4
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    L.control.scale({imperial: true, metric: true}).addTo(map);

    // add marker for each country
    for(const country of data) {
        const id = country["id"];
        const text = createPopupContent(id, 3, 4);
        markers[id] = L.marker(
            [country["gps_lat"], country["gps_long"]], // marker coordinate via csv input
            {
                icon: defaultMarkerIcon, // set custom icon
                id: id // set id for interaction with bar chart
            })
            .bindPopup(text)
            .on("mouseover", (ev) => {
                highlightCountry(ev.target.options["id"]); // change icon of map and color of bar
                ev.target._popup._content = createPopupContent(
                    ev.target.options["id"],
                    $("#select1").val(),
                    $("#select2").val()
                ); // update popup content
            })
            .on("mouseout", (ev) => {
                normaliseCountry(ev.target.options["id"]); // return icon of map and color of bar to default
            })
            .on("click", (ev) => {
                map.flyTo([ev.latlng["lat"], ev.latlng["lng"]], 4); // change focus of map
            })
            .addTo(map);
    }
}

function createPopupContent(id, key1, key2) {
    let country;
    // get country
    for(let item of data){
        if(item["id"] === id) {
            country = item;
            break;
        }
    }
    if(key1 === key2) {
        // if both <select> have same value, just add one fact
        key1 = keys[key1-3];
        return `<b>${country["name"]}</b><hr/>${key1}<br/>${country[key1]}`;
    } else {
        // get key from both <select>
        key1 = keys[key1-3];
        key2 = keys[key2-3];
        // fill popup with both facts
        return `<b>${country["name"]}</b><hr/>${key1}<br/>${country[key1]}<hr/>${key2}<br/>${country[key2]}`;
    }
}



/*
*** SYNC CHARTS <-> MAP
 */

function highlightCountry(id) {
    // marks bar in chart 1
    d3.select("#bar-chart1")
        .select("svg")
        .selectAll("rect")
        .filter(item => {
            return item["id"] === id; // get the correct bar
        })
        .style("fill", "#9bc333");

    // marks bar in chart 2
    d3.select("#bar-chart2")
        .select("svg")
        .selectAll("rect")
        .filter(item => {
            return item["id"] === id;
        })
        .style("fill", "#9bc333");

    // changes icon of relevant marker
    markers[id].setIcon(selectedMarkerIcon);
}

function normaliseCountry(id) {
    // marked column in chart 1 is grey
    d3.select("#bar-chart1")
        .select("svg")
        .selectAll("rect")
        .filter(item => {
            return item["id"] === id; // get the correct bar
        })
        .style("fill", "#878787");

    // marked column in chart 2 is grey
    d3.select("#bar-chart2")
        .select("svg")
        .selectAll("rect")
        .filter(item => {
            return item["id"] === id;
        })
        .style("fill", "#878787");

    // changes icon of relevant marker to default
    markers[id].setIcon(defaultMarkerIcon);
}
