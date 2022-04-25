var selectedArc;

async function selectCountry(){
    var cname = document.getElementById("autoComplete").value;
    var cselector = await d3.selectAll("#countryholder");
    console.log(cname);
    var result = await fetchJSON(`search?cname=${cname}`);
    if(result == null){
        alert("Country not found");
    }
    else {
        d3.select("#searchcname").text(result[0].cname);
        d3.select("#cflag").attr("src", `flags/${result[0].countrykey}.png`);
        await cselector.selectAll("#select-flag").attr("src", `flags/${result[0].countrykey}.png`);
        await cselector.selectAll("#select-region").text(`Region: ${result[0].rname}`);
        await cselector.selectAll("#select-title").text(result[0].cname);
        await cselector.selectAll("#select-population").text(`Population (in thousands): ${result[0].popnumber}`);
        await cselector.selectAll("#select-growthrate").text(`Population growth rate (average annual %): ${result[0].popgrowthrate}%`);
        await cselector.selectAll("#select-popdensity").text(`Population density (per km²): ${result[0].density}`);
        await cselector.selectAll("#select-SA").text(`Surface area: ${result[0].surfacearea} km²`);
        await cselector.selectAll("#select-sexratio").text(`Sex ratio (m per 100 f, 2017): ${result[0].sexratio}`);
        await cselector.selectAll("#select-urbanpop").text(`Urban population (% of total population): ${result[0].urbanpop}%`);
        await cselector.selectAll("#select-urbangrowthrate").text(`Urban population (% of total population): ${result[0].urbanpopgrowthrate}%`);
    }
    
    // dataset.filter(function(d){
    //     return d.cname == cname;
    // }
}

async function barSelect(e, ckey){
    //transform tooltip position
    var data = dataset;
    await tooltip.attr("style", `top: ${e.pageY}px; left: ${e.pageX+20}px; visibility: visible;`);
    var dat = data.filter(function(d){
        return (d.countrykey == ckey);
    });
    dat = dat[0];
    console.log(dat);
    await tooltip.selectAll("#tooltip-flag").attr("src", `flags/${dat.countrykey}.png`);
    await tooltip.selectAll("#tooltip-title").text(dat.cname);
    await tooltip.selectAll("#tooltip-population").text(`Population (in thousands): ${dat.popnumber}`);
    await tooltip.selectAll("#tooltip-growthrate").text(`Population growth rate (average annual %): ${dat.popgrowthrate}%`);
    await tooltip.selectAll("#tooltip-popdensity").text(`Population density (per km²): ${dat.density}`);
    await tooltip.selectAll("#tooltip-SA").text(`Surface area: ${dat.surfacearea} km²`);
    await tooltip.selectAll("#tooltip-sexratio").text(`Sex ratio (m per 100 f, 2017): ${dat.sexratio}`);
    await tooltip.selectAll("#tooltip-urbanpop").text(`Urban population (% of total population): ${dat.urbanpop}%`);
    await tooltip.selectAll("#tooltip-urbangrowthrate").text(`Urban population (% of total population): ${dat.urbanpopgrowthrate}%`);
}
async function hide(e){
    await tooltip.attr("style", `top: ${e.pageY}px; left: ${e.pageX+20}px; visibility: hidden;`);
}

async function arcSelect(arc){
    setTimeout(async function(){
    await d3.selectAll("use").attr("xlink:href", `#rlabel${arc}`);
    var clist = await d3.selectAll("#clist");
    d3.selectAll("#clist").selectAll("*").remove();
    var countries = await fetchJSON(`query?regionkey=${rsum[arc].regionkey}`);
    console.log(countries)
    clist.innerHTML = '';
    countries.forEach(function(d){
        var li = clist.append("li");
        li.append('img').attr("src", `flags/${d.countrykey}.png`).classed("flag", true);
        li.append('span').text(`${d.cname}, ${d.surfacearea} km²`);
    });
    selectedArc = d3.select(`#rlabel${arc}`);
    }, 100);
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
    var svg = d3.select("#population"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    xScale.domain(data.map(function(d) { return d.cname; }));
    yScale.domain([0, d3.max(data, function(d) { return d.popnumber; })]);
    console.log(data.forEach(function(d){console.log(d.cname, d.popnumber);}));
    console.log("max: " + d3.max(data, function(d) { return d.popnumber; }));
    g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

    g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function(d){
                return d;
            }).ticks(10))
            .append("text")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")

    g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("id", function(d, i){return `bar${i}`;})
            .attr("x", function(d) { return xScale(d.cname); })
            .attr("y", function(d) {return yScale(d.popnumber) - height + 400; })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {return height - yScale(d.popnumber); })
            .attr("onmousemove", function(d) {console.log(d.countrykey); return `barSelect(event, "${d.countrykey}")` })
            .attr("onmouseout", "hide(event)")

    svg.append('text')
        .attr('x', -(height / 4) - margin)
        .attr('y', margin / 5)
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
        .attr('x', width / 2)
        .attr('y', 50)
        .attr('text-anchor', 'start')
        .text('Top 10 Population in Countries')
}

async function drawScatter(){
    var svg = d3.select("#scatterplot"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;
}