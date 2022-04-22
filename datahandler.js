var dataset;
var rsum, population;

//fetch data from json page and return it
async function fetchJSON(page){
    var d;
    await $.getJSON(page, async function(data){
        d = data;
    }).fail(function(){
        console.log("An error has occurred.");
    });
    return d;
}


document.addEventListener('DOMContentLoaded', async() => {
    dataset = await fetchJSON("data.json");
    rsum = await fetchJSON("rsum.json");
    population = await fetchJSON("population.json");
    await drawPieChart();
    await drawBarGraph();
    await drawBar();
});