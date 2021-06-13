function main()
{
  // Dimensions
  var margin = {top: 25, right: 20, bottom: 75, left: 100};
  var width = 1500 - margin.left - margin.right;
  var height = 650 - margin.top - margin.bottom;

  var svg = d3.select('#overview-vis')
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .style("border", "2.5px solid #e3e3e3")
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("dataset/personal-vis.csv").then(function(data) {

    var year = data.map(function(d){return d.TimePeriod;}); // Maps X Data

    // Scales and axies
    var xScale = d3.scalePoint()
                    .domain(year)
                    .range([0,width-75]); // subtracted for padding reasons

    var yScale = d3.scaleLinear()
                    .domain([3, d3.max(data, function(d) {return (parseInt(d.MSW) + 2);})])
                    .range([height, margin.top]);

    var xAxis = d3.axisBottom()
                  .ticks(5)
                  .scale(xScale);

    var yAxis = d3.axisLeft()
                  .ticks(15)
                  .scale(yScale);

    // Total Municipal Solid Waste
    var line1 = d3.line()
                  .x(function(d) {return xScale(d.TimePeriod);})
                  .y(function(d) {return yScale(d.MSW);});

    var area1 = d3.area()
                  .x(function(d) {return xScale(d.TimePeriod) + 1;})
                  .y0(function() {return height;})
                  .y1(function(d) {return yScale(d.MSW);});

    // Total Municipal Solid Waste sent to Landfill
    var line2 = d3.line()
                  .x(function(d) {return xScale(d.TimePeriod);})
                  .y(function(d) {return yScale(d.MSWLandfill);});

    var area2 = d3.area()
                  .x(function(d) {return xScale(d.TimePeriod) + 1;})
                  .y0(function() {return height;})
                  .y1(function(d) {return yScale(d.MSWLandfill);});

    var tooltip = d3.select("#overview-vis")
                    .append("div")
                    .style("position", "absolute")
                    .style("visibility", "hidden")
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "1px")
                    .style("border-radius", "5px")
                    .style("padding", "10px");

    svg.append("g")
        .style("font-size","90%")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis);

    svg.append("g")
        .style("font-size","90%")
        .attr("transform", "translate(0, 0)")
        .call(yAxis);

    // Total Municipal Solid Waste

    // Line and area
    svg.append("path")
        .datum(data)
        .attr("class","line")
        .style("fill","white")
        .transition()                       // Quick transition for fade-in effect, repeated across other elements
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .attr("d",line1)
        .style("fill","none")
        .style("stroke","#76c893")
        .style("stroke-width","6");

    svg.append("path")
        .datum(data)
        .attr("class","area")
        .style("fill","white")
        .transition()
        .duration(1000)
        .attr("stroke-dashoffset", 0)
        .attr("d",area1)
        .style("fill","#b5e48c")
        .style("stroke-width","1");

    // Total Municipal Solid Waste sent to Landfill

    // Line and area
    svg.append("path")
        .datum(data)
        .attr("class","line")
        .style("fill","white")
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .attr("d",line2)
        .style("fill","none")
        .style("stroke","#5a5a5a")
        .style("stroke-width","6");

    svg.append("path")
        .datum(data)
        .attr("class","area")
        .style("fill","white")
        .transition()
        .duration(1000)
        .attr("stroke-dashoffset", 0)
        .attr("d",area2)
        .style("fill","#808080")
        .style("stroke-width","1");

    // Total Municipal Solid Waste

    // Adds dot points and interactivity
    svg.selectAll("myCircles")
        .data(data)
        .enter()
        .append("circle")
        .attr("fill","#3A8C57")
        .attr("cx", function(d) {return xScale(d.TimePeriod);})
        .attr("cy", function(d) {return yScale(d.MSW);})
        .attr("r",7)
        .on("mouseover", function(event, d) {
          var darkColor = d3.rgb(d3.select(this).attr("fill")).darker(1);
          d3.select(this).attr("fill",darkColor);
          var total = d.TotalMSW + " tonnes";
          tooltip.style("visibility","visible")
                  .html(total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                  .style("top", event.pageY + "px")
                  .style("left", (event.pageX + 20) + "px");
        })
        .on("mouseout", function(d) {
          d3.select(this).attr("fill","#76c893")
          svg.selectAll("#tooltip").remove();
          return (tooltip.style("visibility","hidden"));
        })
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1);

    // Total Municipal Solid Waste sent to Landfill

    // Adds dot points and interactivity
    svg.selectAll("myCircles")
        .data(data)
        .enter()
        .append("circle")
        .attr("fill","#5a5a5a")
        .attr("cx", function(d) {return xScale(d.TimePeriod);})
        .attr("cy", function(d) {return yScale(d.MSWLandfill);})
        .attr("r",7)
        .on("mouseover", function(event, d) {
          var darkColor = d3.rgb(d3.select(this).attr("fill")).darker(1);
          d3.select(this).attr("fill",darkColor);
          var total = d.TotalMSWLandfill + " tonnes";
          return (tooltip.style("visibility","visible")
                    .html(total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                    .style("top", event.pageY + "px")
                    .style("left", (event.pageX + 20) + "px"))
        })
        .on("mouseout", function(d) {
          d3.select(this).attr("fill","#5a5a5a")
          svg.selectAll("#tooltip").remove();
          return (tooltip.style("visibility","hidden"));
        })
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1);
  })

  // Legend
  var legend = svg.append("g")
                  .attr("class","legend")
                  .attr("transform","translate(0, 0)");

  legend.append("rect")
        .attr("x", width - 20)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", "#76c893")
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1);

  legend.append("rect")
        .attr("x", width - 20)
        .attr("y", 23)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", "#5a5a5a")
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1);

  legend.append("text")
        .attr("x", width - 28)
        .attr("y", 10)
        .attr("dy", ".35em")
        .style('font-weight','bold')
        .style("text-anchor", "end")
        .text("Recorded MSW")
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1);

  legend.append("text")
        .attr("x", width - 28)
        .attr("y", 33)
        .attr("dy", ".35em")
        .style('font-weight','bold')
        .style("text-anchor", "end")
        .text("MSW Sent to Landfill")
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1);

  // Graph captions
  var captions = svg.append("g")
                    .attr("class","amount")
                    .attr("transform","translate(0,0)");

  captions.append("text")
          .attr("x", -80)
          .attr("y", 5)
          .style("font-size","17.5px")
          .style("font-weight","bold")
          .text("Amount (mill tonnes)")
          .style("opacity", 0)
          .transition()
          .duration(1000)
          .style("opacity", 1);

  captions.append("text")
          .attr("x", width / 2.3)
          .attr("y", height + 50)
          .style("font-size","17.5px")
          .style("font-weight","bold")
          .text("Time Period")
          .style("opacity", 0)
          .transition()
          .duration(1000)
          .style("opacity", 1);
}

