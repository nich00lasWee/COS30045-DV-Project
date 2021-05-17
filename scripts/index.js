function pieChart(dataset, cD, svg) {    // waste production of each sector 2018-2019 (in tonnes)

  var outerRadius = cD / 2.3;  // reduces size of chart
  var innerRadius = 0;

  var padding = cD / 15.07826086956522; // acheives equal spacing

  var sectors = dataset.map(function(d) {return d.Sector;});



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

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  arcs.append("path")
      .attr("fill",function(d, i) {
          return color(i);
      })
      .attr("d", function(d, i) {
          return arc(d, i);
      })
      .on("mouseover", function(event, d, i) {


        console.log(d3.select());

        var text;

          for(j = 0; j < dataset.length; j++)
            if(dataset[j].WasteProduced != d.value) {
              console.log(dataset[j].Sector);
              console.log(d.value);
              text = "f";
            }


        svg.append("text")
          .attr("id","tooltip")
          .attr("x", 20)
          .attr("y", 20)
          .attr("text", text);
        })

      .on("mouseout", function(d) {
        svg.selectAll("#tooltip").remove();
      });

  svg.append("text")
    .attr("x", 5)
    .attr("y", (cD + 30))
    .style("font-size", "0.75vw")
    .style("font-style","italic")
    .text("Waste production by industry, 2018 - 2019 (tonnes)");
}

function lineChart(dataset, svg, sW, cD, x2, padding) { // Plastic production per year, 2016 - 2019 (millions of tonnes)

  var xData = dataset.map(function(d){return d.TimePeriod;});  // Maps X values to array for scale

  var xScale = d3.scalePoint()  // Took a while to realise: had to feed an array into this scale for it to work correctly
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
    .style("fill","slategrey")
    .style("stroke","slategrey")
    .style("stroke-width","1");

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

  svg.append("text")
    .attr("x", x2)
    .attr("y", (cD + 30))
    .style("font-size", "0.75vw")
    .style("font-style","italic")
    .text("Plastic waste production, 2016 - 2019 (per million tonnes)");
}

function bubbleChart(svg, sW, cD) {
  // Will be implemented later
}

function init() {

  var sW = document.getElementById('sub-vis').clientWidth;  // Width changes depending on monitor used - this ensures correct value is fetched
  var cD = 0.25 * sW;  // Each chart is allocated 25% of svg Width - remainder is used for gaps between

  console.log(cD);

  var svg = d3.selectAll("#sub-vis")
    .append("svg")
    .attr("viewBox","0, 0 " + sW + " " + (cD + 50));

    svg.append("rect")
      .attr("x", 1)
      .attr("y", 1)
      .attr("width", cD - 1)
      .attr("height", cD - 1); // prevents svg from clipping rectangle

  var temp = (sW - cD); // determines box location depending on svg width (as set by div)
  var x2 = temp / 2;   // calculates x coordinate by finding middle point of temp
  var padding = 40;

  svg.append("rect")
    .attr("x", x2)
    .attr("y", 1)
    .attr("width", cD - 1)
    .attr("height", cD - 1); // prevents svg from clipping rectangle

  svg.append("rect")
    .attr("x", temp)
    .attr("y", 1)
    .attr("width", cD - 1)
    .attr("height", cD - 1); // prevents svg from clipping rectangle

  svg.selectAll("rect")
    .style("fill","white")
    .style("stroke","black")
    .style("stroke-width","1.5");

  d3.csv("dataset/pieChart.csv").then(function(data) {
    console.log(data);
    var dataset = data;
    pieChart(dataset, cD, svg);
  })

  d3.csv("dataset/lineChart.csv").then(function(data) {
    console.log(data);
    var dataset = data;
    lineChart(dataset, svg, sW, cD, x2, padding);  // forgive the amount of parameters, I'll condense this later
 })

//  bubbleChart(svg, sW, cD);
}

window.onload = init;
