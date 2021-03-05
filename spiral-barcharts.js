// file:///C:/Users/imoge/OneDrive/Documents/GitHub/03-experiment/index.html

// TODO incorporate data
// TODO dots.csv
// TODO dots on spiral bars

d3.csv("https://raw.githubusercontent.com/mastlouis/03-experiment/Pie-Charts/data.csv", function (data) {
  var width = 500,
    height = 500,
    start = 0,
    end = 2.25,
    numSpirals = 1.2,
    margin = { top: 50, bottom: 50, left: 50, right: 50 };
  let row = 0

  d3.csv("https://raw.githubusercontent.com/mastlouis/03-experiment/Bar-Charts/dots.csv", function (dots) {
    let markedBar1 = dots[row][0]
    let markedBar2 = dots[row][1]

    var theta = function (r) {
      return numSpirals * Math.PI * r;
    };

    // used to assign nodes color by group
    var r = d3.min([width, height]) / 2 - 40;

    var radius = d3.scaleLinear()
      .domain([start, end])
      .range([40, r]);

    var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

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
      .style("stroke", "none");

    var spiralLength = path.node().getTotalLength(),
      N = 20,
      barWidth = (spiralLength / N) - 1;

    var someData = [];
    for (var i = 0; i < N; i++) {
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + i);
      someData.push({
        date: currentDate,
        value: data[row][i],
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
      .domain([0, d3.max(someData, function (d) {
        return d.value;
      })])
      .range([0, (r / numSpirals) - 30]);

    // for (let i = 0; i < N; i++) {
    //   // d = data[row]
    //   svg.append('rect')

    //     .attr("x", function (d, i) {
    //       d = data[row]
    //       // currentDate.setDate(currentDate.getDate() + i);
    //       var linePer = timeScale(currentDate.setDate(currentDate.getDate() + i)),
    //         posOnLine = path.node().getPointAtLength(linePer),
    //         angleOnLine = path.node().getPointAtLength(linePer - barWidth);

    //       d.linePer = linePer; // % distance are on the spiral
    //       d.x = posOnLine.x; // x postion on the spiral
    //       d.y = posOnLine.y; // y position on the spiral

    //       d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position

    //       return d.x;
    //     })
    //     .attr("y", function (d) {
    //       d = data[row]
    //       return d.y;
    //     })
    //     .attr("width", function (d) {
    //       d = data[row]
    //       return barWidth;
    //     })
    //     .attr("height", function (d) {
    //       d = data[row]
    //       console
    //       return yScale(d[i]);
    //     })
    //     .style("fill", 'none')
    //     .style("stroke", "black")
    //     .attr("transform", function (d) {
    //       d = data[row]
    //       return "rotate(" + d.a + "," + d.x + "," + d.y + ")"; // rotate the bar
    //     });

    // }
    // svg.selectAll("rect")
    //   .data(someData)
    //   .enter()
    //   .append("rect")
    //   .attr("x", function (d, i) {

    //     var linePer = timeScale(currentDate.setDate(currentDate.getDate() + i)),
    //       posOnLine = path.node().getPointAtLength(linePer),
    //       angleOnLine = path.node().getPointAtLength(linePer - barWidth);

    //     d.linePer = linePer; // % distance are on the spiral
    //     d.x = posOnLine.x; // x postion on the spiral
    //     d.y = posOnLine.y; // y position on the spiral
    //     d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position

    //     return d.x;
    //   })
    //   .attr("y", function (d) {
    //     return d.y;
    //   })
    //   .attr("width", function (d) {
    //     return barWidth;
    //   })
    //   .attr("height", function (d, i) {
    //     return yScale(d[i]);
    //   })
    //   .style("fill", 'none')
    //   .style("stroke", "black")
    //   .attr("transform", function (d) {
    //     return "rotate(" + d.a + "," + d.x + "," + d.y + ")"; // rotate the bar
    //   });
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
        return barWidth/2;
      })
      .attr("height", function (d) {
        return yScale(d.value)/2;
      })
      .style("fill", 'none')
      .style("stroke", "black")
      .attr("transform", function (d) {
        return "rotate(" + d.a + "," + d.x + "," + d.y + ")"; // rotate the bar
      });

    var tooltip = d3.select("#chart")
      .append('div')
      .attr('class', 'tooltip');

    tooltip.append('div')
      .attr('class', 'date');
    tooltip.append('div')
      .attr('class', 'value');

  })
})