function subVis()
{
  var pageWidth = document.getElementById("overview-vis").clientWidth;  // width of page
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

  var start = (pageWidth - sW) / 2;

  d3.csv("dataset/personal-scatter.csv").then(function(data) {

    // Positions text
    d3.select('#scatter-text')
      .style("display","inline-block")
      .style("width",cD + "px")
      .style("position","relative")
      .style("top","90px")
      .style("left",(start + x1) + "px");

    var dataset = data;
    scatter(dataset, svg, cD, x1, tooltip);
  });

  d3.csv("dataset/personal-bar.csv").then(function(data) {

    // Positions text
    d3.select("#bar-text")
      .style("display","inline-block")
      .style("width",cD + "px")
      .style("position","relative")
      .style("top","70px")
      .style("left", (x2 - cD) + "px");  // Good enough for now

    var dataset = data;
    bar(dataset, svg, cD, x2, tooltip);
  });
}

function scatter(dataset, svg, cD, x1, tooltip)
{
  var padding = 40;

  var xScale = d3.scaleLinear()
    .domain([7, d3.max(dataset, function(d) {return (parseInt(d.Intensity) + 3);})])
    .range([(x1 + padding), (x1 + cD) - padding]);

  var yScale = d3.scaleLinear()
    .domain([500, d3.max(dataset, function(d) {return (parseInt(d.Expenditure) + 50);})])
    .range([cD - padding, (padding / 2) + 30]);

  var xAxis = d3.axisBottom()
    .ticks(6)
    .scale(xScale);

  var yAxis = d3.axisLeft()
    .ticks(5)
    .scale(yScale);

  svg.append("g")
      .attr("transform", "translate(0, " + (cD - padding - 15) + ")")
      .call(xAxis);

  svg.append("g")
      .attr("transform", "translate(" + (x1 + padding) + ", -15)")
      .call(yAxis);

  svg.selectAll("circle")
     .data(dataset)
     .enter()
     .append("circle")
     .attr("cx", function(d, i) {
         return xScale(d.Intensity);
     })
     .attr("cy", function(d) {
         return yScale(d.Expenditure) - padding / 2;
     })
     .attr("r", 5)
     .attr("height", function(d) {
         return d * 4;
     })
     .attr("fill", "#76c893")
     .on("mouseover", function(event, d) {
       var darkColor = d3.rgb(d3.select(this).attr("fill")).darker(0.5);
       d3.select(this).attr("fill",darkColor);
       return (tooltip.style("visibility","visible")
                 .html(
                   "<b>Expenditure:</b> $" + d.Expenditure + " million" + "</br>"
                   + "<b>Intensity:</b> " + d.Intensity + " tonnes per $mill"
                 )
                 .style("top", event.pageY + "px")
                 .style("left", (event.pageX + 20) + "px"));
     })
     .on("mouseout", function(d) {
       svg.selectAll("#tooltip").remove();
       var lightColor = d3.rgb(d3.select(this).attr("fill")).brighter(0.5);
       d3.select(this).attr("fill",lightColor)
       return (tooltip.style("visibility","hidden"));
     });

    // I didn't want to have to implement text this way, but I struggled to get the method shown in 1.6 to work.
    // Essentially appends iterates through each element (mapped to seperate arrays) and loads the corresponding
    // figure onto the page. Clunky, but functional.

    var intensity = dataset.map(function(d){return xScale(d.Intensity);});  // Maps X values to array
    var yData = dataset.map(function(d){return yScale(d.Expenditure);});  // Maps Y values to array
    var time = dataset.map(function(d){return d.TimePeriod;});

    for(i = 0; i < intensity.length; i++)
    {
       svg.append("text")
        .text(time[i])
        .attr("x", intensity[i] + 12)
        .attr("y", yData[i] - (padding / 2))
        .style("fill","#5a5a5a");
    }

    // Captions
    var captions = svg.append("g")
      .attr("transform","translate(0,0)");

    captions.append("text")
      .attr("x", x1 + 20)
      .attr("y", 20)
      .style("font-size","12.5px")
      .style("font-weight","bold")
      .text("Expenditure ($mill)");

    captions.append("text")
      .attr("x", x1 + 90)
      .attr("y", cD - (padding / 2))
      .style("font-size","12.5px")
      .style("font-weight","bold")
      .text("Waste Intensity (tonnes per $mill)");
}

