function area(dataset, svg, cD, x1, tooltip)
{
  var padding = 40;
  var width = 1375;

  var xData = dataset.map(function(d){return d.TimePeriod;});  // Maps X values to array for scale

  var xScale = d3.scalePoint()
    .domain(xData)
    .range([x1 + padding, (x1 + cD) - padding]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) {return parseInt(d.Waste) + 20;})])
    .range([cD - padding, (padding / 2) + 30]);

  var xAxis = d3.axisBottom()
    .ticks(6)
    .scale(xScale);

  var yAxis = d3.axisLeft()
    .ticks(10)
    .scale(yScale);

  svg.append("g")
      .attr("transform", "translate(0, " + (cD - padding - 15) + ")")
      .call(xAxis);

  svg.append("g")
      .attr("transform", "translate(" + (x1 + padding) + ", -15)")
      .call(yAxis);

  var line1 = d3.line()
    .x(function(d) {return xScale(d.TimePeriod) + 1;})
    .y(function(d) {return yScale(d.Waste) - (padding / 2)});

  var area1 = d3.area()
    .x(function(d) {return xScale(d.TimePeriod) + 1;})
    .y0(function() {return (cD - padding) - 15 + 0.25;})
    .y1(function(d) {return yScale(d.Waste) - (padding / 2);});

  var line2 = d3.line()
    .x(function(d) {return xScale(d.TimePeriod) + 1;})
    .y(function(d) {return yScale(d.Recycled) - (padding / 2)});

  var area2 = d3.area()
    .x(function(d) {return xScale(d.TimePeriod) + 1;})
    .y0(function() {return (cD - padding) - 15 + 0.25;})
    .y1(function(d) {return yScale(d.Recycled) - (padding / 2);});

  // Waste
  svg.append("path")
    .datum(dataset)
    .attr("class","area")
    .attr("d",area1)
    .style("fill","#808080")
    .style("stroke-width","1");

  svg.append("path")
    .datum(dataset)
    .attr("class","line")
    .attr("d",line1)
    .style("fill","none")
    .style("stroke","#5a5a5a")
    .style("stroke-width","3");

  // Recycling
  svg.append("path")
    .datum(dataset)
    .attr("class","area")
    .attr("d",area2)
    .style("fill","#b5e48c")
    .style("stroke-width","1");

  svg.append("path")
    .datum(dataset)
    .attr("class","line")
    .attr("d",line2)
    .style("fill","none")
    .style("stroke","#76c893")
    .style("stroke-width","3");

  // Wasted
  svg.selectAll("myCircles")
    .data(dataset)
    .enter()
    .append("circle")
      .attr("fill","#5a5a5a")
      .attr("cx", function(d) {return xScale(d.TimePeriod);})
      .attr("cy", function(d) {return yScale(d.Waste) - (padding / 2);})
      .attr("r",4.5)
    .on("mouseover", function(event, d) {
      var darkColor = d3.rgb(d3.select(this).attr("fill")).darker(1);
      d3.select(this).attr("fill",darkColor);
      var total = d.TotalWaste + " tonnes";
      return (tooltip.style("visibility","visible")
                .html(total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                .style("top", event.pageY + "px")
                .style("left", (event.pageX + 20) + "px"))
    })
    .on("mouseout", function(d) {
      d3.select(this).attr("fill","#5a5a5a")
      svg.selectAll("#tooltip").remove();
      return (tooltip.style("visibility","hidden"));
    });

  // Recycled
  svg.selectAll("myCircles")
    .data(dataset)
    .enter()
    .append("circle")
      .attr("fill","#76c893")
      .attr("cx", function(d) {return xScale(d.TimePeriod);})
      .attr("cy", function(d) {return yScale(d.Recycled) - (padding / 2);})
      .attr("r",4.5)
    .on("mouseover", function(event, d) {
      var darkColor = d3.rgb(d3.select(this).attr("fill")).darker(1);
      d3.select(this).attr("fill",darkColor);
      var total = d.TotalRecycled + " tonnes";
      return (tooltip.style("visibility","visible")
                .html(total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                .style("top", event.pageY + "px")
                .style("left", (event.pageX + 20) + "px"))
    })
    .on("mouseout", function(d) {
      d3.select(this).attr("fill","#76c893")
      svg.selectAll("#tooltip").remove();
      return (tooltip.style("visibility","hidden"));
    });

  var legend = svg.append("g")
    .attr("class","legend")
    .attr("transform","translate(0, 0)");

  legend.append("rect")
    .attr("x", (x1 + cD) - padding)
    .attr("y", (padding / 2))
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", "#5a5a5a");

  legend.append("rect")
    .attr("x", (x1 + cD) - padding)
    .attr("y", (padding / 2) + 23)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", "#76c893");

  legend.append("text")
    .attr("x", (x1 + cD) - padding - 10)
    .attr("y", (padding / 2) + 10)
    .attr("dy", ".35em")
    .style('font-weight','bold')
    .style("text-anchor", "end")
    .style("font-size","12.5px")
    .text("Total Waste Recorded");

  legend.append("text")
    .attr("x", (x1 + cD) - padding - 10)
    .attr("y", (padding / 2) + 33)
    .attr("dy", ".35em")
    .style('font-weight','bold')
    .style("text-anchor", "end")
    .style("font-size","12.5px")
    .text("Total Waste Recycled");

  var captions = svg.append("g")
    .attr("transform","translate(0,0)");

  captions.append("text")
    .attr("x", x1 + 20)
    .attr("y", 20)
    .style("font-size","12.5px")
    .style("font-weight","bold")
    .text("Amount (mill tonnes)");

  captions.append("text")
    .attr("x", x1 + padding + 110)
    .attr("y", cD - (padding / 2))
    .style("font-size","12.5px")
    .style("font-weight","bold")
    .text("Time Period");
}

function init()
{
  var pageWidth = 1500; // will correct later when work is combined
  var sW = document.getElementById("sub-vis").clientWidth;
  var cD = 0.25 * sW;                                             // Each chart is allocated 25% of svg Width - remainder is used for gaps between

  var svg = d3.selectAll("#sub-vis")
    .append("svg")
    .attr("viewBox","0 0 " + sW + " " + (cD + 50));

  var x1 = sW * 0.125;  // X Position of first visualisation

  svg.append("rect")
    .attr("x", x1)
    .attr("y", 1)
    .attr("width", cD)
    .attr("height", cD - 1);  // prevents svg from clipping rectangle

  var x2 = sW * 0.625;
  var padding = 40;

  svg.append("rect")
    .attr("x", x2)
    .attr("y", 1)
    .attr("width", cD - 1)
    .attr("height", cD - 1);

  svg.selectAll("rect")
    .style("fill","white")
    .style("stroke","#e3e3e3")
    .style("stroke-width","1.5");

  // Prepares tooltip for later use
  var tooltip = d3.select("#sub-vis")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

  d3.csv("dataset/recycle-area.csv").then(function(data) {

    d3.select('#area-text')
      .style("display","inline-block")
      .style("width",cD + "px")
      .style("position","relative")
      .style("top","90px")
      .style("left",x1 + "px");

    var dataset = data;
    area(dataset, svg, cD, x1, tooltip);
  });

}

window.onload = init;
