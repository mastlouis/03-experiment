
var margin = { top: 20, right: window.innerWidth / 10, bottom: 80, left: window.innerWidth / 10 },
  width = window.innerWidth - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

d3.csv("https://raw.githubusercontent.com/mastlouis/03-experiment/Pie-Charts/data.csv", function (data) {
  let numBars = 10
  let row = 1
  let max = 25

  d3.csv("https://raw.githubusercontent.com/mastlouis/03-experiment/Bar-Charts/dots.csv", function (dots) {
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
  })
})
