
function pieChart(dataset, svg, h, cW) {

  var sector = dataset.map(function(d) {return d.Sector})
  var waste = dataset.map(function(d) {return d.WasteProduced})

  sector.pop(); // remove null values
  waste.pop();

  svg.append("rect")
    .attr("x", 1)
    .attr("y", 1)
    .attr("width", cW - 1)
    .attr("height", h - 1); // prevents svg from clipping rectangle

  svg.selectAll("rect")
    .style("fill","white")
    .style("stroke","black")
    .style("stroke-width","1.5");

  var outerRadius = cW / 2.3;  // reduces size of chart
  var innerRadius = 0;

  var arc = d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);

  var pie = d3.pie();

  var arcs = svg.selectAll("g.arc")
    .data(pie(waste))
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
          for(j = 0; j < sector.length; j++) {
            if(j == i)                            // FIX LATER: Should detect when position of data is equivalent to position of loop
              console.log(sector[i]);             // Logs the relevant data. Will eventually display the relevant data (sector) via tooltip
          };
      })
      .on("mouseout", function(d) {
        svg.selectAll("text").remove();
      })
    }

function lineChart(svg, h, cW) {

  svg.append("rect")
    .attr("x", cW + 223.5)
    .attr("y", 1)
    .attr("width", cW - 1)
    .attr("height", h - 1); // prevents svg from clipping rectangle

  svg.selectAll("rect")
    .style("fill","white")
    .style("stroke","black")
    .style("stroke-width","1.5");
}

function bubbleChart(svg, h, sW, cW) {

  svg.append("rect")
    .attr("x", (sW - cW - 1))
    .attr("y", 1)
    .attr("width", cW - 1)
    .attr("height", h - 1); // prevents svg from clipping rectangle

  svg.selectAll("rect")
    .style("fill","white")
    .style("stroke","black")
    .style("stroke-width","1.5");
}

function init() {

  var sW = 1411;  // width of <div>
  var cW = 320;   // width of charts
  var h = 320;

  var svg = d3.selectAll("#svg")
    .append("svg")
    .attr("width", sW)
    .attr("height", h );

  d3.csv("data/pieChart.csv").then(function(data) {
    console.log(data);
    var dataset = data;
    pieChart(dataset, svg, h, cW);
  })

  lineChart(svg, h, cW);

  bubbleChart(svg, h, sW, cW);
}

window.onload = init;
