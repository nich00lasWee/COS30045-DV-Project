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
    .y0(function() {return (cD - padding) - 15 + 0.25;})          // Prevents area from clipping scale
    .y1(function(d) {return yScale(d.Waste) - (padding / 2);});

  var line2 = d3.line()
    .x(function(d) {return xScale(d.TimePeriod) + 1;})
    .y(function(d) {return yScale(d.Recycled) - (padding / 2)});

  var area2 = d3.area()
    .x(function(d) {return xScale(d.TimePeriod) + 1;})
    .y0(function() {return (cD - padding) - 15 + 0.25;})        // Prevents line from clipping scale
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

  // Dot Points and interactivity
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

  // Dot Points and interactivity
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

  // Legend
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

  // Scale Captions
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

function pie(dataset, svg, cD, x2, tooltip)
{
  var outerRadius = cD / 2.3;           // reduces size of chart
  var innerRadius = 0;
  var padding = cD / 15.07826086956522; // acheives equal spacing

  var arc = d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);

  var pie = d3.pie();

  var arcs = svg.selectAll("g.arc")
    .data(pie(dataset.map(function(d) {
      return d.Amount;
    })))
    .enter()
    .append("g")
    .attr("class","arc")
    .attr("transform","translate(" + (outerRadius + padding + x2) + "," + (outerRadius + padding) + ")");  // position in center of rectangle

  // Colors
  var color = d3.scaleOrdinal()
      .range(["#6E8F8E",
          "#6A8187",
          "#68737A",
          "#b5e48c",  // < - Recycling, lighter color
          "#63666A",
          "#5A5A5A"      ]);

  var path = arcs.append("path")
      .attr("fill",function(d, i) {
          return color(i);
      })
      .attr("d", function(d, i) {
          return arc(d, i);
      });

  // Tooltip/interactivity
  path.on("mouseover", function(event, d, i) {
    var darkColor = d3.rgb(d3.select(this).attr("fill")).darker(0.5);   // Darkens color slightly
    d3.select(this).attr("fill",darkColor);
  })
  .on("mousemove", function(event, d) {
    var sector;                                 // Fate of Waste

    // Matches fate to relevant amount and stores in variable
    for(j = 0; j < dataset.length; j++)
      if(dataset[j].Amount == d.value)
        sector = dataset[j].Fate;
    var coordinates = d3.pointer(event);
    return (tooltip.style("visibility","visible")
              .html("<b>" + sector + "</b>" + "<br>" + d.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " tonnes")  // Adds commas between numbers
              .style("top", event.pageY + "px")
              .style("left", (event.pageX + 20) + "px")
              );
  })
  .on("mouseout", function(d) {
    svg.selectAll("#tooltip").remove();
    var lightColor = d3.rgb(d3.select(this).attr("fill")).brighter(0.5);  // Return to default color
    d3.select(this).attr("fill",lightColor)
    return (tooltip.style("visibility","hidden"));
  });
}

function init()
{
  var pageWidth = 1500;
  var sW = document.getElementById("sub-vis").clientWidth;
  var cD = 0.25 * sW;                                           // Each chart is allocated 25% of svg Width - remainder is used for gaps between

  var svg = d3.selectAll("#sub-vis")
    .append("svg")
    .attr("viewBox","0 0 " + sW + " " + (cD + 50)); // Uses width of page and height of visualisations, viewbox for responsiveness

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

    // Positions text
    d3.select('#area-text')
      .style("display","inline-block")
      .style("width",cD + "px")
      .style("position","relative")
      .style("top","90px")
      .style("left",x1 + "px");

    var dataset = data;
    area(dataset, svg, cD, x1, tooltip);
  });

    d3.csv("dataset/recycle-pie.csv").then(function(data) {

      // Positions text
      d3.select('#pie-text')
        .style("display","inline-block")
        .style("width",cD + "px")
        .style("position","relative")
        .style("top","65px")
        .style("left", (x2 - cD) + "px");

      var dataset = data;
      pie(dataset, svg, cD, x2, tooltip);
    });
}

window.onload = init;
