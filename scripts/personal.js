function main()
{
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

    var dataset = data;
    var xData = dataset.map(function(d){return d.TimePeriod;});

    var xScale = d3.scalePoint()
      .domain(xData)
      .range([0,width-75]);

    var yScale = d3.scaleLinear()
      .domain([3, d3.max(dataset, function(d) {return (parseInt(d.MSW) + 2);})])
      .range([height, margin.top]);

    var xAxis = d3.axisBottom()
      .ticks(5)
      .scale(xScale);

    var yAxis = d3.axisLeft()
      .ticks(15)
      .scale(yScale);

    var line1 = d3.line()
      .x(function(d) {return xScale(d.TimePeriod);})
      .y(function(d) {return yScale(d.MSW);});

    var area1 = d3.area()
      .x(function(d) {return xScale(d.TimePeriod) + 1;})
      .y0(function() {return height;})
      .y1(function(d) {return yScale(d.MSW);});

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

    svg.append("path")
      .datum(dataset)
      .attr("class","line")
      .attr("d",line1)
      .style("fill","none")
      .style("stroke","#76c893")
      .style("stroke-width","6");

    svg.append("path")
      .datum(dataset)
      .attr("class","area")
      .attr("d",area1)
      .style("fill","#b5e48c")
      .style("stroke-width","1");

    svg.append("path")
      .datum(dataset)
      .attr("class","line")
      .attr("d",line2)
      .style("fill","none")
      .style("stroke","#5a5a5a")
      .style("stroke-width","6");

    svg.append("path")
      .datum(dataset)
      .attr("class","area")
      .attr("d",area2)
      .style("fill","#808080")
      .style("stroke-width","1");

    svg.selectAll("myCircles")
      .data(dataset)
      .enter()
      .append("circle")
        .attr("fill","#76c893")
        .attr("cx", function(d) {return xScale(d.TimePeriod);})
        .attr("cy", function(d) {return yScale(d.MSW);})
        .attr("r",7)
      .on("mouseover", function(event, d) {
        var darkColor = d3.rgb(d3.select(this).attr("fill")).darker(1);
        d3.select(this).attr("fill",darkColor);
        var total = d.TotalMSW + " tonnes";
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

    svg.selectAll("myCircles")
      .data(dataset)
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
      });
  })

  var legend = svg.append("g")
    .attr("class","legend")
    .attr("transform","translate(0, 0)");

  legend.append("rect")
    .attr("x", width - 20)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", "#76c893");

  legend.append("rect")
    .attr("x", width - 20)
    .attr("y", 23)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", "#5a5a5a");

  legend.append("text")
    .attr("x", width - 28)
    .attr("y", 10)
    .attr("dy", ".35em")
    .style('font-weight','bold')
    .style("text-anchor", "end")
    .text("Recorded MSW");

  legend.append("text")
    .attr("x", width - 28)
    .attr("y", 33)
    .attr("dy", ".35em")
    .style('font-weight','bold')
    .style("text-anchor", "end")
    .text("MSW Sent to Landfill");

  var captions = svg.append("g")
    .attr("class","amount")
    .attr("transform","translate(0,0)");

  captions.append("text")
    .attr("x", -80)
    .attr("y", 5)
    .style("font-size","17.5px")
    .style("font-weight","bold")
    .text("Amount (mill tonnes)");

  captions.append("text")
    .attr("x", width / 2.3)
    .attr("y", height + 50)
    .style("font-size","17.5px")
    .style("font-weight","bold")
    .text("Time Period");
}

function subVis()
{
  var pageWidth = document.getElementById("overview-vis").clientWidth;
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

    d3.select("#bar-text")
      .style("display","inline-block")
      .style("width",cD + "px")
      .style("position","relative")
      .style("top","70px")
      .style("left", (start * 2.09) + "px");  // Good enough for now

    var dataset = data;
    bar(dataset, svg, cD, x2, tooltip);
  });
}

function scatter(dataset, svg, cD, x1, tooltip)
{
  var padding = 40;
  var xData = dataset.map(function(d){return d.TimePeriod;});  // Maps X values to array for scale

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
         return yScale(d.Expenditure);
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

    // I didn't want to have to implement text this way, but I struggled to get the method shown in 1.6 to work
    var xData = dataset.map(function(d){return xScale(d.Intensity);});  // Maps X values to array
    var yData = dataset.map(function(d){return yScale(d.Expenditure);});  // Maps Y values to array
    var time = dataset.map(function(d){return d.TimePeriod;});

    for(i = 0; i < xData.length; i++)
    {
       svg.append("text")
        .text(time[i])
        .attr("x", xData[i] + 12)
        .attr("y", yData[i])
        .style("fill","#5a5a5a");
    }

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
    console.log(dataset);

    var padding = 40;
    var xData = dataset.map(function(d){return d.TimePeriod;});  // Maps X values to array for scale

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
        .attr("transform", "translate(0, " + (cD - padding - 15) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(" + (x2 + padding) + ", -15)")
        .call(yAxis);

  console.log(dataset[0]);
  var yRange = yScale.range();
  var yHeight = yRange[0] - yRange[1];
  console.log(yHeight);

  svg.selectAll(".rect")
    .data(dataset)
    .enter()
    .append("rect")
      .attr("x",function (d) {return xScale(d.TimePeriod)})
      .attr("y",function(d) {return yScale(d.FoodWasted) - 15})
      .attr("width",xScale.bandwidth())
      .attr("height",function(d){return yHeight - yScale(d.FoodWasted) + padding + 10})
      .attr("fill","#99d98c")
      .on("mouseover", function(event, d) {
        var darkColor = d3.rgb(d3.select(this).attr("fill")).darker(0.5);
        d3.select(this).attr("fill",darkColor);
      })
      .on("mousemove",function(event, d) {
        var total = d.TotalFoodWasted;
        return (tooltip.style("visibility","visible")
                  .html(total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " million tonnes")
                  .style("top", event.pageY + "px")
                  .style("left", (event.pageX + 20) + "px"));
      })
      .on("mouseout", function(d) {
        svg.selectAll("#tooltip").remove();
        var lightColor = d3.rgb(d3.select(this).attr("fill")).brighter(0.5);
        d3.select(this).attr("fill",lightColor)
        return (tooltip.style("visibility","hidden"));
      });

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
  main();
  subVis();
}

window.onload = init();
