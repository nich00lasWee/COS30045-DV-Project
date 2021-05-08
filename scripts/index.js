
function pieChart(dataset) {

  var sector = dataset.map(function(d) {return d.Sector})
  var waste = dataset.map(function(d) {return d.WasteProduced})

  sector.pop();
  waste.pop();

  var w = 320;
  var h = 320;

  var svg = d3.selectAll("#pieChart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg.append("rect")
    .attr("width", w)
    .attr("height", h);

  svg.selectAll("rect")
    .style("fill","white")
    .style("stroke","black")
    .style("stroke-width","2.5");

  var outerRadius = w / 2;
  var innerRadius = 0;

  var arc= d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);

  var pie = d3.pie();

  var arcs = svg.selectAll("g.arc")
    .data(pie(waste))
    .enter()
    .append("g")
    .attr("class","arc")
    .attr("transform","translate(" + outerRadius + "," + outerRadius + ")");

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  arcs.append("path")
      .attr("fill",function(d, i) {
          return color(i);
      })
      .attr("d", function(d, i) {
          return arc(d, i);
      })
    }

function init() {
  d3.csv("data/pieChart.csv").then(function(data) {
    console.log(data);
    var dataset = data;
    pieChart(dataset);
  })
}

window.onload = init;
