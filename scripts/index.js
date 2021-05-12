function pieChart(dataset, cD) {    // waste production of each sector 2018-2019 (in tonnes)

  var svg = d3.selectAll("#pieChart")
    .append("svg")
    .attr("x",0)
    .attr("y",0)
    .attr("width", cD)
    .attr("height",cD);

  svg.append("rect")
    .attr("x", 1)
    .attr("y", 1)
    .attr("width", cD - 1)
    .attr("height", cD - 1); // prevents svg from clipping rectangle

    svg.selectAll("rect")
      .style("fill","white")
      .style("stroke","black")
      .style("stroke-width","1.5");


  var outerRadius = cD / 2.3;  // reduces size of chart
  var innerRadius = 0;

  var arc = d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);

  var pie = d3.pie();

  var arcs = svg.selectAll("g.arc")
    .data(pie(dataset.map(function(d) {
      return d.WasteProduced;
    })))
    .enter()
    .append("g")
    .attr("class","arc")
    .attr("transform","translate(" + (outerRadius + 20) + "," + (outerRadius + 20) + ")");  // position in center of rectangle


  var color = d3.scaleOrdinal(d3.schemeCategory10);

  arcs.append("path")
      .attr("fill",function(d, i) {
          return color(i);
      })
      .attr("d", function(d, i) {
          return arc(d, i);
      })
      .on("mouseover", function(event, d, i) {
        svg.append("text")
          .attr("id","tooltip")
          .attr("x", 20)
          .attr("y", 20)
          .text(d.value)
          for(j = 0; j < 10; j++) {
            if(j == i)                                                 // FIX LATER: Should detect when position of data is equivalent to position of loop
              console.log("placeholder - will fix later (pieChart)");             // Logs the relevant data. Will eventually display the relevant data (sector) via tooltip
          };
      })
      .on("mouseout", function(d) {
        svg.selectAll("#tooltip").remove();
      })
    }

function lineChart(dataset, svg, sW, cD, x2, padding) {

  // Scales are likely incorrect currently - revisit upon issue
  var xScale = d3.scaleOrdinal()
    .domain([
      d3.min(dataset, function(d) {return d.TimePeriod;}),
      d3.max(dataset, function(d) {return d.TimePeriod;})
    ])
    .range([(x2 + padding), (x2 + cD) - padding]);

  var yScale = d3.scaleLinear()
    .domain([540, d3.max(dataset, function(d) {console.log(parseInt(d.HouseholdWaste) + 200); return (parseInt(d.HouseholdWaste) + 20);})])
    .range([cD - padding, padding / 2]);

  var line = d3.line()
    .x(function(d) {return xScale(d.TimePeriod);})
    .y(function(d) {return yScale(d.HouseholdWaste) + padding / 2;});

  svg.append("path")
    .datum(dataset)
    .attr("class","line")
    .attr("d",line)
    .style("fill","none")
    .style("stroke","slategrey")
    .style("stroke-width","1");

  var xAxis = d3.axisBottom()
    .ticks(4)
    .scale(xScale);

  var yAxis = d3.axisLeft()
    .ticks(7)
    .scale(yScale);

  svg.append("g")
      .attr("transform", "translate(0, " + (cD - padding) + ")")
      .call(xAxis);

  svg.append("g")
      .attr("transform", "translate(" + (x2 + padding) + ", 0)")
      .call(yAxis);
}

function bubbleChart(svg, sW, cD) {

  var svg = d3.selectAll("#bubbleChart")
    .append("svg")
    .attr("viewBox", "0 0 " + sW + " " + cD ) // Viewbox for responsiveness

    var temp = (sW - (cD * 2)); // determines box location depending on svg width (as set by div)
    var x2 = (temp + cD) / 2;
    var padding = 40;

    svg.append("rect")
      .attr("x", x2)
      .attr("y", 1)
      .attr("width", cD - 1)
      .attr("height", cD - 1); // prevents svg from clipping rectangle

    svg.selectAll("rect")
      .style("fill","white")
      .style("stroke","black")
      .style("stroke-width","1.5");


}

function init() {

  var sW = document.getElementById('sub-vis-home').clientWidth;  // Width changes depending on monitor used - this ensures correct value is fetched
  var cD = 0.125 * sW;                                           // Each chart is allocated 25% of svg Width - remaining 25% is used for gaps

  console.log(cD);

/*  svg.append("rect")
    .attr("x", (sW - cD - 1))
    .attr("y", 1)
    .attr("width", cD - 1)
    .attr("height", cD - 1); // prevents svg from clipping rectangle

  var temp = (sW - (cD * 2)); // determines box location depending on svg width (as set by div)
  var x2 = (temp + cD) / 2;
  var padding = 40;

  svg.append("rect")
    .attr("x", x2)
    .attr("y", 1)
    .attr("width", cD - 1)
    .attr("height", cD - 1); // prevents svg from clipping rectangle

  svg.selectAll("rect")
    .style("fill","white")
    .style("stroke","black")
    .style("stroke-width","1.5"); */

  d3.csv("data/pieChart.csv").then(function(data) {
    console.log(data);
    var dataset = data;
    pieChart(dataset, cD);
  })

  d3.csv("data/lineChart.csv").then(function(data) {
    console.log(data);
    var dataset = data;
//    lineChart(dataset, svg, sW, cD, x2, padding);  // forgive the amount of parameters, I'll condense this later
  })

//  bubbleChart(svg, sW, cD);
}

window.onload = init;
