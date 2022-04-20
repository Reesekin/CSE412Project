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
