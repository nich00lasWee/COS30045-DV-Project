// Method source: https://bl.ocks.org/mjfoster83/7c9bdfd714ab2f2e39dd5c09057a55a0
// Date retrieved: 7 June 2021

export function stackedBarChart() {

    // Properties for SVG
    var margin = {top: 25, right: 20, bottom: 75, left: 100};
    var width = 1500 - margin.left - margin.right;
    var height = 650 - margin.top - margin.bottom;

    // Ensure the bars scale relatively to dataset
    var x = v4.scaleBand().rangeRound([0, width]).paddingInner(0.1);
    var y = v4.scaleLinear().rangeRound([height, margin.top]);
    var color = v4.scaleOrdinal().range(["#b5e48c", "#99d98c", "#76c893"]);

    // Setup main SVG board
    var svg = v4.select('#recycle-overview')
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("border", "2.5px solid #e3e3e3")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    v4.csv("dataset/Recycle Data by Materials.csv", function(d, i, columns) {

        var total = 0;

        for (i = 1, total = 0; i < columns.length; i++) {
            total += +d[columns[i]];    // Calculate total amount for each bar
        }
        d.total = total;

        return d;

    }, function(error, data) {

        if (error) throw error;     // Exception handling

        var keys = data.columns.slice(1);   // Get years from dataset
        var wasteMaterials = data.map(function(d) { return d.Material; });  // Get material names from dataset

        // Initialise domain for the axes
        x.domain(wasteMaterials)
        y.domain([0, v4.max(data, function(d) { return d.total; })]);
        color.domain(keys);

        // X-axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(v4.axisBottom(x).tickSize(1))
            .selectAll("text")
            .style("font-size", "15")
            .style("text-anchor", "middle")
            .attr("dy", "2.25em")
            .call(wrap, x.bandwidth());  // Wrap label for x-axis

        // Y-axis
        svg.append("g")
            .attr("class", "y axis")
            .style('opacity','0')
            .call(v4.axisLeft(y))
            .append("text")
            .attr("id", "label")
            .style("font-size", "17.5")
            .attr("dx", "-.25em")
            .attr("dy", ".5em")
            .attr("fill", "#000")
            .style("font-weight", "bold")
            .style("text-anchor", "middle")
            .text("Amount (in tonnes)");

        // Transition effect for loading y-axis
        svg.select('.y.axis')
            .transition()
            .duration(500)
            .delay(1300)
            .style('opacity','1');

        // Initialise stacked bar chart
        var chart = svg.selectAll(".chart")
                        .append("g")
                        .data(v4.stack().keys(keys)(data))
                        .enter()
                        .append("g")
                        .attr("fill", function(d) { return color(d.key); })

        // Initialise tooltip
        var tooltip = v4.select("#recycle-overview")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("position", "absolute")
                        .style("visibility", "hidden")
                        .style("background-color", "rgba(255, 255, 255, 0.9)")
                        .style("border", "1px solid #d3d3d3")
                        .style("box-shadow", "0px 1.5px #d3d3d3")
                        .style("border-radius", "5px")
                        .style("padding", "10px");

        // Loads data into individual bars
        chart.selectAll("rect")
            .data(function(d) { return d; })
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.data.Material); })
            .attr("y", function(d) { return y(0); })    // 0 returned for y since transition effect is used
            .attr("height", function(d) { return height - y(0); })  // Same here for height
            .attr("width", x.bandwidth())
            .on("mousemove", function(d) {
                // Gets mouse pointer coordinate
                var xPosition = v4.event.pageX + 20;
                var yPosition = v4.event.pageY - 10;

                // Store the keys and values from the data into variables
                // Resource: https://www.freecodecamp.org/news/javascript-object-keys-tutorial-how-to-use-a-js-key-value-pair/
                // Date retrieved: 9 June 2021
                let key = Object.keys(d.data);
                let val = Object.values(d.data);

                let year = "";
                var value = d[1] - d[0];    // Value of the bar area hovered

                // Returns the year of the bar area hovered
                for (var i = 1; i < key.length - 1; i++) {
                    if (val[i] == value) year += key[i];
                }

                // Shows the tooltip (next to mouse pointer)
                tooltip.style("visibility", "visible")
                        .html("<b>" + year + "</b><br/>Amount: " + value.toLocaleString())
                        .style("top", yPosition + "px")
                        .style("left", xPosition + "px");
            })
            .on("mouseout", function() {
                return tooltip.style("visibility", "hidden");   // Hides tooltip when bars are not in focus
            });

        // Transition effect for loading the bars
        chart.selectAll("rect")
            .transition()
            .delay(function(d, i){
                return i * 100;
            })
            .duration(1000)
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })

        // Initialise legend on the top-right corner of the svg
        var legend = svg.append("g")
                        .style('font-weight','bold')
                        .attr("text-anchor", "end")
                        .selectAll("g")
                        .data(keys.slice().reverse())
                        .enter()
                        .append("g")
                        .attr("transform", function(d, i) { return "translate(0," + i * 22 + ")"; })
                        .style("opacity","0");

        // Legend colours
        legend.append("rect")
                .attr("x", width - 20)
                .attr("width", 20)
                .attr("height", 20)
                .style("padding", 10)
                .attr("fill", color);

        // Legend labels
        legend.append("text")
                .attr("x", width - 28)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(function(d) { return d; });

        // Transition effect for loading legend
        legend.transition()
                .duration(500)
                .delay(function(d, i){
                    return 1300 + 100 * i;
                })
                .style("opacity","1");

        // Scale factor
        var scale = [1, 4, 8, 16, 32, 48];
        var scaleIndex = 0;
        var labelY = 0.5;   // Y-coordinate for Y-axis label
        var offset = 3;

        var total = v4.max(data, function(d) { return d.total; })

        // Scale the bars when zoom in button is clicked
        v4.select("#zoom-in").on("click", function() {
            if (scaleIndex != scale.length - 1) {
                scaleIndex++;
                labelY -= offset;
                y.domain([0, total / scale[scaleIndex]]);
            }

            // Updates y-axis
            svg.select(".y.axis")
                .transition()
                .duration(500)
                .call(v4.axisLeft(y))
                .select("#label")
                .attr("dy", labelY + "em");

            // Update bars height
            chart.selectAll("rect")
                .transition()
                .duration(500)
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        });

        // Scale the bars when zoom out button is clicked
        v4.select("#zoom-out").on("click", function() {
            if (scaleIndex != 0) {
                scaleIndex--;
                labelY += offset;
                y.domain([0, total / scale[scaleIndex]]);
            }

            svg.select(".y.axis")
                .transition()
                .duration(500)
                .call(v4.axisLeft(y))
                .select("#label")
                .attr("dy", labelY + "em");

            chart.selectAll("rect")
                .transition()
                .duration(500)
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        });
    })
}

// Method source: https://bl.ocks.org/mbostock/7555321
// from: https://stackoverflow.com/questions/24784302/wrapping-text-in-d3

function wrap(text, width) {
    text.each(function() {
      var text = v4.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.2, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
}
