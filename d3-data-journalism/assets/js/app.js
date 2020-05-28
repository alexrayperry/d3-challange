// svg container
var svgHeight = 600;
var svgWidth = 900;


// margins
var margin = {
    top: 50,
    right: 50,
    bottom: 60,
    left: 50
  };

  
// chart area minus margins
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;


// create svg container
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);



/////////////// READ IN CSV DATA & CREATE GRAPH  /////////////////////////

d3.csv("./assets/data/data.csv").then(function(censusData) {

    censusData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
      });

    var chartGroup = svg.selectAll("g myCircleText")
     .data(censusData);

    var chartEnter = chartGroup.enter()
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

     // scale x to chart width
    var xScale = d3.scaleLinear()
     .domain([8, d3.max(censusData, d => d.poverty)])
     .range([0, width]);
   
 
    // scale y to chart height
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.healthcare)])  
      .range([height, 0]);

   // create axes
   var xAxis = d3.axisBottom(xScale);
   var yAxis = d3.axisLeft(yScale);
  

   // set x to the bottom of the chart
   chartEnter.append("g")
       .attr("transform", `translate(0, ${height})`)
       .call(xAxis);

   // set y to the y axis
   chartEnter.append("g")
       .call(yAxis);
    
      
    // Create Circles
    var circles = chartEnter.append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "15")
    .attr("class", "stateCircle");
    // .attr("opacity", ".5");

    console.log(censusData);

    /////////////////////////////////////////////////////////////
    var text = chartEnter.append("text")
    .text(d => d.abbr)
    .attr("dx", d => xScale(d.poverty))
    .attr("dy", d => (yScale(d.healthcare)) + 5)
    .attr("class", "stateText");


    ////////////////////////////////////////////////////////////
      var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([70, -50])
      .html(function(d) {
          return (`Healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
      });

      chartEnter.call(toolTip);

      text.on("mouseover", function(data) {
        toolTip.show(data, this);
      })

      .on("mouseout", function(data, index) {
          toolTip.hide(data);
      });

          // Create axes labels
    chartEnter.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left -5)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("Lacks Healthcare (%)");

    chartEnter.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 0})`)
    .attr("class", "aText")
    .text("In Poverty (%)");
});














