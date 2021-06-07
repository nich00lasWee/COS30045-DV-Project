function init()
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

window.onload = init();
