d3.csv("../data/data.csv").then(function(censusData){
    

})



// svg container
var height = 600;
var width = 1000;


// margins
var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  };

  
// chart area minus margins
var chartHeight = height - margin.top - margin.bottom;
var chartWidth = width - margin.left - margin.right;


// create svg container
var svg = d3.select("#scatter").append("svg")
    .attr("height", height)
    .attr("width", width);


// shift everything over by the margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// scale y to chart height
var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataArray)])  //  Insert data array for Healthcare
    .range([chartHeight, 0]);

// scale x to chart width
var xScale = d3.scaleBand()
    .domain(dataCategories)  // insert data array here for Poverty
    .range([0, chartWidth])
    .padding(0.1);

// create axes
var yAxis = d3.axisLeft(yScale);
var xAxis = d3.axisBottom(xScale);

// set x to the bottom of the chart
chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);

// set y to the y axis
chartGroup.append("g")
    .call(yAxis);







