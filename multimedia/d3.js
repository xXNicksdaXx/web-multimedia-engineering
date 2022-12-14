// global variables
let data;
let keys = ["birth rate per 1000", "cell phones per 100", "children per woman", "electricity consumption per capita", "gdp_per_capita", "gdp_per_capita_growth", "inflation annual", "internet user per 100", "life expectancy"];

// set the dimensions and margins of the graph
const margin = {top: 32, right: 32, bottom: 128, left: 48},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


// append the svg object to the body of the page
const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// init x-axis
const x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);
const xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")

// init y-axis
const y = d3.scaleLinear()
    .range([height, 0]);
const yAxis = svg.append("g")
    .attr("class", "y-axis");

function fillBarChart(index) {
    // parse the data
    d3.csv("../assets/world_data_v3.csv").then((csvData) => {

        // format data objects
        data = csvData.map((item) => {
            const keywords = ["gps_lat", "gps_long", "military expenditure percent of gdp"];
            let newItem = {};
            for(const key in item) {
                if(!isNaN(item[key]))
                    // round number
                    newItem[key.trim()] = Number(Number(item[key]).toFixed(3));
                else if(!keywords.includes(key))
                    // trim strings
                    newItem[key.trim()] = item[key].trim();
            }
            return newItem;
        });

        // get key
        const key = keys[index-3];

        // fill x axis
        x.domain(data.map(item => { return item["name"]} ));
        xAxis
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(14,10)rotate(90)")
            .style("text-anchor", "start");

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

        // prepare y axis
        y.domain([min, max])
        yAxis
            .transition()
            .duration(512)
            .call(d3.axisLeft(y));

        let bars = svg.selectAll("rect");
        // check if bars were already rendered
        if(bars["_groups"][0].length === 0) {
            // create empty bars
            bars.data(data)
                .enter()
                .append("rect")
                .attr("x", item => x(item["name"]))
                .attr("y", _ => y(0))
                .attr("height", _ => height - y(0)) // always equal to 0
                .attr("width", x.bandwidth())
                .attr("fill", "#878787")

            // animation to correct height
            svg.selectAll("rect")
                .transition()
                .duration(200)
                .attr("y", item => y(item[key]))
                .attr("height", item => height - y(item[key]))
                .delay((item, i) => (i * 50))
        } else {
            // change value of each bar
            bars.data(data)
                .enter()
                .append("rect")
                .merge(bars)
                .transition()
                .duration(1000)
                .attr("x", item => x(item["name"]))
                .attr("y", item => y(item[key]))
                .attr("height", item => height - y(item[key]))
                .attr("width", x.bandwidth())
                .attr("fill", "#878787");
        }
    });
}

// init plot
fillBarChart(3);
