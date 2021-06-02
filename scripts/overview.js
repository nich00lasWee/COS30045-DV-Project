function groupedBarGraph() {

  // ["#399283", "#4aeeb6", "#0e503e", "#8ae1f9", "#4443b4", "#dfcfe7", "#a50fa9", "#b687f8", "#4b425e", "#ef66f0"]

  //  Method source: https://bl.ocks.org/bricedev/0d95074b6d83a77dc3ad
  //  https://stackoverflow.com/questions/20947488/d3-grouped-bar-chart-how-to-rotate-the-text-of-x-axis-ticks

  var margin = {top: 25, right: 20, bottom: 75, left: 100};
  var width = 1500 - margin.left - margin.right;
  var height = 650 - margin.top - margin.bottom;

  var x0 = d3v3.scale.ordinal().rangeRoundBands([0, width], .1);

  var x1 = d3v3.scale.ordinal();

  var y = d3v3.scale.linear().range([height, margin.top]);

  var xAxis = d3v3.svg.axis()
                      .scale(x0)
                      .tickSize(0)
                      .orient("bottom");

  var yAxis = d3v3.svg.axis()
                      .scale(y)
                      .orient("left");

  var color = d3v3.scale.ordinal().range(["#b5e48c", "#99d98c", "#76c893"]);

  var svg = d3v3.select('#overview-vis')
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("border", "2.5px solid #e3e3e3")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3v3.json("dataset/waste.json", function(error, data) {

    if (error) throw error;

    var wasteCategory = data.map(function(d) { return d.Category; });   // store waste material categories
    
    var yearCategory = data[0].Values.map(function(d) { return d.year; });  // store year periods

    x0.domain(wasteCategory);
    x1.domain(yearCategory).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3v3.max(data, function(Category) { 
      return d3v3.max(Category.Values, function(d) { 
        return d.value; }); 
      })
    ]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("font-size", "15")
        .style("text-anchor", "middle")
        .attr("dx", "-.75em")
        .attr("dy", "2.25em")
        .attr("transform", "rotate(-15)");

    svg.append("g")
        .attr("class", "y axis")
        .style('opacity','0')
        .call(yAxis)
        .append("text")
        .style("font-size", "17.5")
        .attr("dx", "-1.5em")
        .attr("dy", ".5em")
        .style("text-anchor", "middle")
        .style('font-weight','bold')
        .text("Amount (in kg)");

    svg.select('.y')
        .transition()
        .duration(500)
        .delay(1300)
        .style('opacity','1');

    //  Grouped bar chart
    var slice = svg.selectAll(".slice")
                    .data(data)
                    .enter()
                    .append("g")
                    .attr("class", "g")
                    .attr("transform", function(d) {
                      return "translate(" + x0(d.Category) + ",0)";
                    });
    
    var tooltip = d3v3.select("#overview-vis")
                      .append("div")
                      .style("position", "absolute")
                      .style("visibility", "hidden")
                      .style("background-color", "white")
                      .style("border", "solid")
                      .style("border-width", "1px")
                      .style("border-radius", "5px")
                      .style("padding", "10px");

    slice.selectAll("rect")
          .data(function(d) { return d.Values; })
          .enter()
          .append("rect")
          .attr("width", x1.rangeBand())
          .attr("x", function(d) { return x1(d.year); })
          .style("fill", function(d) { return color(d.year) })
          .attr("y", function(d) { return y(0); })
          .attr("height", function(d) { return height - y(0); })
          .on("mouseover", function(d) {
              d3v3.select(this).style("fill", d3v3.rgb(color(d.year)).darker(1));  
          })
          .on("mousemove", function(d) {
            var year = "<li>" + d.year + ": ";
            var value = d.value.toLocaleString() + "</li>";
            return (tooltip.style("visibility", "visible")
                            .html(year + "<b>" + value + "</b>")
                            .style("top", (d3v3.event.pageY - 10) + "px")
                            .style("left", (d3v3.event.pageX + 20) + "px")
                            );
          })
          .on("mouseout", function(d) {
              d3v3.select(this).style("fill", color(d.year));
              return tooltip.style("visibility", "hidden");
          });

    slice.selectAll("rect")
          .transition()
          .delay(function (d) {return Math.random()*1000;})
          .duration(1000)
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); });
    
    //  Legend
    var legend = svg.selectAll(".legend")
                    .data(data[0].Values.map(function(d) { return d.year; }).reverse())
                    .enter()
                    .append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return "translate(0," + i * 22 + ")"; })
                    .style("opacity","0");

    legend.append("rect")
          .attr("x", width - 20)
          .attr("width", 20)
          .attr("height", 20)
          .style("fill", function(d) { return color(d); });

    legend.append("text")
          .attr("x", width - 28)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style('font-weight','bold')
          .style("text-anchor", "end")
          .text(function(d) {return d; });

    legend.transition()
          .duration(500)
          .delay(function(d, i){ 
            return 1300 + 100 * i;
          })
          .style("opacity","1");
  })
}

window.onload = groupedBarGraph();