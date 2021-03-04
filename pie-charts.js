/**========================================================================
 *                               Pie Charts
 *========================================================================**/

// Sources used:
// - https://www.d3-graph-gallery.com/pie.html 

var svg_width = 800
width = 400
height = 400
margin = 40

var ndatapoints = 10
var ndatasets = 20

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#svgcontainer")
  .append("svg")
    .attr("width", svg_width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + svg_width / 2 + "," + height / 2 + ")");

// Create dummy data
d3.csv("https://raw.githubusercontent.com/mastlouis/03-experiment/Pie-Charts/data.csv", function(dataset){
    var random_idx = d3.randomInt(0, ndatasets-1)();
    build_pie(dataset, random_idx)
});


function build_pie(dataset, row_idx) {
    console.log('row index: ' + row_idx)
    var data = dataset[row_idx]

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .value(function(d) {return d.value; }).sort(null);
    var data_ready = pie(d3.entries(data))
    console.log(data_ready)
    
    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
    .selectAll('whatever')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
    )
    .attr('fill', 'white')
    .attr("stroke", "black")
    .style("stroke-width", "2px")

    var indicies = slices_to_compare(true)
    
}

function slices_to_compare(is_neighbor) {
    if (is_neighbor) {
        var random_idx = d3.randomInt(0,  ndatasets-1)();
        var other_idx = (random_idx + 1) % ndatasets
        return {random_idx, other_idx}
    }
}