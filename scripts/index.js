function pieChart(dataset, cD, svg, x1, tooltip) {    // waste production of each sector 2018-2019 (in tonnes)

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

    .attr("transform","translate(" + (outerRadius + padding + x1) + "," + (outerRadius + padding) + ")");  // position in center of rectangle

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
    .domain([2, d3.max(dataset, function(d) {return (parseInt(d.PlasticWaste) + 0.4);})])
    .range([cD - padding, (padding / 2) + 30]);

  var line = d3.line()
    .x(function(d) {return xScale(d.TimePeriod);})
    .y(function(d) {return yScale(d.PlasticWaste)});

  var area = d3.area()
    .x(function(d) {return xScale(d.TimePeriod);})
    .y0(function() {return (cD - padding) - 15;})
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
      .attr("transform", "translate(0, " + (cD - padding - 15) + ")")
      .call(xAxis);

  svg.append("g")
      .attr("transform", "translate(" + (x2 + padding) + ", -15)")
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
      var darkColor = d3.rgb(d3.select(this).attr("fill")).darker(0.5);
      d3.select(this).attr("fill",darkColor);
      var total = d.TotalWaste + " tonnes";
      return (tooltip.style("visibility","visible")
                .html(total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                .style("top", event.pageY + "px")
                .style("left", (event.pageX + 20) + "px"))
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

function init() {

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

  d3.csv("dataset/pieChart.csv").then(function(data) {

    // Currently lacks responsiveness
    d3.select('#pie-text')
      .style("display","inline-block")
      .style("width",cD + "px")
      .style("position","relative")
      .style("top","60px")
      .style("left",(start + x1) + "px");

    var dataset = data;
    pieChart(dataset, cD, svg, x1, tooltip);
  })

  d3.csv("dataset/lineChart.csv").then(function(data) {

    d3.select("#area-text")
      .style("display","inline-block")
      .style("width",cD + "px")
      .style("position","relative")
      .style("top","90px")
      .style("left", (x2 - cD) + "px");  // Good enough for now

    var dataset = data;
    lineChart(dataset, svg, sW, cD, x2, padding, tooltip);  // forgive the amount of parameters, I'll condense this later
 })
}

window.onload = init;
