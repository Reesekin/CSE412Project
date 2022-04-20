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
        .attr("onmouseover", function(d, i) {return `(function(){d3.selectAll("use").attr("xlink:href", "#rlabel${i}")})()`})
        .attr("d", arc);

    arcs.append("text")
        .classed("rlabel", true)
        .attr("text-anchor", "middle")
        .attr("id", function(d, i) {return "rlabel" + i;})
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";  })
        .text(function(d) {
            return `${d.data.rname}\n${d.data.percentage}%`;
        });
    d3.select(".piechart")
    .append("use")
    .attr("xlink:href", "0");
}

async function drawBar(){
    var data = dataset;
    var svg = d3.select("#population"),
        width = svg.attr("width"),
        height = svg.attr("height"),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y)
        .ticks(10);

    x.domain(data.map(function(d) { return d.country; }));
    y.domain([0, d3.max(data, function(d) { return d.population; })]);

    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    g.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Population");

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.country); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.population); })
        .attr("height", function(d) { return height - y(d.population); });
}