/**========================================================================
 *                               Pie Charts
 *========================================================================**/

// Sources used:
// - https://www.d3-graph-gallery.com/pie.html 
// - https://www.geeksforgeeks.org/how-to-shuffle-an-array-using-javascript/







// TODO
// return json object with correct answer










var svg_width = 800
var width = 400
var height = 400
var margin = 40

var radius = Math.min(width, height) / 2 - margin // pie radius

var ndatapoints = 10
var ndatasets = 20

var num_chart = 0 // the current index in the shuffled datasets idxs array


// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#svgcontainer")
    .append("svg")
    .attr("width", svg_width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + svg_width / 2 + "," + height / 2 + ")");

commence_pies()


function commence_pies() {
    if (num_chart == ndatasets) {
        document.getElementById('next_pie_btn').innerText = 'Click for optional pie charts'
    }

    // d3.csv("https://raw.githubusercontent.com/mastlouis/03-experiment/Pie-Charts/data.csv", function (dataset) {
    let dataset = gen_data()
    // var random_idx = d3.randomInt(0, ndatasets-1)();
    build_pie(dataset)
    num_chart++
    // });
}


function gen_data() {
    // random.seed(9)

    ndatapoints = 10
    // ndatasets = 20

    // d = pd.DataFrame(np.zeros((ndatasets, ndatapoints)))

    let d = []
    // i = 0
    let valid_dataset = false
    while (!valid_dataset) {
        // # print('new one')
        var sum = 0
        for (var i = 0; i < ndatapoints; i++) {
            d[i] = Math.random()
            sum += d[i]
        }

        // normalize
        // s = sum(d.loc[i])
        for (var j = 0; j < ndatapoints; j++) {
            d[j] = d[j] / sum * 100
        }
        let valid = true
        for (var i = 0; i < ndatapoints; i++) {
            if (d[i] < 3 || d[i] > 39) {
                valid = false
                // # print('min or max')
                // break
            }
            for (let k = 0; k < ndatapoints; k++) {
                if (k != i && Math.abs(d[i] - d[k]) < .1) {
                    valid = false
                    // # print('less than 0.1 diff')
                    // break
                }
            }

        }
        valid_dataset = valid
    }
    return d
}



function build_pie(data) {
    // console.log('row index: ' + row_idx)
    // var data = dataset[row_idx]

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .value(function (d) { return d.value; }).sort(null);
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

    var indicies = slices_to_compare()
    // console.log('indicies', indicies)

    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function (d) {
            // console.log('key', d.data.key, 'random', indicies.random_idx, 'other', indicies.other_idx)
            // console.log(parseInt(d.data.key) == indicies.random_idx)
            // console.log(parseInt(d.data.key) == indicies.other_idx)
            // console.log(indicies.other_idx)
            if (parseInt(d.data.key) == indicies.random_idx || parseInt(d.data.key) == indicies.other_idx) {
                // console.log('true')
                return '.'
            }
        })
        .attr("transform", function (d) {
            let coords = arcGenerator.centroid(d)
            // coords[0] += 5
            // return "translate(" + arcGenerator.centroid(d) + ")";  })
            return "translate(" + coords + ")";
        })
        // .style("text-anchor", "right")
        .style("font-size", 40)
}

function slices_to_compare() {
    var random_idx = d3.randomInt(0, ndatapoints - 1)()
    var other_idx = (random_idx + d3.randomInt(1, ndatapoints - 2)()) % ndatapoints

    // console.log('random', random_idx, 'other', other_idx)
    return { random_idx, other_idx }
}


function build_barchart(data) {
    let numBars = 10
    let row = 1
    let max = 25

    // d3.csv("https://raw.githubusercontent.com/mastlouis/03-experiment/Bar-Charts/dots.csv", function (dots) {
    let markedBar1 = dots[row][0]
    let markedBar2 = dots[row][1]

    // X axis
    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function (d) { return d.columns; }))
        .padding(0.2);

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, max])
        .range([height, 0]);

    // plain lines for axes - no ticks or numbers 
    svg.append('line')
        .attr('x1', 0)
        .attr('y1', height)
        .attr('x2', 0)
        .attr('y2', 0)
        .attr('stroke', 'black')
        .attr('id', 'yAxis')
    svg.append('line')
        .attr('x1', 0)
        .attr('y1', height)
        .attr('x2', width)
        .attr('y2', height)
        .attr('stroke', 'black')
        .attr('id', 'xAxis')

    // Bars
    let interval = width / numBars / 10
    let barWidth = width / numBars / 5 * 4
    for (let i = 0; i < numBars; i++) {
        svg.append('rect')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('x', i * (interval * 2 + barWidth) + interval)
            .attr('y', y(data[row][i]))
            .attr('height', height - y(data[row][i]))
            .attr('width', barWidth)
        if (i == markedBar1 || i == markedBar2) {
            svg.append('circle')
                .attr('r', barWidth / 8)
                .attr('cy', height - interval * 2)
                .attr('cx', i * (interval * 2 + barWidth) + interval + barWidth / 2)
        }
    }
}