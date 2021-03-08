/**========================================================================
 *                               Charts
 *========================================================================**/


var margin = { top: 20, right: window.innerWidth / 10, bottom: 80, left: window.innerWidth / 10, radius: 40 },
    width = window.innerWidth - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg_width = width

var radius = Math.min(width, height) / 2 - margin.radius // pie radius

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#svgcontainer")
    .append("svg")
    .attr("width", svg_width)
    .attr("height", height)
    .append("g")

// NOTE: the upper limit for number of datapoints is 17, otherwise it takes too long to generate the random data
// build_pie(gen_data(10))
// build_barchart(gen_data(10))
build_spiral_barchart(gen_data(17)) 


function gen_data(ndatapoints) {
    let d = []
    let valid_dataset = false

    while (!valid_dataset) {
        var sum = 0
        for (var i = 0; i < ndatapoints; i++) {
            d[i] = Math.random()
            sum += d[i]
        }

        for (var j = 0; j < ndatapoints; j++) {
            d[j] = d[j] / sum * 100
        }
        let valid = true
        for (var i = 0; i < ndatapoints; i++) {
            if (d[i] < 3 || d[i] > 39) {
                valid = false
            }
            for (let k = 0; k < ndatapoints; k++) {
                if (k != i && Math.abs(d[i] - d[k]) < .1) {
                    valid = false
                }
            }
        }
        valid_dataset = valid
    }
    return d
}



function build_pie(data) {

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .value(function (d) { return d.value; }).sort(null);
    var data_ready = pie(d3.entries(data))

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
        .attr('fill', 'white')
        .attr("stroke", "black")
        .style("stroke-width", "1px")
        .attr("transform", "translate(" + svg_width / 2 + "," + height / 2 + ")");


    var indices = indices_to_compare(data.length)

    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function (d) {
            if (parseInt(d.data.key) == indices.random_idx || parseInt(d.data.key) == indices.other_idx) {
                return '.'
            }
        })
        .attr("transform", function (d) {
            let coords = arcGenerator.centroid(d)
            return "translate(" + (coords[0] + svg_width / 2) + ',' + (coords[1] + height / 2) + ")";
        })
        .style("font-size", 40)
        
    return {data, indices}
}

function indices_to_compare(ndatapoints) {
    var random_idx = d3.randomInt(0, ndatapoints - 1)()
    var other_idx = (random_idx + d3.randomInt(1, ndatapoints - 1)()) % ndatapoints
    return { random_idx, other_idx }
}


function build_barchart(data) {

    let numBars = 10
    let max = Math.max.apply(null, data)

    let markedBars = indices_to_compare(10)

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
        .attr('stroke-width', 3)
        .attr('id', 'yAxis')
    svg.append('line')
        .attr('x1', 0)
        .attr('y1', height)
        .attr('x2', width)
        .attr('y2', height)
        .attr('stroke', 'black')
        .attr('stroke-width', 3)
        .attr('id', 'xAxis')

    // Bars
    let interval = width / numBars / 10
    let barWidth = width / numBars / 5 * 4
    for (let i = 0; i < numBars; i++) {
        svg.append('rect')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('x', i * (interval * 2 + barWidth) + interval)
            .attr('y', y(data[i]))
            .attr('height', height - y(data[i]))
            .attr('width', barWidth)
        if (i == markedBars.random_idx || i == markedBars.other_idx) {
            svg.append('circle')
                .attr('r', barWidth / 8)
                .attr('cy', height - interval * 2)
                .attr('cx', i * (interval * 2 + barWidth) + interval + barWidth / 2)
                .attr('fill', 'black')
        }
    }
}


function build_spiral_barchart(data) {

    var start = 0,
        end = 2.25,
        numSpirals = 1.2

    let markedBars = indices_to_compare(data.length)

    var theta = function (r) {
        return numSpirals * Math.PI * r;
    };

    var r = d3.min([width, height]) / 2 - 40;
    var radius = d3.scaleLinear()
        .domain([start, end])
        .range([40, r]);

    var points = d3.range(start, end + 0.001, (end - start) / 1000);

    var spiral = d3.radialLine()
        .curve(d3.curveCardinal)
        .angle(theta)
        .radius(radius);
    var path = svg.append("path")
        .datum(points)
        .attr("id", "spiral")
        .attr("d", spiral)
        .style("fill", "none")
        .style("stroke", "none")
        .attr("transform", function (d) {
            return "translate(" + svg_width / 2 + ',' + height / 2 + ")";
        })

    var spiralLength = path.node().getTotalLength(),
        N = data.length,
        barWidth = (spiralLength / N) - 1;

    var someData = [];
    for (var i = 0; i < N; i++) {
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + i);
        someData.push({
            date: currentDate,
            value: data[i],
            group: currentDate.getMonth()
        });
    }
    var timeScale = d3.scaleTime()
        .domain(d3.extent(someData, function (d) {
            return d.date;
        }))
        .range([0, spiralLength]);

    // yScale for the bar height
    var yScale = d3.scaleLinear()
        .domain([0, 25])
        .range([0, (r / numSpirals) - 30]);

    svg.selectAll("rect")
        .data(someData)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {

            var linePer = timeScale(d.date),
                posOnLine = path.node().getPointAtLength(linePer),
                angleOnLine = path.node().getPointAtLength(linePer - barWidth);

            d.linePer = linePer; // % distance are on the spiral
            d.x = posOnLine.x; // x postion on the spiral
            d.y = posOnLine.y; // y position on the spiral

            d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position

            return d.x;
        })
        .attr("y", function (d) {
            return d.y;
        })
        .attr("width", function (d) {
            return barWidth / 1.2;
        })
        .attr("height", function (d) {
            return yScale(d.value);
        })
        .style("fill", 'none')
        .style("stroke", "black")
        .attr("transform", function (d) {
            return "translate(" + svg_width / 2 + ',' + height / 2 + "),rotate(" + d.a + "," + d.x + "," + d.y + ")";
        })

    svg.selectAll("circle")
        .data(someData)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            var linePer = timeScale(d.date) - spiralLength / N / 2 + 1,
                posOnLine = path.node().getPointAtLength(linePer),
                angleOnLine = path.node().getPointAtLength(linePer - barWidth);

            d.linePer = linePer; // % distance are on the spiral
            d.x = posOnLine.x; // x postion on the spiral
            d.y = posOnLine.y; // y position on the spiral

            d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position

            return d.x + 0;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("r", 2)
        .style("fill", function (d, i) {
            if (i == markedBars.random_idx || i == markedBars.other_idx) {
                return 'black'
            }
            return 'none'
        })
        .attr("transform", function (d) {
            return "translate(" + svg_width / 2 + ',' + height / 2 + ")";
        })
}