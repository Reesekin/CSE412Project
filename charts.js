var selectedArc;

async function arcSelect(arc){
    await d3.selectAll("use").attr("xlink:href", `#rlabel${arc}`);
    selectedArc = d3.select(`#rlabel${arc}`);
    console.log(selectedArc);
}

async function drawPieChart(){
    var data = rsum;
    var tots = d3.sum(data, function(d){return d.surfacearea;});
    data.forEach(function(d){ d.percentage = (d.surfacearea*100/tots).toFixed(2); });
    var svg = d3.select("#rsum"),
        width = svg.attr("width"),
        height = svg.attr("height"),
        radius = Math.min(width, height) / 2,
        g = svg.append("g")
        .classed("piechart", true)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal([
        "#00cdf3",
        "#ff6a00",
        "#005bcd",
        "#00bc00",
        "#7000a4",
        "#00ffce",
        "#d2003f",
        "#00ebb5",
        "#7d0000",
        "#00a3ff",
        "#c89c00",
        "#004779",
        "#ffa859",
        "#005889",
        "#ce9443",
        "#95e2ff",
        "#190f14",
        "#ffc992",
        "#091c00",
        "#ef6e8f",
        "#1dc2a5",
        "#4c6800"
    ]);

    var pie = d3.pie().value(function(d) { return d.surfacearea; });

    var arc = d3.arc()
                .innerRadius(100)
                .outerRadius(radius);

    var arcs = g.selectAll("arc")
                .data(pie(data))
                .enter()
                .append("g")
                .classed("arc", true);

    arcs.append("path")
        .classed("arc", true)
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("onmouseover", function(d, i) {return `arcSelect(${i})`;})
        .attr("onclick", function(d, i) {return `arcSelect(${i})`;})
        .attr("d", arc);

    arcs.append("text")
        .classed("rlabel", true)
        .attr("text-anchor", "middle")
        .attr("id", function(d, i) {return "rlabel" + i;})
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";  })
        .text(function(d) {
            return `${d.data.rname}`;
        });
    arcs.selectAll("text")
    .append("tspan")
    .attr("x", "0")
    .attr("dy", "1.2em")
    .text(function(d) {
        return `${d.data.percentage}%`;
    })
    arcs.selectAll("text")
    .append("tspan")
    .attr("x", "0")
    .attr("dy", "1.2em")
    .text(function(d) {
        return `${d.data.surfacearea} km²`;
    })
    d3.select(".piechart")
    .append("use")
    .attr("xlink:href", "0");
}

async function drawBarGraph(){
    var data = population;

    var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    xScale.domain(data.map(function(d) { return d.cname; }));
    yScale.domain([0, d3.max(data, function(d) { return d.popnumber; })]);

    g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale));

    g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return "$" + d;
         }).ticks(10))
         .append("text")
         .attr("y", 6)
         .attr("dy", "0.71em")
         .attr("text-anchor", "end")
         .text("value");

    g.selectAll(".bar")
         .data(data)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.cname); })
         .attr("y", function(d) { return yScale(d.popnumber); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { return height - yScale(d.popnumber); });



    svg.append('text')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Total Population Number(Thousands)')

    svg.append('text')
      .attr('class', 'label')
      .attr('x', width / 2 + margin)
      .attr('y', height + margin * 1.7)
      .attr('text-anchor', 'middle')
      .text('Countries')

    svg.append('text')
      .attr('class', 'title')
      .attr('x', width / 2 + margin)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text('Population in Countries')
}
