function pieChart(dataset, cD, svg, tooltip) {    // waste production of each sector 2018-2019 (in tonnes)

  var outerRadius = cD / 2.3;  // reduces size of chart
  var innerRadius = 0;
  var padding = cD / 15.07826086956522; // acheives equal spacing

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
    .attr("transform","translate(" + (outerRadius + padding) + "," + (outerRadius + padding) + ")");  // position in center of rectangle

  // Likely to change later
  var color = d3.scaleOrdinal()
      .range(["#487f82",
          "#4bada1",
          "#4cb48f",
          "#61b876",
          "#82bb57",
          "#a8b935",
          "#d2b30f",
          "#ffa600"]);

  var path = arcs.append("path")
      .attr("fill",function(d, i) {
          return color(i);
      })
      .attr("d", function(d, i) {
          return arc(d, i);
      });

  path.on("mouseover", function(event, d, i) {
    var darkColor = d3.rgb(d3.select(this).attr("fill")).darker(0.5);
    d3.select(this).attr("fill",darkColor);
  })
  .on("mousemove", function(event, d) {
    var sector;
    var waste;

    for(j = 0; j < dataset.length; j++)
      if(dataset[j].WasteProduced == d.value)
      {
        sector = dataset[j].Sector;
        waste = d.value + " tonnes";
      }

    var coordinates = d3.pointer(event);
    return (tooltip.style("visibility","visible")
              .html("<b>" + sector + "</b>" + "<br>" + waste.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
              .style("top", event.pageY + "px")
              .style("left", (event.pageX + 20) + "px")
              );
  })
  .on("mouseout", function(d) {
    svg.selectAll("#tooltip").remove();
    var lightColor = d3.rgb(d3.select(this).attr("fill")).brighter(0.5);
    d3.select(this).attr("fill",lightColor)
    return (tooltip.style("visibility","hidden"));
  });
}

function lineChart(dataset, svg, sW, cD, x2, padding, tooltip) { // Plastic production per year, 2016 - 2019 (millions of tonnes)

  var xData = dataset.map(function(d){return d.TimePeriod;});  // Maps X values to array for scale

  var xScale = d3.scalePoint()
    .domain(xData)
    .range([(x2 + padding), (x2 + cD) - padding]);

  var yScale = d3.scaleLinear()
    .domain([2, d3.max(dataset, function(d) {console.log(parseInt(d.PlasticWaste)); return (parseInt(d.PlasticWaste) + 0.4);})])
    .range([cD - padding, padding / 2]);

  var line = d3.line()
    .x(function(d) {return xScale(d.TimePeriod);})
    .y(function(d) {return yScale(d.PlasticWaste)});

  var area = d3.area()
    .x(function(d) {return xScale(d.TimePeriod);})
    .y0(function() {return (cD - padding);})
    .y1(function(d) {return yScale(d.PlasticWaste);});

  svg.append("path")
    .datum(dataset)
    .attr("class","area")
    .attr("d",area)
    .style("fill","#b5e48c")
    .style("stroke-width","1");

  svg.append("path")
    .datum(dataset)
    .attr("class","line")
    .attr("d",line)
    .style("fill","none")
    .style("stroke","#76c893")
    .style("stroke-width","3");

  var xAxis = d3.axisBottom()
    .ticks(4)
    .scale(xScale);

  var yAxis = d3.axisLeft()
    .ticks(5)
    .scale(yScale);

  svg.append("g")
      .attr("transform", "translate(0, " + (cD - padding) + ")")
      .call(xAxis);

  svg.append("g")
      .attr("transform", "translate(" + (x2 + padding) + ", 0)")
      .call(yAxis);

  svg.selectAll("myCircles")
    .data(dataset)
    .enter()
    .append("circle")
      .attr("fill","#3A8C57")
      .attr("cx", function(d) {return xScale(d.TimePeriod);})
      .attr("cy", function(d) {return yScale(d.PlasticWaste);})
      .attr("r",4.5)
    .on("mouseover", function(event, d) {
      var total = d.TotalWaste + " tonnes";
      return (tooltip.style("visibility","visible")
                .html(total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                .style("top", event.pageY + "px")
                .style("left", (event.pageX + 20) + "px"))
    })
    .on("mouseout", function(d) {
      svg.selectAll("#tooltip").remove();
      return (tooltip.style("visibility","hidden"));
    });
}

function bubbleChart(svg, sW, cD) {
  // Will be implemented later
}

function init() {

  var pageWidth = document.getElementById("overview-vis").clientWidth;
  var sW = (pageWidth / 100) * 57.38332058148432;
  var cD = 0.25 * sW;                                             // Each chart is allocated 25% of svg Width - remainder is used for gaps between

  var svg = d3.selectAll("#sub-vis")
    .append("svg")
    .attr("viewBox","0, 0, " + sW + ", " + (cD + 50));

  svg.append("rect")
    .attr("x", 1)
    .attr("y", 1)
    .attr("width", cD)
    .attr("height", cD - 1);  // prevents svg from clipping rectangle

  var temp = (sW - cD);       // determines box location depending on svg width (as set by div)
  var x2 = temp / 2;          // calculates x coordinate by finding middle point of temp
  var padding = 40;

  svg.append("rect")
    .attr("x", x2)
    .attr("y", 1)
    .attr("width", cD - 1)
    .attr("height", cD - 1);

  svg.append("rect")
    .attr("x", temp)
    .attr("y", 1)
    .attr("width", cD - 1)
    .attr("height", cD - 1);  // prevents svg from clipping rectangle

  svg.selectAll("rect")
    .style("fill","white")
    .style("stroke","black")
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

  d3.csv("dataset/pieChart.csv").then(function(data) {

    // Currently lacks responsiveness
    d3.select('#pie-text')
      .style("display","inline-block")
      .style("width",cD + "px")
      .style("position","relative")
      .style("top","100px")
      .style("left",((pageWidth - 1500) / 2) + "px");

    var dataset = data;
    pieChart(dataset, cD, svg, tooltip);
  })

  d3.csv("dataset/lineChart.csv").then(function(data) {

    d3.select("#area-text")
      .style("display","inline-block")
      .style("width",cD + "px")
      .style("position","relative")
      .style("top","100px")
      .style("left", (cD * 1.95) + "px");

    var dataset = data;
    lineChart(dataset, svg, sW, cD, x2, padding, tooltip);  // forgive the amount of parameters, I'll condense this later
 })

//  bubbleChart(svg, sW, cD);
}

window.onload = init;
