
function row(d) {
  return {
    planet: d.planet,
    distance: +d.distance,
    radius: +d.radius
  };
} // row()


/* Data load and visual */
/* ==================== */

d3.csv('data/planets.csv', row, function(error, data) {
  if (error) throw error;
  console.log(data);

  /* Set up */
  /* ====== */

  var margin = { top: 30, right: 50, bottom: 30, left: 0 },
      // width = 900 - margin.left - margin.right,
      // height = 600 - margin.top - margin.bottom;
      width = window.innerWidth - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  var svg = d3.select('#vis')
    .append('svg')
      .attr('width', width + margin.left + margin.top)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  /* Scales */
  /* ====== */

  var rExtent = d3.extent(data, function(d) { return d.radius; });
  
  var rScale = d3.scaleLinear().domain([0, rExtent[1]]).range([0, height * 0.75]);
  var xScale = d3.scalePoint().domain(data.map(function(el) { return el.planet; })).range([50, width * 0.975]);

  /* Build vis */
  /* ========= */

  /* Sun and planets */
  /* --------------- */

  svg.selectAll('.planet')
    .data(data).enter()
    .append('circle')
      .attr('class', 'planet')
      .attr('id', function(d) { return d.planet; })
      .attr('cx', function(d) { return xScale(d.planet); })
      .attr('cy', height / 2)
      .attr('r', function(d) { return rScale(d.radius); });

  var rSun = rScale(data.filter(function(el) { return el.planet === 'Sun'; })[0].radius); // move Sun out of the way

  d3.select('#Sun').attr('transform', 'translate(' + (-rSun * 0.9) + ', ' + '0)');

  /* Labels */
  /* ------ */

  svg.selectAll('.label')
    .data(data).enter()
    .append('text')
      .attr('class', 'label')
      .attr('id', function(d) { return 'label-' + d.planet; })
      .attr('x', function(d) { return xScale(d.planet); })
      .attr('y', height / 3)
      .attr('dx', -1)
      .attr('dy', -3)
      .text(function(d) { return d.planet; });
  
  d3.select('#label-Sun').attr('transform', 'translate(0, -120)');

  /* Lines */
  /* ------ */

  svg.selectAll('.label-line')
    .data(data).enter()
    .append('line')
      .attr('class', 'label-line')
      .attr('id', function(d) { return 'line-' + d.planet; })
      .attr('x1', function(d) { return xScale(d.planet); })
      .attr('y1', height / 3)
      .attr('x2', function(d) { return xScale(d.planet); })
      .attr('y2', function(d) { return height / 2 - rScale(d.radius) - 4; });
  
  d3.select('#line-Sun').remove();

  /* Note */
  /* ---- */

  svg.append('text')
      .attr('id', 'note')
      .attr('x', width + margin.right / 4)
      .attr('y', height + margin.bottom / 2)
      .attr('text-anchor', 'end')
      .text('sizes scaled - distances not');

}); // d3.csv()

