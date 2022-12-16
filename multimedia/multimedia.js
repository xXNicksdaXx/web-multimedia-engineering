let data,
    map;
const keys = ["birth rate per 1000", "cell phones per 100", "children per woman", "electricity consumption per capita", "gdp_per_capita", "gdp_per_capita_growth", "inflation annual", "internet user per 100", "life expectancy", "gps_lat", "gps_long", "military expenditure percent of gdp"];

// set the dimensions and margins of the graph
const margin = {top: 32, right: 48, bottom: 128, left: 48},
    width = 600 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom,
    padding = 0.2;

// append the svg object to the body of the page
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


// functions
async function parseCSV() {
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
            // create empty bars
            bars.data(data)
                .enter()
                .append("rect")
                .attr("x", item => x1(item["name"]))
                .attr("y", _ => y1(0))
                .attr("height", _ => height - y1(0)) // always equal to 0
                .attr("width", x1.bandwidth())
                .attr("fill", "#878787")
                .on("mouseover", highlightRect)
                .on("mouseout", normaliseRect);

            // animation to correct height
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
                .attr("x", item => x1(item["name"]))
                .attr("y", item => y1(item[key]))
                .attr("height", item => height - y1(item[key]))
                .attr("width", x1.bandwidth())
                .attr("fill", "#878787")
                .on("mouseover", highlightRect)
                .on("mouseout", normaliseRect);
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
                .attr("height", _ => height - y2(0)) // always equal to 0
                .attr("width", x2.bandwidth())
                .attr("fill", "#878787")
                .on("mouseover", highlightRect)
                .on("mouseout", normaliseRect);

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
                .attr("x", item => x2(item["name"]))
                .attr("y", item => y2(item[key]))
                .attr("height", item => height - y2(item[key]))
                .attr("width", x2.bandwidth())
                .attr("fill", "#878787")
                .on("mouseover", highlightRect)
                .on("mouseout", normaliseRect);
        }
    }
}

function highlightRect() {
    d3.select(this)
        .style("fill", "#9bc333")
}

function normaliseRect() {
    d3.select(this)
        .style("fill", "#878787")
}

const MarkerIcon = L.Icon.extend({
    options: {
        iconSize: [32, 32],
        iconAnchor: [16, 24],
    }
});


const defaultMarkerIcon = new MarkerIcon({
        iconUrl: "../assets/marker.svg",
}),
    selectedMarkerIcon = new MarkerIcon({
        iconUrl: "../assets/marker_selected.svg",
});


function initMap() {
    // init map
    map = L.map("map").setView([45,17], 3);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 4,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    L.control.scale({imperial: true, metric: true}).addTo(map);

    for(const country of data) {
        L.marker(
            [country["gps_lat"], country["gps_long"]],
            {icon: defaultMarkerIcon})
            .bindPopup(country["name"])
            .on("mouseover", (ev) => {
                ev.target.setIcon(selectedMarkerIcon);
            })
            .on("mouseout", (ev) => {
                ev.target.setIcon(defaultMarkerIcon);
            })
            .addTo(map);
    }
}


// init
parseCSV().then(_ => {
    initMap();
    fillBarChart(3, 1);
    fillBarChart(4, 2);
});