function bar(dataset, svg, cD, x2, tooltip)
{
    var padding = 40;
    var year = dataset.map(function(d){return d.TimePeriod;});  // Maps X values to array for scale

    // Scales and axies
    var xScale = d3.scaleBand()
      .domain(dataset.map(function(d){return d.TimePeriod;}))
      .range([(x2 + padding), (x2 + cD) - padding])
      .padding(0.3);

    var yScale = d3.scaleLinear()
      .domain([3, d3.max(dataset, function(d) {return (parseInt(d.FoodWasted) + 0.5);})])
      .range([cD - padding, (padding / 2) + 30]);

    var xAxis = d3.axisBottom()
      .ticks(6)
      .scale(xScale);

    var yAxis = d3.axisLeft()
      .ticks(6)
      .scale(yScale);

    svg.append("g")
        .attr("transform", "translate(0, " + (cD - padding - 15) + ")") // Subtracts 15 to make room for captions
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(" + (x2 + padding) + ", -15)")
        .call(yAxis);

  // Bars
  var yRange = yScale.range();              // Acquires range
  var yHeight = yRange[0] - yRange[1];      // Calculates length of yAxis by subtracting start value from end value

  svg.selectAll(".rect")
    .data(dataset)
    .enter()
    .append("rect")
      .attr("x",function (d) {return xScale(d.TimePeriod)})
      .attr("y",function(d) {return yScale(d.FoodWasted) - 15}) // Subtracts 15 for padding reaons
      .attr("width",xScale.bandwidth())
      .attr("height",function(d){return yHeight - yScale(d.FoodWasted) + padding + 10}) // Adds 10 for padding reasons
      .attr("fill","#99d98c")
      .on("mouseover", function(event, d) {
        var darkColor = d3.rgb(d3.select(this).attr("fill")).darker(0.5);   // Darkens Color
        d3.select(this).attr("fill",darkColor);
      })
      .on("mousemove",function(event, d) {
        var total = d.TotalFoodWasted;
        return (tooltip.style("visibility","visible")
                  .html(total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " million tonnes") // Formats data
                  .style("top", event.pageY + "px")
                  .style("left", (event.pageX + 20) + "px"));
      })
      .on("mouseout", function(d) {
        svg.selectAll("#tooltip").remove();
        var lightColor = d3.rgb(d3.select(this).attr("fill")).brighter(0.5);  // Brightens color again
        d3.select(this).attr("fill",lightColor)
        return (tooltip.style("visibility","hidden"));
      });

  // Captions
  var captions = svg.append("g")
    .attr("transform","translate(0,0)");

  captions.append("text")
    .attr("x", x2 + 20)
    .attr("y", 20)
    .style("font-size","12.5px")
    .style("font-weight","bold")
    .text("Amount (mill tonnes)");

  captions.append("text")
    .attr("x", x2 + padding + 110)
    .attr("y", cD - (padding / 2))
    .style("font-size","12.5px")
    .style("font-weight","bold")
    .text("Time Period");
}

function init()
{
  main();         // Main visualisation
  subVis();       // Sub Visualisations
}

window.onload = init();
