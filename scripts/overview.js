function groupedBarGraph() {

  var w = 950;
  var h = 450;

  var svg = d3.select("#overview-vis")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .style("background-color", "grey")
              //.append("g")
              //.attr("transform", "translate(10, 10)");

  // doesn't work with waste material data atm, need more research on original codebase
  d3.csv("../dataset/Waste Materials by Category.csv").then(function(data) {
    
    // var subgroups = data.columns.slice();

    // var groups = d3.map(data, function(d) {return d.group}).keys();

    // var x = d3.scaleBand()
    //           .domain(groups)
    //           .range([0, w])
    //           .padding([0.2]);

    // svg.append("g")
    //     .attr("transform", "translate(0," + h + ")")
    //     .call(d3.axisBottom(x)
    //             .tickSize(0));

    // var y = d3.scaleLinear()
    //           .domain([0, 40])
    //           .range([ h, 0 ]);

    // svg.append("g")
    //     .call(d3.axisLeft(y));

    // var xSubgroup = d3.scaleBand()
    //                   .domain(subgroups)
    //                   .range([0, x.bandwidth()])
    //                   .padding([0.05]);

    // // color palette = one color per subgroup
    // var color = d3.scaleOrdinal()
    //               .domain(subgroups)
    //               .range(['#e41a1c','#377eb8','#4daf4a','#e41a1c','#377eb8','#4daf4a','#e41a1c','#377eb8','#4daf4a','#e41a1c']);

    // svg.append("g")
    //   .selectAll("g")
    //   // Enter in data = loop group per group
    //   .data(data)
    //   .enter()
    //   .append("g")
    //   .attr("transform", function(d) {
    //     return "translate(" + x(d.group) + ",0)";
    //   })
    //   .selectAll("rect")
    //   .data(function(d) {
    //     return subgroups.map(function(key) { 
    //       return {key: key, value: d[key]};
    //     });
    //   })
    //   .enter()
    //   .append("rect")
    //   .attr("x", function(d) {
    //     return xSubgroup(d.key);
    //   })
    //   .attr("y", function(d) {
    //     return y(d.value);
    //   })
    //   .attr("width", xSubgroup.bandwidth())
    //   .attr("height", function(d) {
    //     return h - y(d.value);
    //   })
    //   .attr("fill", function(d) {
    //     return color(d.key);
    //   });

  })
}

window.onload = groupedBarGraph();
