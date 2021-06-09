// Method source: https://bl.ocks.org/bricedev/0d95074b6d83a77dc3ad
// Date retrieved: 23 May 2021

function groupedBarGraph() {

  // ["#399283", "#4aeeb6", "#0e503e", "#8ae1f9", "#4443b4", "#dfcfe7", "#a50fa9", "#b687f8", "#4b425e", "#ef66f0"]

  // Ensure the bars scale relatively to dataset
  var x0 = v3.scale.ordinal().rangeRoundBands([0, width], .1);
  var x1 = v3.scale.ordinal();
  var y = v3.scale.linear().range([height, margin.top]);

  // Setup x-axis
  var xAxis = v3.svg.axis()
                    .scale(x0)
                    .tickSize(0)
                    .orient("bottom");
  // Setup y-axis
  var yAxis = v3.svg.axis()
                    .scale(y)
                    .orient("left");
  
  // Colour scheme: https://coolors.co/d9ed92-b5e48c-99d98c-76c893-52b69a-34a0a4-168aad-1a759f-1e6091-184e77
  var color = v3.scale.ordinal().range(["#b5e48c", "#99d98c", "#76c893"]);

  // Setup main SVG board
  var svg = v3.select('#overview-vis')
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .style("border", "2.5px solid #e3e3e3")
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  v3.json("dataset/waste.json", function(error, data) {

    if (error) throw error;

    // Store waste material categories and year periods
    var wasteCategory = data.map(function(d) { return d.Category; });
    var yearCategory = data[0].Values.map(function(d) { return d.year; });

    // Initialise domain for x and y axis
    x0.domain(wasteCategory);
    x1.domain(yearCategory).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, v3.max(data, function(Category) {
      return v3.max(Category.Values, function(d) {
        return d.value; });
      })
    ]);

    // Initialise x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("font-size", "15")
        .style("text-anchor", "end")
        .attr("dx", "1em")
        .attr("dy", "1.5em")
        .attr("transform", "rotate(-17.5)");

    // Initialise y-axis
    svg.append("g")
        .attr("class", "y axis")
        .style('opacity','0')
        .call(yAxis)
        .append("text")
        .attr("id", "label")
        .style("font-size", "17.5")
        .attr("dx", "-1.5em")
        .attr("dy", ".5em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Amount (in kg)");

    // Transition effect for loading y-axis
    svg.select('.y.axis')
        .transition()
        .duration(500)
        .delay(1300)
        .style("opacity", "1");

    // Setup grouped bar chart
    var chart = svg.selectAll(".chart")
                    .data(data)
                    .enter()
                    .append("g")
                    .attr("class", "g")
                    .attr("transform", function(d) {
                      return "translate(" + x0(d.Category) + ",0)";
                    });
    
    // Setup tooltip
    var tooltip = v3.select("#overview-vis")
                    .append("div")
                    .style("position", "absolute")
                    .style("visibility", "hidden")
                    .style("background-color", "rgba(255, 255, 255, 0.9)")
                    .style("border", "1px solid #d3d3d3")
                    .style("box-shadow", "0px 1.5px #d3d3d3")
                    .style("border-radius", "5px")
                    .style("padding", "10px");
    
    // Initialise chart bars with data
    chart.selectAll("rect")
          .data(function(d) { return d.Values; })
          .enter()
          .append("rect")
          .attr("width", x1.rangeBand())
          .attr("x", function(d) { return x1(d.year); })
          .style("fill", function(d) { return color(d.year) })
          .attr("y", function(d) { return y(0); })
          .attr("height", function(d) { return height - y(0); })
          .on("mouseover", function(d) {
              v3.select(this).style("fill", v3.rgb(color(d.year)).darker(1)); // Darken the area hovered
          })
          .on("mousemove", function(d) {
            var year = d.year;
            var value = "Value: " + d.value.toLocaleString() ;

            // Return tooltip with information when a bar is hovered
            tooltip.style("visibility", "visible")
                    .html("<b>" + year + "</b><br>" + value)
                    .style("top", (v3.event.pageY - 10) + "px")
                    .style("left", (v3.event.pageX + 20) + "px");
          })
          .on("mouseout", function(d) {
              v3.select(this).style("fill", color(d.year));
              tooltip.style("visibility", "hidden");
          });
    
    // Transition effect for loading the bars
    chart.selectAll("rect")
          .transition()
          .delay(function (d) {return Math.random()*1000;})
          .duration(1000)
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); });

    // Initialise legend
    var legend = svg.selectAll(".legend")
                    .data(data[0].Values.map(function(d) { return d.year; }).reverse())
                    .enter()
                    .append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return "translate(0," + i * 22 + ")"; })
                    .style("opacity","0");

    // Legend colours
    legend.append("rect")
          .attr("x", width - 20)
          .attr("width", 20)
          .attr("height", 20)
          .style("fill", function(d) { return color(d); });

    // Legend labels
    legend.append("text")
          .attr("x", width - 28)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("font-weight", "bold")
          .style("text-anchor", "end")
          .text(function(d) {return d;});

    // Transition effect for loading legend
    legend.transition()
          .duration(500)
          .delay(function(d, i){
            return 1300 + 100 * i;
          })
          .style("opacity", "1");

    // Scale factor and relevant variables
    var scale = [1, 2, 4, 8, 16];
    var scaleIndex = 0;
    var labelY = 0.5;
    var offset = 3;

    var total = v3.max(data, function(Category) {
      return v3.max(Category.Values, function(d) {
        return d.value; });
    });
    
    // Scale the bars when zoom in button is clicked
    v3.select("#zoom-in").on("click", function() {
      if (scaleIndex != scale.length - 1) {
          scaleIndex++;
          labelY -= offset;
          y.domain([0, total / scale[scaleIndex]]);
      }
      
      // Update y-axis after scaling
      svg.select(".y.axis")
          .transition()
          .duration(500)
          .call(yAxis)
          .select("#label")
          .attr("dy", labelY + "em");

      // Increase bar heights
      chart.selectAll("rect")
          .transition()
          .duration(500)
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); }); 
    });

    // Scale the bars when zoom out button is clicked
    v3.select("#zoom-out").on("click", function() {
      if (scaleIndex != 0) {
          scaleIndex--;
          labelY += offset;
          y.domain([0, total / scale[scaleIndex]]);
      }
      
      // Update y-axis after scaling
      svg.select(".y.axis")
          .transition()
          .duration(500)
          .call(yAxis)
          .select("#label")
          .attr("dy", labelY + "em");

      // Decrease bar heights
      chart.selectAll("rect")
          .transition()
          .duration(500)
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); }); 
    });
  })
}

window.onload = groupedBarGraph();
