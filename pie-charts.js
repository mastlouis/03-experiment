/**========================================================================
 *                               Pie Charts
 *========================================================================**/

// Sources used:
// - https://www.d3-graph-gallery.com/pie.html 
// - https://www.geeksforgeeks.org/how-to-shuffle-an-array-using-javascript/

var svg_width = 800
var width = 400
var height = 400
var margin = 40

var radius = Math.min(width, height) / 2 - margin // pie radius

var ndatapoints = 10
var ndatasets = 20

// for shuffling the order the pie charts are shown in the survey
var shuffled_dataset_idxs = shuffle([...Array(ndatasets).keys()])
console.log('shuffled dataset indices', shuffled_dataset_idxs)
var current_shuffled_data_idx = 0 // the current index in the shuffled datasets idxs array


// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#svgcontainer")
  .append("svg")
    .attr("width", svg_width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + svg_width / 2 + "," + height / 2 + ")");

commence_pies()


// Create dummy data
function commence_pies() {
    if (current_shuffled_data_idx == ndatasets) {
        document.getElementById('next_pie_btn').innerText = 'No more pies'
    }

    d3.csv("https://raw.githubusercontent.com/mastlouis/03-experiment/Pie-Charts/data.csv", function(dataset){
        // var random_idx = d3.randomInt(0, ndatasets-1)();
        build_pie(dataset, shuffled_dataset_idxs[current_shuffled_data_idx], false)
        current_shuffled_data_idx++
    });
}


function build_pie(dataset, row_idx, compare_neighbors) {
    console.log('row index: ' + row_idx)
    var data = dataset[row_idx]

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .value(function(d) {return d.value; }).sort(null);
    var data_ready = pie(d3.entries(data))
    console.log('data', data_ready)

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
    
    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('slices')
        .data(data_ready)
        .enter()
        .append('path')
            .attr('d', arcGenerator)
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            // .style("opacity", 0.7)
        // .attr('d', d3.arc()
        //     .innerRadius(0)
        //     .outerRadius(radius)
        // )
        .attr('fill', 'white')
        .attr("stroke", "black")
        .style("stroke-width", "1px")

    var indicies = slices_to_compare(compare_neighbors)
    // console.log('indicies', indicies)

    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function(d){ 
            // console.log('key', d.data.key, 'random', indicies.random_idx, 'other', indicies.other_idx)
            // console.log(parseInt(d.data.key) == indicies.random_idx)
            // console.log(parseInt(d.data.key) == indicies.other_idx)
            // console.log(indicies.other_idx)
            if(parseInt(d.data.key) == indicies.random_idx || parseInt(d.data.key) == indicies.other_idx) {
                // console.log('true')
                return '.' 
            }
        })
        .attr("transform", function(d) { 
            let coords = arcGenerator.centroid(d)
            // coords[0] += 5
            // return "translate(" + arcGenerator.centroid(d) + ")";  })
            return "translate(" + coords + ")";  })
        // .style("text-anchor", "right")
        .style("font-size", 40)
}

function slices_to_compare(is_neighbor) {
    var random_idx = d3.randomInt(0, ndatapoints-1)()
    var other_idx

    if (is_neighbor) {
        other_idx = (random_idx + 1) % ndatapoints
    }
    else {
        other_idx = (random_idx + d3.randomInt(2, ndatapoints - 2)()) % ndatapoints
    }
    // console.log('random', random_idx, 'other', other_idx)
    return {random_idx, other_idx}
}



function shuffle(array) { 
   for (var i = array.length - 1; i > 0; i--) {  
       // Generate random number  
       var j = Math.floor(Math.random() * (i + 1)); 
                    
       var temp = array[i]; 
       array[i] = array[j]; 
       array[j] = temp; 
   } 
        
   return array; 
} 