// svg container
var svgHeight = 600;
var svgWidth = 900;


// margins
var margin = {
    top: 50,
    right: 50,
    bottom: 80,
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


// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Chosen param
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles

// XXXXXXXXXXXXXXXXXXXXX  //
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "poverty") {
    label = "Poverty:";
  }
  else if (chosenXAxis === "age") {
    label = "Age:"
  }
  else {
    label = "Household Income:";
  }

  var toolTip = d3.tip()
  .attr("class", "d3-tip")
  .offset([70, -50])
  .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
  });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// chartEnter.call(toolTip);

// text.on("mouseover", function(data) {
//   toolTip.show(data, this);
// })

// .on("mouseout", function(data, index) {
//     toolTip.hide(data);
// });



/////////////// READ IN CSV DATA & CREATE GRAPH  /////////////////////////

d3.csv("./assets/data/data.csv").then(function(censusData, err) {
  if (err) throw err;

    censusData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
      });

    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);

     // Create y scale function
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.healthcare)])
    .range([height, 0]);

    // create axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    



    // var chartGroup = svg.selectAll("g myCircleText")
    //  .data(censusData);

    // var chartEnter = chartGroup.enter()
    //   .append("g")
    //   .attr("transform", `translate(${margin.left}, ${margin.top})`);

     

    //  // scale x to chart width
    // var xScale = d3.scaleLinear()
    //  .domain([8, d3.max(censusData, d => d.poverty)])
    //  .range([0, width]);

  
    
    // scale y to chart height
    // var yScale = d3.scaleLinear()
    //   .domain([0, d3.max(censusData, d => d.healthcare)])  
    //   .range([height, 0]);

  // append x axis
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
    .call(leftAxis);
      
    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15)
    .attr("class", "stateCircle");

    /////////////////////////////////////////////////////////////
    // var text = chartEnter.append("text")
    // .text(d => d.abbr)
    // .attr("dx", d => xLinearScale(d[chosenXAxis]))
    // .attr("dy", d => (yLinearScale(d.healthcare)) + 5)
    // .attr("class", "stateText");


    ////////////////////////////////////////////////////////////
      // var toolTip = d3.tip()
      // .attr("class", "d3-tip")
      // .offset([70, -50])
      // .html(function(d) {
      //     return (`${d.state}<br>Healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
      // });

      // chartEnter.call(toolTip);

      // text.on("mouseover", function(data) {
      //   toolTip.show(data, this);
      // })

      // .on("mouseout", function(data, index) {
      //     toolTip.hide(data);
      // });

      // Create axes labels

      // Y Label
    // chartEnter.append("text")
    // .attr("transform", "rotate(-90)")
    // .attr("y", 0 - margin.left -5)
    // .attr("x", 0 - (height / 2))
    // .attr("dy", "1em")
    // .attr("class", "aText")
    // .text("Lacks Healthcare (%)");


    // X Label
    // chartEnter.append("text")
    // .attr("transform", `translate(${width / 2}, ${height + margin.top + 0})`)
    // .attr("class", "aText")
    // .text("In Poverty (%)");
 

 // Create group for two x-axis labels
 var labelsGroup = chartGroup.append("g")
 .attr("transform", `translate(${width / 2}, ${height + 0})`);


var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "age") // value to grab for event listener
  .classed("inactive", true)
  .text("Age");

  var incomeLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 80)
  .attr("value", "income") // value to grab for event listener
  .classed("inactive", true)
  .text("Income");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 5)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("atext", true)
    .text("Lacks Healthcare (%)");

    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    labelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

         // replaces chosenXAxis with value
         chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
       else if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          }
        else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          }
        }
      });
    }).catch(function(error) {
      console.log(error);
    });



