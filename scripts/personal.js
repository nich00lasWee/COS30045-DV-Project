function graph() {
    var margin = {top: 25, right: 20, bottom: 75, left: 100};
    var width = 1500 - margin.left - margin.right;
    var height = 650 - margin.top - margin.bottom;

    var svg = d3.select('.overview-vis')
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("border", "2.5px solid #e3e3e3")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

window.onload = graph;