// global variables
let data;
let key = "birth rate per 1000"

// set the dimensions and margins of the graph
const margin = {top: 32, right: 32, bottom: 128, left: 32},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// parse the data
d3.csv("../assets/world_data_v3.csv").then((csvData) => {
    // format data objects
    data = csvData.map((item) => {
        const keywords = ["gps_lat", "gps_long", "military expenditure percent of gdp"];
        let newItem = {};
        for(const key in item) {
            if(!isNaN(item[key]))
                newItem[key.trim()] = Number(Number(item[key]).toFixed(3));
            else if(!keywords.includes(key))
                newItem[key.trim()] = item[key].trim();
        }
        return newItem;
    })

    // x axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(item => {
            console.log(item);
            return item["name"];
        }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(14,10)rotate(90)")
        .style("text-anchor", "start");

    // get domain range
    let max = 0;
    for(const item of data) {
        if(item[key] > max)
            max = item[key];
    }
    max = Math.round(max * 1.15);

    // add y axis
    const y = d3.scaleLinear()
        .domain([0, max])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // bars
    svg.selectAll("bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", item => x(item["name"]))
        .attr("width", x.bandwidth())
        .attr("fill", "#878787")
        .attr("height", _ => height - y(0)) // always equal to 0
        .attr("y", _ => y(0))


    // animation
    svg.selectAll("rect")
        .transition()
        .duration(200)
        .attr("y", item => y(item[key]))
        .attr("height", item => height - y(item[key]))
        .delay((item, i) => (i * 100))
});